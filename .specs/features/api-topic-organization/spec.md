# API Layer Topic Organization

## Context

The `src/api/` directory has grown to 56 files in a flat structure. Finding, navigating, and reasoning about any API call requires scanning the entire list. Organizing by domain folder makes the boundary of each feature area explicit, reduces cognitive load, and fixes two naming bugs discovered during the audit.

## Requirements

### REQ-1 — Subdirectory structure by domain

Move all files from `src/api/` flat root into the following subdirectories:

```
src/api/
  auth/
    sign-in.ts
    sign-out.ts
    complete-google-registration.ts

  patients/
    create-patient.ts
    delete-patient.ts
    get-patients.ts
    get-patient-by-id.ts
    get-patient-by-cpf.ts
    get-patient-by-name.ts
    get-patient-details.ts
    get-patients-filter.ts
    get-patients-with-scheduled.ts
    update-patient.ts
    toggle-patient-status.ts
    register-patient-via-invite.ts
    anamnesis.ts
    patient-with-attachment.ts
    get-patients-by-age.ts
    get-patients-by-gender.ts
    get-amount-patients-card.ts
    get-amount-patients-chart.ts

  appointments/
    create-appointment.ts
    get-appointment.ts
    fetch-appointments.ts
    cancel-appointment.ts
    delete-appointment.ts
    update-appointment.ts
    reschedule-appointment.ts
    start-appointment.ts
    start-appointment-session.ts
    finish-appointment-session.ts
    get-available-slots.ts
    get-active-appointments-grouped.ts
    get-scheduled-appointment.ts

  psychologists/
    create-user.ts
    get-profile.ts
    update-psychologist.ts
    get-psychologists-by-age.ts
    get-psychologists-gender-stats.ts
    get-new-psychologists-count.ts
    get-total-psychologists.ts
    approvals.ts

  suggestions/
    create-suggestion.ts
    get-suggestions.ts
    update-suggestion-status.ts
    toggle-suggestion-like.ts
    get-most-voted-suggestions.ts
    get-total-suggestions-card.ts
    get-ranking.ts

  metrics/
    fetch-dashboard-data.ts
    get-daily-sessions-metrics.ts
    get-monthly-sessions-count.ts
    get-total-work-hours.ts
    get-total-patients-admin-chart.ts
    get-total-patients-card.ts

  invites/
    generate-registration-link.ts
    get-invite-details.ts

  attachments/
    attachments.ts

  billing/
    create-billing.ts

  popups/
    popups.ts

  livekit/
    livekit.ts
```

**Domain decisions:**
- `metrics/` (not `dashboard/`) — these files feed multiple pages; the data domain, not the view, drives the name
- `patient-with-attachment.ts` → `patients/` — it returns a patient list filtered by attachment presence; the entity is patient
- `anamnesis.ts` → `patients/` — anamnesis is a patient sub-resource
- Single-file domains still get a subdirectory — enforces a consistent lookup rule: always find folder first

No barrel `index.ts` files. Vite tree-shakes at the file level; barrels would bundle entire domains for any single import. Direct file imports already read clearly.

### REQ-2 — Fix filename bugs during migration

| Current | New | Reason |
|---|---|---|
| `upadate-patient.ts` | `patients/update-patient.ts` | Typo (transposed letters) |
| `create-billing.ts.ts` | `billing/create-billing.ts` | Double extension |
| `create-patients.ts` | `patients/create-patient.ts` | Plural on single-entity action |
| `delete-patients.ts` | `patients/delete-patient.ts` | Plural on single-entity action |

### REQ-3 — Update all import paths

All ~86 import lines across ~49 consumer files (pages, components, hooks) must point to the new paths. No consumer file should retain a `@/api/<flat-file>` import after the migration.

Special cases requiring manual attention:
- `register-patients.tsx` — imports `upadate-patient` by the typo name; update to `@/api/patients/update-patient`
- `test-billing.tsx` — imports `@/api/create-billing.ts` (explicit `.ts` extension needed because of double extension); update to `@/api/billing/create-billing` (drop the extension)

## Out of Scope

- Moving `src/types/` or `src/hooks/` — this spec is API layer only
- Adding index barrel files
- Changing function names or signatures inside the API files
- Touching `vite.config.ts` — the `@` alias already covers all new subpaths

## Verification

1. `grep -r "from ['\"]@/api/[^/]" src/` → zero matches (no flat-root imports remain)
2. `npx tsc --noEmit` → exits 0
3. `npx vite build` → exits 0, no module-not-found errors
4. `ls src/api/*.ts` → no files (only subdirectories at root level)
5. Git log shows `upadate-patient.ts` renamed to `patients/update-patient.ts` and `create-billing.ts.ts` renamed to `billing/create-billing.ts`
