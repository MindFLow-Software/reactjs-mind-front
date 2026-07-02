# 01 - Entidades e Tipos

> Fonte primária: `prisma/schema.prisma`, entidades de domínio, DTOs HTTP, presenters e guards do backend.
> Specs históricas não prevalecem sobre o código implementado.

---

## Índice de Entidades

| Entidade | Tabela Prisma | Status para frontend |
|---|---|---|
| `User` | `users` | Atual |
| `Account` | `accounts` | Atual |
| `Address` | `addresses` | Atual |
| `Blacklist` | `blacklist` | Interna |
| `LoginAttempt` | `login_attempts` | Interna |
| `PsychologistProfile` | `psychologist_profiles` | Atual |
| `PsychologistPracticeContext` | `psychologist_practice_contexts` | Atual |
| `PatientProfile` | `patient_profiles` | Atual |
| `PatientInvite` | `patient_invites` | Atual |
| `PatientProfileClaimRequest` | `patient_profile_claim_requests` | Atual |
| `PatientProfileAccessCode` | `patient_profile_access_codes` | Atual |
| `Appointment` | `appointments` | Atual |
| `AppointmentSession` | `appointment_sessions` | Atual |
| `SessionParticipant` | `session_participants` | Atual |
| `PsychologistAvailability` | `psychologist_availabilities` | Atual |
| `Anamnesis` | `anamnesis` | Atual |
| `Document` | `documents` | Atual |
| `MedicalRecord` | `medical_records` | Atual |
| `Observation` | `observations` | Atual |
| `Attachment` | `attachments` | Atual |
| `RegistrationLink` | `registration_links` | Atual, mas geração tem risco funcional |
| `Payment` | `payments` | Modelo existe; `POST /billing` não persiste payment local |
| `SubscriptionPlan` | `subscription_plans` | Atual |
| `Suggestion` | `suggestions` | Atual |
| `Popup` | `popups` | Atual |
| `PopupView` | `popup_views` | Atual, mas view usa id de profile em algumas rotas |
| `Clinic` | `clinics` | Atual |
| `ClinicBranch` | `clinic_branches` | Atual |
| `ClinicMember` | `clinic_members` | Atual |
| `ClinicPsychologist` | `clinic_psychologists` | Atual |

---

## Enums

```ts
enum PlatformRole { USER, ADMIN, SUPPORT }
enum AccountStatus { PENDING, ACTIVE, REJECTED, BLOCKED }
enum LoginAttemptTargetType { EMAIL, IP }
enum Gender { OTHER, FEMININE, MASCULINE }
enum Expertise {
  OTHER,
  SOCIAL,
  INFANT,
  CLINICAL,
  JURIDICAL,
  EDUCATIONAL,
  ORGANIZATIONAL,
  PSYCHOTHERAPIST,
  NEUROPSYCHOLOGY
}
enum Honorific { MASC_DR, FEMININE_DR, MSC, PHD }
enum Languages { PORTUGUESE, ENGLISH, SPANISH, SIGNS }
enum AppointmentStatus {
  SCHEDULED,
  ATTENDING,
  FINISHED,
  CANCELED,
  NOT_ATTEND,
  RESCHEDULED
}
enum PracticeContextType { INDIVIDUAL, CLINIC }
enum MemberRole { OWNER, MANAGER, SECRETARY, FINANCE }
enum PatientProfileStatus { ACTIVE, INACTIVE, ARCHIVED }
enum PatientInviteStatus { PENDING, ACCEPTED, REJECTED }
enum ClaimRequestStatus { PENDING, APPROVED, REJECTED }
enum PatientProfileAccessCodeStatus { PENDING, USED, CANCELLED, EXPIRED }
enum DocumentType { RG, CPF, CNH, OTHER }
enum ParticipantType { PSYCHOLOGIST, PATIENT }
enum PlanInterval { MONTHLY, YEARLY }
enum PaymentStatus { PAYED, PENDING, NOT_PAYED }
enum PaymentMethod { PIX, CREDIT_CARD }
enum PaymentFrequency { MONTHLY, YEARLY }
enum PopupStatus { DRAFT, ACTIVE, PAUSED, ARCHIVED }
enum PopupType { MODAL, SLIDE_IN, BAR, TOAST }
enum SuggestionCategory {
  UI_UX,
  SCHEDULING,
  REPORTS,
  PRIVACY_LGPD,
  INTEGRATIONS,
  OTHERS
}
enum SuggestionStatus {
  PENDING,
  OPEN,
  UNDER_REVIEW,
  PLANNED,
  IMPLEMENTED,
  REJECTED
}
```

