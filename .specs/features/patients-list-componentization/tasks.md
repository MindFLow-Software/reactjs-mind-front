# Patients-List Componentization — Tasks

**Spec**: `.specs/features/patients-list-componentization/spec.md`
**Status**: Approved

---

## Execution Plan

### Phase 1 — Move files (parallel)

Cria as 3 subpastas e move os arquivos. Independentes entre si.

```
T1 [P] ─┐
T2 [P] ─┼──→ Phase 2
T3 [P] ─┘
```

### Phase 2 — Update imports (parallel)

Atualiza os imports que cruzam subpastas. T4 e T5 são arquivos distintos, sem dependência mútua.

```
T4 [P] ─┐
         ├──→ T6
T5 [P] ─┘
```

### Phase 3 — Gate check (sequential)

```
T6
```

---

## Task Breakdown

### T1: Mover componentes de tabela para `table/` [P]

**What**: Criar `components/table/` e mover os 4 arquivos de renderização de tabela para dentro dela.
**Where**: `src/pages/app/patients/patients-list/components/table/`
**Depends on**: None
**Requirement**: COMP-01

**Files moved**:
- `components/patients-table.tsx` → `components/table/patients-table.tsx`
- `components/patients-table-row.tsx` → `components/table/patients-table-row.tsx`
- `components/patients-table-filters.tsx` → `components/table/patients-table-filters.tsx`
- `components/loading.tsx` → `components/table/loading.tsx`

**Note**: Imports internos entre esses arquivos (`./patients-table-row`, `./loading`) continuam válidos — todos estão na mesma pasta após o move.

**Done when**:
- [ ] Pasta `components/table/` existe com os 4 arquivos
- [ ] Nenhum arquivo foi excluído de `components/` sem ser recriado em `table/`
- [ ] Conteúdo dos arquivos está intacto (nenhuma edição de lógica)

**Tests**: none
**Gate**: build

---

### T2: Mover componentes de detalhes para `details/` [P]

**What**: Criar `components/details/` e mover os 3 arquivos relacionados à visualização de detalhes do paciente.
**Where**: `src/pages/app/patients/patients-list/components/details/`
**Depends on**: None
**Requirement**: COMP-02

**Files moved**:
- `components/patients-details.tsx` → `components/details/patients-details.tsx`
- `components/evolution-viewer.tsx` → `components/details/evolution-viewer.tsx`
- `components/export-pdf-button.tsx` → `components/details/export-pdf-button.tsx`

**Note**: `patients-details.tsx` importa `./evolution-viewer` — continua válido pois ambos estão em `details/`.

**Done when**:
- [ ] Pasta `components/details/` existe com os 3 arquivos
- [ ] Conteúdo dos arquivos está intacto (nenhuma edição de lógica)

**Tests**: none
**Gate**: build

---

### T3: Mover componentes de diálogos para `dialogs/` e corrigir casing [P]

**What**: Criar `components/dialogs/`, mover os 2 arquivos de diálogo e corrigir o nome `generate-Invite-modal.tsx` → `generate-invite-modal.tsx`.
**Where**: `src/pages/app/patients/patients-list/components/dialogs/`
**Depends on**: None
**Requirement**: COMP-03, COMP-06

**Files moved**:
- `components/delete-patient-dialog.tsx` → `components/dialogs/delete-patient-dialog.tsx`
- `components/generate-Invite-modal.tsx` → `components/dialogs/generate-invite-modal.tsx` ← casing corrigido

**Done when**:
- [ ] Pasta `components/dialogs/` existe com os 2 arquivos
- [ ] O arquivo se chama `generate-invite-modal.tsx` (i minúsculo)
- [ ] Nenhuma referência a `generate-Invite-modal` (I maiúsculo) permanece no codebase
- [ ] Conteúdo dos arquivos está intacto (nenhuma edição de lógica)

**Tests**: none
**Gate**: build

---

### T4: Atualizar imports em `patients-table-row.tsx` [P]

