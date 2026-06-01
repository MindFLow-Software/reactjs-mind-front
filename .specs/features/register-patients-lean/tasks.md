# Register Patients Lean Refactor — Tasks

**Spec**: `.specs/features/register-patients-lean/spec.md`
**Status**: Draft

---

## Execution Plan

### Phase 1 — Isolated changes (Parallel)

No shared file touched. All tasks are independent.

```
T1 [P] ─────────────────────────────┐
T2 [P] ─────────────────────────────┤──→ Phase 2
T3 [P] ─────────────────────────────┤
T4 [P] ─────────────────────────────┘
```

### Phase 2 — Orchestrator simplification (Sequential)

T5–T9 all modify `register-patients.tsx`. Each task creates a hook/helper and wires it in, reducing the orchestrator incrementally. T9 is last because it absorbs the mutations and upload state left over by all prior extractions.

```
T5 → T6 → T7 → T8 → T9
```

---

## Task Breakdown

### T1: Extract `renderMarkdown` to `src/utils/renderMarkdown.ts` [P]

**What**: Move the embedded `renderMarkdown`, `esc`, and `applyInline` functions out of `markdown-editor.tsx` into a dedicated utility module. Update the component to import the function.
**Where**: `src/utils/renderMarkdown.ts` (new); `steps/markdown-editor.tsx`
**Depends on**: None
**Requirement**: RPLEAN-07

**Done when**:

- `src/utils/renderMarkdown.ts` exists and exports `renderMarkdown(text: string): string`
- `esc` and `applyInline` remain in the file as unexported helpers
- `markdown-editor.tsx` body contains no regex, escape, or parsing logic — only `import { renderMarkdown }`
- Preview output is byte-for-byte identical to current output for same input
- Gate: `pnpm build` passes

**Tests**: Open clinical step → write `**bold** _italic_` → switch to Preview → bold and italic render correctly.
**Gate**: build
**Commit**: `refactor(markdown-editor): extract renderMarkdown to src/utils`

---

### T2: Fix silent error in `delete-attachments-button.tsx` [P]

**What**: Replace the empty `catch {}` block with an error toast and keep the dialog open on failure.
**Where**: `steps/delete-attachments-button.tsx`
**Depends on**: None
**Requirement**: RPLEAN-09

**Done when**:

- `catch (error) {}` block is gone — replaced with `toast.error(...)` and dialog remains open
- `setOpen(false)` is only called on success (inside the `try` block after `await onDelete()`)
- Error toast message is user-readable Portuguese
- Gate: `pnpm build` passes

**Tests**: Intercept delete network request to fail → error toast appears → dialog stays open.
**Gate**: build
**Commit**: `fix(delete-attachments-button): show toast and keep dialog open on delete error`

---

### T3: Fix encoding in `register-patients/` (BOM removal) [P]

**What**: Verify no mojibake sequences exist; remove UTF-8 BOM from `attachments-list.tsx`.
**Where**: `steps/attachments-list.tsx`
**Depends on**: None
**Requirement**: RPLEAN-08

**Verification step**: Run `grep -rn "Ã§\|Ã£\|Ã©\|Â " src/pages/app/patients/patients-list/register-patients/` — must return zero matches before proceeding.

**Done when**:

- Grep for mojibake sequences returns zero matches
- `attachments-list.tsx` has no BOM (file does not start with bytes `EF BB BF`)
- No other file in `register-patients/` was modified
- Gate: `pnpm build` passes

**Tests**: Grep command above → zero results.
**Gate**: build
**Commit**: `fix(attachments-list): remove UTF-8 BOM`

---

### T4: Extract `useImagePreview` + wire into `patient-avatar-upload.tsx` [P]

**What**: Move the blob-fetch `useEffect` and `URL.createObjectURL` / `URL.revokeObjectURL` lifecycle out of the component into a shared hook. Update `PatientAvatarUpload` to use the hook.
**Where**: `src/hooks/use-image-preview.ts` (new); `steps/patient-avatar-upload.tsx`
**Depends on**: None
**Requirement**: RPLEAN-05

**Hook signature**:

```ts
useImagePreview(options?: { fetchBlob?: (url: string) => Promise<Blob> })
// returns: { previewUrl, file, onFileSelected, clear, loadFromUrl }
```

**Done when**:

- `src/hooks/use-image-preview.ts` exists with the above signature
- Hook revokes all created object URLs on unmount
- `loadFromUrl(url)` with a data URI sets `previewUrl` directly without calling `fetchBlob`
- `patient-avatar-upload.tsx` has NO `useEffect` for blob fetching or object URL management
- `patient-avatar-upload.tsx` calls `useImagePreview({ fetchBlob })` where `fetchBlob` wraps `api.get`
- Gate: `pnpm build` passes

