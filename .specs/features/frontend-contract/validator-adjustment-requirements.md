# Frontend Validator Adjustment Requirements

> Source of truth: backend Zod schemas, controllers, and entity enums.
> All findings verified against backend source as of 2026-05-31.
> Each item includes the exact backend file as proof.

---

## SECTION 1 — `validators/auth.ts`

---

### AUTH-01 — `signInSchema.password`: keep min(6), do NOT add complexity regex

**Backend schema:** `src/validators/auth/controllers/authenticate-schema.ts`
```ts
password: z.string().min(6)
```

The login endpoint accepts any password ≥ 6 chars — complexity is not validated at login.
Adding a regex to the frontend's sign-in schema would break logins for users who registered
before the strong-password policy was introduced.

**Required frontend action:** ensure `signInSchema.password` is exactly `z.string().min(6)`.
Do not apply the complexity regex here.

---

### AUTH-02 — `signUpFormSchema` (psychologist register): align password special chars

**Backend schema:** `src/validators/psychologists/controllers/create-psychologist-schema.ts`

Password regex:
```
^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,30}$
```

Special characters accepted: **only** `! @ # $ % ^ & *`.

If the frontend accepts a broader set (e.g. `_`, `-`, `(`, `)`) it will allow passwords the
backend will reject. Frontend regex must match exactly.

**Required frontend action:** use the same regex character class `[!@#$%^&*]` for specials.

---

### AUTH-03 — `signUpFormSchema` (psychologist): remove `firstName`/`lastName` letter-only regex

**Backend schema:** `src/validators/psychologists/controllers/create-psychologist-schema.ts`
```ts
firstName: z.string().min(1),
lastName: z.string().min(1),
```

Backend does not validate character set. The frontend's `[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+` regex
would reject names the backend accepts (e.g. names with numbers or unusual chars). It is
permissible to keep it for UX, but it must not be more restrictive than backend on character set.

**Required frontend action:** verify whether the current regex rejects any valid name
the backend accepts. If so, relax or remove the regex.

---

### AUTH-04 — `signUpFormSchema` (psychologist): `phoneNumber` format

**Backend schema:** `src/validators/psychologists/controllers/create-psychologist-schema.ts`
```ts
phoneNumber: z.string().min(1),
```

Backend accepts any non-empty string — no format, no max length.
Frontend `max(15)` is extra restriction that could block valid numbers.

**Required frontend action:** remove `max(15)`. Keep `min(1)` or `min(10)` as UX guard only —
the backend will not reject strings longer than 15 chars.

---

### AUTH-05 — `signUpFormSchema` (psychologist): `dateOfBirth` format

**Backend schema:** `src/validators/psychologists/controllers/create-psychologist-schema.ts`
```ts
dateOfBirth: z.coerce.date()
  .refine(date >= minDate)   // max age ~120 years
  .refine(date <= maxDateForPro)  // must be ≥ 18 years old
```

Backend uses `z.coerce.date()` which accepts ISO strings sent over JSON. Frontend sending
a Date object serialized to ISO 8601 string is correct.

**Two age constraints the backend enforces — frontend must mirror:**
- Minimum age: **18 years** (professional account)
- Maximum age: **120 years** (sanity check)

**Required frontend action:** if `signUpFormSchema` does not already validate these age bounds,
add them. The backend will return a 422 on invalid dates.

---

### AUTH-06 — `patientSignUpSchema`: password must match register-patient backend schema

**Backend schema:** `src/validators/patients/controllers/register-patient-schema.ts`
```ts
password: z.string()
  .min(8, 'A senha deve conter, no mínimo, 8 caracteres')
  .regex(/[a-z]/, 'A senha deve conter letras minúsculas')
  .regex(/[A-Z]/, 'A senha deve conter letras maiúsculas')
  .regex(/[0-9]/, 'A senha deve conter números')
  .regex(/[^A-Za-z0-9]/, 'A senha deve conter caracteres especiais'),
```

