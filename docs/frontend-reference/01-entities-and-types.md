# 01 — Entidades e Tipos

> **Fonte primária:** `prisma/schema.prisma` + código real dos repositórios, presenters e use cases.  
> **Specs e design** foram usados apenas como contexto histórico; o código prevalece em qualquer divergência.

---

## Índice de entidades

| Entidade | Tabela Prisma | Status |
|---|---|---|
| `User` | `users` | ✅ Atual |
| `Account` | `accounts` | ✅ Atual |
| `Address` | `addresses` | ✅ Atual |
| `Blacklist` | `blacklist` | ✅ Atual |
| `LoginAttempt` | `login_attempts` | ✅ Atual (interno) |
| `PsychologistProfile` | `psychologist_profiles` | ✅ Atual |
| `PsychologistPracticeContext` | `psychologist_practice_contexts` | ✅ Atual (nova feature) |
| `PatientProfile` | `patient_profiles` | ✅ Atual (nova feature) |
| `Appointment` | `appointments` | ✅ Atual |
| `AppointmentSession` | `appointment_sessions` | ✅ Atual |
| `SessionParticipant` | `session_participants` | ✅ Atual |
| `PsychologistAvailability` | `psychologist_availabilities` | ⚠️ Migração parcial (coluna legada `psychologist_id`) |
| `Anamnesis` | `anamnesis` | ✅ Atual |
| `Document` | `documents` | ✅ Atual |
| `MedicalRecord` | `medical_records` | ✅ Atual |
| `Observation` | `observations` | ✅ Atual |
| `Attachment` | `attachments` | ✅ Atual |
| `RegistrationLink` | `registration_links` | ⚠️ Migração parcial (coluna legada `psychologist_id`) |
| `Payment` | `payments` | ⚠️ Migração parcial (coluna legada `psychologist_id`) |
| `SubscriptionPlan` | `subscription_plans` | ✅ Atual |
| `Suggestion` | `suggestions` | ⚠️ Migração parcial (coluna legada `psychologist_id`) |
| `Popup` | `popups` | ⚠️ Migração parcial (coluna legada `psychologist_id`) |
| `PopupView` | `popup_views` | ✅ Atual |
| `Clinic` | `clinics` | ✅ Atual (nova feature P2) |
| `ClinicBranch` | `clinic_branches` | ✅ Atual (nova feature P2) |
| `ClinicMember` | `clinic_members` | ✅ Atual (nova feature P2) |
| `ClinicPsychologist` | `clinic_psychologists` | ✅ Atual (nova feature P2) |
| `Patient` (legado) | — | ❌ Removido (T33) — substituído por `User` + `PatientProfile` |
| `Psychologist` (legado) | — | ❌ Removido (T33) — substituído por `User` + `PsychologistProfile` + `PsychologistPracticeContext` |

---

## Enums

### PlatformRole

```ts
enum PlatformRole {
  USER    // usuário padrão (paciente ou psicólogo ainda sem discriminação)
  ADMIN   // administrador da plataforma
  SUPPORT // suporte da plataforma
}
```

> **Atenção para o frontend:** `platformRole` NÃO deve ser usado para decidir se um usuário é paciente ou psicólogo. Use a existência de `psychologistProfile` e `patientProfiles` retornados em `GET /me`.

### AccountStatus

```ts
enum AccountStatus {
  PENDING  // legado — não é mais o default de criação (sem aprovação)
  ACTIVE   // estado padrão após criação via POST /user (T29)
  REJECTED // rejeitado pelo admin
  BLOCKED  // bloqueado por violação
}
```

### Gender

```ts
enum Gender {
  OTHER
  FEMININE
  MASCULINE
}
```

### Expertise (especialidade do psicólogo)

```ts
enum Expertise {
  OTHER
  SOCIAL
  INFANT
  CLINICAL
  JURIDICAL
  EDUCATIONAL
  ORGANIZATIONAL
  PSYCHOTHERAPIST
  NEUROPSYCHOLOGY
}
```

### AppointmentStatus

```ts
// No Prisma (schema.prisma):
enum AppointmentStatus {
  SCHEDULED
  ATTENDING
  FINISHED
  CANCELED
  NOT_ATTEND
  RESCHEDULED
}
```

> ✅ **Alinhado (T31):** O domínio e o Prisma compartilham os mesmos 6 valores. `DONE` foi removido do enum de domínio; `isFinished()` verifica apenas `FINISHED`. Use os 6 valores acima.

### PracticeContextType

```ts
enum PracticeContextType {
  INDIVIDUAL  // contexto próprio/autônomo do psicólogo
  CLINIC      // contexto vinculado a uma clínica
}
```

### MemberRole

```ts
enum MemberRole {
  OWNER
  MANAGER
  SECRETARY
  FINANCE
}
```

### DocumentType

```ts
enum DocumentType {
  RG
  CPF
  CNH
  OTHER
}
```

### ParticipantType

