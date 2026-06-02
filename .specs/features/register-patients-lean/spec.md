# Register Patients — Code Quality Refactoring (Lean)

**Status:** Pending  
**Depends on:** register-patients-architecture (RPA spec — FormProvider, schema, CSS co-location)  
**Date:** 2026-06-01

---

## Problem Statement

After three sequential refactors (structural, architectural, address integration), `register-patients/` compiles cleanly but is hard to read. `register-patients.tsx` (~280 lines) concentrates 8+ distinct responsibilities: stepper state, form defaults, CEP lookup, create/update dispatch, file upload sequencing, cache invalidation, toast notifications, and UI rendering. Handlers span 20–42 lines mixing API calls, side-effects, and notifications. Utility logic (markdown parser, avatar blob fetching, file validation) lives inside components instead of dedicated modules. Broken text encoding is scattered throughout the folder.

## Goals

- [ ] `register-patients.tsx` reads as a pure visual orchestrator — ≤150 lines, no embedded business logic
- [ ] Every handler is ≤10 lines, single clear responsibility
- [ ] CEP lookup, form submission, file staging, step navigation, and image preview each live in their own hook
- [ ] Markdown parser moved to `src/utils/renderMarkdown.ts`
- [ ] Broken encoding fixed throughout `register-patients/`
- [ ] Silent error swallows replaced with user-visible feedback
- [ ] Zero TypeScript errors, zero behavior regressions

## Out of Scope

| Feature | Reason |
|---------|--------|
| Changing API contracts or Zod schema shape | Covered by RPA spec |
| Replacing custom markdown parser with react-markdown | Security improvement, separate concern |
| Redesigning UI or changing visual behavior | Exact appearance must be preserved |
| Refactoring other feature folders | Scope limited to `register-patients/` |
| Centralizing i18n/locale strings | Separate concern |
| Adding unit tests | Not requested |

---

## Hook Placement Rule

> Feature-specific logic → `register-patients/hooks/`  
> Reusable across features → `src/hooks/`

---

## User Stories

### RPLEAN-01: Extract `useCepLookup` hook ⭐ P1

**User Story**: As a developer, I want CEP lookup logic in `src/hooks/use-cep-lookup.ts` — shared and reusable — so the orchestrator calls `onCepBlur` without knowing API details or Axios error codes.

**Why P1**: `handleCepBlur` in the orchestrator is the clearest mixed-concern example: API call, Axios error code introspection, `setValue` for 4 fields, and toast notifications — all inline.

**Acceptance Criteria**:

1. WHEN `useCepLookup({ setValue })` is called THEN it SHALL return `{ onCepBlur, isCepLoading }`
2. WHEN `onCepBlur` is triggered and the raw CEP (digits only) has 8 characters THEN the hook SHALL call `getAddressByCep` and then `setValue` on `logradouro`, `bairro`, `cidade`, `uf`
3. WHEN the raw CEP has fewer than 8 digits THEN the hook SHALL show toast `"CEP inválido"` and SHALL NOT call the API
4. WHEN the API returns a 400 or 404 status THEN the hook SHALL show toast `"CEP não encontrado"`
5. WHEN the API is unavailable (5xx or network error) THEN the hook SHALL show toast `"Serviço de CEP indisponível. Preencha manualmente."`
6. WHEN a new `onCepBlur` fires before the previous request resolves THEN the hook SHALL cancel the previous request
7. WHEN the hook is active THEN `register-patients.tsx` SHALL contain NO references to `getAddressByCep`, Axios error codes, or `setValue` for address fields

**File**: `src/hooks/use-cep-lookup.ts` (generic — no patient-domain imports; accepts any `setValue` compatible with the address field keys)

**Independent Test**: Blur CEP with valid 8-digit value → 4 address fields auto-fill. Blur with 5 digits → toast fires, no API call. `register-patients.tsx` has no `getAddressByCep` import.

---

### RPLEAN-02: Extract `usePatientSubmit` hook ⭐ P1

**User Story**: As a developer, I want form submission in `register-patients/hooks/use-patient-submit.ts` so `onSubmit` in the orchestrator delegates in ≤5 lines.

