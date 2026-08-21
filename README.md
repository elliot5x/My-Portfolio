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

### Execução Manual (Serviços Separados)

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
