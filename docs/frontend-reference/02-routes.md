# 02 - Inventário Completo de Rotas

> Fonte primária: controllers registrados em `HttpModule`, `AuthModule`, guards globais em `AppModule` e validators Zod.
> Esta lista considera controllers registrados nos módulos; arquivos soltos não registrados não entram no contrato.

---

## Regras Globais

### Autenticação

Todas as rotas sem `@Public()` exigem autenticação por causa dos guards globais:

- `JwtAuthGuard`: lê `access_token` do cookie HTTP-only ou `Authorization: Bearer <jwt>`.
- `AccountStatusGuard`: valida usuário, conta, status, perfil de psicólogo e blacklist.

Rotas públicas reais:

| Método | Path |
|---|---|
| `POST` | `/user` |
| `POST` | `/session` |
| `POST` | `/session/refresh` |
| `GET` | `/auth/google` |
| `GET` | `/auth/google/callback` |
| `GET` | `/address/cep/:cep` |
| `GET` | `/registration-links/:hash` |
| `GET` | `/patient-profiles/invites/:token` |
| `POST` | `/patient-profiles/invites/:token/register` |
| `POST` | `/patient-profiles/registration-links/:hash/register` |

`POST /sign-out` não está marcado com `@Public()`. Na implementação atual ele passa pelo `JwtAuthGuard` global e também pelo `JwtRefreshGuard` local.

### Envelope

Resposta padrão:

```json
{
  "success": true,
  "statusCode": 200,
  "data": {}
}
```

No objeto TypeScript, `message` e `error` são `undefined` quando ausentes; na serialização JSON esses campos podem ser omitidos. O frontend deve depender de `success`, `statusCode`, `data` e, em falhas, `error`.

Exceções:

- `POST /session`: JSON cru.
- `POST /session/refresh`: JSON cru.
- `GET /auth/google/callback`: redirect.
- `GET /attachments/:id`: stream do arquivo.
- Rotas `204`: sem payload útil.

### Header de contexto

Rotas marcadas com `Contexto = Sim` exigem:

```http
x-psychologist-practice-context-id: <uuid>
```

Erros do `PracticeContextGuard`:

| Situação | HTTP | Code |
|---|---:|---|
| Header ausente | 400 | `BAD_REQUEST` |
| Header não UUID | 400 | `BAD_REQUEST` |
| Contexto inexistente | 404 | `NOT_FOUND` |
| Contexto de outro usuário | 403 | `FORBIDDEN` |

---

## Inventário de Endpoints

Legenda:

- `Público`: rota tem `@Public()`.
- `Contexto`: rota usa `PracticeContextGuard`.
- `Manual`: lê `x-psychologist-practice-context-id` manualmente, sem `PracticeContextGuard`.
- Rotas com `Público = Não` exigem access token pela guarda global, mesmo quando não há guard local no controller.

