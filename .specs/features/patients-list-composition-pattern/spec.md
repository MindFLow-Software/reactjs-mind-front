# Spec: patients-list Composition Pattern Refactor

## Problem Statement

Three layout components in `/patients/` carry 7–9 props each to render named regions (title, description, icon, actions, toolbar, footer, etc.). This is a slot problem disguised as a props problem. Callers must know the internal slot names of the component and pass values from a distance, which creates indirect, hard-to-trace JSX. The Composition Pattern eliminates this by turning each named slot into a named subcomponent that the caller assembles explicitly.

## Goals

- Refactor `MetricCard`, `PatientsPageShell`, and `PatientsDataBlock` to expose compound subcomponents via dot-notation
- Remove all named-slot props from these components' root APIs
- Update all callers across the `patients/` feature area
- No behavioral, visual, or UX regressions

## Out of Scope

| Component | Reason |
|---|---|
| `PatientsTable` | 7 props — all necessary data/callbacks, not layout slots |
| `PatientsTableRow` | 1 prop, already optimal |
| `PatientsTableFilters` | 1 prop, already optimal |
| `EvolutionViewer` | Data display component, not a layout shell |
| `RegisterPatients` step components | Already use FormContext correctly |

---

## Requirements

### R1 — MetricCard compound component

**File:** `src/pages/app/patients/patients-list/components/metric-card.tsx`

Replace the flat 7-prop API with a compound component exposing four subcomponents:

| Subcomponent | Replaces | Props |
|---|---|---|
| `MetricCard.Icon` | `icon` + `iconBg` | `bg: string`, `children: ReactNode` |
| `MetricCard.Value` | `value` | `children: ReactNode` |
| `MetricCard.Label` | `label` | `children: ReactNode` |
| `MetricCard.Trend` | `sub` + `subTrend` | `direction: 'up' \| 'neutral' \| 'down'`, `children: ReactNode` |

`isLoading` moves to the root and propagates via React Context so `MetricCard.Value` auto-renders `<Skeleton className="h-7 w-12" />` without callers conditionally rendering skeletons.

**Target usage:**
```tsx
<MetricCard isLoading={isLoading}>
  <MetricCard.Icon bg="bg-blue-500/10">
    <UsersRound className="size-5 text-blue-600" />
  </MetricCard.Icon>
  <MetricCard.Value>{meta.totalCount}</MetricCard.Value>
  <MetricCard.Label>Total de pacientes</MetricCard.Label>
</MetricCard>

<MetricCard isLoading={loadingMetrics}>
  <MetricCard.Icon bg="bg-emerald-500/10">
    <Activity className="size-5 text-emerald-600" />
  </MetricCard.Icon>
  <MetricCard.Value>{activeCount}</MetricCard.Value>
  <MetricCard.Label>Ativos</MetricCard.Label>
  <MetricCard.Trend direction="up">24%</MetricCard.Trend>
</MetricCard>
```

**Implementation pattern:** `Object.assign(MetricCardRoot, { Icon, Value, Label, Trend })`

---

### R2 — Remove `MetricCardProps` from types file

**File:** `src/pages/app/patients/patients-list/patients-list.types.ts`

Delete the `MetricCardProps` interface — it becomes internal to `metric-card.tsx`. The remaining three interfaces (`StatusPillOption`, `PatientsMetrics`, `PatientsListQueryResult`) are unchanged.

---

### R3 — PatientsPageShell compound component

**File:** `src/pages/app/patients/components/patients-page-shell.tsx`

Replace the 8-prop API with a compound component exposing three subcomponents:

| Subcomponent | Replaces | Props |
|---|---|---|
| `PatientsPageShell.Header` | `title` + `description` + `icon` + `headerRight` | `title?: ReactNode`, `description?: ReactNode`, `icon?: ReactNode`, `children?: ReactNode` (actions area) |
| `PatientsPageShell.Filters` | `filters` | `children: ReactNode` (wraps in `PatientsSurface`) |
| `PatientsPageShell.Content` | `children` | `children: ReactNode`, `className?: string` (wraps in `PatientsSurface`) |

Root accepts only `children: ReactNode` and optional `className?: string`.

`PatientsSurface` remains exported as a utility.

**Target usage:**
```tsx
<PatientsPageShell>
  <PatientsPageShell.Header
    title="Pacientes"
    description="Gerencie sua base de pacientes..."
    icon={<UsersRound className="size-6 text-blue-600" />}
  >
    <PageShellHeader ... />
  </PatientsPageShell.Header>
  <PatientsPageShell.Content>
    {/* metrics + table */}
  </PatientsPageShell.Content>
</PatientsPageShell>
```

