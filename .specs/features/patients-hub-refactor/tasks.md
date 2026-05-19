# patients-hub Refactor — Tasks

**Spec**: `.specs/features/patients-hub-refactor/spec.md`
**Status**: Done

---

## Execution Plan

### Phase 1: Criar novos arquivos (Paralelo OK)

Criar todos os arquivos no destino final sem deletar nenhum original. Sem quebrar o build em nenhum momento.

```
T1 [P]  T2 [P]  T3 [P]
```

### Phase 2: Atualizar imports e renomear (Sequencial)

Após os arquivos destino existirem, atualizar imports em todos os consumidores e criar o arquivo renomeado.

```
T1+T2+T3 completos → T4 → T5 → T6
```

### Phase 3: Deletar originais e gate final

Só deletar depois que todos os imports estiverem apontando para o destino.

```
T4+T5+T6 completos → T7 → Gate: pnpm build
```

---

## Task Breakdown

### T1: Criar `components/anamnesis/` com sub-componentes e utils [P]

**What**: Criar os 7 arquivos de anamnese no novo subfolder, com imports internos já apontando para `anamnesis-types` (não mais `./types`).
**Where**:
- `src/pages/app/patients/patients-hub/components/anamnesis/anamnesis-types.ts` ← de `components/components/types.ts`
- `src/pages/app/patients/patients-hub/components/anamnesis/anamnesis-utils.ts` ← de `components/components/anamnesis-utils.ts`
- `src/pages/app/patients/patients-hub/components/anamnesis/anamnesis-header.tsx` ← de `components/components/anamnesis-header.tsx`
- `src/pages/app/patients/patients-hub/components/anamnesis/anamnesis-toolbar.tsx` ← de `components/components/anamnesis-toolbar.tsx`
- `src/pages/app/patients/patients-hub/components/anamnesis/anamnesis-editor-block.tsx` ← de `components/components/anamnesis-editor-block.tsx`
- `src/pages/app/patients/patients-hub/components/anamnesis/anamnesis-navigation.tsx` ← de `components/components/anamnesis-navigation.tsx`
- `src/pages/app/patients/patients-hub/components/anamnesis/anamnesis-skeleton.tsx` ← de `components/components/anamnesis-skeleton.tsx`

**Depends on**: None
**Reuses**: Conteúdo exato dos originais em `components/components/` — só muda `import from "./types"` → `import from "./anamnesis-types"` em `anamnesis-utils.ts`, `anamnesis-editor-block.tsx` e `anamnesis-navigation.tsx`
**Requirement**: HUB-01, HUB-03

**Done when**:
- [ ] Todos os 7 arquivos existem em `components/anamnesis/`
- [ ] `anamnesis-utils.ts` importa de `./anamnesis-types` (não `./types`)
- [ ] `anamnesis-editor-block.tsx` importa de `./anamnesis-types`
- [ ] `anamnesis-navigation.tsx` importa de `./anamnesis-types`
- [ ] Arquivos originais em `components/components/` ainda existem (não deletar aqui)

**Tests**: none
**Gate**: —  *(gate final em T7)*

---

### T2: Criar `components/anamnesis/anamnesis-form.tsx` [P]

**What**: Criar `anamnesis-form.tsx` dentro de `components/anamnesis/`, com imports internos atualizados de `./components/*` para `./`.
**Where**: `src/pages/app/patients/patients-hub/components/anamnesis/anamnesis-form.tsx`
**Depends on**: None *(T1 pode rodar em paralelo — os arquivos que este importa já existem ou vão existir antes do build)*
**Reuses**: Conteúdo exato de `components/anamnesis-form.tsx`, mudando somente os caminhos de import:
- `"./components/anamnesis-header"` → `"./anamnesis-header"`
- `"./components/anamnesis-toolbar"` → `"./anamnesis-toolbar"`
- `"./components/anamnesis-editor-block"` → `"./anamnesis-editor-block"`
- `"./components/anamnesis-skeleton"` → `"./anamnesis-skeleton"`
- `"./components/anamnesis-navigation"` → `"./anamnesis-navigation"`
- `"./components/types"` → `"./anamnesis-types"`
- `"./components/anamnesis-utils"` → `"./anamnesis-utils"`

