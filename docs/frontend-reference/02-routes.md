# 02 — Inventário Completo de Rotas

> **Fonte primária:** controllers em `src/infra/http/controllers/`, módulos `HttpModule` e `AuthModule`.  
> Confiabilidade: **ESTÁVEL** / **LEGADA** (deprecada mas registrada) / **QUEBRADA** (repositório stub) / **POTENCIALMENTE QUEBRADA**

---

## Envelope global de resposta

Todas as rotas (exceto `POST /session` e `POST /session/refresh`) retornam:

```json
{
  "success": true,
  "statusCode": 200,
  "data": { /* payload real */ },
  "message": null,
  "error": null
}
```

Erros:

```json
{
  "success": false,
  "statusCode": 400,
  "data": null,
  "message": null,
  "error": {
    "code": "NOME_DO_ERRO",
    "message": "Descrição legível"
  }
}
```

---

## Headers importantes para o frontend

### x-psychologist-practice-context-id

- **O que é:** UUID do `PsychologistPracticeContext` ativo do psicólogo.
- **Quando enviar:** Em toda rota com `PracticeContextGuard` (listadas abaixo com `🔑`).
- **Formato:** UUID v4 válido.
- **Erros se ausente:** `400 BAD_REQUEST — "Missing required header: x-psychologist-practice-context-id"`
- **Erros se inválido (não UUID):** `400 BAD_REQUEST — "Invalid UUID in header: x-psychologist-practice-context-id"`
- **Erros se contexto não existe:** `404 NOT_FOUND — "PRACTICE_CONTEXT_NOT_FOUND"`
- **Erros se contexto não é do usuário:** `403 FORBIDDEN — "PRACTICE_CONTEXT_ACCESS_DENIED"`

> ✅ **CORS (T28):** O header `x-psychologist-practice-context-id` está incluído em `allowedHeaders` (`abstract-environment.ts`). Configuração atual: `'Content-Type, Accept, Authorization, X-Requested-With, x-psychologist-practice-context-id'`. Preflight `OPTIONS` cross-origin com esse header é permitido.

### Autenticação

O `JwtAuthGuard` aceita o token de duas formas:
1. **Cookie HTTP-only:** `access_token=<jwt>` (definido pelo backend no login)
2. **Bearer token:** `Authorization: Bearer <jwt>`

Tokens:
- `access_token`: expira em **15 minutos**
- `refresh_token`: expira em **7 dias** (cookie HTTP-only, usado em `POST /session/refresh`)

### JWT Payload

```ts
{
  sub: string        // users.id (UUID)
  email: string
  provider: string   // 'credentials' | 'google' | 'linkedin'
  profileImageUrl: string | null
}
```

---

## Auth / Sessão

### POST /session

**Controller:** `AuthenticateController` (`auth.module.ts`)  
**Use case:** `AuthenticateUseCase`  
**Pública:** ✅ `@Public()`  
**AccountStatusGuard:** Bypassed

**Body:**

```json
{
  "email": "user@example.com",
  "password": "Senha@123"
}
```

**Resposta (sem envelope):**

```json
{
  "message": "Login realizado com sucesso!",
  "user": {
    "id": "uuid",
    "firstName": "João",
    "lastName": "Silva",
    "email": "user@example.com",
    "status": "ACTIVE",
    "profileImageUrl": null
  }
}
```

> ⚠️ `POST /session` **não retorna** perfis, contextos, ou informações além do status da conta.  
> ⚠️ Retorna cru (sem envelope `{ success, data }`).  
> O `status` retornado é o `AccountStatus` da conta. Contas novas são criadas `ACTIVE` (sem etapa de aprovação — T29).

**Status codes:**
- `200` — login bem-sucedido, cookies definidos
- `401` — email ou senha incorretos
- `400` — body inválido (Zod)

**Cookies definidos:**
- `access_token` (HTTP-only, 15min)
- `refresh_token` (HTTP-only, 7d)

---

### POST /session/refresh

**Controller:** `AuthenticateController`  
**Use case:** `RefreshTokenUseCase`  
**Pública:** ✅ (`@Public()` + `JwtRefreshGuard` — usa cookie `refresh_token`)

**Body:** nenhum (usa cookie)

**Resposta (sem envelope):**

```json
{
  "message": "Tokens renovados com sucesso!",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "USER",
    "profileImageUrl": null
  }
}
```

**Status codes:**
- `200` — tokens renovados, novos cookies definidos
- `401` — refresh token inválido ou expirado

---

### POST /sign-out

**Controller:** `SignOutController`  
**Use case:** `SignOutUseCase`  
**Pública:** ✅ (`@Public()` + `JwtRefreshGuard`)

**Body:** nenhum

**Resposta:** limpa cookies `access_token` e `refresh_token`

**Status codes:** `200`

---

### GET /me

**Controller:** `GetAuthenticatedPsychologistController`  
**Use case:** `GetAuthenticatedUserUseCase`  
**Auth:** `JwtAuthGuard` + `AccountStatusGuard` (global)

**Resposta (envelopada):**

