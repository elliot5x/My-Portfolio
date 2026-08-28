# Guia do Dev

Este documento é o mapa de trabalho do projeto `MyPortfolio`.
Ele explica a estrutura do repositório, os comandos principais e as convenções que ajudam a manter o código organizado.

## Visão Geral

O repositório está dividido em duas partes principais:

- frontend em `apps/web`
- backend em `services/backend`

A documentação do projeto vive em `docs/`, organizada por domínio:

- `docs/backend/`
- `docs/frontend/`
- `docs/product/`
- `docs/roadmap/`

## Estrutura do Repositório

```txt
My-Portfolio/
  AGENTS.md
  README.md
  docs/
    backend/
    frontend/
    guide/
    product/
    roadmap/
  apps/
    web/
  services/
    backend/
```

## Frontend

O frontend está em `apps/web` e usa `Next.js` com `React`.

### Estrutura interna do frontend

```txt
apps/web/
  src/
    app/
      (marketing)/
      (workspace)/
      api/
      globals.css
      layout.tsx
    components/
      ui/
    features/
      dashboard/
      marketing/
      onboarding/
      portfolio/
    lib/
      api/
      hooks/
      utils/
    styles/
  public/
  package.json
  tsconfig.json
  eslint.config.mjs
  next.config.ts
```

### O que vai em cada pasta

- `src/app/`
  - rotas, layouts e handlers de rota do Next.js
  - use para páginas e endpoints que pertencem ao roteamento
- `src/features/`
  - lógica e composição por domínio
  - ex.: onboarding, dashboard, portfolio, marketing
- `src/components/ui/`
  - componentes visuais reutilizáveis
  - ex.: `Button`, `Card`, `Input`, `Textarea`
- `src/lib/`
  - utilitários, helpers, clientes de API e hooks compartilhados
- `src/styles/`
  - espaço para tokens e estilos compartilhados, caso o projeto cresça
- `public/`
  - arquivos estáticos como imagens, ícones e fontes

### Regras de organização no frontend

- `src/app` deve ficar fino e apenas orquestrar rotas
- a lógica de telas deve viver em `src/features`
- UI reutilizável deve ir para `src/components/ui`
- chamadas para API devem ser centralizadas em `src/lib/api`
- não duplicar regras de estilo ou estado em várias telas

## Backend

O backend está em `services/backend` e usa `FastAPI`.

### Estrutura interna do backend

```txt
services/backend/
  main.py
  requirements.txt
  src/
    api/
    extraction/
    ml/
    parsers/
    recomendacao/
    schemas/
```

### O que vai em cada pasta

- `main.py`
  - ponto de entrada da API FastAPI, registro de rotas, middlewares, CORS e rate limit
- `src/api/`
  - integrações externas e adaptadores de API (ex.: consulta à API pública do GitHub)
- `src/extraction/`
  - extração, catalogação e normalização de dados do currículo via regex, catálogo de skills e NLP
- `src/parsers/`
  - leitura e extração de texto bruto de arquivos (ex.: PDF com pdfplumber)
- `src/ml/`
  - scripts de treino e dados de suporte para o modelo de NER (Spacy)
- `src/recomendacao/`
  - motor de regras (`personalizador.py`): cruza linguagens do Git com habilidades do CV, calcula scores de repositórios e infere a área de atuação
- `src/schemas/`
  - contratos de dados e validação de entrada/saída usando Pydantic

### Arquitetura e Funcionamento dos Endpoints (Stateless)

A API foi desenhada para operar **100% stateless** (sem persistência em banco de dados). O processamento ocorre em memória a cada chamada:

1. **`POST /api/v1/curriculo/parse`**
   - Recebe o PDF via upload, valida magic bytes e tamanho, extrai o texto e retorna o JSON estruturado (`nome`, `email`, `telefone`, `habilidades`, `experiencias`).
2. **`GET /api/v1/github/repos?username={username}`**
   - Consulta a API do GitHub, filtra forks e repositórios irrelevantes, devolvendo a lista sanitizada com linguagens, estrelas e forks.
3. **`POST /api/v1/personalizacao/card`**
   - Recebe no corpo da requisição o JSON combinado (`curriculo` + `repos`). O motor de recomendação cruza as fontes, separa skills confirmadas de skills apenas citadas, ranqueia os melhores repositórios e infere a área técnica do usuário para o card final.

## Documentação

### `docs/backend/`

Documentação técnica do backend, backlog e tarefas de API.

### `docs/frontend/`

Documentação da arquitetura do frontend e decisões de UI.

### `docs/product/`

Visão do produto, pitch e contexto de negócio.

### `docs/roadmap/`

Plano de implementação por fase.

### `docs/guide/`

Guias operacionais e de desenvolvimento.

## Comandos do Frontend

Executar sempre dentro de `apps/web`.

### Instalar dependências

```bash
cd apps/web
npm install
```

### Rodar em desenvolvimento

```bash
cd apps/web
npm run dev
```

### Gerar build

```bash
cd apps/web
npm run build
```

### Rodar lint

```bash
cd apps/web
npm run lint
```

### Observação importante

Não rode `npm install` na raiz do repositório se a intenção for trabalhar no frontend.
O lockfile e as dependências do frontend devem ficar em `apps/web`.

## Comandos do Backend

Executar sempre dentro de `services/backend`.

### Criar ambiente virtual

```bash
cd services/backend
python -m venv .venv
```

### Ativar ambiente virtual

```bash
source .venv/bin/activate
```

### Instalar dependências

```bash
pip install -r requirements.txt
```

### Subir a API

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Rodar o treinamento do modelo

```bash
python src/ml/treinamento_ner.py
```

## Fluxo de Trabalho

1. Criar branch no padrão `dev/nome/tarefa`
2. Fazer a implementação na branch
3. Atualizar `docs/` se a alteração for relevante
4. Rodar validação local
5. Pedir autorização antes de deploy
6. Só então abrir merge

## Regras Importantes

- não codar na `main` sem permissão explícita do mestre Luiz ou do mestre Marques
- não fazer deploy sem autorização
- documentar mudanças relevantes em `docs/`
- manter o código organizado por responsabilidade
- preferir arquivos pequenos e focados

## Onde Colocar Cada Tipo de Coisa

### Nova tela

- `apps/web/src/app/...` para a rota
- `apps/web/src/features/...` para a lógica da tela

### Novo componente visual

- `apps/web/src/components/ui/`

### Nova integração com API

- `apps/web/src/lib/api/`

### Nova regra de negócio de documento

- backend em `services/backend/src/...`

### Nova documentação

- `docs/backend/`, `docs/frontend/`, `docs/product/`, `docs/roadmap/` ou `docs/guide/`

## Convenção de Branch

Nome de branch:

```txt
dev/nome/tarefa
```

Exemplos:

- `dev/louiz/frontend-base`
- `dev/marques/onboarding-form`
- `dev/louiz/backend-upload-cv`

## Observação Final

Este guia existe para reduzir dúvida na hora de contribuir.
Se a estrutura mudar, atualize este documento junto com o código.