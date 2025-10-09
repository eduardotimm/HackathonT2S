from datetime import datetime 
import pytz #Lib para lidar com fusos horários (se necessário)

def gerar_relatorio_md(observacoes: list)-> str:
    """
    Formata uma lista de observaçoes em um relatório MD completo.

    Args:
    observacoes(list): A lista de strings gerada pelo rater.py

    Returns:
    str: Uma única string contendo o relatório completo em Markdown.
    """

    #Definie o fuso horário de SP
    fuso_horario = pytz.timezone('America/Sao_Paulo')

    #Usa a data e hora atual no fuso horário correto
    timestamp = datetime.now(fuso_horario).strftime("%d/%m/%Y às %H:%M:%S")

    #Inicia a construção do relatório com o título principal
    partes_relatorio = [
        "#📈 Relatório de Análise de Código",
        "---",
        "## 📊 Observações Geradas\n"
    ]

    #Adiciona cada obs da lista como um item de bullet point
    for obs in observacoes:
        partes_relatorio.append(f"- {obs}")

    #Adiciona a linha final com a data de geração
    partes_relatorio.append("\n---")
    partes_relatorio.append(f"*Relatório gerado automaticamente em: {timestamp}*")

    #Junta todas as partes em uma string
    return "\n".join(partes_relatorio)

def salvar_relatorio(relatorio: str,nome_arquivo: str) -> bool:
    """
    Salva uma string de relatório em um arquivo de texto, nesse caso: .md.

    Args: 
    relatorio(str) O conteúdo completo do relatório a ser salvo.
    nome_arquivo(str): O nome do arquivo a ser criado (ex: "report.md").

    Returns:
    bool: True se o arquivo foi salvo com sucesso, Flase caso contrário.
    """

    try:
        with open(nome_arquivo,'w', encoding='utf-8') as f:
            f.write(relatorio)
        print(f" - [Reporter] Relatório salvo com sucesso em '{nome_arquivo}'")
        return True
    
    except IOError as e:
        print(f" - [Reporter] ERRO CRÍTICO ao salvar o arquivo: {e}")
        return False


#--- Testes ---
if __name__ == '__main__':
    print("--- Executando teste do reporter..py ---")

    #Lista de observações de exemplo (simulando a saída do rater.py)
    obs_exemplo = [
        "✅ Qualidade do Código: Excelente. A estrutura do código é clara, sólida e bem organizada. Parabéns!",
        "❌ Documentação do Código: Insuficiente. A falta de documentação torna o código difícil de entender."
    ]

    report_final = gerar_relatorio_md(obs_exemplo)

    print("\n--- INÍCIO DO RELATÓRIO ---\n")
    print(report_final)
    print("\n--- FIM DO RELATÓRIO ---")

