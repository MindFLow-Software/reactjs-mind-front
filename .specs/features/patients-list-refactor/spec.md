# Patients List Refactor — Specification

## Problem Statement

`patients-list.tsx` is a 265-line monolith that owns filter state, pagination, two queries, dialog state,
and metrics computation inline. The filter hook uses UI-only sentinel values (`'all'`, `'active'`,
`'inactive'`) that propagate directly into API payloads, breaking the backend contract. The `status`
filter is currently commented out as a workaround. `sortBy` is sent as a query param but the backend
does not support it. The result is a component that is hard to read, fragile to change, and incorrect
at the API boundary.

## Goals

- [ ] `patients-list.tsx` becomes a clean orchestrator: header, query, metrics, table, pagination, dialogs — nothing else
- [ ] URL search params are the single source of truth for all filter state
- [ ] GET /patients receives only backend-valid parameters; no UI sentinel values ever reach the API
- [ ] `status` filter is re-enabled with backend-correct values
- [ ] `sortBy` is removed from the backend payload; `order` remains as `"asc" | "desc"`
- [ ] `gender` and `sessionVolume` are wired cleanly in filters and query
- [ ] All query keys include every param that affects the response
- [ ] Changing any filter resets `pageIndex` to 0
- [ ] TypeScript/lint/build pass with zero errors after the refactor

## Out of Scope

| Feature | Reason |
|---------|--------|
| Visual redesign of the patients table | Separate F13 redesign spec exists; do not touch layout |
| Adding new filter UI elements | Only align existing filters to backend; no new UX |
| Changing API endpoint or backend | Frontend alignment only |
| Virtualisation / performance optimisation | Tracked in STATE.md D11; separate concern |
| register-patients feature | Already refactored; do not touch |

---

## User Stories

### P1: Backend-aligned filter hook ⭐ MVP

**User Story**: As a developer, I want `use-patient-filters.ts` to return only backend-valid values so that no invalid parameter ever reaches the API.

**Why P1**: The root cause of the status filter being commented out. Fixing this unblocks all other filter stories.

**Acceptance Criteria**:

1. WHEN `status` is in the "all" visual state THEN the hook SHALL omit `status` from the returned params object (not pass `undefined` or `"all"`)
2. WHEN `status` is set to an active filter THEN the hook SHALL return one of `"PENDING" | "ACTIVE" | "REJECTED" | "BLOCKED"`
3. WHEN `gender` is set THEN the hook SHALL return one of `"OTHER" | "FEMININE" | "MASCULINE"`
4. WHEN `sessionVolume` is set THEN the hook SHALL return the raw string value
5. WHEN no sort is set THEN `order` SHALL be omitted from params
6. WHEN sort is set THEN `order` SHALL be `"asc"` or `"desc"` only — `sortBy` SHALL NOT be included in returned params
7. WHEN any filter changes THEN `pageIndex` SHALL reset to `0`

**Independent Test**: Call `usePatientFilters()` with status `'ACTIVE'` set in URL — verify the returned object has `status: 'ACTIVE'` and no `sortBy` key. Set status to visual "all" state — verify `status` key is absent from params.

---

### P1: Clean orchestrator (patients-list.tsx) ⭐ MVP

**User Story**: As a developer, I want `patients-list.tsx` to be a pure orchestrator so that its responsibilities are immediately visible at a glance.

**Why P1**: The primary readability and maintainability goal of this refactor.

**Acceptance Criteria**:

1. WHEN reading `patients-list.tsx` THEN it SHALL contain only: header/actions block, query invocations, metrics block, table block, pagination block, and dialog block
2. WHEN reading `patients-list.tsx` THEN it SHALL contain zero inline type declarations
3. WHEN reading `patients-list.tsx` THEN it SHALL contain zero raw `useQuery` calls — queries SHALL be encapsulated in dedicated hooks
4. WHEN reading `patients-list.tsx` THEN it SHALL contain no business logic (no filter transformation, no page calculation, no metric derivation)
5. WHEN `patients-list.tsx` is under 120 lines THEN this criterion SHALL be met

**Independent Test**: Count lines in `patients-list.tsx` after refactor. Read the file top-to-bottom; each block should be self-described by a named hook or component.

---

### P1: Correct GET /patients payload ⭐ MVP

**User Story**: As a developer, I want the API call to send only parameters that the backend schema accepts so that no request is rejected or silently mishandled.

**Why P1**: Currently the API receives `sortBy` (unknown to backend) and never receives `status`, `gender`, or `sessionVolume`.

**Acceptance Criteria**:

1. WHEN `getPatients()` is called THEN it SHALL send `pageIndex, perPage` always
2. WHEN `filter` is non-empty THEN it SHALL be included; WHEN empty THEN it SHALL be omitted
3. WHEN `status` is provided THEN it SHALL be one of `"PENDING" | "ACTIVE" | "REJECTED" | "BLOCKED"`; WHEN omitted THEN the `status` query param SHALL be absent
4. WHEN `gender` is provided THEN it SHALL be one of `"OTHER" | "FEMININE" | "MASCULINE"`
5. WHEN `sessionVolume` is provided THEN it SHALL be included as a string
6. WHEN `order` is provided THEN it SHALL be `"asc"` or `"desc"`
7. WHEN `sortBy` is present in any caller THEN it SHALL NOT be forwarded to the HTTP request
8. WHEN a network request fires THEN the browser DevTools network tab SHALL show no `sortBy` param and no sentinel values like `"all"`, `"active"`, or `"inactive"`

**Independent Test**: Open DevTools Network tab, apply a status filter → verify the `status` query param is a backend enum value. Clear filter → verify `status` param is absent.

---

### P1: Stable, complete query keys ⭐ MVP

**User Story**: As a developer, I want query keys to include every parameter that affects the API response so that React Query caching is correct and filter changes always trigger a fresh fetch.

**Why P1**: Incomplete query keys cause stale data to be served after filter changes.

**Acceptance Criteria**:

1. WHEN any filter param changes (filter, status, gender, sessionVolume, order, pageIndex, perPage) THEN the query key SHALL change and React Query SHALL refetch
2. WHEN the same filter combination is revisited THEN React Query SHALL serve cached data without a network request (within staleTime)
3. WHEN `pageIndex` changes alone THEN only the page query SHALL refetch, not the metrics query
4. WHEN filters change THEN both the list query AND the metrics query SHALL use the same base filter key shape

**Independent Test**: In React Query DevTools, change a filter — observe the query key changes and a new network request fires. Navigate to page 2 and back to page 1 — observe cache hit (no network request).

---

### P1: Search debounce correctness ⭐ MVP

**User Story**: As a clinician, I want the search input to debounce correctly so that typing does not fire an API request per keystroke.

**Why P1**: Currently the debounce implementation may cause duplicate refetches due to the filter/URL sync pattern.

**Acceptance Criteria**:

1. WHEN the user types in the search field THEN no API request SHALL fire until 400ms after the last keystroke
2. WHEN the debounced value settles THEN exactly one API request SHALL fire
3. WHEN the search changes THEN `pageIndex` SHALL reset to `0` before the debounced request fires
4. WHEN the user clears the search THEN the filter SHALL be removed from the URL and an unfiltered request SHALL fire

**Independent Test**: Open Network tab. Type "Ana" rapidly. Verify exactly one request fires 400ms after last character, with `filter=Ana` and `pageIndex=0`.

---

### P2: Extracted hook layer

**User Story**: As a developer, I want dedicated hooks for query params and data fetching so that the orchestrator stays thin even as the feature grows.

**Why P2**: Separation of concerns — not strictly required for correctness but required for the readability goal.

**Acceptance Criteria**:

1. WHEN reading the codebase THEN `usePatientsQueryParams` SHALL exist and return all backend-valid params derived from URL state
2. WHEN reading the codebase THEN `usePatientsListQuery` SHALL exist and own the `useQuery` call for the patient list
3. WHEN reading the codebase THEN `usePatientsMetrics` SHALL exist and own the status count query
4. WHEN reading the feature folder THEN `patients-list.types.ts` SHALL exist with all inline type aliases removed from components
5. WHEN reading the feature folder THEN `patients-list.helpers.ts` SHALL exist with all pure transformation functions

**Independent Test**: Delete import for `usePatientsListQuery` in `patients-list.tsx` — TypeScript SHALL error. The hook should be the only place the raw `useQuery` for patients is called.

---

### P2: CSS extraction for JSX clarity

**User Story**: As a developer, I want a `patients-list.css` file with semantic class names so that JSX does not contain large Tailwind class strings.

**Why P2**: Reduces visual noise in JSX; consistent with the register-patients CSS pattern.

**Acceptance Criteria**:

1. WHEN reading `patients-list.tsx` THEN no Tailwind class string SHALL exceed ~4 utility classes inline
2. WHEN reading `patients-list.css` THEN classes SHALL use `@layer components` and `@apply`
3. WHEN reading `patients-list.css` THEN class names SHALL use the `pl-` prefix (patients-list) to avoid global collisions
4. WHEN reading `patients-table-filters.tsx` THEN extracted classes SHALL follow the same CSS pattern

**Independent Test**: Read `patients-list.tsx` — no className attribute should be unreadable at a glance.

---

### P2: Aligned filter UI options

**User Story**: As a clinician, I want the filter pills to map to real backend statuses so that selecting "Ativos" sends `status=ACTIVE` to the API, not a broken sentinel.

**Why P2**: This is the UX surface of the P1 backend contract fix.

**Acceptance Criteria**:

1. WHEN the clinician clicks "Ativos" THEN the URL SHALL contain `status=ACTIVE` and the API SHALL receive `status=ACTIVE`
2. WHEN the clinician clicks "Todos" THEN the `status` param SHALL be absent from URL and API
3. WHEN the clinician clicks "Arquivados" / "Bloqueados" THEN the URL and API SHALL reflect the correct backend enum
4. WHEN the filter is visually "Todos" THEN `status` SHALL NOT appear in the browser network request

**Independent Test**: Click each status pill. Check URL bar and Network tab — verify 1:1 correspondence between visual label and backend enum value.

---

### P3: Gender and sessionVolume filter wiring

**User Story**: As a clinician, I want to filter patients by gender and session volume using the advanced filters panel so that I can segment my patient list.

**Why P3**: API supports these; hook needs to wire them; UI already has a placeholder. Not MVP because the advanced filters panel is not yet built.

**Acceptance Criteria**:

1. WHEN `gender` is set in URL params THEN the query SHALL include `gender` with the correct backend enum value
2. WHEN `sessionVolume` is set in URL params THEN the query SHALL include `sessionVolume`
3. WHEN the advanced filter panel is added in a future feature THEN the hook SHALL already support these params without changes

**Independent Test**: Manually set `?gender=FEMININE` in the URL. Verify the network request includes `gender=FEMININE`.

---

## Edge Cases

- WHEN `pageIndex` goes below 0 (URL manipulation) THEN the hook SHALL clamp it to `0`
- WHEN `perPage` is not a positive integer THEN the hook SHALL use the default of `10`
- WHEN the API returns an empty `patients` array THEN the table SHALL show the correct empty state (with or without active filters)
- WHEN the search returns no results THEN `pageIndex` SHALL remain `0` and the empty state SHALL reflect the active filter
- WHEN the clinician navigates back to the list after visiting a patient detail THEN the URL filter state SHALL be restored (URL-as-state handles this automatically)
- WHEN multiple filters are active simultaneously THEN all SHALL be reflected in the query key and API payload

---

## Files to Create / Modify

### New files

| File | Purpose |
|------|---------|
| `src/pages/app/patients/patients-list/hooks/use-patients-query-params.ts` | Derives backend-valid params from URL state |
| `src/pages/app/patients/patients-list/hooks/use-patients-list-query.ts` | Owns the `useQuery` call for patient list |
| `src/pages/app/patients/patients-list/hooks/use-patients-metrics.ts` | Owns the status-count metrics query |
| `src/pages/app/patients/patients-list/patients-list.types.ts` | Extracted type aliases |
| `src/pages/app/patients/patients-list/patients-list.helpers.ts` | Pure transformation functions |
| `src/pages/app/patients/patients-list/patients-list.css` | Semantic CSS classes with `@apply` |

### Modified files

| File | Change |
|------|--------|
| `src/hooks/use-patient-filters.ts` | Replace UI sentinels with backend enums; add gender + sessionVolume; remove sortBy from returned params |
| `src/api/patients/get-patients.ts` | Fix param types; remove sortBy; ensure status/gender/sessionVolume are correctly included/omitted |
| `src/pages/app/patients/patients-list/patients-list.tsx` | Reduce to clean orchestrator using extracted hooks |
| `src/pages/app/patients/patients-list/components/table/patients-table-filters.tsx` | Align status pill options to backend enums; consume updated hook |
| `src/types/patient.ts` | Ensure `PatientStatus` and `Gender` enums are exported correctly (likely already correct) |

---

## Requirement Traceability

| Requirement ID | Story | Phase | Status |
|---------------|-------|-------|--------|
| PLR-01 | P1: Backend-aligned filter hook | Implementing | Pending |
| PLR-02 | P1: Clean orchestrator | Implementing | Pending |
| PLR-03 | P1: Correct GET /patients payload | Implementing | Pending |
| PLR-04 | P1: Stable complete query keys | Implementing | Pending |
| PLR-05 | P1: Search debounce correctness | Implementing | Pending |
| PLR-06 | P2: Extracted hook layer | Implementing | Pending |
| PLR-07 | P2: CSS extraction | Implementing | Pending |
| PLR-08 | P2: Aligned filter UI options | Implementing | Pending |
| PLR-09 | P3: Gender and sessionVolume wiring | Implementing | Pending |

---

## Success Criteria

- [ ] GET /patients never receives `sortBy`, `"all"`, `"active"`, or `"inactive"` as query params
- [ ] `status` filter is live and uses backend enum values
- [ ] `patients-list.tsx` is under 120 lines
- [ ] All filter changes reset `pageIndex` to `0`
- [ ] Exactly one network request fires 400ms after search input settles
- [ ] TypeScript build completes with zero errors (`tsc --noEmit`)
- [ ] Table, filters, pagination, and dialogs continue to function visually as before
