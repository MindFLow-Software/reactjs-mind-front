import { z } from 'zod'

export const appointmentStatusSchema = z.enum([
  'SCHEDULED',
  'ATTENDING',
  'FINISHED',
  'CANCELED',
  'NOT_ATTEND',
  'RESCHEDULED',
  'DONE',
])

export const createAppointmentSchema = z.object({
  patientId: z.string().uuid('ID do paciente inválido'),
  diagnosis: z.string().min(1, 'Diagnóstico é obrigatório'),
  content: z.string().optional(),
  scheduledAt: z.string().min(1, 'Data é obrigatória'),
  status: appointmentStatusSchema.default('SCHEDULED'),
})

export const fetchAppointmentsQuerySchema = z.object({
  pageIndex: z.coerce.number().int().min(0).default(0),
  perPage: z.coerce.number().int().min(1).default(10),
  orderBy: z.enum(['asc', 'desc']).default('asc'),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  patientName: z.string().optional(),
})

// Unlike fetchAppointmentsQuerySchema, this endpoint returns `meta` with pagination.
export const fetchAppointmentsByPsychologistQuerySchema = z.object({
  pageIndex: z.coerce.number().int().min(0).default(0),
  perPage: z.coerce.number().int().min(1).default(10),
  orderBy: z.enum(['asc', 'desc']).default('asc'),
})

export const getAvailableSlotsQuerySchema = z.object({
  psychologistId: z.string().uuid('ID do psicólogo inválido'),
  date: z.string().min(1, 'Data é obrigatória'),
})

// z.string().datetime() requires full ISO 8601 with timezone — e.g. "2026-06-01T14:00:00.000Z"
export const rescheduleAppointmentSchema = z.object({
  newDate: z.string().datetime({
    message: 'Data inválida — use ISO 8601 com timezone (ex: ...Z)',
  }),
})

export const updateAppointmentSchema = z.object({
  diagnosis: z.string().optional(),
  content: z.string().optional(),
  scheduledAt: z.string().optional(),
})

export type AppointmentStatus = z.infer<typeof appointmentStatusSchema>
export type CreateAppointmentData = z.infer<typeof createAppointmentSchema>
export type FetchAppointmentsQuery = z.infer<
  typeof fetchAppointmentsQuerySchema
>
export type FetchAppointmentsByPsychologistQuery = z.infer<
  typeof fetchAppointmentsByPsychologistQuerySchema
>
export type GetAvailableSlotsQuery = z.infer<
  typeof getAvailableSlotsQuerySchema
>
export type RescheduleAppointmentData = z.infer<
  typeof rescheduleAppointmentSchema
>
export type UpdateAppointmentData = z.infer<typeof updateAppointmentSchema>