Notas importantes:

- `PlatformRole` identifica papel de plataforma (`ADMIN`/`SUPPORT`). Não use para decidir se a pessoa é paciente ou psicóloga.
- Para saber se o usuário é psicólogo, use `GET /me.data.psychologistProfile !== null`.
- Para saber se o usuário é paciente, use `GET /me.data.patientProfiles.length > 0`.
- `PatientProfileStatus` é independente de `AccountStatus`. Paciente não tem `isActive` exposto; use `status`.
- `Honorific` usa os valores reais `MASC_DR`, `FEMININE_DR`, `MSC`, `PHD`.

---

## Envelope Global

O interceptor global transforma retornos normais em:

```ts
{
  success: true
  statusCode: number
  data: T | null
  message: string | undefined
  error: undefined
}
```

Erros são tratados pelo `DomainExceptionFilter`:

```ts
{
  success: false
  statusCode: number
  data: null
  message: undefined
  error: {
    code: string
    message: string
  }
}
```

Exceções importantes:

- `POST /session` e `POST /session/refresh` usam `res.json(...)` e retornam objeto cru, sem envelope.
- `GET /auth/google/callback` redireciona.
- `GET /attachments/:id` faz stream do arquivo e não retorna JSON envelopado.
- Rotas com `@HttpCode(204)` devem ser tratadas como sem payload útil.

---

## Autenticação Efetiva

`JwtAuthGuard` e `AccountStatusGuard` são globais via `APP_GUARD`. Portanto:

- Toda rota sem `@Public()` exige `access_token` em cookie HTTP-only ou `Authorization: Bearer <jwt>`.
- Toda rota sem `@Public()` também passa pelo `AccountStatusGuard`.
- `AccountStatusGuard` bloqueia usuário inexistente, usuário `isActive=false`, conta inexistente, conta `BLOCKED`, conta diferente de `ACTIVE`, perfil de psicólogo não `ACTIVE` e IP em blacklist.
- A validação de `Payment` está comentada no código atual. Hoje o guard não bloqueia por plano vencido.

Payload do access token validado:

```ts
{
  sub: string
  email: string
  provider: 'credentials' | 'google'
  profileImageUrl?: string | null
}
```

Cookies:

- `access_token`: 15 minutos.
- `refresh_token`: 7 dias.
- Em produção: `secure: true`, `sameSite: 'none'`; em dev: `sameSite: 'lax'`.

---

## Header de Contexto

Rotas com `PracticeContextGuard` exigem:

```http
x-psychologist-practice-context-id: <uuid>
```

Validações reais:

| Situação | HTTP | Código do envelope | Mensagem |
|---|---:|---|---|
| Header ausente | 400 | `BAD_REQUEST` | `Missing required header: x-psychologist-practice-context-id` |
| Header não UUID | 400 | `BAD_REQUEST` | `Invalid UUID in header: x-psychologist-practice-context-id` |
| Contexto inexistente | 404 | `NOT_FOUND` | `PRACTICE_CONTEXT_NOT_FOUND` |
| Contexto de outro usuário | 403 | `FORBIDDEN` | `PRACTICE_CONTEXT_ACCESS_DENIED` |

O CORS permite esse header em `allowedHeaders`.

---

## User

Tabela: `users`

| Campo | Tipo HTTP | Prisma | Observação |
|---|---|---|---|
| `id` | `string` | `String @id @default(uuid())` | UUID |
| `firstName` | `string` | `String` | Obrigatório |
| `lastName` | `string` | `String` | Obrigatório |
| `email` | `string` | `String @unique` | Obrigatório no schema atual |
| `phoneNumber` | `string \| null` | `String?` | Opcional |
| `profileImageUrl` | `string \| null` | `String?` | Pode receber id de anexo em fluxo de avatar |
| `dateOfBirth` | `Date \| null` | `DateTime?` | Opcional |
| `cpf` | `string \| null` | `String? @unique` | Normalizado para dígitos no cadastro |
| `gender` | `Gender` | `Gender` | Obrigatório |
| `isActive` | `boolean` | `Boolean @default(true)` | Guard bloqueia se `false` |
| `platformRole` | `PlatformRole` | `PlatformRole @default(USER)` | Não define perfil clínico |
| `addressId` | `string \| null` | `String?` | FK opcional |
| `createdAt` | `Date` | `DateTime` | Exposto em `/me` |
| `updatedAt` | `Date` | `DateTime` | Não exposto em `/me` |

