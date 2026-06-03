# Patients List Refactor — Tasks

**Spec**: `.specs/features/patients-list-refactor/spec.md`
**Design**: `.specs/features/patients-list-refactor/design.md`
**Status**: Ready to execute

---

## Execution Order

TSK-01 (TypeScript) must run first — it unblocks compilation for all other areas.
All P1 tasks after TSK-01 are independently implementable in parallel.
P2 tasks run after all P1 tasks are complete.
P3 tasks run last.

```
TSK-01
  ├── TSK-02 [P]   optimistic toggle + invalidation
  ├── TSK-03 [P]   submit hook edit mode + metrics invalidation
  ├── TSK-04 [P]   filter hook enum validation
  ├── TSK-05 [P]   query params builder (depends on TSK-04)
  └── TSK-06 [P]   attachment query guard

(P1 complete) ──►
  ├── TSK-07 [P]   staleTime config
  ├── TSK-08 [P]   avatar HTTP URL preview
  ├── TSK-09 [P]   dateOfBirth key remount
  ├── TSK-10 [P]   filter UI pills alignment (depends on TSK-04, TSK-05)
  ├── TSK-11 [P]   nonfunctional UI + hardcoded metrics cleanup
  ├── TSK-12 [P]   markdown link sanitization
  └── TSK-13 [P]   mojibake text restoration

(P2 complete) ──►
  ├── TSK-14       dead code removal
  └── TSK-15       gender/sessionVolume URL wiring verification

(All complete) ──►
  TSK-16           final gate check (build + lint + manual)
```

---

## P1 Tasks — Correctness Blockers

### TSK-01 — TypeScript contract alignment
**Req**: PLR-10, PLR-23
**Priority**: P1 — run first; unblocks everything
**Files**:
- `src/pages/app/patients/patients-list/patients-list.types.ts`
- `src/pages/app/patients/patients-list/components/details/patients-details.tsx`

**What**:

`patients-list.types.ts`:
- Replace `import type { Patient } from '@/api/patients/get-patients'` with `import type { Ipatient } from '@/types/patient'`
- Rename every `Patient` reference to `Ipatient`

`patients-details.tsx`:
- Add `SessionItem` to import from `@/types/patient`
- Replace `useState<any | null>(null)` with `useState<SessionItem | null>(null)` for `selectedSession`
- Replace `(session: any)` with `(session: SessionItem)` in `.filter()` and `.map()` callbacks
- Replace the `any` in `IMaskMixin(({ inputRef, ...props }: any) => ...)` with `{ inputRef: React.Ref<HTMLInputElement> } & React.InputHTMLAttributes<HTMLInputElement>`
- Add `isValid` to the `date-fns` import
- Guard `format(parseISO(session.date), ...)` with `session.date && isValid(parseISO(session.date)) ? format(...) : '—'`

**Done when**:
- [ ] `npx tsc --noEmit` exits 0 in patients-list related files with zero type errors
- [ ] Zero `any` usages remain in both files

**Gate**: `npx tsc --noEmit`
**Commit**: `fix(patients-list): align TypeScript contracts; replace any with SessionItem; guard parseISO`

---

### TSK-02 — Fix optimistic status toggle and invalidation
**Req**: PLR-11, PLR-12 (partial)
**Priority**: P1
**Depends on**: TSK-01
**File**: `src/pages/app/patients/patients-list/components/table/patients-table-row.tsx`

**What**:

`onMutate` — derive next state from current `p.isActive`, not hardcoded:
```typescript
{ ...p, status: p.isActive ? 'BLOCKED' : 'ACTIVE', isActive: !p.isActive }
```

`onSettled` — replace `['patients-count']` with correct keys, add `['patients-metrics']`:
```typescript
Promise.all([
    queryClient.invalidateQueries({ queryKey: ['patients'] }),
    queryClient.invalidateQueries({ queryKey: ['patient', id] }),
    queryClient.invalidateQueries({ queryKey: ['patient-details', id] }),
    queryClient.invalidateQueries({ queryKey: ['patients-metrics'] }),
])
```

