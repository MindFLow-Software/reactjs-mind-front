# Patients List Refactor — Tasks

**Spec**: `.specs/features/patients-list-refactor/spec.md`
**Status**: Draft

---

## Execution Plan

### Phase 1 — Independent Foundation [Parallel]

New files with no code dependencies.

```
T1 [P] ─┐
T7 [P] ─┤── (all complete) ──→ Phase 2
T8 [P] ─┘
```

### Phase 2 — Contract Alignment [Parallel, after T1]

Fix existing files to use correct types.

```
T1 complete, then:
  T2 [P] ─┐
  T3 [P] ─┤── (all complete) ──→ Phase 3
 T10 [P] ─┘
```

### Phase 3 — Hook Extraction [Partial parallel, after T2+T3]

```
T2+T3 complete, then:
  T4 [P] ──→ T5 (sequential)
  T6 [P]
  T9 [P]

Phase 3 done when T5 + T6 + T9 all complete.
```

### Phase 4 — Integration [Sequential]

```
T5 + T6 + T7 + T8 + T9 + T10 complete, then:
  T11
```

### Phase 5 — Verification

```
T11 complete, then:
  T12
```

---

## Task Breakdown

### T1: Create `patients-list.types.ts` [P]

**What**: Create the types file with all types extracted from inline declarations in patients-list.tsx and patients-table-filters.tsx.
**Where**: `src/pages/app/patients/patients-list/patients-list.types.ts` (new)
**Depends on**: None
**Reuses**: `PatientStatus`, `Gender` from `src/types/patient.ts`; `Patient` from `src/api/patients/get-patients.ts`; `PaginationMeta` from `src/types/pagination.ts`
**Requirement**: PLR-06

**Done when**:

- [ ] `MetricCardProps` interface exported (icon, iconBg, value, label, sub?, subTrend?, isLoading?)
- [ ] `StatusPillOption` interface exported (value: PatientStatus | null, label: string, dot: string | null, activeCls: string)
- [ ] `PatientsMetrics` interface exported ({ activeCount: number, archivedCount: number, isLoading: boolean })
- [ ] `PatientsListQueryResult` interface exported ({ patients: Patient[], meta: PaginationMeta, isLoading: boolean, isFetching: boolean })
- [ ] Gate check passes: `pnpm build`

**Tests**: none
**Gate**: build

**Commit**: `refactor(patients-list): extract shared types to patients-list.types.ts`

---

### T7: Create `patients-list.helpers.ts` [P]

**What**: Create pure helper functions used in patients-list.tsx.
**Where**: `src/pages/app/patients/patients-list/patients-list.helpers.ts` (new)
**Depends on**: None
**Reuses**: `PatientStatus` from `src/types/patient.ts`
**Requirement**: PLR-06

**Done when**:

- [ ] `formatPatientsShowing(showing: number, total: number): string` exported — returns `"Mostrando X de Y pacientes"`
- [ ] `calcShowing(perPage: number, total: number): number` exported — returns `Math.min(perPage, total)` when total > 0, else 0
- [ ] `hasActiveFilters(filter: string, status: PatientStatus | null): boolean` exported — returns true when filter is non-empty or status is non-null
- [ ] Gate check passes: `pnpm build`

**Tests**: none
**Gate**: build

**Commit**: `refactor(patients-list): extract pure helpers to patients-list.helpers.ts`

---

### T8: Create `patients-list.css` [P]

**What**: Create the CSS file with semantic `@apply` classes for patients-list.tsx and patients-table-filters.tsx.
**Where**: `src/pages/app/patients/patients-list/patients-list.css` (new)
**Depends on**: None
**Requirement**: PLR-07

**Classes to define** (all under `@layer components`):

