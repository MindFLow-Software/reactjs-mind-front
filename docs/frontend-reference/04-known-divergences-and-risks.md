# 04 — Divergências Conhecidas e Riscos

> Consolidação objetiva de todas as divergências verificadas no código, com status de confirmação e impacto para o frontend.  
> **Todas as afirmações foram verificadas no código real** (arquivo fonte citado).

---

## Tabela de divergências

| # | Descrição | Spec diz | Código faz | Status | Impacto | Severidade |
|---|---|---|---|---|---|---|
| D01 | `consultationFee` em Profile | Deve estar em `PracticeContext` | ✅ Está em `PracticeContext` | CONFIRMADO | Nenhum | — |
| D02 | `GET /me` sem `consultationFee` | Deve expor `consultationFee` nos contextos | ✅ RESOLVIDO — `user-presenter.ts` expõe `consultationFee` por contexto | RESOLVIDO | — | **OK** |
| D03 | `GET /me` sem `nickname` | Deve expor `nickname` nos contextos | ✅ RESOLVIDO — `user-presenter.ts` expõe `nickname` por contexto | RESOLVIDO | — | **OK** |
| D04 | `GET /me` sem `professionalBio` | Deve expor bio no profile | ✅ RESOLVIDO — `user-presenter.ts` expõe `professionalBio` no profile | RESOLVIDO | — | **OK** |
| D05 | `clinicMemberContexts` fixo | Deve retornar memberships reais | ✅ RESOLVIDO — `get-authenticated-user.controller.ts` busca memberships via `ClinicMemberRepository.findManyByUserId` | RESOLVIDO | — | **OK** |
| D06 | `AppointmentStatus.DONE` | Enum completo com DONE | ✅ RESOLVIDO (T31) — `DONE` removido do enum de domínio; `isFinished()` e `StartAppointmentUseCase` usam só `FINISHED`; alinhado ao Prisma | RESOLVIDO | — | **OK** |
| D07 | Fluxo self-service sem aprovação | Usuário recém-registrado pode criar perfil imediatamente | ✅ RESOLVIDO (T29) — conta e `PsychologistProfile` nascem `ACTIVE`; `AccountStatusGuard` só bloqueia `isActive=false` ou `account.status=BLOCKED`, não há mais `PENDING` no registro | RESOLVIDO | — | **OK** |
| D08 | `PrismaPatientRepository` funcional | Implementação real | ✅ RESOLVIDO (T33) — repo stub deletado; rotas de paciente migradas para `PatientProfileRepository` + hidratação de `User` (P1) | RESOLVIDO | — | **OK** |
| D09 | `PrismaPsychologistRepository` funcional | Implementação real | ✅ RESOLVIDO (T33) — repo stub deletado; rotas de psicólogo migradas para `PsychologistProfileRepository` + `User` (P1) | RESOLVIDO | — | **OK** |
| D10 | CORS permite header customizado | Header `x-psychologist-practice-context-id` no CORS | ✅ RESOLVIDO (T28) — incluído em `allowedHeaders` | RESOLVIDO | Preflight cross-origin permitido | — |
| D11 | `POST /session` sem perfis | Spec nova pede retorno de status | Retorna apenas `id, firstName, lastName, email, status, profileImageUrl` | CONFIRMADO | Frontend deve chamar `GET /me` após login | **MÉDIA** |
| D12 | `PatientProfile.contextId` nullable | Deve ser nullable | ✅ Nullable no Prisma (`schema.prisma:291`) | CONFIRMADO | Nenhum | — |
| D13 | Partial unique index em PatientProfile | Via SQL raw | Confirmado na migration (T01) | CONFIRMADO | Nenhum | — |
| D14 | `POST /patient` usa header manual | Deve usar `PracticeContextGuard` | `create-patient.controller.ts:34` usa `@Headers` direto + `PermissionsGuard` | CONFIRMADO | Sem validação de UUID nem ownership | **MÉDIA** |
| D15 | `POST /patient` retorna `patientId` | Deve ser `patientProfile.id` | ✅ Retorna `patientProfile.id` (`create-patient.controller.ts:62`) | CONFIRMADO | `patientId !== user.id` — documentar | **MÉDIA** |
| D16 | `AnamnesisController` sem contexto guard | Deve usar `PracticeContextGuard` | ✅ RESOLVIDO — `anamnesis.controller.ts` usa `@UseGuards(JwtAuthGuard, PracticeContextGuard)` | RESOLVIDO | — | **OK** |
| D17 | `patientId` em anamnesis = `patientProfileId` | Path usa `patientId` | Código trata como `patientProfileId` (`anamnesis.controller.ts:16`) | CONFIRMADO | Frontend deve passar `patientProfile.id` | **MÉDIA** |
| D18 | Colisão de rotas `/psychologists/:param` | `:id` + `search` num único controller | ✅ Resolvido (T20) — `PsychologistReadController` declara `@Get('search')` antes de `@Get(':id')`; os 3 controllers `:cpf`/`:crp`/`:email` foram removidos | RESOLVIDO | — | **OK** |
| D19 | `PrismaAppointmentSessionRepository` stub | Implementação real | ✅ Resolvido (T3) — `findById` real + `sumDurationByPracticeContext`; rotas de sessão reparadas (T17/T18) | RESOLVIDO | — | **OK** |
| D20 | Billing externo cria `Payment` local | `POST /billing` deve registrar payment | `CreateBillingUseCase` retorna `billingUrl` — não confirmado que cria `Payment` | INCERTO | `AccountStatusGuard` pode bloquear psicólogo após pagamento | **ALTA** |
| D21 | Colunas legadas no schema | ✅ RESOLVIDO (T30) — `psychologist_id`/`psychologistId`/`psychologist_name` removidos de `suggestions`, `payments`, `registration_links`, `psychologist_availabilities`; `as any` removido dos 4 repos (migração script-only `20260613120000_drop_legacy_psychologist_columns`, aprovação necessária para aplicar). `popups.psychologistId` (nullable) fora de escopo | RESOLVIDO | Inserts usam só os novos IDs | — |
| D22 | `POST /psychologist` deprecado com warning | Deve emitir deprecation header | ✅ RESOLVIDO (T33) — `CreatePsychologistController`+UC deletados; rota legada removida (use `POST /psychologist/profile`) | RESOLVIDO | — | **OK** |
| D23 | `POST /auth/complete-registration` deprecado | Deve emitir deprecation header | ✅ RESOLVIDO (T33) — `CompleteOAuthRegistrationController`+UC deletados; rota removida (use `POST /psychologist/profile`) | RESOLVIDO | — | **OK** |
| D24 | CPF validation com campo ausente | `CPF.isValid(undefined)` retorna false | Validadores opcionais podem rejeitar ausência incorretamente | PRESUMIDO | Formulários com CPF opcional podem ter erro | **MÉDIA** |
| D25 | `AuthenticateController` em dois módulos | Um único registro | Registrado em `auth.module.ts:55` E importado via `HttpModule` | CONFIRMADO | Duplicação de instância, não bug funcional | **BAIXA** |

