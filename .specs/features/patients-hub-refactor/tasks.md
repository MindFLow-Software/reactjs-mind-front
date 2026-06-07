# Patients Hub Architecture Refactor — Tasks

**Spec**: `.specs/features/patients-hub-refactor/spec.md`
**Design**: `.specs/features/patients-hub-refactor/design.md`
**Status**: Draft

---

## Execution Plan

```
Phase 1 — Foundation (all parallel):
  TSK-01 [P]  constants.ts
  TSK-02 [P]  helpers.ts
  TSK-03 [P]  rename patient-Info.tsx
         │
         ▼
Phase 2 — Hook + shell infrastructure (all parallel, after Phase 1):
  TSK-04 [P]  use-pdf-export.ts
  TSK-05 [P]  use-patient-details.ts
  TSK-06 [P]  use-patient-queue.ts
  TSK-07 [P]  use-patient-files.ts
  TSK-08 [P]  patient-details-shell.tsx
         │
         ▼
Phase 3 — Complex hooks (parallel pair, after TSK-04):
  TSK-09 [P]  use-anamnesis-editor.ts
  TSK-10 [P]  use-sessions-timeline.ts
         │
         ▼
Phase 4 — Component rewrites + targeted fixes (varied start, all parallel):
  TSK-11 [P]  patients-details.tsx rewrite     (needs TSK-05, TSK-06, TSK-08)
  TSK-12 [P]  anamnesis-form.tsx rewrite       (needs TSK-09)
  TSK-13 [P]  patient-files-tab.tsx refactor   (needs TSK-07)
  TSK-14 [P]  patient-sessions-timeline.tsx    (needs TSK-10)
  TSK-15 [P]  export-pdf-button.tsx refactor   (needs TSK-04)
  TSK-16 [P]  metric-card.tsx type fix         (needs Phase 1)
  TSK-17 [P]  patient-info.tsx formatter fix   (needs TSK-03)
         │
         ▼
Phase 5 — CSS stubs for remaining components (all parallel, after Phase 4):
  TSK-18 [P]  add co-located CSS stubs
         │
         ▼
Phase 6 — Performance (P3):
  TSK-19      React.memo on leaf components
         │
         ▼
Final gate:
  TSK-20      build + lint + tsc + manual checklist
```

---

## Phase 1 — Foundation

### TSK-01: Create `constants.ts` [P]

**What**: Create `patients-hub/constants.ts` with feature-level constants and the `TabId` type.
**Where**: `src/pages/app/patients/patients-hub/constants.ts` ← new file
**Depends on**: None
**Requirement**: PHR-13, PHR-14

**Done when**:
- [ ] File exists at the correct path
- [ ] Exports: `PATIENT_QUEUE_STORAGE_KEY`, `PATIENT_QUEUE_SOURCE_KEY`, `ANAMNESIS_DRAFT_KEY_PREFIX`, `PREVIEW_FALLBACK_ORIGIN` — all `as const`
- [ ] Exports `type TabId = 'clinical' | 'anamnesis' | 'timeline' | 'files' | 'resume'`
- [ ] `pnpm tsc --noEmit` exits 0

**Tests**: none
**Gate**: `pnpm tsc --noEmit`
**Commit**: `feat(patients-hub): add constants.ts with TabId and storage keys`

---

### TSK-02: Create `helpers.ts` [P]

**What**: Create `patients-hub/helpers.ts` with the `countWords` pure helper.
**Where**: `src/pages/app/patients/patients-hub/helpers.ts` ← new file
**Depends on**: None
**Requirement**: PHR-14, PHR-18

**Done when**:
- [ ] File exists with `export function countWords(text: string): number`
- [ ] Implementation: `text.trim().split(/\s+/).filter(Boolean).length`
- [ ] `pnpm tsc --noEmit` exits 0

**Tests**: none
**Gate**: `pnpm tsc --noEmit`
**Commit**: `feat(patients-hub): add helpers.ts with countWords`

---

### TSK-03: Rename `patient-Info.tsx` → `patient-info.tsx` [P]

**What**: Rename the file (OS-level) to fix the kebab-case violation. The import in `patients-details.tsx` will be updated in TSK-11 when that file is fully rewritten.
**Where**: `src/pages/app/patients/patients-hub/components/patient-Info.tsx` → `patient-info.tsx`
**Depends on**: None
**Requirement**: PHR-13

**Done when**:
- [ ] File named `patient-info.tsx` exists (lowercase `i`)
- [ ] File named `patient-Info.tsx` no longer exists
- [ ] `pnpm tsc --noEmit` exits 0 (TypeScript may warn on the stale import — acceptable until TSK-11 fixes it, or fix the import now to avoid the error)