- `.pl-header-actions` — `@apply flex items-center gap-2`
- `.pl-action-btn` — `@apply flex h-9 cursor-pointer items-center gap-2 rounded-xl px-4 border border-border bg-background text-[13px] font-medium shadow-sm transition-all hover:bg-muted hover:-translate-y-px active:scale-[0.98]`
- `.pl-primary-btn` — `@apply flex h-9 cursor-pointer items-center gap-2 rounded-xl px-4 bg-blue-600 text-[13px] font-medium text-white shadow-[0_2px_8px_rgba(37,99,235,0.25)] transition-all hover:bg-blue-700 hover:-translate-y-px active:scale-[0.98]`
- `.pl-table-action-btn` — `@apply pl-action-btn h-8 px-3 text-xs rounded-lg`
- `.pl-metrics-grid` — `@apply grid grid-cols-2 lg:grid-cols-4 gap-3 px-6 pt-2 pb-0`
- `.pl-table-section` — `@apply px-6 py-4`
- `.ptf-search-wrapper` — `@apply relative w-90 shrink-0`
- `.ptf-status-pills` — `@apply flex items-center gap-1`
- `.ptf-pill` — `@apply flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-medium transition-colors cursor-pointer`
- `.ptf-pill--inactive` — `@apply bg-muted text-muted-foreground hover:bg-muted/70 hover:text-foreground`
- `.ptf-right-actions` — `@apply flex items-center gap-2 ml-auto`

**Done when**:

- [ ] All classes defined under `@layer components` with `@apply`
- [ ] Class names use `pl-` prefix (orchestrator) or `ptf-` prefix (table filters)
- [ ] Gate check passes: `pnpm build`

**Tests**: none
**Gate**: build

**Commit**: `refactor(patients-list): add patients-list.css with semantic @apply classes`

---

### T2: Fix `get-patients.ts` [P]

**What**: Fix the `GetPatientsFilters` interface to accept only backend-valid types; uncomment `status`; fix patient normalization.
**Where**: `src/api/patients/get-patients.ts` (modify)
**Depends on**: T1
**Reuses**: `PatientStatus`, `Gender` from `src/types/patient.ts`
**Requirement**: PLR-03

**Changes**:

1. `GetPatientsFilters.gender`: `Ipatient['gender'] | 'all' | null` → `Gender | undefined`
2. `GetPatientsFilters.status`: uncomment; `PatientStatus | 'all'` → `PatientStatus | undefined`
3. `GetPatientsFilters.order`: `'asc' | 'desc' | 'all' | null` → `'asc' | 'desc' | undefined`
4. `GetPatientsFilters.sessionVolume`: `'high' | 'low' | 'all' | null` → `string | undefined`
5. Function body: uncomment `status` in destructuring and in `params` object; remove all `&& x !== 'all'` guards
6. Patient normalization: `status: p.status ?? (p.isActive ? 'active' : 'inactive')` → `status: p.status` (already typed as `PatientStatus` on `Ipatient`)

**Done when**:

- [ ] `GetPatientsFilters` has no `| 'all'` or `| null` types
- [ ] `status` is destructured and forwarded to `params` when provided
- [ ] Patient normalization uses only `PatientStatus` values
- [ ] Gate check passes: `pnpm build`

**Tests**: none
**Gate**: build

**Commit**: `fix(get-patients): align GetPatientsFilters to backend contract; re-enable status`

---

### T3: Fix `use-patient-filters.ts` [P]

**What**: Replace UI sentinel values with typed nulls; add `gender` and `sessionVolume` to URL state; stabilize all setter functions with `useCallback`.
**Where**: `src/hooks/use-patient-filters.ts` (modify)
**Depends on**: T1
**Reuses**: `PatientStatus`, `Gender` from `src/types/patient.ts`
**Requirement**: PLR-01, PLR-05, PLR-09

**Changes**:

1. `status` in returned `filters`: `string` defaulting to `"all"` → `PatientStatus | null` (null when URL has no `status` param)
2. `gender` in returned `filters`: add as `Gender | null` (read from `searchParams.get("gender")`, cast via `as Gender`)
3. `sessionVolume` in returned `filters`: add as `string | null` (read from `searchParams.get("sessionVolume")`)
4. `sortBy` remains in `filters` object — UI-only for table column highlighting, never sent to backend
5. `setFilters` signature: `{ filter?: string; status?: PatientStatus | null; gender?: Gender | null; sessionVolume?: string | null }`
6. `setFilters` body: sentinel check `status !== "all"` → `status != null`; null → `state.delete(key)`, value → `state.set(key, value)`; add gender and sessionVolume handling with same pattern
7. Wrap ALL returned functions in `useCallback`: `setPage`, `setFilters`, `setSort`, `setOrder`, `clearFilters` — use `[setSearchParams]` as the dependency array for all of them (`setSearchParams` is stable in React Router)
8. Keep `clearFilters` clearing gender and sessionVolume from URL as well

