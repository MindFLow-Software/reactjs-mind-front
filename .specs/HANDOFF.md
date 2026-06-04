# Handoff

**Date:** 2026-06-02
**Feature:** patients-list ToDo cleanup
**Task:** TDO-10 complete — TDO-11 is next

## Completed ✓

- TDO-01 — `Normalizer.digits` in `step-basic-data.tsx` (L42, L53); wrong comment removed from `step-clinical.tsx` (L21)
- TDO-02 — `format(parseISO(...), "dd/MM/yyyy", { locale: ptBR })` in `attachments-list.tsx` (L66)
- TDO-03 — `el`/`ss`/`se`/`ls` renamed to `textarea`/`selStart`/`selEnd`/`lineStart` in `markdown-editor.tsx`; guards moved to top
- TDO-04 — Shadcn `Button` migrations: `attachments-list.tsx` (Eye/Download), `patients-list.tsx` (all 5 action buttons), `register-patients.tsx` (Voltar/Cancelar/primary footer)
- TDO-05 — Ternary flattening: `<TableBodyContent>` in `patients-table.tsx`, `<AvatarContent>` in `patient-avatar-upload.tsx`, `<AttachmentsBody>` in `attachments-list.tsx`
- TDO-06 — `src/utils/gender-config.ts` created; local `GENDER_CONFIG` removed from `patients-table-row.tsx`
- TDO-07 — `updatePatients` typed as `Promise<Ipatient>` in `update-patient.ts`; `targetId` simplified to `isEditMode ? patientId! : res.id` in `use-patient-submit.ts`
- TDO-08 — `register-patients.tsx`: inline SVG → `AddPatientIcon`; step blocks → `renderStepContent(step)`; submit ternary → `submitLabel` const
- TDO-09 — `SortState` type introduced; all 6 `<SortableHead>` usages collapsed to `sort={sort}` single prop; `patients-list.tsx` caller updated
- TDO-10 — `src/utils/formatDateInput.ts` extracted; `calcAge` removed; age derived from `useWatch({ name: "dateOfBirth" })`; `handleBirthChange` simplified to one `formatDateInput` call

## Pending

- **TDO-11** — `upload-zone.tsx`: rewrite using `react-dropzone` (`npm install react-dropzone`); keep existing CSS classes and `UploadZoneProps` interface
  - **Note:** `react-imask` was rejected this session ("breaks easily") — confirm `react-dropzone` is acceptable before installing

- **Final gate** — `npx tsc --noEmit` + `npm run build` + `npm run lint` + manual browser checks (form date masking, file drop, gender badge colors, markdown toolbar)

## Blockers

- TDO-11 requires `npm install react-dropzone` — library not yet installed; confirm with user before proceeding

## Context

- Branch: `feat/patient-address`
- Uncommitted: all files in git status (nothing committed this session — entire TDO series is unstaged)
- New files: `src/utils/formatDateInput.ts`, `src/utils/gender-config.ts`
- Plan file: `.specs/features/patients-list-refactor/tasks.md` (separate TSK-01–TSK-16 correctness tasks also pending)