| Método | Path | Público | Contexto | Observações |
|---|---|---:|---:|---|
| `GET` | `/address/cep/:cep` | Sim | Não | CEP com 8 dígitos; retorna endereço ViaCEP em `data` |
| `GET` | `/address/:id` | Não | Não | Retorna `{ address }` |
| `PUT` | `/address/:id` | Não | Não | Atualiza endereço; retorna `data: null` |
| `POST` | `/user` | Sim | Não | Cria `User` + conta credentials `ACTIVE` |
| `POST` | `/session` | Sim | Não | Login; resposta sem envelope |
| `POST` | `/session/refresh` | Sim | Não | Usa cookie `refresh_token`; resposta sem envelope |
| `POST` | `/sign-out` | Não | Não | Usa `JwtRefreshGuard`; exige também access token global |
| `GET` | `/me` | Não | Não | Contexto autenticado completo |
| `GET` | `/auth/google` | Sim | Não | Redirect para Google OAuth |
| `GET` | `/auth/google/callback` | Sim | Não | Seta cookies e redireciona |
| `POST` | `/psychologist/profile` | Não | Não | Cria profile do usuário autenticado |
| `PATCH` | `/psychologist/profile` | Não | Não | Atualiza user + profile |
| `GET` | `/psychologist/profile/search` | Não | Não | Busca por `cpf`, `crp` ou `email` |
| `GET` | `/psychologist/profile/:id` | Não | Não | `id` = `PsychologistProfile.id` |
| `DELETE` | `/psychologist/:psychologistProfileId` | Não | Não | Remove profile |
| `GET` | `/psychologists` | Não | Não | Lista psicólogos |
| `POST` | `/psychologist/practice-context` | Não | Não | Cria contexto; path singular |
| `GET` | `/availabilities` | Não | Sim | Lista disponibilidade do contexto |
| `POST` | `/availabilities` | Não | Sim | Substitui/cria slots de disponibilidade |
| `GET` | `/admin/metrics/psychologists/total` | Não | Não | Métrica admin, sem role guard real |
| `GET` | `/admin/metrics/psychologists/new` | Não | Não | Query `from`, `to` opcionais |
| `GET` | `/admin/metrics/psychologists/age-range` | Não | Não | Métrica admin, sem role guard real |
| `GET` | `/admin/metrics/psychologists/gender` | Não | Não | Métrica admin, sem role guard real |
| `POST` | `/me/patient-profiles` | Não | Não | Cria perfil próprio vinculado ou não a contexto |
| `GET` | `/me/patient-profiles/claim-candidates` | Não | Não | Candidatos a vínculo do usuário autenticado |
| `GET` | `/patient-profiles` | Não | Sim | Lista pacientes do contexto |
| `POST` | `/patient-profiles` | Não | Manual | Cria paciente pelo psicólogo; header lido manualmente |
| `GET` | `/patient-profiles/with-attachments` | Não | Sim | Lista pacientes; attachments não são incluídos no presenter |
| `GET` | `/patient-profiles/:id` | Não | Sim | Detalhe resumido do paciente |
| `PUT` | `/patient-profiles/:id` | Não | Sim | Atualiza dados do paciente |
| `DELETE` | `/patient-profiles/:id` | Não | Não | Remove profile por owner (`user.sub`) |
| `PATCH` | `/patient-profiles/:id/archive` | Não | Sim | Arquiva profile |
| `PATCH` | `/patient-profiles/:id/status` | Não | Sim | Implementação atual tem risco de não alterar status |
| `GET` | `/patient-profiles/:id/details` | Não | Sim | Retorna paciente + sessões paginadas |
| `GET` | `/patient-profiles/cpf/:cpf` | Não | Sim | Busca por CPF no contexto |
| `GET` | `/patient-profiles/email/:email` | Não | Sim | Busca por email no contexto |
| `GET` | `/patient-profiles/metrics/active` | Não | Sim | Total ativo no contexto |
| `GET` | `/patient-profiles/metrics/new` | Não | Sim | Query `startDate`, `endDate` obrigatórias |
| `GET` | `/patient-profiles/metrics/gender` | Não | Sim | Distribuição por gênero |
| `GET` | `/patient-profiles/metrics/age` | Não | Sim | Distribuição por idade |
| `GET` | `/patient-profiles/metrics/total` | Não | Não | Total por usuário autenticado |
| `GET` | `/patient-profiles/invites/:token` | Sim | Não | Valida convite de profile |
| `POST` | `/patient-profiles/invites/:token/register` | Sim | Não | Registra novo usuário via convite |
| `POST` | `/patient-profiles/invites/:token/accept` | Não | Não | Usuário autenticado aceita convite |
| `POST` | `/patient-profiles/invites/:token/reject` | Não | Não | Usuário autenticado rejeita convite |
| `POST` | `/patient-profiles/registration-links/:hash/register` | Sim | Não | Registro via `RegistrationLink` |
| `POST` | `/patient-profiles/:patientProfileId/access-code` | Não | Sim | Gera código cru de vínculo |
| `POST` | `/patient-profiles/access-code/claim` | Não | Não | Usuário reivindica profile por código |
| `POST` | `/patient-profiles/claim-requests` | Não | Não | Cria solicitação de vínculo |
| `GET` | `/patient-profiles/claim-requests` | Não | Sim | Lista solicitações do contexto |
| `GET` | `/patient-profiles/claim-requests/:id` | Não | Sim | Guard global autentica; local só tem `PracticeContextGuard` |
| `POST` | `/patient-profiles/claim-requests/:id/approve` | Não | Sim | Aprova solicitação |
| `POST` | `/patient-profiles/claim-requests/:id/reject` | Não | Sim | Rejeita solicitação |
| `GET` | `/patients/:patientId/anamnesis` | Não | Sim | `patientId` = `patientProfileId` |
| `PUT` | `/patients/:patientId/anamnesis` | Não | Sim | Body é JSON livre |
| `POST` | `/appointments` | Não | Sim | Cria agendamento |
| `GET` | `/appointments` | Não | Sim | Lista por contexto |
| `GET` | `/appointments/:id` | Não | Sim | Busca por id no contexto |
| `PUT` | `/appointments/:id` | Não | Sim | Atualiza campos parciais |
| `DELETE` | `/appointments/:id` | Não | Sim | 204; regra de bloqueio tem risco |
| `PATCH` | `/appointments/:id/cancel` | Não | Sim | Cancela |
| `PUT` | `/appointments/:id/reschedule` | Não | Sim | Body `{ newDate }` |
| `PATCH` | `/appointments/:id/start` | Não | Não | Inicia status sem contexto |
| `POST` | `/appointments/:appointmentId/start` | Não | Sim | Cria sessão de atendimento |
| `GET` | `/appointments/pending/:patientProfileId` | Não | Sim | Próximo agendamento pendente |
| `GET` | `/appointments/context/:practiceContextId` | Não | Não | Recebe context id no path, sem ownership guard |
| `GET` | `/appointments/available-slots` | Não | Não | Query `psychologistPracticeContextId`, `date` |
| `GET` | `/appointments/active/grouped` | Não | Sim | Agrupa por `yyyy-MM-dd` |
| `GET` | `/appointments/metrics/month-count` | Não | Sim | Query `startDate`, `endDate` opcionais |
| `GET` | `/appointments/metrics/daily-count` | Não | Sim | Query `startDate`, `endDate` opcionais |
| `POST` | `/sessions/:id/finish` | Não | Sim | Finaliza sessão |
| `GET` | `/sessions/total-work-hours` | Não | Sim | Soma minutos finalizados |
| `POST` | `/documents` | Não | Sim | Cria documento |
| `GET` | `/documents/patient-profile/:patientProfileId` | Não | Sim | Lista documentos |
| `POST` | `/medical-records` | Não | Sim | Cria prontuário |
| `GET` | `/medical-records/patient-profile/:patientProfileId` | Não | Sim | Lista prontuários |
| `POST` | `/observations` | Não | Sim | Cria observação |
| `GET` | `/observations/patient-profile/:patientProfileId` | Não | Sim | Lista observações |
| `POST` | `/attachments` | Não | Não | Multipart `file`; auth global |
| `GET` | `/attachments` | Não | Não | Lista anexos |
| `GET` | `/attachments/:id` | Não | Não | Stream autenticado |
| `DELETE` | `/attachments/:id` | Não | Não | 204 |
| `GET` | `/attachments/patient/:patientId` | Não | Não | `patientId` = `patientProfileId` |
| `GET` | `/plans` | Não | Não | Autenticado globalmente, apesar de sem guard local |
| `GET` | `/plans/:id` | Não | Não | Autenticado globalmente |
| `POST` | `/subscription-plan` | Não | Não | Cria plano; sem role guard |
| `DELETE` | `/subcription-plan/:planId` | Não | Não | Typo real: `subcription` |
| `POST` | `/billing` | Não | Não | Cria cobrança externa AbacatePay |
| `POST` | `/suggestions` | Não | Não | Multipart `files`; exige profile de psicólogo |
| `GET` | `/suggestions` | Não | Não | Autenticado globalmente |
| `PATCH` | `/suggestions/:id/like` | Não | Não | Exige profile de psicólogo |
| `GET` | `/suggestions/ranking` | Não | Não | Ranking |
| `GET` | `/admin/metrics/suggestions/total` | Não | Não | Sem role guard real |
| `GET` | `/admin/metrics/suggestions/most-voted` | Não | Não | Sem role guard real |
| `PATCH` | `/admin/suggestions/:id/status` | Não | Não | Sem role guard real |
| `GET` | `/popups/active` | Não | Não | Exige profile de psicólogo |
| `GET` | `/popups/unseen` | Não | Não | Exige profile de psicólogo |
| `POST` | `/popups/:id/view` | Não | Não | Marca popup visto |
| `GET` | `/dashboard` | Não | Sim | Dashboard do contexto |
| `GET` | `/admin/metrics/patients/new` | Não | Não | Query `startDate`, `endDate` obrigatórias |
| `POST` | `/registration-links` | Não | Não | Risco: usa `user.sub` como context id |
| `GET` | `/registration-links/:hash` | Sim | Não | Busca metadata do link |
| `POST` | `/clinics` | Não | Não | Cria clínica |
| `GET` | `/clinics/:id` | Não | Não | Busca clínica |
| `PATCH` | `/clinics/:id/responsible` | Não | Não | Define responsável |
| `POST` | `/clinic-branches` | Não | Não | Cria filial |
| `GET` | `/clinic-branches/clinic/:clinicId` | Não | Não | Lista filiais |
| `POST` | `/clinic-members` | Não | Não | Adiciona membro |
| `GET` | `/clinic-members/clinic/:clinicId` | Não | Não | Lista membros |
| `POST` | `/clinic-psychologists` | Não | Não | Vincula psicólogo à clínica |
| `GET` | `/clinic-psychologists/clinic/:clinicId` | Não | Não | Lista psicólogos da clínica |