```ts
enum ParticipantType {
  PSYCHOLOGIST
  PATIENT
}
```

### PaymentStatus / PaymentMethod / PaymentFrequency

```ts
enum PaymentStatus   { PAYED, PENDING, NOT_PAYED }
enum PaymentMethod   { PIX, CREDIT_CARD }
enum PaymentFrequency { MONTHLY, YEARLY }
enum PlanInterval    { MONTHLY, YEARLY }
```

### PopupStatus / PopupType

```ts
enum PopupStatus { DRAFT, ACTIVE, PAUSED, ARCHIVED }
enum PopupType   { MODAL, SLIDE_IN, BAR, TOAST }
```

### SuggestionCategory / SuggestionStatus

```ts
enum SuggestionCategory { UI_UX, SCHEDULING, REPORTS, PRIVACY_LGPD, INTEGRATIONS, OTHERS }
enum SuggestionStatus   { PENDING, OPEN, UNDER_REVIEW, PLANNED, IMPLEMENTED, REJECTED }
```

---

## Envelope global de resposta

**Toda resposta HTTP** é embrulhada pelo `TransformResponseInterceptor`:

```ts
// Sucesso
{
  success: true,
  statusCode: number,    // ex: 200, 201
  data: T | null,        // payload real da rota
  message: string | undefined,
  error: undefined
}

// Erro (domain ou HTTP)
{
  success: false,
  statusCode: number,    // ex: 400, 403, 404, 409
  data: null,
  message: undefined,
  error: {
    code: string,        // ex: "CRP_ALREADY_EXISTS", "BAD_REQUEST"
    message: string      // mensagem legível
  }
}
```

> **Exceção:** `POST /session` e `POST /session/refresh` usam `res.json(...).send()` diretamente (sem passar pelo interceptor). Eles retornam o objeto cru sem envelope.

---

## Entidades

---

### User

**O que representa:** Identidade base do usuário na plataforma. Toda pessoa — paciente, psicólogo ou admin — começa como `User`.

**Tabela Prisma:** `users`

**Fonte no código:**
- `prisma/schema.prisma` (model User)
- `src/core/domain/main/enterprise/entities/user.ts`
- `src/infra/database/prisma/mappers/user.ts`
- `src/infra/http/presenters/user-presenter.ts`

#### Campos

| Campo | Tipo TS | Tipo Prisma | Obrigatório | Nullable | Default | Observações |
|---|---|---|---|---|---|---|
| `id` | `string` (UUID) | `String @id @default(uuid())` | Sim | Não | auto | PK |
| `firstName` | `string` | `String` | Sim | Não | — | — |
| `lastName` | `string` | `String` | Sim | Não | — | — |
| `email` | `string \| null` | `String? @unique` | Não | Sim | null | Único quando preenchido |
| `phoneNumber` | `string \| null` | `String? @db.VarChar(20)` | Não | Sim | null | — |
| `profileImageUrl` | `string \| null` | `String?` | Não | Sim | null | Pode ser atualizado via `POST /attachments` com `type=AVATAR` |
| `dateOfBirth` | `Date \| null` | `DateTime?` | Não | Sim | null | Não pode ser data futura |
| `cpf` | `string \| null` | `String? @unique @db.VarChar(14)` | Não | Sim | null | Normalizado para apenas dígitos |
| `isActive` | `boolean` | `Boolean @default(true)` | Sim | Não | `true` | — |
| `gender` | `Gender` | `Gender` | Sim | Não | — | Enum: OTHER, FEMININE, MASCULINE |
| `platformRole` | `PlatformRole` | `PlatformRole @default(USER)` | Sim | Não | `USER` | Não usar para discriminar tipo de usuário |
| `addressId` | `string \| null` | `String?` | Não | Sim | null | FK para `addresses` (um usuário pode ter vários endereços) |
| `createdAt` | `Date` | `DateTime @default(now())` | Sim | Não | auto | — |
| `updatedAt` | `Date` | `DateTime @updatedAt` | Sim | Não | auto | — |

#### Relacionamentos

| Relação | Tipo | Cardinalidade |
|---|---|---|
| `accounts` | `Account[]` | 1 User → N Accounts |
| `psychologistProfile` | `PsychologistProfile?` | 1 User → 0..1 PsychologistProfile |
| `patientProfiles` | `PatientProfile[]` | 1 User → N PatientProfiles |
| `clinicMembers` | `ClinicMember[]` | 1 User → N ClinicMembers |
| `address` | `Address[]` | 1 User → N Addresses (via join table invertida) |
| `blacklistEntries` | `Blacklist[]` | 1 User → N Blacklist |
| `popupViews` | `PopupView[]` | 1 User → N PopupViews |
| `uploadedByAttachment` | `Attachment[]` | 1 User → N Attachments |

#### Shape exposto em `GET /me` (via `UserPresenter`)