```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "id": "uuid",
    "firstName": "João",
    "lastName": "Silva",
    "email": "joao@example.com",
    "cpf": null,
    "phoneNumber": null,
    "gender": "MASCULINE",
    "dateOfBirth": null,
    "profileImageUrl": null,
    "isActive": true,
    "platformRole": "USER",
    "createdAt": "2026-01-01T00:00:00.000Z",
    "psychologistProfile": {
      "id": "uuid",
      "crp": "06/12345",
      "expertise": "CLINICAL",
      "professionalBio": null,
      "status": "ACTIVE",
      "isActive": true
    },
    "practiceContexts": [
      {
        "id": "uuid",
        "contextType": "INDIVIDUAL",
        "clinicId": null,
        "clinicBranchId": null,
        "consultationFee": null,
        "nickname": null,
        "isActive": true
      }
    ],
    "patientProfiles": [
      {
        "id": "uuid",
        "psychologistPracticeContextId": null,
        "isActive": true
      }
    ],
    "clinicMemberContexts": [
      {
        "id": "uuid",
        "clinicId": "uuid",
        "branchId": null,
        "memberRole": "OWNER"
      }
    ]
  }
}
```

> ✅ **`GET /me` completo (T27):**
> - `psychologistProfile.professionalBio` — incluído
> - `practiceContexts[].consultationFee` / `nickname` — incluídos
> - `clinicMemberContexts` — reflete `ClinicMember` reais via `findManyByUserId` (não mais `[]`)

**Status codes:**
- `200` — sucesso
- `401` — token inválido
- `403` — conta desativada (`isActive=false`) ou `BLOCKED`, pagamento expirado, IP na blacklist

---

### GET /invites/:hash (Buscar link de convite)

**Controller:** `GetRegistrationLinkController`  
**Use case:** `GetRegistrationLinkByHashUseCase`  
**Pública:** ✅ `@Public()`

**Path param:** `hash` (string)

**Resposta (envelopada):**

```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "psychologistId": "uuid-do-psychologist-profile",
    "psychologistName": "Dr. Nome",
    "expiresAt": "2026-07-11T00:00:00.000Z"
  }
}
```

> Nome resolvido via `practice context → psychologist profile → user`. `psychologistId` é o id do `PsychologistProfile` dono do contexto.

**Status codes:** `200`, `404` (link não encontrado ou expirado)

---

### POST /invites (Gerar link de convite)

**Controller:** `GenerateRegistrationLinkController`  
**Use case:** `GenerateRegistrationLinkUseCase`  
**Auth:** `JwtAuthGuard` + `AccountStatusGuard` + `PracticeContextGuard` 🔑

**Header:** `x-psychologist-practice-context-id: <uuid>`

**Resposta (envelopada):**

```json
{
  "success": true,
  "statusCode": 201,
  "data": {
    "qrCodeLink": "https://app.example.com/invite/abc123",
    "hash": "abc123"
  }
}
```

---

## Usuário base

### POST /user

**Controller:** `CreateUserController`  
**Use case:** `CreateUserUseCase`  
**Pública:** ✅ `@Public()`

**Body:**

```json
{
  "firstName": "João",
  "lastName": "Silva",
  "email": "joao@example.com",
  "password": "Senha@123",
  "gender": "MASCULINE",
  "phoneNumber": null,
  "dateOfBirth": "1990-05-15",
  "cpf": "123.456.789-09",
  "profileImageUrl": null
}
```

**Validação Zod:** `src/validators/user/controllers/create-user-schema.ts`
- `password`: 8–30 chars, deve ter minúscula, maiúscula, número e especial `(!@#$%^&*)`
- `gender`: `"MASCULINE" | "FEMININE" | "OTHER"`
- `cpf`: opcional, validado pelo utilitário de CPF
- `dateOfBirth`: opcional, não pode ser data futura

**Resposta (envelopada):**

```json
{
  "success": true,
  "statusCode": 201,
  "data": {
    "message": "Usuário criado com sucesso."
  }
}
```

> ✅ A conta criada já nasce ativa (`ACTIVE`) — sem fluxo de aprovação (T29). O usuário pode criar perfil de psicólogo/paciente imediatamente. O `AccountStatusGuard` só bloqueia contas desativadas (`isActive=false`) ou `BLOCKED`.

**Status codes:**
- `201` — criado
- `400` — body inválido ou data de nascimento futura
- `409` — email ou CPF já existem (`EMAIL_ALREADY_EXISTS`, `CPF_ALREADY_EXISTS`)

---

## Psicólogo

### POST /psychologist/profile

**Controller:** `CreatePsychologistProfileController`  
**Use case:** `CreatePsychologistProfileUseCase`  
**Auth:** `JwtAuthGuard` + `AccountStatusGuard` (global)

> ✅ Acessível logo após o registro — a conta nasce `ACTIVE` (T29) e o `PsychologistProfile` é criado com `status = ACTIVE`. Não há aprovação admin.

**Body:**

```json
{
  "crp": "06/12345",
  "expertise": "CLINICAL",
  "professionalBio": "Psicólogo clínico com 10 anos de experiência"
}
```

**Validação Zod (inline no controller):**
- `crp`: string, min 1
- `expertise`: enum `Expertise`
- `professionalBio`: opcional

**Resposta (envelopada):**

