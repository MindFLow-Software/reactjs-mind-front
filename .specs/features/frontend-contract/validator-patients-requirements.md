# Patients — Frontend Validator Requirements

> Source of truth: backend validators, controllers, presenters e use cases.
> Verificado contra o código-fonte em 2026-05-31.
> Auth: todos os endpoints exigem JWT exceto onde indicado com `@Public`.

---

## Shape de referência — `PatientHTTP`

Endpoints que usam `PatientPresenter.toHTTP` retornam sempre este shape:

```ts
interface PatientHTTP {
  id: string
  firstName: string
  lastName: string
  name: string           // computed: `${firstName} ${lastName}`
  email: string | null
  cpf: string | null
  phoneNumber: string | null
  gender: 'OTHER' | 'FEMININE' | 'MASCULINE'
  isActive: boolean      // não é status string — é boolean
  dateOfBirth: string | null   // ISO date string no JSON
  profileImageUrl: string | null
  createdAt: string      // ISO date string
  lastSessionAt: string | null // ISO date string
}
```

**Backend proof:** `src/infra/http/DTO/patients/patient-http-dto.ts` + `src/infra/http/presenters/patient-presenter.ts`

---

## 1. POST `/patient` — Criar paciente

> ⚠️ Path é `/patient` (singular), **não** `/patients` (plural).

**Schema:** `src/validators/patients/controllers/create-patient-schema.ts`

### Request body

| Campo | Tipo | Obrigatório | Regras |
|-------|------|-------------|--------|
| `firstName` | `string` | ✅ | `min(1)` |
| `lastName` | `string` | ✅ | `min(1)` |
| `gender` | `string` | ❌ | enum `OTHER \| FEMININE \| MASCULINE`; default `'OTHER'` se omitido |
| `phoneNumber` | `string` | ❌ | sem restrição de formato |
| `profileImageUrl` | `string` | ❌ | sem validação de URL |
| `dateOfBirth` | `string` (ISO 8601) | ❌ | coercido para Date; rejeita datas futuras |
| `cpf` | `string` | ❌ | validado com `CPF.isValid` quando presente |

> ⚠️ `email` **não existe** neste schema — não enviar email na criação.

> ⚠️ Bug no backend: `cpf` usa `z.string().optional().refine(CPF.isValid)` sem guard
> para `undefined`. Em Zod, o refine é chamado com `undefined` quando o campo é omitido,
> e `CPF.isValid(undefined)` retorna `false`. Na prática: ou enviar CPF válido ou
> omitir completamente o campo do JSON (não enviar `cpf: null`).

### Response `201`

```json
{
  "message": "Patient created successfully",
  "patientId": "string"
}
```

**Backend proof:** `src/infra/http/controllers/patients/create-patient.controller.ts`

---

## 2. GET `/patients` — Listar pacientes do psicólogo

**Schema:** `src/validators/patients/controllers/fetch-patients-schema.ts`

### Query params

| Param | Tipo | Default | Regras |
|-------|------|---------|--------|
| `pageIndex` | `number` | `0` | inteiro ≥ 0; enviado como string na URL |
| `perPage` | `number` | `10` | inteiro ≥ 1; enviado como string na URL |
| `filter` | `string` | — | busca por nome ou CPF |
| `status` | `string` | — | `PENDING \| ACTIVE \| REJECTED \| BLOCKED` |
| `gender` | `string` | — | `OTHER \| FEMININE \| MASCULINE` |
| `order` | `string` | — | `'asc' \| 'desc'` — ordena por `createdAt` |
| `sessionVolume` | `string` | — | aceito mas **não implementado** no repositório |

> ⚠️ `status` usa valores de `AccountStatus` uppercase — **não** `'active'`/`'inactive'`.

### Response `200`

```json
{
  "patients": [ /* PatientHTTP[] */ ],
  "meta": {
    "pageIndex": 0,
    "perPage": 10,
    "totalCount": 0
  }
}
```