**Done when**:

- [ ] `filters.status` is `PatientStatus | null`, never `"all"`
- [ ] `filters.gender` and `filters.sessionVolume` are read from URL and typed correctly
- [ ] `setFilters` accepts `null` to clear any filter param
- [ ] All returned setters wrapped with `useCallback([setSearchParams])`
- [ ] `clearFilters` deletes `filter`, `status`, `gender`, `sessionVolume` and resets `page` to `"1"`
- [ ] Gate check passes: `pnpm build`

**Tests**: none
**Gate**: build

**Commit**: `fix(use-patient-filters): replace sentinels with typed nulls; add gender/sessionVolume; stabilize with useCallback`

---

### T10: Extract `MetricCard` component [P]

**What**: Move the inline `MetricCard` function and `MetricCardProps` interface out of `patients-list.tsx` into its own component file.
**Where**: `src/pages/app/patients/patients-list/components/metric-card.tsx` (new)
**Depends on**: T1
**Reuses**: `MetricCardProps` from `../patients-list.types`; `cn` from `@/lib/utils`; `ArrowUp` from `lucide-react`
**Requirement**: PLR-02, PLR-06

**Done when**:

- [ ] `MetricCard` component exported from `components/metric-card.tsx`
- [ ] `MetricCardProps` imported from `patients-list.types.ts` (not redefined inline)
- [ ] The original inline definition in `patients-list.tsx` is removed (import updated)
- [ ] Gate check passes: `pnpm build`

**Tests**: none
**Gate**: build

**Commit**: `refactor(patients-list): extract MetricCard to its own component file`

---

### T4: Create `usePatientsQueryParams` [P]

**What**: Create a hook that derives backend-valid API params from URL filter state — the single source of truth for what goes to the backend.
**Where**: `src/pages/app/patients/patients-list/hooks/use-patients-query-params.ts` (new)
**Depends on**: T3
**Reuses**: `usePatientFilters` from `@/hooks/use-patient-filters`; `PatientStatus`, `Gender` from `@/types/patient`
**Requirement**: PLR-01, PLR-03, PLR-04

**Return shape** (`PatientsQueryParams` interface, defined in this file):

```ts
interface PatientsQueryParams {
  pageIndex: number
  perPage: number
  filter?: string
  status?: PatientStatus
  gender?: Gender
  sessionVolume?: string
  order: 'asc' | 'desc'
}
```

**Logic**:
- `filter`: include only when `filters.filter` is non-empty
- `status`: include only when `filters.status !== null`
- `gender`: include only when `filters.gender !== null`
- `sessionVolume`: include only when `filters.sessionVolume !== null`
- `order`: always include (always `'asc' | 'desc'`)
- `sortBy`: NEVER included

**Done when**:

- [ ] `usePatientsQueryParams` and `PatientsQueryParams` both exported
- [ ] `sortBy` is absent from the return value
- [ ] `status`, `gender`, `sessionVolume` use object spread/conditional inclusion so the key is absent (not `undefined`) when not set
- [ ] Gate check passes: `pnpm build`

**Tests**: none
**Gate**: build

**Commit**: `feat(patients-list): add usePatientsQueryParams — derives backend-valid params from URL`

---

### T6: Create `usePatientsMetrics` [P]

**What**: Create a hook that owns the two parallel `getPatients` calls for active/archived patient counts.
**Where**: `src/pages/app/patients/patients-list/hooks/use-patients-metrics.ts` (new)
**Depends on**: T2
**Reuses**: `getPatients` from `@/api/patients/get-patients`; `PatientsMetrics` from `../patients-list.types`
**Requirement**: PLR-04, PLR-06

**Implementation**:
- One `useQuery` per status using `Promise.all` inside `queryFn`, or two separate `useQuery` calls
- Query key: `['patients-metrics']` — intentionally filter-independent (clinic-wide totals; must NOT include pageIndex or filter params to satisfy PLR-04)
- `staleTime: 60_000`, `gcTime: 300_000`, `refetchOnWindowFocus: false`

**Done when**:

- [ ] `usePatientsMetrics` exported; returns `PatientsMetrics` (`{ activeCount, archivedCount, isLoading }`)
- [ ] Uses `status: 'ACTIVE'` and `status: 'BLOCKED'` in the two parallel calls
- [ ] Query key is `['patients-metrics']` with no filter params
- [ ] Gate check passes: `pnpm build`

