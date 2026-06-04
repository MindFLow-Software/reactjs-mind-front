# Appointments — Frontend Validator Requirements

> Source of truth: backend Zod schemas + controllers.
> All shapes verified against backend source as of 2026-05-31.
> Auth: todos os endpoints exigem JWT (cookie) exceto onde indicado.

---

## `AppointmentStatus` — enum de referência

Todos os campos `status` usam exatamente estes 7 valores:

```ts
type AppointmentStatus =
  | 'SCHEDULED'
  | 'ATTENDING'
  | 'FINISHED'
  | 'CANCELED'
  | 'NOT_ATTEND'
  | 'RESCHEDULED'
  | 'DONE'
```

**Backend proof:** `src/core/domain/main/enterprise/entities/appointment.ts`

---

## 1. POST `/appointments` — Criar agendamento

**Schema:** `src/validators/appointments/controllers/create-appointment-schema.ts`

### Request body

| Campo | Tipo | Obrigatório | Regras |
|-------|------|-------------|--------|
| `patientId` | `string` | ✅ | UUID válido |
| `psychologistId` | `string \| null` | ❌ | UUID válido — **ignorado pelo backend** (usa JWT) |
| `diagnosis` | `string` | ✅ | `min(1)` |
| `content` | `string` | ❌ | sem restrição de tamanho |
| `scheduledAt` | `string` (ISO 8601) | ✅ | coercido para Date no backend |
| `startedAt` | `string` (ISO 8601) | ❌ | **ignorado pelo backend** — validado mas descartado |
| `endedAt` | `string` (ISO 8601) | ❌ | **ignorado pelo backend** — validado mas descartado |
| `status` | `AppointmentStatus` | ✅ | um dos 7 valores do enum |

> ⚠️ `psychologistId`, `startedAt` e `endedAt` são aceitos na validação mas o controller
> os descarta. O `psychologistId` real vem do JWT (`user.sub`).

> ⚠️ `status` é **obrigatório**. Se o frontend omitir, o backend retorna 400.
> Para criar um agendamento normal, enviar `"SCHEDULED"`.

### Response `201`

```json
{
  "message": "Agendamento criado com sucesso",
  "appointment": { /* appointment entity — shape não normalizada por presenter */ }
}
```

---

## 2. GET `/appointments` — Listar agendamentos do psicólogo autenticado

**Schema:** `src/validators/appointments/controllers/fetch-appointments-schema.ts`

### Query params

| Param | Tipo | Default | Regras |
|-------|------|---------|--------|
| `pageIndex` | `number` | `0` | inteiro ≥ 0, enviado como string na URL |
| `perPage` | `number` | `10` | inteiro ≥ 1, enviado como string na URL |
| `orderBy` | `'asc' \| 'desc'` | `'asc'` | exatamente um dos dois |
| `startDate` | `string` (ISO 8601) | — | coercido para Date |
| `endDate` | `string` (ISO 8601) | — | coercido para Date |
| `patientName` | `string` | — | backend trimma e converte `""` para `undefined` |

> ⚠️ Esta rota **não retorna `meta`** de paginação — apenas o array de appointments.

### Response `200`

```json
{
  "appointments": [ /* array de appointments — shape vem direto do use case */ ]
}
```

---

## 3. GET `/appointments/:psychologistId` — Listar por ID do psicólogo

**Schema:** `src/validators/appointments/controllers/fetch-appointments-by-psychologist-schema.ts`

### Path param

| Param | Tipo | Regras |
|-------|------|--------|
| `psychologistId` | `string` | UUID válido |

### Query params

| Param | Tipo | Default | Regras |
|-------|------|---------|--------|
| `pageIndex` | `number` | `0` | enviado como string na URL |
| `perPage` | `number` | `10` | enviado como string na URL |
| `orderBy` | `'asc' \| 'desc'` | `'asc'` | — |

### Response `200`