```ts
{
  id: string
  firstName: string
  lastName: string
  email: string | null
  cpf: string | null
  phoneNumber: string | null
  gender: string            // valor do enum
  dateOfBirth: Date | null
  profileImageUrl: string | null
  isActive: boolean
  platformRole: string      // valor do enum
  createdAt: Date
  psychologistProfile: { ... } | null   // ver seção PsychologistProfile
  practiceContexts: Array<{ ... }>      // ver seção PsychologistPracticeContext
  patientProfiles: Array<{ ... }>       // ver seção PatientProfile
  clinicMemberContexts: Array<{ ... }>  // ✅ memberships reais via ClinicMemberRepository
}
```

#### Observações para o frontend

- `platformRole` serve apenas para identificar ADMIN/SUPPORT. Não use para distinguir paciente de psicólogo.
- Para saber se o usuário é psicólogo: verifique se `psychologistProfile !== null`.
- Para saber se o usuário é paciente: verifique se `patientProfiles.length > 0`.
- Um usuário pode ser tanto psicólogo quanto paciente simultaneamente.
- `clinicMemberContexts` reflete os memberships reais do usuário (via `ClinicMemberRepository`).

---

### Account

**O que representa:** Conta de autenticação ligada a um `User`. Um usuário pode ter múltiplas contas (credentials + Google + LinkedIn).

**Tabela Prisma:** `accounts`

**Fonte no código:**
- `prisma/schema.prisma` (model Account)
- `src/infra/database/prisma/repositories/prisma-account-repository.ts`

#### Campos

| Campo | Tipo TS | Tipo Prisma | Obrigatório | Nullable | Default |
|---|---|---|---|---|---|
| `id` | `string` | `String @id` | Sim | Não | uuid |
| `userId` | `string` | `String` | Sim | Não | — |
| `type` | `string` | `String` | Sim | Não | — |
| `provider` | `string` | `String` | Sim | Não | — | `'credentials' \| 'google' \| 'linkedin'` |
| `providerAccountId` | `string` | `String` | Sim | Não | — | — |
| `email` | `string \| null` | `String?` | Não | Sim | null | — |
| `password` | `string \| null` | `String?` | Não | Sim | null | Hash bcrypt |
| `hashedRefreshToken` | `string \| null` | `String?` | Não | Sim | null | — |
| `isActive` | `boolean` | `Boolean @default(false)` | Sim | Não | **`false`** | ⚠️ Default é `false` |
| `status` | `AccountStatus` | `AccountStatus @default(PENDING)` | Sim | Não | **`PENDING`** | ⚠️ Default é `PENDING` |

#### Observações para o frontend

> ✅ **Sem aprovação (T29):** `Account.create` agora usa `status = ACTIVE` por default; novas contas via `POST /user` são criadas `ACTIVE` e acessam recursos autenticados imediatamente. O `@default(PENDING)` da coluna Prisma é apenas fallback — a aplicação grava `ACTIVE` explicitamente. Não há mais etapa de aprovação admin.

- O `status` da conta é retornado em `POST /session` como `user.status` (normalmente `ACTIVE`).

---

### Address

**O que representa:** Endereço físico, podendo ser vinculado a um ou mais usuários.

**Tabela Prisma:** `addresses`

#### Campos

| Campo | Tipo TS | Tipo Prisma | Obrigatório | Nullable |
|---|---|---|---|---|
| `id` | `string` | `String @id` | Sim | Não |
| `zipCode` | `string` | `String` | Sim | Não |
| `street` | `string \| null` | `String?` | Não | Sim |
| `neighborhood` | `string \| null` | `String?` | Não | Sim |
| `city` | `string \| null` | `String?` | Não | Sim |
| `state` | `string \| null` | `String? @db.VarChar(2)` | Não | Sim | sigla UF |
| `number` | `string \| null` | `String?` | Não | Sim |
| `complement` | `string \| null` | `String?` | Não | Sim |
| `createdAt` | `Date` | `DateTime @default(now())` | Sim | Não |
| `updatedAt` | `Date` | `DateTime @updatedAt` | Sim | Não |

---

### PsychologistProfile

**O que representa:** Perfil profissional do psicólogo. Criado após registro de usuário, via `POST /psychologist/profile`.

**Tabela Prisma:** `psychologist_profiles`

**Fonte no código:**
- `prisma/schema.prisma` (model PsychologistProfile)
- `src/infra/http/presenters/psychologist-profile-presenter.ts`

#### Campos

| Campo | Tipo TS | Tipo Prisma | Obrigatório | Nullable | Default |
|---|---|---|---|---|---|
| `id` | `string` | `String @id` | Sim | Não | uuid |
| `userId` | `string` | `String @unique` | Sim | Não | — |
| `crp` | `string` | `String @unique @db.VarChar(10)` | Sim | Não | — |
| `expertise` | `Expertise` | `Expertise` | Sim | Não | — |
| `professionalBio` | `string \| null` | `String? @db.Text` | Não | Sim | null |
| `status` | `AccountStatus` | `AccountStatus @default(PENDING)` | Sim | Não | **`PENDING`** |
| `isActive` | `boolean` | `Boolean @default(true)` | Sim | Não | `true` |
| `createdAt` | `Date` | `DateTime @default(now())` | Sim | Não | auto |
| `updatedAt` | `Date` | `DateTime @updatedAt` | Sim | Não | auto |

