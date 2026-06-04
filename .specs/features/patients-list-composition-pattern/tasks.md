# Tasks: patients-list Composition Pattern Refactor

**Spec:** `.specs/features/patients-list-composition-pattern/spec.md`
**Design:** `.specs/features/patients-list-composition-pattern/design.md`
**Gate command:** `npm run build && npm run lint`

---

## Dependency Graph

```
T01 (MetricCard)  ──┐
T02 (types)       ──┤
T03 (PageShell)   ──┼──→ T05 (patients-list.tsx)  ──┐
T04 (DataBlock)   ──┤                                │
                    ├──→ T06 (patients-records.tsx)  │──→ T09 (final gate)
                    ├──→ T07 (patients-details.tsx)  │
                    └──→ T08 (patients-docs.tsx)   ──┘
```

**Parallel opportunities:**
- `[P1]` T01 + T03 + T04 can run in parallel (no shared files)
- `[P2]` T06 + T07 + T08 can run in parallel after T03 + T04 complete
- T02 runs after T01 (removes type used only there)
- T05 runs after T01 + T02 + T03 + T04 all complete

---

## T01 — Refactor MetricCard to compound component

**Status:** `[ ] pending`
**Parallel group:** P1 (independent)
**Req:** R1
**File:** `src/pages/app/patients/patients-list/components/metric-card.tsx`

**What:**
Replace the flat 7-prop `MetricCard` function with a compound component built from five named subcomponents, connected via React Context for `isLoading` propagation.

**Changes:**
- Add `createContext` + `useContext` import from `react`
- Define `MetricCardContext` with `{ isLoading: boolean }`, default `{ isLoading: false }`
- Remove import of `MetricCardProps` from `patients-list.types`
- Define local interfaces: `MetricCardRootProps`, `MetricCardIconProps`, `MetricCardValueProps`, `MetricCardLabelProps`, `MetricCardTrendProps`
- Move `TREND_ELEMENT` lookup from inside the function to module scope (above all functions)
- Implement five named functions:
  - `MetricCardRoot` — Context.Provider + `<Card>` + `<CardContent className="relative grid grid-cols-[40px_1fr] gap-x-4 gap-y-0.5 items-start px-0">`
  - `MetricCardIcon` — `<div className={cn('flex size-10 shrink-0 items-center justify-center rounded-full row-span-2', bg)}>`
  - `MetricCardValue` — reads context; if `isLoading` → `<Skeleton className="h-7 w-12" />`; else → `<CardTitle className="text-2xl font-bold tabular-nums leading-none">`
  - `MetricCardLabel` — `<CardDescription className="text-xs text-muted-foreground font-medium">`
  - `MetricCardTrend` — `<CardAction>` with direction-driven icon + style from `TREND_ELEMENT[direction]`
- Export via `Object.assign`:
  ```typescript
  export const MetricCard = Object.assign(MetricCardRoot, {
    Icon:  MetricCardIcon,
    Value: MetricCardValue,
    Label: MetricCardLabel,
    Trend: MetricCardTrend,
  })
  ```

**CSS delta (only change to existing classes):**
- `CardContent`: `flex flex-row px-0 gap-4 items-start` → `grid grid-cols-[40px_1fr] gap-x-4 gap-y-0.5 items-start px-0`
- Icon `div`: add `row-span-2`
- All other classes unchanged

**Done when:**
- `MetricCard` export accepts only `isLoading?` and `children`
- `MetricCard.Value` renders `<Skeleton>` when `isLoading=true` without any caller code
- `MetricCard.Trend` renders correctly with `direction="up"`, `"neutral"`, `"down"`
- No TypeScript errors in this file in isolation (`tsc --noEmit` scope)

**Gate:** `npm run build` (may fail until T02 removes the old type — acceptable intermediate state)

---

## T02 — Remove MetricCardProps from patients-list.types.ts

**Status:** `[ ] pending`
**Depends on:** T01
**Req:** R2
**File:** `src/pages/app/patients/patients-list/patients-list.types.ts`

**What:**
Delete the `MetricCardProps` interface. It was the only public type for the old API; after T01 it is unused and its types are internal to `metric-card.tsx`.

**Changes:**
- Delete the `MetricCardProps` interface block (lines 4–12 in current file)
- Remove the `React` namespace reference if it was only used by `MetricCardProps` (check: `icon: React.ReactNode`)
- Confirm the remaining three interfaces are untouched: `StatusPillOption`, `PatientsMetrics`, `PatientsListQueryResult`

**Done when:**
- `MetricCardProps` is not exported from this file
- File has no unused imports
- `npm run build` passes cleanly (T01 + T02 together)

**Gate:** `npm run build`

---

## T03 — Refactor PatientsPageShell to compound component

