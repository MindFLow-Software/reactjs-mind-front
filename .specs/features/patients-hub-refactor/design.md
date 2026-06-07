# Patients Hub Architecture Refactor — Design

**Spec**: `.specs/features/patients-hub-refactor/spec.md`
**Status**: Draft

---

## Architecture Overview

The refactor moves from a wide, flat feature (one 316-line orchestrator + 22 colocated files with mixed concerns) to a layered architecture where each file has a single responsibility:

```
                         patients-details.tsx (≤200 lines)
                               │
            ┌──────────────────┼──────────────────┐
            │                  │                  │
   use-patient-details   use-patient-queue   PatientDetailsShell
            │                                     │
    ┌───────┴──────┐          ┌───────────────────┼───────────────────┐
    │              │          │                   │                   │
  patient        meta      Header             Content             (tab switch)
  data           page                                               │
                                           ┌───────────────────────────────────────┐
                                           │           │          │               │
                                    AnamnesisForm  PatientFilesTab  PatientSessionsTimeline  PatientResumeTab
                                           │           │          │
                                  use-anamnesis- use-patient-  use-sessions-
                                    editor        files        timeline
                                           │
                                    ┌──────┴──────┐
                                    │             │
                               anamnesis      anamnesis-utils.ts
                               -types.ts      (pure transforms)
```

**Data flow:** API → React Query → domain hook → component props / `useFormContext`. No prop drilling past one level. No business logic in JSX.

---

## Code Reuse Analysis

### Existing Utilities to Leverage

| Asset | Location | Used by |
|---|---|---|
| `formatCPF` | `src/utils/formatCPF.ts` | `patient-info.tsx` (remove inline copy) |
| `formatPhone` | `src/utils/formatPhone.ts` | `patient-info.tsx` (remove inline copy) |
| `cn()` | `src/lib/utils.ts` | All components, conditional classes |
| `useApiMutation` | `src/hooks/use-api-mutation.ts` | `use-patient-files.ts` for delete mutation |
| `AttachmentPatientItem` | `src/types/attachment.ts` | `use-patient-files.ts`, `file-card.tsx` |
| `Ipatient` / `PatientDetailsData` | `src/types/patient.ts` | `use-patient-details.ts` |
| `GetPatientDetailsResponse`, `SessionItem` | `src/api/patients/get-patient-details.ts` | `use-patient-details.ts`, timeline hook |
| `AnamnesisData` | `src/api/patients/anamnesis.ts` | `use-anamnesis-editor.ts` |
| `LucideIcon` | `lucide-react` | `metric-card.tsx` icon prop |
| `useHeaderStore` | `src/hooks/use-header-store.ts` | `use-patient-details.ts` |
| `toast` | `sonner` | All hooks that show notifications |
| `PaginationMeta` | `src/types/pagination.ts` | `use-sessions-timeline.ts` |

### Integration Points

| System | Connection |
|---|---|
| `getPatientDetails` API | Stays as-is; wrapped by `use-patient-details` hook |
| `getAnamnesis` / `saveAnamnesis` | Wrapped by `use-anamnesis-editor` |
| `getPatientAttachments` / `deleteAttachment` | Wrapped by `use-patient-files` |
| `sessionStorage` queue | Encapsulated entirely in `use-patient-queue` |
| `localStorage` anamnesis draft | Encapsulated entirely in `use-anamnesis-editor` |
| React Query cache | Query keys standardized to `['patient-hub', id, subKey]` |

---

## Folder Structure — Before → After

