# Design: patients-list Composition Pattern Refactor

## Architecture Overview

Three components are refactored. All follow the same structural pattern. No new files are created — each component stays in its current file.

```
patients/
├── components/
│   ├── patients-page-shell.tsx   ← PatientsPageShell compound (R3)
│   └── patients-data-block.tsx   ← PatientsDataBlock compound (R4)
└── patients-list/
    └── components/
        └── metric-card.tsx       ← MetricCard compound + context (R1)
```

---

## Implementation Pattern: Object.assign

All three compounds use the same pattern. Internal functions are named with the component prefix so React DevTools and stack traces stay readable.

```typescript
function ComponentNameRoot(props: ComponentNameRootProps) { ... }
function ComponentNameSub(props: ComponentNameSubProps) { ... }

export const ComponentName = Object.assign(ComponentNameRoot, {
  Sub: ComponentNameSub,
})
```

**Why Object.assign over namespace exports:**
- Dot-notation at call sites: `<ComponentName.Sub>`
- TypeScript infers the compound union type automatically
- Named inner functions show up in DevTools as `ComponentNameSub`, not anonymous
- All subcomponents tree-shake with the parent since they share the same module

---

## 1. MetricCard

### Layout Problem & Solution

The current layout nests `Value` and `Label` inside a shared `flex-col` div:

```
CardContent [flex-row gap-4]
├── Icon [size-10, shrink-0]
└── div [flex-col gap-0.5]   ← shared wrapper
    ├── CardTitle (value)
    └── CardDescription (label)
```

With flat composition (`Icon`, `Value`, `Label`, `Trend` all as siblings), that wrapper disappears. The solution is to switch the `CardContent` layout from `flex-row` to a **CSS Grid** with two columns — the Icon spans both rows, Value and Label auto-place into their respective cells:

```
CardContent [grid grid-cols-[40px_1fr] gap-x-4 gap-y-0.5]
├── Icon [row-span-2]    col 1, rows 1–2
├── Value                col 2, row 1  (auto-placed)
└── Label                col 2, row 2  (auto-placed)
```

`Trend` is `position: absolute` — it does not participate in grid flow. Visual output is identical to the current flex layout.

**CSS delta (CardContent only):**

| Property | Before | After |
|---|---|---|
| Layout | `flex flex-row gap-4 items-start` | `grid grid-cols-[40px_1fr] gap-x-4 gap-y-0.5 items-start` |

**Icon delta:**

| Property | Before | After |
|---|---|---|
| Row span | — | `row-span-2` |

All other classes on all subcomponents are unchanged.

### Context

`isLoading` propagates from root to `MetricCard.Value` (and optionally `MetricCard.Trend`) via React Context, so callers never conditionally render skeletons.

```typescript
interface MetricCardContextValue {
  isLoading: boolean
}

const MetricCardContext = createContext<MetricCardContextValue>({ isLoading: false })
```

### Type Signatures

```typescript
interface MetricCardRootProps {
  isLoading?: boolean
  children: ReactNode
}

interface MetricCardIconProps {
  bg: string         // Tailwind bg class, e.g. "bg-blue-500/10"
  children: ReactNode
}

interface MetricCardValueProps {
  children: ReactNode
}

interface MetricCardLabelProps {
  children: ReactNode
}

interface MetricCardTrendProps {
  direction: 'up' | 'neutral' | 'down'
  children: ReactNode
}
```

`MetricCardProps` is removed from `patients-list.types.ts` — all types are now internal to `metric-card.tsx`.

### Component Tree