```json
{
  "success": true,
  "statusCode": 201,
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "crp": "06/12345",
    "expertise": "CLINICAL",
    "professionalBio": "...",
    "status": "ACTIVE",
    "isActive": true,
    "createdAt": "2026-06-11T00:00:00.000Z"
  }
}
```

**Status codes:**
- `201` — criado
- `400` — body inválido
- `403` — conta desativada (`isActive=false`) ou `BLOCKED`
- `409` — CRP já existe (`CRP_ALREADY_EXISTS`)

---

### POST /psychologist/practice-contexts

**Controller:** `CreatePsychologistPracticeContextController`  
**Use case:** `CreatePsychologistPracticeContextUseCase`  
**Auth:** `JwtAuthGuard` + `AccountStatusGuard`

**Body:**

```json
{
  "contextType": "INDIVIDUAL",
  "clinicId": null,
  "clinicBranchId": null,
  "consultationFee": 15000,
  "nickname": "Consultório Principal"
}
```

**Regras:**
- `contextType = CLINIC` requer `clinicId`
- `consultationFee` em centavos (15000 = R$ 150,00)
- `nickname` opcional

**Resposta (envelopada):**

```json
{
  "success": true,
  "statusCode": 201,
  "data": {
    "id": "uuid",
    "psychologistProfileId": "uuid",
    "contextType": "INDIVIDUAL",
    "clinicId": null,
    "clinicBranchId": null,
    "consultationFee": 15000,
    "nickname": "Consultório Principal",
    "isActive": true,
    "createdAt": "2026-06-11T00:00:00.000Z"
  }
}
```

**Status codes:**
- `201` — criado
- `400` — body inválido ou `contextType = CLINIC` sem `clinicId`
- `403` — conta desativada (`isActive=false`) ou `BLOCKED`
- `404` — perfil de psicólogo não encontrado para este usuário

---

### POST /psychologist — ❌ REMOVIDA (T33)

`CreatePsychologistController` + use case foram deletados. Use o fluxo novo: `POST /user` + `POST /psychologist/profile` + `POST /psychologist/practice-contexts`.

---

### PATCH /psychologist/profile

**Controller:** `UpdatePsychologistByIdController`  
**Use case:** `UpdatePsychologistUseCase`  
**Auth:** `JwtAuthGuard` + `AccountStatusGuard`  
**Status:** ✅ Reparada (T22) — resolve o perfil via `findByUserId(user.sub)` (não trata `user.sub` como `psychologistId`); atualiza `User` (nome, email, telefone, imagem) + `PsychologistProfile` (crp, expertise) e salva ambos; resposta via `PsychologistPresenter.toHTTP`

**Body:** campos opcionais — `firstName`, `lastName`, `email`, `phoneNumber`, `profileImageUrl` (em `User`); `crp`, `expertise` (em `PsychologistProfile`)

---

### DELETE /psychologist/:psychologistId

**Controller:** `DeletePsychologistController`  
**Use case:** `DeletePsychologistUseCase`  
**Status:** ✅ Reparada (T23) — `:psychologistId` = `psychologistProfile.id`; valida existência (404 se ausente) e remove **apenas** o `PsychologistProfile` via `PsychologistProfileRepository.delete` (nunca o `User`)

---

### GET /psychologists (listar psicólogos)

**Controller:** `FetchPsychologistController`  
**Use case:** `FetchPsychologistUseCase`  
**Query:** `pageIndex`, `perPage`  
**Status:** ✅ Reparada (T21) — lista via `PsychologistProfileRepository.findMany()` + hidratação de `User`, paginada, serializada por `PsychologistPresenter.toHTTP`; mesma shape de `:id`/`search`

---

### GET /psychologists/:id e GET /psychologists/search

> ✅ **Colisão resolvida (T20)** — um único `PsychologistReadController` declara `@Get('search')` antes de `@Get(':id')`. Os 3 controllers por `:cpf`/`:crp`/`:email` foram removidos.

| Rota | Handler | Use case | Status |
|---|---|---|---|
| `GET /psychologists/:id` | `PsychologistReadController.getById` | `GetPsychologistByIdUseCase` | ✅ Reparada — `:id` = `psychologistProfile.id`, resolve via `PsychologistProfile` + `User`, presenter `PsychologistPresenter.toHTTP`; 404 se ausente |
| `GET /psychologists/search?cpf=\|crp=\|email=` | `PsychologistReadController.search` | `SearchPsychologistUseCase` | ✅ Nova — exatamente **um** filtro (`cpf`, `crp` ou `email`); 0 ou >1 filtro → 400; nenhum match → 404; mesma shape do `:id` |

---

### GET /approvals + PATCH /approvals/:psychologistId/approve — ❌ REMOVIDAS (T33)

A superfície de aprovação (`FetchPendingPsychologistsController`, `ApprovePsychologistController` + use cases) foi deletada. Não há fluxo de aprovação: o registro nasce `ACTIVE` (T29).

---

### POST /availabilities (definir disponibilidade) 🔑

**Controller:** `SetPsychologistAvailabilityController`  
**Use case:** `SetPsychologistAvailabilityUseCase`  
**Auth:** `JwtAuthGuard` + `PracticeContextGuard`  
**Header obrigatório:** `x-psychologist-practice-context-id`