```
BEFORE                                    AFTER
──────────────────────────────────────    ──────────────────────────────────────
patients-hub/                             patients-hub/
  patients-details.tsx (316 lines)          patients-details.tsx  (≤200 lines)
  components/                               constants.ts          ← NEW
    patient-Info.tsx          ← wrong       helpers.ts            ← NEW
    patient-details-header.tsx              hooks/                ← NEW DIR
    patient-resume-tab.tsx                    use-patient-details.ts
    metric-card.tsx                           use-patient-queue.ts
    export-pdf-button.tsx                     use-anamnesis-editor.ts
    loading.tsx                               use-patient-files.ts
    anamnesis/                                use-sessions-timeline.ts
      anamnesis-form.tsx (313 lines)          use-pdf-export.ts
      anamnesis-types.ts                    components/
      anamnesis-utils.ts                      patient-details-shell.tsx ← NEW
      anamnesis-header.tsx                    patient-details-shell.css ← NEW
      anamnesis-editor-block.tsx              patient-info.tsx      ← RENAMED
      anamnesis-navigation.tsx                patient-info.css      ← NEW
      anamnesis-toolbar.tsx                   patient-details-header.tsx
      anamnesis-skeleton.tsx                  patient-details-header.css ← NEW
    files/                                    patient-resume-tab.tsx
      patient-files-tab.tsx                   patient-resume-tab.css ← NEW
      file-card.tsx                           metric-card.tsx
      file-upload-zone.tsx                    metric-card.css       ← NEW
      file-type-filter.tsx                    export-pdf-button.tsx
      simple-preview-modal.tsx                export-pdf-button.css ← NEW
    timeline/                                 loading.tsx
      patient-sessions-timeline.tsx           loading.css           ← NEW
      sessions-pagination.tsx                 anamnesis/
                                                anamnesis-form.tsx  (≤200 lines)
                                                anamnesis-form.css  ← NEW
                                                anamnesis-types.ts
                                                anamnesis-utils.ts
                                                anamnesis-header.tsx
                                                anamnesis-header.css ← NEW
                                                anamnesis-editor-block.tsx
                                                anamnesis-editor-block.css ← NEW
                                                anamnesis-navigation.tsx
                                                anamnesis-navigation.css ← NEW
                                                anamnesis-toolbar.tsx
                                                anamnesis-toolbar.css ← NEW
                                                anamnesis-skeleton.tsx
                                              files/
                                                patient-files-tab.tsx
                                                patient-files-tab.css ← NEW
                                                file-card.tsx
                                                file-card.css       ← NEW
                                                file-upload-zone.tsx
                                                file-upload-zone.css ← NEW
                                                file-type-filter.tsx
                                                file-type-filter.css ← NEW
                                                simple-preview-modal.tsx
                                                simple-preview-modal.css ← NEW
                                              timeline/
                                                patient-sessions-timeline.tsx
                                                patient-sessions-timeline.css ← NEW
                                                sessions-pagination.tsx
                                                sessions-pagination.css ← NEW
```

**Net change:** +1 renamed file, +24 new CSS files, +6 new hook files, +2 new files (`constants.ts`, `helpers.ts`), +1 new component (`patient-details-shell.tsx`).

---

## Area 1: Orchestrator Layer

### `patients-details.tsx` — After

The current file manages tab state, queue parsing, header sync, pagination, and data fetching in one place. After refactoring it becomes a composition of hooks with a switch-based tab render:

```tsx
// patients-details.tsx — skeleton after refactor
export function PatientsDetails() {
  const { id: patientId } = useParams<{ id: string }>()

  const { patient, meta, isLoading, pageIndex, setPageIndex } =
    usePatientDetails(patientId!)
  const { hasPrev, hasNext, navigatePrev, navigateNext } =
    usePatientQueue(patientId!)

  const [currentTab, setCurrentTab] = useState<TabId>('clinical')

  if (isLoading) return <Loading />

  return (
    <PatientDetailsShell>
      <PatientDetailsShell.Header>
        <PatientDetailsHeader
          patient={patient!}
          hasPrev={hasPrev}
          hasNext={hasNext}
          onPrev={navigatePrev}
          onNext={navigateNext}
        />
      </PatientDetailsShell.Header>

      <PatientDetailsShell.Content>
        <Tabs value={currentTab} onValueChange={(v) => setCurrentTab(v as TabId)}>
          <TabsList>...</TabsList>
          <TabsContent>{renderTab(currentTab, { patient, meta, pageIndex, setPageIndex, patientId })}</TabsContent>
        </Tabs>
      </PatientDetailsShell.Content>
    </PatientDetailsShell>
  )
}

function renderTab(tab: TabId, ctx: TabContext) {
  switch (tab) {
    case 'clinical':   return <PatientInfo patient={ctx.patient!} />
    case 'anamnesis':  return <AnamnesisForm patientId={ctx.patientId} />
    case 'timeline':   return <PatientSessionsTimeline patientId={ctx.patientId} pageIndex={ctx.pageIndex} onPageChange={ctx.setPageIndex} meta={ctx.meta} />
    case 'files':      return <PatientFilesTab patientId={ctx.patientId} />
    case 'resume':     return <PatientResumeTab patient={ctx.patient!} />
  }
}
```

