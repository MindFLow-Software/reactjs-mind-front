# Patients List Refactor — Specification

## Problem Statement

`src/pages/app/patients/patients-list` accumulates correctness bugs, broken TypeScript contracts,
stale React Query invalidation, and misleading UI state that have compounded over several iterations.
The feature still handles all required workflows (listing, filtering, create/edit, archive/reactivate,
attachments, details, invite), but internal consistency is broken in ways that cause silent data loss,
wrong UI state after mutations, TypeScript compilation failures, and hard-to-debug filter behavior.
This refactor fixes every identified issue without changing user-visible workflows or API endpoints.

## Goals

- [ ] Every touched file passes TypeScript strict mode — zero `any`, zero nonexistent type imports
- [ ] React Query cache is correctly invalidated after every mutation that affects related queries
- [ ] URL query state is the single source of truth for list filters, pagination, and sort direction
- [ ] API payloads are typed end-to-end with no silent field drops or wrong field names
- [ ] No user-visible workflow is broken; all acceptance criteria from the validation checklist pass
- [ ] `npm run build` and `npm run lint` exit clean after all changes

## Out of Scope

| Feature | Reason |
|---------|--------|
| Visual redesign of patients list or table | Separate redesign spec; no layout changes |
| Adding new filter panels (gender, sessionVolume UI) | API wiring only; UI panel is a future feature |
| New API endpoints or backend schema changes | Frontend alignment only |
| Virtualisation / performance optimisation | Tracked in STATE.md; separate concern |
| Unrelated features (patients hub, records, auth) | Only touch shared files required by this feature |
| react-dropzone installation | Keep existing useFileSelection hook; only simplify if it reduces code |

---

## User Stories

### P1: Query key centralization and metrics invalidation ⭐ MVP

**User Story**: As a developer, I want all React Query keys for the patients domain to be defined in
one place so that mutations always invalidate the right caches.

**Why P1**: After create, update, archive, or reactivate, `patients-metrics` is never invalidated, so
metric cards show stale counts. `patients-table-row.tsx` also invalidates `patients-count`, a key that
does not exist in this feature, wasting a roundtrip.

**Acceptance Criteria**:

1. WHEN a patient is created THEN `["patients"]` and `["patients-metrics"]` SHALL both be invalidated
2. WHEN a patient is updated THEN `["patients"]`, `["patient", id]`, `["attachments", id]`, and `["patients-metrics"]` SHALL all be invalidated
3. WHEN archive or reactivate succeeds THEN `["patients"]`, `["patient", id]`, `["patients-metrics"]`, and `["patient-details", id]` SHALL all be invalidated
4. WHEN any mutation runs THEN `["patients-count"]` SHALL NOT be invalidated (key does not exist here)
5. WHEN reading any mutation file THEN query keys SHALL be string literals consistent across all callers

**Independent Test**: Create a patient. Without refreshing, verify the metrics cards update. Archive a patient. Verify archived count updates immediately.

**Requirement ID**: PLR-04, PLR-12

---

### P1: TypeScript contract alignment ⭐ MVP

**User Story**: As a developer, I want all files in the patients-list feature to compile without errors
so that CI does not fail and type safety is enforced.

**Why P1**: `patients-list.types.ts` imports `Patient` from `get-patients.ts`, but that file exports
only `Ipatient` and `GetPatientsResponse`. The import causes a TypeScript failure in the entire feature.

**Acceptance Criteria**:

1. WHEN `patients-list.types.ts` references the individual patient type THEN it SHALL import `Ipatient` from `@/api/patients/get-patients` or use `GetPatientsResponse['patients'][number]`
2. WHEN any file in `patients-list/**` uses a type from another module THEN that type SHALL exist and be exported from that module
3. WHEN `npm run build` runs THEN it SHALL exit 0 with zero TypeScript errors in the patients-list feature
4. WHEN any touched file uses `any` THEN it SHALL be replaced with the correct inferred or explicit type

**Independent Test**: Run `npx tsc --noEmit` — zero errors in patients-list related files.

**Requirement ID**: PLR-10

---

### P1: Backend-aligned filter hook and URL param validation ⭐ MVP

**User Story**: As a developer, I want `use-patient-filters.ts` to return only backend-valid enum values
and validate URL params before using them so that invalid URL state cannot corrupt API calls.

