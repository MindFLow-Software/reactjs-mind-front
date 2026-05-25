# Tasks — API Topic Organization

**Spec:** `spec.md`
**Total tasks:** 9
**Parallelizable:** T-02 through T-08 run in parallel after T-01 completes

---

## T-01 — Create directories and move all files

**What:** Create 11 domain subdirectories under `src/api/` and move all 56 files into them using `git mv` (preserves history). Apply all 4 filename renames in the same step.

**Where:** `src/api/`

**Depends on:** nothing

**Renames applied in this task:**

| Source | Destination |
|---|---|
| `src/api/upadate-patient.ts` | `src/api/patients/update-patient.ts` |
| `src/api/create-billing.ts.ts` | `src/api/billing/create-billing.ts` |
| `src/api/create-patients.ts` | `src/api/patients/create-patient.ts` |
| `src/api/delete-patients.ts` | `src/api/patients/delete-patient.ts` |

**All other moves (name unchanged, path only):**

```
auth/          sign-in.ts, sign-out.ts, complete-google-registration.ts
patients/      get-patients.ts, get-patient-by-id.ts, get-patient-by-cpf.ts,
               get-patient-by-name.ts, get-patient-details.ts, get-patients-filter.ts,
               get-patients-with-scheduled.ts, toggle-patient-status.ts,
               register-patient-via-invite.ts, anamnesis.ts, patient-with-attachment.ts,
               get-patients-by-age.ts, get-patients-by-gender.ts,
               get-amount-patients-card.ts, get-amount-patients-chart.ts
appointments/  create-appointment.ts, get-appointment.ts, fetch-appointments.ts,
               cancel-appointment.ts, delete-appointment.ts, update-appointment.ts,
               reschedule-appointment.ts, start-appointment.ts, start-appointment-session.ts,
               finish-appointment-session.ts, get-available-slots.ts,
               get-active-appointments-grouped.ts, get-scheduled-appointment.ts
psychologists/ create-user.ts, get-profile.ts, update-psychologist.ts,
               get-psychologists-by-age.ts, get-psychologists-gender-stats.ts,
               get-new-psychologists-count.ts, get-total-psychologists.ts, approvals.ts
suggestions/   create-suggestion.ts, get-suggestions.ts, update-suggestion-status.ts,
               toggle-suggestion-like.ts, get-most-voted-suggestions.ts,
               get-total-suggestions-card.ts, get-ranking.ts
metrics/       fetch-dashboard-data.ts, get-daily-sessions-metrics.ts,
               get-monthly-sessions-count.ts, get-total-work-hours.ts,
               get-total-patients-admin-chart.ts, get-total-patients-card.ts
invites/       generate-registration-link.ts, get-invite-details.ts
attachments/   attachments.ts
billing/       (renamed above)
popups/        popups.ts
livekit/       livekit.ts
```

**Done when:** `ls src/api/*.ts` returns nothing. All files are under subdirectories. `git status` shows only renames/moves.

**Commit:** `refactor(api): organize files into domain subdirectories`

**Note:** Build is broken between T-01 and T-02–T-08 completing. Do not run tsc/build after this task alone.

---

## T-02 — Update imports: auth domain [P]

**What:** Update all consumer files that import from `@/api/sign-in`, `@/api/sign-out`, or `@/api/complete-google-registration`.

**Where:**
- `src/pages/auth/components/sign-in-form.tsx` — `@/api/sign-in` → `@/api/auth/sign-in`
- `src/components/ui/nav-user.tsx` — `@/api/sign-out` → `@/api/auth/sign-out`
- `src/pages/auth/google-oauth-complete.tsx` — `@/api/complete-google-registration` → `@/api/auth/complete-google-registration`

**Depends on:** T-01

**Done when:** No file in `src/` imports from `@/api/sign-in`, `@/api/sign-out`, or `@/api/complete-google-registration`.

**Commit:** `refactor(api): update auth import paths`

---

## T-03 — Update imports: patients domain [P]

**What:** Update all consumer files importing any patient-related API file.

**Special case:** `register-patients.tsx` imports `upadate-patient` (typo) — update to `@/api/patients/update-patient`.

