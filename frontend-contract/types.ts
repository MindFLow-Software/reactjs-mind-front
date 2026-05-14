/**
 * Frontend Contract — Types & Enums
 * Gerado de: nestjs-mind-back (feat/patient-qrcode-registration)
 * Atualizado: 2026-05-14
 *
 * Estes tipos correspondem EXATAMENTE ao que o backend envia/recebe via HTTP.
 * Não modifique sem atualizar o backend também.
 */

// ---------------------------------------------------------------------------
// Enums — valores wire exatos (strings como chegam no JSON)
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
  OTHER          = 'OTHER',
  SOCIAL         = 'SOCIAL',
  INFANT         = 'INFANT',
  CLINICAL       = 'CLINICAL',
  JURIDICAL      = 'JURIDICAL',
  EDUCATIONAL    = 'EDUCATIONAL',
  ORGANIZATIONAL = 'ORGANIZATIONAL',
  PSYCHOTHERAPIST= 'PSYCHOTHERAPIST',
  NEUROPSYCHOLOGY= 'NEUROPSYCHOLOGY',
}

export enum AppointmentStatus {
  SCHEDULED   = 'SCHEDULED',
  ATTENDING   = 'ATTENDING',   // sessão em andamento
  FINISHED    = 'FINISHED',
  CANCELED    = 'CANCELED',
  NOT_ATTEND  = 'NOT_ATTEND',  // paciente não compareceu
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
// Tipos de paginação — usados em todos os endpoints paginados
// ---------------------------------------------------------------------------

export interface PaginationMeta {
  pageIndex:  number  // zero-indexed: 0 = primeira página
  perPage:    number
  totalCount: number
}

// ---------------------------------------------------------------------------
// Patient — shape retornada por PatientPresenter.toHTTP()
// Usada em: GET /patients, GET /patients/:id, GET /patients/filter/with-attachments
// ---------------------------------------------------------------------------

export interface PatientHTTP {
  id:              string        // UUID como string
  firstName:       string
  lastName:        string
  name:            string        // computado: `${firstName} ${lastName}`
  email:           string | null
  cpf:             string | null // dígitos sem máscara
  phoneNumber:     string | null
  gender:          Gender
  dateOfBirth:     string | null // ISO 8601 — parse com new Date()
  profileImageUrl: string | null
  createdAt:       string        // ISO 8601
  lastSessionAt:   string | null // ISO 8601 — última sessão FINISHED
}

// ---------------------------------------------------------------------------
// Patient Details — shape de GET /patients/:id/details
// ---------------------------------------------------------------------------

export interface SessionItem {
  id:          string
  date:        string        // ISO 8601 (scheduledAt)
  sessionDate: string        // ISO 8601 (igual ao date)
  createdAt:   string        // ISO 8601
  theme:       string        // diagnosis ou 'Sem tema registrado'
  duration:    string        // ex: '50 min' | 'Menos de 1 min' | 'Aguardando sessão'
  status:      'Concluída' | 'Pendente'  // string PT-BR, NÃO é o enum AppointmentStatus
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
  perPage:         number        // sempre 5 (hardcoded no backend)
  totalCount:      number
  averageDuration: number | null // média em minutos
}

// ---------------------------------------------------------------------------
// Attachments
// ---------------------------------------------------------------------------

/**
 * Shape de GET /attachments/patient/:patientId
 * Controller: fetch-patient-attachments.controller.ts
 */
export interface AttachmentPatientItem {
  id:         string
  filename:   string
  url:        string        // storage key — use GET /attachments/:id para servir o arquivo
  type:       string        // MIME type: 'application/pdf' | 'image/jpeg' | 'image/png'
  size:       number        // bytes
  uploadedAt: string        // ISO 8601
}

/**
 * Shape de GET /attachments (listagem geral paginada)
 * Controller: fetch-all-attachments.controller.ts
 *
 * ⚠️ O campo SizeInBytes usa S maiúsculo — inconsistência no backend, não corrija no frontend.
 */
export interface AttachmentListItem {
  id:          string
  filename:    string
  fileUrl:     string        // storage key — use GET /attachments/:id para servir
  contentType: string        // MIME type
  SizeInBytes: number        // ⚠️ S maiúsculo (wire exato)
  uploadedAt:  string        // ISO 8601
  patient:     { firstName: string; lastName: string } | null
}

export interface AttachmentListMeta {
  pageIndex:        number   // zero-indexed
  totalCount:       number
  perPage:          number   // sempre 10
  totalStorageSize: number   // soma de bytes de todos os arquivos filtrados
}

/**
 * Response de POST /attachments (upload)
 */
export interface UploadAttachmentResponse {
  attachmentId: string  // UUID do attachment criado
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
  scheduledAt:    string            // ISO 8601
  durationInMin:  number | null
  status:         AppointmentStatus
  createdAt:      string            // ISO 8601
}

// ---------------------------------------------------------------------------
// Stats — shapes das respostas de estatísticas
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
  date:        string  // 'YYYY-MM-DD'
  newPatients: number
}