**Backend proof:** `src/infra/http/controllers/patients/fetch-patients.controller.ts`

---

## 3. GET `/patients/:id` — Buscar paciente por ID

**Schema:** `src/validators/patients/controllers/get-patient-by-id-schema.ts`
— `id: z.uuid()`

> ⚠️ O schema `getPatientByIdQuerySchema` (`psychologistId: z.uuid()`) existe no arquivo
> mas **não é aplicado pelo controller**. Não enviar `psychologistId` como query param.

### Response `200`

```json
{
  "patient": { /* PatientHTTP */ }
}
```

**Backend proof:** `src/infra/http/controllers/patients/get-patient-by-id.controller.ts`

---

## 4. GET `/patients/:id/details` — Detalhes do paciente com histórico de sessões

**Schema:** `src/validators/patients/controllers/get-patient-details-schema.ts`

Path param `id` **não é validado via Zod** — `@Param('id')` direto.

### Query params

| Param | Tipo | Default | Regras |
|-------|------|---------|--------|
| `pageIndex` | `number` | `0` | inteiro |
| `perPage` | `number` | `10` | inteiro |

### Response `200`

```ts
{
  patient: {
    id: string
    firstName: string
    lastName: string
    cpf: string | null
    email: string | null
    profileImageUrl: string | null
    phoneNumber: string | null
    dateOfBirth: string | null   // ISO date string
    gender: string
    sessions: Array<{
      id: string
      date: string | null        // ISO date string
      sessionDate: string | null // ISO date string — mesmo dado que date?
      createdAt: string          // ISO date string
      theme: string | null
      duration: number | null
      status: AppointmentStatus  // 'SCHEDULED'|'ATTENDING'|'FINISHED'|'CANCELED'|'NOT_ATTEND'|'RESCHEDULED'|'DONE'
      content: string | null
    }>
  }
  meta: { /* paginação de sessões */ }
}
```

> ⚠️ Este shape é **diferente de `PatientHTTP`** — não tem `name`, `isActive`,
> `lastSessionAt`, nem `createdAt` do paciente.

> ⚠️ `sessions.status` é `AppointmentStatus` em inglês uppercase —
> **não** `'Concluída'`/`'Pendente'`.

> ⚠️ `date` e `sessionDate` coexistem nas sessões — mesmos dado com dois nomes.
> Tratar ambos e usar o que não for `null`.

**Backend proof:** `src/infra/http/controllers/patients/get-patient-details.controller.ts`

---

## 5. PUT `/patients/:id` — Atualizar paciente

**Schema:** `src/validators/patients/controllers/update-patient-schema.ts`

### Path param

`id: z.uuid()` — UUID válido.

### Request body (todos opcionais)

| Campo | Tipo | Regras |
|-------|------|--------|
| `firstName` | `string` | sem min |
| `lastName` | `string` | sem min |
| `email` | `string` | email válido — **não aceita string vazia** `""` |
| `phoneNumber` | `string` | sem restrição |
| `dateOfBirth` | `string` (ISO 8601) | coercido; rejeita datas futuras |
| `cpf` | `string` | validado com `CPF.isValid` quando presente; permite `undefined` |
| `gender` | `string` | `OTHER \| FEMININE \| MASCULINE` |
| `profileImageUrl` | `string` | sem validação de URL |
| `attachmentIds` | `string[]` | array de IDs de anexos |

> ⚠️ Para limpar o email, **não enviar o campo** — não enviar `email: ""`.

### Response `200`

```json
{ "patient": { /* shape crua do use case — sem presenter normalizado */ } }
```

> ⚠️ Esta rota **não usa `PatientPresenter`** — o shape retornado pode diferir de `PatientHTTP`.

**Backend proof:** `src/infra/http/controllers/patients/update-patient-by-id.controller.ts`

---

## 6. PATCH `/patients/:id/status` — Toggle de status ativo/inativo

Sem Zod no controller. Path param `id` extraído diretamente com `@Param('id')`.