```typescript
function MetricCardRoot({ isLoading = false, children }: MetricCardRootProps) {
  return (
    <MetricCardContext.Provider value={{ isLoading }}>
      <Card className="rounded-md border bg-card px-5 py-4 shadow-sm">
        <CardContent className="relative grid grid-cols-[40px_1fr] gap-x-4 gap-y-0.5 items-start px-0">
          {children}
        </CardContent>
      </Card>
    </MetricCardContext.Provider>
  )
}

function MetricCardIcon({ bg, children }: MetricCardIconProps) {
  return (
    <div className={cn('flex size-10 shrink-0 items-center justify-center rounded-full row-span-2', bg)}>
      {children}
    </div>
  )
}

function MetricCardValue({ children }: MetricCardValueProps) {
  const { isLoading } = useContext(MetricCardContext)
  if (isLoading) return <Skeleton className="h-7 w-12" />
  return (
    <CardTitle className="text-2xl font-bold tabular-nums leading-none">{children}</CardTitle>
  )
}

function MetricCardLabel({ children }: MetricCardLabelProps) {
  return (
    <CardDescription className="text-xs text-muted-foreground font-medium">{children}</CardDescription>
  )
}

// TREND_ELEMENT map stays as-is — moved from inline to module scope
const TREND_ELEMENT = { ... } // unchanged

function MetricCardTrend({ direction, children }: MetricCardTrendProps) {
  return (
    <CardAction className={`absolute -top-1 -right-2 text-xs font-medium flex items-center gap-1.5 rounded-4xl px-1 py-0.5 ${TREND_ELEMENT[direction].style}`}>
      {TREND_ELEMENT[direction].element}
      <span>{children}</span>
    </CardAction>
  )
}

export const MetricCard = Object.assign(MetricCardRoot, {
  Icon:  MetricCardIcon,
  Value: MetricCardValue,
  Label: MetricCardLabel,
  Trend: MetricCardTrend,
})
```

### Usage at call site (`patients-list.tsx`)

```tsx
// No trend
<MetricCard isLoading={isLoading}>
  <MetricCard.Icon bg="bg-blue-500/10">
    <UsersRound className="size-5 text-blue-600" />
  </MetricCard.Icon>
  <MetricCard.Value>{meta.totalCount}</MetricCard.Value>
  <MetricCard.Label>Total de pacientes</MetricCard.Label>
</MetricCard>

// With trend
<MetricCard isLoading={loadingMetrics}>
  <MetricCard.Icon bg="bg-emerald-500/10">
    <Activity className="size-5 text-emerald-600" />
  </MetricCard.Icon>
  <MetricCard.Value>{activeCount}</MetricCard.Value>
  <MetricCard.Label>Ativos</MetricCard.Label>
  <MetricCard.Trend direction="up">24%</MetricCard.Trend>
</MetricCard>

// Archived (no trend, no sub)
<MetricCard isLoading={loadingMetrics}>
  <MetricCard.Icon bg="bg-red-500/10">
    <Clock className="size-5 text-red-500" />
  </MetricCard.Icon>
  <MetricCard.Value>{archivedCount}</MetricCard.Value>
  <MetricCard.Label>Arquivados</MetricCard.Label>
</MetricCard>
```

---

## 2. PatientsPageShell

### Structure

No layout changes. The existing DOM structure is preserved exactly — only how props reach each section changes.

```
PatientsPageShellRoot [div flex-col gap-4]
├── PatientsPageShell.Header [header flex-col lg:flex-row justify-between border-l-4]
│   ├── div.space-y-1 → title (h1 + icon) + description (p)
│   └── div.shrink-0  → children (actions slot)
├── PatientsPageShell.Filters [PatientsSurface]  ← optional
│   └── children
└── PatientsPageShell.Content [PatientsSurface overflow-hidden]
    └── children
```

### Type Signatures

```typescript
interface PatientsPageShellRootProps {
  children: ReactNode
  className?: string
}

interface PatientsPageShellHeaderProps {
  title?: ReactNode
  description?: ReactNode
  icon?: ReactNode
  children?: ReactNode   // actions area — replaces headerRight
}

interface PatientsPageShellFiltersProps {
  children: ReactNode
}

interface PatientsPageShellContentProps {
  children: ReactNode
  className?: string
}
```

### Component Tree

```typescript
function PatientsPageShellRoot({ children, className }: PatientsPageShellRootProps) {
  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {children}
    </div>
  )
}

function PatientsPageShellHeader({ title, description, icon, children }: PatientsPageShellHeaderProps) {
  return (
    <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-l-4 border-primary pl-5 py-2">
      <div className="space-y-1">
        {title && (
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-3">
            {icon}
            <span>{title}</span>
          </h1>
        )}
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      {children && <div className="shrink-0">{children}</div>}
    </header>
  )
}

function PatientsPageShellFilters({ children }: PatientsPageShellFiltersProps) {
  return <PatientsSurface>{children}</PatientsSurface>
}

function PatientsPageShellContent({ children, className }: PatientsPageShellContentProps) {
  return (
    <PatientsSurface className={cn('overflow-hidden', className)}>
      {children}
    </PatientsSurface>
  )
}

export const PatientsPageShell = Object.assign(PatientsPageShellRoot, {
  Header:  PatientsPageShellHeader,
  Filters: PatientsPageShellFilters,
  Content: PatientsPageShellContent,
})

export { PatientsSurface }  // unchanged
```

