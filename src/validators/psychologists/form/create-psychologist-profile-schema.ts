import z from 'zod'
import { Honorific } from '@/types/enums'
import { Expertise, Languages } from '@/types/shared/enums'

export const createPsychologistProfileSchema = z.object({
  professionalName: z.string().min(1, 'Obrigatório'),
  crp: z
    .string()
    .min(1, 'Obrigatório')
    .max(9, 'O CRP deve conter, no máximo, 9 caracteres'),
  expertise: z.enum(Expertise).default(Expertise.CLINICAL),
  professionalBio: z.string().optional(),
  languages: z.array(z.enum(Languages)).default([]),
  honorific: z.enum(Honorific).default(Honorific.MASC_DR),
})

export type CreatePsychologistProfileData = z.infer<
  typeof createPsychologistProfileSchema
>