**Body:**

```json
{
  "slots": [
    {
      "dayOfWeek": 1,
      "startTime": "09:00",
      "endTime": "17:00",
      "isActive": true
    }
  ]
}
```

**Resposta (envelopada):**

```json
{
  "success": true,
  "statusCode": 201,
  "data": { "message": "Agenda atualizada com sucesso!" }
}
```

---

### GET /availabilities 🔑

**Controller:** `GetPsychologistAvailabilityController`  
**Auth:** `JwtAuthGuard` + `PracticeContextGuard`  
**Header obrigatório:** `x-psychologist-practice-context-id`

**Resposta (envelopada):**

```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "availabilities": [
      {
        "id": "uuid",
        "dayOfWeek": 1,
        "startTime": "09:00",
        "endTime": "17:00",
        "isActive": true
      }
    ]
  }
}
```

---

### Métricas de psicólogos (admin)

> ✅ Reparadas (T24) — todas via `PsychologistProfileRepository` + hidratação de `User` (não mais `PsychologistRepository` stub). Shapes preservadas.

| Rota | Controller | Auth | Fonte / shape |
|---|---|---|---|
| `GET /admin/metrics/psychologists/total` | `GetTotalPsychologistsController` | `JwtAuthGuard` | `countDistinctUsers()` → `{ total }` (usuários distintos com perfil) |
| `GET /admin/metrics/psychologists/new` | `GetNewPsychologistsCountController` | `JwtAuthGuard` | `findManyByCreatedAtRange` agrupado por dia → `{ date, newPsychologists }[]` |
| `GET /admin/metrics/psychologists/age-range` | `GetPsychologistsAgeRangeController` | `JwtAuthGuard` | faixas de `User.dateOfBirth` via `findMany()` → `{ ageRange, count }[]` |
| `GET /admin/metrics/psychologists/gender` | `GetPsychologistsGenderController` | `JwtAuthGuard` | `User.gender` via `findMany()` → `{ gender, count }[]` |

---

## OAuth / Auth Completo

### GET /auth/google

**Controller:** `GoogleAuthController`  
**Guard:** `GoogleAuthGuard`  
**Pública:** ✅ — redireciona para Google OAuth

### GET /auth/google/callback

**Controller:** `GoogleAuthController`  
**Retorna:** `{ message, user: { id, email, firstName, lastName, provider, profileImageUrl } }`

### GET /auth/linkedin

**Controller:** `LinkedInAuthController`  
Análogo ao Google.

### POST /auth/complete-registration — ❌ REMOVIDA (T33)

`CompleteOAuthRegistrationController` + use case foram deletados. Use o fluxo novo: `POST /psychologist/profile` + `POST /psychologist/practice-contexts`.

---

## Paciente

### POST /patient/profile

**Controller:** `CreatePatientProfileController`  
**Use case:** `CreatePatientProfileUseCase`  
**Auth:** `JwtAuthGuard` + `AccountStatusGuard`

**Body:**

```json
{
  "psychologistPracticeContextId": "uuid-do-contexto-ou-null"
}
```

> `psychologistPracticeContextId` é nullable. Enviar `null` cria perfil autônomo.

**Resposta (envelopada):**

```json
{
  "success": true,
  "statusCode": 201,
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "psychologistPracticeContextId": null,
    "isActive": true,
    "archivedAt": null,
    "createdAt": "2026-06-11T00:00:00.000Z"
  }
}
```

**Status codes:**
- `201` — criado
- `403` — conta desativada (`isActive=false`) ou `BLOCKED` (AccountStatusGuard)
- `409` — usuário já tem perfil vinculado a este contexto

---

### POST /patient (criação de paciente pelo psicólogo)

**Controller:** `CreatePatientController`  
**Use case:** `CreatePatientUseCase`  
**Auth:** `JwtAuthGuard` + `PermissionsGuard` (não `PracticeContextGuard`)  
**Header:** `x-psychologist-practice-context-id` (lido manualmente via `@Headers`)

> ⚠️ **Diferença importante:** Esta rota usa `PermissionsGuard` (legado), não `PracticeContextGuard`. O header é lido manualmente — sem validação de UUID nem verificação de ownership pelo guard. Cabe ao use case validar.

> ⚠️ O `patientId` retornado é o `patientProfile.id`, não o `user.id`.

**Body:**

```json
{
  "firstName": "Maria",
  "lastName": "Santos",
  "gender": "FEMININE",
  "cpf": "987.654.321-00",
  "email": "maria@example.com",
  "phoneNumber": "11999999999",
  "dateOfBirth": "1995-03-20",
  "profileImageUrl": null
}
```

**Resposta (envelopada):**

```json
{
  "success": true,
  "statusCode": 201,
  "data": {
    "message": "Paciente criado com sucesso",
    "patientId": "uuid-do-patient-profile"
  }
}
```

---

### GET /patients 🔑

**Controller:** `FetchPatientsController`  
**Use case:** `FetchPatientsUseCase`  
**Auth:** `JwtAuthGuard` + `PracticeContextGuard`  
**Header:** `x-psychologist-practice-context-id`