### Usage at call sites

**patients-list.tsx** (has header actions):
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
    {/* content */}
  </PatientsPageShell.Content>
</PatientsPageShell>
```

**patients-records.tsx** (no actions, has contentClassName):
```tsx
<PatientsPageShell>
  <PatientsPageShell.Header
    title="Prontuarios Eletronicos"
    description="..."
    icon={<ClipboardList className="size-6 text-blue-600" />}
  />
  <PatientsPageShell.Content className="p-4">
    {/* content */}
  </PatientsPageShell.Content>
</PatientsPageShell>
```

**patients-hub/patients-details.tsx** (has actions + contentClassName with full class override):
```tsx
<PatientsPageShell>
  <PatientsPageShell.Header
    title="Prontuário completo do Paciente"
    description="..."
    icon={<FileSearch className="size-5 text-blue-600" />}
  >
    <HubActions />
  </PatientsPageShell.Header>
  <PatientsPageShell.Content className="min-w-0 border-0 bg-transparent p-0 shadow-none md:p-0 overflow-hidden">
    {/* content */}
  </PatientsPageShell.Content>
</PatientsPageShell>
```

> **Note on `contentClassName`:** The current `patients-details.tsx` passes `contentClassName` to override all surface styles (`border-0 bg-transparent p-0 shadow-none`). In the compound API, this becomes `className` on `PatientsPageShell.Content`, passed to `PatientsSurface` via `cn('overflow-hidden', className)`. The override classes from the caller will take precedence over `overflow-hidden` through Tailwind's merge behavior — verify with `tailwind-merge` that class conflicts resolve correctly. If not, add `twMerge` import in `PatientsSurface`.

**patients-docs.tsx** (has headerRight + contentClassName):
```tsx
<PatientsPageShell>
  <PatientsPageShell.Header
    title="Gestão de Documentos"
    description="..."
    icon={<FolderOpen className="size-6 text-blue-600" />}
  >
    {headerRight}
  </PatientsPageShell.Header>
  <PatientsPageShell.Content className="p-0">
    {/* content */}
  </PatientsPageShell.Content>
</PatientsPageShell>
```

---

## 3. PatientsDataBlock

### Structure

No layout changes. DOM structure preserved exactly.

```
PatientsDataBlockRoot [section space-y-4]
├── PatientsDataBlock.Header [header flex items-start justify-between]  ← optional
│   ├── div.space-y-1 → title (h2 | Skeleton) + description (p)
│   └── div.flex.gap-2 → children (actions slot)
├── PatientsDataBlock.Toolbar [div]  ← optional
│   └── children
├── PatientsDataBlock.Content [div w-full]
│   └── children
└── PatientsDataBlock.Footer [footer]  ← optional
    └── children
```

### Type Signatures

```typescript
interface PatientsDataBlockRootProps {
  children: ReactNode
  className?: string
}

interface PatientsDataBlockHeaderProps {
  title?: ReactNode
  description?: ReactNode
  isLoading?: boolean
  children?: ReactNode   // actions — replaces headerActions
}

interface PatientsDataBlockToolbarProps {
  children: ReactNode
}

interface PatientsDataBlockContentProps {
  children: ReactNode
  className?: string
}

interface PatientsDataBlockFooterProps {
  children: ReactNode
}
```

### Component Tree

```typescript
function PatientsDataBlockRoot({ children, className }: PatientsDataBlockRootProps) {
  return <section className={cn('space-y-4', className)}>{children}</section>
}

