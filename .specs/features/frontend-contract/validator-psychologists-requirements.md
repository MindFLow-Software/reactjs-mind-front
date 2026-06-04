# Psychologists — Frontend Validator Requirements

> Source of truth: backend validators + controllers.
> Verificado contra o código-fonte em 2026-05-31.

---

## Tipos de referência

```ts
type Gender    = 'OTHER' | 'FEMININE' | 'MASCULINE'

type Expertise =
  | 'OTHER'
  | 'SOCIAL'
  | 'INFANT'
  | 'CLINICAL'
  | 'JURIDICAL'
  | 'EDUCATIONAL'
  | 'ORGANIZATIONAL'
  | 'PSYCHOTHERAPIST'
  | 'NEUROPSYCHOLOGY'
```

---

## Aviso — singular vs plural

Endpoints de escrita usam `/psychologist` (singular).
Endpoints de leitura em lista usam `/psychologists` (plural).

| Operação | Path base |
|----------|-----------|
| Criar, atualizar, deletar | `/psychologist` |
| Buscar por ID, CPF, CRP, email, listar | `/psychologists` |

---

## 1. POST `/psychologist` — Criar psicólogo

**Schema:** `src/validators/psychologists/controllers/create-psychologist-schema.ts`

> ⚠️ `@Public()` está **comentado** — o controller não declara guard explícito e não tem
> `@Public()`. Comportamento de autenticação depende do guard global da aplicação.
> Testar se JWT é necessário antes de fazer o cadastro.

### Request body

| Campo | Tipo | Obrigatório | Regras |
|-------|------|-------------|--------|
| `firstName` | `string` | ✅ | `min(1)` |
| `lastName` | `string` | ✅ | `min(1)` |
| `email` | `string` | ✅ | email válido |
| `password` | `string` | ✅ | `min(8)`, `max(30)`, regex: lower+upper+dígito+especial `[!@#$%^&*]` |
| `phoneNumber` | `string` | ✅ | `min(1)` — qualquer formato |
| `dateOfBirth` | `string` (ISO 8601) | ✅ | obrigatório; idade entre 18 e 120 anos |
| `cpf` | `string` | ✅ | validado com `CPF.isValid` — **obrigatório** |
| `gender` | `string` | ✅ | `OTHER \| FEMININE \| MASCULINE` |
| `crp` | `string` | ❌ | qualquer string |
| `profileImageUrl` | `string` | ❌ | qualquer string |

> ⚠️ `password` aceita **apenas** `!@#$%^&*` como especiais — outros caracteres como
> `_`, `-`, `(` causam 400.

> ⚠️ `dateOfBirth` tem dois refines:
> - Mínimo: nascido há menos de 120 anos
> - Máximo: nascido há mais de 18 anos (conta profissional)

### Response `201`

```json
{ "message": "Psychologist created successfully" }
```

**Backend proof:** `src/infra/http/controllers/psychologists/create-psychologist.controller.ts`

---

## 2. PATCH `/psychologist/profile` — Atualizar perfil do psicólogo autenticado

**Schema:** `src/validators/psychologists/controllers/update-psychologist-schema.ts`

JWT obrigatório — usa `user.sub` como ID.

### Request body (todos opcionais)

| Campo | Tipo | Regras |
|-------|------|--------|
| `firstName` | `string` | sem min |
| `lastName` | `string` | sem min |
| `email` | `string` | email válido — não aceita `""` |
| `phoneNumber` | `string` | sem restrição |
| `crp` | `string` | sem restrição |
| `expertise` | `string` | enum `Expertise` (9 valores) |
| `profileImageUrl` | `string` | sem restrição |

> ⚠️ `gender`, `cpf` e `dateOfBirth` **não são atualizáveis** por esta rota.

### Response `200`

```json
{ "psychologist": { /* shape crua do use case — sem presenter */ } }
```

**Backend proof:** `src/infra/http/controllers/psychologists/update-psycholist-by-id.controller.ts`

---

## 3. GET `/psychologists` — Listar psicólogos

**Schema:** `src/validators/psychologists/controllers/fetch-psychologists-schema.ts`

> ⚠️ Sem JWT guard declarado no controller.

### Query params

| Param | Tipo | Default |
|-------|------|---------|
| `pageIndex` | `number` | `0` |
| `perPage` | `number` | `10` |

### Response `200`

```json
{ "psychologists": [ /* shape crua do use case — sem presenter */ ] }
```

**Backend proof:** `src/infra/http/controllers/psychologists/fetch-psychologists.controller.ts`

---

## 4. DELETE `/psychologist/:psychologistId` — Deletar psicólogo

**Schema:** `src/validators/psychologists/controllers/delete-psychologist-schema.ts`