**Why P1**: The current `onSubmit` (42 lines) mixes data normalization, create/update branching, sequential file uploads, cache invalidation, and toast notifications — all in one handler.

**Acceptance Criteria**:

1. WHEN `usePatientSubmit({ patient, avatarFile, selectedFiles, onSuccess })` is called THEN it SHALL return `{ submit, isSubmitting }`
2. WHEN `submit(data)` runs for a new patient THEN the hook SHALL: call `createPatients`, upload avatar (if present), upload each attachment sequentially, invalidate query cache, show success toast, call `onSuccess`
3. WHEN `submit(data)` runs for an existing patient THEN the hook SHALL: call `updatePatients` with the patient ID, upload any new files, invalidate query cache, show success toast
4. WHEN any API call fails THEN the hook SHALL show an error toast and SHALL NOT invalidate the cache
5. WHEN an avatar upload fails THEN the hook SHALL log a warning but SHALL NOT abort the patient save (avatar is non-blocking)
6. WHEN upload is in progress THEN `isSubmitting` SHALL be `true`
7. WHEN the hook is active THEN `register-patients.tsx`'s `onSubmit` SHALL be ≤5 lines

**File**: `register-patients/hooks/use-patient-submit.ts` (feature-specific — imports patient API functions, patient query keys, upload helpers)

**Independent Test**: Create patient → appears in list, toast fires, modal closes. Edit patient → changes saved. Upload file during create → file appears in step 4 on edit.

---

### RPLEAN-03: Extract `usePatientFormSteps` hook ⭐ P1

**User Story**: As a developer, I want step navigation and per-step field validation in `register-patients/hooks/use-patient-form-steps.ts` so the orchestrator only reads `step` and calls `handleNext`/`handleBack`.

**Why P1**: Step state is self-contained and can be isolated without touching any form or API logic.

**Acceptance Criteria**:

1. WHEN `usePatientFormSteps({ trigger })` is called THEN it SHALL return `{ step, handleNext, handleBack, isFirstStep, isLastStep }`
2. WHEN `handleNext` is called THEN the hook SHALL call `trigger` with the fields of the current step only, and advance only if validation passes
3. WHEN validation fails THEN `step` SHALL NOT increment
4. WHEN `handleBack` is called THEN the hook SHALL decrement `step` without triggering validation
5. WHEN the hook is active THEN `register-patients.tsx` SHALL contain NO inline step validation logic or step-to-fields mapping

**File**: `register-patients/hooks/use-patient-form-steps.ts` (feature-specific — knows which fields belong to each patient form step)

**Independent Test**: Leave required field empty → click Next → stays on step 1, error visible on field. Fill field → click Next → step 2 renders.

---

### RPLEAN-04: Extract `useFileSelection` hook ⭐ P1

**User Story**: As a developer, I want generic file staging state in `src/hooks/use-file-selection.ts` — reusable across the app — so the orchestrator has no `useState<File[]>` for attachments.

**Why P1**: File staging (add/remove/validate/clear) has no patient-specific logic and is fully reusable.

**Acceptance Criteria**:

1. WHEN `useFileSelection({ maxFiles, maxSizeBytes })` is called THEN it SHALL return `{ files, addFiles, removeFile, clearFiles }`
2. WHEN `addFiles(incoming)` is called THEN it SHALL validate each file against `maxSizeBytes` and total count against `maxFiles`, and skip name+size duplicates already in state
3. WHEN a file fails validation THEN the hook SHALL show a toast describing the rejection reason
4. WHEN `removeFile(index)` is called THEN it SHALL remove the file at that index
5. WHEN `clearFiles()` is called THEN `files` SHALL become `[]`
6. WHEN the hook is active THEN `register-patients.tsx` SHALL have NO `useState<File[]>` for attachments
7. `UploadZone`'s `onFilesChange` SHALL receive `addFiles`; `MAX_DOC_FILES` and `MAX_DOC_SIZE` SHALL be passed as the config arguments

**File**: `src/hooks/use-file-selection.ts` (shared — zero patient-domain imports)

**Independent Test**: Add 2 files → remove 1 → 1 remains. Add 7 files with `maxFiles=6` → only 6 accepted, toast fires for the 7th.