**Why P1**: The hook casts `searchParams.get("status")` directly to `PatientStatus` without checking
if the value is a valid enum member. A manually set `?status=INVALID` passes into the API silently.

**Acceptance Criteria**:

1. WHEN `status` param in URL is a valid `PatientStatus` value THEN the hook SHALL return it typed as `PatientStatus`
2. WHEN `status` param in URL is absent or invalid THEN the hook SHALL return `null` for status
3. WHEN `gender` param in URL is invalid THEN the hook SHALL return `null` for gender
4. WHEN `status` is `null` THEN the setter SHALL remove the `status` key from the URL entirely
5. WHEN any filter setter is called THEN it SHALL clone params before mutation (no in-place URLSearchParams mutation outside of `setSearchParams` callback)
6. WHEN any filter changes THEN `page` SHALL reset to `"1"` in the URL

**Independent Test**: Manually set `?status=GARBAGE` in the URL. Network request SHALL have no `status` param.

**Requirement ID**: PLR-01, PLR-22

---

### P1: Correct GET /patients payload ⭐ MVP

**User Story**: As a developer, I want the API call to send only parameters the backend accepts so that
no `sortBy`, `null`, or invalid enum value ever reaches the server.

**Why P1**: `usePatientsQueryParams` omits `sortBy` from the API params but `use-patient-filters` reads
it from URL. The gap is inconsistent. Additionally, `order` should only be sent when meaningful.

**Acceptance Criteria**:

1. WHEN `getPatients()` is called THEN it SHALL always include `pageIndex` and `perPage`
2. WHEN `filter` is non-empty THEN it SHALL be included; WHEN empty THEN it SHALL be omitted
3. WHEN `status` is a valid `PatientStatus` THEN it SHALL be included; WHEN null THEN the key SHALL be absent
4. WHEN `gender` or `sessionVolume` are set THEN they SHALL be included with correct enum values
5. WHEN `order` is provided THEN it SHALL be `"asc"` or `"desc"` only
6. WHEN inspecting a network request THEN `sortBy` SHALL NOT appear as a query parameter
7. WHEN inspecting a network request THEN no value of `"all"`, `"active"`, `"inactive"`, or `null` SHALL appear as a query param value

**Independent Test**: Open DevTools Network. Apply status filter "Ativos" → verify `status=ACTIVE`. Apply no filter → verify `status` key absent.

**Requirement ID**: PLR-03

---

### P1: Fix optimistic status toggle ⭐ MVP

**User Story**: As a clinician, I want archive and reactivate to show the correct optimistic state so
that the UI immediately reflects the actual next status.

**Why P1**: The optimistic update in `patients-table-row.tsx` always sets `status: 'BLOCKED'` and
`isActive: false`, even when the action is reactivating a blocked patient. After reactivation the row
briefly shows the wrong badge before the invalidation refetch corrects it.

**Acceptance Criteria**:

1. WHEN archive is triggered THEN the optimistic update SHALL set `status: 'BLOCKED'` and `isActive: false`
2. WHEN reactivate is triggered THEN the optimistic update SHALL set `status: 'ACTIVE'` and `isActive: true`
3. WHEN the mutation fails THEN the optimistic snapshot SHALL be rolled back via `onError`
4. WHEN both archive and reactivate succeed THEN the row status badge SHALL immediately show the correct label

**Independent Test**: Archive an active patient — row immediately shows "Arquivado". Reactivate — row immediately shows "Ativo". Both before the refetch completes.

**Requirement ID**: PLR-11

---

### P1: Attachment query enabled guard ⭐ MVP

**User Story**: As a developer, I want the attachment query to never fire with a null patient ID so
that no spurious `/attachments/patient/null` request is sent.

**Why P1**: `getPatientAttachments` accepts `string | null` but makes the API call regardless. When the
details modal opens before `patientId` is resolved, the request fires with `null` in the URL.

**Acceptance Criteria**:

1. WHEN `patientId` is `null` or `undefined` THEN the attachment query SHALL NOT fire (use `enabled: Boolean(patientId)`)
2. WHEN `patientId` becomes available THEN the query SHALL fire exactly once
3. WHEN inspecting network requests THEN no request to `/attachments/patient/null` SHALL appear

