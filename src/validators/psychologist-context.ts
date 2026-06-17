import z from 'zod'

import { ContextType, SessionFormat } from '@/types/psychologist'

export const createPsychologistPracticeContextSchema = z.object({
  nickname: z.string().optional(),
  contextType: z.enum(ContextType, { message: 'Obrigatório' }),
  sessionFormat: z.enum(SessionFormat).default(SessionFormat.ONLINE),
  consultationFee: z.number().int().positive().optional(),
})

export type IcreatePsychologistPracticeContext = z.infer<
  typeof createPsychologistPracticeContextSchema
>