**Tests**: none
**Gate**: `pnpm tsc --noEmit`
**Commit**: `refactor(patients-hub): rename patient-Info.tsx to patient-info.tsx`

---

## Phase 2 — Hook + Shell Infrastructure

### TSK-04: Create `hooks/use-pdf-export.ts` [P]

**What**: Create the shared PDF export hook that consolidates the `@react-pdf/renderer` blob-download logic currently duplicated in `anamnesis-form.tsx`, `patient-sessions-timeline.tsx`, and `export-pdf-button.tsx`.
**Where**: `src/pages/app/patients/patients-hub/hooks/use-pdf-export.ts` ← new file
**Depends on**: Phase 1 complete
**Reuses**: `@react-pdf/renderer` (already installed), `sonner` for error toast
**Requirement**: PHR-17

**Interface**:
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

**Done when**:
- [ ] `hooks/` directory created at feature root
- [ ] Hook manages `isExporting` state internally
- [ ] `exportToPdf` calls `pdf(document).toBlob()`, creates an object URL, triggers browser download, then revokes the URL
- [ ] `exportToPdf` is wrapped with `useCallback`
- [ ] On error: `toast.error(...)` and resets `isExporting` to `false`
- [ ] `pnpm tsc --noEmit` exits 0

**Tests**: none
**Gate**: `pnpm tsc --noEmit`
**Commit**: `feat(patients-hub): create use-pdf-export hook`

---

### TSK-05: Create `hooks/use-patient-details.ts` [P]

**What**: Create the hook that wraps `useQuery` for `getPatientDetails` and syncs the header store, removing both concerns from `patients-details.tsx`.
**Where**: `src/pages/app/patients/patients-hub/hooks/use-patient-details.ts` ← new file
**Depends on**: Phase 1 complete
**Reuses**: `getPatientDetails` from `@/api/patients/get-patient-details`, `useHeaderStore`, `GetPatientDetailsResponse` type
**Requirement**: PHR-05, PHR-06

**Interface**:
```typescript
interface UsePatientDetailsReturn {
  patient: GetPatientDetailsResponse['patient'] | null
  meta: GetPatientDetailsResponse['meta'] | null
  isLoading: boolean
  pageIndex: number
  setPageIndex: Dispatch<SetStateAction<number>>
}
export function usePatientDetails(patientId: string): UsePatientDetailsReturn
```

**Done when**:
- [ ] `useQuery` key: `['patient-hub', patientId, 'details', pageIndex]`
- [ ] `enabled: !!patientId` guards the query
- [ ] `useEffect` inside the hook syncs `setTitle(patientFullName)` and `setSubtitle(...)` to `useHeaderStore` when patient data loads
- [ ] `setPageIndex` returned so orchestrator can pass it to timeline
- [ ] `pnpm tsc --noEmit` exits 0

**Tests**: none
**Gate**: `pnpm tsc --noEmit`
**Commit**: `feat(patients-hub): create use-patient-details hook`

---

### TSK-06: Create `hooks/use-patient-queue.ts` [P]

**What**: Create the hook that encapsulates all `sessionStorage` queue reading and patient navigation logic currently inline in `patients-details.tsx`.
**Where**: `src/pages/app/patients/patients-hub/hooks/use-patient-queue.ts` ← new file
**Depends on**: TSK-01 (PATIENT_QUEUE_STORAGE_KEY, PATIENT_QUEUE_SOURCE_KEY from constants.ts)
**Reuses**: `useNavigate` from `react-router-dom`, constants from `../constants`
**Requirement**: PHR-06

**Interface**:
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

**Done when**:
- [ ] Queue and source parsed from `sessionStorage` once on mount via `useMemo`
- [ ] `hasPrev` / `hasNext` are boolean-derived from `currentIndex`
- [ ] `navigatePrev` and `navigateNext` are `useCallback`-wrapped and call `navigate` with the correct patient id
- [ ] When queue is empty or has one entry, `hasPrev` and `hasNext` are both `false`
- [ ] `pnpm tsc --noEmit` exits 0

**Tests**: none
**Gate**: `pnpm tsc --noEmit`
**Commit**: `feat(patients-hub): create use-patient-queue hook`

---

### TSK-07: Create `hooks/use-patient-files.ts` [P]

**What**: Create the hook that absorbs the `useState`, `useQuery`, and `useMutation` currently living in `patient-files-tab.tsx`.
**Where**: `src/pages/app/patients/patients-hub/hooks/use-patient-files.ts` ← new file
**Depends on**: Phase 1 complete
**Reuses**: `getPatientAttachments`, `deleteAttachment` from `@/api/attachments/attachments`, `AttachmentPatientItem` from `@/types/attachment`, `useApiMutation` from `@/hooks/use-api-mutation`, `FileTypeFilter` type from `../components/files/file-type-filter`, `getFileType` from `../components/files/file-type-filter`
**Requirement**: PHR-08