> ⚠️ `psychologistId: z.string()` — **não** `z.uuid()`. Aceita qualquer string.

> ⚠️ Sem JWT guard declarado no controller.

### Response `204`

Sem body.

**Backend proof:** `src/infra/http/controllers/psychologists/delete-psychologist.controller.ts`

---

## 5. GET `/psychologists/:id` — Buscar por ID

**Schema:** `src/validators/psychologists/controllers/get-psychologist-by-id-schema.ts`
— `id: z.string().uuid()`

> ⚠️ Sem JWT guard.

### Response `200`

```json
{
  "psychologist": {
    "id": "string",
    "firstName": "string",
    "lastName": "string",
    "email": "string | null",
    "phoneNumber": "string | null",
    "cpf": "string | null",
    "crp": "string | null",
    "expertise": "Expertise",
    "profileImageUrl": "string | null"
  }
}
```

> ⚠️ `isActive` está **comentado** no response — não disponível por esta rota.

> ⚠️ Sem `gender`, `dateOfBirth`, `createdAt` no response.

**Backend proof:** `src/infra/http/controllers/psychologists/get-psychologist-by-id.controller.ts`

---

## 6. GET `/psychologists/:cpf` — Buscar por CPF

**Schema:** `src/validators/psychologists/controllers/get-psychologist-by-cpf-schema.ts`
— `cpf: z.string().min(11).max(14)`

> ⚠️ Sem JWT guard.

> ⚠️ Aceita CPF com ou sem formatação: `11 chars` (só dígitos) a `14 chars` (`XXX.XXX.XXX-XX`).
> Backend não valida dígito verificador aqui.

### Response `200`

```json
{ "psychologist": { /* shape crua do use case */ } }
```

---

## 7. GET `/psychologists/:crp` — Buscar por CRP

**Schema:** `src/validators/psychologists/controllers/get-psychologist-by-crp-schema.ts`
— `crp: z.string()` — qualquer string.

> ⚠️ Sem JWT guard. Sem validação de formato de CRP.

### Response `200`

```json
{ "psychologist": { /* shape crua do use case */ } }
```

---

## 8. GET `/psychologists/:email` — Buscar por email

**Schema:** `src/validators/psychologists/controllers/get-psychologist-by-email-schema.ts`
— `email: z.string().email()`

> ⚠️ Sem JWT guard.

### Response `200`

```json
{ "psychologist": { /* shape crua do use case */ } }
```

---

## Conflito de rota — rotas `:id`, `:cpf`, `:crp`, `:email`

Todos os quatro controllers registram `GET /psychologists/:param`.
O NestJS resolve pelo **primeiro registrado no módulo** — os demais ficam inacessíveis.

| Controller | Rota | Schema |
|------------|------|--------|
| `GetPsychologistByIdController` | `GET /psychologists/:id` | UUID |
| `GetPsychologistByCpfController` | `GET /psychologists/:cpf` | string 11–14 |
| `GetPsychologistByCrpController` | `GET /psychologists/:crp` | any string |
| `GetPsychologistByEmailController` | `GET /psychologists/:email` | email |

Verificar a ordem de registro no módulo para saber qual está ativa.

---

## 9. GET `/availabilities` — Listar disponibilidade do psicólogo autenticado

Sem schema Zod. JWT obrigatório.

### Response `200`

```json
{
  "availabilities": [
    {
      "id": "string",
      "dayOfWeek": 0,
      "startTime": "HH:mm",
      "endTime": "HH:mm",
      "isActive": true
    }
  ]
}
```

`dayOfWeek`: `0` = domingo ... `6` = sábado.

**Backend proof:** `src/infra/http/controllers/psychologists/get-psychologist-availability.controller.ts`

---

## 10. POST `/availabilities` — Definir disponibilidade

**Schema:** `src/validators/psychologists/controllers/set-psychologist-availability-schema.ts`

JWT obrigatório.

> ⚠️ Esta operação **substitui toda a agenda** — não é aditiva. Enviar a lista completa
> de slots desejados, não apenas os novos.

### Request body

```ts
{
  slots: Array<{
    dayOfWeek: number   // 0 (domingo) a 6 (sábado)
    startTime: string   // formato "HH:mm" — ex: "09:00", "14:30"
    endTime: string     // formato "HH:mm" — ex: "12:00", "18:00"
  }>
}
```

| Regra | Detalhe |
|-------|---------|
| `slots` | array com `min(1)` — ao menos um slot obrigatório |
| `dayOfWeek` | inteiro `0–6` |
| `startTime` / `endTime` | regex `/^([0-1]?[0-9]\|2[0-3]):[0-5][0-9]$/` — `HH:mm` |