**Tests**: Open edit modal → existing avatar renders. Select new image → preview updates. Close modal → DevTools shows no detached blob URLs.
**Gate**: build
**Commit**: `refactor(patient-avatar-upload): extract useImagePreview hook`

---

### T5: Create `buildPatientDefaults` + wire into orchestrator

**What**: Create a pure function that builds `useForm` `defaultValues` from a `PatientHTTP | undefined`. Update the orchestrator's `useForm` call to use it.
**Where**: `register-patients/helpers.ts` (new); `register-patients.tsx`
**Depends on**: None (touches orchestrator in isolation — only the `defaultValues` block)
**Requirement**: RPLEAN-06

**Function signature**:

```ts
buildPatientDefaults(patient?: PatientHTTP): PatientFormData
```

**Done when**:

- `register-patients/helpers.ts` exists and exports `buildPatientDefaults`
- All 11+ form fields covered: firstName, lastName, cpf (formatted), phoneNumber (formatted), email, gender, dateOfBirth, cep (formatted), logradouro, bairro, cidade, uf — plus modality/frequency/price/source/notes defaults
- Any `null` address field returns `""` (never the string `"null"`)
- `useForm` in `register-patients.tsx` reads `defaultValues: buildPatientDefaults(patient)` — zero inline ternaries
- `formatCPF`, `formatPhone`, `formatCEP` imports remain (used inside `helpers.ts` now)
- Gate: `pnpm build` passes

**Tests**: Open edit modal → every field matches patient record. Open create modal → all fields empty.
**Gate**: build
**Commit**: `refactor(register-patients): extract buildPatientDefaults helper`

---

### T6: Create `useFileSelection` + wire into orchestrator

**What**: Create a generic file staging hook with add/remove/clear and inline validation. Replace `useState<File[]>` in the orchestrator and update `UploadZone` to call `addFiles` instead of `setSelectedFiles`.
**Where**: `src/hooks/use-file-selection.ts` (new); `register-patients.tsx`; `steps/upload-zone.tsx` (signature check — `onFilesChange` must accept new-files-only array)
**Depends on**: T5
**Requirement**: RPLEAN-04

**Hook signature**:

```ts
useFileSelection(options: { maxFiles: number; maxSizeBytes: number })
// returns: { files, addFiles, removeFile, clearFiles }
```

**Done when**:

- `src/hooks/use-file-selection.ts` exists with the above signature
- `addFiles(incoming)` validates size, total count, and skips name+size duplicates
- Rejected files produce a user-readable toast each
- `addFiles([])` is a no-op (no toast, no state change)
- `register-patients.tsx` has NO `useState<File[]>` for attachments
- `UploadZone`'s `onFilesChange` prop receives `addFiles`; `MAX_DOC_FILES` and `MAX_DOC_SIZE` are passed as config
- Gate: `pnpm build` passes

**Tests**: Add 2 files → remove 1 → 1 remains. Add 7 files with `maxFiles=6` → only 6 accepted, toast fires for 7th.
**Gate**: build
**Commit**: `refactor(register-patients): extract useFileSelection hook`

---

### T7: Create `useCepLookup` + wire into orchestrator

**What**: Move `handleCepBlur` — including the `getAddressByCep` call, Axios status inspection, `setValue` for 4 fields, and toast notifications — into a shared hook. Wire it into `StepContactAddress`.
**Where**: `src/hooks/use-cep-lookup.ts` (new); `register-patients.tsx`
**Depends on**: T6
**Requirement**: RPLEAN-01

**Hook signature**:

```ts
useCepLookup(options: { setValue: UseFormSetValue<PatientFormData> })
// returns: { onCepBlur, isCepLoading }
```

**Done when**:

- `src/hooks/use-cep-lookup.ts` exists — zero patient-domain imports; accepts any `setValue` compatible with address field keys
- CEP < 8 digits → toast "CEP inválido", no API call
- API 400/404 → toast "CEP não encontrado"
- Network/5xx → toast "Serviço de CEP indisponível. Preencha manualmente."
- New blur before previous request resolves → previous request is cancelled (AbortController)
- `register-patients.tsx` has NO `handleCepBlur`, `getAddressByCep`, `AxiosError`, `isCepLoading` state, or `setValue` for address fields
- Gate: `pnpm build` passes

**Tests**: Blur CEP with valid 8 digits → 4 address fields auto-fill. Blur with 5 digits → toast fires, no API call.
**Gate**: build
**Commit**: `refactor(register-patients): extract useCepLookup hook`

---

### T8: Create `usePatientFormSteps` + wire into orchestrator