Note: the regex here uses `[^A-Za-z0-9]` (any non-alphanumeric), which is broader than
the psychologist schema's `[!@#$%^&*]`.

**Frontend currently has:** `z.string().min(6)` — **wrong**. Backend will reject passwords
shorter than 8 chars or missing complexity.

**Required frontend action:**
```ts
password: z.string()
  .min(8, 'A senha deve conter, no mínimo, 8 caracteres')
  .regex(/[a-z]/, 'A senha deve conter letras minúsculas')
  .regex(/[A-Z]/, 'A senha deve conter letras maiúsculas')
  .regex(/[0-9]/, 'A senha deve conter números')
  .regex(/[^A-Za-z0-9]/, 'A senha deve conter caracteres especiais'),
```

---

### AUTH-07 — `patientSignUpSchema`: `dateOfBirth` type mismatch

**Backend schema:** `src/validators/patients/controllers/register-patient-schema.ts`
```ts
dateOfBirth: z.coerce.date().optional(),
```

Backend coerces from ISO string sent over JSON. `z.coerce.date()` accepts any parseable
date string (`"1990-05-15"` or `"1990-05-15T00:00:00.000Z"`).

**Frontend currently has:** `z.string().min(10)` — different type, no coercion.
This works only by coincidence if the backend coerces the string anyway, but the types diverge
and error messages will differ.

**Required frontend action:** change to `z.coerce.date().optional()` (or `z.string().min(10)`
if the API call transforms before sending — in that case document the transform explicitly).

---

### AUTH-08 — `patientSignUpSchema`: `firstName`/`lastName` min(1) not min(2)

**Backend schema:** `src/validators/patients/controllers/register-patient-schema.ts`
```ts
firstName: z.string().min(1),
lastName: z.string().min(1),
```

**Frontend has min(2)** — will reject single-character names that the backend accepts.

**Required frontend action:** change to `min(1)` or keep `min(2)` as a deliberate stricter
UX constraint — but document it as a frontend-only rule so it is not assumed to reflect
backend behavior.

---

### AUTH-09 — `patientSignUpSchema`: `cpf` — backend does NOT validate here

**Backend schema:** `src/validators/patients/controllers/register-patient-schema.ts`
```ts
cpf: z.string().optional(),
```

No `refine(CPF.isValid)`. Backend intentionally accepts any optional string for patient
CPF at registration via invite. CPF validation in patient register is frontend-only.

**Required frontend action:** keep CPF validation if it is a UX requirement, but know that
the backend will not reject an invalid CPF string here. Document this as intentional.

---

### AUTH-10 — `completeRegistrationSchema`: `expertise` missing 2 values

**Backend schema:** `src/validators/auth/controllers/complete-oauth-registration-schema.ts`
```ts
expertise: z.preprocess(toUpperCase, z.nativeEnum(Expertise)),
```

`Expertise` enum has **9 values**:
```
OTHER, SOCIAL, INFANT, CLINICAL, JURIDICAL,
EDUCATIONAL, ORGANIZATIONAL, PSYCHOTHERAPIST, NEUROPSYCHOLOGY
```

**Frontend enum is missing:** `EDUCATIONAL` and `ORGANIZATIONAL`.
Selecting either from the UI is impossible; if somehow sent, the backend accepts them.

**Required frontend action:** add both values to the expertise enum/options in the schema.

**Backend proof:** `src/core/domain/main/enterprise/entities/shared/enums.ts`

---

### AUTH-11 — `completeRegistrationSchema`: `crp` — no format regex

**Backend schema:** `src/validators/auth/controllers/complete-oauth-registration-schema.ts`
```ts
crp: z.string().trim().min(1),
```

Backend only requires non-empty string — no CRP format validation (`XX/NNNNN` or otherwise).

**Required frontend action:** if frontend validates CRP format, it is stricter than the backend.
This is acceptable for UX but should be documented. The backend will not enforce the format.

---