```json
{
  "appointments": [
    {
      "id": "string",
      "status": "AppointmentStatus",
      "diagnosis": "string",
      "content": "string | null",
      "scheduledAt": "ISO date string",
      "patientName": "string",
      "patient": { "firstName": "string", "lastName": "string" } | null
    }
  ],
  "meta": {
    "pageIndex": 0,
    "perPage": 10,
    "totalCount": 0
  }
}
```

> Esta rota **retorna `meta`** com paginação. Diferente do `GET /appointments` (rota 2).

---

## 4. GET `/appointments/:id` — Buscar agendamento por ID

**Schema:** `src/validators/appointments/controllers/get-appointment-by-id-schema.ts`

### Path param

| Param | Tipo | Regras |
|-------|------|--------|
| `id` | `string` | UUID válido |

### Response `200`

Shape retornada diretamente do use case — sem presenter normalizado.

---

## 5. GET `/appointments/available-slots` — Slots disponíveis

**Schema:** `src/validators/appointments/controllers/get-available-slots-schema.ts`

### Query params

| Param | Tipo | Obrigatório | Regras |
|-------|------|-------------|--------|
| `psychologistId` | `string` | ✅ | UUID válido |
| `date` | `string` (ISO 8601) | ✅ | coercido para Date |

### Response `200`

```json
{
  "slots": [ /* array de slots disponíveis */ ]
}
```

---

## 6. GET `/appointments/pending/:patientId` — Agendamento pendente de um paciente

**Schema:** `src/validators/appointments/controllers/get-scheduled-appointment-schema.ts`

### Path param

| Param | Tipo | Regras |
|-------|------|--------|
| `patientId` | `string` | UUID válido |

### Response `200`

```json
{
  "appointmentId": "string",
  "scheduledAt": "ISO date string",
  "patientId": "string",
  "status": "AppointmentStatus"
}
```

### Response `404`

Retorna `RESOURCE_NOT_FOUND` se nenhum agendamento `SCHEDULED` existir para o paciente.

---

## 7. PUT `/appointments/:id/reschedule` — Reagendar

**Schema:** `src/validators/appointments/controllers/reschedule-appointment-schema.ts`

### Path param

| Param | Tipo | Regras |
|-------|------|--------|
| `id` | `string` | UUID (sem validação Zod no param — enviado diretamente) |

### Request body

| Campo | Tipo | Obrigatório | Regras |
|-------|------|-------------|--------|
| `newDate` | `string` | ✅ | `z.string().datetime()` — ISO 8601 **com timezone** |

> ⚠️ `z.string().datetime()` exige formato completo com timezone:
> `"2026-06-01T14:00:00.000Z"` — **não aceita** `"2026-06-01"` nem `"2026-06-01T14:00:00"`.

### Response `200`

Sem body.

---

## 8. PATCH `/appointments/:id/start` — Iniciar consulta (muda status para ATTENDING)

Sem schema Zod. Param `id` extraído diretamente do path.

### Response `204`

Sem body.

---

## 9. POST `/appointments/:appointmentId/start` — Criar sessão vinculada à consulta

**Schema:** `src/validators/appointments/controllers/start-appointment-session-schema.ts`

> ⚠️ **Esta rota é diferente da rota 8.** Ela cria uma entidade de `Session` separada
> e retorna um `sessionId`. A rota 8 apenas muda o status do appointment.

### Path param

| Param | Tipo | Regras |
|-------|------|--------|
| `appointmentId` | `string` | UUID válido |

### Response `201`

```json
{
  "message": "Sessão iniciada!",
  "sessionId": "string"
}
```

---

## 10. POST `/sessions/:id/finish` — Finalizar sessão

> ⚠️ Base path é `/sessions`, **não** `/appointments`.

Sem schema Zod — body não validado.

### Path param

| Param | Tipo |
|-------|------|
| `id` | `string` (sessionId) |

### Request body (sem validação)

