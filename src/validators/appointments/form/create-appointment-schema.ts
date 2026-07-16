import { z } from 'zod'
import { AppointmentStatus } from '@/types/appointment/appointment-status'

export const createAppointmentSchema = z.object({
  patientProfileId: z.string().uuid('ID do paciente inválido'),
  diagnosis: z.string().min(1, 'Diagnóstico é obrigatório'),
  content: z.string().optional(),
  scheduledAt: z.string().min(1, 'Data é obrigatória'),
  status: z.enum(AppointmentStatus),
})

export type CreateAppointmentData = z.infer<typeof createAppointmentSchema>
