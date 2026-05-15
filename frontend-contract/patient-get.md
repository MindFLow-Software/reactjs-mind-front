# Patient GET — Guia de Implementação para o Frontend

> **Para o Claude do frontend**: Este documento detalha cada endpoint GET de paciente. Para cada um: rota exata, autenticação, parâmetros com tipos, shape da resposta, e um exemplo de como implementar no frontend (service function + React Query hook). Use `types.ts` deste mesmo diretório para importar os tipos.

---

## Configuração base

Todos os endpoints autenticados exigem o token JWT no header:
```
Authorization: Bearer <access_token>
```

O token é obtido após login e deve ser injetado automaticamente pelo interceptor HTTP do frontend. O payload do token contém:
```ts
interface UserPayload {
  sub:  string  // ID do psicólogo autenticado (UUID)
  role: string | { name: string }
}
```

---

## Endpoints

---

### 1. `GET /patients` — Listar pacientes (paginado + filtrado)

**Auth**: 🔒 JWT obrigatório  
**Controller**: `fetch-patients.controller.ts`  
**Quando usar**: Tela principal de listagem de pacientes.

#### Query params

```ts
// Todos opcionais. Omitir = usar default do backend.
type Params = {
  pageIndex?:     number   // default: 0  (zero-indexed)
  perPage?:       number   // default: 10
  filter?:        string   // busca em firstName, lastName, CPF
  status?:        'active' | 'inactive'  // omitir = todos
  gender?:        'OTHER' | 'FEMININE' | 'MASCULINE'  // omitir = todos
  order?:         'asc' | 'desc'         // omitir = 'desc'
  sessionVolume?: 'high' | 'low'         // omitir = sem ordenação extra
}
```

> ⚠️ **Não envie `'all'`** para os filtros. O backend aceita mas converte para `null`. Simplesmente omita o param quando não houver filtro ativo.

#### Response `200 OK`

```ts
interface Response {
  patients: PatientHTTP[]
  meta: {
    pageIndex:  number
    perPage:    number
    totalCount: number
  }
}
```

#### Como implementar

```ts
// services/patient.service.ts
export async function fetchPatients(params: FetchPatientsParams) {
  const { data } = await api.get<{
    patients: PatientHTTP[]
    meta: PaginationMeta
  }>('/patients', { params })
  return data
}

// hooks/use-patients.ts
export function usePatients(params: FetchPatientsParams) {
  return useQuery({
    queryKey: ['patients', params],
    queryFn: () => fetchPatients(params),
  })
}
```

#### Erros

| Status | Quando |
|---|---|
| `401` | Token ausente ou inválido |

---

### 2. `GET /patients/:id` — Buscar paciente por ID

**Auth**: 🔒 JWT obrigatório  
**Controller**: `get-patient-by-id.controller.ts`  
**Quando usar**: Carregar dados de um paciente específico (header do perfil, etc.).

#### Path params

```ts
id: string  // UUID válido — validado pelo backend com Zod
```

#### Response `200 OK`

```ts
interface Response {
  patient: PatientHTTP
}
```

#### Como implementar

```ts
// services/patient.service.ts
export async function getPatientById(id: string) {
  const { data } = await api.get<{ patient: PatientHTTP }>(`/patients/${id}`)
  return data.patient
}

// hooks/use-patient.ts
export function usePatient(id: string) {
  return useQuery({
    queryKey: ['patient', id],
    queryFn: () => getPatientById(id),
    enabled: !!id,
  })
}
```

#### Erros

| Status | Quando |
|---|---|
| `400` | `id` não é um UUID válido |
| `401` | Paciente pertence a outro psicólogo (ou token inválido) |
| `404` | Paciente não encontrado |

---

### 3. `GET /patients/stats/card` — Total de pacientes (card do dashboard)

**Auth**: 🔒 JWT obrigatório  
**Controller**: `get-amount-patients-card.controller.ts`  
**Quando usar**: Card "Total de Pacientes" no dashboard.

> ⚠️ **Atenção ao nome confuso**: este endpoint (`get-amount-patients-card`) é diferente de `get-amount-patients` (que é `GET /patients/stats/new`). São dois controllers distintos.

#### Sem parâmetros.

#### Response `200 OK`

```ts
interface Response {
  amount: number
}
```

#### Como implementar

```ts
// services/patient.service.ts
export async function getPatientCount() {
  const { data } = await api.get<{ amount: number }>('/patients/stats/card')
  return data.amount
}

// hooks/use-patient-count.ts
export function usePatientCount() {
  return useQuery({
    queryKey: ['patients', 'count'],
    queryFn: getPatientCount,
  })
}
```

