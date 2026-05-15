# Feature: API Envelope Adaptation

## Context

The NestJS backend standardized all responses to a fixed JSON envelope. The frontend currently reads `response.data` as the raw payload, but now `response.data` is the envelope wrapper. Every service call silently receives the wrong shape, and every toast error string shows `undefined` because the message field moved inside a nested `error` object.

The fix is centralized in the Axios interceptor so that all 63 service files are fixed automatically, plus targeted updates to 11 component files that read the error message directly.

---

## Response Contracts

### Success
```json
{
  "success": true,
  "statusCode": 200,
  "data": { "...actual payload..." },
  "message": "optional"
}
```

DELETE returns HTTP `204` with no body.

### Error
```json
{
  "success": false,
  "statusCode": 400,
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "Mensagem legível ao usuário"
  }
}
```

---

## Requirements

### R1 — Success envelope unwrapping (centralized)

The Axios response interceptor MUST unwrap the envelope so that `response.data` inside every service function resolves to the inner `data` payload, not the envelope wrapper.

- **R1.1** — When the response body matches `{ success: true, data: any }`, replace `response.data` with `response.data.data` before the response reaches any service function.
- **R1.2** — When the HTTP status is `204` or the body is `null`/`undefined`, skip unwrapping and return the response unchanged.
- **R1.3** — When the response body does not match the envelope shape (e.g., a proxy or gateway error returning plain HTML), skip unwrapping and return the response unchanged.
- **R1.4** — No file in `src/api/` may be modified as part of this feature. All 63 service files must work transparently after the interceptor change.

### R2 — Error normalization (centralized)

The Axios error interceptor MUST normalize errors from the envelope so components can read them from a consistent location.

- **R2.1** — When the error response body matches `{ success: false, error: { code, message } }`, set `error.message = error.response.data.error.message` on the AxiosError object.
- **R2.2** — Attach `error.apiCode = error.response.data.error.code` as a typed property (`ApiErrorCode`) for components that branch on error semantics.
- **R2.3** — The existing 401 redirect logic (clear localStorage, redirect to `/sign-in`, skip redirect for auth paths) MUST be preserved unchanged.
- **R2.4** — When `error.response` is absent (network error, timeout), pass the error through without modification.
- **R2.5** — When the error body does not match the envelope shape, skip normalization; `error.message` retains its Axios default.

### R3 — TypeScript types

- **R3.1** — Create `src/types/api.ts` with `ApiSuccessEnvelope<T>`, `ApiErrorEnvelope`, and `ApiErrorCode` (union of all 17 error codes from the backend contract).
- **R3.2** — The interceptor in `src/lib/axios.ts` MUST use these types for the `isSuccessEnvelope` and `isErrorEnvelope` type guards.
- **R3.3** — `tsc --noEmit` MUST pass with zero errors after the changes.

### R4 — Component error handling

All component files that currently access `err.response?.data?.message` MUST be updated to read `err?.message` instead.

| ID | File | Line |
|----|------|------|
| R4.1 | `src/pages/auth/components/sign-in-form.tsx` | 87 |
| R4.2 | `src/pages/auth/components/patient-sign-up-form.tsx` | 61 |
| R4.3 | `src/pages/auth/google-oauth-complete.tsx` | 96 |
| R4.4 | `src/pages/auth/complete-registration.tsx` | 85 |
| R4.5 | `src/pages/app/billing/test-billing.tsx` | 30 |
| R4.6 | `src/pages/app/video-room/components/appointment-add-form.tsx` | 78 |
| R4.7 | `src/pages/app/account/components/edit-psychologist-dialog.tsx` | 42 |
| R4.8 | `src/pages/app/patients/patients-list/components/delete-patient-dialog.tsx` | 27 |
| R4.9 | `src/pages/app/patients/patients-list/register-patients/register-patients.tsx` | 377 |
| R4.10 | `src/pages/app/appointment/appointment-list/components/register-appointment.tsx` | 91 |

### R5 — Sign-up error-code branching (special case)

`src/pages/auth/components/sign-up-form.tsx` currently compares the error message string against `"EMAIL_ALREADY_EXISTS"` and `"CPF_ALREADY_EXISTS"` to set field-level validation errors. This breaks with the new backend because:
- `err.message` is now a human-readable string, not a machine code
- The backend's `ApiErrorCode` for email conflict is `EMAIL_ALREADY_IN_USE` (not `EMAIL_ALREADY_EXISTS`)
- There is no CPF-specific code in the backend contract (open question — see below)

- **R5.1** — Replace the status+message comparison with an `err?.apiCode` comparison using `ApiErrorCode` values.
- **R5.2** — For email conflicts: `if (apiCode === 'EMAIL_ALREADY_IN_USE')` → set field error on `"email"` + toast.
- **R5.3** — For CPF conflicts: ⚠️ **confirm with backend team** which `ApiErrorCode` is emitted. Until confirmed, fall through to `toast.error(err?.message || "Erro ao realizar cadastro")`.

### R6 — No business logic changes

- **R6.1** — No changes to routing, form validation rules, query keys, cache settings, or UI structure.
- **R6.2** — No new API endpoints, no changes to request payloads or HTTP methods.
- **R6.3** — All changes are confined to the API communication layer: `src/lib/axios.ts`, `src/types/api.ts`, and the 11 component files listed in R4/R5.

---

## Open Questions

| # | Question | Owner | Status |
|---|----------|-------|--------|
| OQ-1 | What `ApiErrorCode` does the backend emit for CPF duplicate on psychologist registration? | Backend team | ❓ Open |

---

## Acceptance Criteria

| # | Scenario | Expected result |
|---|----------|----------------|
| AC-1 | Sign in with wrong password | Toast shows backend error string (e.g., "Credenciais inválidas"), not `undefined` |
| AC-2 | Sign in with correct credentials | Redirects to dashboard; 401 interceptor not triggered |
| AC-3 | Register psychologist with duplicate email | Field error on `email` input + descriptive toast |
| AC-4 | Load patients list page | Table populates with patient data |
| AC-5 | Delete a patient | Dialog closes, no runtime error (204 No Content handled) |
| AC-6 | Network offline during any request | Toast shows fallback string, not `undefined` |
| AC-7 | `tsc --noEmit` | Zero type errors |