// ---------------------------------------------------------------------------
// Dashboard — shape de GET /dashboard
// ---------------------------------------------------------------------------

export interface DashboardResponse {
  totalPatients:        number
  patientsByGender:     GenderItem[]
  patientsByAge:        AgeRangeItem[]
  upcomingAppointments: AppointmentItem[]  // próximas 5, ordem asc
  newPatientsLast7Days: NewPatientsItem[]  // ⚠️ sempre [] (não implementado)
}

// ---------------------------------------------------------------------------
// Registration Link — shape de GET /invites/:hash
// ---------------------------------------------------------------------------

export interface RegistrationLinkInfo {
  psychologistId:   string  // UUID
  psychologistName: string  // firstName + lastName
  expiresAt:        string  // ISO 8601
}

// ---------------------------------------------------------------------------
// Scheduled Appointment — shape de GET /appointments/pending/:patientId
// ---------------------------------------------------------------------------

export interface ScheduledAppointmentResponse {
  appointmentId: string
  scheduledAt:   string            // ISO 8601
  patientId:     string
  status:        AppointmentStatus // sempre 'SCHEDULED' na prática
}

// ---------------------------------------------------------------------------
// Subscription Plan
// ---------------------------------------------------------------------------

export interface SubscriptionPlanHTTP {
  id:             string
  name:           string
  description:    string[]    // array de bullets
  priceInCents:   number
  interval:       PlanInterval
  createdAt:      string      // ISO 8601
  updatedAt:      string      // ISO 8601
}

// ---------------------------------------------------------------------------
// Suggestion
// ---------------------------------------------------------------------------

export interface SuggestionHTTP {
  id:              string
  psychologistId:  string
  psychologistName?: string | null
  title:           string
  description:     string
  category:        SuggestionCategory
  status:          SuggestionStatus
  likes:           string[]    // array de psychologistIds que curtiram
  attachments:     string[]    // array de URLs de anexos da sugestão
  createdAt:       string      // ISO 8601
  updatedAt:       string      // ISO 8601
}

// ---------------------------------------------------------------------------
// Popup
// ---------------------------------------------------------------------------

export interface PopupHTTP {
  id:            string
  internalName:  string
  title:         string | null
  body:          string | null       // pode conter HTML
  imageUrl:      string | null
  ctaText:       string | null
  ctaUrl:        string | null
  type:          PopupType
  status:        PopupStatus
  styleConfig:   Record<string, unknown> | null
  triggerConfig: Record<string, unknown> | null
  displayRules:  Record<string, unknown> | null
  startsAt:      string | null       // ISO 8601
  endsAt:        string | null       // ISO 8601
  psychologistId: string | null
}

// ---------------------------------------------------------------------------
// Availability (agenda do psicólogo)
// ---------------------------------------------------------------------------

export interface AvailabilityHTTP {
  id:             string
  psychologistId: string
  dayOfWeek:      number    // 0=Domingo, 1=Segunda, ..., 6=Sábado
  startTime:      string    // 'HH:mm'
  endTime:        string    // 'HH:mm'
  isActive:       boolean
}

// ---------------------------------------------------------------------------
// Query params — tipos para as chamadas paginadas/filtradas
// ---------------------------------------------------------------------------

export type FetchPatientsParams = {
  pageIndex?:     number                              // default: 0
  perPage?:       number                              // default: 10
  filter?:        string                              // busca por nome ou CPF
  status?:        'active' | 'inactive'               // omitir = sem filtro
  gender?:        Gender                              // omitir = sem filtro
  order?:         'asc' | 'desc'                      // omitir = desc
  sessionVolume?: 'high' | 'low'                      // omitir = sem ordenação
}

export type FetchAllAttachmentsParams = {
  page?:      number    // default: 0 (zero-indexed)
  filter?:    string    // busca em filename ou nome do paciente
  patientId?: string    // UUID — filtra por paciente
  from?:      string    // ISO date string — início do intervalo de uploadedAt
  to?:        string    // ISO date string — fim do intervalo
}

export type GetAmountPatientsParams = {
  startDate: string  // ISO date string ex: '2025-01-01'
  endDate:   string  // ISO date string ex: '2025-03-31'
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
