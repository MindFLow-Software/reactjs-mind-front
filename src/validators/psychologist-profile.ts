import z from 'zod'
import { Expertise } from '@/types/expertise'
import { ContextType, Honorific, Languages } from '@/types/psychologist'

export const createPsychologistProfileSchema = z.object({
  professionalName: z.string().min(1, 'Obrigatório'),
  crp: z
    .string()
    .min(1, 'Obrigatório')
    .max(9, 'O CRP deve conter, no máximo, 9 caracteres'),
  expertise: z.enum(Expertise).default(Expertise.CLINICAL),
  professionalBio: z.string().optional(),
  contextType: z.enum(ContextType).default(ContextType.INDIVIDUAL),
  clinicId: z.uuid().optional(),
  nickname: z.string().optional(),
  languages: z.array(z.enum(Languages)).default([]),
  honorific: z.enum(Honorific).default(Honorific.MASC_DR).optional(),
})
