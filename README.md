# ADA - Assistente de Desempenho de Aplicações

**ADA** é uma ferramenta full-stack projetada para analisar e avaliar a qualidade de projetos de software de forma automatizada. Utilizando a API do Google Gemini, a aplicação analisa repositórios do GitHub ou pastas de projetos locais, fornecendo uma pontuação e um feedback detalhado sobre critérios de Engenharia de Software e Qualidade de Aplicação de IA.

## ✨ Funcionalidades Principais

- **Análise de Repositórios Remotos:** Cole a URL de um repositório público do GitHub para uma análise completa.
- **Análise de Projetos Locais:** Envie uma pasta do seu computador para receber a mesma avaliação detalhada.
- **Avaliação por IA:** O núcleo do sistema utiliza o Google Gemini para avaliar o código com base em métricas como:
  - **Qualidade de Engenharia:** Manutenibilidade, Confiabilidade (testes), Documentação, etc.
  - **Qualidade de IA:** Tratamento de dados, técnicas aplicadas, segurança, etc.
- **Relatórios Detalhados:** Receba uma pontuação de 0 a 100 e justificativas técnicas para cada critério avaliado.
- **Interface Reativa:** Frontend construído em React para uma experiência de usuário fluida e dinâmica.

---

## 🚀 Tecnologias Utilizadas

- **Frontend:** React
- **Backend:** .NET 6.0, Entity Framework Core
- **Serviço de IA:** Python, Flask, Google Gemini API
- **Banco de Dados:** MySQL

---

## ⚙️ Como Executar o Projeto

Para executar o projeto completo, você precisará ter três terminais abertos, um para cada parte da aplicação (Backend, Frontend, Serviço de IA).

### Pré-requisitos

- [.NET 6 SDK](https://dotnet.microsoft.com/download/dotnet/6.0)
- [Node.js e npm](https://nodejs.org/)
- [Python 3.10+](https://www.python.org/downloads/)
- [MySQL](https://dev.mysql.com/downloads/installer/) (ou outro servidor de banco de dados compatível)

### 1. Configuração do Backend (.NET)

a. **Navegue até a pasta do backend:**
   ```bash
   cd c:\UserProfiles\UNISANTA\HackathonT2S\hackathont2s\Back-end
   ```

b. **Configure as variáveis de ambiente:**
   - Abra o arquivo `appsettings.Development.json`.
   - Atualize a `DefaultConnection` com a sua string de conexão do MySQL.
   - Insira seu token de acesso pessoal do GitHub em `ApiKeys:GitHubToken`.

c. **Aplique as migrações do banco de dados:**
   ```bash
   dotnet ef database update
   ```

d. **Inicie o servidor backend:**
   ```bash
   dotnet run
   ```
   O backend estará rodando em `http://localhost:5135`.

### 2. Configuração do Serviço de IA (Python)

a. **Navegue até a pasta da IA:**
   ```bash
   cd c:\UserProfiles\UNISANTA\HackathonT2S\hackathont2s\AI
   ```

b. **Crie e ative um ambiente virtual:**
   ```bash
   python -m venv venv
   .\venv\Scripts\activate
   ```

c. **Instale as dependências:**
   ```bash
   pip install Flask google-generativeai requests python-dotenv pytz
   ```

d. **Configure sua chave da API do Gemini:**
   - Abra o arquivo `src/rater.py`.
   - Insira sua chave da API do Google Gemini na variável `MINHA_CHAVE_DIRETA`.

e. **Inicie o servidor Flask:**
   ```bash
   python src/main.py
   ```
   O serviço de IA estará rodando em `http://localhost:5001`.

### 3. Configuração do Frontend (React)

a. **Navegue até a pasta do frontend:**
   ```bash
   cd c:\UserProfiles\UNISANTA\HackathonT2S\hackathont2s\frontend
   ```

b. **Instale as dependências:**
   ```bash
   npm install
   ```

c. **Inicie a aplicação React:**
   ```bash
   npm start
   ```
   A aplicação estará acessível em `http://localhost:3000`.