**Tests**: none
**Gate**: build

**Commit**: `feat(patients-list): add usePatientsMetrics hook`

---

### T9: Fix `patients-table-filters.tsx` [P]

**What**: Replace invalid STATUS_PILLS values with backend enums; fix the debounce `useEffect` dependency; apply CSS classes from T8.
**Where**: `src/pages/app/patients/patients-list/components/table/patients-table-filters.tsx` (modify)
**Depends on**: T3
**Reuses**: `StatusPillOption` from `../../patients-list.types`; CSS classes from `../../patients-list.css`
**Requirement**: PLR-05, PLR-08

**Changes**:

1. `STATUS_PILLS` typed as `readonly StatusPillOption[]`:
   - `{ value: null, label: 'Todos', dot: null, activeCls: '...' }`
   - `{ value: 'ACTIVE', label: 'Ativos', dot: 'bg-emerald-500', activeCls: '...' }`
   - `{ value: 'BLOCKED', label: 'Arquivados', dot: 'bg-red-500', activeCls: '...' }`
2. `onClick`: `setFilters({ status: pill.value })` — `null` clears the URL param via the updated hook
3. `activeStatus` check: `filters.status === pill.value` — works for null === null (Todos)
4. `hasFilters`: `!!filters.filter || filters.status !== null`
5. Debounce `useEffect`: remove `setFilters` from dep array. Since it's now stable via `useCallback`, ESLint may warn — add `// eslint-disable-next-line react-hooks/exhaustive-deps` with a brief note, OR use a `useRef` to capture `setFilters` and call it through the ref
6. Apply CSS classes: `.ptf-search-wrapper`, `.ptf-status-pills`, `.ptf-pill`, `.ptf-pill--inactive`, `.ptf-right-actions`

**Done when**:

- [ ] `STATUS_PILLS` values are `null`, `'ACTIVE'`, `'BLOCKED'`
- [ ] Clicking "Todos" → `status` absent from URL
- [ ] Clicking "Ativos" → `?status=ACTIVE` in URL
- [ ] Clicking "Arquivados" → `?status=BLOCKED` in URL
- [ ] `useEffect` dep array does not include `setFilters`
- [ ] CSS classes from patients-list.css applied
- [ ] Gate check passes: `pnpm build`

**Tests**: none
**Gate**: build

**Commit**: `fix(patients-table-filters): align status pills to backend enums; fix debounce deps`

---

### T5: Create `usePatientsListQuery`

**What**: Create the hook that owns the `useQuery` call for the patient list, consuming backend-valid params from `usePatientsQueryParams`.
**Where**: `src/pages/app/patients/patients-list/hooks/use-patients-list-query.ts` (new)
**Depends on**: T4, T2
**Reuses**: `usePatientsQueryParams` (T4); `getPatients` from `@/api/patients/get-patients`; `PatientsListQueryResult` from `../patients-list.types`
**Requirement**: PLR-02, PLR-03, PLR-04, PLR-06

**Query key**: `['patients', params]` where `params` is the full `PatientsQueryParams` object. React Query performs deep equality on the key array, so every param change triggers a refetch.

**Query config**: `staleTime: 30_000`, `gcTime: 300_000`, `refetchOnWindowFocus: true`, `placeholderData: (prev) => prev`

**Safe defaults when `data` is undefined**:
- `patients`: `[]`
- `meta`: `{ pageIndex: 0, perPage: 10, totalCount: 0 }`

**Done when**:

- [ ] `usePatientsListQuery` exported; return type matches `PatientsListQueryResult`
- [ ] Query key is `['patients', params]` — `params` from `usePatientsQueryParams`, no `sortBy`
- [ ] Safe defaults applied for patients and meta
- [ ] Gate check passes: `pnpm build`

**Tests**: none
**Gate**: build

**Commit**: `feat(patients-list): add usePatientsListQuery hook`

---

### T11: Refactor `patients-list.tsx` to clean orchestrator

**What**: Reduce `patients-list.tsx` to under 120 lines by consuming all extracted hooks and components; remove all inline logic, types, and computed JSX variables.
**Where**: `src/pages/app/patients/patients-list/patients-list.tsx` (modify); import `./patients-list.css`
**Depends on**: T5, T6, T7, T8, T9, T10
**Reuses**: `usePatientsListQuery` (T5), `usePatientsMetrics` (T6), helpers from T7, `MetricCard` from T10, `usePatientFilters` (for `filters.sortBy`, `setPage`, `setSort`, `clearFilters`)
**Requirement**: PLR-02, PLR-06, PLR-07