function PatientsDataBlockHeader({ title, description, isLoading, children }: PatientsDataBlockHeaderProps) {
  if (!title && !description && !children && !isLoading) return null
  return (
    <header className="flex items-start justify-between gap-4">
      <div className="space-y-1 min-w-0">
        {isLoading ? (
          <Skeleton className="h-5 w-32" />
        ) : (
          title && <h2 className="text-base font-semibold tracking-tight">{title}</h2>
        )}
        {description && !isLoading && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {children && (
        <div className="flex items-center gap-2 shrink-0">{children}</div>
      )}
    </header>
  )
}

function PatientsDataBlockToolbar({ children }: PatientsDataBlockToolbarProps) {
  return <div>{children}</div>
}

function PatientsDataBlockContent({ children, className }: PatientsDataBlockContentProps) {
  return <div className={cn('w-full', className)}>{children}</div>
}

function PatientsDataBlockFooter({ children }: PatientsDataBlockFooterProps) {
  return <footer>{children}</footer>
}

export const PatientsDataBlock = Object.assign(PatientsDataBlockRoot, {
  Header:  PatientsDataBlockHeader,
  Toolbar: PatientsDataBlockToolbar,
  Content: PatientsDataBlockContent,
  Footer:  PatientsDataBlockFooter,
})
```

### Usage at call sites

**patients-list.tsx** (full usage — all four subcomponents):
```tsx
<PatientsDataBlock>
  <PatientsDataBlock.Header
    title="Lista de pacientes"
    description={formatPatientsShowing(totalPatients, meta.totalCount)}
  >
    <PageDataBlockHeader
      primaryAction={() => {}}
      secondaryAction={() => {}}
    />
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

**patients-records.tsx** (header + toolbar + content, no footer):
```tsx
<PatientsDataBlock>
  <PatientsDataBlock.Header
    title="Pacientes com prontuario"
    description="Filtre por status, genero, cadastro e volume de sessoes."
  >
    {/* no headerActions in current code */}
  </PatientsDataBlock.Header>
  <PatientsDataBlock.Toolbar>
    <PatientsRecordsTableFilters ... />
  </PatientsDataBlock.Toolbar>
  <PatientsDataBlock.Content>
    {/* patient cards */}
  </PatientsDataBlock.Content>
</PatientsDataBlock>
```

**patients-hub/patients-details.tsx** (header + content, no toolbar or footer):
```tsx
<PatientsDataBlock className="min-w-0 w-full space-y-6 overflow-hidden rounded-2xl bg-card px-5 py-5 shadow-sm md:px-6 md:py-6">
  <PatientsDataBlock.Header
    title="Prontuario e acompanhamento"
    description="Navegue entre dados cadastrais, anamnese, historico, arquivos e resumo clinico."
  />
  <PatientsDataBlock.Content>
    {/* tabs content */}
  </PatientsDataBlock.Content>
</PatientsDataBlock>
```

**patients-docs.tsx** (header + toolbar + content, no footer):
```tsx
<PatientsDataBlock>
  <PatientsDataBlock.Header
    title="Documentos anexados"
    description={`Mostrando ... de ... documentos`}
  />
  <PatientsDataBlock.Toolbar>
    <AttachmentsTableFilters ... />
  </PatientsDataBlock.Toolbar>
  <PatientsDataBlock.Content>
    {/* attachments table */}
  </PatientsDataBlock.Content>
</PatientsDataBlock>
```

---

## Risk Notes

| Risk | Mitigation |
|---|---|
| `cn()` vs `twMerge()` in `PatientsPageShell.Content` — caller overrides may not win over base classes | Test `patients-details.tsx` contentClassName in browser; apply `twMerge` if conflicts appear |
| CSS Grid in MetricCard — Tailwind v4 grid classes must be available | `grid-cols-[40px_1fr]` uses arbitrary value syntax, supported in Tailwind v4 |
| `PatientsDataBlockHeader` null guard — omitting the subcomponent vs rendering it empty | Guard via `if (!title && !description && !children && !isLoading) return null` to match current conditional rendering |
| `patients-records.tsx` PatientsDataBlock usage has no `headerActions` in current code | Omit `PatientsDataBlock.Header`'s children rather than passing an empty fragment |

---

## Verification Plan

1. `npm run build` — zero TypeScript + Vite errors
2. `npm run lint` — zero ESLint errors
3. Visual diff (browser):
   - `/pacientes` — metric cards, table, filters, pagination
   - `/prontuarios` — records shell + data block
   - `/pacientes/:id` — hub shell + data block with full class override
   - `/documentos` — docs shell + data block
4. MetricCard skeleton: navigate to page before data loads, confirm skeleton renders for Value
5. Dark mode: toggle theme on each page, confirm no visual regressions