---

### 4. `GET /patients/:id/details` — Detalhes completos do paciente (com sessões)

**Auth**: 🔒 JWT obrigatório  
**Controller**: `get-patient-details.controller.ts`  
**Quando usar**: Página de perfil do paciente com histórico de sessões.

#### Path params

```ts
id: string  // UUID do paciente
```

#### Query params

```ts
pageIndex?: number  // default: 0 (zero-indexed)
// perPage é SEMPRE 5 — não configurável, hardcoded no backend
```

#### Response `200 OK`

```ts
interface Response {
  patient: {
    id:              string
    firstName:       string
    lastName:        string
    cpf:             string | null
    email:           string | null
    profileImageUrl: string | null
    phoneNumber:     string | null
    dateOfBirth:     string | null  // ISO 8601
    gender:          'OTHER' | 'FEMININE' | 'MASCULINE'
    sessions: Array<{
      id:          string
      date:        string        // ISO 8601
      sessionDate: string        // ISO 8601 (igual a date)
      createdAt:   string        // ISO 8601
      theme:       string        // diagnosis ou 'Sem tema registrado'
      duration:    string        // '50 min' | 'Menos de 1 min' | 'Aguardando sessão'
      status:      'Concluída' | 'Pendente'  // ⚠️ string PT-BR, NÃO é enum
      content:     string | null
    }>
  }
  meta: {
    pageIndex:       number
    perPage:         number   // sempre 5
    totalCount:      number   // total de agendamentos do paciente
    averageDuration: number | null  // média em minutos
  }
}
```

> ⚠️ **`session.status` não é enum**: Os valores `'Concluída'` e `'Pendente'` são strings localizadas em PT-BR. Use apenas para exibição. Para lógica, use `session.date` ou `session.sessionDate`.

#### Como implementar

```ts
// services/patient.service.ts
export async function getPatientDetails(id: string, pageIndex = 0) {
  const { data } = await api.get<{
    patient: PatientDetailsData
    meta: PatientDetailsMeta
  }>(`/patients/${id}/details`, {
    params: { pageIndex },
  })
  return data
}

// hooks/use-patient-details.ts
export function usePatientDetails(id: string, pageIndex = 0) {
  return useQuery({
    queryKey: ['patient', id, 'details', pageIndex],
    queryFn: () => getPatientDetails(id, pageIndex),
    enabled: !!id,
  })
}
```

#### Erros

| Status | Quando |
|---|---|
| `404` | Paciente não encontrado ou acesso negado |

---

### 5. `GET /patients/stats/age` — Distribuição por faixa etária

**Auth**: 🔒 JWT obrigatório  
**Controller**: `get-patients-age.controller.ts`  
**Quando usar**: Gráfico de faixa etária no dashboard.

#### Sem parâmetros.

#### Response `200 OK`

```ts
// Array direto, sem wrapper
type Response = Array<{
  ageRange: '0-17' | '18-25' | '26-35' | '36-50' | '51+'
  patients: number
}>
```

> ⚠️ Pacientes sem `dateOfBirth` são **ignorados**. O total pode ser menor que o total de pacientes.

> ⚠️ A resposta é um **array direto** (sem chave wrapper). `data` já é o array.

#### Como implementar

```ts
// services/patient.service.ts
export async function getPatientsByAge() {
  const { data } = await api.get<AgeRangeItem[]>('/patients/stats/age')
  return data  // já é o array
}

// hooks/use-patients-age.ts
export function usePatientsByAge() {
  return useQuery({
    queryKey: ['patients', 'stats', 'age'],
    queryFn: getPatientsByAge,
  })
}
```

---

### 6. `GET /patients/stats/gender` — Distribuição por gênero

**Auth**: 🔒 JWT obrigatório  
**Controller**: `get-patients-by-gender.controller.ts`  
**Quando usar**: Gráfico de gênero no dashboard.

#### Sem parâmetros.

#### Response `200 OK`

```ts
// Array direto, sem wrapper. Sempre retorna os 3 gêneros (count pode ser 0).
type Response = Array<{
  gender:   'OTHER' | 'FEMININE' | 'MASCULINE'
  patients: number
}>
```

> ⚠️ **Sempre retorna 3 itens** — um para cada valor de `Gender`. Não filtra os que têm `count = 0`.

#### Como implementar