**Interface**:
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

**Done when**:
- [ ] `useQuery` key: `['patient-hub', patientId, 'attachments']`
- [ ] `sorted` and `counts` derived via `useMemo`
- [ ] `filtered` derived from `sorted` + `typeFilter` via `useMemo`
- [ ] `handleDelete` invalidates `['patient-hub', patientId, 'attachments']` on success
- [ ] `setTypeFilter`, `openPreview`, `closePreview`, `handleDelete` all wrapped with `useCallback`
- [ ] `pnpm tsc --noEmit` exits 0

**Tests**: none
**Gate**: `pnpm tsc --noEmit`
**Commit**: `feat(patients-hub): create use-patient-files hook`

---

### TSK-08: Create `components/patient-details-shell.tsx` [P]

**What**: Create the `PatientDetailsShell` namespace compound component with `.Header` and `.Content` subcomponents, plus its co-located CSS stub.
**Where**:
- `src/pages/app/patients/patients-hub/components/patient-details-shell.tsx` ← new file
- `src/pages/app/patients/patients-hub/components/patient-details-shell.css` ← new file
**Depends on**: Phase 1 complete
**Reuses**: `cn()` from `@/lib/utils`, pattern from `PatientsPageShell` in patients-list
**Requirement**: PHR-02

**Implementation pattern** (`Object.assign` namespace):
```typescript
function PatientDetailsShellRoot({ children }: { children: ReactNode }) {
  return <div className="ph-shell">{children}</div>
}
function Header({ children }: { children: ReactNode }) { ... }
function Content({ children }: { children: ReactNode }) { ... }

export const PatientDetailsShell = Object.assign(PatientDetailsShellRoot, { Header, Content })
```

**Done when**:
- [ ] `PatientDetailsShell`, `PatientDetailsShell.Header`, `PatientDetailsShell.Content` are exported and usable
- [ ] `patient-details-shell.css` exists with at least the `.ph-shell` class stub
- [ ] `pnpm tsc --noEmit` exits 0

**Tests**: none
**Gate**: `pnpm tsc --noEmit`
**Commit**: `feat(patients-hub): create PatientDetailsShell compound component`

---

## Phase 3 — Complex Hooks

### TSK-09: Create `hooks/use-anamnesis-editor.ts` [P]

**What**: Create the hook that absorbs all 7 `useState` calls, both `useEffect` bodies, the `useMutation`, and all `localStorage` access from `anamnesis-form.tsx`. This is the most complex extraction in the feature.
**Where**: `src/pages/app/patients/patients-hub/hooks/use-anamnesis-editor.ts` ← new file
**Depends on**: TSK-04 (usePdfExport), TSK-01 (ANAMNESIS_DRAFT_KEY_PREFIX), TSK-02 (countWords — if used here)
**Reuses**: `getAnamnesis`, `saveAnamnesis`, `AnamnesisData` from `@/api/patients/anamnesis`, `AnamnesisBlock`, `AnamnesisDraft` from `../components/anamnesis/anamnesis-types`, all pure functions from `../components/anamnesis/anamnesis-utils`, `usePdfExport` from `./use-pdf-export`
**Requirement**: PHR-07, PHR-20

**Interface**:
```typescript
interface UseAnamnesisEditorOptions {
  patientId: string
}
interface UseAnamnesisEditorReturn {
  blocks: AnamnesisBlock[]
  activeBlockId: string | null
  hasLocalDraft: boolean
  hydrated: boolean
  isPending: boolean
  copied: boolean
  isExporting: boolean
  setActiveBlockId: (id: string | null) => void
  updateBlock: (id: string, content: string) => void
  addBlock: () => void
  deleteBlock: (id: string) => void
  discardDraft: () => void
  copyToClipboard: () => Promise<void>
  exportToPdf: () => Promise<void>
}
export function useAnamnesisEditor(options: UseAnamnesisEditorOptions): UseAnamnesisEditorReturn
```

**Key internals to migrate from `anamnesis-form.tsx`**:
- `useQuery(['patient-hub', patientId, 'anamnesis'])` for `getAnamnesis`
- First `useEffect` (lines 100–133): data load + localStorage draft recovery with hash comparison
- Second `useEffect` (lines 135–156): auto-save debounce (1 s `setTimeout`) + `localStorage` write
- `useMutation` for `saveAnamnesis` with `onSuccess` clearing draft + updating hash ref
- `lastPersistedHash` ref (preserves identity across renders)
- Draft key: `` `${ANAMNESIS_DRAFT_KEY_PREFIX}${patientId}` ``

