# Frontend Type Adjustment Requirements

> Source of truth: backend HTTP DTOs, presenters, validators, and domain enums.
> All shapes verified against actual backend code as of 2026-05-31.

---

## REQ-01 — `PatientHTTP`: replace `status` with `isActive`

**File:** `src/types/patient.ts`

**Problem:** `PatientHTTP.status: 'active' | 'inactive'` does not exist on the backend.
The presenter (`PatientPresenter.toHTTP`) returns `isActive: boolean`, sourced from `IpatientHTTPDTO`.

**Required change:**
```ts
// Remove
status: 'active' | 'inactive'

// Add
isActive: boolean
name: string  // backend computes `${firstName} ${lastName}` and always sends it
```

**Backend proof:** `src/infra/http/DTO/patients/patient-http-dto.ts` — no `status` field, only `isActive: boolean` and `name: string`.

---

## REQ-02 — `PatientStatus`: align with `AccountStatus` or remove

**File:** `src/types/patient.ts`

**Problem:** `PatientStatus = 'active' | 'inactive' | 'pending' | 'archived'` is not returned
by any endpoint. The filter query param for listing patients accepts `AccountStatus` values
(`PENDING | ACTIVE | REJECTED | BLOCKED`), not `PatientStatus`.

**Required change — option A (preferred):** Delete `PatientStatus`. Replace every usage with
`AccountStatus` from `auth.ts`.

**Required change — option B:** Rename to `PatientStatusFilter` and redefine as:
```ts
export type PatientStatusFilter = 'PENDING' | 'ACTIVE' | 'REJECTED' | 'BLOCKED'
```
and align `AccountStatus` values to uppercase to match backend enum.

**Backend proof:** `src/validators/patients/controllers/fetch-patients-schema.ts` line 8 —
`status: z.enum(AccountStatus)`. AccountStatus enum: `PENDING | ACTIVE | REJECTED | BLOCKED`.

---

## REQ-03 — `AccountStatus` values: uppercase

**File:** `src/types/auth.ts`

**Problem:** Backend `AccountStatus` enum uses uppercase string values (`PENDING`, `ACTIVE`,
`REJECTED`, `BLOCKED`). Frontend const-object values must match.

**Required change:**
```ts
export const AccountStatus = {
  PENDING: 'PENDING',
  ACTIVE: 'ACTIVE',
  REJECTED: 'REJECTED',
  BLOCKED: 'BLOCKED',
} as const
```

**Backend proof:** `src/core/domain/main/enterprise/entities/shared/enums.ts` lines 15-20.

---

## REQ-04 — `Gender` values: uppercase

**File:** `src/types/patient.ts`

**Problem:** Backend `Gender` enum is `OTHER | FEMININE | MASCULINE` (uppercase). Frontend
must match exactly — including the filter query param.

**Required change:**
```ts
export const Gender = {
  OTHER: 'OTHER',
  FEMININE: 'FEMININE',
  MASCULINE: 'MASCULINE',
} as const
```

**Backend proof:** `src/core/domain/main/enterprise/entities/shared/enums.ts` lines 9-13.

---

## REQ-05 — `SessionItem.status`: remove PT strings, use `AppointmentStatus`

**File:** `src/types/patient.ts`

**Problem:** `SessionItem.status: 'Concluída' | 'Pendente'` is in Portuguese and covers only
2 values. The `GET /patients/:id/details` endpoint returns appointment objects whose `status`
comes from the `AppointmentStatus` enum (7 values, English uppercase).

**Required change:**
```ts
// Remove
status: 'Concluída' | 'Pendente'

// Use AppointmentStatus type (import from appointment.ts or inline)
status: 'SCHEDULED' | 'ATTENDING' | 'FINISHED' | 'CANCELED' | 'NOT_ATTEND' | 'RESCHEDULED' | 'DONE'
```

**Also add missing fields** the endpoint actually returns:
```ts
export interface SessionItem {
  id: string
  date: Date | null           // field returned by controller
  sessionDate: Date | null    // field returned by controller
  createdAt: Date
  theme: string | null
  duration: number | null
  status: AppointmentStatus   // use type from appointment.ts
  content: string | null
}
```

**Backend proof:** `src/infra/http/controllers/patients/get-patient-details.controller.ts`
lines 54-62.

---

## REQ-06 — `AppointmentStatus`: add missing `DONE` value

**File:** `src/types/appointment.ts`

**Problem:** Frontend `AppointmentStatus` has 6 values. Backend has 7 — `DONE` is missing.

**Required change:** Add `DONE: 'DONE'` to the const object.

**Full correct set:**
```ts
export const AppointmentStatus = {
  SCHEDULED: 'SCHEDULED',
  ATTENDING: 'ATTENDING',
  FINISHED: 'FINISHED',
  CANCELED: 'CANCELED',
  NOT_ATTEND: 'NOT_ATTEND',
  RESCHEDULED: 'RESCHEDULED',
  DONE: 'DONE',
} as const
```

**Backend proof:** `src/core/domain/main/enterprise/entities/appointment.ts` lines 5-13.

---

## REQ-07 — `AttachmentListItem.SizeInBytes`: fix casing to `sizeInBytes`

**File:** `src/types/attachment.ts`