```ts
{ content?: string }
```

### Response `200`

Sem body.

---

## 11. PUT `/appointments/:id` — Atualizar agendamento

**Schema:** `src/validators/appointments/controllers/update-appointment-schema.ts`

### Path param

| Param | Tipo | Regras |
|-------|------|--------|
| `id` | `string` | UUID válido |

### Request body (todos opcionais)

| Campo | Tipo | Regras |
|-------|------|--------|
| `diagnosis` | `string` | opcional, sem min |
| `content` | `string` | opcional |
| `scheduledAt` | `string` (ISO 8601) | opcional, coercido para Date |

### Response `204`

Sem body.

---

## 12. PATCH `/appointments/:id/cancel` — Cancelar agendamento

Sem schema Zod.

### Response `204`

Sem body.

### Erros possíveis

| Código | HTTP | Quando |
|--------|------|--------|
| `APPOINTMENT_NOT_SCHEDULED` | 422 | appointment não está em status `SCHEDULED` |
| `NOT_ALLOWED` | 403 | psicólogo não é dono do agendamento |

---

## 13. DELETE `/appointments/:id` — Deletar agendamento

Sem schema Zod.

### Response `204`

Sem body.

---

## 14. GET `/appointments/active/grouped` — Consultas ativas agrupadas por data

Sem schema Zod — usa apenas JWT.

### Response `200`

```json
{
  "grouped": {
    "2026-05-31": [
      {
        "id": "string",
        "patientId": "string",
        "patientName": "string",
        "diagnosis": "string",
        "scheduledAt": "ISO date string",
        "status": "AppointmentStatus",
        "content": "string | null"
      }
    ]
  }
}
```

Chave do objeto é a data no formato retornado pelo backend (verificar se é `YYYY-MM-DD` ou ISO completo).

---

## 15. GET `/appointments/metrics/daily-count` — Métricas diárias de sessões

Sem schema Zod — params extraídos como `string` crua.

### Query params

| Param | Tipo | Regras |
|-------|------|--------|
| `startDate` | `string` | ISO 8601 — backend faz `new Date(startDate)` |
| `endDate` | `string` | ISO 8601 — backend faz `new Date(endDate)` |

### Response `200`

Retorna diretamente o valor de `metrics` do use case — shape não documentada por presenter.

---

## 16. GET `/appointments/metrics/month-count` — Contagem mensal de sessões

Sem schema Zod — mesma estrutura do endpoint 15.

### Query params

Idêntico ao endpoint 15: `startDate` e `endDate` como ISO strings.

### Response `200`

```json
{ "count": number }
```

---

## Resumo — o que o frontend precisa ajustar

| # | Endpoint | Campo | Problema | Ação |
|---|----------|-------|---------|------|
| 1 | POST `/appointments` | `status` | Campo obrigatório no schema | Sempre enviar — default `"SCHEDULED"` |
| 1 | POST `/appointments` | `psychologistId` | Ignorado pelo backend | Pode omitir |
| 1 | POST `/appointments` | `startedAt`, `endedAt` | Ignorados pelo backend | Pode omitir |
| 2 | GET `/appointments` | response | Sem `meta` | Não esperar paginação na resposta |
| 3 | GET `/appointments/:psychologistId` | response | Tem `meta` | Tipar corretamente com `meta` |
| 7 | PUT `…/reschedule` | `newDate` | `z.string().datetime()` — timezone obrigatório | Enviar ISO 8601 completo com `Z` ou offset |
| 8 vs 9 | start | dois endpoints diferentes | `PATCH /:id/start` (204) vs `POST /:id/start` (201 + sessionId) | Usar o correto para cada fluxo |
| 10 | POST `/sessions/:id/finish` | base path | `/sessions/`, não `/appointments/` | Corrigir URL |
| 15/16 | metrics | query params | Sem Zod — enviar como ISO string | Garantir formato ISO |
