/**
 * Frontend Contract — Types & Enums
 * Fonte: nestjs-mind-back (feat/patient-qrcode-registration)
 * Atualizado: 2026-05-13
 *
 * Estes tipos correspondem EXATAMENTE ao que o backend envia/recebe via HTTP.
 * Não modifique sem atualizar o backend também.
 */

// ---------------------------------------------------------------------------
// Enums — valores wire exatos
// ---------------------------------------------------------------------------

export enum Gender {
  OTHER     = 'OTHER',
  FEMININE  = 'FEMININE',
  MASCULINE = 'MASCULINE',
}

export enum UserType {
  PATIENT      = 'PATIENT',
  PSYCHOLOGIST = 'PSYCHOLOGIST',
  ADMIN        = 'ADMIN',
  DEV          = 'DEV',
  CLINIC       = 'CLINIC',
}

export enum AccountStatus {
  PENDING  = 'PENDING',
  ACTIVE   = 'ACTIVE',
  REJECTED = 'REJECTED',
  BLOCKED  = 'BLOCKED',
}

export enum AppointmentStatus {
  SCHEDULED   = 'SCHEDULED',
  ATTENDING   = 'ATTENDING',
  FINISHED    = 'FINISHED',
  CANCELED    = 'CANCELED',
  NOT_ATTEND  = 'NOT_ATTEND',
  RESCHEDULED = 'RESCHEDULED',
}

// ---------------------------------------------------------------------------
// Paginação
// ---------------------------------------------------------------------------

export interface PaginationMeta {
  pageIndex:  number
  perPage:    number
  totalCount: number
}

// ---------------------------------------------------------------------------
// Patient — shape de PatientPresenter.toHTTP()
// Usada em: GET /patients, GET /patients/:id, GET /patients/filter/with-attachments
// ---------------------------------------------------------------------------

export interface PatientHTTP {
  id:              string
  firstName:       string
  lastName:        string
  name:            string
  email:           string | null
  cpf:             string | null
  phoneNumber:     string | null
  gender:          Gender
  dateOfBirth:     string | null
  profileImageUrl: string | null
  createdAt:       string
  lastSessionAt:   string | null
}

// ---------------------------------------------------------------------------
// Patient Details — GET /patients/:id/details
// ---------------------------------------------------------------------------

export interface SessionItem {
  id:          string
  date:        string
  sessionDate: string
  createdAt:   string
  theme:       string
  duration:    string
  status:      'Concluída' | 'Pendente'
  content:     string | null
}

export interface PatientDetailsData {
  id:              string
  firstName:       string
  lastName:        string
  cpf:             string | null
  email:           string | null
  profileImageUrl: string | null
  phoneNumber:     string | null
  dateOfBirth:     string | null
  gender:          Gender
  sessions:        SessionItem[]
}

export interface PatientDetailsMeta {
  pageIndex:       number
  perPage:         number
  totalCount:      number
  averageDuration: number | null
}

// ---------------------------------------------------------------------------
// Stats
// ---------------------------------------------------------------------------

export type AgeRange = '0-17' | '18-25' | '26-35' | '36-50' | '51+'

export interface AgeRangeItem {
  ageRange: AgeRange
  patients: number
}

export interface GenderItem {
  gender:   Gender
  patients: number
}

export interface NewPatientsItem {
  date:        string
  newPatients: number
}

// ---------------------------------------------------------------------------
// Dashboard — GET /dashboard
// ---------------------------------------------------------------------------

export interface AppointmentItem {
  id:             string
  patientId:      string | null
  psychologistId: string | null
  diagnosis:      string
  content:        string | null
  scheduledAt:    string
  durationInMin:  number | null
  status:         AppointmentStatus
  createdAt:      string
}

export interface DashboardResponse {
  totalPatients:        number
  patientsByGender:     GenderItem[]
  patientsByAge:        AgeRangeItem[]
  upcomingAppointments: AppointmentItem[]
  newPatientsLast7Days: NewPatientsItem[]
}

// ---------------------------------------------------------------------------
// Attachments — GET /attachments/patient/:patientId
// ---------------------------------------------------------------------------

export interface AttachmentItem {
  id:         string
  filename:   string
  url:        string
  type:       string
  size:       number
  uploadedAt: string
}

// ---------------------------------------------------------------------------
// Registration Link — GET /invites/:hash
// ---------------------------------------------------------------------------

export interface RegistrationLinkInfo {
  psychologistId:   string
  psychologistName: string
  expiresAt:        string
}

// ---------------------------------------------------------------------------
// Scheduled Appointment — GET /appointments/pending/:patientId
// ---------------------------------------------------------------------------

export interface ScheduledAppointmentResponse {
  appointmentId: string
  scheduledAt:   string
  patientId:     string
  status:        AppointmentStatus
}

// ---------------------------------------------------------------------------
// Query params — GET endpoints
// ---------------------------------------------------------------------------

export type FetchPatientsParams = {
  pageIndex?:     number
  perPage?:       number
  filter?:        string
  status?:        'active' | 'inactive'
  gender?:        Gender
  order?:         'asc' | 'desc'
  sessionVolume?: 'high' | 'low'
}

export type GetAmountPatientsParams = {
  startDate: string
  endDate:   string
}

export type GetDashboardParams = {
  startDate?: string
  endDate?:   string
}

// ---------------------------------------------------------------------------
// Mutation bodies — PUT/POST/DELETE/PATCH
// ---------------------------------------------------------------------------

// PUT /patients/:id — campos omitidos não são alterados
// ⚠️ Resposta retorna entidade de domínio — invalide cache e releia pelo GET
export interface UpdatePatientBody {
  firstName?:       string
  lastName?:        string
  phoneNumber?:     string
  dateOfBirth?:     string
  cpf?:             string
  gender?:          Gender
  profileImageUrl?: string
  attachmentIds?:   string[]
}

// POST /patient (singular) — criado pelo psicólogo autenticado
export interface CreatePatientBody {
  firstName:        string
  lastName:         string
  phoneNumber?:     string
  profileImageUrl?: string
  dateOfBirth?:     string
  cpf?:             string
  gender?:          Gender
}

export interface CreatePatientResponse {
  message:   string
  patientId: string
}

// POST /invites/:hash/register — cadastro público pelo paciente
// Senha: mín. 8 chars, maiúscula, minúscula, número, especial
export interface RegisterPatientViaInviteBody {
  firstName:    string
  lastName:     string
  email:        string
  password:     string
  gender:       Gender
  phoneNumber?: string
  dateOfBirth?: string
  cpf?:         string
}

export interface RegisterPatientViaInviteResponse {
  patientId:      string
  firstName:      string
  lastName:       string
  email:          string | null
  psychologistId: string
}
