/**
 * Frontend Contract — Types & Enums
 * Fonte: nestjs-mind-back (feat/patient-qrcode-registration)
 * Atualizado: 2026-05-14
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

export enum Expertise {
  OTHER           = 'OTHER',
  SOCIAL          = 'SOCIAL',
  INFANT          = 'INFANT',
  CLINICAL        = 'CLINICAL',
  JURIDICAL       = 'JURIDICAL',
  EDUCATIONAL     = 'EDUCATIONAL',
  ORGANIZATIONAL  = 'ORGANIZATIONAL',
  PSYCHOTHERAPIST = 'PSYCHOTHERAPIST',
  NEUROPSYCHOLOGY = 'NEUROPSYCHOLOGY',
}

export enum AppointmentStatus {
  SCHEDULED   = 'SCHEDULED',
  ATTENDING   = 'ATTENDING',
  FINISHED    = 'FINISHED',
  CANCELED    = 'CANCELED',
  NOT_ATTEND  = 'NOT_ATTEND',
  RESCHEDULED = 'RESCHEDULED',
  DONE        = 'DONE',
}

export enum PlanInterval {
  MONTHLY = 'MONTHLY',
  YEARLY  = 'YEARLY',
}

export enum SuggestionCategory {
  UI_UX        = 'UI_UX',
  SCHEDULING   = 'SCHEDULING',
  REPORTS      = 'REPORTS',
  PRIVACY_LGPD = 'PRIVACY_LGPD',
  INTEGRATIONS = 'INTEGRATIONS',
  OTHERS       = 'OTHERS',
}

export enum SuggestionStatus {
  PENDING      = 'PENDING',
  OPEN         = 'OPEN',
  UNDER_REVIEW = 'UNDER_REVIEW',
  PLANNED      = 'PLANNED',
  IMPLEMENTED  = 'IMPLEMENTED',
  REJECTED     = 'REJECTED',
}

export enum PopupType {
  MODAL    = 'MODAL',
  SLIDE_IN = 'SLIDE_IN',
  BAR      = 'BAR',
  TOAST    = 'TOAST',
}

export enum PopupStatus {
  DRAFT    = 'DRAFT',
  ACTIVE   = 'ACTIVE',
  PAUSED   = 'PAUSED',
  ARCHIVED = 'ARCHIVED',
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
// Patient — PatientPresenter.toHTTP()
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
// Attachments
// ---------------------------------------------------------------------------

// GET /attachments/patient/:patientId
export interface AttachmentPatientItem {
  id:         string
  filename:   string
  url:        string  // storage key — acesse via GET /attachments/:id
  type:       string  // MIME type
  size:       number  // bytes
  uploadedAt: string  // ISO 8601
}

// GET /attachments (paginado)
// ⚠️ SizeInBytes com S maiúsculo — bug de nomenclatura no backend
export interface AttachmentListItem {
  id:          string
  filename:    string
  fileUrl:     string        // storage key — acesse via GET /attachments/:id
  contentType: string        // MIME type
  SizeInBytes: number        // ⚠️ S maiúsculo (wire exato)
  uploadedAt:  string        // ISO 8601
  patient:     { firstName: string; lastName: string } | null
}

export interface AttachmentListMeta {
  pageIndex:        number
  totalCount:       number
  perPage:          number  // fixo: 10
  totalStorageSize: number
}

// POST /attachments
export interface UploadAttachmentResponse {
  attachmentId: string
  url:          string  // storage key (igual ao attachmentId)
}

// ---------------------------------------------------------------------------
// Appointments
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

export interface DashboardResponse {
  totalPatients:        number
  patientsByGender:     GenderItem[]
  patientsByAge:        AgeRangeItem[]
  upcomingAppointments: AppointmentItem[]
  newPatientsLast7Days: NewPatientsItem[]
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
// Subscription Plan
// ---------------------------------------------------------------------------

export interface SubscriptionPlanHTTP {
  id:           string
  name:         string
  description:  string[]
  priceInCents: number
  interval:     PlanInterval
  createdAt:    string
  updatedAt:    string
}

// ---------------------------------------------------------------------------
// Suggestion
// ---------------------------------------------------------------------------

export interface SuggestionHTTP {
  id:               string
  psychologistId:   string
  psychologistName: string | null
  title:            string
  description:      string
  category:         SuggestionCategory
  status:           SuggestionStatus
  likes:            string[]
  attachments:      string[]
  createdAt:        string
  updatedAt:        string
}

// ---------------------------------------------------------------------------
// Popup
// ---------------------------------------------------------------------------

export interface PopupHTTP {
  id:             string
  internalName:   string
  title:          string | null
  body:           string | null
  imageUrl:       string | null
  ctaText:        string | null
  ctaUrl:         string | null
  type:           PopupType
  status:         PopupStatus
  styleConfig:    Record<string, unknown> | null
  triggerConfig:  Record<string, unknown> | null
  displayRules:   Record<string, unknown> | null
  startsAt:       string | null
  endsAt:         string | null
  psychologistId: string | null
}

// ---------------------------------------------------------------------------
// Availability
// ---------------------------------------------------------------------------

export interface AvailabilityHTTP {
  id:             string
  psychologistId: string
  dayOfWeek:      number  // 0=Dom, 1=Seg, ..., 6=Sáb
  startTime:      string  // 'HH:mm'
  endTime:        string  // 'HH:mm'
  isActive:       boolean
}

// ---------------------------------------------------------------------------
// Query params
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

export type FetchAllAttachmentsParams = {
  page?:      number
  filter?:    string
  patientId?: string
  from?:      string
  to?:        string
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
// Mutation bodies
// ---------------------------------------------------------------------------

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

export interface CreatePatientBody {
  firstName:        string
  lastName:         string
  phoneNumber?:     string
  profileImageUrl?: string
  dateOfBirth?:     string
  cpf?:             string
  gender?:          Gender
}

// POST /invites/:hash/register — senha: mín. 8 chars, maiúscula, minúscula, número, especial
export interface RegisterPatientBody {
  firstName:    string
  lastName:     string
  email:        string
  password:     string
  gender:       Gender
  phoneNumber?: string
  dateOfBirth?: string
  cpf?:         string
}