**Status:** `[ ] pending`
**Parallel group:** P1 (independent)
**Req:** R3
**File:** `src/pages/app/patients/components/patients-page-shell.tsx`

**What:**
Replace the 8-prop `PatientsPageShell` function with a compound component exposing `.Header`, `.Filters`, `.Content`. `PatientsSurface` remains exported unchanged.

**Changes:**
- Remove `PatientsPageShellProps` interface
- Keep `PatientsSurfaceProps` and `PatientsSurface` exactly as-is
- Define new interfaces: `PatientsPageShellRootProps`, `PatientsPageShellHeaderProps`, `PatientsPageShellFiltersProps`, `PatientsPageShellContentProps`
- Implement four named functions:
  - `PatientsPageShellRoot({ children, className })` — `<div className={cn('flex flex-col gap-4', className)}>`
  - `PatientsPageShellHeader({ title, description, icon, children })` — exact same `<header>` markup as current; `children` replaces `headerRight` in the `<div className="shrink-0">` slot; guard: `{children && <div className="shrink-0">{children}</div>}`
  - `PatientsPageShellFilters({ children })` — `<PatientsSurface>{children}</PatientsSurface>`
  - `PatientsPageShellContent({ children, className })` — `<PatientsSurface className={cn('overflow-hidden', className)}>`
- Export via `Object.assign`:
  ```typescript
  export const PatientsPageShell = Object.assign(PatientsPageShellRoot, {
    Header:  PatientsPageShellHeader,
    Filters: PatientsPageShellFilters,
    Content: PatientsPageShellContent,
  })
  export { PatientsSurface }
  ```

**Done when:**
- `PatientsPageShell` root accepts only `children` and `className?`
- `.Header` children slot renders in the right-side `div.shrink-0` position
- `.Content` passes `className` to `PatientsSurface` via `cn('overflow-hidden', className)`
- `PatientsSurface` export is unchanged
- No TypeScript errors in this file in isolation

**Gate:** `npm run build` (callers will fail until T05–T08 — acceptable intermediate state)

---

## T04 — Refactor PatientsDataBlock to compound component

**Status:** `[ ] pending`
**Parallel group:** P1 (independent)
**Req:** R4
**File:** `src/pages/app/patients/components/patients-data-block.tsx`

**What:**
Replace the 9-prop `PatientsDataBlock` function with a compound component exposing `.Header`, `.Toolbar`, `.Content`, `.Footer`.

**Changes:**
- Remove `PatientsDataBlockProps` interface
- Define new interfaces: `PatientsDataBlockRootProps`, `PatientsDataBlockHeaderProps`, `PatientsDataBlockToolbarProps`, `PatientsDataBlockContentProps`, `PatientsDataBlockFooterProps`
- Implement five named functions:
  - `PatientsDataBlockRoot({ children, className })` — `<section className={cn('space-y-4', className)}>`
  - `PatientsDataBlockHeader({ title, description, isLoading, children })` — exact same conditional rendering as current `(title || description || headerActions || isLoading)` guard, translated to `if (!title && !description && !children && !isLoading) return null`; `children` replaces `headerActions` in `<div className="flex items-center gap-2 shrink-0">`
  - `PatientsDataBlockToolbar({ children })` — `<div>{children}</div>`
  - `PatientsDataBlockContent({ children, className })` — `<div className={cn('w-full', className)}>`
  - `PatientsDataBlockFooter({ children })` — `<footer>{children}</footer>`
- Export via `Object.assign`:
  ```typescript
  export const PatientsDataBlock = Object.assign(PatientsDataBlockRoot, {
    Header:  PatientsDataBlockHeader,
    Toolbar: PatientsDataBlockToolbar,
    Content: PatientsDataBlockContent,
    Footer:  PatientsDataBlockFooter,
  })
  ```

**Done when:**
- `PatientsDataBlock` root accepts only `children` and `className?`
- `.Header` with no props and no children renders `null` (matches current conditional)
- `isLoading` on `.Header` shows skeleton for title
- `.Footer` renders inside a `<footer>` tag matching current markup
- No TypeScript errors in this file in isolation

**Gate:** `npm run build` (callers will fail until T05–T08 — acceptable intermediate state)

---

## T05 — Migrate patients-list.tsx to new compound APIs

**Status:** `[ ] pending`
**Depends on:** T01, T02, T03, T04
**Req:** R5
**File:** `src/pages/app/patients/patients-list/patients-list.tsx`

**What:**
Update the root patients-list page to use the new compound APIs for all three refactored components. This is the heaviest caller — it uses `MetricCard × 3`, `PatientsPageShell`, and `PatientsDataBlock`.

**Changes:**