---

## Auth / Sessão

### POST /session

Body:

```json
{
  "email": "user@example.com",
  "password": "Senha@123"
}
```

Resposta sem envelope:

```json
{
  "message": "Login realizado com sucesso!",
  "user": {
    "id": "uuid",
    "firstName": "João",
    "lastName": "Silva",
    "email": "joao@example.com",
    "status": "ACTIVE",
    "profileImageUrl": null
  }
}
```

Cookies definidos: `access_token` e `refresh_token`.

### POST /session/refresh

Usa cookie `refresh_token`.

Resposta sem envelope:

```json
{
  "message": "Tokens renovados com sucesso!",
  "user": {
    "id": "uuid",
    "email": "joao@example.com",
    "profileImageUrl": null
  }
}
```

O código tenta retornar `role`, mas o token service atual não assina `role`; em JSON essa chave pode não aparecer.

### POST /sign-out

Limpa cookies. Como `@Public()` está comentado, o frontend deve enviar cookies de access e refresh válidos.

### GET /me

Retorna o shape completo documentado em `01-entities-and-types.md`.

---

## Usuário Base

### POST /user

Body:

```json
{
  "firstName": "João",
  "lastName": "Silva",
  "socialName": "opcional, mas ignorado pelo use case",
  "email": "joao@example.com",
  "password": "Senha@123_",
  "phoneNumber": "11999999999",
  "profileImageUrl": null,
  "dateOfBirth": "1990-05-15",
  "cpf": "12345678909",
  "gender": "MASCULINE"
}
```

