# src/rater.py
import os
import json
import google.generativeai as genai

# print(f"[Debug Chave] Chave de API que o Python está lendo: {os.getenv('GOOGLE_API_KEY')}")
# !!! ATENÇÃO: COLOQUE SUA CHAVE DE API AQUI DENTRO DAS ASPAS !!!
MINHA_CHAVE_DIRETA = "AIzaSyDF7SRy6wemtyV8CBzv0amkd4LQARXDRUs"

# Verificação para garantir que a chave foi inserida
if not MINHA_CHAVE_DIRETA or "SUA_CHAVE" in MINHA_CHAVE_DIRETA:
    print(
        "\n!!! ERRO DE CONFIGURAÇÃO: Você precisa colocar sua chave de API real na variável MINHA_CHAVE_DIRETA no arquivo rater.py !!!\n"
    )
    # Limpamos a chave para não tentar usar uma chave inválida
    GOOGLE_API_KEY = None
else:
    genai.configure(api_key=MINHA_CHAVE_DIRETA)
    GOOGLE_API_KEY = (
        MINHA_CHAVE_DIRETA  # Mantemos a variável para o resto do código funcionar
    )
    
# --- Funções de IA ---
def executar_avaliacao_completa(metricas_brutas: dict) -> list:
    """
    Recebe as métricas brutas do analyzer e monta um prompt baseado no desafio proposto
    Usa o Gemini para gerar uma justificativa textual para uma nota.
    retorna uma lista de avaliações.
    """
    if not GOOGLE_API_KEY:
        return []
    
    readme_preview = metricas_brutas.get('conteudo_readme','')[:4000]
    try:
        model = genai.GenerativeModel("gemini-2.5-pro")

        prompt = f"""
        ## FUNÇÃO E OBJETIVO
        Você é especialista em arquitetura, engenharia e qualidade de Software, pragmático e técnico da empresa de Software T2S Labs. Seu objetivo é analisar aplicações e prover um arquivo JSON bem estruturado contendo avaliações e um feedback 'insightful' educacional e profundo. Sua revisão deve ser severa, referenciando os dados específicos para justificar suas conclusões. Seja Direto, justo e claro e sempre gere um feedback construtivo. 
        ## CONTEXTO
        Você estará avaliando um projeto com as seguintes métricas:
        - Total de Arquivos:{metricas_brutas.get('total_arquivos',0)}
        - Arquivos de Teste encontrados:{metricas_brutas.get('contagem_testes',0)}
        - Conteúdo README.md (primeiros 4000 caracteres):"{readme_preview}"
        
        ## SUA TAREFA
        Você estará avaliando os projetos de acordo com esses 2 critérios principais de 0 a 100 tendo a pontuação igualmente distribuida entre eles, cuja soma deverá ser a nota final do projeto.
        1. Qualidade de Engenharia de Software:
            - Adequação Funcional: Análise do README.md e da estrutura do
            projeto para verificar a coerência entre o que foi proposto e o que
            parece ter sido implementado.
            - Manutenibilidade: Avaliação da clareza do código, uso de
            comentários, padronização (linters) e complexidade do código.
            -Confiabilidade: Verificação da existência de suítes de testes (ex:
            arquivos de teste, frameworks como Jest, PyTest, etc.).
            - Usabilidade (Clareza): Análise da qualidade e completude da
            documentação (README.md, guias de instalação, etc.).
            - Desempenho: Análise da velocidade de execução e do consumo de
            recursos computacionais.
        2. Qualidade de Aplicação de IA:
            - Origem e Tratamento dos Dados: Análise sobre como a IA é
            alimentada (fonte de dados, pré-processamento).
            - Técnicas Aplicadas: Identificação das técnicas de IA utilizadas (ex:
            engenharia de prompt, RAG, fine-tuning).
            - Estratégia de Validação e Escolha de Modelos: Verificação se há
            justificativa para a escolha do LLM e como a solução é validada.
            - Métricas de Avaliação, Custo e Desempenho: Análise de como a
            equipe mede o sucesso de sua IA e considerações sobre
            custo/eficiência.
            - Segurança e Governança: Avaliação de riscos (injeção de prompt) e
            implementação de mecanismos de segurança (guardrails).
        Escreva de forma profissional, e construtiva uma justificativa para essa pontuação. comece com um emoji apropriado: (🏆, ✅, ⚠️, ❌, 🚨).
        Não é necessário a presença de formalidades, como apresentações. Sua analise irá para um relatório então seja direto em suas respotas. Avalie o projeto, levantes seus pontos fortes e fracos. Gere suas notas e justificativas e pronto.
        Se atente também para seguir a numeração dos tópicos de forma correta.

        ## RETORNOS
        - Sua resposta completa DEVE ser um array JSON válido (uma lista de objetos) e NADA MAIS.
        - Não inclua marcadores de markdown como ```json ou ```.
        - Cada objeto no array DEVE ter exatamente 3 chaves, todas em minúsculas: "criterio" (string), "nota" (integer), e "justificativa" (string).
        - As respostas devem estar em pt-br
        - O json deve conter SOMENTE os dois critérios citados, Qualidade de Engenharia de Software e Qualidade de Aplicação de IA.
        - A justificativa deve conter uma breve explicação sobre cada um dos subcritérios, e por que recebeu a nota.

        ATENÇÃO caso um dos pontos não esteja presente na avaliação, aponte o que está faltando, mostre os malefícios dessa ausência e as razões pela qual ela DEVE ser implementada.

        ## Seu Cliente
        Sua análise será recebida por desenvolvedores recrutadores, buscando por talentos no mercado de trabalho através de um hackathon
        """
        response = model.generate_content(prompt)
        #Limpeza da String JSON
        cleaned_response = response.text.strip().replace("```json","").replace("```","")

        #Decodifica a string JSON em uma estrutura de dados Python
        return json.loads(cleaned_response)
    
    except Exception as e:
        print(f"   - [IA] ERRO ao chamar a API do Gemini: {e}")
        return "Falha ao gerar a justificativa da IA."


