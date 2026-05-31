# Permissions — Frontend Validator Requirements

> Source of truth: backend validators + controllers.
> Verificado contra o código-fonte em 2026-05-31.
> Auth: todos os endpoints exigem JWT. Endpoints marcados com `SUPER_ADMIN`
> têm restrição de role — ver observações por endpoint.

---

## 1. POST `/permissions` — Criar permissão

**Schema:** `src/validators/permissions/controllers/create-permission-schema.ts`

**Role requerido:** `SUPER_ADMIN` — via `@Roles('SUPER_ADMIN')` ativo.

### Request body

| Campo | Tipo | Obrigatório | Regras |
|-------|------|-------------|--------|
| `slug` | `string` | ✅ | trimmed; regex `/^[a-z]+:[a-z]+$/` — formato `recurso:acao` |
| `description` | `string` | ❌ | sem restrição de tamanho |

> ⚠️ `slug` segue padrão estrito: apenas letras minúsculas, dois segmentos separados
> por `:`, sem números, sem hífens, sem espaços.
> Exemplos válidos: `patients:create`, `appointments:read`, `users:delete`.
> Exemplos inválidos: `patients:Create`, `patients-create`, `PATIENTS:CREATE`.

### Response `201`

```json
{
  "message": "Permissão criada com sucesso!",
  "slug": "string"
}
```

**Backend proof:** `src/infra/http/controllers/permissions/create-permission.controller.ts`

---

## 2. POST `/roles/permissions` — Atribuir permissão a um role

**Schema:** `src/validators/permissions/controllers/assign-permission-schema.ts`

**Role requerido:** `SUPER_ADMIN` — via `@Roles('SUPER_ADMIN')` ativo.

### Request body

| Campo | Tipo | Obrigatório | Regras |
|-------|------|-------------|--------|
| `roleName` | `string` | ✅ | `z.string().toUpperCase()` — backend converte para uppercase automaticamente |
| `permissionSlug` | `string` | ✅ | regex `/^[a-z]+:[a-z]+$/` — mesmo padrão do `slug` acima |

> ⚠️ `roleName` pode ser enviado em qualquer casing — o schema converte para uppercase
> antes de processar. Exemplos: `"psychologist"` → `"PSYCHOLOGIST"`, `"ADMIN"` → `"ADMIN"`.

> ⚠️ Erros deste endpoint são mapeados como `BadRequestException` (400) diretamente,
> não como domain errors via `DOMAIN_ERROR_MAP`. A mensagem vem do `Error.message`
> do use case ou `"Ocorreu um erro inesperado ao atribuir a permissão."`.

### Response `204`

Sem body.

**Backend proof:** `src/infra/http/controllers/permissions/assign-permission-to-role.controller.ts`

---

## 3. GET `/admin/approvals` — Listar psicólogos pendentes de aprovação

Sem schema Zod. Sem query params.

> ⚠️ Verificação de role `SUPER_ADMIN` está **comentada** — qualquer usuário autenticado
> pode acessar este endpoint. Não depender da restrição de role até que seja reativada.

### Response `200`

```json
{
  "psychologists": [
    {
      "id": "string",
      "firstName": "string",
      "lastName": "string",
      "email": "string | null",
      "crp": "string | null",
      "createdAt": "ISO date string",
      "dateOfBirth": "ISO date string | null",
      "phoneNumber": "string | null",
      "profileImageUrl": "string | null"
    }
  ]
}
```

> ⚠️ `status` do psicólogo está **comentado** no map do controller — não é retornado.
> O frontend não pode depender desse campo nesta rota.

**Backend proof:** `src/infra/http/controllers/permissions/get-pending-approvals.controller.ts`

---

## 4. PATCH `/admin/approvals/:id/approve` — Aprovar psicólogo

Sem schema Zod. Path param `id` extraído diretamente.

> ⚠️ Verificação de role `SUPER_ADMIN` está **comentada** — qualquer autenticado pode chamar.

Internamente executa `updateStatus({ psychologistId: id, status: 'ACTIVE' })`.

### Response

Retorno direto do use case — shape não normalizada por presenter. Verificar em runtime.

**Backend proof:** `src/infra/http/controllers/permissions/get-pending-approvals.controller.ts` (linha 51)

---

## 5. PATCH `/admin/approvals/:id/reject` — Rejeitar psicólogo

Sem schema Zod. Path param `id` extraído diretamente.

> ⚠️ Verificação de role `SUPER_ADMIN` está **comentada** — qualquer autenticado pode chamar.

Internamente executa `updateStatus({ psychologistId: id, status: 'REJECTED' })`.

### Response

Retorno direto do use case — shape não normalizada por presenter. Verificar em runtime.

**Backend proof:** `src/infra/http/controllers/permissions/get-pending-approvals.controller.ts` (linha 63)

---

## 6. POST `/admin/users/:id/ban` — Banir usuário

Sem schema Zod. Body extraído campo a campo com `@Body('reason')`.

> ⚠️ `@Roles('SUPER_ADMIN')` está **comentado**, mas `RolesGuard` ainda está ativo no
> `@UseGuards(JwtAuthGuard, RolesGuard)`. Sem o decorator `@Roles`, o comportamento
> do `RolesGuard` depende da implementação — pode permitir qualquer role ou bloquear todos.
> Testar antes de depender desta rota.

### Path param

| Param | Tipo |
|-------|------|
| `id` | `string` (userId — sem validação UUID) |

### Request body (sem Zod)

| Campo | Tipo | Regras |
|-------|------|--------|
| `reason` | `string` | extraído com `@Body('reason')` — sem validação; pode ser `undefined` |

> O backend também captura automaticamente:
> - `ipAddress` — de `x-forwarded-for` header ou `request.ip`
> - `userAgent` — de `user-agent` header (default `'Unknown'`)
> - `location` — **hardcoded** `'Brasil'`

### Response

Retorno direto do use case `BanUserUseCaseResponse` — shape não documentada por presenter.

**Backend proof:** `src/infra/http/controllers/permissions/admin-management.controller.ts`

---

## Resumo — o que o frontend precisa saber

| # | Endpoint | Problema | Ação |
|---|----------|---------|------|
| 1 | POST `/permissions` | `slug` regex estrita lowercase | Validar `^[a-z]+:[a-z]+$` no frontend também |
| 2 | POST `/roles/permissions` | `roleName` auto-uppercase no backend | Pode enviar qualquer casing |
| 2 | POST `/roles/permissions` | Erros como 400, não domain errors | Tratar mensagem de `error.message` genérico |
| 3 | GET `/admin/approvals` | Role check comentado | Não depender de restrição de acesso |
| 3 | GET `/admin/approvals` | `status` comentado no response | Não renderizar status do psicólogo |
| 4/5 | PATCH `…/approve` e `…/reject` | Role check comentado | Não depender de restrição de acesso |
| 4/5 | PATCH `…/approve` e `…/reject` | Response sem presenter | Tipar como `unknown` ou verificar em runtime |
| 6 | POST `/admin/users/:id/ban` | `@Roles` comentado + `RolesGuard` ativo | Comportamento de acesso imprevisível — testar |
| 6 | POST `/admin/users/:id/ban` | `location` hardcoded `'Brasil'` | Não enviar location — ignorado |
| 6 | POST `/admin/users/:id/ban` | `reason` sem validação | Pode ser undefined se omitido |
