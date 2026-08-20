# Plano de Implementação

Este documento organiza a execução do projeto em fases práticas, ligando a visão do produto ao backlog técnico já registrado em `docs/`.

## Objetivo

Construir um hub de identidade profissional que:

- receba o PDF do currículo;
- conecte o GitHub;
- normalize e cruze os dados;
- permita curadoria do conteúdo exibido;
- entregue um portfólio público e material de divulgação.

## Princípios de execução

- Começar pelo fluxo mínimo funcional.
- Separar backend, frontend e regras de negócio.
- Documentar toda mudança relevante.
- Não fazer deploy sem autorização explícita.
- Trabalhar em branch própria por tarefa, seguindo o padrão `dev/nome/tarefa`.

## Stack sugerida

- Frontend: `Next.js` + `React`
- Backend: `FastAPI`
- Extração e parsing: PDF + regras de normalização no backend
- Persistência futura: começar simples, evoluir depois para banco se necessário

## Fases

### Fase 1 - Fundação do projeto

Objetivo: deixar o terreno pronto para evolução segura.

Entregas:

- padronizar estrutura de pastas;
- manter `docs/` como fonte de verdade do planejamento;
- revisar integração entre frontend e backend;
- alinhar contratos de API.

Dependências:

- backlog técnico definido;
- regras de branch e documentação definidas em `AGENTS.md`;
- `.gitignore` limpo e coerente.

### Fase 2 - Backend mínimo funcional

Objetivo: fechar as rotas centrais da aplicação.

Entregas:

- parsing de PDF em memória;
- validação de arquivo e tamanho;
- retorno JSON estrito;
- integração GitHub com tratamento de erro consistente;
- schemas Pydantic para entrada e saída;
- padronização de erros.

Relacionamento com backlog:

- `TASK-01`
- `TASK-02`
- `TASK-04`

### Fase 3 - Qualidade e segurança

Objetivo: aumentar confiança antes da expansão do produto.

Entregas:

- testes unitários para PDFs válidos e inválidos;
- proteção contra spoofing e arquivos maliciosos;
- logs e auditoria de eventos relevantes;
- validação de respostas da API.

Relacionamento com backlog:

- `TASK-05`

### Fase 4 - Frontend do fluxo principal

Objetivo: criar a experiência que o usuário realmente vê.

Entregas:

- tela de onboarding;
- upload do currículo;
- conexão com GitHub;
- painel de curadoria;
- preview do portfólio;
- navegação para link público.

Fluxo sugerido:

1. Entrar no app.
2. Conectar GitHub.
3. Enviar PDF do currículo.
4. Revisar dados extraídos.
5. Curar visibilidade e ordem dos projetos.
6. Publicar o portfólio.

### Fase 5 - Entrega pública e marketing

Objetivo: transformar o produto em algo publicável e compartilhável.

Entregas:

- página pública por slug do dev;
- card visual para LinkedIn;
- metadata e SEO básicos;
- identidade visual consistente;
- exportação ou geração de imagem de divulgação.

## Sequência recomendada

1. Fechar o backend mínimo funcional.
2. Criar contratos estáveis entre backend e frontend.
3. Construir o frontend principal em `Next.js`.
4. Adicionar curadoria e geração de card.
5. Testar, documentar e só então pensar em deploy.

## Critérios de pronto por etapa

- A etapa tem código funcional.
- A mudança está documentada em `docs/`.
- O comportamento está claro para frontend e backend.
- Não há dependências ocultas ou acoplamento desnecessário.
- A etapa respeita a regra de branch e autorização para deploy.

## Observações

- O plano foi pensado para crescer sem bagunçar a estrutura.
- Se a prioridade mudar, este documento deve ser atualizado antes de iniciar a próxima tarefa.