**Done when**:
- [ ] All 7 `useState` calls migrated from `anamnesis-form.tsx` to this hook
- [ ] Both `useEffect` bodies migrated verbatim (behavior preserved)
- [ ] `useMutation` migrated; query invalidation uses `['patient-hub', patientId, 'anamnesis']`
- [ ] All handlers wrapped with `useCallback`
- [ ] `exportToPdf` delegates to `usePdfExport`
- [ ] `pnpm tsc --noEmit` exits 0

**Tests**: none
**Gate**: `pnpm tsc --noEmit`
**Commit**: `feat(patients-hub): create use-anamnesis-editor hook`

---

### TSK-10: Create `hooks/use-sessions-timeline.ts` [P]

**What**: Create the hook that absorbs search, status filter, and pagination state from `patient-sessions-timeline.tsx`, plus delegates PDF export to `usePdfExport`.
**Where**: `src/pages/app/patients/patients-hub/hooks/use-sessions-timeline.ts` ← new file
**Depends on**: TSK-04 (usePdfExport)
**Reuses**: `SessionItem` from `@/api/patients/get-patient-details`, `GetPatientDetailsResponse` type, `usePdfExport` from `./use-pdf-export`
**Requirement**: PHR-09

**Interface**:
```typescript
interface UseSessionsTimelineReturn {
  search: string
  statusFilter: string
  filteredSessions: SessionItem[]
  isExporting: boolean
  setSearch: (q: string) => void
  setStatusFilter: (s: string) => void
  exportToPdf: () => Promise<void>
}
export function useSessionsTimeline(
  sessions: SessionItem[],
  patientName: string,
): UseSessionsTimelineReturn
```

**Note**: Sessions data is passed in as a prop from the parent (data already fetched by `usePatientDetails`). The hook only manages local filter/search/export state.

**Done when**:
- [ ] `useState` for `search` and `statusFilter` migrated from `patient-sessions-timeline.tsx`
- [ ] `filteredSessions` derived via `useMemo` from `sessions + search + statusFilter`
- [ ] `setSearch`, `setStatusFilter`, `exportToPdf` wrapped with `useCallback`
- [ ] `exportToPdf` delegates to `usePdfExport`
- [ ] `pnpm tsc --noEmit` exits 0

**Tests**: none
**Gate**: `pnpm tsc --noEmit`
**Commit**: `feat(patients-hub): create use-sessions-timeline hook`

---

## Phase 4 — Component Rewrites and Targeted Fixes

### TSK-11: Rewrite `patients-details.tsx` as thin orchestrator [P]

**What**: Replace the 316-line god component with a ≤200-line orchestrator. Consumes `usePatientDetails`, `usePatientQueue`, `PatientDetailsShell`, and renders tabs via a named `renderTab` switch function.
**Where**: `src/pages/app/patients/patients-hub/patients-details.tsx`
**Depends on**: TSK-05 (use-patient-details), TSK-06 (use-patient-queue), TSK-08 (PatientDetailsShell), TSK-01 (TabId)
**Reuses**: All existing tab components (AnamnesisForm, PatientFilesTab, etc.), `TabId` from `./constants`
**Requirement**: PHR-01, PHR-02, PHR-03

**Structure after rewrite**:
- Two hook calls: `usePatientDetails`, `usePatientQueue`
- One local `useState<TabId>` for the active tab
- `PatientDetailsShell` wrapping the layout
- `renderTab(tab, ctx)` as a named function with a `switch` statement (no nested ternaries)
- Import `PatientInfo` from `./components/patient-info` (lowercase — fixes the stale import from TSK-03)

**Done when**:
- [ ] File is ≤200 lines
- [ ] No `sessionStorage` access in the component body
- [ ] No `useHeaderStore` call in the component body (moved to hook)
- [ ] Tab rendering uses `renderTab` with `switch` — no nested ternaries
- [ ] `PatientDetailsShell.Header` and `PatientDetailsShell.Content` used for layout
- [ ] Import from `./components/patient-info` (lowercase) is correct
- [ ] `pnpm tsc --noEmit` exits 0
- [ ] Manual: patient hub page loads and all 5 tabs render

**Tests**: none
**Gate**: `pnpm tsc --noEmit` + manual browser check
**Commit**: `refactor(patients-hub): rewrite patients-details.tsx as thin orchestrator`

---

### TSK-12: Rewrite `anamnesis-form.tsx` using `useAnamnesisEditor` [P]

