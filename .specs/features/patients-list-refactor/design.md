# Patients List Refactor — Design

**Spec**: `.specs/features/patients-list-refactor/spec.md`
**Status**: Draft

---

## Architecture Overview

This refactor touches 6 logical areas. No new folders, no new abstractions — only targeted fixes to existing files.
Each area is independently implementable; no area has a cross-area dependency that requires ordering (except that TypeScript fixes unblock compilation for all other areas).

```
URL (browser)
  └─ usePatientFilters          [fix: enum validation on status/gender]
       └─ usePatientsQueryParams [fix: null-filter, sessionVolume:'all' guard]
            └─ usePatientsListQuery ──► GET /patients   [fix: staleTime uncommented]
            └─ usePatientsMetrics   ──► GET /patients   [fix: staleTime uncommented]

Form (RegisterPatients)
  ├─ usePatient(patientId)      [unchanged — source of truth for edit data]
  ├─ usePatientSubmit           [fix: patientId-based mode, +patients-metrics invalidation]
  └─ StepBasicData              [fix: birthInput sync via key remount]
       └─ PatientAvatarUpload   [fix: HTTP/HTTPS URLs accepted]

Table (PatientsTableRow)
  └─ useMutation(toggleStatus)  [fix: optimistic derives from isActive, +patients-metrics]

Details (PatientsDetails)       [fix: any→SessionItem, parseISO guard]
Markdown (renderMarkdown)       [fix: sanitize link href]
patients-list.tsx               [fix: remove dead UI, remove hardcoded metrics]
```

---

## Code Reuse Analysis

| Existing code | Location | How used |
|---|---|---|
| `Ipatient` type | `src/types/patient.ts` | Replace broken `Patient` import in `patients-list.types.ts` |
| `SessionItem` type | `src/types/patient.ts` | Replace `any` in `patients-details.tsx` session callbacks |
| `PatientStatus` union | `src/types/patient.ts` | Build `VALID_STATUSES` array for enum validation in filter hook |
| `Gender` const object | `src/types/patient.ts` | `Object.values(Gender)` gives the valid gender strings |
| `format`, `isValid` from `date-fns` | already imported in `patients-details.tsx` | Add `isValid` check before `format(parseISO(...))` |
| `useImagePreview` | `src/hooks/use-image-preview.ts` | Keep as-is in `PatientAvatarUpload`; add a parallel `directUrl` state for HTTP URLs |
| `buildPatientDefaults` | `register-patients/helpers.ts` | Keep; just remove it from the `useEffect` dep array in `register-patients.tsx` |

---

## Area 1 — TypeScript Contracts (PLR-10, PLR-23)

### `src/pages/app/patients/patients-list/patients-list.types.ts`

**Problem**: `import type { Patient } from '@/api/patients/get-patients'` — `Patient` does not exist in that module. `get-patients.ts` exports only `GetPatientsFilters`, `GetPatientsResponse`, and `getPatients`. `Ipatient` lives in `@/types/patient`.

**Fix**:
```typescript
// Before
import type { Patient } from '@/api/patients/get-patients'
// After
import type { Ipatient } from '@/types/patient'

// PatientsListQueryResult.patients
patients: Ipatient[]   // was: patients: Patient[]
```

### `src/pages/app/patients/patients-list/components/details/patients-details.tsx`

**Problem**: Three `any` uses — `selectedSession` state, and two `.map`/`.filter` callbacks over `patient.sessions`. `SessionItem` already exists in `types/patient.ts`.

**Fix — state type**:
```typescript
// Before
const [selectedSession, setSelectedSession] = useState<any | null>(null)
// After
const [selectedSession, setSelectedSession] = useState<SessionItem | null>(null)
// Add import: import type { SessionItem } from '@/types/patient'
```

**Fix — session callbacks** (both filter and map):
```typescript
// Before
patient.sessions.filter((session: any) => ...)
patient.sessions.map((session: any) => ...)
// After
patient.sessions.filter((session: SessionItem) => ...)
patient.sessions.map((session: SessionItem) => ...)
```