> ⚠️ `togglePatientStatusBodySchema` (`{ isActive: boolean }`) existe no arquivo de schema
> mas **não é aplicado pelo controller** — não há `@Body()`. O status é simplesmente
> alternado (toggle) sem receber valor externo.

### Response `204`

Sem body.

**Backend proof:** `src/infra/http/controllers/patients/toggle-patient-status.controller.ts`

---

## 7. DELETE `/patients/:id` — Deletar paciente

**Schema:** `src/validators/patients/controllers/delete-patient-schema.ts`
— `id: z.uuid()`

### Response `204`

Sem body.

---

## 8. GET `/patients/filter/with-attachments` — Listar pacientes com anexos

Sem schema Zod. Sem query params.

### Response `200`

```json
{
  "patients": [ /* PatientHTTP[] */ ]
}
```

Usa `PatientPresenter.toHTTP` — shape idêntico ao `GET /patients`.

**Backend proof:** `src/infra/http/controllers/patients/fetch-patients-with-attachments.controller.ts`

---

## 9. GET `/patients/stats/card` — Contagem simples de pacientes (card)

Sem schema Zod. Sem query params.

### Response `200`

```json
{ "amount": number }
```

**Backend proof:** `src/infra/http/controllers/patients/get-patients-amount-card.controller.ts`

---

## 10. GET `/patients/stats/new` — Novos pacientes em um período

**Schema:** `src/validators/patients/controllers/get-amount-patients-schema.ts`

### Query params

| Param | Tipo | Obrigatório | Regras |
|-------|------|-------------|--------|
| `startDate` | `string` (ISO 8601) | ✅ | `z.coerce.date()` — obrigatório |
| `endDate` | `string` (ISO 8601) | ✅ | `z.coerce.date()` — obrigatório |

> ⚠️ Ambas as datas são **obrigatórias** — sem default, sem optional. Omitir causa 400.

### Response `200`

Shape retornada diretamente do use case — sem presenter. Verificar em runtime.

**Backend proof:** `src/infra/http/controllers/patients/get-patients-amount.controller.ts`

---

## 11. GET `/patients/stats/gender` — Distribuição por gênero

Sem schema Zod. Sem query params.

### Response `200`

```ts
Array<{
  gender: 'OTHER' | 'FEMININE' | 'MASCULINE'
  count: number
}>
```

Array direto — sem wrapper `{ data: [...] }`.

**Backend proof:** `src/infra/http/controllers/patients/get-patients-by-gender.controller.ts`

---

## 12. GET `/patients/stats/age` — Distribuição por faixa etária

Sem schema Zod. Sem query params.

### Response `200`

```ts
Array<{
  range: '0-17' | '18-25' | '26-35' | '36-50' | '51+'
  count: number
}>
```

Array direto — sem wrapper.

> ⚠️ Bug no backend: todo paciente com `dateOfBirth` definido incrementa `51+`
> independentemente da idade. Dados dessa faixa estarão inflados.

**Backend proof:** `src/infra/http/controllers/patients/get-patients-age.controller.ts`

---

## 13. GET `/admin/metrics/patients/total` — Total geral de pacientes (admin)

> ⚠️ Path é `/admin/metrics/patients/total`, **não** `/patients/`.

Sem schema Zod. Sem query params.

### Response `200`

```json
{ "total": number }
```

**Backend proof:** `src/infra/http/controllers/patients/get-total-patients.controller.ts`

---

## 14. POST `/invites/:hash/register` — Registro de paciente via convite

> `@Public` — **sem JWT**. Rota pública acessível pelo link de convite.

**Schema:** `src/validators/patients/controllers/register-patient-schema.ts`

### Path param

| Param | Tipo |
|-------|------|
| `hash` | `string` (hash do convite) |

### Request body