**Remove from current file**:
- `MetricCardProps` interface + `MetricCard` function (now in T10)
- `btnSecondary` computed const (→ `.pl-action-btn`)
- `headerRight` and `tableActions` JSX variables (inline directly into JSX)
- Both raw `useQuery` calls (→ T5, T6)
- Both `useMemo` calls for `patients` and `meta` (→ T5)
- Inline metric derivations (`activeCount`, `inactiveCount`, `totalCount`, `loadingCounts`, `loadingTotal`)

**Target structure**:

```tsx
import './patients-list.css'
// other imports...

export function PatientsList() {
  useEffect(() => { setTitle("Pacientes") }, [setTitle])

  const { filters, setPage, setSort, clearFilters } = usePatientFilters()
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const [isInviteOpen,   setIsInviteOpen]   = useState(false)
  const registerDraft = useCreatePatientDraft()

  const { patients, meta, isLoading, isFetching } = usePatientsListQuery()
  const { activeCount, archivedCount, isLoading: loadingMetrics } = usePatientsMetrics()

  const showing = calcShowing(meta.perPage, meta.totalCount)
  const filtersActive = hasActiveFilters(filters.filter, filters.status)

  return (
    <>
      <Helmet title="Pacientes" />
      <PatientsPageShell ... headerRight={<div className="pl-header-actions">...</div>}>
        <div className="pl-metrics-grid">
          <MetricCard ... /> {/* × 4 */}
        </div>
        <div className="pl-table-section">
          <PatientsDataBlock
            description={formatPatientsShowing(showing, meta.totalCount)}
            ...
          >
            <PatientsTableFilters isFetching={isFetching} />
            <PatientsTable ... />
            {meta.totalCount > 0 && <Pagination ... />}
          </PatientsDataBlock>
        </div>
      </PatientsPageShell>
      <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
        {isRegisterOpen && <RegisterPatients ... />}
      </Dialog>
      <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
        <GenerateInviteModal />
      </Dialog>
    </>
  )
}
```

**Done when**:

- [ ] File is under 120 lines
- [ ] Zero inline type declarations
- [ ] Zero raw `useQuery` or `useMemo` calls
- [ ] `className` attributes use `.pl-*` / `.ptf-*` CSS classes or ≤4 Tailwind utilities inline
- [ ] All dialogs open/close correctly
- [ ] Gate check passes: `pnpm build`

**Tests**: none
**Gate**: build

**Commit**: `refactor(patients-list): reduce orchestrator to <120 lines using extracted hooks and components`

---

### T12: Build check and smoke test

**What**: Run the gate check; verify end-to-end behavior in the browser.
**Where**: Terminal + browser DevTools
**Depends on**: T11
**Requirement**: All PLR-01 through PLR-09

**Done when**:

- [ ] `pnpm build` exits 0 — zero TypeScript errors
- [ ] `pnpm lint` exits 0 (or only pre-existing warnings)
- [ ] /patients loads — page, metrics cards, and table render correctly
- [ ] Type in search → wait 400ms → exactly one network request fires with `filter=<term>` and `pageIndex=0`
- [ ] Click "Ativos" → URL shows `?status=ACTIVE`; network request has `status=ACTIVE`
- [ ] Click "Todos" → URL has no `status` param; network request has no `status` param
- [ ] Click "Arquivados" → URL shows `?status=BLOCKED`; network request has `status=BLOCKED`
- [ ] Navigate to page 2 → network request has `pageIndex=1`; metrics do NOT refetch
- [ ] Click a column sort header → network request has `order=asc` or `order=desc`; NO `sortBy` param in request
- [ ] Network tab confirms: no request ever contains `sortBy`, `"all"`, `"active"`, or `"inactive"`
- [ ] Manually set `?gender=FEMININE` in URL → network request includes `gender=FEMININE`
- [ ] Open Register Patient dialog → works; close → works
- [ ] Open Invite modal → works; close → works

**Tests**: none (manual verification)
**Gate**: build + manual

---

## Parallel Execution Map