---

### RPLEAN-05: Extract `useImagePreview` hook ⭐ P1

**User Story**: As a developer, I want image preview and object URL lifecycle in `src/hooks/use-image-preview.ts` — reusable for any image file input — so `patient-avatar-upload.tsx` is purely presentational.

**Why P1**: Object URL creation and revocation is a lifecycle concern unrelated to the patient domain; `patient-avatar-upload.tsx` currently mixes it with UI.

**Acceptance Criteria**:

1. WHEN `useImagePreview({ fetchBlob? })` is called THEN it SHALL return `{ previewUrl, file, onFileSelected, clear, loadFromUrl }`
2. WHEN `onFileSelected(file)` is called THEN the hook SHALL `URL.createObjectURL(file)`, store it as `previewUrl`, and store `file`
3. WHEN `loadFromUrl(url)` is called and `fetchBlob` is provided THEN the hook SHALL call `fetchBlob(url)`, create an object URL from the resulting blob, and set it as `previewUrl`
4. WHEN `loadFromUrl(url)` is called and `fetchBlob` is NOT provided THEN the hook SHALL use `url` directly as `previewUrl`
5. WHEN the component unmounts THEN the hook SHALL revoke all object URLs it created
6. WHEN `clear()` is called THEN `previewUrl` and `file` SHALL reset to `null`
7. WHEN the hook is active THEN `patient-avatar-upload.tsx` SHALL have NO `useEffect` for blob fetching or object URL management

**File**: `src/hooks/use-image-preview.ts` (shared — caller supplies `fetchBlob` if needed; no patient-specific logic inside)

**Independent Test**: Open edit modal → existing avatar renders. Select new image → preview updates immediately. Close modal → DevTools shows no detached blob URLs.

---

### RPLEAN-06: Extract `buildPatientDefaults` helper ⭐ P1

**User Story**: As a developer, I want a pure function that builds `useForm` `defaultValues` so the `useForm` call is a single readable expression.

**Why P1**: Inline ternary chains for 11+ fields in the `useForm` call are the first thing a reader sees — and the hardest to parse.

**Acceptance Criteria**:

1. WHEN `buildPatientDefaults(patient)` receives a `Ipatient` THEN it SHALL return all form fields populated: name, CPF (formatted), phone (formatted), email, gender, dateOfBirth, cep (formatted), logradouro, bairro, cidade, uf
2. WHEN `buildPatientDefaults()` is called with no argument THEN it SHALL return empty strings and `null` for all fields
3. WHEN a patient has `null` for any address field THEN the returned default SHALL be `""` (not the string `"null"`)
4. WHEN the helper is active THEN `register-patients.tsx`'s `useForm` call SHALL read `defaultValues: buildPatientDefaults(patient)` with no inline ternaries

**File**: `register-patients/helpers.ts` (feature-specific — uses patient types and format utilities)

**Independent Test**: Open edit modal → every field matches the patient record. Open create modal → all fields empty.

---

### RPLEAN-07: Move markdown utilities to `src/utils/renderMarkdown.ts` ⭐ P1

**User Story**: As a developer, I want the markdown-to-HTML renderer outside `markdown-editor.tsx` so the component only handles UI state and user interaction.

**Why P1**: The 32-line `renderMarkdown()` parser embedded in the component is the dominant cause of the file's cognitive load. Moving it makes both the utility and the component independently readable.

**Acceptance Criteria**:

1. WHEN `src/utils/renderMarkdown.ts` is created THEN it SHALL export `renderMarkdown(text: string): string`
2. WHEN `markdown-editor.tsx` is updated THEN the component body SHALL contain NO regex, escape, or markdown parsing logic — only an import of `renderMarkdown`
3. WHEN the Preview tab renders THEN the HTML output SHALL be byte-for-byte identical to the current output for the same input
4. `esc` and `applyInline` SHALL remain inside `renderMarkdown.ts` as unexported helpers

**Independent Test**: Open clinical step → write `**bold** _italic_` in editor → switch to Preview → bold and italic render correctly.

---

### RPLEAN-08: Fix broken text encoding ⭐ P1