**Fix — IMaskMixin `any`** (line 26):
The `any` in `IMaskMixin(({ inputRef, ...props }: any) => ...)` is required by the library's typing. Replace with a typed cast:
```typescript
const MaskedInfo = IMaskMixin(
  ({ inputRef, ...props }: { inputRef: React.Ref<HTMLInputElement> } & React.InputHTMLAttributes<HTMLInputElement>) => (
    <input ref={inputRef} disabled {...props} className="bg-transparent border-none w-full text-right p-0 pointer-events-none font-medium tabular-nums focus:outline-none disabled:opacity-100 text-foreground h-auto" />
  )
)
```

**Fix — `parseISO` safety**:
```typescript
// Before (line 175)
{format(parseISO(session.date), "dd/MM/yy HH:mm", { locale: ptBR })}
// After
{session.date && isValid(parseISO(session.date))
  ? format(parseISO(session.date), "dd/MM/yy HH:mm", { locale: ptBR })
  : '—'}
// Ensure import: import { format, parseISO, isValid } from 'date-fns'
```

---

## Area 2 — Query Keys & Mutation Invalidation (PLR-04, PLR-12, PLR-14)

### Canonical query keys (inline — no key file needed)

| Key | Used by | Invalidated by |
|---|---|---|
| `['patients', params]` | `usePatientsListQuery` | create, update, toggle-status |
| `['patients-metrics']` | `usePatientsMetrics` | create, update, toggle-status |
| `['patient', id]` | `usePatient` (in register-patients) | update, toggle-status |
| `['patient-details', id, pageIndex]` | `PatientsDetails` | toggle-status |
| `['attachments', id]` | `AttachmentsList` | update |

### `src/pages/app/patients/patients-list/register-patients/hooks/use-patient-submit.ts`

**Problem 1**: `isEditMode = !!patient` — false while patient data is loading even when `patientId` is set.
**Problem 2**: `["patients-metrics"]` is never invalidated after create or update.

**Fix — add `patientId` to options and use it for mode**:
```typescript
interface UsePatientSubmitOptions {
    patientId?: string       // NEW — authoritative mode signal
    patient: Ipatient | null
    avatarFile: File | null
    files: File[]
    onSuccess?: () => void
}

// Inside hook:
const isEditMode = Boolean(patientId)  // was: !!patient
```

**Fix — invalidation** (add `patients-metrics`):
```typescript
await Promise.all([
    queryClient.invalidateQueries({ queryKey: ["patients"] }),
    queryClient.invalidateQueries({ queryKey: ["patient", targetId] }),
    queryClient.invalidateQueries({ queryKey: ["attachments", targetId] }),
    queryClient.invalidateQueries({ queryKey: ["patients-metrics"] }),  // ADD
])
```

### `src/pages/app/patients/patients-list/register-patients/register-patients.tsx`

**Fix — pass `patientId` to submit hook**:
```typescript
const { submit, isSubmitting } = usePatientSubmit({
    patientId,   // ADD
    patient,
    avatarFile,
    files,
    onSuccess: () => { ... },
})
```

**Fix — remove `buildPatientDefaults` from dep array** (static function, never changes):
```typescript
// Before
}, [patient, buildPatientDefaults])
// After
}, [patient])  // eslint-disable-line react-hooks/exhaustive-deps
```

**Fix — disable submit while edit data loads**:
```typescript
const isEditLoading = Boolean(patientId) && !patient

<button
    disabled={isSubmitting || isEditLoading}
    ...
>
```

### `src/pages/app/patients/patients-list/components/table/patients-table-row.tsx`

**Problem 1**: `onMutate` always sets `status: 'BLOCKED'` and `isActive: false`, even when reactivating.
**Problem 2**: `onSettled` invalidates `['patients-count']` (nonexistent key); missing `['patient', id]` and `['patients-metrics']`.