**Old stems → new paths:**

| Old import stem | New path |
|---|---|
| `@/api/create-patients` | `@/api/patients/create-patient` |
| `@/api/delete-patients` | `@/api/patients/delete-patient` |
| `@/api/get-patients` | `@/api/patients/get-patients` |
| `@/api/get-patient-by-id` | `@/api/patients/get-patient-by-id` |
| `@/api/get-patient-by-cpf` | `@/api/patients/get-patient-by-cpf` |
| `@/api/get-patient-by-name` | `@/api/patients/get-patient-by-name` |
| `@/api/get-patient-details` | `@/api/patients/get-patient-details` |
| `@/api/get-patients-filter` | `@/api/patients/get-patients-filter` |
| `@/api/get-patients-with-scheduled` | `@/api/patients/get-patients-with-scheduled` |
| `@/api/upadate-patient` | `@/api/patients/update-patient` |
| `@/api/toggle-patient-status` | `@/api/patients/toggle-patient-status` |
| `@/api/register-patient-via-invite` | `@/api/patients/register-patient-via-invite` |
| `@/api/anamnesis` | `@/api/patients/anamnesis` |
| `@/api/patient-with-attachment` | `@/api/patients/patient-with-attachment` |
| `@/api/get-patients-by-age` | `@/api/patients/get-patients-by-age` |
| `@/api/get-patients-by-gender` | `@/api/patients/get-patients-by-gender` |
| `@/api/get-amount-patients-card` | `@/api/patients/get-amount-patients-card` |
| `@/api/get-amount-patients-chart` | `@/api/patients/get-amount-patients-chart` |

**Depends on:** T-01

**Done when:** No file in `src/` imports any of the old patient stems listed above.

**Commit:** `refactor(api): update patients import paths`

---

## T-04 — Update imports: appointments domain [P]

**What:** Update all consumer files importing appointment-related API files.

**Old stems → new paths:**

| Old import stem | New path |
|---|---|
| `@/api/create-appointment` | `@/api/appointments/create-appointment` |
| `@/api/get-appointment` | `@/api/appointments/get-appointment` |
| `@/api/fetch-appointments` | `@/api/appointments/fetch-appointments` |
| `@/api/cancel-appointment` | `@/api/appointments/cancel-appointment` |
| `@/api/delete-appointment` | `@/api/appointments/delete-appointment` |
| `@/api/update-appointment` | `@/api/appointments/update-appointment` |
| `@/api/reschedule-appointment` | `@/api/appointments/reschedule-appointment` |
| `@/api/start-appointment` | `@/api/appointments/start-appointment` |
| `@/api/start-appointment-session` | `@/api/appointments/start-appointment-session` |
| `@/api/finish-appointment-session` | `@/api/appointments/finish-appointment-session` |
| `@/api/get-available-slots` | `@/api/appointments/get-available-slots` |
| `@/api/get-active-appointments-grouped` | `@/api/appointments/get-active-appointments-grouped` |
| `@/api/get-scheduled-appointment` | `@/api/appointments/get-scheduled-appointment` |

**Depends on:** T-01

**Done when:** No file in `src/` imports any of the old appointment stems listed above.

**Commit:** `refactor(api): update appointments import paths`

---

## T-05 — Update imports: psychologists domain [P]

**What:** Update all consumer files importing psychologist-related API files.

**Old stems → new paths:**

| Old import stem | New path |
|---|---|
| `@/api/create-user` | `@/api/psychologists/create-user` |
| `@/api/get-profile` | `@/api/psychologists/get-profile` |
| `@/api/update-psychologist` | `@/api/psychologists/update-psychologist` |
| `@/api/get-psychologists-by-age` | `@/api/psychologists/get-psychologists-by-age` |
| `@/api/get-psychologists-gender-stats` | `@/api/psychologists/get-psychologists-gender-stats` |
| `@/api/get-new-psychologists-count` | `@/api/psychologists/get-new-psychologists-count` |
| `@/api/get-total-psychologists` | `@/api/psychologists/get-total-psychologists` |
| `@/api/approvals` | `@/api/psychologists/approvals` |