> ⚠️ `startTime` aceita `"9:00"` (sem zero à esquerda) e `"09:00"` — ambos válidos.

### Response `201`

```json
{ "message": "Agenda atualizada com sucesso!" }
```

**Backend proof:** `src/infra/http/controllers/psychologists/set-psychologist-availability.controller.ts`

---

## 11. GET `/approvals` — Listar psicólogos pendentes de aprovação

`@Roles('SUPER_ADMIN')` + `RolesGuard` **ativos**.

> ⚠️ Dois controllers com `@Controller('/approvals')` registrados — `fetch-pending-psychologists.controller.ts`
> e `approve-psychologist.controller.ts`. O NestJS usa o primeiro registrado no módulo.
> Ambos têm a mesma rota e comportamento — duplicidade de código no backend.

### Response `200`

```json
{ "psychologists": [ /* shape crua do use case */ ] }
```

**Backend proof:** `src/infra/http/controllers/psychologists/approve-psychologist.controller.ts`

---

## 12. PATCH `/approvals/:psychologistId/approve` — Aprovar psicólogo

`@Roles('SUPER_ADMIN')` + `RolesGuard` **ativos**.

Sem schema Zod. Path param `psychologistId` extraído diretamente.

### Response `204`

Sem body.

---

## 13. GET `/admin/metrics/psychologists/new` — Contagem de novos psicólogos

**Schema:** `src/validators/psychologists/controllers/get-new-psychologists-count-schema.ts`

```ts
from?: z.string().datetime()   // ISO 8601 com timezone
to?:   z.string().datetime()   // ISO 8601 com timezone
```

> ⚠️ `z.string().datetime()` — exige timezone: `"2026-05-01T00:00:00.000Z"`.
> `"2026-05-01"` retorna 400.

> ⚠️ Se `from` e `to` forem omitidos, o backend usa os **últimos 30 dias** como default.

> ⚠️ Role check `SUPER_ADMIN` está **comentado** — qualquer autenticado pode acessar.

### Response `200`

Retorno direto do use case — verificar shape em runtime.

**Backend proof:** `src/infra/http/controllers/psychologists/get-new-psychologists-count.controller.ts`

---

## 14. GET `/admin/metrics/psychologists/age-range` — Faixa etária

Sem schema Zod. Sem query params. Role check comentado.

### Response `200`

Retorno direto do use case — array direto sem wrapper.

---

## 15. GET `/admin/metrics/psychologists/gender` — Distribuição por gênero

Sem schema Zod. Sem query params. Role check comentado.

### Response `200`

Retorno direto do use case — verificar shape em runtime.

---

## 16. GET `/admin/metrics/psychologists/total` — Total de psicólogos

Sem schema Zod. `@Roles('SUPER_ADMIN')` + `RolesGuard` **ativos**.

### Response `200`

Retorno direto do use case — verificar shape em runtime.

---

## Resumo — o que o frontend precisa saber

| # | Endpoint | Problema | Ação |
|---|----------|---------|------|
| 1 | POST `/psychologist` | `@Public()` comentado — auth incerta | Testar se JWT é exigido |
| 1 | POST `/psychologist` | Speciais da senha: só `[!@#$%^&*]` | Restringir regex do frontend |
| 1 | POST `/psychologist` | `dateOfBirth` obrigatório e com age bounds | Validar 18–120 anos no frontend |
| 2 | PATCH `/psychologist/profile` | `gender`, `cpf`, `dateOfBirth` ausentes | Não exibir esses campos no form de edição |
| 2 | PATCH `/psychologist/profile` | `expertise` tem 9 valores | Adicionar `EDUCATIONAL` e `ORGANIZATIONAL` ao select |
| 3/4 | GET/DELETE sem JWT | Verificar se guard global protege | Não assumir que são públicas |
| 4 | DELETE `/psychologist/:psychologistId` | Schema aceita string não-UUID | Não depender de validação de formato |
| 5 | GET `/psychologists/:id` | `isActive` comentado | Campo indisponível — não renderizar |
| 6–8 | `/psychologists/:*` | Conflito de rota com `:id`, `:cpf`, `:crp`, `:email` | Verificar qual está ativa no módulo |
| 10 | POST `/availabilities` | Substitui toda a agenda | Enviar lista completa, não parcial |
| 10 | POST `/availabilities` | `startTime` aceita `"9:00"` sem zero | Normalizar antes de enviar |
| 13 | GET `.../psychologists/new` | `from`/`to` exigem timezone ISO | Enviar `"2026-05-01T00:00:00.000Z"` |
| 13–15 | Métricas admin | Role check comentado | Não depender de restrição de acesso |
| 16 | GET `.../psychologists/total` | `@Roles('SUPER_ADMIN')` ativo | Bloqueia não-admins |
