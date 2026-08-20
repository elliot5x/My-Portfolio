# Frontend Next.js + React

Este documento define a direção do frontend do projeto `MyPortfolio`.

## Status atual

A base inicial do frontend já foi criada em `apps/web`, com:

- `Next.js` configurado;
- estrutura em `src/` com App Router;
- páginas base para público, onboarding e dashboard;
- endpoint de healthcheck;
- estilos globais com identidade visual própria;
- estrutura de pastas para componentes, libs e estilos dentro de `src/`.

Validação atual:

- `npm run build` aprovado
- `npm run lint` aprovado

## Objetivo

Construir uma interface pública e um painel interno para:

- receber o currículo do usuário;
- conectar e exibir dados do GitHub;
- permitir curadoria do que vai para o portfólio;
- publicar uma página elegante e rápida;
- gerar material visual para divulgação.

## Stack

- `Next.js` para roteamento, páginas, layouts, metadata e renderização.
- `React` para a composição da interface e organização dos componentes.
- Integração com o backend FastAPI via HTTP.

## Por que essa stack

- O produto tem páginas públicas que se beneficiam de SEO e rotas dinâmicas.
- O fluxo inclui dashboard, preview e publicação.
- O frontend precisa ser rápido, modular e fácil de evoluir.
- `Next.js` reduz o trabalho de infraestrutura no lado da interface.

## Estrutura sugerida de pastas

```txt
apps/web/
  src/
    app/
      (marketing)/
      (workspace)/
      api/
    components/
      ui/
    features/
      onboarding/
      dashboard/
      portfolio/
    lib/
      api/
      hooks/
      utils/
    styles/
  public/
```

## Princípios de organização

- Separar páginas públicas e área autenticada/operacional.
- Manter componentes pequenos e reutilizáveis.
- Isolar chamadas de API em uma camada própria.
- Evitar lógica de negócio espalhada em componentes visuais.
- Documentar decisões de interface que impactem o produto.

## Páginas principais

### Página inicial

- apresenta o produto;
- mostra proposta de valor;
- direciona para o fluxo de criação do portfólio.

### Onboarding

- conecta GitHub;
- orienta o envio do PDF;
- mostra o próximo passo com clareza.

### Curadoria

- lista dados extraídos do currículo;
- permite ligar/desligar itens visíveis;
- reorganiza projetos e destaques.

### Preview do portfólio

- exibe a versão final antes da publicação;
- valida aparência em desktop e mobile.

### Página pública do dev

- rota como `/dev/[slug]`;
- mostra a identidade profissional consolidada;
- precisa ser rápida e indexável.

### Card para LinkedIn

- gera uma imagem ou preview social;
- destaca métricas, stacks e projeto em evidência.

## Fluxo de dados

1. Usuário envia o PDF.
2. Usuário conecta o GitHub.
3. O backend retorna dados processados.
4. O frontend normaliza e exibe a informação.
5. O usuário ajusta a curadoria.
6. A página pública é montada com base nessa seleção.

## Camadas recomendadas

### `lib/api`

Centralizar chamadas para FastAPI.

### `components`

Reutilizar blocos visuais de forma consistente.

### `app`

Definir rotas, layouts e páginas.

### `styles`

Concentrar tokens visuais, temas e estilos globais.

## Boas práticas

- Padronizar nomes de componentes e pastas.
- Usar tipagem clara nos dados que vêm da API.
- Criar estados explícitos para `loading`, `error` e `success`.
- Garantir acessibilidade básica em formulários e botões.
- Testar o comportamento em telas menores e maiores.

## Integração com o backend

- Upload de currículo via `multipart/form-data`.
- Consulta de repositórios por username.
- Consumo de respostas JSON padronizadas.
- Tratamento de erro amigável para o usuário final.

## Ordem de implementação sugerida

1. Criar a base do `Next.js`.
2. Montar layout, tema e sistema de componentes.
3. Implementar a home.
4. Integrar upload do PDF.
5. Integrar GitHub.
6. Construir o painel de curadoria.
7. Criar o preview e a página pública.
8. Fechar a geração de card visual.

## Observação

Essa documentação existe para o frontend não virar um conjunto solto de telas.
Se a estrutura mudar, este arquivo deve ser atualizado junto.
