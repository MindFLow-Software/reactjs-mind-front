# Tasks — Patient List Autocomplete Bug Fixes

**Spec:** [spec.md](spec.md)
**Status:** Complete

---

## Task 1 — Fix search input autocomplete

**Req:** PLBUG-01
**File:** `src/pages/app/patients/patients-list/components/table/patients-table-filters.tsx`

**What:** Add `autoComplete="off"` to the search `<Input>` (line ~72).

**Done when:**
- [ ] `autoComplete="off"` present on the search Input
- [ ] No browser autocomplete dropdown appears when focusing the search field after using the registration form

**Gate:** `npm run type-check` passes — no type errors introduced

---

## Task 2 — Fix registration form basic data fields

**Req:** PLBUG-02, PLBUG-03, PLBUG-04
**File:** `src/pages/app/patients/patients-list/register-patients/steps/step-basic-data.tsx`

**What:**
- `firstName` Input: change `autoComplete="given-name"` → `autoComplete="off"`
- `lastName` Input: change `autoComplete="family-name"` → `autoComplete="off"`
- `cpf` Input (inside Controller): add `autoComplete="off"`
- `dateOfBirth` Input (inside Controller): add `autoComplete="off"`

**Done when:**
- [ ] All four inputs have `autoComplete="off"`
- [ ] No browser personal-data suggestions appear on any field

**Gate:** `npm run type-check` passes

---

## Task 3 — Fix registration form contact/address fields

**Req:** PLBUG-05, PLBUG-06
**File:** `src/pages/app/patients/patients-list/register-patients/steps/step-contact-address.tsx`

**What:**
- `phoneNumber` Input: change `autoComplete="tel"` → `autoComplete="off"`
- `cep` Input: add `autoComplete="off"`
- `street` Input: add `autoComplete="off"`
- `district` Input: add `autoComplete="off"`
- `city` Input: add `autoComplete="off"`

**Done when:**
- [ ] All five inputs have `autoComplete="off"`
- [ ] Browser does not suggest addresses or phone numbers from personal data

**Gate:** `npm run type-check` passes

---

## Execution Order

```
Task 1 → Task 2 → Task 3
```

All tasks are independent — can be done in any order or in parallel. No shared state or cross-file dependencies.

---

## Traceability

| Task | Req IDs | Status |
|---|---|---|
| 1 — Search input | PLBUG-01 | Done |
| 2 — Basic data fields | PLBUG-02, PLBUG-03, PLBUG-04 | Done |
| 3 — Contact/address fields | PLBUG-05, PLBUG-06 | Done |
