# Suggestion Componentization — Tasks

**Spec**: `.specs/features/suggestion-componentization/spec.md`
**Status**: Approved

---

## Execution Plan

### Phase 1 — Mover arquivos + extrair hook (paralelo)

T1, T2, T3 e T4 são independentes entre si.

```
T1 [P] ─┐
T2 [P] ─┼──→ Phase 2
T3 [P] ─┤
T4 [P] ─┘
```

### Phase 2 — Atualizar imports (sequencial após Phase 1)

```
T5 ──→ T6
```

---

## Task Breakdown

### T1: Mover componentes do kanban para `board/` [P]

**What**: Criar `components/board/` e mover `suggestion-column.tsx` para dentro dela.
**Where**: `src/pages/app/suggestion/components/board/`
**Depends on**: None
**Requirement**: SUGG-01

**Files moved**:
- `components/suggestion-column.tsx` → `components/board/suggestion-column.tsx`

**Done when**:
- [ ] Pasta `components/board/` existe com `suggestion-column.tsx`
- [ ] Arquivo original removido de `components/`
- [ ] Conteúdo do arquivo está intacto (nenhuma edição de lógica)

**Tests**: none
**Gate**: build

---

### T2: Mover componentes do fluxo de criação para `create/` [P]

**What**: Criar `components/create/` e mover os 3 arquivos do fluxo de criação de sugestão.
**Where**: `src/pages/app/suggestion/components/create/`
**Depends on**: None
**Requirement**: SUGG-02

**Files moved**:
- `components/create-suggestion.tsx` → `components/create/create-suggestion.tsx`
- `components/suggestion-attachments.tsx` → `components/create/suggestion-attachments.tsx`
- `components/suggestion-success-dialog.tsx` → `components/create/suggestion-success-dialog.tsx`

**Note**: `create-suggestion.tsx` importa `./suggestion-attachments` e `./suggestion-success-dialog` — ambos estão na mesma pasta `create/` após o move, portanto os imports relativos continuam válidos sem alteração.

**Done when**:
- [ ] Pasta `components/create/` existe com os 3 arquivos
- [ ] Arquivos originais removidos de `components/`
- [ ] Conteúdo dos arquivos está intacto (nenhuma edição de lógica)

**Tests**: none
**Gate**: build

---

### T3: Mover help button para `help/` [P]

**What**: Criar `components/help/` e mover `suggestion-help-button.tsx` para dentro dela.
**Where**: `src/pages/app/suggestion/components/help/`
**Depends on**: None
**Requirement**: SUGG-03

**Files moved**:
- `components/suggestion-help-button.tsx` → `components/help/suggestion-help-button.tsx`

**Done when**:
- [ ] Pasta `components/help/` existe com `suggestion-help-button.tsx`
- [ ] Arquivo original removido de `components/`
- [ ] Conteúdo do arquivo está intacto (nenhuma edição de lógica)

**Tests**: none
**Gate**: build

---

### T4: Extrair `useDebounce` para `src/hooks/use-debounce.ts` [P]

**What**: Criar `src/hooks/use-debounce.ts` com o hook genérico extraído de `suggestion-page.tsx`.
**Where**: `src/hooks/use-debounce.ts`
**Depends on**: None
**Requirement**: SUGG-04

**New file content**:
```typescript
import { useEffect, useState } from "react"

export function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value)
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay)
        return () => clearTimeout(handler)
    }, [value, delay])
    return debouncedValue
}
```

**Done when**:
- [ ] `src/hooks/use-debounce.ts` existe com a assinatura genérica `<T>(value: T, delay: number): T`
- [ ] A implementação é idêntica à definição inline original de `suggestion-page.tsx`

**Tests**: none
**Gate**: build

---

### T5: Atualizar imports em `suggestion-page.tsx`

**What**: Remover a definição inline de `useDebounce` e corrigir os imports que cruzam subpastas após T1/T2/T3/T4.
**Where**: `src/pages/app/suggestion/suggestion-page.tsx`
**Depends on**: T1, T2, T3, T4
**Requirement**: SUGG-05

**Changes**:

| Ação | Detalhe |
|---|---|
| Remover | Definição inline de `useDebounce` (linhas 28–35 aproximadamente) |
| Adicionar | `import { useDebounce } from "@/hooks/use-debounce"` |
| Atualizar | `./components/suggestion-column` → `./components/board/suggestion-column` |
| Atualizar | `./components/create-suggestion` → `./components/create/create-suggestion` |
| Atualizar | `./components/suggestion-help-button` → `./components/help/suggestion-help-button` |

**Done when**:
- [ ] Nenhuma definição de `useDebounce` inline em `suggestion-page.tsx`
- [ ] Import de `useDebounce` aponta para `@/hooks/use-debounce`
- [ ] Os 3 imports de componentes apontam para as subpastas corretas
- [ ] Nenhum outro import no arquivo foi alterado

**Tests**: none
**Gate**: build

---

### T6: Gate check — build

**What**: Confirmar que o projeto compila sem erros de tipo após todas as reorganizações.
**Where**: Raiz do projeto
**Depends on**: T5
**Requirement**: SUGG-06

**Done when**:
- [ ] `pnpm build` executa sem erros TypeScript
- [ ] `suggestion/components/` contém apenas as subpastas `board/`, `create/`, `help/` (nenhum arquivo solto)
- [ ] `src/hooks/use-debounce.ts` existe
- [ ] `src/validators/suggestions.ts` está inalterado

**Verify**:
```bash
pnpm build
```

**Tests**: none
**Gate**: build

**Commit**: `refactor(suggestion): componentize into board, create, help; extract useDebounce`

---

## Task Granularity Check

| Task | Escopo | Status |
|---|---|---|
| T1: Mover 1 arquivo para `board/` | 1 pasta, 1 move | ✅ Granular |
| T2: Mover 3 arquivos para `create/` | 1 pasta, 3 moves coesos | ✅ Granular |
| T3: Mover 1 arquivo para `help/` | 1 pasta, 1 move | ✅ Granular |
| T4: Criar `use-debounce.ts` | 1 arquivo novo | ✅ Granular |
| T5: Atualizar imports em 1 arquivo | 1 arquivo, N linhas de import | ✅ Granular |
| T6: Gate check | Verificação final | ✅ Granular |

---

## Diagram-Definition Cross-Check

| Task | Depends On (body) | Diagrama mostra | Status |
|---|---|---|---|
| T1 | None | Início Phase 1 | ✅ Match |
| T2 | None | Início Phase 1 | ✅ Match |
| T3 | None | Início Phase 1 | ✅ Match |
| T4 | None | Início Phase 1 | ✅ Match |
| T5 | T1, T2, T3, T4 | Início Phase 2 | ✅ Match |
| T6 | T5 | Após Phase 2 | ✅ Match |

---

## Test Co-location Validation

Projeto não possui framework de testes configurado. Gate único é `pnpm build`.

| Task | Camada modificada | Gate | Status |
|---|---|---|---|
| T1 | Move de arquivo (sem mudança de lógica) | build | ✅ OK |
| T2 | Move de arquivos (sem mudança de lógica) | build | ✅ OK |
| T3 | Move de arquivo (sem mudança de lógica) | build | ✅ OK |
| T4 | Novo arquivo de hook (lógica extraída, idêntica) | build | ✅ OK |
| T5 | Atualização de imports + remoção de inline hook | build | ✅ OK |
| T6 | Verificação — sem código novo | build | ✅ OK |