**What**: Replace the 313-line component with a ≤200-line orchestrator that calls `useAnamnesisEditor` and renders blocks. Zero `useEffect`, `localStorage`, or `useMutation` in the component file.
**Where**: `src/pages/app/patients/patients-hub/components/anamnesis/anamnesis-form.tsx`
**Depends on**: TSK-09 (use-anamnesis-editor)
**Reuses**: All existing sub-components (AnamnesisHeader, AnamnesisNavigation, AnamnesisToolbar, AnamnesisEditorBlock, AnamnesisSkeleton)
**Requirement**: PHR-20

**Done when**:
- [ ] File is ≤200 lines
- [ ] Zero `useEffect` calls in the component body
- [ ] Zero `localStorage` access in the component body
- [ ] Zero `useMutation` or `useQuery` in the component body
- [ ] All state and handlers come from `useAnamnesisEditor`
- [ ] `anamnesis-form.css` co-located CSS stub created with `ph-anamnesis-form` class stub
- [ ] `pnpm tsc --noEmit` exits 0
- [ ] Manual: anamnesis tab loads, blocks render, editing a block triggers auto-save

**Tests**: none
**Gate**: `pnpm tsc --noEmit` + manual browser check
**Commit**: `refactor(anamnesis): rewrite anamnesis-form.tsx using useAnamnesisEditor`

---

### TSK-13: Refactor `patient-files-tab.tsx` using `usePatientFiles` [P]

**What**: Strip all `useState`, `useQuery`, `useMutation`, and `useMemo` from `patient-files-tab.tsx`; consume everything from `usePatientFiles`.
**Where**: `src/pages/app/patients/patients-hub/components/files/patient-files-tab.tsx`
**Depends on**: TSK-07 (use-patient-files)
**Reuses**: Existing sub-components (FileUploadZone, FileTypeFilter, FileCard, SimplePreviewModal)
**Requirement**: PHR-08

**Done when**:
- [ ] `useState`, `useQuery`, `useMutation`, `useMemo` removed from component body
- [ ] All data and handlers sourced from `usePatientFiles(patientId)`
- [ ] `patient-files-tab.css` co-located CSS stub created
- [ ] `pnpm tsc --noEmit` exits 0
- [ ] Manual: file upload, delete, filter, and preview all work correctly

**Tests**: none
**Gate**: `pnpm tsc --noEmit` + manual browser check
**Commit**: `refactor(patients-hub): refactor patient-files-tab.tsx using usePatientFiles`

---

### TSK-14: Refactor `patient-sessions-timeline.tsx` using `useSessionsTimeline` [P]

**What**: Strip search/filter/PDF state from `patient-sessions-timeline.tsx`; consume from `useSessionsTimeline`. Replace the locally-defined `Session` interface with an import of `SessionItem`.
**Where**: `src/pages/app/patients/patients-hub/components/timeline/patient-sessions-timeline.tsx`
**Depends on**: TSK-10 (use-sessions-timeline)
**Reuses**: `SessionItem` from `@/api/patients/get-patient-details`, `SessionsPagination` sub-component
**Requirement**: PHR-09, PHR-11, PHR-23

**Done when**:
- [ ] Local `Session` interface removed; `SessionItem` imported from `@/api/patients/get-patient-details`
- [ ] `useState` for search and statusFilter removed; sourced from hook
- [ ] Inline PDF export logic removed; delegated via hook
- [ ] `patient-sessions-timeline.css` co-located CSS stub created
- [ ] `sessions-pagination.css` co-located CSS stub created
- [ ] `pnpm tsc --noEmit` exits 0
- [ ] Manual: timeline search, status filter, and pagination work correctly

**Tests**: none
**Gate**: `pnpm tsc --noEmit` + manual browser check
**Commit**: `refactor(timeline): refactor patient-sessions-timeline.tsx using useSessionsTimeline`

---

### TSK-15: Refactor `export-pdf-button.tsx` using `usePdfExport` [P]

**What**: Replace the inline `@react-pdf/renderer` logic in `export-pdf-button.tsx` with a call to `usePdfExport`. Fix `session: any` to use `SessionItem`.
**Where**: `src/pages/app/patients/patients-hub/components/export-pdf-button.tsx`
**Depends on**: TSK-04 (use-pdf-export)
**Reuses**: `SessionItem` from `@/api/patients/get-patient-details`, `usePdfExport` from `../../hooks/use-pdf-export`
**Requirement**: PHR-10, PHR-17