```ts
// services/patient.service.ts
export async function getPatientsByGender() {
  const { data } = await api.get<GenderItem[]>('/patients/stats/gender')
  return data
}

// hooks/use-patients-gender.ts
export function usePatientsByGender() {
  return useQuery({
    queryKey: ['patients', 'stats', 'gender'],
    queryFn: getPatientsByGender,
  })
}
```

---

### 7. `GET /patients/stats/new` — Novos pacientes por período

**Auth**: 🔒 JWT obrigatório  
**Controller**: `get-amount-patients.controller.ts`

> 🚫 **NÃO IMPLEMENTADO**: Este endpoint existe e retorna `200`, mas **sempre retorna `[]`**. A query SQL está comentada no repositório. Não construa funcionalidade que dependa de dados reais daqui.

#### Query params

```ts
startDate: string  // ISO date ex: '2025-01-01' — obrigatório
endDate:   string  // ISO date ex: '2025-03-31' — obrigatório
```

#### Response `200 OK`

```ts
// Sempre []
type Response = Array<{
  date:        string  // 'YYYY-MM-DD'
  newPatients: number
}>
```

#### Como implementar (para quando for implementado)

```ts
export async function getNewPatients(params: GetAmountPatientsParams) {
  const { data } = await api.get<NewPatientsItem[]>('/patients/stats/new', { params })
  return data
}
```

---

### 8. `GET /patients/filter/with-attachments` — Pacientes com arquivos

**Auth**: 🔒 JWT obrigatório  
**Controller**: `fetch-patients-with-attachments.controller.ts`  
**Quando usar**: Dropdown ou filtro de pacientes que têm documentos anexados.

#### Sem parâmetros.

#### Response `200 OK`

```ts
interface Response {
  patients: PatientHTTP[]
}
```

#### Como implementar

```ts
export async function getPatientsWithAttachments() {
  const { data } = await api.get<{ patients: PatientHTTP[] }>(
    '/patients/filter/with-attachments'
  )
  return data.patients
}

export function usePatientsWithAttachments() {
  return useQuery({
    queryKey: ['patients', 'with-attachments'],
    queryFn: getPatientsWithAttachments,
  })
}
```

---

### 9. `GET /attachments/patient/:patientId` — Arquivos de um paciente

**Auth**: 🔒 JWT obrigatório  
**Controller**: `fetch-patient-attachments.controller.ts`  
**Quando usar**: Aba de documentos na página do paciente.

#### Path params

```ts
patientId: string  // UUID do paciente
```

#### Response `200 OK`

```ts
interface Response {
  attachments: Array<{
    id:         string
    filename:   string
    url:        string   // URL para download (S3 ou equivalente)
    type:       string   // MIME type: 'application/pdf', 'image/png', etc.
    size:       number   // tamanho em bytes
    uploadedAt: string   // ISO 8601
  }>
}
```

#### Como implementar

```ts
export async function getPatientAttachments(patientId: string) {
  const { data } = await api.get<{ attachments: AttachmentItem[] }>(
    `/attachments/patient/${patientId}`
  )
  return data.attachments
}

export function usePatientAttachments(patientId: string) {
  return useQuery({
    queryKey: ['patient', patientId, 'attachments'],
    queryFn: () => getPatientAttachments(patientId),
    enabled: !!patientId,
  })
}
```

---

### 10. `GET /patients/stats/card` (admin) → `GET /admin/metrics/patients/total`

**Auth**: 🔒 JWT + role `SUPER_ADMIN`  
**Controller**: `get-total-patients.controller.ts`  
**Quando usar**: Dashboard administrativo — total global de pacientes no sistema.

#### Sem parâmetros.

#### Response `200 OK`

```ts
interface Response {
  total: number
}
```

#### Erros

| Status | Quando |
|---|---|
| `401` | Usuário não tem role `SUPER_ADMIN` |

#### Como implementar

```ts
export async function getTotalPatientsAdmin() {
  const { data } = await api.get<{ total: number }>(
    '/admin/metrics/patients/total'
  )
  return data.total
}
```

---

### 11. `GET /admin/metrics/patients/new` — Gráfico de novos pacientes (admin)

**Auth**: 🔒 JWT + role `SUPER_ADMIN`  
**Controller**: `get-admin-patients-chart.controller.ts`  
**Quando usar**: Gráfico de crescimento no painel administrativo.

#### Query params

```ts
startDate: string  // ISO date — obrigatório
endDate:   string  // ISO date — obrigatório
```

#### Response `200 OK`

