# src/analyzer.py
import os
import base64
import requests
from urllib.parse import urlparse

# --- Funções Auxiliares ---
def _extrair_repo(url: str) -> tuple:
    caminho = urlparse(url).path
    partes = caminho.strip('/').split('/')
    if len(partes) >= 2:
        return partes[0], partes[1]
    return None, None

def _contar_arquivos_de_teste(lista_de_arquivos: list) -> int:
    count = 0
    padroes_de_teste = ['test', '.spec.', '/tests/', '/spec/']
    for arquivo in lista_de_arquivos:
        if any(padrao in arquivo.lower() for padrao in padroes_de_teste):
            count += 1
    return count

# --- Funções de Análise (Remota vs. Local) ---

def _analisar_remoto_pela_api_github(repo_url: str, github_token: str) -> dict:
    owner, repo = _extrair_repo(repo_url)
    if not owner or not repo: return {}
    headers = {'Authorization': f'token {github_token}', 'Accept': 'application/vnd.github.v3+json'}
    metricas_brutas = {}
    lista_de_arquivos = []

    # Tenta o branch 'main' primeiro, depois 'master'
    for branch in ['main', 'master']:
        tree_url = f"https://api.github.com/repos/{owner}/{repo}/git/trees/{branch}?recursive=1"
        try:
            print(f"   - [Analyzer] Buscando árvore de arquivos no branch '{branch}'...")
            response = requests.get(tree_url, headers=headers, timeout=20)
            response.raise_for_status()
            dados_tree = response.json()
            lista_de_arquivos = [item['path'] for item in dados_tree['tree'] if item['type'] == 'blob']
            print(f"   - [Analyzer] {len(lista_de_arquivos)} arquivos encontrados.")
            break # Se encontrou, sai do loop
        except requests.exceptions.HTTPError as http_err:
            if http_err.response.status_code == 404:
                print(f"   - [Analyzer] AVISO: Branch '{branch}' não encontrado.")
                continue # Tenta o próximo branch
            else:
                print(f"   - [Analyzer] ERRO CRÍTICO HTTP: {http_err}")
                return {}
        except (requests.exceptions.RequestException, KeyError) as e:
            print(f"   - [Analyzer] ERRO CRÍTICO ao buscar árvore de arquivos: {e}")
            return {}
    
    if not lista_de_arquivos:
        print("   - [Analyzer] ERRO CRÍTICO: Não foi possível encontrar uma árvore de arquivos válida ('main' ou 'master').")
        return {}
    
    metricas_brutas['total_arquivos'] = len(lista_de_arquivos)
    metricas_brutas['contagem_testes'] = _contar_arquivos_de_teste(lista_de_arquivos)

    readme_path = next((path for path in lista_de_arquivos if path.lower().startswith('readme')), None)
    metricas_brutas['conteudo_readme'] = ""
    if readme_path:
        content_url = f"https://api.github.com/repos/{owner}/{repo}/contents/{readme_path}"
        try:
            response = requests.get(content_url, headers=headers, timeout=10)
            response.raise_for_status()
            conteudo_codificado = response.json().get('content', '')
            metricas_brutas['conteudo_readme'] = base64.b64decode(conteudo_codificado).decode('utf-8')
        except Exception as e:
            print(f"   - [Analyzer] AVISO: Não foi possível ler o README via API: {e}")
            
    return metricas_brutas

def _analisar_pasta_local(caminho_projeto: str) -> dict:
    lista_de_arquivos = []
    pastas_a_ignorar = {'.git', 'venv', '.venv', '__pycache__', 'node_modules'}

    for root, dirs, files in os.walk(caminho_projeto):
        dirs[:] = [d for d in dirs if d not in pastas_a_ignorar]
        for file in files:
            caminho_completo = os.path.join(root, file)
            caminho_relativo = os.path.relpath(caminho_completo, caminho_projeto).replace('\\', '/')
            lista_de_arquivos.append(caminho_relativo)
    
    if not lista_de_arquivos: return {}
        
    metricas_brutas = {
        'total_arquivos': len(lista_de_arquivos),
        'contagem_testes': _contar_arquivos_de_teste(lista_de_arquivos)
    }

    readme_path = next((path for path in lista_de_arquivos if path.lower().startswith('readme')), None)
    metricas_brutas['conteudo_readme'] = ""
    if readme_path:
        try:
            with open(os.path.join(caminho_projeto, readme_path), 'r', encoding='utf-8') as f:
                metricas_brutas['conteudo_readme'] = f.read()
        except Exception as e:
            print(f"   - [Analyzer] AVISO: Não foi possível ler o arquivo README local: {e}")
            
    return metricas_brutas

# --- NOVA FUNÇÃO MESTRE DO ANALYZER ---
def analisar_projeto(fonte: str, github_token: str = None) -> dict:
    if fonte.startswith('http'):
        print(f"   - [Analyzer] Fonte remota detectada: {fonte}")
        if not github_token:
            print("   - [Analyzer] ERRO: Token do GitHub é necessário para análise remota.")
            return {}
        return _analisar_remoto_pela_api_github(fonte, github_token)
    else:
        print(f"   - [Analyzer] Fonte local detectada: {fonte}")
        if not os.path.isdir(fonte):
            print(f"   - [Analyzer] ERRO: O caminho '{fonte}' não é um diretório válido.")
            return {}
        return _analisar_pasta_local(fonte)

# --- Bloco de Teste ATUALIZADO ---
if __name__ == '__main__':
    # --- Teste 1: Análise Remota ---
    GITHUB_PAT = "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"
    URL_TESTE = "https://github.com/smogon/pokemon-showdown"
    print(f"--- 1. Testando Análise Remota para: {URL_TESTE} ---")
    if GITHUB_PAT:
        metricas_remotas = analisar_projeto(URL_TESTE, github_token=GITHUB_PAT)
        if metricas_remotas:
            print("   - ✅ Sucesso! Métricas remotas extraídas.")
    else:
        print("   - AVISO: Pular teste remoto. GITHUB_PAT não configurado.")

    # --- Teste 2: Análise Local ---
    CAMINHO_LOCAL_TESTE = "C:/temp/pokemon-showdown-local" 
    print(f"\n--- 2. Testando Análise Local para: {CAMINHO_LOCAL_TESTE} ---")
    if os.path.isdir(CAMINHO_LOCAL_TESTE):
        metricas_locais = analisar_projeto(CAMINHO_LOCAL_TESTE)
        if metricas_locais:
            print("   - ✅ Sucesso! Métricas locais extraídas.")
            print(f"      - Total de Arquivos: {metricas_locais.get('total_arquivos')}")
            print(f"      - Contagem de Testes: {metricas_locais.get('contagem_testes')}")
    else:
        print(f"   - AVISO: Pular teste local. O diretório '{CAMINHO_LOCAL_TESTE}' não foi encontrado.")