```
Phase 1 (Parallel — no deps):
  T1 [P]  ──────────────────────────────────────────┐
  T7 [P]  ──────────────────────────────────────────┤
  T8 [P]  ──────────────────────────────────────────┘
                                                     │ (T1, T7, T8 done)
Phase 2 (Parallel — after T1):                       ▼
  T2  [P] ─────────────────────────────────────────┐
  T3  [P] ─────────────────────────────────────────┤
  T10 [P] ─────────────────────────────────────────┘
                                                    │ (T2, T3, T10 done)
Phase 3 (Partial parallel — after T2+T3):           ▼
  T4  [P] ───────────────────────┐
  T6  [P] ───────────────────────┤
  T9  [P] ───────────────────────┤
                                 │ (T4 done)
                             T5 ─┘ (sequential after T4)
                                                    │ (T5, T6, T9 done)
Phase 4 (Sequential — after T5+T6+T7+T8+T9+T10):   ▼
  T11

Phase 5 (Sequential — after T11):
  T12
```

---

## Task Granularity Check

| Task | Scope | Status |
|------|-------|--------|
| T1: patients-list.types.ts | 1 new file, 4 interfaces | ✅ Granular |
| T2: Fix get-patients.ts | 1 file, type + body fix | ✅ Granular |
| T3: Fix use-patient-filters.ts | 1 file, contract + useCallback | ✅ Granular |
| T4: usePatientsQueryParams | 1 new hook file | ✅ Granular |
| T5: usePatientsListQuery | 1 new hook file | ✅ Granular |
| T6: usePatientsMetrics | 1 new hook file | ✅ Granular |
| T7: patients-list.helpers.ts | 1 new file, 3 pure functions | ✅ Granular |
| T8: patients-list.css | 1 new CSS file | ✅ Granular |
| T9: Fix patients-table-filters.tsx | 1 file | ✅ Granular |
| T10: Extract MetricCard | 1 new component file | ✅ Granular |
| T11: Refactor patients-list.tsx | 1 file | ✅ Granular |
| T12: Build + smoke test | Verification only | ✅ Granular |

---

## Diagram-Definition Cross-Check

| Task | Depends On (body) | Diagram Shows | Status |
|------|-------------------|---------------|--------|
| T1 | None | Phase 1 start | ✅ |
| T7 | None | Phase 1 start | ✅ |
| T8 | None | Phase 1 start | ✅ |
| T2 | T1 | After Phase 1 | ✅ |
| T3 | T1 | After Phase 1 | ✅ |
| T10 | T1 | After Phase 1 | ✅ |
| T4 | T3 | After Phase 2, parallel | ✅ |
| T6 | T2 | After Phase 2, parallel | ✅ |
| T9 | T3 | After Phase 2, parallel | ✅ |
| T5 | T4, T2 | After T4 (sequential) | ✅ |
| T11 | T5, T6, T7, T8, T9, T10 | After Phase 3 | ✅ |
| T12 | T11 | After Phase 4 | ✅ |

---

## Test Co-location Validation

TESTING.md: No test framework configured. Gate is `pnpm build` (TypeScript) for all tasks.

| Task | Code Layer | Matrix Requires | Task Says | Status |
|------|-----------|-----------------|-----------|--------|
| T1 | Types file | none | none | ✅ |
| T2 | API function | none | none | ✅ |
| T3 | Custom hook | none | none | ✅ |
| T4 | Custom hook | none | none | ✅ |
| T5 | Custom hook | none | none | ✅ |
| T6 | Custom hook | none | none | ✅ |
| T7 | Pure functions | none | none | ✅ |
| T8 | CSS file | none | none | ✅ |
| T9 | UI component | none | none | ✅ |
| T10 | UI component | none | none | ✅ |
| T11 | UI component | none | none | ✅ |
| T12 | Verification | none | manual | ✅ |

---

## Requirement Traceability

| Requirement ID | Implemented By |
|---------------|---------------|
| PLR-01 | T3, T4 |
| PLR-02 | T10, T11 |
| PLR-03 | T2, T4, T5 |
| PLR-04 | T4, T5, T6 |
| PLR-05 | T3, T9 |
| PLR-06 | T1, T4, T5, T6, T7, T10 |
| PLR-07 | T8, T9, T11 |
| PLR-08 | T3, T9 |
| PLR-09 | T3, T4 |
