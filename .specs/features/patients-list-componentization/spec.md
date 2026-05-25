# Patients-List Componentization Specification

## Problem Statement

`patients-list/components/` is a flat directory with 9 files. As the feature grows, it becomes increasingly difficult to locate, understand, and maintain specific components. There is no clear semantic grouping, and file naming issues (incorrect casing) compound the problem.

## Goals

- [ ] Organize `patients-list/components/` into semantic subdirectories that reflect component responsibility
- [ ] Fix the `generate-Invite-modal.tsx` casing bug (capital I violates kebab-case convention)
- [ ] Confirm `src/validators/` is the canonical home for all Zod schemas (already partially done)
- [ ] All existing behavior is preserved — zero functional changes

## Out of Scope

| Feature | Reason |
|---|---|
| Refactoring `register-patients/` internals | Explicitly excluded by user |
| Moving `src/env.ts` Zod usage | Environment validation — standard pattern, not a form schema |
| Moving `use-patient-filters.ts` Zod usage | Inline URL param coercion, not a form schema |
| Adding new components or features | Pure structural reorganization |
| Removing `export-pdf-button.tsx` (potentially unused in this folder) | Out of scope — dead code analysis is separate |

---

## Proposed Target Structure

```
src/
└── pages/app/patients/patients-list/
    ├── patients-list.tsx               ← entry point (imports updated)
    ├── register-patients/              ← UNTOUCHED
    └── components/
        ├── table/                      ← table rendering and filtering
        │   ├── patients-table.tsx
        │   ├── patients-table-row.tsx
        │   ├── patients-table-filters.tsx
        │   └── loading.tsx
        ├── details/                    ← patient detail view and session notes
        │   ├── patients-details.tsx
        │   ├── evolution-viewer.tsx
        │   └── export-pdf-button.tsx
        └── dialogs/                    ← standalone overlay components
            ├── delete-patient-dialog.tsx
            └── generate-invite-modal.tsx   ← renamed (fix casing: Invite → invite)

src/validators/                         ← ALREADY EXISTS, no changes needed
    ├── auth.ts
    ├── patients.ts
    └── suggestions.ts
```

---

## User Stories

### P1: Reorganize components into semantic subdirectories ⭐ MVP

**User Story**: As a developer maintaining patients-list, I want components grouped by responsibility so that I can locate the right file without scanning a flat list.

**Why P1**: This is the core ask. Everything else is secondary.

**Acceptance Criteria**:

1. WHEN a developer opens `patients-list/components/` THEN they SHALL see exactly 3 subdirectories: `table/`, `details/`, `dialogs/`
2. WHEN a developer navigates to `table/` THEN they SHALL find all table-related components (table, row, filters, loading)
3. WHEN a developer navigates to `details/` THEN they SHALL find components related to the patient detail view (details modal, evolution viewer, PDF export)
4. WHEN a developer navigates to `dialogs/` THEN they SHALL find standalone dialog components (delete confirmation, invite generator)
5. WHEN the application is built after reorganization THEN it SHALL compile without TypeScript errors
6. WHEN the patients list page is loaded in the browser THEN all features SHALL work identically to before

**Independent Test**: Run `pnpm build` (or `tsc --noEmit`) and confirm zero errors. Open patients list in browser, verify table renders, filters work, can view details, can delete, can generate invite.

---

### P1: Fix `generate-Invite-modal.tsx` filename casing ⭐ MVP

**User Story**: As a developer, I want consistent kebab-case filenames so that imports are predictable and conventions are upheld.

**Why P1**: The casing bug causes issues on case-sensitive filesystems (Linux CI) and violates the project's naming convention.

**Acceptance Criteria**:

1. WHEN the file is renamed THEN the new filename SHALL be `generate-invite-modal.tsx` (all lowercase)
2. WHEN imports reference the file THEN they SHALL use the corrected lowercase path

**Independent Test**: Grep for `generate-Invite-modal` — zero matches remain after rename.

---

## Import Update Map

These are the exact import paths that change after the move. No logic changes, only path strings.

| File | Old import | New import |
|---|---|---|
| `patients-list.tsx` | `./components/patients-table-filters` | `./components/table/patients-table-filters` |
| `patients-list.tsx` | `./components/patients-table` | `./components/table/patients-table` |
| `patients-list.tsx` | `./components/generate-Invite-modal` | `./components/dialogs/generate-invite-modal` |
| `components/table/patients-table.tsx` | `./patients-table-row` | `./patients-table-row` ✓ same folder |
| `components/table/patients-table.tsx` | `./loading` | `./loading` ✓ same folder |
| `components/table/patients-table-row.tsx` | `./delete-patient-dialog` | `../dialogs/delete-patient-dialog` |
| `components/table/patients-table-row.tsx` | `./patients-details` | `../details/patients-details` |
| `components/details/patients-details.tsx` | `./evolution-viewer` | `./evolution-viewer` ✓ same folder |

---

## Edge Cases

- WHEN files are moved on Windows THEN git must be informed of the rename (case changes may be invisible — use `git mv`)
- WHEN `generate-Invite-modal.tsx` is renamed THEN verify no other file outside patients-list imports it with the old casing

---

## Requirement Traceability

| Requirement ID | Story | Status |
|---|---|---|
| COMP-01 | P1: Create `table/` subfolder with 4 components | Pending |
| COMP-02 | P1: Create `details/` subfolder with 3 components | Pending |
| COMP-03 | P1: Create `dialogs/` subfolder with 2 components | Pending |
| COMP-04 | P1: Update 3 import paths in `patients-list.tsx` | Pending |
| COMP-05 | P1: Update 2 import paths in `patients-table-row.tsx` | Pending |
| COMP-06 | P1: Fix `generate-Invite-modal.tsx` → `generate-invite-modal.tsx` | Pending |
| COMP-07 | P1: TypeScript build passes with zero errors | Pending |

---

## Success Criteria

- [ ] `patients-list/components/` contains only subdirectories (no loose files)
- [ ] `pnpm tsc --noEmit` passes with zero errors
- [ ] No `generate-Invite-modal` (capital I) references remain in the codebase
- [ ] `register-patients/` directory is untouched
- [ ] `src/validators/` remains unchanged