Validações:

- `password`: 8 a 30 caracteres, com minúscula, maiúscula, número e um dos caracteres `!@#$%^&*_`.
- `dateOfBirth`: opcional; schema rejeita datas com mais de 120 anos, use case rejeita data futura.
- `cpf`: opcional; quando presente, validado por CPF.
- Cria conta credentials `ACTIVE`.

Resposta envelopada:

```json
{
  "message": "Usuário criado com sucesso."
}
```

---

## Psicólogo

### POST /psychologist/profile

Body:

```json
{
  "crp": "0612345",
  "expertise": "CLINICAL",
  "honorific": "MASC_DR",
  "professionalName": "Dr. João Silva",
  "languages": ["PORTUGUESE"],
  "professionalBio": "Texto opcional"
}
```

Resposta `data`: `PsychologistProfileHTTP`.

### POST /psychologist/practice-context

Path real é singular: `/psychologist/practice-context`.

Body:

```json
{
  "contextType": "INDIVIDUAL",
  "clinicId": null,
  "clinicBranchId": null,
  "consultationFee": 15000,
  "nickname": "Consultório"
}
```

Resposta `data`: `PsychologistPracticeContextHTTP`.

### GET /psychologist/profile/search

Query:

```ts
{
  cpf?: string
  crp?: string
  email?: string
}
```

O use case valida parâmetros de busca; use exatamente um filtro.

Resposta:

