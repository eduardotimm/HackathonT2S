# src/main.py
import os
import sys
import json # Usaremos para pretty-print do resultado da IA
from src.analyzer import analisar_projeto
from src.rater import executar_avaliacao_completa 
from src.reporter import salvar_relatorio, gerar_relatorio_md

# --- DADOS DE ENTRADA E CONFIGURAÇÃO ---
MEU_TOKEN_GITHUB = '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' 
GOOGLE_API_KEY ='AIzaSyDF7SRy6wemtyV8CBzv0amkd4LQARXDRUs' 
NOME_ARQUIVO_SAIDA = "relatorio_de_analise.md"

def orquestrar_analise_completa(fonte_alvo:str):
    """
    Orquestra o fluxo completo de forma genérica e escalável.
    """
    print(f"🤖 --- Lu.AI iniciando análise completa para: {fonte_alvo} --- 🤖")

    # 1. ANALYZER: Coleta todas as métricas brutas necessárias de uma vez.
    metricas_brutas = analisar_projeto(fonte_alvo, MEU_TOKEN_GITHUB)
    if not metricas_brutas:
        print(json.dumps({"sucesso": False, "erro": "O Analyzer não conseguiu coletar as métricas."}))
        return

    # 2. RATER: Executa a avaliação completa usando o prompt mestre.
    lista_de_avaliacoes = executar_avaliacao_completa(metricas_brutas)
    if not lista_de_avaliacoes:
        print(json.dumps({"sucesso": False, "erro": "O Rater não retornou uma avaliação válida da IA."}))
        return
    
    pontuacao_total = sum(av.get('nota', 0) for av in lista_de_avaliacoes)
    media_final = pontuacao_total / len(lista_de_avaliacoes) if lista_de_avaliacoes else 0

    #Montagem do JSON a ser enviado
    resultado_json = {
        "sucesso" : True,
        "projeto_analisado":fonte_alvo.split('/')[-1],
        "pontuacao_media": round(media_final,1),
        "avaliacoes_detalhadas": lista_de_avaliacoes
    }

    # Para depuração, podemos ver o resultado JSON que recebemos da IA
    print(json.dumps(resultado_json, indent=2, ensure_ascii=False))

    try:
        resumo = [f"# Análise do Projeto: {fonte_alvo.split('/')[-1]}", f"**Pontuação Média Final: {media_final:.1f}/100**\n"]
        observacoes = []
        for avaliacao in lista_de_avaliacoes:
            observacoes.append(f"## {avaliacao.get('criterio')} - Nota: {avaliacao.get('nota')}/100")
            observacoes.append(avaliacao.get('justificativa'))
            observacoes.append("\n---")
        
        relatorio_md = gerar_relatorio_md(resumo + observacoes)
        salvar_relatorio(relatorio_md, f"relatorio_{fonte_alvo.split('/')[-1]}.md")
        print(f"✅ Relatório em Markdown também foi salvo.", file=sys.stderr)
    except Exception as e:
        print(f"AVISO: Falha ao gerar relatório .md opcional: {e}", file=sys.stderr)


if __name__ == "__main__":
    # 1. Verifica se as chaves de API estão configuradas
    if not MEU_TOKEN_GITHUB or not GOOGLE_API_KEY:
        print(json.dumps({"sucesso": False, "erro": "As variáveis de ambiente GITHUB_PAT e/ou GOOGLE_API_KEY não foram encontradas."}))
        sys.exit(1) # Encerra o script com um código de erro

    # 2. Verifica se a fonte do projeto (URL ou path) foi passada como argumento
    # sys.argv é a lista de argumentos da linha de comando. O primeiro é o nome do script.
    if len(sys.argv) < 2:
        print(json.dumps({"sucesso": False, "erro": "Nenhuma fonte de projeto (URL ou caminho local) foi fornecida como argumento."}))
        sys.exit(1)
        
    fonte_do_projeto = sys.argv[1]
    
    # 3. Executa a orquestração
    orquestrar_analise_completa(fonte_do_projeto)