**Independent Test**: Open DevTools before opening a details modal. Confirm no `/null` request fires.

**Requirement ID**: PLR-14

---

### P1: Edit mode correctness in submit hook ⭐ MVP

**User Story**: As a clinician, I want editing a patient to always update (not create) even if patient
data is still loading so that edits are never accidentally submitted as new patients.

**Why P1**: `use-patient-submit.ts` uses `!!patient` to determine create vs edit mode. If the edit modal
opens and `patient` data is still fetching (undefined), `!!patient` is `false` and a submit would
trigger the create path.

**Acceptance Criteria**:

1. WHEN `patientId` prop is provided THEN the submit hook SHALL use the update mutation regardless of whether `patient` data has loaded
2. WHEN `patientId` is absent THEN the submit hook SHALL use the create mutation
3. WHEN `patientId` is present but `patient` data has not yet loaded THEN the submit button SHALL be disabled
4. WHEN edit data finishes loading THEN form defaults SHALL be reset to the loaded patient data

**Independent Test**: Open the edit modal for a patient. Before data loads, the submit button SHALL be disabled. After load, the form SHALL show the patient's current data.

**Requirement ID**: PLR-16

---

### P2: Aligned filter UI options

**User Story**: As a clinician, I want status filter pills to map to real backend values so that
selecting "Ativos" reliably filters to active patients.

**Why P2**: This is the visible surface of the P1 backend contract fix. Status pills must show
`null` (Todos), `ACTIVE` (Ativos), and `BLOCKED` (Arquivados).

**Acceptance Criteria**:

1. WHEN clicking "Ativos" THEN URL SHALL contain `status=ACTIVE` and API SHALL receive `status=ACTIVE`
2. WHEN clicking "Todos" THEN `status` SHALL be absent from URL and API request
3. WHEN clicking "Arquivados" THEN URL and API SHALL contain `status=BLOCKED`
4. WHEN filter is active THEN the active pill SHALL have visual active state; inactive pills SHALL not

**Independent Test**: Click each pill. Check URL bar and Network tab for 1:1 correspondence with backend enum.

**Requirement ID**: PLR-08

---

### P2: Search debounce correctness

**User Story**: As a clinician, I want the search input to debounce correctly so that typing does not
fire an API request per keystroke.

**Why P2**: Debounce `useEffect` may include `setFilters` in its dependency array, causing extra
refetches. `setFilters` is now stabilized via `useCallback`, but the dep array must be verified.

**Acceptance Criteria**:

1. WHEN the user types in the search field THEN no API request SHALL fire until 400ms after the last keystroke
2. WHEN the debounced value settles THEN exactly one API request SHALL fire with the correct `filter` param
3. WHEN search changes THEN `page` SHALL reset to `"1"` before the request fires
4. WHEN search is cleared THEN `filter` SHALL be removed from URL and an unfiltered request SHALL fire

**Independent Test**: Open Network tab. Type "Ana" fast. Verify exactly one request fires ~400ms after last keystroke with `filter=Ana` and `pageIndex=0`.

**Requirement ID**: PLR-05

---

### P2: Extracted hook layer

**User Story**: As a developer, I want dedicated hooks for query params, list data, and metrics so
that `patients-list.tsx` stays thin as the feature grows.

**Why P2**: Separation of concerns. Not strictly required for correctness, but required for the
readability goal.

**Acceptance Criteria**:

1. WHEN reading the codebase THEN `usePatientsQueryParams` SHALL exist and return all backend-valid params
2. WHEN reading the codebase THEN `usePatientsListQuery` SHALL own the `useQuery` call for the patient list
3. WHEN reading the codebase THEN `usePatientsMetrics` SHALL own the metric count queries
4. WHEN reading `patients-list.types.ts` THEN it SHALL contain no import of a nonexistent type

**Independent Test**: Delete `usePatientsListQuery` import in `patients-list.tsx` — TypeScript SHALL error.

**Requirement ID**: PLR-06

---

### P2: Avatar preview for stored patient data

**User Story**: As a clinician, I want the patient avatar to display correctly when editing an existing
patient so that I can see the current photo before deciding to replace it.

