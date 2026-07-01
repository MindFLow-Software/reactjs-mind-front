# 03 - Mudanças das Features e Impacto no Frontend

> Este documento resume como o frontend deve se adaptar ao backend atual.
> Para payloads completos, consulte `01-entities-and-types.md` e `02-routes.md`.

---

## Visão Geral

O backend atual separa identidade, perfis clínicos e contexto de atuação:

```text
User
  -> Account[]
  -> PsychologistProfile?
       -> PsychologistPracticeContext[]
  -> PatientProfile[]
  -> ClinicMember[]
```

Consequências práticas:

- `platformRole` não define se o usuário é paciente ou psicólogo.
- Um usuário pode ser paciente e psicólogo ao mesmo tempo.
- `PatientProfile` é a entidade de paciente usada nas rotas clínicas.
- A maior parte do dashboard do psicólogo depende de `x-psychologist-practice-context-id`.
- Rotas sem `@Public()` exigem login por guard global, mesmo quando o controller não declara `@UseGuards`.

---

## Antes vs Agora

| Área | Contrato antigo/documentado antes | Backend atual |
|---|---|---|
| Criar psicólogo | `POST /psychologist` | `POST /user` + `POST /psychologist/profile` + `POST /psychologist/practice-context` |
| Criar contexto | `/psychologist/practice-contexts` | `/psychologist/practice-context` |
| Perfil de paciente próprio | `POST /patient/profile` | `POST /me/patient-profiles` |
| Criar paciente pelo psicólogo | `POST /patient` | `POST /patient-profiles` |
| Listar pacientes | `/patients` ou `/patients/stats/*` | `/patient-profiles` e `/patient-profiles/metrics/*` |
| Busca de psicólogo | `/psychologists/search` | `/psychologist/profile/search` |
| Registration link | `/invites/:hash` | `/registration-links/:hash` e `/patient-profiles/registration-links/:hash/register` |
| Convite por token | Não consolidado | `/patient-profiles/invites/:token` |
| Billing | `{ subscriptionPlanId, amount }` | Dados de paciente/cobrança + URLs de retorno |
| Ver planos | Tratado como público nos docs antigos | Autenticado globalmente |
| Sign-out | Tratado como público nos docs antigos | Não público; exige access token e refresh token |

---

## Fluxo de Auth Recomendado

```text
1. POST /session
   - resposta crua, sem envelope
   - backend seta access_token e refresh_token

2. GET /me
   - resposta envelopada
   - usar para montar o estado real do usuário

3. Se access token expirar:
   POST /session/refresh
   - resposta crua, sem envelope
   - usa refresh_token em cookie

4. Logout:
   POST /sign-out
   - enviar cookies atuais; rota não é @Public
```

O frontend deve sempre chamar `GET /me` depois de login/refresh quando precisar de perfil, contexto, paciente ou clínica. `POST /session` não retorna esses dados.

---

## Estado de Usuário no Frontend

Shape recomendado:

```ts
type FrontendUserState = {
  id: string
  firstName: string
  lastName: string
  email: string
  cpf: string | null
  phoneNumber: string | null
  gender: 'OTHER' | 'FEMININE' | 'MASCULINE'
  dateOfBirth: string | null
  profileImageUrl: string | null
  platformRole: 'USER' | 'ADMIN' | 'SUPPORT'

  psychologistProfile: {
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
  } | null

  practiceContexts: Array<{
    id: string
    psychologistProfileId: string
    contextType: 'INDIVIDUAL' | 'CLINIC'
    clinicId: string | null
    clinicBranchId: string | null
    consultationFee: number | null
    nickname: string | null
    isActive: boolean
  }>

  patientProfiles: Array<{
    id: string
    userId: string | null
    psychologistPracticeContextId: string | null
    firstName: string
    lastName: string
    email: string | null
    cpf: string | null
    phoneNumber: string | null
    gender: string
    dateOfBirth: string | null
    profileImageUrl: string | null
    status: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED'
    archivedAt: string | null
  }>

  clinicMemberContexts: Array<{
    id: string
    clinicId: string | null
    branchId: string | null
    memberRole: string
  }>

  activePracticeContextId: string | null
}
```

Como decidir perfil:

```ts
function getRuntimeRole(state: FrontendUserState) {
  const isPsychologist = state.psychologistProfile !== null
  const isPatient = state.patientProfiles.length > 0

  if (isPsychologist && isPatient) return 'BOTH'
  if (isPsychologist) return 'PSYCHOLOGIST'
  if (isPatient) return 'PATIENT'
  return 'NEW_USER'
}
```

---

## Onboarding de Psicólogo

Fluxo alinhado ao backend atual:

```text
1. POST /user
2. POST /session
3. GET /me
4. POST /psychologist/profile
5. POST /psychologist/practice-context
6. GET /me novamente
7. Selecionar practiceContexts[0].id como activePracticeContextId
8. Enviar x-psychologist-practice-context-id nas rotas com contexto
```

Body de profile:

```ts
{
  crp: string
  expertise: Expertise
  honorific?: Honorific
  professionalName?: string
  languages?: Languages[]
  professionalBio?: string
}
```

Body de contexto:

```ts
{
  contextType: 'INDIVIDUAL' | 'CLINIC'
  clinicId?: string
  clinicBranchId?: string
  consultationFee?: number // centavos
  nickname?: string
}
```

Se `contextType = CLINIC`, o use case exige `clinicId`.

---

## Seleção de Contexto Ativo

Use `GET /me.data.practiceContexts`.

```text
0 contextos:
  mostrar criação de contexto

1 contexto:
  selecionar automaticamente se isActive = true

2+ contextos:
  mostrar seletor
```

Ao chamar rotas com `PracticeContextGuard`, adicionar:

```ts
headers: {
  'x-psychologist-practice-context-id': activePracticeContextId
}
```

Rotas críticas que exigem contexto:

- `/patient-profiles` `GET`
- `/patient-profiles/:id` `GET`/`PUT`
- `/patient-profiles/:id/archive`
- `/patient-profiles/:id/status`
- `/appointments` `GET`/`POST`
- `/appointments/:id` `GET`/`PUT`/`DELETE`
- `/appointments/:id/cancel`
- `/appointments/:id/reschedule`
- `/appointments/:appointmentId/start`
- `/documents`, `/medical-records`, `/observations`
- `/dashboard`
- `/sessions/total-work-hours`
- `/availabilities`

---

## Pacientes

Há dois fluxos diferentes.

### Perfil próprio

Use `POST /me/patient-profiles`.

```ts
{
  psychologistPracticeContextId?: string | null
}
```

Se `psychologistPracticeContextId = null`, o profile é autônomo.

### Paciente criado pelo psicólogo

Use `POST /patient-profiles`.

```ts
{
  firstName: string
  lastName: string
  email?: string
  phoneNumber?: string
  profileImageUrl?: string
  dateOfBirth?: Date
  cpf?: string
  gender?: Gender
  zipCode?: string
  street?: string
  neighborhood?: string
  city?: string
  state?: string
}
```

A rota lê o contexto via header manual, mas não usa `PracticeContextGuard`. O frontend deve enviar o header mesmo assim.

Risco atual: por causa dos `.refine(...)` depois de `.optional()`, omitir `dateOfBirth` ou `cpf` pode falhar. Até corrigir backend, envie valores válidos quando usar essa rota.

### Listagem

Use `GET /patient-profiles` com header de contexto.

O schema aceita filtros, mas o controller repassa apenas `pageIndex` e `perPage` ao use case atual. Não dependa de `filter`, `status`, `gender`, `order` ou `sessionVolume` até correção backend.

---

## Convites e Vínculos de Paciente

### Convite por token

Use para convidar um usuário a assumir um `PatientProfile` existente:

```text
GET  /patient-profiles/invites/:token
POST /patient-profiles/invites/:token/register
POST /patient-profiles/invites/:token/accept
POST /patient-profiles/invites/:token/reject
```

### Código de acesso

Fluxo:

```text
1. Psicólogo gera:
   POST /patient-profiles/:patientProfileId/access-code

2. Backend retorna:
   { code, expiresAt, patientProfileId }

3. Paciente autenticado reivindica:
   POST /patient-profiles/access-code/claim
   Body: { code }
```

### Claim request

Fluxo:

```text
1. Paciente autenticado lista candidatos:
   GET /me/patient-profiles/claim-candidates

2. Cria solicitação:
   POST /patient-profiles/claim-requests
   Body: { patientProfileId }

3. Psicólogo lista/aprova/rejeita:
   GET  /patient-profiles/claim-requests
   GET  /patient-profiles/claim-requests/:id
   POST /patient-profiles/claim-requests/:id/approve
   POST /patient-profiles/claim-requests/:id/reject
```

---

## Agendamentos

Rotas principais:

```text
GET    /appointments
POST   /appointments
GET    /appointments/:id
PUT    /appointments/:id
DELETE /appointments/:id
PATCH  /appointments/:id/cancel
PUT    /appointments/:id/reschedule
POST   /appointments/:appointmentId/start
POST   /sessions/:id/finish
```

Para buscar horários disponíveis:

```ts
GET /appointments/available-slots?psychologistPracticeContextId=<uuid>&date=<date>
```

Não use `startDate/endDate` nessa rota. O contrato real é `date`.

A rota `PATCH /appointments/:id/start` existe, mas não usa `PracticeContextGuard`; ela só muda status para `ATTENDING`. Para iniciar sessão com isolamento por contexto, use `POST /appointments/:appointmentId/start`.

---

## Anamnese / Documentos / Prontuários / Observações

Todos usam `PatientProfile.id`.

Anamnese mantém path antigo:

```text
GET /patients/:patientId/anamnesis
PUT /patients/:patientId/anamnesis
```

O nome do parâmetro é `patientId`, mas o valor deve ser `patientProfileId`.