```json
{
  "psychologistProfile": { "...": "PsychologistProfileHTTP" }
}
```

### GET /psychologists

Query:

```ts
{
  pageIndex?: number // default 0
  perPage?: number   // default 10
}
```

Resposta:

```json
{
  "psychologists": [
    {
      "id": "psychologistProfileId",
      "userId": "userId",
      "firstName": "João",
      "lastName": "Silva",
      "name": "João Silva",
      "email": "joao@example.com",
      "cpf": null,
      "phoneNumber": null,
      "profileImageUrl": null,
      "dateOfBirth": null,
      "gender": "MASCULINE",
      "crp": "0612345",
      "expertise": "CLINICAL",
      "honorific": "MASC_DR",
      "professionalName": "Dr. João Silva",
      "languages": ["PORTUGUESE"],
      "status": "ACTIVE",
      "createdAt": "2026-01-01T00:00:00.000Z"
    }
  ]
}
```

---

## Patient Profiles

### POST /me/patient-profiles

Cria perfil próprio para o usuário autenticado.

Body:

```json
{
  "psychologistPracticeContextId": "uuid-ou-null"
}
```

Resposta `data`: `PatientProfileHTTP`.

### POST /patient-profiles

Cria paciente pelo psicólogo.

Header:

```http
x-psychologist-practice-context-id: <uuid>
```

Importante: esta rota não usa `PracticeContextGuard`; o header é lido manualmente e passado ao use case.

Body:

```json
{
  "firstName": "Maria",
  "lastName": "Santos",
  "email": "maria@example.com",
  "phoneNumber": "11999999999",
  "profileImageUrl": null,
  "dateOfBirth": "1995-03-20",
  "cpf": "98765432100",
  "gender": "FEMININE",
  "zipCode": "01310100",
  "street": "Av. Paulista",
  "neighborhood": "Bela Vista",
  "city": "São Paulo",
  "state": "SP"
}
```

Risco real: no schema atual, `cpf` e `dateOfBirth` foram marcados como opcionais antes de `.refine(...)`; omitir esses campos pode falhar na validação. Veja `04-known-divergences-and-risks.md`.

Resposta:

```json
{
  "patientProfile": { "...": "PatientProfileHTTP" }
}
```

### GET /patient-profiles

Query aceita pelo schema:

```ts
{
  pageIndex?: number
  perPage?: number
  filter?: string
  status?: AccountStatus
  gender?: Gender
  order?: 'asc' | 'desc'
  sessionVolume?: string
}
```

Controller usa efetivamente `pageIndex` e `perPage`; outros filtros são aceitos pelo schema mas não são repassados ao use case atual.

Resposta:

```json
{
  "patients": ["PatientHTTP"],
  "meta": {
    "pageIndex": 0,
    "perPage": 10,
    "totalCount": 42
  }
}
```

### GET /patient-profiles/:id/details

Query:

```ts
{
  pageIndex?: number
  perPage?: number
}
```

Resposta:

```json
{
  "patient": {
    "id": "uuid",
    "firstName": "Maria",
    "lastName": "Santos",
    "cpf": null,
    "email": "maria@example.com",
    "profileImageUrl": null,
    "phoneNumber": null,
    "dateOfBirth": null,
    "gender": "FEMININE",
    "sessions": [
      {
        "id": "uuid",
        "date": "2026-01-01T00:00:00.000Z",
        "sessionDate": "2026-01-01T00:00:00.000Z",
        "createdAt": "2026-01-01T00:00:00.000Z",
        "theme": "Diagnóstico",
        "duration": 60,
        "status": "FINISHED",
        "content": "Notas"
      }
    ]
  },
  "meta": {}
}
```

### Convites e vínculo

| Fluxo | Rotas |
|---|---|
| Validar convite por token | `GET /patient-profiles/invites/:token` |
| Registrar novo usuário via token | `POST /patient-profiles/invites/:token/register` |
| Aceitar convite com usuário existente | `POST /patient-profiles/invites/:token/accept` |
| Rejeitar convite | `POST /patient-profiles/invites/:token/reject` |
| Registro por registration link | `POST /patient-profiles/registration-links/:hash/register` |
| Gerar código de acesso | `POST /patient-profiles/:patientProfileId/access-code` |
| Reivindicar por código | `POST /patient-profiles/access-code/claim` |
| Criar claim request | `POST /patient-profiles/claim-requests` |
| Listar claim requests | `GET /patient-profiles/claim-requests` |
| Detalhar claim request | `GET /patient-profiles/claim-requests/:id` |
| Aprovar/rejeitar claim request | `POST /patient-profiles/claim-requests/:id/approve` / `reject` |