#### Shape exposto (via `PsychologistProfilePresenter`)

```ts
// Endpoint: POST /psychologist/profile (resposta da criação)
// Endpoint: PATCH /psychologist/profile (resposta da atualização)
{
  id: string
  userId: string
  crp: string
  expertise: string
  professionalBio: string | null
  status: string                   // 'ACTIVE' na criação (T29)
  isActive: boolean
  createdAt: Date
}
```

#### Shape em `GET /me` (via `UserPresenter`)

```ts
// ✅ professionalBio agora exposto em GET /me (T27)
psychologistProfile: {
  id: string
  crp: string
  expertise: string
  professionalBio: string | null
  status: string
  isActive: boolean
} | null
```

#### Observações para o frontend

- Status padrão é `ACTIVE` (T29) — sem aprovação admin. `PsychologistProfile.create` usa `ACTIVE` por default.
- `professionalBio` é retornado em `POST /psychologist/profile` e agora também em `GET /me` (T27).
- Um usuário só pode ter **um** `PsychologistProfile` (FK `userId` é unique).

---

### PsychologistPracticeContext

**O que representa:** Contexto de atuação do psicólogo — pode ser individual (autônomo) ou vinculado a uma clínica. É a entidade central que conecta psicólogo → pacientes → agendamentos → pagamentos.

**Tabela Prisma:** `psychologist_practice_contexts`

**Fonte no código:**
- `prisma/schema.prisma` (model PsychologistPracticeContext)
- `src/infra/http/presenters/psychologist-practice-context-presenter.ts`
- `src/infra/auth/practice-context.guard.ts`

#### Campos

| Campo | Tipo TS | Tipo Prisma | Obrigatório | Nullable | Default |
|---|---|---|---|---|---|
| `id` | `string` | `String @id` | Sim | Não | uuid |
| `psychologistProfileId` | `string` | `String` | Sim | Não | — |
| `contextType` | `PracticeContextType` | `PracticeContextType` | Sim | Não | — |
| `clinicId` | `string \| null` | `String?` | Não | Sim | null | Obrigatório se `contextType=CLINIC` |
| `clinicBranchId` | `string \| null` | `String?` | Não | Sim | null | Opcional mesmo se CLINIC |
| `consultationFee` | `number \| null` | `Int?` | Não | Sim | null | **Em centavos.** Movido de `PsychologistProfile` para cá. |
| `nickname` | `string \| null` | `String?` | Não | Sim | null | Identificador amigável do contexto |
| `isActive` | `boolean` | `Boolean @default(true)` | Sim | Não | `true` | — |
| `createdAt` | `Date` | `DateTime @default(now())` | Sim | Não | auto | — |
| `updatedAt` | `Date` | `DateTime @updatedAt` | Sim | Não | auto | — |

#### Shape exposto (via `PsychologistPracticeContextPresenter`)

```ts
// Endpoint: POST /psychologist/practice-contexts
{
  id: string
  psychologistProfileId: string
  contextType: string          // 'INDIVIDUAL' | 'CLINIC'
  clinicId: string | null
  clinicBranchId: string | null
  consultationFee: number | null   // em centavos
  nickname: string | null
  isActive: boolean
  createdAt: Date
}
```

#### Shape em `GET /me` (via `UserPresenter`)

```ts
// ⚠️ Divergência: consultationFee e nickname NÃO aparecem em GET /me
practiceContexts: Array<{
  id: string
  contextType: string
  clinicId: string | null
  clinicBranchId: string | null
  isActive: boolean
}>
```

#### Header obrigatório nas rotas protegidas

Rotas com `PracticeContextGuard` exigem:
```
x-psychologist-practice-context-id: <UUID do contexto>
```

O guard valida que o contexto pertence ao usuário autenticado e o injeta em `request.practiceContext`.

#### Observações para o frontend

- `consultationFee` em **centavos** (não reais). Divida por 100 para exibir.
- `GET /me` **não expõe** `consultationFee` nem `nickname`. Se precisar desses campos, use a resposta de `POST /psychologist/practice-contexts` ou implemente uma rota de busca específica.
- O frontend deve armazenar localmente o `id` do contexto selecionado e enviá-lo como header `x-psychologist-practice-context-id` em todas as rotas que precisam de contexto.

---

### PatientProfile

**O que representa:** Perfil de paciente. Um usuário pode ter múltiplos perfis de paciente (um por contexto de atendimento). O vínculo com um psicólogo é via `psychologistPracticeContextId`, que é **nullable**.

**Tabela Prisma:** `patient_profiles`

