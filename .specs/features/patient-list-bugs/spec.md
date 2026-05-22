# Patient List — Autocomplete Bug Fixes

## Problem Statement

The browser's native autocomplete (notably Edge's form-fill) contaminates unrelated inputs with data typed into the patient registration form. The search field in `PatientsTableFilters` receives email/name suggestions from the registration form because it has no `autoComplete="off"` guard. Additionally, registration form fields use autocomplete tokens meant for the logged-in user's own data (`given-name`, `family-name`, `tel`), causing the browser to store and resurface patient data as personal fill suggestions.

## Goals

- [ ] Search input never receives browser autocomplete suggestions
- [ ] All patient registration fields suppress browser storage of patient data

## Out of Scope

| Feature | Reason |
|---|---|
| Password manager suppression | Not relevant — no credential fields |
| Custom autocomplete / typeahead | Separate feature |

---

## User Stories

### P1: Search input must not receive autocomplete suggestions ⭐ MVP

**User Story**: As a psychologist, I want the patient search field to stay clean so that I don't accidentally select a patient email from autocomplete when I'm trying to search by name.

**Why P1**: Direct UX regression — browser fills the search input with an email typed in the registration form, breaking the search flow.

**Acceptance Criteria**:

1. WHEN the user focuses the search input in `PatientsTableFilters` THEN the browser SHALL NOT show autocomplete suggestions
2. WHEN the user opens the registration dialog and fills in email THEN that value SHALL NOT appear later as a suggestion in the search input

**Independent Test**: Open patients list → click "Cadastrar paciente" → type an email → close dialog → click the search input → no email suggestion should appear.

---

### P1: Registration form fields must not trigger browser personal-data fill ⭐ MVP

**User Story**: As a psychologist, I want to fill in a patient's data without the browser offering to replace it with my own saved contacts or personal info.

**Why P1**: `step-basic-data.tsx` uses `autoComplete="given-name"` / `autoComplete="family-name"` — tokens that tell the browser this is the user's own name, causing Edge/Chrome to offer personal data and persist patient names as if they were the user's own.

**Acceptance Criteria**:

1. WHEN the user focuses firstName/lastName in `StepBasicData` THEN the browser SHALL NOT suggest the user's own saved names
2. WHEN the user focuses CPF or date-of-birth THEN the browser SHALL NOT offer autocomplete suggestions
3. WHEN the user focuses phone in `StepContactAddress` THEN the browser SHALL NOT offer the user's own phone number
4. WHEN the user focuses CEP/street/district/city THEN the browser SHALL NOT offer autocomplete suggestions

**Independent Test**: Open registration form → focus firstName → no browser dropdown with personal data.

---

## Edge Cases

- WHEN the form is inside a `<Dialog>` (which it is) THEN `autoComplete="off"` must still apply — some browsers require both the input and the `<form>` element to carry the attribute
- WHEN the `<Input>` component spreads props THEN `autoComplete` must be explicitly passed (it already spreads `...props`)

---

## Requirement Traceability

| Requirement ID | Story | File | Status |
|---|---|---|---|
| PLBUG-01 | P1: Search input autocomplete | `patients-table-filters.tsx` | Pending |
| PLBUG-02 | P1: firstName / lastName tokens | `step-basic-data.tsx` | Pending |
| PLBUG-03 | P1: CPF autocomplete | `step-basic-data.tsx` | Pending |
| PLBUG-04 | P1: date-of-birth autocomplete | `step-basic-data.tsx` | Pending |
| PLBUG-05 | P1: phone `autoComplete="tel"` → `"off"` | `step-contact-address.tsx` | Pending |
| PLBUG-06 | P1: address fields autocomplete | `step-contact-address.tsx` | Pending |

---

## Success Criteria

- [ ] Focusing the search input shows no browser autocomplete dropdown
- [ ] Filling the registration form does not pre-fill with the logged-in user's personal data
- [ ] Patient data typed in the form is not stored by the browser as a fill candidate for other inputs