**Fix — optimistic update** derives next state from current `p.isActive`:
```typescript
queryClient.setQueriesData<GetPatientsResponse>(
    { queryKey: ['patients'], exact: false },
    (old) => {
        if (!old) return old
        return {
            ...old,
            patients: old.patients.map((p) =>
                p.id === id
                    ? { ...p, status: p.isActive ? 'BLOCKED' : 'ACTIVE', isActive: !p.isActive }
                    : p
            ),
        }
    },
)
```

**Fix — `onSettled` invalidation**:
```typescript
onSettled: () => {
    Promise.all([
        queryClient.invalidateQueries({ queryKey: ['patients'] }),
        queryClient.invalidateQueries({ queryKey: ['patient', id] }),          // ADD; replaces patients-count
        queryClient.invalidateQueries({ queryKey: ['patient-details', id] }),  // keep
        queryClient.invalidateQueries({ queryKey: ['patients-metrics'] }),     // ADD
    ])
},
```

### `src/pages/app/patients/patients-list/register-patients/steps/attachments-list.tsx`

**Problem**: `useQuery` for `getPatientAttachments` fires even when `patientId` is null, producing a `/attachments/patient/null` request.

**Fix** — add `enabled` guard:
```typescript
useQuery({
    queryKey: ['attachments', patientId],
    queryFn:  () => getPatientAttachments(patientId!),
    enabled:  Boolean(patientId),   // ADD
})
```

### `hooks/use-patients-list-query.ts` and `hooks/use-patients-metrics.ts`

Both have `staleTime` / `gcTime` / config commented out. Uncomment:

```typescript
// use-patients-list-query.ts
useQuery({
    queryKey: ['patients', params],
    queryFn:  () => getPatients(params),
    staleTime:            30_000,
    gcTime:              300_000,
    refetchOnWindowFocus: true,
    placeholderData:      (prev) => prev,
})

// use-patients-metrics.ts
useQuery({
    queryKey: ['patients-metrics'],
    queryFn:  async () => { ... },
    staleTime:            60_000,
    gcTime:              300_000,
    refetchOnWindowFocus: false,
})
```

---

## Area 3 — Filter Validation (PLR-01, PLR-03, PLR-22)

### `src/hooks/use-patient-filters.ts`

**Problem**: `searchParams.get("status") as PatientStatus` — raw cast; invalid URL values silently pass through as valid enum.

**Fix** — add validation constants and check before casting:
```typescript
// Module-level constants (not exported)
const VALID_STATUSES = ['ACTIVE', 'REJECTED', 'PENDING', 'BLOCKED'] as const
const VALID_GENDERS  = Object.values(Gender)

// Inside hook (replace the raw casts):
const rawStatus = searchParams.get("status")
const status = (VALID_STATUSES as readonly string[]).includes(rawStatus ?? '')
    ? (rawStatus as PatientStatus)
    : null

const rawGender = searchParams.get("gender")
const gender = (VALID_GENDERS as readonly string[]).includes(rawGender ?? '')
    ? (rawGender as Gender)
    : null
```

`sessionVolume` and `sortBy` casts remain as-is — `sortBy` is UI-only (never sent to API), `sessionVolume` is filtered in `usePatientsQueryParams`.

### `src/pages/app/patients/patients-list/hooks/use-patients-query-params.ts`

**Problem**: Returns `status`, `gender`, `filter`, `sessionVolume` even when `null` or empty, sending `null` values as query params. `sessionVolume: 'all'` must also be blocked.

**Fix** — conditional spread to omit absent/invalid values:
```typescript
export function usePatientsQueryParams(): PatientsQueryParams {
    const { filters } = usePatientFilters()

    return {
        pageIndex: filters.pageIndex,
        perPage:   filters.perPage,
        order:     filters.order,
        ...(filters.filter                                          ? { filter: filters.filter }               : {}),
        ...(filters.status                                          ? { status: filters.status }               : {}),
        ...(filters.gender                                          ? { gender: filters.gender }               : {}),
        ...(filters.sessionVolume && filters.sessionVolume !== 'all'
                                                                    ? { sessionVolume: filters.sessionVolume } : {}),
    }
}
```

---

## Area 4 — Form & Avatar Correctness (PLR-11, PLR-15, PLR-16, PLR-21)