### AUTH-12 — `completeRegistrationSchema`: backend also receives `dateOfBirth`, `cpf`, `phoneNumber`

**Backend schema:** `src/validators/auth/controllers/complete-oauth-registration-schema.ts`
```ts
dateOfBirth: z.coerce.date().nullable().default(null),
cpf: z.string().trim().nullable().default(null).refine(CPF.isValid when present),
phoneNumber: z.string().trim().nullable().default(null),
```

If the frontend's `completeRegistrationSchema` does not include these fields, they will be
omitted from the request body and the backend will use their defaults (`null`). This may be
intentional if the data is collected elsewhere. Confirm whether these fields should be part of
the complete-registration form.

---

## SECTION 2 — `validators/patients.ts`

---

### PAT-01 — `patientSchema` (create): `email` is not part of create-patient body

**Backend schema:** `src/validators/patients/controllers/create-patient-schema.ts`
```ts
// email field does NOT exist in createPatientBodySchema
firstName, lastName, phoneNumber, profileImageUrl, dateOfBirth, cpf, gender
```

The `POST /patient` endpoint does not accept `email`. If the frontend sends it, it is silently
ignored. The field belongs only to the update schema.

**Required frontend action:** remove `email` from the create-patient form schema if it is
currently included. Keep it only in the update schema.

---

### PAT-02 — `patientSchema` (update): `email` does not accept empty string

**Backend schema:** `src/validators/patients/controllers/update-patient-schema.ts`
```ts
email: z.string().email().optional(),
```

No `z.literal("")` branch. Sending `""` (empty string) will fail backend validation with a 400.

**Required frontend action:** remove `z.or(z.literal(""))` from email validation. If the user
clears the email field, send `undefined` (omit the field) or do not allow clearing email via
this form. Do not send an empty string.

---

### PAT-03 — `patientSchema` (create/update): `dateOfBirth` format

**Backend schemas:** both create and update use `z.coerce.date()` which accepts ISO strings.

**Required frontend action:** ensure `dateOfBirth` is sent as an ISO 8601 string
(`"1990-05-15"` or full datetime). `z.coerce.date()` on the backend will parse either.
Do NOT send a plain JS Date object — JSON serialization will produce an ISO string anyway,
so this is correct by default.

---

### PAT-04 — `patientSchema` (create): `cpf` optional but refine has bug when absent

**Backend schema:** `src/validators/patients/controllers/create-patient-schema.ts`
```ts
cpf: z.string().optional().refine((val) => CPF.isValid(val), { message: 'CPF inválido' }),
```

`CPF.isValid(undefined)` returns `false`. In Zod, `.refine()` on a `ZodOptional` is called
with `undefined` when the field is absent, which means this schema technically rejects
requests with no `cpf` field. This is a backend bug.

**Required frontend action:** always send `cpf` as either a valid CPF string or omit it from
the request entirely (do not send `cpf: undefined` explicitly — rely on JSON serialization
to drop the key). Test whether omitting works with the current backend behavior.

---

### PAT-05 — `patientSchema`: `firstName`/`lastName` letter-only regex

Same as AUTH-03: backend uses `z.string().min(1)` with no character set restriction.
Frontend regex is extra. Keep only if intentional UX constraint — document as frontend-only.

---

### PAT-06 — `FetchPatientsParams.status`: must use `AccountStatus` values

**Backend schema:** `src/validators/patients/controllers/fetch-patients-schema.ts`
```ts
status: z.enum(AccountStatus).optional(),
// AccountStatus = ['PENDING', 'ACTIVE', 'REJECTED', 'BLOCKED']
```

Frontend `PatientStatus` (`'active' | 'inactive' | 'pending' | 'archived'`) does not match.
Sending these lowercase values will return a 400 from the backend.

**Required frontend action:**
```ts
status?: 'PENDING' | 'ACTIVE' | 'REJECTED' | 'BLOCKED'
```

---

## SECTION 3 — `validators/attachments.ts`

---

