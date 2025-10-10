# src/main.py
import os
import sys
import json
from flask import Flask, request, jsonify
from analyzer import analisar_projeto
from rater import executar_avaliacao_completa 
from reporter import salvar_relatorio, gerar_relatorio_md

def orquestrar_analise_completa(fonte_alvo: str, github_token: str, google_api_key: str):
    """
    Orquestra o fluxo completo de forma genérica e escalável.
    Agora recebe os tokens como parâmetros.
    """
    print(f"🤖 --- [Python API] Iniciando análise para: {fonte_alvo} --- 🤖", file=sys.stderr)

    # 1. ANALYZER: Coleta todas as métricas brutas necessárias de uma vez.
    metricas_brutas = analisar_projeto(fonte_alvo, github_token)
    if not metricas_brutas:
        return {"sucesso": False, "erro": "O Analyzer não conseguiu coletar as métricas."}

    # 2. RATER: Executa a avaliação completa usando o prompt mestre.
    lista_de_avaliacoes = executar_avaliacao_completa(metricas_brutas)
    if not lista_de_avaliacoes:
        return {"sucesso": False, "erro": "O Rater não retornou uma avaliação válida da IA."}
    
    pontuacao_total = sum(av.get('nota', 0) for av in lista_de_avaliacoes)
    media_final = pontuacao_total / len(lista_de_avaliacoes) if lista_de_avaliacoes else 0

    #Montagem do JSON a ser enviado
    resultado_json = {
        "sucesso" : True,
        "projeto_analisado":fonte_alvo.split('/')[-1],
        "pontuacao_media": round(media_final,1),
        "avaliacoes_detalhadas": lista_de_avaliacoes
    }

    # Imprime o resultado no console do servidor Python para depuração
    print(f"--- [Python API] Resultado da Análise ---\n{json.dumps(resultado_json, indent=2, ensure_ascii=False)}\n--- Fim da Análise ---", file=sys.stderr)

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
    
    return resultado_json

app = Flask(__name__)

@app.route('/analyze', methods=['POST'])
def analyze_endpoint():
    data = request.get_json()
    if not data:
        return jsonify({"sucesso": False, "erro": "Corpo da requisição inválido ou vazio."}), 400

    source_url = data.get('source')
    github_token = data.get('github_token')
    google_api_key = data.get('google_api_key')

    if not all([source_url, github_token, google_api_key]):
        return jsonify({"sucesso": False, "erro": "Parâmetros 'source', 'github_token' e 'google_api_key' são obrigatórios."}), 400

    try:
        resultado = orquestrar_analise_completa(source_url, github_token, google_api_key)
        if not resultado.get("sucesso"):
            return jsonify(resultado), 500 # Retorna erro 500 se a análise falhou
        return jsonify(resultado), 200 # Retorna 200 apenas em caso de sucesso
    except Exception as e:
        print(f"ERRO INESPERADO NA API: {e}", file=sys.stderr)
        return jsonify({"sucesso": False, "erro": "Ocorreu um erro interno no servidor de análise."}), 500

if __name__ == "__main__":
    # Inicia o servidor Flask.
    # host='0.0.0.0' torna a API acessível a partir do seu .NET backend.
    # A porta 5001 é uma boa escolha para não conflitar com outras aplicações.
    app.run(host='0.0.0.0', port=5001, debug=True)