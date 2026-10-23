# Frontend Next.js + React

Este documento define a direção do frontend do projeto `MyPortfolio`.

## Status atual

A base inicial do frontend já foi criada em `apps/web`, com:

- `Next.js` configurado;
- estrutura em `src/` com App Router;
- páginas base para público, onboarding e dashboard;
- endpoint de healthcheck;
- Tailwind CSS v4 e `shadcn/ui` como base de componentes e tokens;
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
- `Tailwind CSS v4` para layout e responsividade com utilitários.
- `shadcn/ui` para componentes acessíveis e padronizados.
- `Motion` para animações de entrada, interação e scroll.
- Componentes selecionados do `Aceternity UI` para composições visuais de landing
  page, integrados pelo registry do shadcn.
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
- Preferir componentes do `shadcn/ui` e utilitários Tailwind; não criar componentes
  visuais paralelos com CSS próprio.
- Manter apenas tokens globais do shadcn em `src/app/globals.css`.
- Usar Motion e Aceternity com moderação: efeitos devem explicar o fluxo do produto
  ou reforçar hierarquia visual, nunca substituir conteúdo real.
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

## Foto de perfil e exportação

- A foto escolhida no onboarding é reduzida no navegador para no máximo 640 px e salva como `data URL` no `localStorage`, junto aos demais dados da sessão.
- Ela não é enviada ao backend nesta etapa.
- A página de portfólio usa essa foto no cabeçalho e no PDF exportado.
- O PDF é gerado no navegador a partir dos dados reais salvos: identificação, contato, competências, experiências e repositórios.
- O onboarding também guarda o modo claro/escuro e a cor de destaque; a escolha é aplicada no portfólio e na exportação em PDF.
- O usuário pode escolher entre as tipografias Space, Clean, Editorial e Mono. A escolha também é aplicada na exportação estática.
- A ação `HTML + CSS` baixa um arquivo `.zip` com `index.html` e `styles.css`, incluindo dados reais, foto incorporada, cor, tema e tipografia selecionados.
- Todos os repositórios públicos encontrados são exibidos. A pessoa pode ativar o modo de organização para mover cada repositório para cima ou para baixo; essa ordem é persistida e usada nas exportações.
- No mesmo modo, a pessoa pode remover um repositório da seleção. Uma nova consulta ao GitHub pelo onboarding restaura a lista disponível.
- Ao reabrir o onboarding, os dados já salvos são carregados novamente. Sem um novo PDF selecionado, competências e experiências existentes são preservadas.
- Na página do portfólio, competências e experiências podem ser alteradas diretamente; a edição atualiza o mesmo registro no `localStorage`.
- O backend preserva espaços durante a extração do PDF e agrupa cargo, período e atribuições em uma única experiência; o resumo profissional anterior ao primeiro cargo não entra nessa lista.

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