**Implementation pattern:** `Object.assign(PatientsPageShellRoot, { Header, Filters, Content })`

---

### R4 — PatientsDataBlock compound component

**File:** `src/pages/app/patients/components/patients-data-block.tsx`

Replace the 9-prop API with a compound component exposing four subcomponents:

| Subcomponent | Replaces | Props |
|---|---|---|
| `PatientsDataBlock.Header` | `title` + `description` + `headerActions` + `isLoading` | `title?: ReactNode`, `description?: ReactNode`, `isLoading?: boolean`, `children?: ReactNode` (actions) |
| `PatientsDataBlock.Toolbar` | `toolbar` | `children: ReactNode` |
| `PatientsDataBlock.Content` | `children` | `children: ReactNode`, `className?: string` |
| `PatientsDataBlock.Footer` | `footer` | `children: ReactNode` |

Root accepts only `children: ReactNode` and optional `className?: string`.

**Target usage:**
```tsx
<PatientsDataBlock>
  <PatientsDataBlock.Header
    title="Lista de pacientes"
    description={formatPatientsShowing(totalPatients, meta.totalCount)}
  >
    <PageDataBlockHeader ... />
  </PatientsDataBlock.Header>
  <PatientsDataBlock.Toolbar>
    <PatientsTableFilters isFetching={isFetching} />
  </PatientsDataBlock.Toolbar>
  <PatientsDataBlock.Content>
    <PatientsTable ... />
  </PatientsDataBlock.Content>
  <PatientsDataBlock.Footer>
    <Pagination ... />
  </PatientsDataBlock.Footer>
</PatientsDataBlock>
```

**Implementation pattern:** `Object.assign(PatientsDataBlockRoot, { Header, Toolbar, Content, Footer })`

---

### R5 — Update all callers

Four files consume `PatientsPageShell` and/or `PatientsDataBlock`. Three consume `MetricCard`. All must be migrated to the new compound APIs with no prop regressions.

| File | Migrates |
|---|---|
| `patients-list/patients-list.tsx` | MetricCard × 3, PatientsPageShell, PatientsDataBlock |
| `patients-records/patients-records.tsx` | PatientsPageShell, PatientsDataBlock |
| `patients-hub/patients-details.tsx` | PatientsPageShell, PatientsDataBlock |
| `patients-docs/patients-docs.tsx` | PatientsPageShell, PatientsDataBlock |

---

### R6 — TypeScript safety

- All subcomponent props typed with explicit interfaces (no `any`)
- `Object.assign` pattern preserves full TypeScript inference at call sites
- No `React.FC` — use plain function declarations
- Context value type explicitly declared for `MetricCard`

---

### R7 — No regressions

- All existing CSS classes, layout structures, and conditional rendering logic preserved
- Dark mode variants unchanged
- Loading skeleton behavior identical (but now automatic via context for MetricCard)
- `PatientsSurface` styling unchanged

---

## Acceptance Criteria

| ID | Criterion |
|---|---|
| AC-1 | `MetricCard` root accepts only `isLoading` and `children` — no icon/value/label props |
| AC-2 | `MetricCard.Value` shows `<Skeleton>` when parent `isLoading` is true, without caller intervention |
| AC-3 | `PatientsPageShell` root accepts only `children` and `className` |
| AC-4 | `PatientsDataBlock` root accepts only `children` and `className` |
| AC-5 | All four caller files build with zero TypeScript errors |
| AC-6 | `npm run lint` passes with zero errors |
| AC-7 | `npm run build` produces zero errors |
| AC-8 | Visual output on patients-list, patients-records, patients-details, patients-docs pages is unchanged |
| AC-9 | `MetricCardProps` no longer exported from `patients-list.types.ts` |
| AC-10 | No new abstractions introduced beyond the three compound components |

---

## Implementation Order

1. `metric-card.tsx` — build compound + context
2. `patients-list.types.ts` — remove `MetricCardProps`
3. `patients-page-shell.tsx` — build compound
4. `patients-data-block.tsx` — build compound
5. `patients-list.tsx` — update all three usages
6. `patients-records.tsx` — update Shell + Block
7. `patients-hub/patients-details.tsx` — update Shell + Block
8. `patients-docs.tsx` — update Shell + Block

Commit per component refactor + one final commit for all caller updates.