```ts
type Response = Array<{
  date:        string  // 'YYYY-MM-DD'
  newPatients: number
}>
```

#### Erros

| Status | Quando |
|---|---|
| `401` | Usuário não tem role `SUPER_ADMIN` |

#### Como implementar

```ts
export async function getAdminPatientsChart(params: GetAmountPatientsParams) {
  const { data } = await api.get<NewPatientsItem[]>(
    '/admin/metrics/patients/new',
    { params }
  )
  return data
}
```

---

### 12. `GET /invites/:hash` — Info do link de convite

**Auth**: 🌐 Público — sem JWT  
**Controller**: `get-registration-link.controller.ts`  
**Quando usar**: Página de cadastro do paciente via link de convite. Chamado ao carregar a rota `/register/:hash` para saber quem convidou.

#### Path params

```ts
hash: string  // hash único da URL de convite
```

#### Response `200 OK`

```ts
interface Response {
  psychologistId:   string  // UUID
  psychologistName: string  // firstName + lastName do psicólogo
  expiresAt:        string  // ISO 8601
}
```

#### Erros

| Status | Quando |
|---|---|
| `404` | Hash não existe (`INVALID_LINK`) |
| `410` | Link expirado (`EXPIRED_LINK`) |
| `422` | Psicólogo foi deletado após a criação do link (`ORPHAN_LINK`) |

#### Como implementar

```ts
// Sem auth — não passa token
export async function getInviteInfo(hash: string) {
  const { data } = await apiPublic.get<RegistrationLinkInfo>(
    `/invites/${hash}`
  )
  return data
}

// hooks/use-invite-info.ts
export function useInviteInfo(hash: string) {
  return useQuery({
    queryKey: ['invite', hash],
    queryFn: () => getInviteInfo(hash),
    enabled: !!hash,
    retry: false,  // não retentar em 404/410/422
  })
}
```

> Use uma instância separada `apiPublic` (sem o interceptor de JWT) para esta chamada.

---

### 13. `GET /appointments/pending/:patientId` — Próximo agendamento do paciente

**Auth**: 🔒 JWT obrigatório  
**Controller**: `get-scheduled-appointment.controller.ts`  
**Quando usar**: Verificar se o paciente já tem um agendamento ativo antes de criar outro. Exibir badge de "sessão agendada" no card do paciente.

#### Path params

```ts
patientId: string  // UUID do paciente — validado pelo backend com Zod
```

#### Response `200 OK`

```ts
interface Response {
  appointmentId: string
  scheduledAt:   string             // ISO 8601
  patientId:     string             // UUID
  status:        AppointmentStatus  // na prática sempre 'SCHEDULED'
}
```

#### Erros

| Status | Quando |
|---|---|
| `400` | `patientId` não é UUID válido |
| `404` | Nenhum agendamento pendente encontrado |

#### Como implementar

```ts
export async function getPendingAppointment(patientId: string) {
  const { data } = await api.get<ScheduledAppointmentResponse>(
    `/appointments/pending/${patientId}`
  )
  return data
}

export function usePendingAppointment(patientId: string) {
  return useQuery({
    queryKey: ['appointment', 'pending', patientId],
    queryFn: () => getPendingAppointment(patientId),
    enabled: !!patientId,
    // 404 é esperado quando não há agendamento — trate no componente
  })
}
```

---

### 14. `GET /dashboard` — Dados agregados do dashboard

**Auth**: 🔒 JWT obrigatório  
**Controller**: `get-dashboard-data.controller.ts`  
**Quando usar**: Carregar a tela principal do dashboard em uma única chamada.

> Este endpoint é um agregador: internamente chama `countByPsychologistId`, `countPatientsByGender`, `GetPatientsByAge`, e `findManyByPsychologist` (próximas sessões) em paralelo.

#### Query params

```ts
startDate?: string  // ISO date — opcional. Necessário para receber newPatientsLast7Days
endDate?:   string  // ISO date — opcional
```

> ⚠️ Mesmo passando `startDate` e `endDate`, `newPatientsLast7Days` sempre retorna `[]` (não implementado).

#### Response `200 OK`

```ts
interface Response {
  totalPatients:        number
  patientsByGender:     Array<{ gender: Gender; patients: number }>
  patientsByAge:        Array<{ ageRange: AgeRange; patients: number }>
  upcomingAppointments: Array<{  // próximas 5 sessões, ordem crescente
    id:             string
    patientId:      string | null
    psychologistId: string | null
    diagnosis:      string
    content:        string | null
    scheduledAt:    string             // ISO 8601
    durationInMin:  number | null
    status:         AppointmentStatus
    createdAt:      string             // ISO 8601
  }>
  newPatientsLast7Days: Array<{  // ⚠️ sempre []
    date:        string
    newPatients: number
  }>
}
```