**Query params:**
- `pageIndex` (int, default 0)
- `perPage` (int, default 10)

**Resposta (envelopada):**

```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "patients": [...],
    "meta": {
      "pageIndex": 0,
      "perPage": 10,
      "totalCount": 42
    }
  }
}
```

---

### GET /patients/:id 🔑

**Controller:** `GetPatientByIdController`  
**Auth:** `JwtAuthGuard` + `PracticeContextGuard`

---

### GET /patients/cpf/:cpf 🔑

**Controller:** `GetPatientByCpfController`  
**Auth:** `JwtAuthGuard` + `PracticeContextGuard`

---

### GET /patients/email/:email 🔑

**Controller:** `GetPatientByEmailController`  
**Auth:** `JwtAuthGuard` + `PracticeContextGuard`

---

### PUT /patients/:id 🔑

**Controller:** `UpdatePatientByIdController`  
**Auth:** `JwtAuthGuard` + `PracticeContextGuard`

---

### DELETE /patients/:id

**Controller:** `DeletePatientController`  
**Use case:** `DeletePatientUseCase`  
**Auth:** `JwtAuthGuard`  
**Status:** ✅ Reparada — `DeletePatientUseCase` usa `UserRepository` + `PatientProfileRepository.delete` (remove o `PatientProfile` por owner; repo stub deletado em T33)

---

### PATCH /patients/:id/status 🔑

**Controller:** `TogglePatientStatusController`  
**Auth:** `JwtAuthGuard` + `PracticeContextGuard`

---

### GET /patients/:id/details

**Controller:** `GetPatientDetailsController`  
**Auth:** sem guard local declarado  
**Status:** ✅ Reparada — usa `UserRepository` + `PatientProfileRepository` (`findByIdAndPsychologistPracticeContextId`) + `AppointmentRepository`; repo stub deletado em T33

---

### POST /invites/:hash/register (registrar paciente via link)

**Controller:** `RegisterPatientViaInviteLinkController`  
**Use case:** `RegisterPatientViaInviteLinkUseCase`  
**Pública:** ✅ `@Public()`

**Path param:** `hash` (string do link de convite)

**Body:**

```json
{
  "firstName": "Maria",
  "lastName": "Santos",
  "email": "maria@example.com",
  "password": "Senha@123",
  "dateOfBirth": "1995-03-20",
  "cpf": null,
  "gender": "FEMININE",
  "phoneNumber": null,
  "profileImageUrl": null
}
```

**Resposta (envelopada):**

```json
{
  "success": true,
  "statusCode": 201,
  "data": {
    "patientId": "uuid-do-patient-profile",
    "userId": "uuid",
    "firstName": "Maria",
    "lastName": "Santos",
    "email": "maria@example.com",
    "psychologistPracticeContextId": "uuid-do-contexto"
  }
}
```

---

### Métricas de pacientes

| Rota | Controller | Auth | Status |
|---|---|---|---|
| `GET /patients/stats/new` | `GetPatientsAmountController` | `JwtAuthGuard` | ⚠️ pode depender de repo legado |
| `GET /patients/stats/gender` | `GetPatientsByGenderController` | `JwtAuthGuard` | ⚠️ pode depender de repo legado |
| `GET /patients/stats/age` | `FetchPatientsByAgeController` | `JwtAuthGuard` | ⚠️ pode depender de repo legado |
| `GET /patients/stats/card` | `GetPatientsAmountCardController` | `JwtAuthGuard` | ⚠️ pode depender de repo legado |
| `GET /admin/metrics/patients/total` | `GetTotalPatientsController` | `JwtAuthGuard` | ⚠️ pode depender de repo legado |
| `GET /admin/metrics/patients/new` | `GetAdminPatientsChartController` | `JwtAuthGuard` | ⚠️ pode depender de repo legado |
| `GET /patients/filter/with-attachments` | `FetchPatientsWithAttachmentsController` | `JwtAuthGuard` | ⚠️ pode depender de repo legado |

---

## Agendamentos

### POST /appointments 🔑

**Controller:** `CreateAppointmentController`  
**Auth:** `JwtAuthGuard` + `PracticeContextGuard`

**Body:**

```json
{
  "patientProfileId": "uuid",
  "diagnosis": "Ansiedade",
  "content": null,
  "scheduledAt": "2026-07-01T10:00:00.000Z",
  "status": "SCHEDULED"
}
```

**Resposta (envelopada):**

```json
{
  "success": true,
  "statusCode": 201,
  "data": {
    "message": "Agendamento criado com sucesso",
    "appointment": {
      "id": "uuid",
      "patientProfileId": "uuid",
      "psychologistPracticeContextId": "uuid",
      "diagnosis": "Ansiedade",
      "content": null,
      "scheduledAt": "2026-07-01T10:00:00.000Z",
      "durationInMin": null,
      "status": "SCHEDULED",
      "createdAt": "2026-06-11T00:00:00.000Z"
    }
  }
}
```

**Erros:** `409 APPOINTMENT_CONFLICT`, `422 APPOINTMENT_DATE_IN_PAST`

---

### GET /appointments 🔑

**Controller:** `FetchAppointmentsController`  
**Auth:** `JwtAuthGuard` + `PracticeContextGuard`

