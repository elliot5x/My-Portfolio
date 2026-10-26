<div align="center">

# MY PORTFÓLIO

### Identidade Profissional Automatizada & Gerador de Portfólio

[![Status](https://img.shields.io/badge/Status-Beta-FF424D?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/License-AGPL_v3-blue?style=for-the-badge)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![spaCy](https://img.shields.io/badge/spaCy-09A3D5?style=for-the-badge&logo=spacy&logoColor=white)](https://spacy.io/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

**Um hub automatizado de identidade profissional que cruza repositórios de código e histórico formal de carreira em um portfólio web de alta conversão.**

</div>

---

## 🌐 Acesso Web (Em Breve)

> 🚀 **O My Portfólio estará disponível online em breve!**  
> A versão web oficial está sendo preparada para permitir que você gere seu portfólio diretamente pelo navegador, sem necessidade de configuração local.  
> 
> *Link oficial: `https://myportfolio...` (Lançamento em breve)*

---

## Visão Geral

Chega de perder tempo montando portfólio do zero ou depender de perfis engessados. O **My Portfólio** elimina o atrito de apresentação profissional: basta conectar o GitHub e enviar o PDF do currículo para gerar um card profissional pronto para o compartilhamento em redes como o LinkedIn.

---

## Funcionalidades

- **Conexão e Ingestão de Dados**: Login via GitHub e parsing direto do PDF de currículo.
- **Cruzamento Inteligente**: Merge automatizado entre histórico profissional e repositórios reais.
- **Painel de Curadoria**: Controle granular sobre visibilidade de projetos, tecnologias e cargos.
- **Geração de Entregáveis**:
  - Página pública rápida, responsiva e personalizável.
  - Card visual automático otimizado para o feed do LinkedIn.
- **Suporte a Projetos Manuais**: Cadastro de projetos e experiências que não possuem repositório no GitHub.

---

## Como Executar Localmente

Você pode rodar o projeto localmente usando **Docker** (recomendado para subir tudo de uma vez) ou executando os serviços de **Frontend** e **Backend** separadamente.

### 1. Clonando o Repositório

```bash
git clone https://github.com/elliot5x/My-Portfolio.git
cd My-Portfolio
```

---

### Se Você prefere via Docker Compose (Recomendado)

Sobe o ecossistema completo (Frontend Next.js + Backend FastAPI) em containers isolados:

```bash
docker compose up --build
```

- **Frontend:** [http://localhost:3000](http://localhost:3000)
- **Backend API:** [http://localhost:8000](http://localhost:8000)
- **Docs da API (Swagger):** [http://localhost:8000/docs](http://localhost:8000/docs)

---

### Primeira execução

Na raiz do projeto, execute uma única vez:

```bash
npm run setup
```

O comando instala as dependências do Node.js, prepara um Python 3.12 isolado em `services/backend/.venv` e instala as dependências da API. Quando necessário, ele baixa o `uv` apenas para `services/backend/.tools`, sem alterar o Python global ou usar Docker.

Depois, para subir os dois serviços:

```bash
npm run dev
```

Isso inicia o Next.js e a API FastAPI juntos. Se o Next escolher a porta `3001` porque a `3000` está ocupada, a API também aceita essa origem.

#### Frontend (Next.js)

```bash
# A partir da raiz do projeto
cd apps/web
npm install
npm run dev
```
Acesse em: [http://localhost:3000](http://localhost:3000)

#### Backend (FastAPI + spaCy)

```bash
# A partir da raiz do projeto
cd services/backend

# Criar e ativar ambiente virtual
python -m venv venv
source venv/bin/activate  # Linux/macOS
# ou: venv\Scripts\activate  # Windows

# Instalar dependências
pip install -r requirements.txt

# Baixar modelo spaCy (se aplicável)
python -m spacy download pt_core_news_sm

# Rodar servidor
uvicorn main:app --reload --port 8000
```
API disponível em: [http://localhost:8000](http://localhost:8000)

---

## Como o Código Funciona (Arquitetura)

O projeto é um monorepo com duas aplicações principais que conversam via HTTP:

```
My-Portfolio/
├── apps/web/          → Frontend (Next.js 16 + React 19 + Tailwind 4)
├── services/backend/  → Backend  (FastAPI + spaCy)
├── scripts/           → setup.sh e dev-api.sh (orquestração local)
├── docker-compose.yml → sobe os dois serviços em containers
└── docs/              → documentação interna do projeto
```

### Backend — `services/backend/`

A API expõe três endpoints principais em `main.py`, todos protegidos com rate limiting (slowapi) e CORS:

| Endpoint | Método | O que faz |
|---|---|---|
| `/api/v1/curriculo/parse` | POST | Recebe o PDF do currículo (máx. 5 MB), valida os magic bytes `%PDF-`, extrai o texto e devolve um JSON estruturado |
| `/api/v1/github/repos` | GET | Consulta a API do GitHub e retorna os repositórios públicos de um usuário |
| `/api/v1/personalizacao/card` | POST | Cruza currículo + repositórios e gera os dados do card/portfólio personalizado |

O pipeline de parsing do currículo é dividido em módulos dentro de `src/`:

- **`src/parsers/pdf_reader.py`** — extrai o texto bruto do PDF (`extracao_padrao`), rodando em thread separada para não bloquear o event loop.
- **`src/extraction/cv_parser.py`** — transforma o texto bruto em JSON (`text_to_json`) usando spaCy (NER) e a taxonomia `SKILL_CATEGORIA`, que classifica skills por área (frontend, backend, dados, etc.).
- **`src/api/github_api.py`** — cliente assíncrono para buscar os repositórios do usuário no GitHub.
- **`src/recomendacao/personalizador.py`** — merge inteligente: cruza as skills extraídas do currículo com as tecnologias dos repositórios (`gerar_personalizacao`) para montar o card final.
- **`src/ml/treinamento_ner.py`** — treino/fine-tuning do modelo NER usado no parsing.
- **`src/schemas/`** — modelos Pydantic de request/response (`CurriculoResponse`, `GitHubResponse`, `PersonalizacaoRequest/Response`).

O mapa `skill → área` é inicializado uma única vez na subida da aplicação, e cada upload de PDF é gravado em arquivo temporário que é removido ao final do request.

### Frontend — `apps/web/`

Next.js com App Router, organizado por rotas e features:

- **`(marketing)/`** — página inicial pública e o **onboarding**, onde o usuário envia o PDF do currículo e informa o usuário do GitHub.
- **`(workspace)/`** — área logada do usuário:
  - `dashboard/` — painel de curadoria (visibilidade de projetos, tecnologias e cargos).
  - `portfolio/` — geração e visualização da página pública do portfólio e do card para o LinkedIn.
- **`src/features/`** — as telas em si (`home-screen`, `onboarding-screen`, `dashboard-screen`, `portfolio-screen`), mantidas separadas das rotas para facilitar reuso.
- **`src/app/api/health/`** — endpoint de health check do próprio app Next.

Utilitários relevantes nas dependências: `jspdf` e `jszip` para geração/exportação de entregáveis, `motion` para animações e `radix-ui` + `shadcn` como base dos componentes.

### Fluxo ponta a ponta

1. Usuário acessa a home e entra no **onboarding**.
2. O frontend envia o PDF para `POST /api/v1/curriculo/parse` → backend extrai e estrutura os dados do currículo.
3. O frontend busca os repositórios em `GET /api/v1/github/repos?username=...`.
4. Com os dois conjuntos de dados, chama `POST /api/v1/personalizacao/card`, que faz o cruzamento e devolve o portfólio personalizado.
5. No **dashboard** o usuário ajusta o que será exibido e no **portfolio** visualiza/exporta o resultado.

---

## Status do Projeto

O projeto encontra-se atualmente em fase de testes (**Beta**). Instabilidades de parsing ou bugs de renderização podem ser reportados abrindo uma issue.

<div align="left">

### Apoie o Projeto

Sinta-se aberto para mandar sugestões ou issues.

[Sugestões e Discussões](https://github.com/elliot5x/My-Portfolio/discussions/32)

[Reportar Bugs / Issues](https://github.com/elliot5x/My-Portfolio/issues)

</div>

---

## Licença

Distribuído sob a licença **GNU AGPLv3**. Veja [LICENSE](LICENSE) para mais detalhes.

---


### Colaboradores

<a href="https://github.com/elliot5x/My-Portfolio/graphs/contributors">
  <img src="https://contributors-img.web.app/image?repo=elliot5x/My-Portfolio" />
</a>