`TabId = 'clinical' | 'anamnesis' | 'timeline' | 'files' | 'resume'` goes in `constants.ts`.

### `patient-details-shell.tsx` — New

Namespace-composed shell wrapping the two layout regions. Mirrors the pattern from `PatientsDataBlock` in patients-list:

```tsx
function PatientDetailsShell({ children }: { children: ReactNode }) {
  return <div className="ph-shell">{children}</div>
}
PatientDetailsShell.Header  = function Header({ children }: { children: ReactNode }) { ... }
PatientDetailsShell.Content = function Content({ children }: { children: ReactNode }) { ... }
```

---

## Area 2: Hook Architecture

### `hooks/use-patient-details.ts`

Wraps `useQuery` for patient data + syncs header store. Eliminates both effects from `patients-details.tsx`.

```typescript
interface UsePatientDetailsOptions {
  pageIndex: number
}

interface UsePatientDetailsReturn {
  patient: GetPatientDetailsResponse['patient'] | null
  meta: GetPatientDetailsResponse['meta'] | null
  isLoading: boolean
  pageIndex: number
  setPageIndex: Dispatch<SetStateAction<number>>
}

export function usePatientDetails(
  patientId: string,
  options?: UsePatientDetailsOptions,
): UsePatientDetailsReturn
```

Internals: `useQuery(['patient-hub', patientId, 'details', pageIndex])`, `useHeaderStore` sync in a `useEffect`, `useState` for `pageIndex`.

### `hooks/use-patient-queue.ts`

Encapsulates all `sessionStorage` reads and patient navigation. Currently 40+ lines spread across effects and state in `patients-details.tsx`.

```typescript
interface UsePatientQueueReturn {
  queue: string[]
  currentIndex: number
  hasPrev: boolean
  hasNext: boolean
  navigatePrev: () => void
  navigateNext: () => void
}

export function usePatientQueue(currentPatientId: string): UsePatientQueueReturn
```

Internals: reads `sessionStorage.getItem('active_patient_queue')` and `active_patient_queue_source` once on mount via `useMemo`. Navigation calls `useNavigate`. `navigatePrev` and `navigateNext` are `useCallback`-wrapped.

### `hooks/use-anamnesis-editor.ts`

Absorbs all 7 `useState` calls, both `useEffect` bodies, the `useMutation`, and all `localStorage` access from `anamnesis-form.tsx`.

```typescript
interface UseAnamnesisEditorOptions {
  patientId: string
}

interface UseAnamnesisEditorReturn {
  // state
  blocks: AnamnesisBlock[]
  activeBlockId: string | null
  hasLocalDraft: boolean
  hydrated: boolean
  isPending: boolean
  copied: boolean
  isExporting: boolean
  // handlers
  setActiveBlockId: (id: string | null) => void
  updateBlock: (id: string, content: string) => void
  addBlock: () => void
  deleteBlock: (id: string) => void
  discardDraft: () => void
  copyToClipboard: () => Promise<void>
  exportToPdf: () => Promise<void>
}

export function useAnamnesisEditor(
  options: UseAnamnesisEditorOptions,
): UseAnamnesisEditorReturn
```