**Query params:** `pageIndex`, `perPage`, `orderBy`, `startDate`, `endDate`, `patientName`

---

### GET /appointments/context/:practiceContextId

**Controller:** `FetchAppointmentsByPsychologistIdController`  
**Auth:** `JwtAuthGuard` (sem `PracticeContextGuard`)

**Path param:** `practiceContextId` (UUID)

**Query params:** `pageIndex`, `perPage`, `orderBy`

---

### GET /appointments/:id 🔑

**Controller:** `GetAppointmentsController`  
**Auth:** `JwtAuthGuard` + `PracticeContextGuard`

---

### PUT /appointments/:id 🔑

**Controller:** `UpdateAppointmentController`  
**Auth:** `JwtAuthGuard` + `PracticeContextGuard`

---

### DELETE /appointments/:id 🔑

**Controller:** `DeleteAppointmentController`  
**Auth:** `JwtAuthGuard` + `PracticeContextGuard`

**Erros:** `422 APPOINTMENT_NOT_SCHEDULED` (não pode deletar sessão em andamento/finalizada)

---

### PATCH /appointments/:id/start

**Controller:** `StartAppointmentController`  
**Auth:** `JwtAuthGuard` (sem PracticeContextGuard)

---

### GET /appointments/pending/:patientProfileId 🔑

**Controller:** `GetScheduledAppointmentController`  
**Auth:** `JwtAuthGuard` + `PracticeContextGuard`

---

### GET /appointments/available-slots

**Controller:** `GetAvailableSlotsController`  
**Auth:** `JwtAuthGuard`

**Query params:** `psychologistPracticeContextId` (UUID), `startDate` (Date), `endDate` (Date)

---

### PUT /appointments/:id/reschedule 🔑

**Controller:** `RescheduleAppointmentController`  
**Auth:** `JwtAuthGuard` + `PracticeContextGuard`

**Body:** `{ "newDate": "2026-07-15T10:00:00.000Z" }`

---

### PATCH /appointments/:id/cancel 🔑

**Controller:** `CancelAppointmentController`  
**Auth:** `JwtAuthGuard` + `PracticeContextGuard`

---

### GET /appointments/active/grouped 🔑

**Controller:** `FetchActiveAppointmentsGroupedController`  
**Auth:** `JwtAuthGuard` + `PracticeContextGuard`

---

### POST /appointments/:appointmentId/start (iniciar sessão) 🔑

**Controller:** `StartAppointmentSessionController`  
**Auth:** `JwtAuthGuard` + `PracticeContextGuard`

**Resposta:**

```json
{
  "success": true,
  "statusCode": 201,
  "data": {
    "message": "Sessão iniciada!",
    "sessionId": "uuid"
  }
}
```

---

### POST /sessions/:id/finish 🔑

**Controller:** `FinishAppointmentSessionController`  
**Auth:** `JwtAuthGuard` + `PracticeContextGuard`

**Body:** `{ "content": "Notas da sessão..." }`

---

### Métricas de agendamentos 🔑

| Rota | Controller |
|---|---|
| `GET /appointments/metrics/month-count` | `GetMonthlySessionsCountController` |
| `GET /appointments/metrics/daily-count` | `GetDailySessionsMetricsController` |

Ambas exigem `PracticeContextGuard`.

---

## Anamnese

### GET /patients/:patientId/anamnesis

**Controller:** `AnamnesisController`  
**Auth:** `JwtAuthGuard` + `PracticeContextGuard` 🔑 (header `x-psychologist-practice-context-id`)

> ⚠️ `patientId` no path é tratado como `patientProfileId`. Passe o `id` do `PatientProfile`, não o `id` do `User`.
> O `PatientProfile` precisa pertencer ao contexto ativo (`findByIdAndPsychologistPracticeContextId`); caso contrário `404`.

**Resposta:**

```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "anamnesis": {
      "queixaPrincipal": "...",
      "historico": "..."
    }
  }
}
```

---

### PUT /patients/:patientId/anamnesis

**Controller:** `AnamnesisController`  
**Auth:** `JwtAuthGuard` + `PracticeContextGuard` 🔑 (header `x-psychologist-practice-context-id`)

**Body:** qualquer JSON (estrutura livre)

> Sobrescreve o conteúdo completo da anamnese. `PatientProfile` fora do contexto ativo → `404`.

---

## Documentos / Prontuários / Observações

Todas as rotas usam `PracticeContextGuard` 🔑

### POST /documents

**Body:**

```json
{
  "patientProfileId": "uuid",
  "type": "RG",
  "attachmentId": null
}
```

**Resposta:**

```json
{
  "success": true,
  "statusCode": 201,
  "data": {
    "message": "Documento criado com sucesso",
    "document": {
      "id": "uuid",
      "patientProfileId": "uuid",
      "type": "RG",
      "attachment": null,
      "createdAt": "..."
    }
  }
}
```

### GET /documents/patient-profile/:patientProfileId 🔑

### POST /medical-records 🔑

**Body:** `{ patientProfileId, content, attachmentId }`

### GET /medical-records/patient-profile/:patientProfileId 🔑

### POST /observations 🔑

**Body:** `{ patientProfileId, content }`