### `src/pages/app/patients/patients-list/register-patients/steps/patient-avatar-upload.tsx`

**Problem**: The `useEffect` clears the preview for any value that is not a `data:` URI or UUID. HTTP/HTTPS URLs from the backend are discarded, showing initials instead of the patient's photo.

**Fix** — add `directUrl` local state for HTTP/HTTPS; use it as `src` fallback alongside the blob preview:
```typescript
const [directUrl, setDirectUrl] = useState<string | null>(null)

useEffect(() => {
    if (!defaultValue) { clear(); setDirectUrl(null); return }

    if (defaultValue.startsWith("http://") || defaultValue.startsWith("https://")) {
        setDirectUrl(defaultValue)
        clear()
        return
    }

    setDirectUrl(null)
    if (!defaultValue.startsWith("data:") && !UUID_RE.test(defaultValue)) { clear(); return }
    void loadFromUrl(defaultValue)
}, [defaultValue, clear, loadFromUrl])

const displayUrl = previewUrl ?? directUrl
```

Replace every `previewUrl` reference in JSX with `displayUrl`.

### `src/pages/app/patients/patients-list/register-patients/register-patients.tsx`

**Problem**: `StepBasicData` initializes `birthInput` via `useState(() => getValues("dateOfBirth"))` — a one-time snapshot at mount. When patient data loads and `methods.reset()` runs, the form value updates but `birthInput` stays stale/empty.

**Fix** — add `key={patient?.id ?? 'new'}` to `StepBasicData`. When patient id changes from undefined to the actual id, React remounts the component and `useState` reinitializes with the correct value from the now-populated form.

```tsx
// Before
{step === 1 && <StepBasicData onAvatarSelect={setAvatarFile} patient={patient} />}
// After
{step === 1 && <StepBasicData key={patient?.id ?? 'new'} onAvatarSelect={setAvatarFile} patient={patient} />}
```

This is safe because all form field values live in `useFormContext`, not in `StepBasicData`'s local state. The remount preserves `firstName`, `lastName`, etc.; only `birthInput` (the display string) is re-derived.

---

## Area 5 — Safety & Quality (PLR-17, PLR-18, PLR-19)

### `src/utils/renderMarkdown.ts`

**Problem**: Link hrefs are inserted raw — `javascript:alert(1)` passes through unblocked into `dangerouslySetInnerHTML`.

**Fix** — add `sanitizeHref` that allows only `http:`, `https:`, and `mailto:`:
```typescript
const SAFE_HREF_RE = /^https?:|^mailto:/i

function sanitizeHref(url: string): string {
    return SAFE_HREF_RE.test(url.trimStart()) ? url : '#'
}
```

Update the link replacement in `applyInline`:
```typescript
// Before
.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
// After
.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, text, url) =>
    `<a href="${sanitizeHref(url)}" target="_blank" rel="noopener noreferrer">${text}</a>`)
```

### `src/pages/app/patients/patients-list/patients-list.tsx`

**Fix — nonfunctional buttons**: add `disabled` and `cursor-not-allowed` (do not remove — avoids layout shift):
```tsx
<button type="button" disabled className="pl-action-btn opacity-50 cursor-not-allowed">
    <Upload className="size-4" />
    Importar
</button>
```
Apply same pattern to Exportar and Colunas buttons.

**Fix — "Novos 30 dias" MetricCard**: remove the entire block (hardcoded `value="—"` and `sub="24%"`).

**Fix — hardcoded subs**: remove `sub` and `subTrend` from Ativos and Arquivados cards:
```tsx
<MetricCard icon={...} iconBg="bg-emerald-500/10" value={activeCount} label="Ativos" isLoading={loadingMetrics} />
<MetricCard icon={...} iconBg="bg-red-500/10" value={archivedCount} label="Arquivados" isLoading={loadingMetrics} />
```

### Mojibake strings (PLR-18)

Grep all files under `src/pages/app/patients/patients-list/` for patterns `Ã`, `â€`, `Ã§`. Fix by restoring correct UTF-8 Portuguese characters. Save files as UTF-8 without BOM.