| Campo | Tipo | Obrigatório | Regras |
|-------|------|-------------|--------|
| `firstName` | `string` | ✅ | `min(1)` |
| `lastName` | `string` | ✅ | `min(1)` |
| `email` | `string` | ✅ | email válido |
| `password` | `string` | ✅ | `min(8)` + lower + upper + dígito + especial `[^A-Za-z0-9]` |
| `gender` | `string` | ✅ | `OTHER \| FEMININE \| MASCULINE` — **obrigatório** |
| `phoneNumber` | `string` | ❌ | sem restrição |
| `dateOfBirth` | `string` (ISO 8601) | ❌ | `z.coerce.date()` |
| `cpf` | `string` | ❌ | **sem validação de CPF** — qualquer string |

> ⚠️ `gender` é **obrigatório** aqui — diferente do create-patient que tem default.

> ⚠️ `password` exige complexidade completa. `min(6)` ou sem regex é insuficiente.

> ⚠️ `cpf` não é validado pelo backend nesta rota — `z.string().optional()` puro.

### Response `201`

```json
{
  "patientId": "string",
  "firstName": "string",
  "lastName": "string",
  "email": "string | null",
  "psychologistId": "string"
}
```

**Backend proof:** `src/infra/http/controllers/patients/register-patient-via-invite-link.controller.ts`

---

## Conflitos de rota — atenção

Os controllers abaixo registram `GET /patients/:param` com params diferentes
(`id`, `cpf`, `email`, `name`). O NestJS resolve pelo **primeiro registrado no módulo**.
Usar apenas uma dessas rotas por vez — as demais podem estar silenciosamente inacessíveis:

| Controller | Rota | Schema |
|------------|------|--------|
| `GetPatientByIdController` | `GET /patients/:id` | UUID |
| `GetPatientByCpfController` | `GET /patients/:cpf` | string max 14 |
| `GetPatientByEmailController` | `GET /patients/:email` | email válido |
| `GetPatientByNameController` | `GET /patients/:name` | — lê de `?name=` |

> ⚠️ `GetPatientByNameController` tem `@Get(':name')` mas lê via `@Query('name')`.
> O path param `:name` não é usado — a chamada correta é `GET /patients/qualquercoisa?name=João`.

---

## Resumo — o que o frontend precisa corrigir

| # | Endpoint | Problema | Ação |
|---|----------|---------|------|
| 1 | POST `/patient` | Path singular `/patient` | Verificar URL na chamada de API |
| 1 | POST `/patient` | `email` não existe no create | Remover do schema de criação |
| 1 | POST `/patient` | `cpf: null` quebra o backend | Omitir campo ou enviar string válida |
| 2 | GET `/patients` | `status` deve ser uppercase | Usar `PENDING/ACTIVE/REJECTED/BLOCKED` |
| 3 | GET `/patients/:id` | `psychologistId` query não é usado | Não enviar esse query param |
| 4 | GET `/patients/:id/details` | Shape diferente de `PatientHTTP` | Criar tipo `PatientDetails` separado |
| 4 | GET `/patients/:id/details` | `sessions.status` em EN, não PT | Usar `AppointmentStatus` |
| 5 | PUT `/patients/:id` | `email: ""` retorna 400 | Omitir campo em vez de enviar vazio |
| 5 | PUT `/patients/:id` | Response sem presenter | Não tipar como `PatientHTTP` |
| 6 | PATCH `/patients/:id/status` | Schema `isActive` não aplicado | Não enviar body — é toggle puro |
| 10 | GET `/patients/stats/new` | `startDate`/`endDate` obrigatórios | Sempre enviar ambos |
| 11 | GET `/patients/stats/gender` | Array direto sem wrapper | Não esperar `{ data: [...] }` |
| 12 | GET `/patients/stats/age` | Bug no `51+` | Documentar dado inflado |
| 13 | GET `/admin/metrics/patients/total` | Path fora de `/patients/` | Corrigir URL |
| 14 | POST `/invites/:hash/register` | `password` min(6) insuficiente | Exigir min(8) + complexidade |
| 14 | POST `/invites/:hash/register` | `gender` obrigatório | Não marcar como opcional |