---

## Agendamentos

### POST /appointments

Body:

```json
{
  "patientProfileId": "uuid",
  "diagnosis": "Ansiedade",
  "content": "opcional",
  "scheduledAt": "2026-07-15T10:00:00.000Z",
  "status": "SCHEDULED"
}
```

Resposta:

```json
{
  "message": "Agendamento criado com sucesso",
  "appointment": { "...": "AppointmentHTTP" }
}
```

### GET /appointments

Query:

```ts
{
  pageIndex?: number
  perPage?: number
  orderBy?: 'asc' | 'desc'
  startDate?: Date
  endDate?: Date
  patientName?: string
}
```

Resposta:

```json
{
  "appointments": ["AppointmentHTTP"]
}
```

### GET /appointments/available-slots

Query real:

```ts
{
  psychologistPracticeContextId: string
  date: Date
}
```

Resposta:

```json
{
  "slots": ["09:00", "10:00"]
}
```

Risco real: a implementação atual do loop pode não avançar em alguns branches. Veja `04-known-divergences-and-risks.md`.

### Sessão

| Método | Path | Body | Resposta |
|---|---|---|---|
| `PATCH` | `/appointments/:id/start` | nenhum | 204, só muda status |
| `POST` | `/appointments/:appointmentId/start` | nenhum | `{ message, sessionId }` |
| `POST` | `/sessions/:id/finish` | `{ content?: string }` | 200 com `data: null` |

---

## Anamnese

Path legado mantido:

```http
/patients/:patientId/anamnesis
```

`patientId` é tratado como `PatientProfile.id`.

`GET` retorna:

```json
{
  "anamnesis": {
    "id": "uuid",
    "patientId": "patientProfileId",
    "content": {},
    "createdAt": "2026-01-01T00:00:00.000Z"
  }
}
```

ou:

```json
{ "anamnesis": null }
```

`PUT` aceita qualquer objeto JSON e sobrescreve o conteúdo.

---

## Documentos / Prontuários / Observações

Todas exigem `PracticeContextGuard`.

| Recurso | Criar | Listar |
|---|---|---|
| Documentos | `POST /documents` | `GET /documents/patient-profile/:patientProfileId` |
| Prontuários | `POST /medical-records` | `GET /medical-records/patient-profile/:patientProfileId` |
| Observações | `POST /observations` | `GET /observations/patient-profile/:patientProfileId` |

Bodies:

```ts
// POST /documents
{ patientProfileId: string, type: 'RG' | 'CPF' | 'CNH' | 'OTHER', attachmentId?: string | null }

// POST /medical-records
{ patientProfileId: string, content?: string | null, attachmentId?: string | null }

// POST /observations
{ patientProfileId: string, content: string }
```

Os controllers atuais passam `attachment: null` para os presenters de documentos e prontuários.

---

## Anexos

### POST /attachments

Content-Type: `multipart/form-data`.

Campos:

- `file`: obrigatório.
- `patientId`: opcional.
- `type`: opcional.

Validação:

- MIME: `image/jpeg`, `image/jpg`, `image/png`, `application/pdf`.
- Máximo: 3 MB.

Resposta:

```json
{
  "attachmentId": "uuid",
  "url": "https://storage.example.com/file.pdf"
}
```

Avatar:

- Só atualiza usuário se `patientId` estiver presente e `type === "AVATAR"`.
- Atualiza `profileImageUrl` com `attachment.id`, não com a URL.

### GET /attachments

Query:

```ts
{
  page?: string
  filter?: string
  patientId?: string
  from?: string
  to?: string
}
```

`patientId` é aceito pelo schema, mas o controller não repassa ao use case atual.

---

## Billing / Planos

### POST /billing

Body real:

```json
{
  "patientEmail": "paciente@example.com",
  "patientTaxId": "12345678909",
  "patientName": "Maria Santos",
  "amountInCents": 15000,
  "consultationDetails": "Sessão de psicologia",
  "frequency": "ONE_TIME",
  "methods": ["PIX", "CARD"],
  "returnUrl": "https://app.example.com/return",
  "completionUrl": "https://app.example.com/success"
}
```

Resposta:

```json
{
  "message": "Cobrança criada com sucesso!",
  "billingId": "external-id",
  "billingUrl": "https://...",
  "amount": 15000
}
```

Não cria `Payment` local no fluxo atual.

### Planos

`GET /plans` e `GET /plans/:id` são autenticados globalmente. Não estão públicos.

`DELETE /subcription-plan/:planId` mantém o typo `subcription`.

---

## Sugestões

### POST /suggestions

Content-Type: `multipart/form-data`.

Campos:

```ts
{
  title: string      // min 5
  description: string // min 10
  category: SuggestionCategory
  files?: File[]
}
```

Resposta atual:

```json
{
  "message": "Suggestion sent successfully"
}
```

### GET /suggestions

Query:

```ts
{
  category?: SuggestionCategory
  status?: SuggestionStatus | SuggestionStatus[]
  sortBy?: 'recent' | 'most_voted'
  search?: string
}
```

O controller passa apenas `status[0]` ao use case.

---

## Popups

| Método | Path | Resposta |
|---|---|---|
| `GET` | `/popups/active` | `{ popups }`, sem `internalName` |
| `GET` | `/popups/unseen` | `{ popups }`, com `internalName` via presenter |
| `POST` | `/popups/:id/view` | `{ success: true }` |

As rotas exigem `PsychologistProfile`; usuários sem profile recebem `PSYCHOLOGIST_PROFILE_NOT_FOUND`.

---

## Dashboard / Admin

### GET /dashboard

Query:

```ts
{
  startDate?: Date
  endDate?: Date
}
```

Resposta:

```ts
{
  totalPatients: number
  patientsByGender: Array<{ gender: Gender, count: number }>
  patientsByAge: Array<{ range: '0-17' | '18-25' | '26-35' | '36-50' | '51+', count: number }>
  upcomingAppointments: AppointmentHTTP[]
  newPatientsLast7Days: Array<{ date: string, newPatients: number }>
}
```

`newPatientsLast7Days` só é calculado se `startDate` e `endDate` forem enviados.

### Métricas admin

As rotas `/admin/...` exigem autenticação, mas não há guard real de role/admin no código atual.

---

## Registration Links

### POST /registration-links

Resposta:

```json
{
  "qrCodeLink": "https://frontend/invite/hash",
  "hash": "hash"
}
```

Risco real: o controller chama o use case com `psychologistPracticeContextId: user.sub`; o use case espera id de `PsychologistPracticeContext`. Link gerado pode ficar órfão.

### GET /registration-links/:hash

Público. Resposta:

```json
{
  "psychologistId": "psychologistProfileId",
  "psychologistName": "João Silva",
  "expiresAt": "2026-01-01T00:00:00.000Z"
}
```

---

## Rotas Removidas / Não Registradas

Não use estes paths no frontend:

| Path antigo | Status atual |
|---|---|
| `POST /psychologist` | Não registrado |
| `POST /auth/complete-registration` | Não registrado |
| `GET /approvals` | Não registrado |
| `PATCH /approvals/:id/approve` | Não registrado |
| `GET /psychologists/search` | Não registrado; use `GET /psychologist/profile/search` |
| `GET /psychologists/:cpf`, `:crp`, `:email` | Não registrados |
| `POST /patient` | Não registrado; use `POST /patient-profiles` |
| `POST /patient/profile` | Não registrado; use `POST /me/patient-profiles` |
| `GET /patients/stats/*` | Não registrado; use `/patient-profiles/metrics/*` |
| `GET /patients/filter/with-attachments` | Não registrado; use `/patient-profiles/with-attachments` |
| `GET /invites/:hash` | Não registrado; use `/registration-links/:hash` ou `/patient-profiles/invites/:token` conforme o fluxo |
| `POST /invites/:hash/register` | Não registrado; use `/patient-profiles/registration-links/:hash/register` |
| `POST /psychologist/practice-contexts` | Não registrado; use `/psychologist/practice-context` |