### ATT-01 — `MAX_FILE_SIZE_BYTES`: backend limit is 3 MB, not 5 MB

**Backend controller:** `src/infra/http/controllers/attachments/upload-attachment.controller.ts`
```ts
new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 3 })
// Error message: 'O arquivo excedeu o limite de 3MB.'
```

**Frontend currently has:** `5 * 1024 * 1024` (5 MB). Users who upload files between 3–5 MB
will pass frontend validation but receive a 413 from the backend.

**Required frontend action:**
```ts
export const MAX_FILE_SIZE_BYTES = 1024 * 1024 * 3 // 3 MB
```

---

### ATT-02 — `ACCEPTED_MIME_TYPES`: no audio types — remove from label

**Backend controller:** `src/infra/http/controllers/attachments/upload-attachment.controller.ts`
```ts
const allowedMimeTypes = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'application/pdf',
]
// Error: 'Tipo de arquivo inválido. Apenas JPG, PNG e PDF são aceitos.'
```

No audio MIME types. The backend will return `INVALID_ATTACHMENT_TYPE` for any audio file.

**Required frontend action:**
1. Ensure `ACCEPTED_MIME_TYPES` contains exactly those 4 types.
2. Fix `ACCEPTED_MIME_LABEL` — remove any mention of "áudios". Correct label:
   `"PDFs e imagens (JPG, PNG)"` or equivalent.

---

### ATT-03 — `FetchAllAttachmentsParams`: query param is `page` not `pageIndex`

**Backend schema:** `src/validators/attachments/controllers/fetch-attachments-schema.ts`
```ts
page: z.string().optional().default('0').transform(Number).pipe(z.number().min(0)),
filter: z.string().optional(),
patientId: z.string().uuid().optional(),
from: z.string().optional().transform(val => val ? new Date(val) : undefined),
to:   z.string().optional().transform(val => val ? new Date(val) : undefined),
```

There is **no `perPage` parameter**. There is no `pageIndex`. The param is `page` (numeric,
starts at 0, sent as a string query param).

**Required frontend action:**
- Rename `pageIndex` → `page` in `FetchAllAttachmentsParams`.
- Remove `perPage` from the type if present.
- `from` and `to` must be sent as ISO date strings — the backend parses them with `new Date(val)`.

---

## SECTION 4 — `validators/suggestions.ts`

---

### SUG-01 — `createSuggestionSchema`: frontend is stricter than backend — decide intentionality

**Backend schema:** `src/validators/suggestions/controllers/create-suggestion-schema.ts`
```ts
title: z.string().min(5),
description: z.string().min(10),
category: z.nativeEnum(SuggestionCategory),
```

**Frontend has:** `title: min(10)`, `description: min(200)` — stricter.

The backend will not reject shorter content. This is a frontend-only UX constraint.

**Required frontend action:** either:
- **Option A (recommended):** keep frontend limits (`min(10)` / `min(200)`) as an intentional
  content-quality gate and document them as frontend-only.
- **Option B:** relax to match backend (`min(5)` / `min(10)`) for consistency.

---

### SUG-02 — `editSuggestionSchema.category`: use `SuggestionCategory` enum, not `z.string()`

**Backend controller:** `src/infra/http/controllers/suggestions/update-suggestion-status.controller.ts`

The update endpoint uses a raw TypeScript interface (no Zod validation):
```ts
interface UpdateSuggestionBody {
  status?: SuggestionStatus
  title?: string
  category?: SuggestionCategory
  description?: string
}
```

The backend does not validate `category` via Zod, but the use case enforces `SuggestionCategory`
at the type level. Sending an invalid string will cause a runtime type error.

**Required frontend action:** change `z.string()` to `z.nativeEnum(SuggestionCategory)` or
the equivalent enum for type safety.

---

### SUG-03 — `editSuggestionSchema`: align minimum lengths with `createSuggestionSchema`

Both schemas should agree on minimum lengths unless there is a deliberate design reason for
edit to be more permissive. Current divergence:

| Field | create | edit |
|-------|--------|------|
| title | min(10) | min(5) |
| description | min(200) | min(10) |

**Required frontend action:** decide and document whether edit is intentionally more permissive.
If not, unify to the same limits.

---

## Summary table

| # | File | Field | Problem | Action |
|---|------|-------|---------|--------|
| AUTH-01 | auth.ts | signIn password | Do not add complexity to login | Keep min(6) only |
| AUTH-02 | auth.ts | signUp password special chars | Regex char class must match `[!@#$%^&*]` | Align regex |
| AUTH-03 | auth.ts | signUp firstName/lastName | Letter-only regex not in backend | Document as frontend-only |
| AUTH-04 | auth.ts | signUp phoneNumber | max(15) not in backend | Remove max |
| AUTH-05 | auth.ts | signUp dateOfBirth | Backend enforces age 18–120 | Add age bounds if missing |
| AUTH-06 | auth.ts | patientSignUp password | min(6) — **must be min(8) + 4 regexes** | Fix immediately |
| AUTH-07 | auth.ts | patientSignUp dateOfBirth | `z.string()` vs `z.coerce.date()` | Change to coerce.date |
| AUTH-08 | auth.ts | patientSignUp firstName/lastName | min(2) vs backend min(1) | Relax or document |
| AUTH-09 | auth.ts | patientSignUp cpf | No CPF validation in backend here | Document as frontend-only |
| AUTH-10 | auth.ts | completeRegistration expertise | Missing EDUCATIONAL, ORGANIZATIONAL | Add both values |
| AUTH-11 | auth.ts | completeRegistration crp | No format regex in backend | Document as frontend-only |
| AUTH-12 | auth.ts | completeRegistration | Missing dateOfBirth, cpf, phoneNumber | Confirm if intentional |
| PAT-01 | patients.ts | create email | email not in create endpoint | Remove from create schema |
| PAT-02 | patients.ts | update email | `z.literal("")` rejected by backend | Remove empty string branch |
| PAT-03 | patients.ts | dateOfBirth format | ISO string — already correct | Verify and document |
| PAT-04 | patients.ts | create cpf refine | Backend bug when cpf omitted | Never send `cpf: undefined` |
| PAT-05 | patients.ts | firstName/lastName regex | Not in backend | Document as frontend-only |
| PAT-06 | patients.ts | FetchParams status | Wrong values (lowercase) | Use PENDING/ACTIVE/REJECTED/BLOCKED |
| ATT-01 | attachments.ts | MAX_FILE_SIZE | 5 MB — **backend is 3 MB** | Fix to 3 MB |
| ATT-02 | attachments.ts | MIME types / label | Label mentions audio, no audio accepted | Remove audio from label |
| ATT-03 | attachments.ts | FetchAllParams | `pageIndex`/`perPage` — **backend uses `page` only** | Rename to `page`, remove `perPage` |
| SUG-01 | suggestions.ts | create title/description | Frontend stricter than backend | Document as intentional or relax |
| SUG-02 | suggestions.ts | edit category | `z.string()` instead of enum | Use SuggestionCategory enum |
| SUG-03 | suggestions.ts | edit vs create min lengths | Diverge without reason | Align or document |

---

## Critical fixes (will cause request failures if not fixed)

These items cause the frontend to either block valid submissions or allow submissions
the backend will reject:

1. **AUTH-06** — `patientSignUpSchema.password` min(6) → backend requires min(8) + complexity
2. **PAT-06** — `FetchPatientsParams.status` lowercase → backend rejects, use uppercase
3. **ATT-01** — `MAX_FILE_SIZE_BYTES` 5 MB → backend limit is 3 MB (users get 413)
4. **ATT-03** — `FetchAllAttachmentsParams.pageIndex` → backend param is `page`
5. **AUTH-10** — `expertise` missing `EDUCATIONAL` and `ORGANIZATIONAL`