**What**: Move step state and per-step field validation out of the orchestrator into a feature hook. Replace inline `handleNext`, `setStep`, and `step` state.
**Where**: `register-patients/hooks/use-patient-form-steps.ts` (new, create `hooks/` directory); `register-patients.tsx`
**Depends on**: T7
**Requirement**: RPLEAN-03

**Hook signature**:

```ts
usePatientFormSteps(options: { trigger: UseFormTrigger<PatientFormData> })
// returns: { step, handleNext, handleBack, isFirstStep, isLastStep }
```

**Done when**:

- `register-patients/hooks/` directory created
- `register-patients/hooks/use-patient-form-steps.ts` exists with the above signature
- `handleNext` triggers only the fields for the current step; advances only if valid
- `handleBack` decrements step without validation
- `register-patients.tsx` has NO inline `step` state, `handleNext`, or step-to-fields mapping
- Orchestrator uses `handleBack` for the Back button (currently uses inline `setStep((s) => s - 1)`)
- Gate: `pnpm build` passes

**Tests**: Leave required field empty → click Next → stays on step 1, error visible. Fill field → Next → step 2 renders.
**Gate**: build
**Commit**: `refactor(register-patients): extract usePatientFormSteps hook`

---

### T9: Create `usePatient`

**Wh**`Submit` + wire into orchestrator**at**: Move the 42-line `onSubmit` handler — data normalization, create/update branching, sequential file uploads, cache invalidation, toast notifications — into a feature hook. The orchestrator's `onSubmit` becomes ≤5 lines.
**Where**: `register-patients/hooks/use-patient-submit.ts` (new); `register-patients.tsx`
**Depends on**: T8
**Requirement**: RPLEAN-02

**Hook signature**:

```ts
usePatientSubmit(options: {
  patient?: PatientHTTP
  avatarFile: File | null
  files: File[]
  onSuccess?: () => void
})
// returns: { submit, isSubmitting }
```

**Done when**:

- `register-patients/hooks/use-patient-submit.ts` exists with the above signature
- Create path: `createPatients` → upload avatar (non-blocking on failure) → upload each attachment → invalidate queries → success toast → `onSuccess()`
- Edit path: `updatePatients` → upload new files → invalidate queries → success toast
- Any API failure → error toast, NO cache invalidation
- Avatar upload failure logs a warning but does NOT abort the patient save
- `isSubmitting` is `true` while any async operation is running
- `register-patients.tsx` no longer imports `useMutation`, `uploadAttachment`, `uploadAvatar`, `createPatients`, `updatePatients` — all moved to hook
- `register-patients.tsx`'s `onSubmit` is ≤5 lines
- `register-patients.tsx` is ≤150 lines total
- Gate: `pnpm build` passes

**Tests**: Create patient → appears in list, toast fires, modal closes. Edit patient → changes saved. Upload file during create → file appears in step 4 on edit.
**Gate**: build
**Commit**: `refactor(register-patients): extract usePatientSubmit hook`

---

## Granularity Check


| Task                            | Scope                                 | Status   |
| ------------------------------- | ------------------------------------- | -------- |
| T1: renderMarkdown utility      | 1 new util + 1 component update       | ✅ Atomic |
| T2: delete button error fix     | 1 file, catch block                   | ✅ Atomic |
| T3: encoding verification + BOM | grep check + 1 file BOM removal       | ✅ Atomic |
| T4: useImagePreview             | 1 new hook + 1 component update       | ✅ Atomic |
| T5: buildPatientDefaults        | 1 new helper + 1 defaultValues line   | ✅ Atomic |
| T6: useFileSelection            | 1 new hook + orchestrator file state  | ✅ Atomic |
| T7: useCepLookup                | 1 new hook + orchestrator CEP handler | ✅ Atomic |
| T8: usePatientFormSteps         | 1 new hook + orchestrator step state  | ✅ Atomic |
| T9: usePatientSubmit            | 1 new hook + orchestrator onSubmit    | ✅ Atomic |


---

## Requirement Traceability


| ID        | Story                             | Task | Status  |
| --------- | --------------------------------- | ---- | ------- |
| RPLEAN-01 | `useCepLookup` hook               | T7   | Pending |
| RPLEAN-02 | `usePatientSubmit` hook           | T9   | Pending |
| RPLEAN-03 | `usePatientFormSteps` hook        | T8   | Pending |
| RPLEAN-04 | `useFileSelection` hook           | T6   | Pending |
| RPLEAN-05 | `useImagePreview` hook            | T4   | Pending |
| RPLEAN-06 | `buildPatientDefaults` helper     | T5   | Pending |
| RPLEAN-07 | Markdown utilities extraction     | T1   | Pending |
| RPLEAN-08 | Broken encoding fix               | T3   | Pending |
| RPLEAN-09 | Silent error fix in delete button | T2   | Pending |


**Coverage**: 9 requirements, 9 mapped ✅