**Fonte no código:**
- `prisma/schema.prisma` (model PatientProfile)
- `src/infra/http/presenters/patient-profile-presenter.ts`
- `src/core/domain/main/application/use-cases/patients/create-patient-profile.ts`

#### Campos

| Campo | Tipo TS | Tipo Prisma | Obrigatório | Nullable | Default |
|---|---|---|---|---|---|
| `id` | `string` | `String @id` | Sim | Não | uuid |
| `userId` | `string` | `String` | Sim | Não | — |
| `psychologistPracticeContextId` | `string \| null` | `String?` | Não | **Sim** | null | Paciente sem contexto = usuário autônomo |
| `isActive` | `boolean` | `Boolean @default(true)` | Sim | Não | `true` | — |
| `archivedAt` | `Date \| null` | `DateTime?` | Não | Sim | null | Preenchido ao arquivar |
| `createdAt` | `Date` | `DateTime @default(now())` | Sim | Não | auto | — |
| `updatedAt` | `Date` | `DateTime @updatedAt` | Sim | Não | auto | — |

#### Unicidade parcial

Há um índice parcial manual (criado via migration SQL) que garante:
- Um usuário **não pode** ter dois perfis vinculados ao mesmo contexto.
- Um usuário **pode** ter múltiplos perfis sem contexto (`psychologistPracticeContextId IS NULL`).

#### Shape exposto (via `PatientProfilePresenter`)

```ts
// Endpoint: POST /patient/profile
{
  id: string
  userId: string
  psychologistPracticeContextId: string | null
  isActive: boolean
  archivedAt: Date | null
  createdAt: Date
}
```

#### Shape em `GET /me`

```ts
patientProfiles: Array<{
  id: string
  psychologistPracticeContextId: string | null
  isActive: boolean
}>
```

#### Observações para o frontend

- `psychologistPracticeContextId: null` significa que o usuário se registrou como paciente de forma autônoma (sem vínculo com psicólogo específico).
- `POST /patient/profile` aceita `psychologistPracticeContextId` como nullable. Se omitido, usa `null`.
- `POST /patient` (criação pelo psicólogo) usa o `contextId` do header, não do body.

---

### Appointment

**O que representa:** Consulta agendada entre paciente e psicólogo.

**Tabela Prisma:** `appointments`

#### Campos

| Campo | Tipo TS | Tipo Prisma | Obrigatório | Nullable | Default |
|---|---|---|---|---|---|
| `id` | `string` | `String @id` | Sim | Não | uuid |
| `patientProfileId` | `string \| null` | `String?` | Não | Sim | null |
| `psychologistPracticeContextId` | `string \| null` | `String?` | Não | Sim | null |
| `diagnosis` | `string` | `String` | Sim | Não | — |
| `content` | `string \| null` | `String? @db.Text` | Não | Sim | null | Notas da sessão |
| `scheduledAt` | `Date` | `DateTime @default(now())` | Sim | Não | now | — |
| `status` | `AppointmentStatus` | `AppointmentStatus @default(SCHEDULED)` | Sim | Não | `SCHEDULED` | Valores: ver enum |
| `createdAt` | `Date` | `DateTime @default(now())` | Sim | Não | auto | — |
| `updatedAt` | `Date` | `DateTime @updatedAt` | Sim | Não | auto | — |

#### Shape exposto (via `AppointmentPresenter`)

```ts
{
  id: string
  patientProfileId: string | null
  psychologistPracticeContextId: string | null
  diagnosis: string
  content: string | null
  scheduledAt: Date
  durationInMin: number | null
  status: string
  createdAt: Date
}
```

> ✅ **Alinhado (T31):** O enum `AppointmentStatus` no domínio TypeScript tem os mesmos 6 valores do Prisma (`DONE` removido). Use os 6 valores do schema.

---

### AppointmentSession

**O que representa:** Sessão ativa de uma consulta. Criada quando o psicólogo inicia a sessão.

**Tabela Prisma:** `appointment_sessions`

#### Campos

| Campo | Tipo TS | Tipo Prisma | Nullable |
|---|---|---|---|
| `id` | `string` | `String @id` | Não |
| `appointmentId` | `string` | `String @unique` | Não |
| `startedAt` | `Date` | `DateTime @default(now())` | Não |
| `endedAt` | `Date \| null` | `DateTime?` | Sim |
| `durationInMin` | `number \| null` | `Int?` | Sim |
| `meetingLink` | `string \| null` | `String?` | Sim |
| `notes` | `string \| null` | `String? @db.Text` | Sim |

---

### SessionParticipant

**O que representa:** Participante de uma `AppointmentSession`. Polimórfico — pode ser psicólogo ou paciente.

**Tabela Prisma:** `session_participants`

#### Campos