`exportToPdf` and `copyToClipboard` delegate to `use-pdf-export.ts`.

All handlers (`setActiveBlockId`, `updateBlock`, `addBlock`, `deleteBlock`, `discardDraft`, `copyToClipboard`, `exportToPdf`) are `useCallback`-wrapped.

The auto-save `useEffect` and draft-recovery `useEffect` live entirely in this hook. `anamnesis-form.tsx` sees none of them.

### `hooks/use-patient-files.ts`

Absorbs `useState` for `typeFilter` and `previewFile`, the `useQuery`, and the `useMutation` from `patient-files-tab.tsx`. Sorting and count derivation (`useMemo`) move here too.

```typescript
interface UsePatientFilesReturn {
  attachments: AttachmentPatientItem[]
  filtered: AttachmentPatientItem[]
  counts: Record<FileTypeFilter, number>
  typeFilter: FileTypeFilter
  previewFile: AttachmentPatientItem | null
  isLoading: boolean
  isDeleting: boolean
  setTypeFilter: (f: FileTypeFilter) => void
  openPreview: (file: AttachmentPatientItem) => void
  closePreview: () => void
  handleDelete: (attachmentId: string) => void
}

export function usePatientFiles(patientId: string): UsePatientFilesReturn
```

`setTypeFilter`, `openPreview`, `closePreview`, `handleDelete` are `useCallback`-wrapped.
Query key: `['patient-hub', patientId, 'attachments']`.

### `hooks/use-sessions-timeline.ts`

Absorbs search, status filter, and pagination state from `patient-sessions-timeline.tsx`. PDF export delegates to `use-pdf-export.ts`.

```typescript
interface UseSessionsTimelineReturn {
  sessions: SessionItem[]
  meta: GetPatientDetailsResponse['meta'] | null
  search: string
  statusFilter: string
  isLoading: boolean
  isExporting: boolean
  setSearch: (q: string) => void
  setStatusFilter: (s: string) => void
  exportToPdf: () => Promise<void>
}

export function useSessionsTimeline(
  patientId: string,
  pageIndex: number,
  onPageChange: (page: number) => void,
): UseSessionsTimelineReturn
```

`setSearch`, `setStatusFilter`, `exportToPdf` are `useCallback`-wrapped.

### `hooks/use-pdf-export.ts`

Extracts the `@react-pdf/renderer` rendering logic duplicated across `anamnesis-form.tsx`, `patient-sessions-timeline.tsx`, and `export-pdf-button.tsx` into a single hook.

```typescript
interface UsePdfExportOptions {
  filename: string
}

interface UsePdfExportReturn {
  isExporting: boolean
  exportToPdf: (document: ReactElement) => Promise<void>
}

export function usePdfExport(options: UsePdfExportOptions): UsePdfExportReturn
```

Internally manages `isExporting` state and calls `pdf(document).toBlob()` → triggers browser download. `exportToPdf` is `useCallback`-wrapped.

---

## Area 3: TypeScript Safety

### `metric-card.tsx` — icon prop

```typescript
// Before
icon?: any

// After
import type { LucideIcon } from 'lucide-react'
icon?: LucideIcon
```

### `export-pdf-button.tsx` — session prop

```typescript
// Before
session: any

// After
import type { SessionItem } from '@/api/patients/get-patient-details'
session: SessionItem
```

### `patient-sessions-timeline.tsx` — local Session interface

Remove the locally-defined `Session` interface. Import `SessionItem` directly from `@/api/patients/get-patient-details`. No `src/types/` change needed — `SessionItem` is already the canonical export from the API layer and is not redefined elsewhere.

### Ripple check

After all `any` removals, run `pnpm tsc --noEmit` to confirm zero errors. TypeScript will catch any missed spots.

---

## Area 4: Naming and Folder Conventions

### File rename

