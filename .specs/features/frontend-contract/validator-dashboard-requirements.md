# Dashboard — Frontend Validator Requirements

> Source of truth: backend validators, controllers e use cases.
> Verificado contra o código-fonte em 2026-05-31.
> Auth: todos os endpoints exigem JWT.

---

## 1. GET `/dashboard` — Dados do dashboard do psicólogo

**Schema:** `src/validators/dashboard/controllers/dashboard-schema.ts`

### Query params

| Param | Tipo | Obrigatório | Regras |
|-------|------|-------------|--------|
| `startDate` | `string` (ISO 8601) | ❌ | `z.coerce.date()` — backend converte para Date |
| `endDate` | `string` (ISO 8601) | ❌ | `z.coerce.date()` — backend converte para Date |

> ⚠️ `newPatientsLast7Days` só é calculado se **ambos** `startDate` e `endDate` forem
> enviados. Se um ou ambos forem omitidos, o campo retorna array vazio `[]`.

### Response `200`

O controller faz `return data` direto do use case — **sem presenter normalizado**.

```ts
{
  totalPatients: number,

  patientsByGender: Array<{
    gender: 'OTHER' | 'FEMININE' | 'MASCULINE'
    count: number
  }>,

  patientsByAge: Array<{
    range: '0-17' | '18-25' | '26-35' | '36-50' | '51+'
    count: number
  }>,

  upcomingAppointments: Appointment[],  // entidades de domínio — ver nota abaixo

  newPatientsLast7Days: Array<{
    date: Date       // objeto Date serializado — chega como ISO string no JSON
    newPatients: number
  }>
}
```

> ⚠️ **`upcomingAppointments` retorna entidades de domínio cruas**, não DTOs normalizados
> por presenter. O shape pode incluir `props` aninhado dependendo da serialização.
> Os campos disponíveis são: `id`, `patientId`, `psychologistId`, `diagnosis`, `content`,
> `scheduledAt`, `durationInMin`, `status`, `createdAt`. Recomenda-se tratar esse campo
> com cautela e verificar o shape real em runtime.

> ⚠️ **Bug conhecido no backend** — `patientsByAge`: o incremento de `'51+'` está fora
> do bloco `else if`, então todo paciente com `dateOfBirth` definido incrementa a faixa
> `51+` independente da idade. Os dados desta faixa estarão inflados. Não corrigir no
> frontend — apenas documentar para não confundir o usuário.

**Backend proof:** `src/core/domain/main/application/use-cases/dashboard/get-dashboard-data.ts`

---

## 2. GET `/suggestions/ranking` — Ranking de sugestões implementadas

> ⚠️ Rota agrupada no módulo de dashboard mas o path é `/suggestions/ranking`,
> **não** `/dashboard/ranking`.

Sem schema Zod. Sem query params.

### Response `200`

```json
{
  "ranking": [
    {
      "position": "1º",
      "userId": "string",
      "name": "string",
      "points": 1.5,
      "approvedIdeas": 1,
      "highlight": "string"
    }
  ]
}
```

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `position` | `string` | Ordinal em PT: `"1º"`, `"2º"` etc. |
| `userId` | `string` | UUID do psicólogo |
| `name` | `string` | `firstName + lastName` concatenados |
| `points` | `number` | Float — 1.0 por ideia implementada + 0.5 por cada 10 likes |
| `approvedIdeas` | `number` | Contagem de sugestões com status `IMPLEMENTED` |
| `highlight` | `string` | Título da sugestão mais curtida ou `"Nenhuma"` |

Ranking já vem ordenado por `points` desc.

**Backend proof:** `src/core/domain/main/application/use-cases/dashboard/get-ranking.ts`

---

## 3. GET `/sessions/total-work-hours` — Total de minutos trabalhados

> ⚠️ Base path é `/sessions/`, **não** `/dashboard/`.

Sem schema Zod — query params extraídos como raw strings.

### Query params

| Param | Tipo | Obrigatório | Regras |
|-------|------|-------------|--------|
| `startDate` | `string` (ISO 8601) | ❌ | backend faz `new Date(startDate)` diretamente |
| `endDate` | `string` (ISO 8601) | ❌ | backend faz `new Date(endDate)` diretamente |

### Response `200`

```json
{
  "totalMinutes": number
}
```

> O frontend é responsável por converter `totalMinutes` para horas/minutos na UI.
> Ex: `totalMinutes = 125` → `"2h 5min"`.

**Backend proof:** `src/infra/http/controllers/dashboard/get-total-work-hours.controller.ts`

---

## 4. GET `/admin/metrics/patients/new` — Gráfico admin de novos pacientes por data

Sem schema Zod — query params extraídos via `@Query() query: any`.

### Query params

| Param | Tipo | Obrigatório | Comportamento se omitido |
|-------|------|-------------|--------------------------|
| `startDate` | `string` (ISO 8601) | ✅ | backend faz `new Date(undefined)` → `Invalid Date` → erro em runtime |
| `endDate` | `string` (ISO 8601) | ✅ | idem |

> ⚠️ **`startDate` e `endDate` são obrigatórios** mesmo sem validação Zod. Se omitidos,
> o backend cria `new Date(undefined)` que resulta em `Invalid Date` e causa erro interno.
> O frontend deve sempre enviar ambos.

> ⚠️ A verificação de role `SUPER_ADMIN` está **comentada** no controller — qualquer
> usuário autenticado pode acessar este endpoint. Não depender dessa restrição.

### Response `200`

```ts
Array<{
  date: string      // formato "YYYY-MM-DD"
  newPatients: number
}>
```

Retorna array direto (sem wrapper). Data já formatada como string `"YYYY-MM-DD"`.

**Backend proof:** `src/infra/http/controllers/dashboard/get-admin-patients-chart.controller.ts`

---

## Resumo — o que o frontend precisa saber

| # | Endpoint | Problema | Ação |
|---|----------|---------|------|
| 1 | GET `/dashboard` | `newPatientsLast7Days` vazio sem ambas as datas | Sempre enviar `startDate` + `endDate` juntos |
| 1 | GET `/dashboard` | `upcomingAppointments` sem presenter | Tratar shape com cautela; tipar como `unknown` ou verificar em runtime |
| 1 | GET `/dashboard` | Bug em `patientsByAge['51+']` | Dados inflados — documentar, não corrigir no front |
| 2 | GET `/suggestions/ranking` | Path é `/suggestions/ranking`, não `/dashboard/ranking` | Corrigir URL da chamada |
| 3 | GET `/sessions/total-work-hours` | Path é `/sessions/`, não `/dashboard/` | Corrigir URL da chamada |
| 3 | GET `/sessions/total-work-hours` | Retorna `totalMinutes`, não horas | Converter na UI |
| 4 | GET `/admin/metrics/patients/new` | `startDate`/`endDate` obrigatórios sem guard | Sempre enviar ambos |
| 4 | GET `/admin/metrics/patients/new` | Verificação SUPER_ADMIN comentada | Não depender da restrição de role |
| 4 | GET `/admin/metrics/patients/new` | Response é array direto sem wrapper | Não esperar `{ data: [...] }` |