**Problem:** `AttachmentListItem.SizeInBytes` (capital S) is documented as a backend bug.
The backend presenter (`AttachmentPresenter.toHTTP`) sends `sizeInBytes` (lowercase s),
matching `IattachmentHTTPDTO`.

**Required change:**
```ts
// Remove
SizeInBytes: number

// Add
sizeInBytes: number
```

Update every consumer that reads `SizeInBytes`.

**Backend proof:** `src/infra/http/DTO/attachments/attachment-http-dto.ts` line 6 — `sizeInBytes: number`.

---

## REQ-08 — `ApiErrorCode`: sync with `DOMAIN_ERROR_MAP`

**File:** `src/types/api.ts`

**Problem:** `ApiErrorCode` must cover every code the backend can emit. Codes come from two
sources:

**Domain errors (from `DomainExceptionFilter` `DOMAIN_ERROR_MAP`):**
```
RESOURCE_NOT_FOUND
NOT_ALLOWED
APPOINTMENT_CONFLICT
APPOINTMENT_DATE_IN_PAST
APPOINTMENT_NOT_IN_PROGRESS
APPOINTMENT_NOT_SCHEDULED
CRP_ALREADY_EXISTS
FILE_TOO_LARGE
INACTIVE_ACCOUNT
INACTIVE_PATIENT
INVALID_ATTACHMENT_TYPE
INVALID_START_TIME
OAUTH_ALREADY_LINKED
OAUTH_EMAIL_MISMATCH
OAUTH_MISSING_EMAIL
OAUTH_PROVIDER_CONFLICT
PATIENT_ALREADY_EXISTS
INTERNAL_SERVER_ERROR
```

**NestJS HTTP fallback codes** (emitted when a `HttpException` is thrown directly):
```
BAD_REQUEST
UNAUTHORIZED
FORBIDDEN
NOT_FOUND
CONFLICT
UNPROCESSABLE_ENTITY
TOO_MANY_REQUESTS
HTTP_ERROR
```

**Required change:** Replace the current union with the exhaustive list above.

**Backend proof:** `src/infra/http/filters/domain-exception.filter.ts` lines 30-48 and lines 70-78.

---

## REQ-09 — `FetchPatientsParams.status`: use `AccountStatus`

**File:** `src/types/patient.ts`

**Problem:** `FetchPatientsParams.status` is typed as `PatientStatus` but the backend schema
validates it against `AccountStatus` (`PENDING | ACTIVE | REJECTED | BLOCKED`).

**Required change:**
```ts
export interface FetchPatientsParams {
  // ...
  status?: 'PENDING' | 'ACTIVE' | 'REJECTED' | 'BLOCKED'  // or AccountStatus type
  gender?: 'OTHER' | 'FEMININE' | 'MASCULINE'               // uppercase, matches backend
  order?: 'asc' | 'desc'
  // sessionVolume stays as string — backend accepts it but leaves filtering unimplemented
}
```

**Backend proof:** `src/validators/patients/controllers/fetch-patients-schema.ts`.

---

## REQ-10 — `UpdatePatientBody`: remove `attachmentIds` or keep as optional

**File:** `src/types/patient.ts`

**Problem:** `attachmentIds` exists in `UpdatePatientBody` — this is correct. The backend
`putPatientByIdBodySchema` includes `attachmentIds: z.array(z.string()).optional()`.

**No change needed.** This is documented to confirm the field is intentional.

---

## REQ-11 — `PatientDetailsData`: align shape with actual endpoint response

**File:** `src/types/patient.ts`

**Problem:** The `GET /patients/:id/details` response shape is:
```ts
{
  patient: {
    id: string
    firstName: string
    lastName: string
    cpf: string | null
    email: string | null
    profileImageUrl: string | null
    phoneNumber: string | null
    dateOfBirth: Date | null
    gender: string
    sessions: SessionItem[]   // see REQ-05
  }
  meta: PatientDetailsMeta
}
```

`PatientDetailsData` must reflect this. Note: `name`, `isActive`, `lastSessionAt`, and
`createdAt` are NOT returned by this endpoint — only by the list endpoint.

**Backend proof:** `src/infra/http/controllers/patients/get-patient-details.controller.ts` lines 42-67.

---

## REQ-12 — `CreatePatientBody`: `gender` is optional with default

**File:** `src/types/patient.ts`

**Problem:** Backend schema marks `gender` as optional with default `Gender.OTHER`. Frontend
`CreatePatientBody` should reflect `gender?: Gender` (optional on send).

**Backend proof:** `src/validators/patients/controllers/create-patient-schema.ts` line 24 —
`z.nativeEnum(Gender).optional().default(Gender.OTHER)`.

---

## Non-issues (documented to avoid re-investigation)

| Item | Verdict |
|---|---|
| `RegistrationLinkInfo` / invite types | No backend change — keep as-is |
| `AvailabilityHTTP` | No change detected |
| `PlanInterval` | No backend change |
| `PopupHTTP.config: Record<string, unknown>` | Intentional — backend uses flexible config |
| `SuggestionHTTP.likes: string[]` / `attachments: string[]` | Matches backend |
| `PatientHTTP.cpf` nullable | Correct — backend CPF is optional on create |