`PatientsPageShell` — replace flat props with subcomponents:
```tsx
// BEFORE
<PatientsPageShell title="..." description="..." icon={...} headerRight={<PageShellHeader ... />}>
  {children}
</PatientsPageShell>

// AFTER
<PatientsPageShell>
  <PatientsPageShell.Header title="..." description="..." icon={...}>
    <PageShellHeader ... />
  </PatientsPageShell.Header>
  <PatientsPageShell.Content>
    {children}
  </PatientsPageShell.Content>
</PatientsPageShell>
```

`PatientsDataBlock` — replace flat props with subcomponents:
```tsx
// BEFORE
<PatientsDataBlock title="..." description={...} headerActions={<PageDataBlockHeader ... />} toolbar={...} footer={...}>
  <PatientsTable ... />
</PatientsDataBlock>

// AFTER
<PatientsDataBlock>
  <PatientsDataBlock.Header title="..." description={...}>
    <PageDataBlockHeader ... />
  </PatientsDataBlock.Header>
  <PatientsDataBlock.Toolbar><PatientsTableFilters .../></PatientsDataBlock.Toolbar>
  <PatientsDataBlock.Content><PatientsTable .../></PatientsDataBlock.Content>
  <PatientsDataBlock.Footer><Pagination .../></PatientsDataBlock.Footer>
</PatientsDataBlock>
```

`MetricCard × 3` — replace flat props with subcomponents:
```tsx
// Card 1 — no trend
<MetricCard isLoading={isLoading}>
  <MetricCard.Icon bg="bg-blue-500/10"><UsersRound className="size-5 text-blue-600" /></MetricCard.Icon>
  <MetricCard.Value>{meta.totalCount}</MetricCard.Value>
  <MetricCard.Label>Total de pacientes</MetricCard.Label>
</MetricCard>

// Card 2 — with trend
<MetricCard isLoading={loadingMetrics}>
  <MetricCard.Icon bg="bg-emerald-500/10"><Activity className="size-5 text-emerald-600" /></MetricCard.Icon>
  <MetricCard.Value>{activeCount}</MetricCard.Value>
  <MetricCard.Label>Ativos</MetricCard.Label>
  <MetricCard.Trend direction="up">24%</MetricCard.Trend>
</MetricCard>

// Card 3 — no trend
<MetricCard isLoading={loadingMetrics}>
  <MetricCard.Icon bg="bg-red-500/10"><Clock className="size-5 text-red-500" /></MetricCard.Icon>
  <MetricCard.Value>{archivedCount}</MetricCard.Value>
  <MetricCard.Label>Arquivados</MetricCard.Label>
</MetricCard>
```

**Done when:**
- File has zero TypeScript errors
- All old prop names (`title=`, `description=`, `icon=`, `headerRight=`, `toolbar=`, `footer=`, `headerActions=`, `iconBg=`, `value=`, `label=`, `sub=`, `subTrend=`) are gone from this file

**Gate:** `npm run build`

---

## T06 — Migrate patients-records.tsx

**Status:** `[ ] pending`
**Parallel group:** P2
**Depends on:** T03, T04
**Req:** R5
**File:** `src/pages/app/patients/patients-records/patients-records.tsx`

**What:**
Migrate `PatientsPageShell` and `PatientsDataBlock` usages. No `headerRight`, no `footer`. Has `contentClassName="p-4"` on shell.

**Changes:**

```tsx
// BEFORE
<PatientsPageShell title="..." description="..." icon={...} contentClassName="p-4">
  <PatientsDataBlock title="..." description="..." toolbar={<PatientsRecordsTableFilters .../>}>
    {/* content */}
  </PatientsDataBlock>
</PatientsPageShell>

// AFTER
<PatientsPageShell>
  <PatientsPageShell.Header title="..." description="..." icon={...} />
  <PatientsPageShell.Content className="p-4">
    <PatientsDataBlock>
      <PatientsDataBlock.Header title="..." description="..." />
      <PatientsDataBlock.Toolbar>
        <PatientsRecordsTableFilters ... />
      </PatientsDataBlock.Toolbar>
      <PatientsDataBlock.Content>
        {/* patient cards */}
      </PatientsDataBlock.Content>
    </PatientsDataBlock>
  </PatientsPageShell.Content>
</PatientsPageShell>
```

**Done when:**
- File has zero TypeScript errors
- Old prop names removed from this file

**Gate:** `npm run build`

---

## T07 — Migrate patients-hub/patients-details.tsx

**Status:** `[ ] pending`
**Parallel group:** P2
**Depends on:** T03, T04
**Req:** R5
**File:** `src/pages/app/patients/patients-hub/patients-details.tsx`

**What:**
Migrate `PatientsPageShell` and `PatientsDataBlock`. Has `headerRight`, a full style override via `contentClassName`, and `PatientsDataBlock` with a custom `className` (no toolbar, no footer).

**Changes:**