### GET /observations/patient-profile/:patientProfileId 🔑

---

## Anexos

### POST /attachments

**Controller:** `UploadAttachmentController`  
**Auth:** `JwtAuthGuard`  
**Content-Type:** `multipart/form-data`

**Campos do form:**
- `file` (obrigatório): arquivo JPG, PNG ou PDF, máx 3MB
- `patientId` (opcional): UUID — se fornecido, vincula ao perfil do paciente
- `type` (opcional): `"AVATAR"` atualiza `User.profileImageUrl`

**Resposta:**

```json
{
  "success": true,
  "statusCode": 201,
  "data": {
    "attachmentId": "uuid",
    "url": "https://storage.example.com/arquivo.pdf"
  }
}
```

**Erros:** `413 FILE_TOO_LARGE`, `415 INVALID_ATTACHMENT_TYPE`

---

### GET /attachments/:id

**Controller:** `GetAttachmentController`  
**Auth:** sem guard local  
**Resposta:** stream do arquivo (não envelopado)

---

### DELETE /attachments/:id

**Controller:** `DeleteAttachmentController`  
**Auth:** `JwtAuthGuard`

---

### GET /attachments/patient/:patientId

**Controller:** `FetchPatientAttachmentsController`  
**Auth:** `JwtAuthGuard`

---

### GET /attachments

**Controller:** `FetchAllAttachmentsController`  
**Auth:** `JwtAuthGuard`

**Query params:** `page`, `filter`, `from`, `to`

---

## Billing / Planos

### GET /plans

**Controller:** `FetchSubscriptionPlanController`  
**Auth:** sem guard local  
**Status:** ESTÁVEL

### POST /subscription-plan

**Controller:** `CreateSubscriptionPlanController`  
**Auth:** sem guard local

**Body:** `{ name, description, priceInCents, interval }`

### GET /plans/:id

**Controller:** `GetSubscriptionPlanByIdController`  
**Auth:** sem guard local

### DELETE /subcription-plan/:planId

> ⚠️ **Typo no path:** `subcription` (falta o `s`). Use exatamente este path.

**Auth:** sem guard local

### POST /billing

**Controller:** `CreateBillingController`  
**Auth:** `JwtAuthGuard` (CurrentUser presente mas opcional)

**Body:** `{ subscriptionPlanId, amount }`

**Resposta:**

```json
{
  "success": true,
  "statusCode": 201,
  "data": {
    "message": "Cobrança criada com sucesso!",
    "billingUrl": "https://pagamento.exemplo.com/...",
    "billingId": "ext_id_123",
    "amount": 15000
  }
}
```

> ⚠️ **Risco:** Não está confirmado que `POST /billing` cria um registro `Payment` no banco local. O `AccountStatusGuard` verifica `Payment.expiresAt` para liberar acesso. Se o billing externo não criar `Payment` local, o psicólogo ficará bloqueado mesmo tendo pago.

---

## Sugestões

### POST /suggestions

**Controller:** `CreateSuggestionController`  
**Auth:** `JwtAuthGuard`  
**Content-Type:** `multipart/form-data`

**Campos:** `title`, `description`, `category` (enum), `files[]` (opcional)

**Resposta:**

```json
{
  "success": true,
  "statusCode": 201,
  "data": {
    "suggestion": {
      "id": "uuid",
      "psychologistProfileId": "uuid",
      "title": "...",
      "description": "...",
      "category": "UI_UX",
      "status": "PENDING",
      "likes": [],
      "likesCount": 0,
      "attachments": [],
      "createdAt": "..."
    }
  }
}
```

### GET /suggestions

**Auth:** sem guard local  
**Query params:** `category`, `status`, `sortBy`, `search`

### PATCH /suggestions/:id/like

**Auth:** `JwtAuthGuard`

### GET /admin/metrics/suggestions/total

**Auth:** `JwtAuthGuard`

### GET /admin/metrics/suggestions/most-voted

**Auth:** `JwtAuthGuard`

### PATCH /admin/suggestions/:id/status

**Auth:** `JwtAuthGuard`

**Body:** `{ status?, title?, category?, description? }`

---

## Popups

### GET /popups/active

**Controller:** `FetchActivePopupsController`  
**Auth:** `JwtAuthGuard`

### GET /popups/unseen

**Controller:** `PopupsController` (rota dentro do controller genérico)  
**Auth:** `JwtAuthGuard`

### POST /popups/:popupId/view

**Controller:** `MarkPopupAsViewedController`  
**Auth:** `JwtAuthGuard`

**Body:** `{ action: string }`

### POST /popups/:id/view

**Controller:** `PopupsController`  
**Auth:** `JwtAuthGuard`

> ⚠️ Há dois controllers registrando `POST /popups/:id/view` com nomes diferentes (`MarkPopupAsViewedController` e `PopupsController`). NestJS pode ter ambiguidade aqui — verificar qual prevalece na ordem do módulo.

---

## Dashboard / Admin

### GET /dashboard 🔑

**Controller:** `GetDashboardDataController`  
**Auth:** `JwtAuthGuard` + `PracticeContextGuard`  
**Header obrigatório:** `x-psychologist-practice-context-id`