| Campo | Tipo TS | Tipo Prisma | Nullable |
|---|---|---|---|
| `id` | `string` | `String @id` | Não |
| `sessionId` | `string` | `String` | Não |
| `participantType` | `ParticipantType \| null` | `ParticipantType?` | Sim |
| `psychologistPracticeContextId` | `string \| null` | `String?` | Sim |
| `patientProfileId` | `string \| null` | `String?` | Sim |
| `joinedAt` | `Date` | `DateTime @default(now())` | Não |
| `leftAt` | `Date \| null` | `DateTime?` | Sim |

> **Invariante:** Deve ter exatamente um de `psychologistPracticeContextId` ou `patientProfileId` preenchido — não ambos, não nenhum. A entidade de domínio valida isso e lança `InvalidSessionParticipantError` (HTTP 422) se violado.

---

### PsychologistAvailability

**O que representa:** Disponibilidade semanal do psicólogo por contexto de prática.

**Tabela Prisma:** `psychologist_availabilities`

> ✅ **Coluna legada removida (T30):** `psychologist_id` foi removido do schema Prisma. O repositório usa apenas `psychologistPracticeContextId`, sem `as any`. Migração destrutiva script-only (aprovação necessária) em `prisma/migrations/20260613120000_drop_legacy_psychologist_columns`.

#### Campos

| Campo | Tipo Prisma | Nullable | Observação |
|---|---|---|---|
| `id` | `String @id` | Não | — |
| `psychologistId` | `String @map("psychologist_id")` | Não | **Legado** — string livre, não FK |
| `psychologistPracticeContextId` | `String?` | **Sim** | Nova FK |
| `dayOfWeek` | `Int` | Não | 0=Domingo, 6=Sábado |
| `startTime` | `String` | Não | Formato `"HH:mm"` |
| `endTime` | `String` | Não | Formato `"HH:mm"` |
| `isActive` | `Boolean @default(true)` | Não | — |

---

### Anamnesis

**O que representa:** Ficha de anamnese (formulário de intake clínico) do paciente.

**Tabela Prisma:** `anamnesis`

> ⚠️ **Atenção:** O path `/patients/:patientId/anamnesis` usa `patientId` como parâmetro de rota, mas o código trata esse valor como `patientProfileId` (não `user.id`). O frontend deve passar o `id` do `PatientProfile`, não o `id` do `User`.

#### Campos

| Campo | Tipo Prisma | Nullable |
|---|---|---|
| `id` | `String @id` | Não |
| `patientProfileId` | `String? @unique` | **Sim** |
| `content` | `Json` | Não |
| `updatedAt` | `DateTime @updatedAt` | Não |

---

### Document

**O que representa:** Documento identificatório do paciente (RG, CPF, CNH, etc.) com anexo opcional.

**Tabela Prisma:** `documents`

#### Campos

| Campo | Tipo Prisma | Nullable |
|---|---|---|
| `id` | `String @id` | Não |
| `patientProfileId` | `String` | Não |
| `attachmentId` | `String? @unique` | Sim |
| `type` | `DocumentType` | Não |
| `createdAt` | `DateTime @default(now())` | Não |
| `updatedAt` | `DateTime @updatedAt` | Não |

---

### MedicalRecord

**O que representa:** Prontuário médico do paciente, podendo ter conteúdo textual e/ou anexo.

**Tabela Prisma:** `medical_records`

#### Campos

| Campo | Tipo Prisma | Nullable |
|---|---|---|
| `id` | `String @id` | Não |
| `patientProfileId` | `String` | Não |
| `attachmentId` | `String? @unique` | Sim |
| `content` | `String? @db.Text` | Sim |
| `createdAt` | `DateTime @default(now())` | Não |
| `updatedAt` | `DateTime @updatedAt` | Não |

---

### Observation

**O que representa:** Observação clínica do psicólogo sobre o paciente.

**Tabela Prisma:** `observations`

#### Campos

| Campo | Tipo Prisma | Nullable |
|---|---|---|
| `id` | `String @id` | Não |
| `patientProfileId` | `String` | Não |
| `content` | `String @db.Text` | Não |
| `createdAt` | `DateTime @default(now())` | Não |
| `updatedAt` | `DateTime @updatedAt` | Não |

---

### Attachment

**O que representa:** Arquivo enviado para a plataforma (imagem, PDF). Pode ser vinculado a documentos, prontuários ou ser avatar de usuário.

**Tabela Prisma:** `attachments`

#### Campos

| Campo | Tipo Prisma | Nullable |
|---|---|---|
| `id` | `String @id` | Não |
| `uploaderId` | `String @map("uploader_id")` | Não |
| `filename` | `String` | Não |
| `sizeInBytes` | `Int @map("size_in_bytes")` | Não |
| `contentType` | `String @map("content_type")` | Não |
| `fileUrl` | `String @map("file_url")` | Não |
| `deletedAt` | `DateTime?` | Sim |
| `uploadedAt` | `DateTime @default(now())` | Não |
| `createdAt` | `DateTime @default(now())` | Não |
| `updatedAt` | `DateTime @updatedAt` | Não |

