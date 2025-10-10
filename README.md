# ADAS - Analista de Desenvolvimento e Arquitetura de Software

**ADAS** é uma ferramenta full-stack projetada para analisar e avaliar a qualidade de projetos de software de forma automatizada. Utilizando a API do Google Gemini, a aplicação analisa repositórios do GitHub ou pastas de projetos locais, fornecendo uma pontuação e um feedback detalhado sobre critérios de Engenharia de Software e Qualidade de Aplicação de IA.

## ✨ Funcionalidades Principais

- **Análise de Repositórios Remotos:** Cole a URL de um repositório público do GitHub para uma análise completa.
- **Análise de Projetos Locais:** Envie uma pasta do seu computador para receber a mesma avaliação detalhada.
- **Avaliação por IA:** O núcleo do sistema utiliza o Google Gemini para avaliar o código com base em métricas como:
  - **Qualidade de Engenharia:** Manutenibilidade, Confiabilidade (testes), Documentação, etc.
  - **Qualidade de IA:** Tratamento de dados, técnicas aplicadas, segurança, etc.
- **Relatórios Detalhados:** Receba uma pontuação de 0 a 100 e justificativas técnicas para cada critério avaliado.
- **Interface Reativa:** Frontend construído em React para uma experiência de usuário fluida e dinâmica.

---
### Justificativa da Escolha da IA (Google Gemini)

A escolha pelo **Google Gemini 2.5 Pro** foi uma decisão estratégica baseada em três pilares: **Escalabilidade, Custo-Eficiência e Capacidade Técnica**. O Gemini oferece uma janela de contexto de até 1 milhão de tokens, o que prepara o ADAS para futuras análises de bases de código muito maiores. Além disso, o generoso nível gratuito oferecido pelo Google AI Studio viabilizou o desenvolvimento do projeto sem custos, um fator crucial em um ambiente de hackathon e para estudantes. Por fim, sua capacidade de seguir instruções complexas e gerar saídas em formato JSON estruturado foi fundamental para a arquitetura de nossa solução.

---
## ⚠️ Estado Atual e Limitações (MVP)

Esta versão foi desenvolvida como um **MVP (Produto Mínimo Viável)** dentro do prazo do hackathon. Como tal, focamos no fluxo principal de análise, e há diversas áreas para melhoria que reconhecemos:

- **Estratégia de Validação:** A validação dos resultados da IA é atualmente qualitativa. Uma estratégia formal de validação (ex: comparação com avaliações humanas) não foi implementada.
- **Gestão de Custo e Desempenho:** O controle de custos de tokens e a medição de latência da API de IA não foram implementados.
- **Tratamento de Dados (Contexto do LLM):** A versão atual envia um resumo dos dados para a IA (ex: primeiros 4000 caracteres do README). Uma estratégia mais robusta para lidar com o limite de tokens em repositórios muito grandes (como RAG) é um próximo passo.
- **Segurança da IA:** Mecanismos de segurança avançados como `guardrails` para validar a saída da IA e defesa contra injeção de prompt não foram implementados.
- **Processamento Síncrono:** Para garantir a entrega do núcleo funcional no prazo do hackathon, a análise é executada de forma síncrona. A arquitetura, no entanto, foi projetada para a futura implementação de um sistema de filas para processamento assíncrono.
- **Dashboard e Ranking:** Os resultados das análises já estão sendo persistidos no banco de dados, criando a base de dados necessária para a funcionalidade de dashboard. A camada de visualização (frontend) para exibir o ranking e o histórico não foi implementada neste MVP.
---
## 🗺️ Roadmap de Evolução

Com a base do MVP estabelecida, o plano de evolução do ADAS inclui:

- **[ ] Implementar um Framework de Validação:** Criar um sistema para comparar os resultados da IA com um gabarito de avaliações humanas, permitindo o cálculo de métricas de acurácia.
- **[ ] Otimizar Custo e Performance:** Integrar um sistema de cache (como Redis) para evitar reanálises de projetos já avaliados e implementar um controle de uso de tokens.
- **[ ] Processamento Avançado de Código:** Utilizar a técnica de **RAG (Retrieval-Augmented Generation)** para permitir que a IA analise o conteúdo completo de múltiplos arquivos de código-fonte de forma eficiente.
- **[ ] Implementar Guardrails de Segurança:** Adicionar uma camada para validar e sanitizar as saídas da IA, garantindo que as respostas sejam sempre seguras e no formato esperado.
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