**Requirement**: HUB-02, HUB-04

**Done when**:
- [ ] Arquivo existe em `components/anamnesis/anamnesis-form.tsx`
- [ ] Todos os imports apontam para `./anamnesis-*` (nenhum `./components/`)
- [ ] Arquivo original `components/anamnesis-form.tsx` ainda existe (não deletar aqui)

**Tests**: none
**Gate**: —

---

### T3: Criar `components/sessions-pagination.tsx` [P]

**What**: Criar `sessions-pagination.tsx` com o conteúdo exato do `pagination.tsx` local (que exibe "Total de N Sessões").
**Where**: `src/pages/app/patients/patients-hub/components/sessions-pagination.tsx`
**Depends on**: None
**Reuses**: Conteúdo exato de `components/pagination.tsx`
**Requirement**: HUB-09

**Done when**:
- [ ] Arquivo `sessions-pagination.tsx` existe em `components/`
- [ ] Exibe "Total de {totalCount} Sessões" (não "Pacientes")
- [ ] Arquivo original `pagination.tsx` ainda existe (não deletar aqui)

**Tests**: none
**Gate**: —

---

### T4: Criar `components/patient-info.tsx` (sem inline utils)

**What**: Criar `patient-info.tsx` (lowercase `i`) importando `formatCPF` de `@/utils/formatCPF`, `formatPhone` de `@/utils/formatPhone` e `formatAGE` de `@/utils/formatAGE` — sem nenhuma definição inline dessas funções.
**Where**: `src/pages/app/patients/patients-hub/components/patient-info.tsx`
**Depends on**: T1 completo (para garantir que a fase paralela anterior está estável antes de criar novos arquivos no mesmo diretório)
**Reuses**:
- `src/utils/formatCPF.ts` → exporta `formatCPF(raw: string): string` (retorna `""` se vazio)
- `src/utils/formatPhone.ts` → exporta `formatPhone(raw: string): string` (retorna `""` se vazio)
- `src/utils/formatAGE.ts` → exporta `formatAGE(dateString: string | Date): number` (retorna número, não string)
- Conteúdo estrutural de `patient-Info.tsx` (props, `InfoField`, layout JSX) — sem as funções inline

**Requirement**: HUB-06, HUB-07

**Notas de adaptação**:
- `formatCPF` do utils recebe `string` e retorna `""` se vazio — o null-check (`patient.cpf ? formatCPF(patient.cpf) : EMPTY_VALUE`) fica no componente
- `formatPhone` do utils: idem, recebe `string`
- `formatAGE` do utils: retorna `number` → formatar como `\`${formatAGE(patient.dateOfBirth)} anos\`` no componente, com null-check prévio

**Done when**:
- [ ] Arquivo `patient-info.tsx` existe (lowercase `i`)
- [ ] Nenhuma função `formatCPF`, `formatPhoneNumber` ou `calculateAge` definida localmente
- [ ] Importa `formatCPF`, `formatPhone`, `formatAGE` de `@/utils/*`
- [ ] Exibe `"--"` quando campo é `null` ou `undefined`
- [ ] Arquivo original `patient-Info.tsx` ainda existe (não deletar aqui)

**Tests**: none
**Gate**: —

---

### T5: Atualizar imports em `patients-details.tsx`

**What**: Atualizar os dois imports que mudaram de caminho/nome no arquivo principal.
**Where**: `src/pages/app/patients/patients-hub/patients-details.tsx`
**Depends on**: T2, T4

**Mudanças**:
```ts
// Antes
import { PatientInfo } from "./components/patient-Info"
import { AnamnesisForm } from "./components/anamnesis-form"

// Depois
import { PatientInfo } from "./components/patient-info"
import { AnamnesisForm } from "./components/anamnesis/anamnesis-form"
```

**Requirement**: HUB-05, HUB-08

**Done when**:
- [ ] Import `PatientInfo` aponta para `./components/patient-info`
- [ ] Import `AnamnesisForm` aponta para `./components/anamnesis/anamnesis-form`
- [ ] Nenhum outro import foi alterado no arquivo

**Tests**: none
**Gate**: —

---

### T6: Atualizar import em `patient-sessions-timeline.tsx`

