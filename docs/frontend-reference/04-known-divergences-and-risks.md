# 04 - Divergencias Conhecidas e Riscos

> Consolidacao objetiva das divergencias e riscos verificados no backend atual.
> Este arquivo deve ser lido junto com `01-entities-and-types.md` e `02-routes.md`.

---

## Criterios

- "Confirmado" significa que o comportamento foi verificado na implementacao atual.
- "Impacto frontend" descreve como a tela ou integracao deve se comportar enquanto o backend nao muda.
- Rotas sem `@Public()` sao autenticadas por guards globais, mesmo quando o controller nao declara guard local.
- `PatientProfile.id` e a referencia principal de paciente nas features clinicas.

---

## Tabela de divergencias

| # | Descricao | Backend atual | Impacto frontend | Severidade |
|---|---|---|---|---|
| D01 | `POST /session` e `POST /session/refresh` nao usam envelope global | Os controllers escrevem `res.json(...)`; a resposta nao vem em `{ data }` | Tratar login/refresh como excecao e chamar `GET /me` para obter perfis/contextos | Media |
| D02 | `POST /sign-out` nao e publico | `@Public()` esta comentado; alem do `JwtRefreshGuard`, o guard global exige access token | Enviar access token/cookie e refresh token; nao tratar logout como chamada anonima | Media |
| D03 | `GET /plans` e `GET /plans/:id` exigem autenticacao | Nao ha `@Public()`; guard global protege as rotas | Nao renderizar tela publica de planos usando essas rotas sem sessao | Media |
| D04 | `AccountStatusGuard` nao bloqueia por pagamento/plano | Bloco de validacao de `Payment` esta comentado | Nao assumir liberacao/bloqueio de acesso apos `POST /billing` | Alta |
| D05 | `POST /billing` nao cria `Payment` local | Use case cria cobranca externa no AbacatePay e retorna dados da cobranca | Fluxo de assinatura local ainda nao existe; tratar como link/cobranca externa | Alta |
| D06 | `POST /registration-links` usa id errado de contexto | Controller passa `user.sub` como `psychologistPracticeContextId` e nao usa `PracticeContextGuard` | Link pode falhar depois como `REGISTRATION_LINK_ORPHAN`; preferir convite por token/codigo | Alta |
| D07 | `POST /patient-profiles` nao usa `PracticeContextGuard` | Rota le `x-psychologist-practice-context-id` manualmente e `PermissionsGuard` nao tem metadata ativa | Enviar header mesmo assim; backend nao valida ownership no guard dessa rota | Media |
| D08 | `PermissionsGuard` nao restringe `POST /patient-profiles` | Nao ha uso de `@Permissions(...)` nessa rota | Nao depender de permissao granular no frontend; restricao real e apenas auth global | Media |
| D09 | Campos opcionais de paciente podem falhar quando omitidos | Schemas de create/update refinam `cpf` e `dateOfBirth` depois de `.optional()` | Enviar CPF/data validos quando usar esses campos; testar formulario sem opcionais antes de liberar | Media |
| D10 | Toggle de status de paciente esta invertido | `activate()` define `INACTIVE` e `inactivate()` define `ACTIVE` | Evitar depender de `PATCH /patient-profiles/:id/status` ate correcao | Alta |
| D11 | Filtros de `GET /patient-profiles` nao sao aplicados | Schema aceita filtros, mas controller repassa so `pageIndex` e `perPage` | Aplicar filtros no frontend ou aguardar ajuste backend | Media |
| D12 | `GET /attachments` aceita `patientId`, mas controller nao repassa ao use case | Query schema tem `patientId`; chamada ignora o valor | Nao confiar em filtro server-side por paciente nessa rota | Media |
| D13 | Avatar de paciente grava id de anexo em `profileImageUrl` | Upload `type=AVATAR` atualiza apenas se `patientId` vier junto e salva `attachment.id` | Normalizar imagem pelo endpoint de stream; nao assumir URL absoluta | Media |
| D14 | Documentos e prontuarios retornam `attachment: null` | Controllers passam `attachment: null` aos presenters mesmo com `attachmentId` | Buscar anexo separadamente se a tela precisar dos metadados/arquivo | Media |
| D15 | `Appointment.canDelete()` permite quase tudo | Condicao usa `!isInProgress() || !isFinished()` | Frontend nao deve apresentar essa regra como bloqueio confiavel | Media |
| D16 | Calculo de slots disponiveis tem risco de loop/resultado incorreto | Loop pode dar `continue` antes de avancar slot e a condicao de slot passado parece invertida | Usar `GET /appointments/available-slots` com cautela e timeout no cliente | Alta |
| D17 | `PATCH /appointments/:id/start` nao usa contexto | Rota existe sem `PracticeContextGuard`; `POST /appointments/:appointmentId/start` usa contexto | Preferir `POST /appointments/:appointmentId/start` para iniciar sessao | Media |
| D18 | Metricas do dashboard podem ignorar identidade do `PatientProfile` | Algumas agregacoes usam dados de `User` vinculado e pulam perfis sem `userId` | Nao comparar metricas do dashboard com listagem total sem considerar essa diferenca | Media |
| D19 | Popups podem registrar visualizacao com id de profile em campo de user | View recebe `psychologistProfile.id`, enquanto schema referencia `User` | Validar comportamento em producao antes de depender de "visto" como auditoria | Media |
| D20 | Admin metrics nao tem guard de role | Rotas `/admin/metrics/psychologists/*` exigem auth, mas nao role ADMIN | Nao expor link no frontend para usuarios comuns; backend ainda precisa endurecer regra | Media |
| D21 | Rotas de clinica nao tem ownership/role guard especifico | Controllers estao autenticados, mas nao validam papel dentro da clinica | Tratar UI de clinica como administrativa e evitar expor a usuarios indevidos | Media |
| D22 | `GET /patient-profiles/claim-requests/:id` depende de contexto | Usa `PracticeContextGuard`; global auth tambem se aplica | Enviar `x-psychologist-practice-context-id` tambem no detalhe da solicitacao | Baixa |
| D23 | Parametro `patientId` em anamnese e na pratica `patientProfileId` | Rotas continuam em `/patients/:patientId/anamnesis` | Passar `PatientProfile.id`, nao `User.id` | Media |
| D24 | `Popup` ainda tem campo legado nullable `psychologistId` | Schema atual mantem `psychologistId` alem de `psychologistProfileId` | Ignorar `psychologistId` no frontend; usar dados retornados pelos endpoints | Baixa |