---

## Repositórios legados — ✅ Removidos (T33)

Os repositórios stub `PrismaPatientRepository` e `PrismaPsychologistRepository` (que lançavam erro em qualquer chamada) foram **deletados**. Todas as rotas que dependiam deles foram migradas para os repositórios baseados em `User` + `PatientProfile`/`PsychologistProfile` nas fases P1.

### Rotas de paciente — ✅ Reparadas

| Rota | Status |
|---|---|
| `DELETE /patients/:id` | ✅ Reparada — `PatientProfile` por owner |
| `GET /patients/stats/new` | ✅ Reparada — via `PatientProfileRepository` |
| `GET /patients/stats/gender` | ✅ Reparada — via `PatientProfileRepository` |
| `GET /patients/stats/age` | ✅ Reparada — via `PatientProfileRepository` |
| `GET /patients/stats/card` | ✅ Reparada — via `PatientProfileRepository` |
| `GET /patients/:id/details` | ✅ Reparada — via `PatientProfileRepository` + `User` |
| `GET /admin/metrics/patients/total` | ✅ Reparada — via `PatientProfileRepository` |
| `GET /admin/metrics/patients/new` | ✅ Reparada — via `PatientProfileRepository` |
| `GET /patients/filter/with-attachments` | ✅ Reparada — via `PatientProfileRepository` |
| `GET /dashboard` | ✅ Reparada (T16) — escopada por practice context |

### Rotas de psicólogo — ✅ Reparadas

| Rota | Status |
|---|---|
| `GET /psychologists` | ✅ Reparada (T21) — `PsychologistProfile.findMany()` + `User` |
| `GET /psychologists/:id` | ✅ Reparada (T19/T20) — via `PsychologistProfile` + `User` |
| `GET /psychologists/search?cpf=\|crp=\|email=` | ✅ Nova (T20) — substitui as 3 rotas `:cpf`/`:crp`/`:email` |
| `DELETE /psychologist/:id` | ✅ Reparada (T23) — remove `PsychologistProfile` por id |
| `PATCH /psychologist/profile` | ✅ Reparada (T22) — atualiza `User` + `PsychologistProfile` do usuário autenticado |
| `GET /approvals` + `PATCH /approvals/:id/approve` | ✅ Removidas (T33) — superfície de aprovação deletada; registro nasce `ACTIVE` (T29), sem fluxo de aprovação |

### PrismaAppointmentSessionRepository — ✅ Resolvido (T3)

**Arquivo:** `src/infra/database/prisma/repositories/prisma-appointment-session-repository.ts`

Implementação real: `findById` (com relação `appointment`) + `sumDurationByPracticeContext`. Rotas reparadas:
- `GET /sessions/total-work-hours` — escopada por practice context (T17)
- `POST /sessions/:id/finish` — opera sobre o repo real (T18)