`patient-Info.tsx` → `patient-info.tsx`. One file rename + update every import (expected: `patients-details.tsx` only).

### `constants.ts` — feature-level constants

```typescript
// patients-hub/constants.ts
export const PATIENT_QUEUE_STORAGE_KEY = 'active_patient_queue' as const
export const PATIENT_QUEUE_SOURCE_KEY = 'active_patient_queue_source' as const
export const ANAMNESIS_DRAFT_KEY_PREFIX = 'anamnesis-draft:' as const
export const PREVIEW_FALLBACK_ORIGIN = 'http://localhost:8080' as const

export type TabId = 'clinical' | 'anamnesis' | 'timeline' | 'files' | 'resume'

export const TAB_IDS = ['clinical', 'anamnesis', 'timeline', 'files', 'resume'] as const
```

Constants used only in a single file (e.g., `EMPTY_LABEL` in `patient-files-tab.tsx`) stay in that file.

### `helpers.ts` — pure shared functions

```typescript
// patients-hub/helpers.ts

/** Count words in a string. Used by anamnesis-form and anamnesis-editor-block. */
export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length
}
```

If, during implementation, additional helpers are shared across two or more files, add them here. One-off helpers stay in their source file.

---

## Area 5: Feature CSS

Each `.tsx` component gets a co-located `.css` file. Only extract styles where a class name is reused or where raw Tailwind becomes a long unreadable string. Generic single-token classes (`flex`, `gap-4`, `mt-2`) stay in JSX.

**Naming convention:**
- Root-level components: `ph-` prefix (`ph-shell`, `ph-shell__header`)
- Anamnesis subsystem: `ph-anamnesis-` prefix
- Files subsystem: `ph-files-` prefix
- Timeline subsystem: `ph-timeline-` prefix

Example for `patient-details-shell.css`:
```css
.ph-shell {
  display: grid;
  grid-template-rows: auto 1fr;
  min-height: 100%;
}

.ph-shell__header {
  @apply sticky top-0 z-10 bg-background border-b border-border;
}
```

CSS files are empty stubs when no styles need extraction — the import still lives in the `.tsx` file to satisfy the convention, and styles are added during implementation as needed.

---

## Area 6: Code Deduplication

### `patient-info.tsx` — formatCPF / formatPhone

```typescript
// Before (inline in patient-Info.tsx)
function formatCPF(cpf: string) { ... }
function formatPhone(phone: string) { ... }

// After
import { formatCPF } from '@/utils/formatCPF'
import { formatPhone } from '@/utils/formatPhone'
```

### PDF export consolidation

Current locations: `anamnesis-form.tsx` (~30 lines), `patient-sessions-timeline.tsx` (~30 lines), `export-pdf-button.tsx` (~40 lines). All three use `@react-pdf/renderer`.

After: All three call `usePdfExport({ filename })` from `hooks/use-pdf-export.ts`.

`export-pdf-button.tsx` becomes a thin wrapper that accepts a `ReactElement` (the PDF document) and a `filename`, delegating rendering entirely to the hook.

### Word count deduplication

`countWords` moves to `helpers.ts`. Both `anamnesis-form.tsx` and `anamnesis-editor-block.tsx` import it from there.

After `useAnamnesisEditor` absorbs the anamnesis-form concern, word count may only remain in `anamnesis-editor-block.tsx` and `anamnesis-navigation.tsx`. If only one consumer remains, the function stays in that file — not in `helpers.ts`.

### `BACKEND_FALLBACK_URL` constant

```typescript
// Before (simple-preview-modal.tsx line 16)
const BACKEND_FALLBACK_URL = 'http://localhost:8080'

// After (simple-preview-modal.tsx)
import { PREVIEW_FALLBACK_ORIGIN } from '../../constants'
```

`PREVIEW_FALLBACK_ORIGIN` is defined in `constants.ts`.

---

## Area 7: Anamnesis Subsystem

### `anamnesis-form.tsx` — After (skeleton)

