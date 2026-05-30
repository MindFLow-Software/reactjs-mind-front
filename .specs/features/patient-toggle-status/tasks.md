# Tasks: Patient Toggle Status

Spec: [spec.md](spec.md) | Integration ref: [frontend-integration.md](frontend-integration.md)

## Princípios de implementação

- Checar `src/utils/` e `src/validators/` antes de escrever qualquer lógica inline
- Usar `cn()` de `@/lib/utils` para classes condicionais
- Toda cor hardcoded precisa de variante `dark:`
- Nenhum JSX duplicado — extrair componente se o mesmo bloco aparecer em mais de um lugar
- Seguir o padrão do arquivo: `useMutation` direto com `onMutate`/`onSuccess`/`onError`/`onSettled`
- React Hook Form é exclusivo para formulários — não usar em fluxos de ação/toggle

---

## T-01 — Corrigir tipo PatientHTTP e normalizar em get-patients.ts

**Status:** `[x] done`
**Satisfaz:** REQ-05
**Arquivos:**
- `src/types/patient.ts`
- `src/api/patients/get-patients.ts`

**Mudança em `src/types/patient.ts`:**
```ts
// DE
isActive?:  boolean
status?:    'active' | 'inactive'

// PARA
isActive:   boolean
status:     'active' | 'inactive'
```

**Mudança em `src/api/patients/get-patients.ts` (dentro do `.map`):**
```ts
// Após as linhas existentes de normalização, adicionar:
status:   p.status   ?? (p.isActive ? 'active' : 'inactive'),
isActive: p.isActive ?? (p.status === 'active'),
```

**Mudança em `src/pages/app/patients/patients-list/components/table/patients-table-row.tsx`:**
```ts
// DE
const patientIsActive = status === 'active' || (status === undefined && isActive === true)

// PARA
const patientIsActive = status === 'active'
```
Remover `isActive` da desestruturação se não for mais usado diretamente.

**Done when:** TypeScript não reclama de `status` ou `isActive` como opcionais em nenhum arquivo. A lógica defensiva de fallback some.

---

## T-02 — Corrigir mutation de arquivo para usar PATCH /status

**Status:** `[x] done`
**Satisfaz:** REQ-02
**Depende de:** T-01
**Arquivo:** `src/pages/app/patients/patients-list/components/table/patients-table-row.tsx`

**O que mudar (linhas 107-115):**
```ts
// DE
const { mutateAsync: toggleStatusFn, isPending: isUpdating } = useMutation({
  mutationFn: () => deletePatients(id),
  onSuccess: async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['patients'] }),
      queryClient.invalidateQueries({ queryKey: ['patient-details', id] }),
    ])
  },
})

// PARA
const { mutateAsync: toggleStatusFn, isPending: isUpdating } = useMutation({
  mutationFn: () => togglePatientStatus(id, false),
  onSuccess: async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['patients'] }),
      queryClient.invalidateQueries({ queryKey: ['patient-details', id] }),
      queryClient.invalidateQueries({ queryKey: ['patients-count'] }),
    ])
  },
})
```
Remover import de `deletePatients` — não é mais usado neste arquivo.

**Done when:** Network tab confirma `PATCH /patients/:id/status` com `{"isActive":false}` ao clicar "Arquivar" no dropdown. Badge muda para "Arquivado". Card de métricas atualiza.

---

## T-03 — Adicionar optimistic update + toast ao handleToggleStatus

**Status:** `[x] done`
**Satisfaz:** REQ-04, REQ-06
**Depende de:** T-01
**Arquivo:** `src/pages/app/patients/patients-list/components/table/patients-table-row.tsx`

**O que mudar (linhas 117-123):**
```ts
// DE
const { mutate: handleToggleStatus, isPending: isTogglingStatus } = useMutation({
  mutationFn: () => togglePatientStatus(id, !patientIsActive),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['patients'] })
    queryClient.invalidateQueries({ queryKey: ['patients-count'] })
  },
})

// PARA
const { mutate: handleToggleStatus, isPending: isTogglingStatus } = useMutation({
  mutationFn: () => togglePatientStatus(id, !patientIsActive),

  onMutate: async () => {
    await queryClient.cancelQueries({ queryKey: ['patients'] })
    queryClient.setQueriesData<GetPatientsResponse>(
      { queryKey: ['patients'], exact: false },
      (old) => {
        if (!old) return old
        return {
          ...old,
          patients: old.patients.map((p) =>
            p.id === id
              ? { ...p, status: patientIsActive ? 'inactive' : 'active', isActive: !patientIsActive }
              : p
          ),
        }
      }
    )
  },

  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['patients-count'] })
    toast.success(
      patientIsActive
        ? `${fullName} arquivado com sucesso.`
        : `${fullName} reativado com sucesso.`
    )
  },

  onError: () => {
    toast.error('Erro ao alterar status do paciente. Tente novamente.')
  },

  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ['patients'] })
  },
})
```