**Done when**:
- [ ] `session: any` replaced with `session: SessionItem`
- [ ] Inline `pdf(...).toBlob()` logic removed; replaced with `usePdfExport`
- [ ] Component accepts the PDF document element as a prop and passes it to `exportToPdf`
- [ ] `export-pdf-button.css` co-located CSS stub created
- [ ] `pnpm tsc --noEmit` exits 0

**Tests**: none
**Gate**: `pnpm tsc --noEmit`
**Commit**: `refactor(patients-hub): refactor export-pdf-button.tsx using usePdfExport; fix session type`

---

### TSK-16: Fix `metric-card.tsx` — replace `icon?: any` with `LucideIcon` [P]

**What**: Replace the `any` type on the `icon` prop with the correct `LucideIcon` type from `lucide-react`. Add the co-located CSS stub.
**Where**: `src/pages/app/patients/patients-hub/components/metric-card.tsx`
**Depends on**: Phase 1 complete (no specific task dep)
**Reuses**: `LucideIcon` from `lucide-react`
**Requirement**: PHR-10

**Done when**:
- [ ] `icon?: any` replaced with `icon?: LucideIcon`
- [ ] No `eslint-disable` suppressor around the type
- [ ] `metric-card.css` co-located CSS stub created
- [ ] `pnpm tsc --noEmit` exits 0

**Tests**: none
**Gate**: `pnpm tsc --noEmit`
**Commit**: `fix(patients-hub): replace icon:any with LucideIcon in metric-card`

---

### TSK-17: Fix `patient-info.tsx` — remove inline formatCPF/formatPhone [P]

**What**: Delete the two inline formatter functions from `patient-info.tsx` and import the canonical versions from `src/utils/`.
**Where**: `src/pages/app/patients/patients-hub/components/patient-info.tsx`
**Depends on**: TSK-03 (file was renamed)
**Reuses**: `formatCPF` from `@/utils/formatCPF`, `formatPhone` from `@/utils/formatPhone`
**Requirement**: PHR-16

**Done when**:
- [ ] Inline `formatCPF` and `formatPhone` function definitions removed
- [ ] Both imported from `@/utils/`
- [ ] `patient-info.css` co-located CSS stub created
- [ ] `pnpm tsc --noEmit` exits 0

**Tests**: none
**Gate**: `pnpm tsc --noEmit`
**Commit**: `fix(patients-hub): import formatCPF and formatPhone from src/utils in patient-info`

---

## Phase 5 — Remaining CSS Stubs

### TSK-18: Add CSS stubs for remaining components [P]

**What**: Create co-located `.css` stubs for all components that were not covered by Phases 2–4. These are stubs only — empty files with the correct import wired in the `.tsx` file.
**Where**: The following files (create each `.css` + add `import './file.css'` to its `.tsx`):
- `components/patient-details-header.tsx` → `patient-details-header.css`
- `components/patient-resume-tab.tsx` → `patient-resume-tab.css`
- `components/loading.tsx` → `loading.css`
- `components/anamnesis/anamnesis-header.tsx` → `anamnesis-header.css`
- `components/anamnesis/anamnesis-toolbar.tsx` → `anamnesis-toolbar.css`
- `components/anamnesis/anamnesis-editor-block.tsx` → `anamnesis-editor-block.css`
- `components/anamnesis/anamnesis-navigation.tsx` → `anamnesis-navigation.css`
- `components/anamnesis/anamnesis-skeleton.tsx` → `anamnesis-skeleton.css`
- `components/files/file-card.tsx` → `file-card.css`
- `components/files/file-upload-zone.tsx` → `file-upload-zone.css`
- `components/files/file-type-filter.tsx` → `file-type-filter.css`
- `components/files/simple-preview-modal.tsx` → `simple-preview-modal.css`
**Depends on**: Phase 4 complete (all components in final shape)
**Requirement**: PHR-15

**Done when**:
- [ ] Each `.css` file exists as a sibling to its `.tsx` file
- [ ] Each `.tsx` file has `import './[name].css'` at the top of its import block
- [ ] `PREVIEW_FALLBACK_ORIGIN` is imported from `../../constants` in `simple-preview-modal.tsx` (fixes the hardcoded `'http://localhost:8080'` string) — PHR-19
- [ ] `pnpm tsc --noEmit` exits 0
- [ ] `pnpm lint` exits 0 (CSS imports are valid)

**Tests**: none
**Gate**: `pnpm tsc --noEmit` + `pnpm lint`
**Commit**: `feat(patients-hub): add co-located CSS stubs with ph- prefix; fix BACKEND_FALLBACK_URL constant`

---

## Phase 6 — Performance (P3)

### TSK-19: Wrap leaf components with `React.memo()`