---

## Comportamentos que estao alinhados

| Area | Estado atual |
|---|---|
| `consultationFee` | Fica em `PsychologistPracticeContext` e e exposto em `GET /me.data.practiceContexts[]` |
| `nickname` | Fica em `PsychologistPracticeContext` e e exposto em `GET /me.data.practiceContexts[]` |
| `professionalBio` | Fica em `PsychologistProfile` e e exposto em `GET /me.data.psychologistProfile` |
| `clinicMemberContexts` | `GET /me` busca memberships reais via repositorio de clinic members |
| `AppointmentStatus` | Enum atual usa `SCHEDULED`, `ATTENDING`, `FINISHED`, `CANCELED`, `NOT_ATTEND`, `RESCHEDULED`; nao ha `DONE` |
| Aprovacao manual de conta | Nao existe fluxo de approvals ativo; conta/profile nascem ativos no registro normal |
| CORS do header de contexto | `x-psychologist-practice-context-id` esta nos headers permitidos |
| Repositorios legados stubados | Nao sao a base das rotas atuais de paciente/psicologo; o fluxo usa `PatientProfile` e `PsychologistProfile` |

---

## Rotas removidas ou nao registradas

Nao use estas rotas no frontend atual:

| Rota antiga | Substituta real |
|---|---|
| `POST /psychologist` | `POST /psychologist/profile` |
| `POST /auth/complete-registration` | `POST /psychologist/profile` apos OAuth/login |
| `POST /psychologist/practice-contexts` | `POST /psychologist/practice-context` |
| `POST /patient` | `POST /patient-profiles` |
| `POST /patient/profile` | `POST /me/patient-profiles` |
| `GET /patients/stats/*` | `GET /patient-profiles/metrics/*` |
| `GET /patients/filter/with-attachments` | `GET /patient-profiles/with-attachments` |
| `GET /patients/:id/details` | `GET /patient-profiles/:id/details` |
| `GET /psychologists/search` | `GET /psychologist/profile/search` |
| `GET /psychologists/:cpf` / `:crp` / `:email` | `GET /psychologist/profile/search?cpf=...&crp=...&email=...` |
| `POST /invites` / `GET /invites/:hash` | `POST /registration-links` / `GET /registration-links/:hash` |