Documentos, prontuários e observações:

```text
POST /documents
GET  /documents/patient-profile/:patientProfileId

POST /medical-records
GET  /medical-records/patient-profile/:patientProfileId

POST /observations
GET  /observations/patient-profile/:patientProfileId
```

Os presenters atuais retornam `attachment: null` em documentos e prontuários. Se o frontend precisa dos metadados do anexo, deve buscar em `/attachments/:id`/listas ou aguardar ajuste backend.

---

## Anexos e Avatar

Upload:

```text
POST /attachments
multipart/form-data
file=<arquivo>
patientId=<opcional>
type=<opcional>
```

Regras:

- JPG, PNG ou PDF.
- Máximo 3 MB.
- `GET /attachments/:id` é autenticado e retorna stream.
- Para avatar, o backend atual só atualiza se `patientId` vier junto com `type=AVATAR`.
- O backend grava `profileImageUrl = attachment.id`, não a URL do arquivo.

Impacto no frontend:

- Não assuma que `profileImageUrl` é URL absoluta.
- Para exibir imagem quando vier id de anexo, use endpoint de stream ou normalize no frontend.

---

## Billing

`POST /billing` não cria assinatura local. Ele cria uma cobrança externa no AbacatePay.

Body:

```ts
{
  patientEmail: string
  patientTaxId: string
  patientName: string
  amountInCents: number
  consultationDetails: string
  frequency: 'ONE_TIME' | 'MULTIPLE_PAYMENTS'
  methods: Array<'PIX' | 'CARD'>
  returnUrl: string
  completionUrl: string
}
```

Impacto:

- Não envie `subscriptionPlanId` nessa rota; o backend atual não aceita.
- Não espere liberação de acesso por `Payment`; o `AccountStatusGuard` está com a verificação de payment comentada.
- Se o produto precisar bloquear por plano, isso ainda precisa de implementação backend.

---

## Registration Links

Rotas reais:

```text
POST /registration-links
GET  /registration-links/:hash
POST /patient-profiles/registration-links/:hash/register
```

Risco atual:

- `POST /registration-links` não usa `PracticeContextGuard`.
- O controller passa `user.sub` como `psychologistPracticeContextId`.
- O use case e a leitura do link esperam id real de contexto.

Impacto:

- O link pode ser criado com contexto inválido e depois falhar como `REGISTRATION_LINK_ORPHAN`.
- Para produção, prefira fluxo de convite por token/código até o backend corrigir a geração de registration link.

---

## Clínicas

Rotas de clínica estão disponíveis e autenticadas:

```text
POST /clinics
GET  /clinics/:id
PATCH /clinics/:id/responsible

POST /clinic-branches
GET  /clinic-branches/clinic/:clinicId

POST /clinic-members
GET  /clinic-members/clinic/:clinicId

POST /clinic-psychologists
GET  /clinic-psychologists/clinic/:clinicId
```

Não há guard real de ownership/role nessas rotas além da autenticação. O frontend deve tratar como funcionalidade administrativa até o backend endurecer permissões.

---

## Cache e Invalidação

| Evento | Ação recomendada |
|---|---|
| Login | Chamar `GET /me` |
| Refresh bem-sucedido | Manter sessão; chamar `GET /me` se houver suspeita de mudança de perfil |
| `POST /psychologist/profile` | Invalidar `GET /me` |
| `POST /psychologist/practice-context` | Invalidar `GET /me`; selecionar novo contexto |
| `POST /me/patient-profiles` | Invalidar `GET /me` |
| `POST /patient-profiles/access-code/claim` | Invalidar `GET /me` |
| Aceitar/rejeitar convite | Invalidar `GET /me` |
| Trocar contexto ativo | Atualizar apenas `activePracticeContextId` local |
| Logout | Limpar estado e cookies locais se houver |

---

## Checklist de Migração do Frontend

- [ ] Tratar `POST /session` e `POST /session/refresh` como respostas sem envelope.
- [ ] Tratar todas as rotas sem `@Public()` como autenticadas, incluindo `/plans` e `GET /suggestions`.
- [ ] Trocar `/psychologist/practice-contexts` por `/psychologist/practice-context`.
- [ ] Trocar `/patient/profile` por `/me/patient-profiles`.
- [ ] Trocar `/patient` por `/patient-profiles`.
- [ ] Trocar `/patients/stats/*` por `/patient-profiles/metrics/*`.
- [ ] Trocar `/psychologists/search` por `/psychologist/profile/search`.
- [ ] Usar `PatientProfile.id` em rotas clínicas.
- [ ] Enviar `x-psychologist-practice-context-id` em todas as rotas com `PracticeContextGuard`.
- [ ] Não depender de `Payment` local após `POST /billing`.
- [ ] Não assumir que `profileImageUrl` é URL.
- [ ] Não depender de filtros aceitos mas não repassados em `GET /patient-profiles`.
- [ ] Não usar rotas removidas listadas em `02-routes.md`.