**User Story**: As a developer, I want all texts, labels, and comments in `register-patients/` to use correct UTF-8 characters so the codebase reads professionally.

**Why P1**: Mojibake sequences (`Ã§`, `Ã£`, `Â`) in source files indicate the files were saved with wrong encoding. They break readability and may corrupt visible strings in the UI.

**Acceptance Criteria**:

1. WHEN any file in `register-patients/` is opened THEN it SHALL contain no mojibake sequences — specifically `Ã§`, `Ã£`, `Ã©`, `Â`, or similar multi-byte mis-encodings
2. WHEN the UI renders THEN all labels, placeholders, button texts, and toast messages SHALL display correct Portuguese characters (ã, ç, é, ê, etc.)
3. WHEN comments exist in the files THEN they SHALL also use correct characters

**Independent Test**: `grep -rn "Ã§\|Ã£\|Ã©\|Â " src/pages/app/patients/patients-list/register-patients/` → zero matches.

---

### RPLEAN-09: Fix silent error in `delete-attachments-button.tsx` P2

**User Story**: As a user and developer, I want attachment deletion failures to surface visibly so the user knows when a deletion did not succeed.

**Why P2**: The empty `catch {}` is a correctness bug but low user-impact since the mutation `onError` callback already shows a toast. The fix is still important for consistency and debuggability.

**Acceptance Criteria**:

1. WHEN `onDelete()` rejects THEN the component SHALL show a toast with a user-readable error message
2. WHEN `onDelete()` rejects THEN the confirmation dialog SHALL remain open (not close silently)
3. The empty `catch {}` block SHALL be removed — replaced with error toast and dialog state reset

**Independent Test**: Intercept the delete network request to fail → error toast appears → dialog stays open.

---

## Edge Cases

- WHEN a hook's async operation resolves after the component unmounts THEN the hook SHALL NOT call `setState` or `setValue` (use a mounted-ref or `AbortController`)
- WHEN `useImagePreview` receives a `loadFromUrl` call with a data URI THEN it SHALL set it directly as `previewUrl` without passing it to `fetchBlob`
- WHEN `buildPatientDefaults` receives a patient with all-null address fields THEN every address default SHALL be `""` — never the string `"null"`
- WHEN `usePatientSubmit` runs for a new patient and avatar upload fails THEN the patient record SHALL still be saved and the flow SHALL continue
- WHEN `useFileSelection.addFiles` is called with zero files THEN it SHALL be a no-op (no toast, no state change)

---

## Requirement Traceability

| ID | Story | Priority | Status |
|----|-------|----------|--------|
| RPLEAN-01 | `useCepLookup` hook | P1 | Pending |
| RPLEAN-02 | `usePatientSubmit` hook | P1 | Pending |
| RPLEAN-03 | `usePatientFormSteps` hook | P1 | Pending |
| RPLEAN-04 | `useFileSelection` hook | P1 | Pending |
| RPLEAN-05 | `useImagePreview` hook | P1 | Pending |
| RPLEAN-06 | `buildPatientDefaults` helper | P1 | Pending |
| RPLEAN-07 | Markdown utilities extraction | P1 | Pending |
| RPLEAN-08 | Broken encoding fix | P1 | Pending |
| RPLEAN-09 | Silent error fix in delete button | P2 | Pending |

**Coverage:** 9 requirements, 0 mapped to tasks, 9 unmapped ⚠️

---

## Success Criteria

- [ ] `register-patients.tsx` is ≤150 lines
- [ ] `onSubmit` body is ≤5 lines
- [ ] No `handleCepBlur`, `getAddressByCep`, or Axios error-code references in `register-patients.tsx`
- [ ] `grep -rn "Ã§\|Ã£\|Ã©\|Â " src/pages/app/patients/patients-list/register-patients/` → zero results
- [ ] `npx tsc --noEmit` → zero errors
- [ ] `pnpm build` → zero errors
- [ ] Create flow: fill 4 steps → submit → patient created, success toast, modal closes
- [ ] Edit flow: open modal → change field → save → list reflects update
- [ ] CEP auto-fill works on step 2
- [ ] Avatar upload and preview work in create and edit modes
- [ ] Attachment upload and deletion work on step 4