**What**: Add `React.memo()` to the four performance-sensitive leaf components that render inside lists or re-render frequently.
**Where**:
- `components/anamnesis/anamnesis-editor-block.tsx` — wraps with `memo()`
- `components/anamnesis/anamnesis-navigation.tsx` — wraps with `memo()`
- `components/files/file-card.tsx` — wraps with `memo()`
- `components/timeline/sessions-pagination.tsx` — wraps with `memo()`
**Depends on**: Phase 4 complete (handlers are already `useCallback`-wrapped in hooks)
**Requirement**: PHR-04

**Done when**:
- [ ] All four components export `memo(ComponentName)` instead of bare `ComponentName`
- [ ] No prop type changes required (memo is transparent)
- [ ] `pnpm tsc --noEmit` exits 0
- [ ] Manual: React DevTools Profiler — editing one anamnesis block does not highlight sibling blocks as re-rendered

**Tests**: none
**Gate**: `pnpm tsc --noEmit`
**Commit**: `perf(patients-hub): wrap AnamnesisEditorBlock, AnamnesisNavigation, FileCard, SessionsPagination with memo`

---

## Final Gate

### TSK-20: Build, lint, type check, and manual verification

**What**: Full automated gate + manual browser checklist confirming zero regressions.
**Depends on**: All previous tasks complete

**Automated checks**:
```bash
pnpm tsc --noEmit     # must exit 0
pnpm lint             # must exit 0
pnpm build            # must exit 0
grep -rn ": any\|as any" src/pages/app/patients/patients-hub   # must return zero matches
grep -rn "localhost"  src/pages/app/patients/patients-hub      # must return zero matches
```

**Manual browser checklist** (open DevTools Console + Network tab):

1. Navigate to any patient profile → page loads, no console errors
2. All 5 tabs render without visual regression (Clinical, Anamnesis, Timeline, Files, Resume)
3. Anamnesis tab: edit a block, wait 1 s → no toast error (auto-save fires silently)
4. Anamnesis tab: reload page → `"Rascunho local recuperado."` toast appears (draft preserved)
5. Files tab: upload a file → file card appears in the list
6. Files tab: delete a file → file card disappears
7. Timeline tab: type in search box → session list filters
8. Timeline tab: click a status chip → session list filters by status
9. Timeline tab: paginate → page index updates, new sessions load
10. Patient with a queue (navigate from patients-list): prev/next navigation buttons are enabled and functional
11. Single patient (no queue): prev/next buttons are visually disabled
12. DevTools Console: zero errors throughout all of the above

**Done when**:
- [ ] All automated checks exit 0
- [ ] All 12 manual items verified without regressions

**Tests**: none
**Gate**: `pnpm build` + manual
**Commit**: none — gate only

---

## Task Granularity Check

| Task | Scope | Status |
|---|---|---|
| TSK-01: constants.ts | 1 new file | ✅ Granular |
| TSK-02: helpers.ts | 1 new file | ✅ Granular |
| TSK-03: rename patient-Info.tsx | 1 file rename | ✅ Granular |
| TSK-04: use-pdf-export.ts | 1 new file | ✅ Granular |
| TSK-05: use-patient-details.ts | 1 new file | ✅ Granular |
| TSK-06: use-patient-queue.ts | 1 new file | ✅ Granular |
| TSK-07: use-patient-files.ts | 1 new file | ✅ Granular |
| TSK-08: patient-details-shell.tsx | 1 new file + 1 CSS stub | ✅ Granular (cohesive pair) |
| TSK-09: use-anamnesis-editor.ts | 1 new file (complex) | ✅ Granular |
| TSK-10: use-sessions-timeline.ts | 1 new file | ✅ Granular |
| TSK-11: patients-details.tsx rewrite | 1 file | ✅ Granular |
| TSK-12: anamnesis-form.tsx rewrite | 1 file + 1 CSS stub | ✅ Granular |
| TSK-13: patient-files-tab.tsx | 1 file + 1 CSS stub | ✅ Granular |
| TSK-14: patient-sessions-timeline.tsx | 1 file + 2 CSS stubs | ✅ Granular |
| TSK-15: export-pdf-button.tsx | 1 file + 1 CSS stub | ✅ Granular |
| TSK-16: metric-card.tsx type fix | 1 file + 1 CSS stub | ✅ Granular |
| TSK-17: patient-info.tsx formatters | 1 file + 1 CSS stub | ✅ Granular |
| TSK-18: remaining CSS stubs | 12 stub files — mechanical | ✅ OK (all trivial, same pattern) |
| TSK-19: React.memo | 4 files — mechanical, same change | ✅ OK (uniform P3 pass) |
| TSK-20: final gate | verification only | ✅ Granular |