#### Como implementar

```ts
export async function getDashboardData(params?: GetDashboardParams) {
  const { data } = await api.get<DashboardResponse>('/dashboard', { params })
  return data
}

export function useDashboard(params?: GetDashboardParams) {
  return useQuery({
    queryKey: ['dashboard', params],
    queryFn: () => getDashboardData(params),
    staleTime: 1000 * 60 * 5,  // 5 min — dados do dashboard não mudam a cada segundo
  })
}
```

---

## Armadilhas comuns

### ❌ Usar `status: 'all'` em query params
```ts
// Errado — envia 'all' que o backend normaliza para null
params.status = 'all'

// Correto — omite o campo quando não há filtro
const params: FetchPatientsParams = {
  pageIndex: 0,
  perPage: 10,
  // status: omitido = sem filtro
}
```

### ❌ Tratar `session.status` como enum
```ts
// Errado — 'Concluída' não é AppointmentStatus
if (session.status === AppointmentStatus.FINISHED) { ... }

// Correto — 'Concluída' é string PT-BR só para exibição
const isFinished = session.status === 'Concluída'
```

### ❌ Campos nullable sem `| null`
```ts
// Errado — email pode ser null no backend
interface Patient { email: string }

// Correto
interface Patient { email: string | null }
// ou simplesmente importe PatientHTTP de types.ts
```

### ❌ Chamar GET /patients/:cpf ou /:email
```ts
// Errado — conflito de rota com GET /patients/:id
api.get(`/patients/${cpf}`)

// Correto — use o filtro de texto
api.get('/patients', { params: { filter: cpf } })
```

### ❌ pageIndex começando em 1
```ts
// Errado — backend é zero-indexed
const page = 1

// Correto
const pageIndex = 0  // primeira página
```

### ❌ `undefined` onde o backend retorna `null`
```ts
// Errado — campo ausente vs null são diferentes
if (patient.email === undefined) { ... }

// Correto — o backend NUNCA retorna undefined, sempre null
if (patient.email === null) { ... }
```

---

## Quick Reference — todos os endpoints

| # | Rota | Auth | Response shape | Controller |
|---|---|---|---|---|
| 1 | `GET /patients` | 🔒 JWT | `{ patients: PatientHTTP[], meta }` | `fetch-patients` |
| 2 | `GET /patients/:id` | 🔒 JWT | `{ patient: PatientHTTP }` | `get-patient-by-id` |
| 3 | `GET /patients/stats/card` | 🔒 JWT | `{ amount: number }` | `get-amount-patients-card` |
| 4 | `GET /patients/:id/details` | 🔒 JWT | `{ patient: PatientDetailsData, meta: PatientDetailsMeta }` | `get-patient-details` |
| 5 | `GET /patients/stats/age` | 🔒 JWT | `AgeRangeItem[]` (array direto) | `get-patients-age` |
| 6 | `GET /patients/stats/gender` | 🔒 JWT | `GenderItem[]` (array direto) | `get-patients-by-gender` |
| 7 | `GET /patients/stats/new` | 🔒 JWT | `NewPatientsItem[]` ⚠️ sempre `[]` | `get-amount-patients` |
| 8 | `GET /patients/filter/with-attachments` | 🔒 JWT | `{ patients: PatientHTTP[] }` | `fetch-patients-with-attachments` |
| 9 | `GET /attachments/patient/:patientId` | 🔒 JWT | `{ attachments: AttachmentItem[] }` | `fetch-patient-attachments` |
| 10 | `GET /admin/metrics/patients/total` | 🔒 JWT + SUPER_ADMIN | `{ total: number }` | `get-total-patients` |
| 11 | `GET /admin/metrics/patients/new` | 🔒 JWT + SUPER_ADMIN | `NewPatientsItem[]` | `get-admin-patients-chart` |
| 12 | `GET /invites/:hash` | 🌐 Público | `RegistrationLinkInfo` | `get-registration-link` |
| 13 | `GET /appointments/pending/:patientId` | 🔒 JWT | `ScheduledAppointmentResponse` | `get-scheduled-appointment` |
| 14 | `GET /dashboard` | 🔒 JWT | `DashboardResponse` | `get-dashboard-data` |
