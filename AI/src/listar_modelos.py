# listar_modelos.py
import os
import google.generativeai as genai

# Tenta configurar a chave de API a partir da variável de ambiente
try:
    api_key = "AIzaSyCxr_EOlTIdmkcHhYrs096Lwyscdy4D6sQ"
    if not api_key:
        raise ValueError("A variável de ambiente GOOGLE_API_KEY não foi encontrada.")
    
    genai.configure(api_key=api_key)
    print("Chave de API configurada com sucesso.\n")

except Exception as e:
    print(f"Erro ao configurar a API: {e}")
    # Encerra o script se a chave não for encontrada
    exit()

# Itera sobre todos os modelos disponíveis e imprime informações úteis
print("--- Modelos de IA Disponíveis ---")
for model in genai.list_models():
    # Verifica se o método 'generateContent' (o que estamos usando) é suportado
    if 'generateContent' in model.supported_generation_methods:
        print(f"Nome do Modelo: {model.name}")
        print(f"  - Métodos Suportados: {model.supported_generation_methods}\n")

print("--- Fim da Lista ---")