```tsx
export function AnamnesisForm({ patientId }: { patientId: string }) {
  const editor = useAnamnesisEditor({ patientId })

  if (!editor.hydrated) return <AnamnesisSkeleton />

  return (
    <div className="ph-anamnesis-form">
      <AnamnesisHeader
        hasLocalDraft={editor.hasLocalDraft}
        isPending={editor.isPending}
        copied={editor.copied}
        isExporting={editor.isExporting}
        onCopy={editor.copyToClipboard}
        onExport={editor.exportToPdf}
        onDiscard={editor.discardDraft}
      />

      <div className="ph-anamnesis-form__body">
        <AnamnesisNavigation
          blocks={editor.blocks}
          activeBlockId={editor.activeBlockId}
          onSelectBlock={editor.setActiveBlockId}
        />

        <div className="ph-anamnesis-form__editor">
          <AnamnesisToolbar
            activeBlockId={editor.activeBlockId}
            onFormatBlock={editor.updateBlock}
          />
          {editor.blocks.map((block) => (
            <AnamnesisEditorBlock
              key={block.id}
              block={block}
              isActive={block.id === editor.activeBlockId}
              onFocus={editor.setActiveBlockId}
              onChange={editor.updateBlock}
              onDelete={editor.deleteBlock}
            />
          ))}
          <Button onClick={editor.addBlock}>+ Adicionar bloco</Button>
        </div>
      </div>
    </div>
  )
}
```

No `useEffect`, no `localStorage`, no `useMutation`, no `useQuery` in the component file.

### `anamnesis-utils.ts` — Verify purity

Current functions: `normalizeSingleEditorContent`, `removeLeadingHeading`, `createBlock`, `parseMarkdownBlocks`, `buildInitialBlocks`, `normalizeBlocks`, `buildContentFromBlocks`, `toApiData` — all appear to be pure transforms with no side effects. File needs no structural change; the purity constraint is already met. Only needs to be verified during implementation.

### `anamnesis-types.ts` — Stays feature-local

`AnamnesisBlock`, `SerializedBlock`, `SectionAnchor`, `AnamnesisDraft` are only used within the anamnesis subsystem. No other feature imports from this file. They stay in `anamnesis-types.ts`.

---

## Area 8: React Query Conformance

### Query key standardization

| Current key | Standardized key |
|---|---|
| `['anamnesis', patientId]` | `['patient-hub', patientId, 'anamnesis']` |
| `['patient-attachments', patientId]` | `['patient-hub', patientId, 'attachments']` |
| `['patient-details', patientId, pageIndex]` | `['patient-hub', patientId, 'details', pageIndex]` |

All three keys are encapsulated inside their respective hooks, so call sites don't change.

### Mutation invalidation

After `saveAnamnesis` succeeds:
```typescript
await Promise.all([
  queryClient.invalidateQueries({ queryKey: ['patient-hub', patientId, 'anamnesis'] }),
])
```

After `deleteAttachment` succeeds:
```typescript
await Promise.all([
  queryClient.invalidateQueries({ queryKey: ['patient-hub', patientId, 'attachments'] }),
])
```

### Combined loading state

```typescript
// use-patient-files.ts
const isDeleting = deleteMutation.isPending
```

Single source; never duplicated across consumer components.

---

## Area 9: Performance Guardrails (P3)

Applied last, after structure is stable.

| Component | Change |
|---|---|
| `AnamnesisEditorBlock` | Wrap with `React.memo()` |
| `FileCard` | Wrap with `React.memo()` |
| `SessionsPagination` | Wrap with `React.memo()` |
| `AnamnesisNavigation` | Wrap with `React.memo()` (receives stable block array) |

Handlers passed to memoized components must be `useCallback`-wrapped at the call site (already enforced by hook design — all returned handlers are `useCallback`-wrapped).

---

## Data Models

### `PatientSession` type alias

`SessionItem` in `src/api/patients/get-patient-details.ts` is already the canonical session shape. The timeline's local `Session` interface (redefined inline) is replaced by directly importing `SessionItem`. No new type file needed.

