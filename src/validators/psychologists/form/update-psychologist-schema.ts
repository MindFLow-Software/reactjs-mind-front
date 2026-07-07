import { Expertise, Honorific, Languages } from '@/types/enums'
import { z } from 'zod'

export const updatePsychologistSchema = z.object({
  crp: z.string().optional(),
  expertise: z.enum(Expertise).optional(),
  honorific: z.enum(Honorific).optional(),
  languages: z.array(z.enum(Languages)).default([]).optional(),
  // profileImageUrl: z.string().optional(),
  professionalBio: z.string().optional(),
  professionalName: z.string().optional(),
})

export type UpdatePsychologistData = z.infer<typeof updatePsychologistSchema>
