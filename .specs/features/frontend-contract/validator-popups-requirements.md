# Popups — Frontend Validator Requirements

> Source of truth: backend validators, controllers e entity.
> Verificado contra o código-fonte em 2026-05-31.
> Auth: todos os endpoints exigem JWT.

---

## Tipos de referência

```ts
type PopupType   = 'MODAL' | 'SLIDE_IN' | 'BAR' | 'TOAST'
type PopupStatus = 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'ARCHIVED'
```

---

## 1. GET `/popups/active` — Listar popups ativos do psicólogo

Sem schema Zod. Sem query params. Filtra popups pelo `psychologistId` do JWT.

### Response `200`

```ts
{
  popups: Array<{
    id: string
    title: string | null
    body: string | null           // pode conter HTML
    imageUrl: string | null
    ctaText: string | null
    ctaUrl: string | null
    type: PopupType               // 'MODAL' | 'SLIDE_IN' | 'BAR' | 'TOAST'
    styleConfig: Record<string, unknown> | null
    triggerConfig: Record<string, unknown> | null
    displayRules: Record<string, unknown> | null
  }>
}
```

> ⚠️ `internalName` **não é retornado** nesta rota — apenas em `/popups/unseen`.

> ⚠️ `body` pode conter HTML inline (ex: `<div style="..."><p>...</p></div>`).
> Renderizar com `dangerouslySetInnerHTML` ou equivalente — sanitizar antes.

> ⚠️ `styleConfig`, `triggerConfig` e `displayRules` são `Record<string, unknown>` —
> shape livre definido pelo backend. Tipar como `Record<string, unknown> | null` no frontend.

**Backend proof:** `src/infra/http/controllers/popups/fetch-active-popups.controller.ts`

---

## 2. GET `/popups/unseen` — Listar popups não vistos pelo psicólogo

Sem schema Zod. Sem query params.

> ⚠️ **Shape diferente de `/popups/active`** — inclui `internalName`, omite
> `triggerConfig` e `displayRules`.

### Response `200`

```ts
{
  popups: Array<{
    id: string
    internalName: string          // presente aqui, ausente em /popups/active
    title: string | null
    body: string | null
    imageUrl: string | null
    ctaText: string | null
    ctaUrl: string | null
    type: PopupType
    styleConfig: Record<string, unknown> | null
    // triggerConfig: ausente nesta rota
    // displayRules: ausente nesta rota
  }>
}
```

**Backend proof:** `src/infra/http/controllers/popups/popups.controller.ts` (linha 19)

---

## 3. POST `/popups/:popupId/view` — Marcar popup como visto (com ação)

**Schema:** `src/validators/popups/controllers/mark-popup-as-viewed-schema.ts`

### Path param

| Param | Tipo |
|-------|------|
| `popupId` | `string` (sem validação UUID) |

### Request body

| Campo | Tipo | Obrigatório | Regras |
|-------|------|-------------|--------|
| `action` | `string` | ❌ | sem restrição — qualquer string ou omitido |

> `action` serve para registrar o que o usuário fez (ex: `"dismissed"`, `"clicked_cta"`).
> O backend aceita qualquer valor ou `undefined`.

### Response

Retorno direto do use case — shape não documentada por presenter. Verificar em runtime.

**Backend proof:** `src/infra/http/controllers/popups/mark-popup-as-viewed.controller.ts`

---

## 4. POST `/popups/:id/view` — Registrar visualização simples (sem ação)

Sem schema Zod. Sem body. Path param `id` extraído diretamente.

> ⚠️ **Dois endpoints de "marcar como visto"** com paths similares mas comportamentos
> diferentes:
>
> | Rota | Controller | Body | Use case |
> |------|-----------|------|----------|
> | `POST /popups/:popupId/view` | `MarkPopupAsViewedController` | `{ action?: string }` | `MarkPopupAsViewedUseCase` |
> | `POST /popups/:id/view` | `PopupsController` | nenhum | `RegisterPopupViewUseCase` |
>
> Ambas registram visualização, mas com use cases diferentes. Usar a que corresponde
> ao fluxo do frontend: com `action` → primeira; sem body → segunda.

### Response `200`

```json
{ "message": "View registered" }
```

**Backend proof:** `src/infra/http/controllers/popups/popups.controller.ts` (linha 39)

---

## Resumo — o que o frontend precisa saber

| # | Endpoint | Problema | Ação |
|---|----------|---------|------|
| 1 vs 2 | `/active` vs `/unseen` | Shapes diferentes — `internalName` / `triggerConfig` / `displayRules` divergem | Criar dois tipos distintos |
| 1 e 2 | `body` | Pode conter HTML | Sanitizar antes de renderizar |
| 1 e 2 | `styleConfig`, `triggerConfig`, `displayRules` | `Record<string, unknown>` — shape livre | Tipar como opaque, não assumir campos |
| 3 vs 4 | Dois endpoints de view | Use cases diferentes, bodies diferentes | Definir qual usar por fluxo |
| 3 | `action` | Campo sem enumeração definida | Documentar valores válidos internamente |