Shape em `GET /me`:

```ts
{
  id: string
  firstName: string
  lastName: string
  email: string
  cpf: string | null
  phoneNumber: string | null
  gender: Gender
  dateOfBirth: Date | null
  profileImageUrl: string | null
  isActive: boolean
  platformRole: PlatformRole
  createdAt: Date
  psychologistProfile: PsychologistProfileHTTP | null
  practiceContexts: PsychologistPracticeContextHTTP[]
  patientProfiles: PatientProfileHTTP[]
  clinicMemberContexts: Array<{
    id: string
    clinicId: string | null
    branchId: string | null
    memberRole: string
  }>
}
```

---

## Account

Tabela: `accounts`

| Campo | Tipo | Observação |
|---|---|---|
| `provider` | `'credentials' \| 'google'` | LinkedIn não existe no código atual |
| `email` | `string \| null` | Usado em credenciais |
| `password` | `string \| null` | Hash bcrypt |
| `hashedRefreshToken` | `string \| null` | Atualizado no login/refresh |
| `isActive` | `boolean` | Prisma default `false`, entidade default `true` |
| `status` | `AccountStatus` | Prisma default `PENDING`, entidade/cadastro usam `ACTIVE` |

Cadastro via `POST /user` cria conta `credentials` com `status=ACTIVE` e `isActive=true`.

---

## PsychologistProfile

Tabela: `psychologist_profiles`

| Campo | Tipo HTTP | Observação |
|---|---|---|
| `id` | `string` | UUID do profile |
| `userId` | `string` | `User.id`, unique |
| `crp` | `string` | Unique |
| `expertise` | `Expertise` | Enum |
| `honorific` | `Honorific` | Default `MASC_DR` |
| `professionalName` | `string` | Default `''` se omitido |
| `languages` | `Languages[]` | Default `[]` |
| `professionalBio` | `string \| null` | Opcional |
| `status` | `AccountStatus` | Entidade cria como `ACTIVE` |
| `isActive` | `boolean` | Default `true` |
| `createdAt` | `Date` | Exposto |

Shape HTTP:

```ts
{
  id: string
  userId: string
  crp: string
  expertise: string
  honorific: string
  professionalName: string
  languages: string[]
  professionalBio: string | null
  status: string
  isActive: boolean
  createdAt: Date
}
```

---

## PsychologistPracticeContext

Tabela: `psychologist_practice_contexts`

| Campo | Tipo HTTP | Observação |
|---|---|---|
| `id` | `string` | UUID do contexto |
| `psychologistProfileId` | `string` | Dono do contexto |
| `contextType` | `INDIVIDUAL \| CLINIC` | Enum |
| `clinicId` | `string \| null` | Opcional no schema; use case exige se CLINIC |
| `clinicBranchId` | `string \| null` | Opcional |
| `consultationFee` | `number \| null` | Em centavos |
| `nickname` | `string \| null` | Opcional |
| `isActive` | `boolean` | Guard só aceita contexto ativo |
| `createdAt` | `Date` | Exposto |

Shape HTTP:

```ts
{
  id: string
  psychologistProfileId: string
  contextType: string
  clinicId: string | null
  clinicBranchId: string | null
  consultationFee: number | null
  nickname: string | null
  isActive: boolean
  createdAt: Date
}
```

---

## PatientProfile

Tabela: `patient_profiles`

`PatientProfile` guarda dados próprios de identidade do paciente. Não é apenas vínculo entre `User` e psicólogo.

| Campo | Tipo HTTP | Observação |
|---|---|---|
| `id` | `string` | UUID do profile |
| `userId` | `string \| null` | Pode ser `null` |
| `psychologistPracticeContextId` | `string \| null` | Pode ser `null` para perfil sem contexto |
| `firstName` | `string` | Obrigatório |
| `lastName` | `string` | Obrigatório |
| `email` | `string \| null` | Opcional |
| `cpf` | `string \| null` | Opcional |
| `phoneNumber` | `string \| null` | Opcional |
| `gender` | `Gender` | Default no domínio: `OTHER` |
| `dateOfBirth` | `Date \| null` | Opcional |
| `profileImageUrl` | `string \| null` | Opcional |
| `status` | `PatientProfileStatus` | `ACTIVE`, `INACTIVE`, `ARCHIVED` |
| `archivedAt` | `Date \| null` | Preenchido ao arquivar |
| `createdAt` | `Date` | Exposto |