**Query params:** `startDate`, `endDate`

> Dados isolados por practice context: total/gênero/idade vêm de `PatientProfile` ativos + `User` do contexto; `upcomingAppointments` e tendência (`newPatientsLast7Days`, via `PatientProfile.createdAt`) também escopados ao contexto. Não usa mais repos legados nem `user.sub` como contexto.

### GET /sessions/total-work-hours 🔑

**Controller:** `GetTotalWorkHoursController`  
**Auth:** `JwtAuthGuard` + `PracticeContextGuard`  
**Header obrigatório:** `x-psychologist-practice-context-id`

**Query params:** `startDate`, `endDate` (opcionais)

> `{ totalMinutes }` soma a duração das sessões finalizadas (`endedAt != null`) cujo `appointment` pertence ao practice context, opcionalmente filtradas pelo range.

### GET /suggestions/ranking

**Controller:** `GetRankingController`  
**Auth:** `JwtAuthGuard`

### GET /admin/metrics/patients/new

**Controller:** `GetAdminPatientsChartController`  
**Auth:** `JwtAuthGuard`

**Query params:** `startDate`, `endDate`

---

## Endereço

### GET /address/:cep

**Controller:** `GetAddressByCepController`  
**Pública:** ✅ `@Public()`

**Resposta:**

```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "street": "Rua Exemplo",
    "neighborhood": "Centro",
    "city": "São Paulo",
    "state": "SP",
    "cep": "01310-100"
  }
}
```

### GET /address/:id

**Controller:** `GetAddressByIdController`  
**Auth:** `JwtAuthGuard`

### PUT /address/:id

**Controller:** `UpdateAddressByIdController`  
**Auth:** `JwtAuthGuard`

**Body:** campos opcionais de `Address`

---

## Clínicas

Todas as rotas de clínica usam `JwtAuthGuard`.

### POST /clinics

**Body:**

```json
{
  "legalName": "Clínica Saúde Mental Ltda.",
  "tradeName": "ClínicaSM",
  "cnpj": "12345678000195",
  "email": "contato@clinica.com",
  "phoneNumber": "11999999999",
  "website": "https://clinica.com"
}
```

**Resposta:**

```json
{
  "success": true,
  "statusCode": 201,
  "data": {
    "clinic": {
      "id": "uuid",
      "legalName": "...",
      "tradeName": "...",
      "cnpj": "...",
      "email": "...",
      "phoneNumber": "...",
      "isActive": true,
      "responsibleMemberId": null,
      "createdAt": "..."
    }
  }
}
```

### GET /clinics/:id

### PATCH /clinics/:id/responsible

**Body:** `{ "memberId": "uuid" }`

### POST /clinic-branches

**Body:** `{ clinicId, legalName, tradeName?, cnpj?, email?, ... }`

### GET /clinic-branches/clinic/:clinicId

### POST /clinic-members

**Body:** `{ userId, clinicId, branchId?, memberRole? }`

### GET /clinic-members/clinic/:clinicId

### POST /clinic-psychologists

**Body:** `{ psychologistProfileId, clinicId, branchId? }`

### GET /clinic-psychologists/clinic/:clinicId

---

## Colisões e ambiguidades de rotas

### GET /psychologists/:param — ✅ RESOLVIDO (T20)

A colisão histórica de 4 handlers `@Get(':param')` foi eliminada. Agora um único `PsychologistReadController` declara, **na ordem**:

```
@Get('search')  → GET /psychologists/search?cpf=|crp=|email=   (SearchPsychologistUseCase)
@Get(':id')     → GET /psychologists/:id                        (GetPsychologistByIdUseCase)
```

A precedência de handlers dentro de um mesmo controller é determinística (`search` declarado antes de `:id`), portanto `search` nunca é capturado por `:id`. Os controllers `GetPsychologistBy{Cpf,Crp,Email}Controller` e seus use cases foram desregistrados (remoção de arquivos legados em T33).

**Para o frontend:** use `GET /psychologists/search?cpf=` / `?crp=` / `?email=` (exatamente um filtro) e `GET /psychologists/:id` (id = `psychologistProfile.id`).

### POST /popups/:id/view — possível duplicação

`MarkPopupAsViewedController` e `PopupsController` podem registrar handlers concorrentes para `POST /popups/:id/view`. Verificar comportamento em runtime.

### AuthenticateController registrado em dois módulos

`AuthenticateController` aparece tanto em `AuthModule.controllers` quanto em `HttpModule.controllers` (via importação). Em NestJS, registrar o mesmo controller em dois módulos geralmente resulta em apenas um par de handlers — mas pode causar instâncias duplicadas de providers. **Não é um bug crítico**, mas é um cheiro de código.

---

## Legenda de confiabilidade

| Símbolo | Significado |
|---|---|
| ✅ ESTÁVEL | Rota funcional, usa repositórios novos |
| 🔑 | Requer header `x-psychologist-practice-context-id` |
| ⚠️ LEGADA | Deprecada, ainda registrada, funcionamento incerto |
| ❌ QUEBRADA | Repositório stub — lança erro imediatamente |
| ⚠️ POTENCIALMENTE QUEBRADA | Pode chamar repositório legado dependendo do use case |