---

## Area 6 — Dead Code (PLR-20)

### `use-create-patient-draft.ts`

Grep for `useCreatePatientDraft` across the project. If zero references (the commented-out line in `patients-list.tsx` confirms it's unused), delete `src/pages/app/patients/patients-list/register-patients/hooks/use-create-patient-draft.ts`.

### `export-pdf-button.tsx`

Grep for `ExportPDFButton` and `export-pdf-button`. Not imported in `patients-details.tsx` (confirmed by reading the file). Delete `src/pages/app/patients/patients-list/components/details/export-pdf-button.tsx` if grep returns zero results.

---

## Data Models

No new models introduced. Existing types reused:

### `SessionItem` — `src/types/patient.ts`
```typescript
interface SessionItem {
    id: string
    date: string
    sessionDate: string
    createdAt: string
    theme: string
    duration: string
    status: 'Concluída' | 'Pendente'
    content: string | null
}
```
Used to replace `any` in `selectedSession` state and session callbacks in `patients-details.tsx`.

### `PatientStatus` / `Gender` — `src/types/patient.ts`
Used to build `VALID_STATUSES` / `VALID_GENDERS` validation arrays in `use-patient-filters.ts`. Types themselves are unchanged.

---

## Error Handling

| Scenario | Handling | Spec ref |
|---|---|---|
| `toggleStatus` optimistic rollback | `onError` already restores snapshot; no change needed | PLR-11 |
| Edit submit while patient loading | `isEditLoading` disables submit button | PLR-16 |
| `parseISO` invalid date in sessions | Guard with `isValid()` before `format()` | PLR-23 |
| `javascript:` href in markdown notes | `sanitizeHref` returns `'#'` for unsafe protocols | PLR-17 |
| Avatar HTTP URL — no fetch needed | `directUrl` used as direct `src`; no error path | PLR-15 |

---

## Tech Decisions

| Decision | Choice | Rationale |
|---|---|---|
| No centralized `query-keys.ts` file | Inline string literals, fixed to be consistent | Spec doesn't require it; new file is new abstraction; inline literals are readable after fixing |
| `key` prop for `birthInput` sync | Remount `StepBasicData` when `patient?.id` changes | Simpler than `useWatch` + typing guard; form state is in context so remount is safe |
| `directUrl` state for HTTP avatars | Local state alongside `useImagePreview` | Avoids modifying the shared `useImagePreview` hook; zero blast radius |
| Regex for href sanitization | `SAFE_HREF_RE.test(url.trimStart())` | No `new URL()` — avoids throwing on relative/malformed URLs; sufficient for the threat model |
| `VALID_STATUSES` / `VALID_GENDERS` arrays | Module-level constants in `use-patient-filters.ts` | Colocated with validation logic; no need to export |
| Disable nonfunctional buttons vs remove | Add `disabled` attribute | Removing changes grid layout; `disabled` signals intent without visual surprise |

---

## Verification

```bash
npm run build   # must exit 0
npm run lint    # must exit 0 (or only pre-existing warnings)
```

Manual checklist (browser DevTools Network tab open):

1. `npx tsc --noEmit` → 0 errors
2. Create patient → metrics cards update without page refresh
3. Archive active patient → row immediately shows "Arquivado"; Reactivate → immediately shows "Ativo"
4. Set `?status=GARBAGE` in URL → network request has no `status` param
5. Click "Ativos" → `status=ACTIVE` in URL and request; click "Todos" → no status param in request
6. Network tab → no `sortBy` param, no `null` query param values
7. Open edit modal → submit button disabled while data loads; enabled after patient loads with correct form data
8. Edit patient with avatar → photo renders in avatar preview (not initials)
9. Open edit form for patient with birth date → date field shows correct value immediately
10. Type `[x](javascript:void(0))` in notes editor → preview renders `href="#"` not `javascript:`
11. No `/attachments/patient/null` request in network tab
12. Importar/Exportar/Colunas buttons are visually disabled; "Novos 30 dias" card is absent
13. No garbled characters visible in patients list UI