> Tipos MIME aceitos: `image/jpeg`, `image/jpg`, `image/png`, `application/pdf`. Tamanho máximo: 3 MB.

> Ao enviar `POST /attachments` com `type=AVATAR`, o backend atualiza `User.profileImageUrl` com a URL do arquivo.

---

### RegistrationLink

**O que representa:** Link de convite gerado pelo psicólogo para que pacientes se registrem.

**Tabela Prisma:** `registration_links`

> ⚠️ **Migração parcial:** Campo `psychologist_id` (String, não FK) ainda existe na tabela.

#### Campos principais

| Campo | Tipo Prisma | Nullable |
|---|---|---|
| `id` | `String @id` | Não |
| `hash` | `String @unique` | Não |
| `url` | `String` | Não |
| `psychologistId` | `String` | Não | **Legado** |
| `psychologistPracticeContextId` | `String?` | Sim |
| `expiresAt` | `DateTime` | Não |
| `createdAt` | `DateTime @default(now())` | Não |

---

### Payment

**O que representa:** Pagamento de assinatura do psicólogo.

**Tabela Prisma:** `payments`

> ⚠️ **Migração parcial:** Campo `psychologist_id` (String, não FK) ainda existe na tabela.  
> ⚠️ **Risco:** O `AccountStatusGuard` valida pagamento ativo. Se o billing externo não criar um registro `Payment` no banco, o guard bloqueia o psicólogo mesmo com assinatura paga.

#### Campos principais

| Campo | Tipo Prisma | Nullable | Default |
|---|---|---|---|
| `id` | `String @id` | Não | uuid |
| `psychologistId` | `String` | Não | **Legado** |
| `psychologistPracticeContextId` | `String?` | Sim | null |
| `subscriptionPlanId` | `String` | Não | — |
| `amount` | `Int` | Não | — |
| `paidAt` | `DateTime?` | Sim | null |
| `expiresAt` | `DateTime?` | Sim | null |
| `externalId` | `String?` | Sim | null |
| `status` | `PaymentStatus` | Não | `NOT_PAYED` |
| `paymentMethod` | `PaymentMethod` | Não | `PIX` |
| `paymentFrequency` | `PaymentFrequency` | Não | `MONTHLY` |

---

### Clinic / ClinicBranch / ClinicMember / ClinicPsychologist

**Status:** Entidades P2 — `clinicMemberContexts` em `GET /me` reflete memberships reais (via `ClinicMemberRepository.findManyByUserId`).

#### Clinic — campos principais

| Campo | Tipo Prisma | Nullable |
|---|---|---|
| `id` | `String @id` | Não |
| `legalName` | `String` | Não |
| `tradeName` | `String?` | Sim |
| `cnpj` | `String @unique @db.VarChar(18)` | Não |
| `email` | `String? @unique` | Sim |
| `phoneNumber` | `String? @db.VarChar(20)` | Sim |
| `isActive` | `Boolean @default(true)` | Não |
| `responsibleMemberId` | `String?` | Sim |

#### ClinicMember

Vincula um `User` a uma `Clinic` ou `ClinicBranch` com um `MemberRole` (OWNER, MANAGER, SECRETARY, FINANCE).

#### ClinicPsychologist

Vincula um `PsychologistProfile` + `PsychologistPracticeContext` a uma clínica. A constraint `practiceContextId @unique` significa que um contexto só pode pertencer a uma clínica.

---

### Suggestion

**Tabela Prisma:** `suggestions`

> ⚠️ **Migração parcial:** Campo `psychologist_id` (String, não FK) ainda existe e é obrigatório na tabela.

#### Campos relevantes

| Campo | Tipo | Nullable |
|---|---|---|
| `psychologistProfileId` | `String?` | Sim — nova FK |
| `psychologistId` | `String` | Não — **Legado**, obrigatório |
| `likes` | `String[]` | Não — array de `psychologistProfileId` que curtiu |
| `status` | `SuggestionStatus` | Não |

---

### Popup / PopupView

Popups são mensagens/banners para psicólogos. `PopupView` registra quando e que ação o usuário tomou.

> ⚠️ **Migração parcial:** `Popup` tem campo `psychologistId` (String, legado) ainda presente.

---

## Erros de domínio e mapeamento HTTP