**Done when**:
- [ ] Archive active patient → row badge immediately shows "Arquivado" before refetch
- [ ] Reactivate blocked patient → row badge immediately shows "Ativo" before refetch
- [ ] Metrics cards update after archive/reactivate without page refresh
- [ ] No `['patients-count']` invalidation call remains

**Gate**: manual browser test + `npx tsc --noEmit`
**Commit**: `fix(patients-table-row): fix optimistic toggle direction; add patients-metrics invalidation`

---

### TSK-03 — Fix edit mode correctness and metrics invalidation in submit hook
**Req**: PLR-16, PLR-12 (partial)
**Priority**: P1
**Depends on**: TSK-01
**Files**:
- `register-patients/hooks/use-patient-submit.ts`
- `register-patients/register-patients.tsx`

**What**:

`use-patient-submit.ts`:
- Add `patientId?: string` to `UsePatientSubmitOptions` interface
- Replace `const isEditMode = !!patient` with `const isEditMode = Boolean(patientId)`
- Add `queryClient.invalidateQueries({ queryKey: ["patients-metrics"] })` to both create and update `Promise.all` invalidation arrays

`register-patients.tsx`:
- Pass `patientId` into `usePatientSubmit({ patientId, patient, ... })`
- Add `const isEditLoading = Boolean(patientId) && !patient`
- Add `disabled={isSubmitting || isEditLoading}` to the submit button
- Remove `buildPatientDefaults` from the `useEffect` dependency array (it's a static function)

**Done when**:
- [ ] Open edit modal → submit button is disabled while patient data loads
- [ ] After patient data loads → button is enabled, form shows correct patient data
- [ ] Create patient → metrics cards update without refresh
- [ ] `patientId` present never routes to create path, even before patient data resolves

**Gate**: manual browser test + `npx tsc --noEmit`
**Commit**: `fix(use-patient-submit): use patientId for edit mode; add patients-metrics invalidation`

---

### TSK-04 — Fix filter hook enum validation
**Req**: PLR-01, PLR-22
**Priority**: P1
**Depends on**: TSK-01
**File**: `src/hooks/use-patient-filters.ts`

**What**:
- Add module-level constants (not exported):
  ```typescript
  const VALID_STATUSES = ['ACTIVE', 'REJECTED', 'PENDING', 'BLOCKED'] as const
  const VALID_GENDERS  = Object.values(Gender)
  ```
- Replace `searchParams.get("status") as PatientStatus` with guarded cast:
  ```typescript
  const rawStatus = searchParams.get("status")
  const status = (VALID_STATUSES as readonly string[]).includes(rawStatus ?? '')
      ? (rawStatus as PatientStatus)
      : null
  ```
- Replace `searchParams.get("gender") as Gender` with same guarded pattern using `VALID_GENDERS`
- Verify: when `status` is `null`, the setter removes the `status` key from URL entirely
- Verify: every setter resets `page` to `"1"` on change
- Verify: setters clone params before mutation (callback form of `setSearchParams`)

**Done when**:
- [ ] Manually set `?status=GARBAGE` in URL → network request has no `status` param
- [ ] Manually set `?gender=BAD` in URL → network request has no gender param
- [ ] Valid `?status=ACTIVE` passes through correctly

**Gate**: manual URL manipulation + `npx tsc --noEmit`
**Commit**: `fix(use-patient-filters): validate status and gender URL params before casting`

---

### TSK-05 — Fix GET /patients query params builder
**Req**: PLR-03
**Priority**: P1
**Depends on**: TSK-04
**File**: `src/pages/app/patients/patients-list/hooks/use-patients-query-params.ts`

**What**:
- Rewrite return using conditional spreads to omit null/empty/invalid values:
  ```typescript
  return {
      pageIndex: filters.pageIndex,
      perPage:   filters.perPage,
      order:     filters.order,
      ...(filters.filter                                              ? { filter: filters.filter }               : {}),
      ...(filters.status                                              ? { status: filters.status }               : {}),
      ...(filters.gender                                              ? { gender: filters.gender }               : {}),
      ...(filters.sessionVolume && filters.sessionVolume !== 'all'   ? { sessionVolume: filters.sessionVolume } : {}),
  }
  ```
- Confirm `sortBy` is NOT in the returned object

**Done when**:
- [ ] Network tab shows no `sortBy` param
- [ ] No `null`, `"all"`, `"active"`, `"inactive"` ever appears as a query param value
- [ ] `status=ACTIVE` appears when "Ativos" is active; `status` key absent when "Todos"

**Gate**: manual Network tab inspection + `npx tsc --noEmit`
**Commit**: `fix(use-patients-query-params): omit null/invalid params; remove sortBy from API payload`

---

### TSK-06 — Attachment query enabled guard
**Req**: PLR-14
**Priority**: P1
**Depends on**: TSK-01
**File**: `register-patients/steps/attachments-list.tsx`

**What**:
- Add `enabled: Boolean(patientId)` to the `useQuery` call for `getPatientAttachments`
- Use non-null assertion `patientId!` in `queryFn` (safe because `enabled` guarantees non-null)

**Done when**:
- [ ] Open DevTools before opening a details modal → no `/attachments/patient/null` request appears in Network tab

**Gate**: manual Network tab inspection + `npx tsc --noEmit`
**Commit**: `fix(attachments-list): guard query with enabled:Boolean(patientId)`

---

## P2 Tasks — Quality & UI Correctness

### TSK-07 — Uncomment staleTime config in list and metrics queries
**Req**: PLR-06 (partial)
**Priority**: P2
**Depends on**: TSK-01
**Files**:
- `src/pages/app/patients/patients-list/hooks/use-patients-list-query.ts`
- `src/pages/app/patients/patients-list/hooks/use-patients-metrics.ts`

**What**:

`use-patients-list-query.ts` — uncomment/add:
```typescript
staleTime:            30_000,
gcTime:              300_000,
refetchOnWindowFocus: true,
placeholderData:      (prev) => prev,
```

`use-patients-metrics.ts` — uncomment/add:
```typescript
staleTime:            60_000,
gcTime:              300_000,
refetchOnWindowFocus: false,
```

**Done when**:
- [ ] Switching away and back to the tab does not refetch metrics
- [ ] Patient list refetches on window focus

**Gate**: `npx tsc --noEmit`
**Commit**: `fix(patients-list): restore staleTime and gcTime config in list and metrics queries`

---

### TSK-08 — Avatar preview for HTTP/HTTPS stored URLs
**Req**: PLR-15
**Priority**: P2
**Depends on**: TSK-01
**File**: `register-patients/steps/patient-avatar-upload.tsx`

**What**:
- Add `const [directUrl, setDirectUrl] = useState<string | null>(null)`
- In the `useEffect`: if `defaultValue` starts with `"http://"` or `"https://"`, call `setDirectUrl(defaultValue)` and `clear()`; else clear `directUrl` and use existing UUID/data-URI logic
- Compute `const displayUrl = previewUrl ?? directUrl`
- Replace all `previewUrl` references in JSX with `displayUrl`

**Done when**:
- [ ] Edit a patient with an avatar → avatar photo renders in preview, not initials

**Gate**: manual browser test + `npx tsc --noEmit`
**Commit**: `fix(patient-avatar-upload): accept HTTP/HTTPS URLs as valid preview source`

---

### TSK-09 — dateOfBirth display sync via key remount
**Req**: PLR-21
**Priority**: P2
**Depends on**: TSK-01
**File**: `register-patients/register-patients.tsx`

**What**:
- Add `key={patient?.id ?? 'new'}` to the `<StepBasicData>` render:
  ```tsx
  {step === 1 && <StepBasicData key={patient?.id ?? 'new'} onAvatarSelect={setAvatarFile} patient={patient} />}
  ```
- This forces React to remount `StepBasicData` when patient data loads, re-running `useState(() => getValues("dateOfBirth"))` with the correct value from the now-populated form context

**Done when**:
- [ ] Open edit form for a patient with a known birth date → date field shows correct value immediately after data loads, not blank

**Gate**: manual browser test
**Commit**: `fix(register-patients): remount StepBasicData on patient load to sync birthInput`

---

### TSK-10 — Align filter UI status pills to backend enums
**Req**: PLR-08
**Priority**: P2
**Depends on**: TSK-04, TSK-05
**File**: patients table filters component (wherever `STATUS_PILLS` or equivalent options array is defined)

**What**:
- Ensure status filter options are exactly: `null` (Todos), `'ACTIVE'` (Ativos), `'BLOCKED'` (Arquivados)
- Fix any option using lowercase/sentinel values (`'active'`, `'inactive'`, `'all'`)
- Active pill must have visual active state; inactive pills must not

**Done when**:
- [ ] Click "Ativos" → URL contains `status=ACTIVE`, network shows `status=ACTIVE`
- [ ] Click "Todos" → no `status` param in URL or request
- [ ] Click "Arquivados" → URL and request contain `status=BLOCKED`

**Gate**: manual Network tab + URL inspection + `npx tsc --noEmit`
**Commit**: `fix(patients-table-filters): align status pill values to backend enums`

---

### TSK-11 — Remove nonfunctional UI and hardcoded metrics
**Req**: PLR-19
**Priority**: P2
**Depends on**: TSK-01
**File**: `src/pages/app/patients/patients-list/patients-list.tsx`

**What**:
- Add `disabled` + `className="... opacity-50 cursor-not-allowed"` to Importar, Exportar, and Colunas buttons (do not remove — avoids layout shift)
- Add `disabled` or remove "Filtros avançados" button
- Remove the entire "Novos 30 dias" `MetricCard` block (hardcoded `value="—"`, `sub="24%"`)
- Remove `sub` and `subTrend` props from Ativos and Arquivados `MetricCard` calls

**Done when**:
- [ ] Importar, Exportar, Colunas buttons are visually disabled with `cursor-not-allowed`
- [ ] "Novos 30 dias" card is absent from the rendered page
- [ ] Ativos/Arquivados cards show no hardcoded sub-labels

**Gate**: manual browser inspection + `npx tsc --noEmit`
**Commit**: `fix(patients-list): disable nonfunctional buttons; remove hardcoded metric card`

---

### TSK-12 — Markdown link sanitization
**Req**: PLR-17
**Priority**: P2
**File**: `src/utils/renderMarkdown.ts`

**What**:
- Add module-level constant: `const SAFE_HREF_RE = /^https?:|^mailto:/i`
- Add function: `function sanitizeHref(url: string): string { return SAFE_HREF_RE.test(url.trimStart()) ? url : '#' }`
- Update `applyInline` link replacement to use callback form:
  ```typescript
  .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, text, url) =>
      `<a href="${sanitizeHref(url)}" target="_blank" rel="noopener noreferrer">${text}</a>`)
  ```

**Done when**:
- [ ] Enter `[x](javascript:void(0))` in notes editor → preview shows no `javascript:` href (renders `href="#"`)
- [ ] A normal `[link](https://example.com)` still renders as a clickable link

**Gate**: manual browser test + `npx tsc --noEmit`
**Commit**: `fix(renderMarkdown): sanitize link hrefs to block javascript: URIs`

---

### TSK-13 — Restore mojibake Portuguese strings
**Req**: PLR-18
**Priority**: P2

**What**:
- Grep under `src/pages/app/patients/patients-list/` for patterns: `Ã`, `â€`, `Ã§`
- Fix each occurrence by replacing mojibake bytes with correct UTF-8 Portuguese characters
- Save files as UTF-8 without BOM

**Done when**:
- [ ] Load patients list → no garbled characters visible in any label, tooltip, or comment
- [ ] Source files contain correct Portuguese characters (`ã`, `é`, `ç`, `ó`, etc.)

**Gate**: visual scan of rendered patients list
**Commit**: `fix(patients-list): restore correct UTF-8 Portuguese characters`

---

## P3 Tasks — Cleanup

### TSK-14 — Dead code removal
**Req**: PLR-20
**Priority**: P3

**What**:
- `grep -r "useCreatePatientDraft"` across the project → if zero results, delete `register-patients/hooks/use-create-patient-draft.ts`
- `grep -r "ExportPDFButton\|export-pdf-button"` across the project → if zero results, delete `components/details/export-pdf-button.tsx`
- Scan remaining files under `patients-list/` for any other hooks or components with zero import references; delete or flag

**Done when**:
- [ ] Grep for `useCreatePatientDraft` returns zero results
- [ ] Grep for `ExportPDFButton` returns zero results (if file was deleted)

**Gate**: `npx tsc --noEmit` (deletion must not introduce new errors)
**Commit**: `chore(patients-list): delete unused draft hook and PDF button`

---

### TSK-15 — Gender and sessionVolume URL wiring verification
**Req**: PLR-09
**Priority**: P3
**Depends on**: TSK-04, TSK-05

**What**:
- Verify `use-patient-filters.ts` (after TSK-04) reads and writes `gender` and `sessionVolume` from URL params
- Verify `use-patients-query-params.ts` (after TSK-05) includes them in the API payload when present
- Verify `clearFilters` removes both from URL

**Done when**:
- [ ] Manually set `?gender=FEMININE` → network request includes `gender=FEMININE`
- [ ] `clearFilters` removes gender and sessionVolume from URL

**Gate**: manual URL manipulation + Network tab
**Note**: No UI panel needed — URL-only wiring. This task may be a no-op if TSK-04 and TSK-05 already covered it.

---

## Final Gate

### TSK-16 — Build, lint, and manual verification
**Depends on**: All previous tasks

```bash
npm run build   # must exit 0 — zero TypeScript errors
npm run lint    # must exit 0 (or only pre-existing warnings)
```

Manual checklist (browser DevTools Network tab open):

1. `npx tsc --noEmit` → 0 errors
2. Create patient → metrics cards update without page refresh
3. Archive active patient → row immediately shows "Arquivado"; Reactivate → immediately "Ativo"
4. Set `?status=GARBAGE` in URL → network request has no `status` param
5. Click "Ativos" → `status=ACTIVE` in URL and request; click "Todos" → no status param
6. Network tab → no `sortBy` param, no `null` query param values
7. Open edit modal → submit disabled while data loads; enabled after patient loads
8. Edit patient with avatar → photo renders in preview (not initials)
9. Open edit form for patient with birth date → date field shows correct value immediately
10. Type `[x](javascript:void(0))` in notes editor → preview renders `href="#"` not `javascript:`
11. No `/attachments/patient/null` request in network tab
12. Importar/Exportar/Colunas are visually disabled; "Novos 30 dias" card is absent
13. No garbled characters visible in patients list UI

---

## Requirement → Task Traceability

| Req ID | Story | Task |
|--------|-------|------|
| PLR-01 | Filter hook URL param validation | TSK-04 |
| PLR-03 | Correct GET /patients payload | TSK-05 |
| PLR-04 | Query key centralization / metrics invalidation | TSK-02, TSK-03 |
| PLR-06 | staleTime config restored | TSK-07 |
| PLR-08 | Aligned filter UI options | TSK-10 |
| PLR-09 | Gender/sessionVolume URL wiring | TSK-15 |
| PLR-10 | TypeScript contract alignment | TSK-01 |
| PLR-11 | Optimistic status toggle fix | TSK-02 |
| PLR-12 | Metrics invalidation after mutations | TSK-02, TSK-03 |
| PLR-14 | Attachment query enabled guard | TSK-06 |
| PLR-15 | Avatar preview for HTTP URLs | TSK-08 |
| PLR-16 | Edit mode correctness in submit hook | TSK-03 |
| PLR-17 | Markdown link safety | TSK-12 |
| PLR-18 | Mojibake text restoration | TSK-13 |
| PLR-19 | Nonfunctional UI cleanup | TSK-11 |
| PLR-20 | Dead code removal | TSK-14 |
| PLR-21 | dateOfBirth display sync | TSK-09 |
| PLR-22 | URL param enum validation | TSK-04 |
| PLR-23 | Details/session type safety | TSK-01 |