**What**: Corrigir os 2 imports relativos que cruzam subpastas após o move de T1/T2/T3.
**Where**: `src/pages/app/patients/patients-list/components/table/patients-table-row.tsx`
**Depends on**: T1, T2, T3
**Requirement**: COMP-05

**Changes**:

| Import atual | Import correto |
|---|---|
| `./delete-patient-dialog` | `../dialogs/delete-patient-dialog` |
| `./patients-details` | `../details/patients-details` |

**Done when**:
- [ ] As 2 linhas de import foram atualizadas com os caminhos corretos
- [ ] Nenhum outro import no arquivo foi alterado

**Tests**: none
**Gate**: build

---

### T5: Atualizar imports em `patients-list.tsx` [P]

**What**: Corrigir os 3 imports que apontavam para `components/` raiz — agora devem apontar para as subpastas.
**Where**: `src/pages/app/patients/patients-list/patients-list.tsx`
**Depends on**: T1, T3
**Requirement**: COMP-04

**Changes**:

| Import atual | Import correto |
|---|---|
| `./components/patients-table-filters` | `./components/table/patients-table-filters` |
| `./components/patients-table` | `./components/table/patients-table` |
| `./components/generate-Invite-modal` | `./components/dialogs/generate-invite-modal` |

**Done when**:
- [ ] As 3 linhas de import foram atualizadas com os caminhos corretos
- [ ] Nenhum outro import no arquivo foi alterado

**Tests**: none
**Gate**: build

---

### T6: Gate check — build e lint

**What**: Confirmar que o projeto compila sem erros de tipo e passa no lint após todas as reorganizações.
**Where**: Raiz do projeto
**Depends on**: T4, T5
**Requirement**: COMP-07

**Done when**:
- [ ] `pnpm build` executa sem erros TypeScript
- [ ] `pnpm lint` executa sem erros (warnings são aceitáveis se já existiam antes)
- [ ] Nenhum arquivo de `components/` raiz permanece (exceto as subpastas)

**Verify**:
```bash
pnpm build
pnpm lint
```

**Tests**: none
**Gate**: build

**Commit**: `refactor(patients-list): componentize components into table, details, dialogs`

---

## Task Granularity Check

| Task | Escopo | Status |
|---|---|---|
| T1: Mover 4 arquivos para `table/` | 1 pasta, 4 moves coesos | ✅ Granular |
| T2: Mover 3 arquivos para `details/` | 1 pasta, 3 moves coesos | ✅ Granular |
| T3: Mover 2 arquivos para `dialogs/` + casing fix | 1 pasta, 2 moves coesos | ✅ Granular |
| T4: Atualizar 2 imports em 1 arquivo | 1 arquivo | ✅ Granular |
| T5: Atualizar 3 imports em 1 arquivo | 1 arquivo | ✅ Granular |
| T6: Gate check | Verificação final | ✅ Granular |

---

## Diagram-Definition Cross-Check

| Task | Depends On (body) | Diagrama mostra | Status |
|---|---|---|---|
| T1 | None | Início Phase 1 | ✅ Match |
| T2 | None | Início Phase 1 | ✅ Match |
| T3 | None | Início Phase 1 | ✅ Match |
| T4 | T1, T2, T3 | Após Phase 1 | ✅ Match |
| T5 | T1, T3 | Após Phase 1 | ✅ Match |
| T6 | T4, T5 | Após Phase 2 | ✅ Match |

---

## Test Co-location Validation

Projeto não possui framework de testes configurado (ver TESTING.md). Gate único é `pnpm build`.

| Task | Camada modificada | Matrix exige | Task diz | Status |
|---|---|---|---|---|
| T1 | Move de arquivos (sem mudança de lógica) | none | none | ✅ OK |
| T2 | Move de arquivos (sem mudança de lógica) | none | none | ✅ OK |
| T3 | Move de arquivos (sem mudança de lógica) | none | none | ✅ OK |
| T4 | Atualização de imports (sem mudança de lógica) | none | none | ✅ OK |
| T5 | Atualização de imports (sem mudança de lógica) | none | none | ✅ OK |
| T6 | Verificação — sem código novo | none | none | ✅ OK |