| Classe de erro | HTTP | Código | Mensagem |
|---|---|---|---|
| `ResourceNotFoundError` | 404 | `RESOURCE_NOT_FOUND` | `"{resource} não encontrado"` |
| `NotAllowedError` | 403 | `NOT_ALLOWED` | `"Ação não permitida"` |
| `InactiveAccountError` | 403 | `INACTIVE_ACCOUNT` | `"Sua conta ainda não foi aprovada..."` |
| `CRPAlreadyExistsError` | 409 | `CRP_ALREADY_EXISTS` | `"CRP já cadastrado"` |
| `CrpAlreadyInUseError` | 409 | `CRP_ALREADY_IN_USE` | — |
| `CnpjAlreadyInUseError` | 409 | `CNPJ_ALREADY_IN_USE` | — |
| `PatientAlreadyLinkedError` | 409 | `PATIENT_ALREADY_LINKED` | — |
| `PatientAlreadyExistsError` | 409 | `PATIENT_ALREADY_EXISTS` | — |
| `PsychologistHasActivePatientsError` | 409 | `PSYCHOLOGIST_HAS_ACTIVE_PATIENTS` | — |
| `PracticeContextNotFoundError` | 404 | `PRACTICE_CONTEXT_NOT_FOUND` | — |
| `PracticeContextOwnershipError` | 403 | `PRACTICE_CONTEXT_OWNERSHIP` | — |
| `PracticeContextRequiredError` | 400 | `PRACTICE_CONTEXT_REQUIRED` | — |
| `AppointmentConflictError` | 409 | `APPOINTMENT_CONFLICT` | — |
| `AppointmentDateInPastError` | 422 | `APPOINTMENT_DATE_IN_PAST` | — |
| `AppointmentNotInProgressError` | 422 | `APPOINTMENT_NOT_IN_PROGRESS` | — |
| `AppointmentNotScheduledError` | 422 | `APPOINTMENT_NOT_SCHEDULED` | — |
| `InvalidSessionParticipantError` | 422 | `INVALID_SESSION_PARTICIPANT` | — |
| `InvalidAttachmentTypeError` | 415 | `INVALID_ATTACHMENT_TYPE` | — |
| `FileTooLargeError` | 413 | `FILE_TOO_LARGE` | `"O arquivo é muito grande. Max 3MB."` |
| `InactivePatientError` | 422 | `INACTIVE_PATIENT` | — |
| `InvalidStartTimeError` | 422 | `INVALID_START_TIME` | — |
| `OAuthAlreadyLinkedError` | 409 | `OAUTH_ALREADY_LINKED` | — |
| `OAuthEmailMismatchError` | 422 | `OAUTH_EMAIL_MISMATCH` | — |
| `OAuthMissingEmailError` | 422 | `OAUTH_MISSING_EMAIL` | — |
| `OAuthProviderConflictError` | 409 | `OAUTH_PROVIDER_CONFLICT` | — |

Erros HTTP padrão (NestJS) são mapeados com `code = HttpStatus[status]` (ex: `BAD_REQUEST`, `FORBIDDEN`, `UNAUTHORIZED`).

---

## Diferenças entre modelo ideal das specs e código atual

| # | Spec / Design diz | Código atual faz | Impacto no frontend |
|---|---|---|---|
| 1 | `consultationFee` em `PsychologistPracticeContext` | ✅ Confirmado — está em `PracticeContext` | Não buscar de `PsychologistProfile` |
| 2 | `GET /me` deve expor `consultationFee` e `nickname` dos contextos | ✅ Resolvido (T27) — incluídos em `practiceContexts[]` | Frontend recebe fee/nickname no `/me` |
| 3 | `GET /me` deve expor `professionalBio` no profile | ✅ Resolvido (T27) | Frontend recebe bio no `/me` |
| 4 | `GET /me` deve popular `clinicMemberContexts` | ✅ Resolvido (T27) — `ClinicMember` reais via `findManyByUserId` | Dados de clínica disponíveis em `/me` |
| 5 | `PatientProfile.psychologistPracticeContextId` nullable | ✅ Confirmado | Tratar null como paciente autônomo |
| 6 | `AppointmentStatus` padrão 6 valores | ✅ Resolvido (T31) — `DONE` removido do domínio, alinhado ao Prisma | Use os 6 valores do Prisma |
| 7 | Fluxo self-service: `POST /user` → login → `POST /psychologist/profile` | ✅ Resolvido (T29) — conta criada `ACTIVE`, sem aprovação | Usuário cria perfil imediatamente após registro |
| 8 | `PrismaPatientRepository` funcional | ✅ Resolvido (T33) — stub removido; rotas migradas para `PatientProfileRepository` | Rotas de paciente funcionam |
| 9 | `PrismaPsychologistRepository` funcional | ✅ Resolvido (T33) — stub removido; rotas migradas para `PsychologistProfileRepository` | Rotas de psicólogo funcionam |
| 10 | CORS permite `x-psychologist-practice-context-id` | ✅ Resolvido (T28) — header incluído em `allowedHeaders` | Preflight cross-origin permitido |
| 11 | Billing externo cria `Payment` local | Incerto — `POST /billing` retorna URL mas não confirmado que cria `Payment` | `AccountStatusGuard` pode bloquear psicólogo com pagamento externo feito |
| 12 | Colunas legadas removidas | ✅ Resolvido (T30) — `psychologist_id`/`psychologistId`/`psychologist_name` removidos de `suggestions`, `payments`, `registration_links`, `psychologist_availabilities`; `as any` removido dos 4 repos (migração script-only, aprovação necessária). `popups.psychologistId` (nullable) fora de escopo | Inserts usam só os novos IDs |
