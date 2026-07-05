import z from 'zod'

import { ContextType, SessionFormat } from '@/types/psychologist'

export const createPsychologistPracticeContextSchema = z.object({
  nickname: z.string().optional(),
  contextType: z.enum(ContextType, 'Obrigatório'),
  sessionFormat: z.enum(SessionFormat).default(SessionFormat.ONLINE),
  consultationFee: z.coerce
    .number()
    .int()
    .positive('Deve ser maior que 0')
    .optional(),
  openFrom: z.string().optional().default('08:00'),
  closeAt: z.string().optional().default('18:00'),
})

export type CreatePsychologistPracticeContextData = z.infer<
  typeof createPsychologistPracticeContextSchema
>