Shape HTTP:

```ts
{
  id: string
  userId: string | null
  psychologistPracticeContextId: string | null
  firstName: string
  lastName: string
  email: string | null
  cpf: string | null
  phoneNumber: string | null
  gender: string
  dateOfBirth: Date | null
  profileImageUrl: string | null
  status: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED'
  archivedAt: Date | null
  createdAt: Date
}
```

Shape de listagem via `PatientPresenter` adiciona:

```ts
{
  name: string
  lastSessionAt: null
}
```

---

## PatientInvite / Claim / Access Code

### PatientInvite

Tabela: `patient_invites`

Usado para convidar um usuário a assumir um `PatientProfile`.

| Campo | Tipo |
|---|---|
| `patientProfileId` | `string` |
| `tokenHash` | `string` |
| `email` | `string` |
| `expiresAt` | `Date` |
| `status` | `PENDING \| ACCEPTED \| REJECTED` |
| `acceptedAt` / `rejectedAt` | `Date \| null` |

Metadata pública de convite:

```ts
{
  patientFirstName: string
  psychologistCrp: string
  psychologistDisplayName: string
  expiresAt: Date
  userHasAccount: boolean
}
```

### PatientProfileClaimRequest

Tabela: `patient_profile_claim_requests`

Shape resumido:

```ts
{
  id: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  reviewedById: string | null
  requestedAt: Date
  approvedAt: Date | null
  rejectedAt: Date | null
  patientProfileId: string
  requestedCpf: string | null // mascarado no presenter
  requesterUserId: string
  requesterFirstName: string
  requesterLastName: string
  requesterEmail: string
  requesterDateOfBirth: string | null // mascarado
  createdAt: Date
  updatedAt: Date
}
```

Detalhe adiciona dados mascarados do paciente:

```ts
{
  patientProfileFirstName: string
  patientProfileLastName: string
  patientProfileDateOfBirth: string | null
  patientProfileEmail: string | null
  patientProfileCpf: string | null
}
```

### PatientProfileAccessCode

Tabela: `patient_profile_access_codes`

Usado pelo psicólogo para gerar código de vínculo. A rota retorna o código cru apenas no momento da geração:

```ts
{
  code: string
  expiresAt: Date
  patientProfileId: string
}
```

---

## Appointment

Tabela: `appointments`

| Campo | Tipo HTTP |
|---|---|
| `id` | `string` |
| `patientProfileId` | `string \| null` |
| `psychologistPracticeContextId` | `string \| null` |
| `diagnosis` | `string` |
| `content` | `string \| null` |
| `scheduledAt` | `Date` |
| `durationInMin` | `number \| null` |
| `status` | `AppointmentStatus` |
| `createdAt` | `Date` |

Shape HTTP:

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

---

## AppointmentSession / SessionParticipant

`AppointmentSession`:

| Campo | Tipo |
|---|---|
| `id` | `string` |
| `appointmentId` | `string` |
| `startedAt` | `Date` |
| `endedAt` | `Date \| null` |
| `durationInMin` | `number \| null` |
| `meetingLink` | `string \| null` |
| `notes` | `string \| null` |

`SessionParticipant` permite participante psicólogo ou paciente:

| Campo | Tipo |
|---|---|
| `participantType` | `PSYCHOLOGIST \| PATIENT \| null` |
| `psychologistPracticeContextId` | `string \| null` |
| `patientProfileId` | `string \| null` |
| `joinedAt` / `leftAt` | `Date` / `Date \| null` |

---

## Clinical Records

### Anamnesis

Tabela: `anamnesis`

Path usa `patientId`, mas o código trata como `patientProfileId`.

Shape HTTP:

```ts
{
  id: string
  patientId: string // patientProfileId
  content: Record<string, unknown>
  createdAt: Date
}
```

`GET /patients/:patientId/anamnesis` retorna `{ anamnesis: AnamnesisHTTP | null }`.

### Document

Shape HTTP:

```ts
{
  id: string
  patientProfileId: string
  type: string
  attachment: AttachmentHTTP | null
  createdAt: Date
}
```

O presenter atual recebe `attachment` como `null` nos controllers registrados.

### MedicalRecord

```ts
{
  id: string
  patientProfileId: string
  content: string | null
  attachment: AttachmentHTTP | null
  createdAt: Date
}
```

O presenter atual recebe `attachment` como `null` nos controllers registrados.

### Observation

```ts
{
  id: string
  patientProfileId: string
  content: string
  createdAt: Date
}
```

---

## Attachment

Tabela: `attachments`

```ts
{
  id: string
  uploadedBy: string
  filename: string
  contentType: string
  sizeInBytes: number
  fileUrl: string
  uploadedAt: Date
}
```

Upload:

- Campo multipart obrigatório: `file`.
- MIME aceito: `image/jpeg`, `image/jpg`, `image/png`, `application/pdf`.
- Limite: 3 MB.
- `type=AVATAR` só atualiza `User.profileImageUrl` se `patientId` também for enviado.
- A atualização de avatar grava `attachment.id`, não `fileUrl`.

---

## Billing / Plans

`SubscriptionPlan`:

```ts
{
  id: string
  name: string
  description: string[]
  priceInCents: number
  interval: 'MONTHLY' | 'YEARLY'
  createdAt: Date
  updatedAt: Date
}
```

`Payment` existe no schema, mas o fluxo atual de `POST /billing` só cria cobrança externa no AbacatePay e retorna:

```ts
{
  message: string
  billingId: string
  billingUrl: string
  amount: number
}
```

---

## Suggestions

Shape HTTP:

```ts
{
  id: string
  psychologistProfileId: string
  title: string
  description: string
  category: string
  status: string
  likes: string[]       // ids de PsychologistProfile
  likesCount: number
  attachments: string[] // URLs/chaves retornadas pelo uploader
  createdAt: Date
}
```

Criar e curtir sugestão exigem que o usuário autenticado tenha `PsychologistProfile`.

---

## Popups

`PopupPresenter`:

```ts
{
  id: string
  internalName: string
  title: string | null
  body: string | null
  imageUrl: string | null
  ctaText: string | null
  ctaUrl: string | null
  type: string
  styleConfig: unknown
  triggerConfig: unknown
  displayRules: unknown
}
```

`GET /popups/active` monta resposta inline e não inclui `internalName`; `GET /popups/unseen` usa o presenter e inclui.

---

## Clinics

### Clinic

```ts
{
  id: string
  legalName: string
  tradeName: string | null
  cnpj: string
  email: string | null
  phoneNumber: string | null
  website: string | null
  bannerUrl: string | null
  logoUrl: string | null
  isActive: boolean
  responsibleMemberId: string | null
  createdAt: Date
  updatedAt: Date
}
```

### ClinicBranch

Mesmo shape de `Clinic`, com `clinicId`.

### ClinicMember

```ts
{
  id: string
  userId: string
  clinicId: string | null
  branchId: string | null
  memberRole: string
  createdAt: Date
  updatedAt: Date
}
```

### ClinicPsychologist

```ts
{
  id: string
  psychologistProfileId: string
  practiceContextId: string
  clinicId: string | null
  branchId: string | null
  createdAt: Date
}
```

---

## Mapeamento de Erros de Domínio

Principais códigos mapeados pelo `DomainExceptionFilter`:

| Erro | HTTP | Code |
|---|---:|---|
| `InvalidCredentialsError` | 401 | `INVALID_CREDENTIALS` |
| `UnauthorizedTokenError` | 401 | `UNAUTHORIZED` |
| `InactiveAccountError` | 403 | `INACTIVE_ACCOUNT` |
| `NotAllowedError` | 403 | `NOT_ALLOWED` |
| `ResourceNotFoundError` | 404 | `RESOURCE_NOT_FOUND` |
| `UserNotFoundError` | 404 | `USER_NOT_FOUND` |
| `UserEmailAlreadyExistsError` | 409 | `USER_EMAIL_ALREADY_EXISTS` |
| `UserCpfAlreadyExistsError` | 409 | `USER_CPF_ALREADY_EXISTS` |
| `CRPAlreadyExistsError` | 409 | `CRP_ALREADY_EXISTS` |
| `CrpAlreadyInUseError` | 409 | `CRP_ALREADY_IN_USE` |
| `PsychologistProfileNotFoundError` | 404 | `PSYCHOLOGIST_PROFILE_NOT_FOUND` |
| `PsychologistProfileAlreadyExistsError` | 409 | `PSYCHOLOGIST_PROFILE_ALREADY_EXISTS` |
| `PracticeContextNotFoundError` | 404 | `PRACTICE_CONTEXT_NOT_FOUND` |
| `PracticeContextOwnershipError` | 403 | `PRACTICE_CONTEXT_OWNERSHIP` |
| `PracticeContextRequiredError` | 400 | `PRACTICE_CONTEXT_REQUIRED` |
| `PracticeContextInactiveError` | 403 | `CONTEXT_INACTIVE` |
| `PatientProfileNotFoundError` | 404 | `PATIENT_PROFILE_NOT_FOUND` |
| `PatientProfileAlreadyExistsError` | 409 | `PATIENT_PROFILE_ALREADY_EXISTS` |
| `PatientAlreadyLinkedError` | 409 | `PATIENT_ALREADY_LINKED` |
| `PatientAlreadyExistsError` | 409 | `PATIENT_ALREADY_EXISTS` |
| `PatientCpfAlreadyInContextError` | 409 | `PATIENT_CPF_ALREADY_IN_CONTEXT` |
| `PatientEmailAlreadyInContextError` | 409 | `PATIENT_EMAIL_ALREADY_IN_CONTEXT` |
| `PatientInviteInvalidError` | 401 | `PATIENT_INVITE_INVALID` |
| `PatientInviteExpiredError` | 410 | `PATIENT_INVITE_EXPIRED` |
| `PatientInviteAlreadyUsedError` | 409 | `PATIENT_INVITE_ALREADY_USED` |
| `PatientCpfMismatchError` | 422 | `PATIENT_CPF_MISMATCH` |
| `PatientProfileAccessCodeInvalidError` | 401 | `PATIENT_PROFILE_ACCESS_CODE_INVALID` |
| `PatientProfileAccessCodeExpiredError` | 410 | `PATIENT_PROFILE_ACCESS_CODE_EXPIRED` |
| `PatientProfileAccessCodeAlreadyUsedError` | 409 | `PATIENT_PROFILE_ACCESS_CODE_ALREADY_USED` |
| `ClaimRequestAlreadyExistsError` | 409 | `CLAIM_REQUEST_ALREADY_EXISTS` |
| `AppointmentConflictError` | 409 | `APPOINTMENT_CONFLICT` |
| `AppointmentDateInPastError` | 422 | `APPOINTMENT_DATE_IN_PAST` |
| `AppointmentNotInProgressError` | 422 | `APPOINTMENT_NOT_IN_PROGRESS` |
| `AppointmentNotScheduledError` | 422 | `APPOINTMENT_NOT_SCHEDULED` |
| `InvalidSessionParticipantError` | 422 | `INVALID_SESSION_PARTICIPANT` |
| `InvalidAttachmentTypeError` | 415 | `INVALID_ATTACHMENT_TYPE` |
| `FileTooLargeError` | 413 | `FILE_TOO_LARGE` |
| `SuggestionNotFoundError` | 404 | `SUGGESTION_NOT_FOUND` |
| `PopupNotFoundError` | 404 | `POPUP_NOT_FOUND` |
| `ClinicNotFoundError` | 404 | `CLINIC_NOT_FOUND` |
| `ClinicBranchNotFoundError` | 404 | `CLINIC_BRANCH_NOT_FOUND` |
| `ClinicMemberAlreadyExistsError` | 409 | `CLINIC_MEMBER_ALREADY_EXISTS` |
| `ClinicMemberNotFoundError` | 404 | `CLINIC_MEMBER_NOT_FOUND` |
| `RegistrationLinkInvalidError` | 404 | `REGISTRATION_LINK_INVALID` |
| `RegistrationLinkExpiredError` | 410 | `REGISTRATION_LINK_EXPIRED` |
| `RegistrationLinkOrphanError` | 422 | `REGISTRATION_LINK_ORPHAN` |
| `BillingValidationError` | 422 | `BILLING_VALIDATION` |
| `InvalidSearchParametersError` | 400 | `INVALID_SEARCH_PARAMETERS` |

Erros HTTP padrão usam `HttpStatus[status]`, por exemplo `BAD_REQUEST`, `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`.