**What**: Trocar import de `./pagination` para `./sessions-pagination`.
**Where**: `src/pages/app/patients/patients-hub/components/patient-sessions-timeline.tsx`
**Depends on**: T3

**Mudança**:
```ts
// Antes
import { Pagination } from "./pagination"

// Depois
import { Pagination } from "./sessions-pagination"
```

**Requirement**: HUB-10

**Done when**:
- [ ] Import aponta para `./sessions-pagination`
- [ ] Nenhum outro import foi alterado no arquivo

**Tests**: none
**Gate**: —

---

### T7: Deletar arquivos originais e executar gate final

**What**: Deletar os 10 arquivos originais que foram substituídos pelos novos, em seguida rodar `pnpm build` para validar que não há referências quebradas.
**Where**: Múltiplos arquivos (lista abaixo)
**Depends on**: T4, T5, T6

**Arquivos a deletar**:
- `components/components/types.ts`
- `components/components/anamnesis-utils.ts`
- `components/components/anamnesis-header.tsx`
- `components/components/anamnesis-toolbar.tsx`
- `components/components/anamnesis-editor-block.tsx`
- `components/components/anamnesis-navigation.tsx`
- `components/components/anamnesis-skeleton.tsx`
- `components/anamnesis-form.tsx`
- `components/patient-Info.tsx`
- `components/pagination.tsx`

**Requirement**: HUB-11

**Done when**:
- [ ] Nenhum dos arquivos listados acima existe mais
- [ ] Pasta `components/components/` não existe mais
- [ ] `pnpm build` passa sem erros de tipo
- [ ] `pnpm lint` passa sem warnings de import

**Tests**: none
**Gate**: build — `pnpm build`

**Commit**: `refactor(patients-hub): reorganize anamnesis into domain subfolder, fix inline utils, align naming`

---

## Parallel Execution Map

```
Phase 1 (Paralelo — criar arquivos destino):
  T1 [P] ─┐
  T2 [P] ─┤─→ Phase 2
  T3 [P] ─┘

Phase 2 (Sequencial — atualizar consumidores):
  T4 → T5
        T3 completo → T6

Phase 3 (Gate):
  T4 + T5 + T6 completos → T7 → pnpm build
```

---

## Task Granularity Check

| Task | Scope | Status |
|---|---|---|
| T1: Criar 7 sub-componentes anamnese | 7 arquivos novos, mesmo domínio, zero lógica nova | ✅ Coeso |
| T2: Criar anamnesis-form.tsx | 1 arquivo, só atualiza imports | ✅ Granular |
| T3: Criar sessions-pagination.tsx | 1 arquivo, cópia com rename | ✅ Granular |
| T4: Criar patient-info.tsx | 1 arquivo, remoção de inline utils | ✅ Granular |
| T5: Atualizar patients-details.tsx | 2 linhas de import, 1 arquivo | ✅ Granular |
| T6: Atualizar patient-sessions-timeline.tsx | 1 linha de import, 1 arquivo | ✅ Granular |
| T7: Deletar originais + gate | 10 deleções + 1 build command | ✅ Granular |

---

## Diagram-Definition Cross-Check

| Task | Depends On (body) | Diagram mostra | Status |
|---|---|---|---|
| T1 | None | Fase 1 paralelo | ✅ |
| T2 | None | Fase 1 paralelo | ✅ |
| T3 | None | Fase 1 paralelo | ✅ |
| T4 | T1 completo | Após fase 1 | ✅ |
| T5 | T2, T4 | Após T4 | ✅ |
| T6 | T3 | Após T3 completo | ✅ |
| T7 | T4, T5, T6 | Fase 3 | ✅ |

---

## Test Co-location Validation

Projeto não possui framework de testes (ver `TESTING.md`). Gate é `pnpm build`.

| Task | Camada modificada | Matrix exige | Task diz | Status |
|---|---|---|---|---|
| T1 | Componentes UI (move) | none | none | ✅ |
| T2 | Componente UI (move) | none | none | ✅ |
| T3 | Componente UI (move) | none | none | ✅ |
| T4 | Componente UI (refactor) | none | none | ✅ |
| T5 | Page (import update) | none | none | ✅ |
| T6 | Component (import update) | none | none | ✅ |
| T7 | Deleção + build | none | build | ✅ |