---

## Diagram-Definition Cross-Check

| Task | Depends on (task body) | Diagram shows | Status |
|---|---|---|---|
| TSK-01 | None | Phase 1 parallel start | ✅ |
| TSK-02 | None | Phase 1 parallel start | ✅ |
| TSK-03 | None | Phase 1 parallel start | ✅ |
| TSK-04 | Phase 1 complete | Phase 2, after Phase 1 | ✅ |
| TSK-05 | Phase 1 complete | Phase 2, after Phase 1 | ✅ |
| TSK-06 | TSK-01 | Phase 2, after Phase 1 | ✅ |
| TSK-07 | Phase 1 complete | Phase 2, after Phase 1 | ✅ |
| TSK-08 | Phase 1 complete | Phase 2, after Phase 1 | ✅ |
| TSK-09 | TSK-04, TSK-01, TSK-02 | Phase 3, after TSK-04 | ✅ |
| TSK-10 | TSK-04 | Phase 3, after TSK-04 | ✅ |
| TSK-11 | TSK-05, TSK-06, TSK-08 | Phase 4, after Phase 2 deps | ✅ |
| TSK-12 | TSK-09 | Phase 4, after Phase 3 | ✅ |
| TSK-13 | TSK-07 | Phase 4, after Phase 2 | ✅ |
| TSK-14 | TSK-10 | Phase 4, after Phase 3 | ✅ |
| TSK-15 | TSK-04 | Phase 4, after Phase 2 | ✅ |
| TSK-16 | Phase 1 complete | Phase 4, no Phase 3 dep | ✅ |
| TSK-17 | TSK-03 | Phase 4, after TSK-03 | ✅ |
| TSK-18 | Phase 4 complete | Phase 5, after Phase 4 | ✅ |
| TSK-19 | Phase 4 complete | Phase 6, after Phase 4 | ✅ |
| TSK-20 | All previous | Final, after all | ✅ |

No mismatches detected.

---

## Test Co-location Validation

No test framework is configured in this project (per `.specs/codebase/TESTING.md`). All tasks use `Tests: none`. Gate checks are `pnpm tsc --noEmit`, `pnpm lint`, and `pnpm build`. Manual browser verification replaces automated behavioral tests.

| Task | Code layer | Matrix requires | Task says | Status |
|---|---|---|---|---|
| All TSK-01–TSK-20 | Components, hooks, utilities | none | none | ✅ |

---

## Requirement → Task Traceability

| Req ID | Description | Task(s) |
|---|---|---|
| PHR-01 | Thin orchestrator ≤200 lines | TSK-11 |
| PHR-02 | Namespace compound component | TSK-08, TSK-11 |
| PHR-03 | renderTab switch, no nested ternaries | TSK-11 |
| PHR-04 | React.memo on leaf components | TSK-19 |
| PHR-05 | hooks/ subfolder at feature root | TSK-04–TSK-10 |
| PHR-06 | use-patient-queue encapsulates sessionStorage | TSK-06 |
| PHR-07 | use-anamnesis-editor encapsulates draft/auto-save | TSK-09 |
| PHR-08 | use-patient-files encapsulates file state | TSK-07, TSK-13 |
| PHR-09 | use-sessions-timeline encapsulates filter/search | TSK-10, TSK-14 |
| PHR-10 | Zero any types | TSK-15, TSK-16 |
| PHR-11 | Entity types from src/types/ | TSK-14 (SessionItem import) |
| PHR-12 | UseFooOptions/UseFooReturn interfaces | TSK-04–TSK-10 |
| PHR-13 | constants.ts with as const | TSK-01 |
| PHR-14 | helpers.ts + naming fix | TSK-02, TSK-03 |
| PHR-15 | Co-located CSS with ph- prefix | TSK-08, TSK-12–17, TSK-18 |
| PHR-16 | Remove inline formatCPF/formatPhone | TSK-17 |
| PHR-17 | PDF export consolidated | TSK-04, TSK-12, TSK-14, TSK-15 |
| PHR-18 | countWords deduplicated | TSK-02 |
| PHR-19 | BACKEND_FALLBACK_URL → constant | TSK-18 |
| PHR-20 | anamnesis-form.tsx ≤200 lines | TSK-12 |
| PHR-21 | anamnesis-utils.ts pure only | TSK-09 (verify on extraction) |
| PHR-22 | AnamnesisBlock types stay feature-local | TSK-09 (no move needed) |
| PHR-23 | Query keys: ['patient-hub', id, subKey] | TSK-05, TSK-07, TSK-09 |
| PHR-24 | Mutation invalidation via Promise.all | TSK-07, TSK-09 |
