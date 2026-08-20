# Backlog Backend FastAPI

Fonte: `Backlog_Backend_FastAPI.pdf`

## Escopo

Sprint 1 do backend do projeto `MyPortfolio`, com foco em API e regras de negócio.

## Tarefas Técnicas

## Status atual do código

| Task | Status |
| --- | --- |
| TASK-01 - Upload & Parsing de PDF | parcial |
| TASK-02 - Integração com GitHub API | parcial |
| TASK-03 - CORS & Swagger | feito |
| TASK-04 - Schemas & Validação (Pydantic) | pendente |
| TASK-05 - Testes Unitários e Segurança | pendente |

Legenda:

- `feito`: implementado e atendendo o núcleo da task
- `parcial`: existe base no código, mas ainda não cumpre todos os critérios do backlog
- `pendente`: ainda não há implementação relevante

### TASK-01 - Upload e parsing de PDF

- Rota: `POST /api/v1/curriculo/parse`
- Objetivo: extrair texto de currículos e perfis do LinkedIn.

Status no código atual: parcial.

Critérios de aceite:

- Processamento em memória com `io.BytesIO`.
- Validação de magic bytes (`%PDF-`) e tamanho máximo de 5 MB.
- Retorno estruturado em JSON com perfil, experiência e skills.
- Logs de auditoria para anomalias.

### TASK-02 - Integração com GitHub API

- Rota: `GET /api/v1/github/repos?username={user}`
- Objetivo: buscar projetos públicos do usuário.

Status no código atual: parcial.

Critérios de aceite:

- Requisições assíncronas com `httpx`.
- Filtro de campos úteis como stars, tags e URL.
- Tratamento de erros HTTP `403` e `404`.

### TASK-03 - CORS e Swagger

- Rota/documentação: `/docs`
- Objetivo: liberar conexão com o frontend e documentar a API.

Status no código atual: implementado.

Critérios de aceite:

- Configurar `CORSMiddleware`.
- Manter documentação interativa ativa para testes.

### TASK-04 - Schemas e validação com Pydantic

- Objetivo: padronizar entrada e saída.

Status no código atual: não implementado.

Critérios de aceite:

- Modelos de saída estritos com `BaseModel`.
- Padronização global de respostas de erro em JSON.

### TASK-05 - Testes unitários e segurança

- Objetivo: criar pipeline de testes.

Status no código atual: não implementado.

Critérios de aceite:

- Testes com `pytest` para PDFs válidos.
- Testes de bloqueio para arquivos maliciosos ou spoofing.

## Como o frontend vai consumir

- Upload: `POST` multipart com PDF e resposta JSON com as seções do currículo.
- GitHub: `GET` com o `@username` e resposta com a lista tratada de repositórios.