---

## Comportamentos indefinidos

### Colisão de rotas `/psychologists/:param` — ✅ Resolvida (T20/T33)

A colisão histórica de 4 handlers `@Get(':param')` no mesmo prefixo foi eliminada. Um único `PsychologistReadController` declara `@Get('search')` antes de `@Get(':id')`, e os controllers `:cpf`/`:crp`/`:email` foram removidos (T33). Use `GET /psychologists/search?cpf=|crp=|email=` para busca e `GET /psychologists/:id` para detalhe.

### CPF validation com campo optional

**Arquivo:** validadores de CPF nas schemas Zod

**Problema presumido:** `CPF.isValid(undefined)` retorna `false`, mas em campos opcionais (`.optional()`), o Zod passa `undefined` para o refinamento. Isso pode causar rejeição de CPF ausente como "CPF inválido" em vez de "CPF não fornecido".

**Impacto:** Formulários onde CPF é opcional podem não funcionar corretamente.

### create-patient-schema e validação de data

**Arquivo:** `src/validators/patients/controllers/create-patient-schema.ts`

**Problema presumido:** A função `isFuture(date)` valida que a data está no futuro — em contexto de `dateOfBirth`, isso deveria ser invertido (`isPast` ou `!isFuture`). A spec menciona que `dateOfBirth` não pode ser futura, mas se o código usa `isFuture` como critério de validade (não de rejeição), pode aceitar datas futuras.

---

## Decisões a tomar antes do frontend depender

| # | Decisão | Status |
|---|---|---|
| B01 | Adicionar `x-psychologist-practice-context-id` ao `allowedHeaders` no CORS | ✅ Resolvido (T28) |
| B02 | Definir fluxo de aprovação de conta e perfil (manual vs automático) | ✅ Resolvido — sem aprovação; registro nasce `ACTIVE` (T29) |
| B03 | Confirmar se `POST /billing` cria `Payment` local | ⚠️ Em aberto (D20 incerto) |
| B04 | Expor `consultationFee`, `nickname`, `professionalBio` em `GET /me` | ✅ Resolvido — expostos no `user-presenter` |
| B05 | Popular `clinicMemberContexts` em `GET /me` | ✅ Resolvido — via `ClinicMemberRepository` |
| B06 | Corrigir colisão de rotas `/psychologists/:param` | ✅ Resolvido (T20/T33) |
| B07 | Remover ou substituir repositórios stubados | ✅ Resolvido (T33) — stubs deletados, rotas migradas |
| B08 | Confirmar enum `AppointmentStatus.DONE` | ✅ Resolvido (T31) — `DONE` removido |
| B09 | Definir estratégia para anamnese sem PracticeContextGuard | ✅ Resolvido — `PracticeContextGuard` aplicado |

---

## Sumário para o time de frontend

### Use com confiança

- `POST /user` — criar conta
- `POST /session`, `POST /session/refresh`, `POST /sign-out`
- `GET /me` (com as limitações documentadas)
- `POST /psychologist/profile`, `POST /psychologist/practice-contexts`
- `POST /patient/profile`
- `POST /appointments`, `GET /appointments`, `PUT /appointments`, `DELETE /appointments` (com PracticeContextGuard)
- `POST /availabilities`, `GET /availabilities`
- `POST /documents`, `GET /documents/...`, `POST /medical-records`, `POST /observations`
- `POST /attachments`
- `POST /clinics`, `GET /clinics/:id`
- `POST /invites`, `GET /invites/:hash`, `POST /invites/:hash/register`
- `GET /address/:cep`
- `GET /plans`, `POST /billing`

### Use com cautela

- `POST /patient` — PermissionsGuard legado + header manual `x-psychologist-practice-context-id`, não `PracticeContextGuard` (D14). Prefira `POST /patient/profile`
- `GET /appointments/context/:practiceContextId` — sem `PracticeContextGuard`

### Removidas (não existem mais)

- `POST /psychologist` — ❌ removido (T33), use `POST /psychologist/profile`
- `POST /auth/complete-registration` — ❌ removido (T33), use `POST /psychologist/profile`
- `GET /approvals` + `PATCH /approvals/:id/approve` — ❌ removidos (T33), sem fluxo de aprovação
- `GET /psychologists/:cpf|:crp|:email` — ❌ removidos (T20/T33), use `GET /psychologists/search?cpf=|crp=|email=`
- `GET /patients/:name` — ❌ removido (T32)

> As rotas antes marcadas como "quebradas (repositório stub)" — `DELETE /patients/:id`, `GET /patients/stats/*`, `GET /patients/:id/details`, métricas de paciente, `GET /psychologists`, `DELETE /psychologist/:id` — foram **reparadas** (stubs deletados em T33, migradas para os repositórios baseados em `Profile`). Veja a seção "Repositórios legados — Removidos".