**Depends on:** T-01

**Key consumer:** `src/hooks/use-psychologist-profile.ts` and `src/components/ui/nav-user.tsx` (shared component — verify both imports are updated).

**Done when:** No file in `src/` imports any of the old psychologist stems listed above.

**Commit:** `refactor(api): update psychologists import paths`

---

## T-06 — Update imports: suggestions domain [P]

**What:** Update all consumer files importing suggestion-related API files.

**Old stems → new paths:**

| Old import stem | New path |
|---|---|
| `@/api/create-suggestion` | `@/api/suggestions/create-suggestion` |
| `@/api/get-suggestions` | `@/api/suggestions/get-suggestions` |
| `@/api/update-suggestion-status` | `@/api/suggestions/update-suggestion-status` |
| `@/api/toggle-suggestion-like` | `@/api/suggestions/toggle-suggestion-like` |
| `@/api/get-most-voted-suggestions` | `@/api/suggestions/get-most-voted-suggestions` |
| `@/api/get-total-suggestions-card` | `@/api/suggestions/get-total-suggestions-card` |
| `@/api/get-ranking` | `@/api/suggestions/get-ranking` |

**Depends on:** T-01

**Done when:** No file in `src/` imports any of the old suggestion stems listed above.

**Commit:** `refactor(api): update suggestions import paths`

---

## T-07 — Update imports: metrics domain [P]

**What:** Update all consumer files importing metrics-related API files.

**Old stems → new paths:**

| Old import stem | New path |
|---|---|
| `@/api/fetch-dashboard-data` | `@/api/metrics/fetch-dashboard-data` |
| `@/api/get-daily-sessions-metrics` | `@/api/metrics/get-daily-sessions-metrics` |
| `@/api/get-monthly-sessions-count` | `@/api/metrics/get-monthly-sessions-count` |
| `@/api/get-total-work-hours` | `@/api/metrics/get-total-work-hours` |
| `@/api/get-total-patients-admin-chart` | `@/api/metrics/get-total-patients-admin-chart` |
| `@/api/get-total-patients-card` | `@/api/metrics/get-total-patients-card` |

**Depends on:** T-01

**Done when:** No file in `src/` imports any of the old metrics stems listed above.

**Commit:** `refactor(api): update metrics import paths`

---

## T-08 — Update imports: small domains [P]

**What:** Update all consumer files importing from invites, attachments, billing, popups, and livekit.

**Old stems → new paths:**

| Old import stem | New path | Notes |
|---|---|---|
| `@/api/generate-registration-link` | `@/api/invites/generate-registration-link` | |
| `@/api/get-invite-details` | `@/api/invites/get-invite-details` | |
| `@/api/attachments` | `@/api/attachments/attachments` | |
| `@/api/create-billing.ts` | `@/api/billing/create-billing` | Drop explicit `.ts` extension in import string |
| `@/api/popups` | `@/api/popups/popups` | |
| `@/api/livekit` | `@/api/livekit/livekit` | |

**Depends on:** T-01

**Special case:** `src/pages/app/billing/test-billing.tsx` imports `@/api/create-billing.ts` with explicit extension — update to `@/api/billing/create-billing` (no extension).

**Done when:** No file in `src/` imports any of the old stems listed above.

**Commit:** `refactor(api): update invites, attachments, billing, popups, livekit import paths`

---

## T-09 — Verify build and imports

**What:** Run all verification checks to confirm the migration is complete.

**Depends on:** T-02, T-03, T-04, T-05, T-06, T-07, T-08

**Gate checks (all must pass):**

```bash
# 1. No flat-root imports remain
grep -rn "from ['\"]@/api/[^/]" src/
# Expected: zero matches

# 2. TypeScript compiles clean
npx tsc --noEmit
# Expected: exit 0

# 3. Vite build succeeds
npx vite build
# Expected: exit 0, no module-not-found errors

# 4. No files remain at api root
ls src/api/*.ts 2>/dev/null || echo "OK — no root-level files"
# Expected: "OK — no root-level files"
```

**Done when:** All 4 checks pass with zero errors.

**Commit:** none — this is a verification-only task.