---

## Regras praticas para o frontend

### Auth e envelope

- Assuma envelope `{ data, message?, error? }` na maioria das rotas.
- Excecoes confirmadas: `POST /session`, `POST /session/refresh`, redirects OAuth e streams de anexo.
- Depois de login/refresh, use `GET /me` como fonte de verdade para perfis, contextos e memberships.

### Contexto de psicologo

- Use `GET /me.data.practiceContexts` para montar o seletor de contexto.
- Envie `x-psychologist-practice-context-id` em todas as rotas documentadas com `PracticeContextGuard`.
- Se a rota cria dado clinico mas ainda nao tem guard, como `POST /patient-profiles`, envie o header mesmo assim para compatibilidade.

### Pacientes

- Use `PatientProfile.id` em agendamentos, anamnese, documentos, prontuarios, observacoes, anexos e detalhes.
- Nao use `User.id` como paciente salvo quando a rota espera `patientProfileId`.
- Nao dependa de `status` toggle ate o backend corrigir a inversao.

### Planos e cobranca

- `GET /plans` e autenticado.
- `POST /billing` cria cobranca externa, nao assinatura local.
- O frontend nao deve implementar controle de acesso baseado em `Payment` local porque o backend atual nao aplica essa regra.

### Arquivos

- `POST /attachments` aceita multipart com `file`, `patientId` e `type`.
- `GET /attachments/:id` retorna stream autenticado.
- `profileImageUrl` pode ser id de anexo.

---

## Decisoes pendentes no backend antes de depender em producao

| # | Decisao | Motivo |
|---|---|---|
| B01 | Corrigir `POST /registration-links` para usar contexto real | Link atual pode ser criado com `psychologistPracticeContextId` invalido |
| B02 | Definir fluxo real de assinatura/pagamento | `POST /billing` externo nao se conecta ao `AccountStatusGuard` |
| B03 | Aplicar `PracticeContextGuard` em `POST /patient-profiles` | Hoje a rota valida contexto manualmente e de forma incompleta |
| B04 | Corrigir schemas opcionais de paciente | Campos opcionais podem falhar quando omitidos |
| B05 | Corrigir toggle de status de `PatientProfile` | Ativar/inativar esta invertido no dominio |
| B06 | Corrigir slots disponiveis | Ha risco de loop e condicao invertida |
| B07 | Endurecer guards de admin/clinica | Rotas autenticadas ainda nao validam papel de negocio |
| B08 | Decidir formato de avatar | Hoje `profileImageUrl` pode guardar id de anexo, nao URL |
| B09 | Repassar filtros aceitos nos controllers | `GET /patient-profiles` e `GET /attachments` aceitam filtros que nao chegam ao use case |

---

## Sumario para o time de frontend

### Use com confianca

- `POST /user`
- `POST /session`, tratando resposta sem envelope
- `POST /session/refresh`, tratando resposta sem envelope
- `GET /me`
- `POST /psychologist/profile`
- `PATCH /psychologist/profile`
- `POST /psychologist/practice-context`
- `GET /psychologists`
- `GET /psychologist/profile/:id`
- `GET /psychologist/profile/search`
- `POST /me/patient-profiles`
- Rotas clinicas com `PracticeContextGuard`, desde que o header de contexto seja enviado
- `GET /address/cep/:cep`

### Use com cautela

- `POST /patient-profiles` por falta de `PracticeContextGuard`
- `PATCH /patient-profiles/:id/status` por inversao de status
- `GET /appointments/available-slots` por risco de loop/resultado incorreto
- `POST /registration-links` por contexto invalido
- `POST /billing` porque nao cria assinatura local
- `GET /plans` em tela publica, porque exige auth
- Rotas de admin/clinica, porque ainda nao tem guard de papel/ownership

### Nao use

- Rotas antigas listadas em "Rotas removidas ou nao registradas"
- Campos legados como `psychologistId` em `Popup`
- `subscriptionPlanId` em `POST /billing`
- `DONE` como status de appointment
- `isActive` como campo HTTP de `PatientProfile`; use `status`