Adicionar import de `GetPatientsResponse` de `@/api/patients/get-patients`. Verificar se `toast` de `sonner` já está importado; adicionar se não estiver. `fullName` já é `${firstName} ${lastName}.trim()` — nenhum util novo necessário.

**Done when:** Clicar no badge atualiza o status visualmente de forma imediata (sem esperar API). Toast aparece com nome e ação. Em caso de erro, badge volta ao estado anterior.

---

## T-04 — Tornar item do dropdown condicional (Arquivar / Reativar)

**Status:** `[x] done`
**Satisfaz:** REQ-03
**Depende de:** T-02, T-03
**Arquivo:** `src/pages/app/patients/patients-list/components/table/patients-table-row.tsx`

**O que mudar (linhas 348-354):**
```tsx
// DE
<DropdownMenuItem
  onSelect={handleOpenDelete}
  className="cursor-pointer text-destructive focus:text-destructive"
>
  <Archive className="mr-2 h-4 w-4" /> Arquivar paciente
</DropdownMenuItem>

// PARA
{patientIsActive ? (
  <DropdownMenuItem
    onSelect={handleOpenDelete}
    className="cursor-pointer text-destructive focus:text-destructive"
  >
    <Archive className="mr-2 h-4 w-4" /> Arquivar paciente
  </DropdownMenuItem>
) : (
  <DropdownMenuItem
    onSelect={() => handleToggleStatus()}
    disabled={isTogglingStatus}
    className="cursor-pointer text-emerald-700 dark:text-emerald-400 focus:text-emerald-700 dark:focus:text-emerald-400"
  >
    <RotateCcw className="mr-2 h-4 w-4" /> Reativar paciente
  </DropdownMenuItem>
)}
```
Adicionar `RotateCcw` ao import do `lucide-react`. Cores seguem o padrão do badge de status no mesmo arquivo (`text-emerald-700 dark:text-emerald-400`).

**Done when:** Para paciente ativo, dropdown exibe "Arquivar paciente" (destructive). Para paciente arquivado, exibe "Reativar paciente" (emerald, dark mode correto). Clicar "Reativar" aciona optimistic update + `PATCH /status` com `{"isActive":true}` sem abrir dialog.

---

## T-05 — Passar filtro de status para a query da API

**Status:** `[x] done`
**Satisfaz:** REQ-01
**Arquivo:** `src/pages/app/patients/patients-list/patients-list.tsx`

**O que mudar (linhas 68-79):**
```ts
// DE
queryKey: ["patients", filters.pageIndex, filters.filter],
queryFn: () => getPatients({
  pageIndex: filters.pageIndex,
  perPage:   filters.perPage,
  filter:    filters.filter,
}),

// PARA
queryKey: ["patients", filters.pageIndex, filters.filter, filters.status],
queryFn: () => getPatients({
  pageIndex: filters.pageIndex,
  perPage:   filters.perPage,
  filter:    filters.filter,
  status:    filters.status as 'active' | 'inactive' | 'all',
}),
```
`getPatients` já converte `'all'` para `undefined` antes de enviar — nenhuma mudança downstream.

**Done when:** Clicar "Ativos" dispara `GET /patients?status=active`. Clicar "Arquivados" dispara `GET /patients?status=inactive`. Clicar "Todos" não envia o param. Lista reflete o filtro.

---

## Ordem de Execução

```
T-01 (type fix — base para todos)
  └─ T-02 (fix archive mutation)
       └─ T-03 (optimistic update + toast)
            └─ T-04 (dropdown condicional)
T-05 (independente — só toca patients-list.tsx)
```

Sequência recomendada: **T-01 → T-02 → T-03 → T-04 → T-05**

Um commit atômico por task:
```
fix(patients): tornar isActive e status required em PatientHTTP
fix(patients): corrigir mutation de arquivo para usar PATCH /status
fix(patients): adicionar optimistic update e toast no toggle de status
fix(patients): adicionar opção reativar no dropdown de ações
fix(patients): passar filtro de status para query da API
```