```typescript
// patient-sessions-timeline.tsx — after
import type { SessionItem } from '@/api/patients/get-patient-details'
// Use SessionItem everywhere the local Session interface was used
```

### Hook interfaces (in their respective files)

All `UseFooOptions` and `UseFooReturn` interfaces are defined in their hook's `.ts` file and exported for use by orchestrator components.

### `TabId` in `constants.ts`

```typescript
export type TabId = 'clinical' | 'anamnesis' | 'timeline' | 'files' | 'resume'
```

---

## Error Handling Strategy

| Scenario | Handling | User Impact |
|---|---|---|
| `localStorage` draft corrupted | `try/catch` in `useAnamnesisEditor` → `localStorage.removeItem`, `console.warn` | No crash; falls back to server state |
| `saveAnamnesis` mutation fails | `onError: () => toast.error(...)` — existing behavior preserved | Toast error message |
| `deleteAttachment` mutation fails | `onError: () => toast.error(...)` | Toast error message |
| File upload rejected (type/size) | `use-patient-files` surfaces via toast — not silently ignored | Toast validation error |
| Patient queue empty (single patient) | `hasPrev`/`hasNext` are `false`; nav buttons `disabled` | Buttons visually disabled |
| `patientId` param missing | `usePatientDetails` receives `undefined`; query disabled with `enabled: !!patientId` | Loading state or redirect (existing behavior) |
| PDF export failure | `try/catch` in `use-pdf-export.ts` → `toast.error(...)` | Toast error message |

---

## Tech Decisions

| Decision | Choice | Rationale |
|---|---|---|
| `SessionItem` stays in API file, not promoted to `src/types/` | Import from API layer | `SessionItem` has no consumers outside this feature. Promoting it requires touching the existing `patient.ts` global. Spec says avoid touching existing globals unless necessary. Direct import is correct here. |
| PDF export in `use-pdf-export.ts` (hook), not `helpers.ts` | Hook | PDF export manages async state (`isExporting`). Pure helper functions can't hold state. Hook is correct abstraction. |
| `anamnesis-types.ts` stays feature-local | Keep in feature | No cross-feature imports. Moving to `src/types/` adds coupling without benefit. |
| `usePatientDetails` includes header sync | Combined hook | Header sync depends on patient data being loaded. Keeping them together avoids a separate `useEffect` in the orchestrator. |
| `PatientDetailsShell` via `Object.assign` namespace | `Object.assign` | Matches the established pattern from `PatientsPageShell` and `PatientsDataBlock` in patients-list. |
| CSS files are created even if empty at first | Empty stubs | Enforces convention from day one. Styles are added during implementation as needed. |
| `PREVIEW_FALLBACK_ORIGIN` in `constants.ts` (not env) | `constants.ts` | Spec explicitly marks env migration as out of scope. Named constant is the minimum viable fix to remove the hardcoded string literal from the component. |

---

## Verification Plan

### Automated gates

```bash
pnpm tsc --noEmit          # zero type errors
pnpm lint                  # zero lint errors
pnpm build                 # build succeeds
grep -rn ": any\|as any" src/pages/app/patients/patients-hub  # zero matches
grep -rn "localhost" src/pages/app/patients/patients-hub       # zero matches (moved to constant)
```

### Manual browser checks

1. Navigate to any patient profile — all 5 tabs render without visual regression
2. Anamnesis tab — edit a block, wait 1s, verify auto-save triggers (no toast error)
3. Anamnesis tab — reload page, verify local draft is recovered with toast info
4. Files tab — upload a file, verify it appears; delete a file, verify it disappears
5. Timeline tab — search for a session, filter by status, paginate forward/back
6. Patient hub with a queue — verify prev/next navigation buttons work
7. Patient hub with a single patient — verify prev/next buttons are disabled
8. Browser DevTools Console — zero errors during all of the above