# --- Funções de Cálculo de Nota ---
def calcular_nota_de_testes(metricas_brutas: dict) -> int:
    contagem_testes = metricas_brutas.get("contagem_testes", 0)
    total_arquivos = metricas_brutas.get("total_arquivos", 0)
    if total_arquivos == 0:
        return 0
    percentual_de_testes = (contagem_testes / total_arquivos) * 100
    meta_percentual_excelente = 30.0
    nota = int(min(100, (percentual_de_testes / meta_percentual_excelente) * 100))
    return nota


# --- Bloco de Teste ATUALIZADO ---
if __name__ == '__main__':
    print("--- Testando Rater Multi-Critério com IA ---")

    if not GOOGLE_API_KEY:
        print("Execução de teste interrompida. Configure a GOOGLE_API_KEY primeiro.")
    else:
        # Simula a saída do analyzer para o repositório 'Flask'
        metricas_de_teste = {
            'total_arquivos': 326, 
            'contagem_testes': 89, 
            'conteudo_readme': "# Flask\n\nFlask is a lightweight WSGI web application framework. It is designed to make getting started quick and easy, with the ability to scale up to complex applications..."
        }
        
        print(f"Métricas de Teste (Simuladas): {metricas_de_teste.get('contagem_testes')} testes em {metricas_de_teste.get('total_arquivos')} arquivos.\n")

        avaliacoes_ia = executar_avaliacao_completa(metricas_de_teste)
    
        if avaliacoes_ia:
            print("✅ Sucesso! IA retornou as seguintes avaliações estruturadas:")
            # Imprime o JSON de forma legível
            print(json.dumps(avaliacoes_ia, indent=2, ensure_ascii=False))
        else:
            print("\n❌ Falha ao obter a avaliação da IA.")
