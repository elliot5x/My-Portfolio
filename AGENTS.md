# Regras Locais de Agentes

Este arquivo define as regras de trabalho para agentes e colaboradores neste repositório.

## Regras de fluxo

### Branch obrigatória por tarefa

- Sempre iniciar uma tarefa em uma branch nova.
- Padrão de nome: `dev/nome/tarefa`
- Exemplos:
  - `dev/louiz/upload-cv`
  - `dev/marques/github-integration`

### Trabalho na `main`

- Não codar diretamente na `main`.
- Só é permitido alterar a `main` com autorização explícita do mestre Luiz ou do mestre Marques.
- Se não houver permissão explícita, criar branch e seguir o fluxo normal de trabalho.

### Deploy

- Não fazer deploy sem autorização explícita.
- Qualquer deploy deve ser confirmado antes de executar.

## Boas práticas de código

- Organizar o código com foco em clareza, coesão e separação de responsabilidades.
- Preferir pastas e módulos pequenos, com nomes descritivos.
- Manter a estrutura do projeto consistente entre novas features e módulos existentes.
- Evitar colocar lógica de negócio em arquivos de entrada ou em componentes muito grandes.
- Quando uma alteração relevante for feita, documentar o comportamento novo ou a decisão técnica em `docs/`.

## Documentação

- Toda alteração relevante no código deve vir acompanhada de documentação quando fizer sentido.
- Se a mudança afetar fluxo, API, estrutura de pastas ou regras de negócio, registrar isso em `docs/`.
- Se a mudança criar uma nova convenção, atualizar este arquivo ou os docs do projeto para refletir a regra.

## Regra geral

- Em caso de dúvida sobre branch, deploy ou alteração em `main`, parar e pedir confirmação.
- Priorizar segurança, rastreabilidade e organização antes de velocidade.