```tsx
// BEFORE
<PatientsPageShell
  title="..." description="..." icon={...}
  headerRight={<HubActions />}
  contentClassName="min-w-0 border-0 bg-transparent p-0 shadow-none md:p-0 overflow-hidden"
>
  <PatientsDataBlock
    title="..." description="..."
    className="min-w-0 w-full space-y-6 overflow-hidden rounded-2xl bg-card px-5 py-5 shadow-sm md:px-6 md:py-6"
  >
    {/* tabs */}
  </PatientsDataBlock>
</PatientsPageShell>

// AFTER
<PatientsPageShell>
  <PatientsPageShell.Header title="..." description="..." icon={...}>
    <HubActions />
  </PatientsPageShell.Header>
  <PatientsPageShell.Content className="min-w-0 border-0 bg-transparent p-0 shadow-none md:p-0 overflow-hidden">
    <PatientsDataBlock className="min-w-0 w-full space-y-6 overflow-hidden rounded-2xl bg-card px-5 py-5 shadow-sm md:px-6 md:py-6">
      <PatientsDataBlock.Header title="..." description="..." />
      <PatientsDataBlock.Content>
        {/* tabs */}
      </PatientsDataBlock.Content>
    </PatientsDataBlock>
  </PatientsPageShell.Content>
</PatientsPageShell>
```

**Risk:** `PatientsPageShell.Content` passes `className` to `PatientsSurface` via `cn('overflow-hidden', className)`. The caller overrides include `p-0`, `border-0`, `bg-transparent`, `shadow-none` — confirm these win over the base `PatientsSurface` classes via `tailwind-merge`. If class conflicts arise, check whether `cn()` uses `twMerge` internally (it does via `clsx` + `tailwind-merge`).

**Done when:**
- File has zero TypeScript errors
- Old prop names removed
- All existing className overrides on both components preserved verbatim

**Gate:** `npm run build`

---

## T08 — Migrate patients-docs.tsx

**Status:** `[ ] pending`
**Parallel group:** P2
**Depends on:** T03, T04
**Req:** R5
**File:** `src/pages/app/patients/patients-docs/patients-docs.tsx`

**What:**
Migrate `PatientsPageShell` and `PatientsDataBlock`. Has `headerRight` (variable) and `contentClassName="p-0"` on shell. `PatientsDataBlock` has toolbar but no footer.

**Changes:**

```tsx
// BEFORE
<PatientsPageShell title="..." description="..." icon={...} headerRight={headerRight} contentClassName="p-0">
  ...
  <PatientsDataBlock title="..." description={...} toolbar={<AttachmentsTableFilters .../>}>
    {/* content */}
  </PatientsDataBlock>
</PatientsPageShell>

// AFTER
<PatientsPageShell>
  <PatientsPageShell.Header title="..." description="..." icon={...}>
    {headerRight}
  </PatientsPageShell.Header>
  <PatientsPageShell.Content className="p-0">
    ...
    <PatientsDataBlock>
      <PatientsDataBlock.Header title="..." description={...} />
      <PatientsDataBlock.Toolbar>
        <AttachmentsTableFilters ... />
      </PatientsDataBlock.Toolbar>
      <PatientsDataBlock.Content>
        {/* content */}
      </PatientsDataBlock.Content>
    </PatientsDataBlock>
  </PatientsPageShell.Content>
</PatientsPageShell>
```

**Done when:**
- File has zero TypeScript errors
- Old prop names removed from this file

**Gate:** `npm run build`

---

## T09 — Final gate: build + lint

**Status:** `[ ] pending`
**Depends on:** T05, T06, T07, T08

**What:**
Run the full gate on the complete working tree. All tasks must be complete before this runs.

**Gate:**
```bash
npm run build && npm run lint
```

**Done when:**
- `npm run build` exits 0, zero TypeScript errors, zero Vite errors
- `npm run lint` exits 0, zero ESLint errors or warnings on modified files

**Post-gate checklist (manual):**
- [ ] `/pacientes` — metric cards render with correct icons, values, trend badge; skeleton appears on load
- [ ] `/pacientes` — dark mode: no visual regressions on metric cards, shell header, data block
- [ ] `/prontuarios` — shell + data block render; `contentClassName="p-4"` surface padding visible
- [ ] `/pacientes/:id` — full style override (`border-0 bg-transparent p-0 shadow-none`) on content surface; hub actions in header right slot
- [ ] `/documentos` — shell header right slot; data block toolbar renders

---

## Commit Plan

One commit per component file refactored, one commit for all callers:

```
refactor(patients): convert MetricCard to compound component
refactor(patients): remove MetricCardProps from types
refactor(patients): convert PatientsPageShell to compound component
refactor(patients): convert PatientsDataBlock to compound component
refactor(patients): migrate all callers to compound component APIs
```
