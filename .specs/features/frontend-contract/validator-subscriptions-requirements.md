# Subscriptions — Frontend Validator Requirements

> Source of truth: backend validators + controllers + entity.
> Verificado contra o código-fonte em 2026-05-31.

---

## Tipos de referência

```ts
type PlanInterval = 'MONTHLY' | 'YEARLY'
```

---

## Aviso — paths inconsistentes

Cada operação usa um path base diferente:

| Operação | Path |
|----------|------|
| Criar | `/subscription-plan` |
| Deletar | `/subcription-plan` ← **typo: falta o 's'** |
| Listar / Buscar por ID | `/plans` |

> ⚠️ O DELETE usa `/subcription-plan` (sem o `s` em `subscription`). Enviar para
> `/subscription-plan/:id` causará 404.

---

## 1. POST `/subscription-plan` — Criar plano de assinatura

**Schema:** `src/validators/subscriptions/controllers/create-subscription-plan-schema.ts`

> ⚠️ Sem JWT guard declarado no controller.

### Request body

| Campo | Tipo | Obrigatório | Regras |
|-------|------|-------------|--------|
| `name` | `string` | ✅ | `z.string()` — sem `min(1)`, aceita string vazia |
| `description` | `string[]` | ✅ | **array de strings** — não string simples |
| `priceInCents` | `number` | ✅ | `z.number()` — sem `int()` nem `min()`, aceita float e negativo |
| `interval` | `string` | ✅ | `'MONTHLY' \| 'YEARLY'` — obrigatório, sem default |

> ⚠️ `description` é um **array de strings**, não uma string. Cada item representa
> uma feature/bullet do plano. Ex: `["Até 50 pacientes", "Suporte prioritário"]`.

> ⚠️ `priceInCents` não tem validação de inteiro nem mínimo — o frontend deve garantir
> que é inteiro positivo antes de enviar.

> ⚠️ `interval` é **obrigatório** no schema — o default `MONTHLY` da entity só é
> aplicado se o campo for omitido na criação da entidade, não no schema Zod.

### Response `201`

Sem body — o controller não tem `return`.

**Backend proof:** `src/infra/http/controllers/subscriptions/create-subscription-plan.controller.ts`

---

## 2. DELETE `/subcription-plan/:planId` — Deletar plano

**Schema:** `src/validators/subscriptions/controllers/delete-subscription-plan-schema.ts`

> ⚠️ **Typo no path:** `/subcription-plan` (sem `s`). Usar exatamente este path.

> ⚠️ Sem JWT guard declarado.

> ⚠️ `planId: z.string()` — **não** `z.uuid()`. Aceita qualquer string.

### Response `204`

Sem body.

**Backend proof:** `src/infra/http/controllers/subscriptions/delete-subscription-plan.controller.ts`

---

## 3. GET `/plans` — Listar todos os planos

Sem schema Zod. Sem query params. Sem JWT guard.

### Response `200`

```json
{
  "subscriptionPlans": [ /* array de planos — shape crua do use case */ ]
}
```

Shape esperado de cada plano (baseado na entidade):

```ts
{
  id: string
  name: string
  description: string[]   // array de strings
  priceInCents: number
  interval: 'MONTHLY' | 'YEARLY'
}
```

**Backend proof:** `src/infra/http/controllers/subscriptions/fetch-subscription-plans.controller.ts`

---

## 4. GET `/plans/:id` — Buscar plano por ID

**Schema:** `src/validators/subscriptions/controllers/get-subscription-plan-by-id-schema.ts`
— `id: z.string().uuid()`

> ⚠️ Sem JWT guard.

### Response `200`

```json
{
  "subscriptionPlan": { /* shape crua do use case */ }
}
```

**Backend proof:** `src/infra/http/controllers/subscriptions/get-subscription-plan-by-id.controller.ts`

---

## Resumo — o que o frontend precisa saber

| # | Endpoint | Problema | Ação |
|---|----------|---------|------|
| 1 | POST `/subscription-plan` | `description` é `string[]`, não `string` | Enviar array |
| 1 | POST `/subscription-plan` | `priceInCents` sem validação de inteiro | Garantir inteiro positivo no frontend |
| 1 | POST `/subscription-plan` | Sem body no response 201 | Não esperar dados na resposta |
| 2 | DELETE `/subcription-plan/:planId` | **Typo no path** — falta `s` | Usar `/subcription-plan/`, não `/subscription-plan/` |
| 2 | DELETE `/subcription-plan/:planId` | `planId` aceita qualquer string | Schema não valida UUID |
| 1–4 | Todos | Sem JWT guard | Verificar se guard global da app protege |
