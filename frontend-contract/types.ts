/**
 * Frontend Contract — Types & Enums
 * Gerado de: nestjs-mind-back (feat/patient-qrcode-registration)
 * Atualizado: 2026-05-13
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

export enum AppointmentStatus {
  SCHEDULED   = 'SCHEDULED',
  ATTENDING   = 'ATTENDING',   // sessão em andamento
  FINISHED    = 'FINISHED',
  CANCELED    = 'CANCELED',
  NOT_ATTEND  = 'NOT_ATTEND',  // paciente não compareceu
  RESCHEDULED = 'RESCHEDULED',
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

export interface DashboardResponse {
  totalPatients:        number
  patientsByGender:     GenderItem[]
  patientsByAge:        AgeRangeItem[]
  upcomingAppointments: AppointmentItem[]  // próximas 5, ordem asc
  newPatientsLast7Days: NewPatientsItem[]  // ⚠️ sempre [] (não implementado)
}

// ---------------------------------------------------------------------------
// Attachments — shape de GET /attachments/patient/:patientId
// ---------------------------------------------------------------------------

export interface AttachmentItem {
  id:         string
  filename:   string
  url:        string        // URL do arquivo (S3 ou equivalente)
  type:       string        // MIME type ex: 'application/pdf', 'image/png'
  size:       number        // bytes
  uploadedAt: string        // ISO 8601
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

export type GetAmountPatientsParams = {
  startDate: string  // ISO date string ex: '2025-01-01'
  endDate:   string  // ISO date string ex: '2025-03-31'
}

export type GetDashboardParams = {
  startDate?: string
  endDate?:   string
}