**Why P2**: `patient-avatar-upload.tsx` only accepts `data:` URIs or UUID strings as valid preview
inputs. If the backend stores an HTTP URL or a non-UUID key, the component clears the preview,
showing initials instead of the photo.

**Acceptance Criteria**:

1. WHEN `defaultValue` is a data URI THEN the avatar preview SHALL display it
2. WHEN `defaultValue` is a UUID THEN the avatar preview SHALL load it via `/attachments/{uuid}`
3. WHEN `defaultValue` is an HTTP/HTTPS URL THEN the avatar preview SHALL display it directly (not clear)
4. WHEN `defaultValue` is absent or empty THEN the component SHALL show the initials fallback

**Independent Test**: Edit a patient that has an avatar. The avatar photo SHALL appear in the preview, not initials.

**Requirement ID**: PLR-15

---

### P2: dateOfBirth display sync after edit reset

**User Story**: As a clinician, I want the birth date field to show the correct date when opening the
edit form so that I don't see a blank or stale value.

**Why P2**: `step-basic-data.tsx` initialises `birthInput` local state from `getValues("dateOfBirth")`
at mount time. When the edit form opens and patient data loads asynchronously, the form is reset but
`birthInput` is not re-synced, leaving the displayed date blank or stale.

**Acceptance Criteria**:

1. WHEN the edit modal opens and patient data loads THEN `birthInput` SHALL reflect the patient's actual `dateOfBirth`
2. WHEN the form is reset via `reset(buildPatientDefaults(patient))` THEN the date display field SHALL update
3. WHEN `dateOfBirth` is null THEN the display field SHALL show empty

**Independent Test**: Open edit form for a patient with a known birth date. The date input SHALL show the date immediately after data loads.

**Requirement ID**: PLR-21

---

### P2: Markdown preview link safety

**User Story**: As a developer, I want the markdown preview renderer to block `javascript:` URIs in
links so that clinical notes cannot execute scripts via crafted links.

**Why P2**: `renderMarkdown` in `src/utils/renderMarkdown.ts` escapes HTML correctly but may not
block `javascript:` href values. `dangerouslySetInnerHTML` with any unsanitized link target is an XSS
vector if the URL is not validated.

**Acceptance Criteria**:

1. WHEN a markdown note contains `[label](javascript:alert(1))` THEN the rendered output SHALL NOT contain `href="javascript:..."`
2. WHEN a safe HTTP/HTTPS link is in the note THEN it SHALL render as a clickable link with `rel="noopener noreferrer"`
3. WHEN an unsafe protocol is detected THEN the link SHALL be rendered as plain text or `href="#"`

**Independent Test**: Enter `[click](javascript:void(0))` in the notes editor. Preview SHALL show no clickable link with a `javascript:` href.

**Requirement ID**: PLR-17

---

### P2: Restore corrupted Portuguese text

**User Story**: As a clinician, I want all UI labels in the patients list to display correctly so that
the interface looks professional and is readable.

**Why P2**: Several strings contain mojibake characters (`Ã`, `â€"`, etc.) caused by double-encoding.
These appear in labels, tooltips, and comments throughout the feature.

**Acceptance Criteria**:

1. WHEN the patients list renders THEN no visible label SHALL contain `Ã`, `â€"`, `Ã§`, or similar UTF-8 mojibake sequences
2. WHEN source files are read THEN Portuguese characters (`ã`, `é`, `ç`, `ó`, etc.) SHALL be stored as correct UTF-8 literals
3. WHEN comments contain Portuguese text THEN they SHALL also use correct UTF-8 encoding

**Independent Test**: Load the patients list. Visually scan all visible text. No garbled characters.

**Requirement ID**: PLR-18

---

### P2: Remove or disable nonfunctional UI actions and hardcoded metrics

**User Story**: As a clinician, I want UI elements to either work or be absent so that I don't click
buttons that do nothing or read metrics that are made up.

**Why P2**: "Importar", "Exportar", "Colunas", "Filtros avançados" buttons have no handlers. The
"Novos 30 dias" metric card hardcodes "—" value and "24%" trend. The "8 este mês" and
"sem sessão há 60 dias" subtitles are hardcoded strings unrelated to any query.

**Acceptance Criteria**:

1. WHEN nonfunctional buttons ("Importar", "Exportar", "Colunas") are not yet implemented THEN they SHALL be removed from the JSX or visually `disabled` with `cursor-not-allowed`
2. WHEN "Filtros avançados" has no handler THEN it SHALL be `disabled` or removed
3. WHEN the "Novos 30 dias" metric has no backing query THEN the card SHALL be removed until a real query exists
4. WHEN metric subtitles are hardcoded THEN they SHALL either be removed or replaced with real derived values
5. WHEN a button is `disabled` THEN it SHALL have `disabled` attribute so assistive technology knows

**Independent Test**: Load the patients list. Every visible button either performs an action or is visually marked as unavailable.

**Requirement ID**: PLR-19

---

### P2: Details and session/PDF component type safety

**User Story**: As a developer, I want patient details, session history, and PDF components to use
typed API response types instead of `any` so that refactors in the API layer are caught at compile time.

**Why P2**: `patients-details.tsx` and related components use `any` for session data and unsafe date
parsing. `ExportPDFButton` is likely unused. Weak types hide bugs and make the component fragile.

**Acceptance Criteria**:

1. WHEN reading `patients-details.tsx` and `evolution-viewer.tsx` THEN zero `any` type usages SHALL remain
2. WHEN session or evolution data is typed THEN the type SHALL derive from the API response type, not a custom duplicate
3. WHEN dates from the API are parsed THEN they SHALL be validated before calling `date-fns` functions (guard against `Invalid Date`)
4. WHEN `ExportPDFButton` has zero import references in the codebase THEN it SHALL be deleted

**Independent Test**: Run `npx tsc --noEmit` — zero `any` errors in details components.

**Requirement ID**: PLR-23

---

### P2: CSS extraction for JSX clarity

**User Story**: As a developer, I want a `patients-list.css` file with semantic `@apply` classes so
that JSX does not contain large Tailwind class strings.

**Why P2**: Consistent with the register-patients CSS pattern already in the codebase.

**Acceptance Criteria**:

1. WHEN reading `patients-list.tsx` THEN no `className` attribute SHALL exceed ~4 utility classes inline
2. WHEN reading `patients-list.css` THEN classes SHALL be under `@layer components` using `@apply`
3. WHEN reading `patients-list.css` THEN class names SHALL use the `pl-` prefix

**Independent Test**: Read `patients-list.tsx` — every `className` is readable at a glance.

**Requirement ID**: PLR-07

---

### P3: Clean orchestrator (patients-list.tsx)

**User Story**: As a developer, I want `patients-list.tsx` to be a pure orchestrator under 120 lines
so that its responsibilities are immediately visible at a glance.

**Why P3**: Primary readability goal — not blocking, but the end state of the refactor.

**Acceptance Criteria**:

1. WHEN reading `patients-list.tsx` THEN it SHALL contain only: imports, hook invocations, and JSX
2. WHEN reading `patients-list.tsx` THEN it SHALL contain zero raw `useQuery` calls
3. WHEN the file is under 120 lines THEN this criterion SHALL be met

**Independent Test**: Count lines in `patients-list.tsx` after refactor.

**Requirement ID**: PLR-02

---

### P3: Dead code removal

**User Story**: As a developer, I want unused hooks and components removed from the patients-list
feature so that the codebase does not contain misleading code.

**Why P3**: `useCreatePatientDraft` in `hooks/use-create-patient-draft.ts` calls
`buildPatientDefaults()` without an argument (TypeScript error) and is not imported anywhere.
If `ExportPDFButton` is also unimported, both should be deleted.

**Acceptance Criteria**:

1. WHEN `use-create-patient-draft.ts` has zero import references in the codebase THEN the file SHALL be deleted
2. WHEN `export-pdf-button.tsx` has zero import references in the codebase THEN the file SHALL be deleted
3. WHEN any other hook or component in patients-list has zero references THEN it SHALL be deleted or flagged

**Independent Test**: `grep -r "useCreatePatientDraft"` returns zero results after deletion.

**Requirement ID**: PLR-20

---

### P3: Gender and sessionVolume filter URL wiring

**User Story**: As a developer, I want `gender` and `sessionVolume` params to be read from and written
to the URL so that a future advanced-filter UI can add them without hook changes.

**Why P3**: API supports these; hook plumbing only; UI panel is a future feature.

**Acceptance Criteria**:

1. WHEN `gender` is set in URL params THEN the query SHALL include `gender` with the correct enum value
2. WHEN `sessionVolume` is set in URL params THEN the query SHALL include it
3. WHEN `clearFilters` is called THEN both SHALL be removed from the URL

**Independent Test**: Manually set `?gender=FEMININE` in URL. Network request includes `gender=FEMININE`.

**Requirement ID**: PLR-09

---

## Edge Cases

- WHEN `pageIndex` in the URL is negative or NaN THEN the hook SHALL clamp it to `0`
- WHEN `perPage` is not a positive integer THEN the hook SHALL use the default of `10`
- WHEN the API returns an empty `patients` array THEN the table SHALL show the correct empty state
- WHEN multiple filters are active simultaneously THEN all SHALL be in the query key and API payload
- WHEN the clinician navigates back from patient details THEN URL filter state SHALL be restored
- WHEN `patientId` is provided but patient fetch is pending THEN the edit form submit SHALL be blocked
- WHEN a date string from the API cannot be parsed THEN `date-fns` SHALL receive a guarded fallback, not an `Invalid Date`
- WHEN a markdown note is empty THEN the preview SHALL show the placeholder, not an empty `dangerouslySetInnerHTML` call

---

## Requirement Traceability

| Requirement ID | Story | Priority | Status |
|---------------|-------|----------|--------|
| PLR-01 | Backend-aligned filter hook + URL validation | P1 | Pending |
| PLR-02 | Clean orchestrator | P3 | Pending |
| PLR-03 | Correct GET /patients payload | P1 | Pending |
| PLR-04 | Query key centralization | P1 | Pending |
| PLR-05 | Search debounce correctness | P2 | Pending |
| PLR-06 | Extracted hook layer | P2 | Pending |
| PLR-07 | CSS extraction | P2 | Pending |
| PLR-08 | Aligned filter UI options | P2 | Pending |
| PLR-09 | Gender and sessionVolume URL wiring | P3 | Pending |
| PLR-10 | TypeScript contract alignment | P1 | Pending |
| PLR-11 | Optimistic status toggle fix | P1 | Pending |
| PLR-12 | Metrics invalidation after mutations | P1 | Pending |
| PLR-13 | N/A — backend uses same English field names as form; no mapper needed | — | Removed |
| PLR-14 | Attachment query enabled guard | P1 | Pending |
| PLR-15 | Avatar preview for stored URLs | P2 | Pending |
| PLR-16 | Edit mode correctness in submit hook | P1 | Pending |
| PLR-17 | Markdown link safety | P2 | Pending |
| PLR-18 | Mojibake text restoration | P2 | Pending |
| PLR-19 | Nonfunctional UI cleanup | P2 | Pending |
| PLR-20 | Dead code removal | P3 | Pending |
| PLR-21 | dateOfBirth display sync after reset | P2 | Pending |
| PLR-22 | URL param enum validation | P1 | Pending |
| PLR-23 | Details/session/PDF type safety | P2 | Pending |

**Coverage**: 22 active requirements, 0 mapped to tasks (tasks.md needs update after this spec), 22 unmapped ⚠️

---

## Success Criteria

- [ ] `npm run build` exits 0 — zero TypeScript errors in patients-list files
- [ ] `npm run lint` exits 0 (or only pre-existing warnings)
- [ ] Metrics cards update after create, edit, archive, and reactivate without page refresh
- [ ] Archive shows "Arquivado" badge immediately; reactivate shows "Ativo" badge immediately
- [ ] Status filter pills send correct backend enum values; "Todos" sends no `status` param
- [ ] Search debounces to one request; clear search sends unfiltered request
- [ ] Pagination updates `pageIndex` correctly; metrics do not refetch on page change
- [ ] Create patient with address → reload edit form → address fields pre-filled → save → network shows `zipCode`/`street`/`city` etc.
- [ ] Edit modal with `patientId` cannot accidentally trigger create while data loads
- [ ] No request to `/attachments/patient/null` appears in network tab
- [ ] Existing patient avatar renders in edit form (not initials)
- [ ] No mojibake characters visible in any patients-list label
- [ ] No nonfunctional buttons without `disabled` state or removal
- [ ] `[click](javascript:alert(1))` in markdown notes does not render as a live JS link
