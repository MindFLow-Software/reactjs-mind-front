import { Expertise, Honorific, Languages } from '@/types/shared/enums'
import { z } from 'zod'

export const updatePsychologistSchema = z.object({
  crp: z.string().optional(),
  expertise: z.enum(Expertise).optional(),
  honorific: z.enum(Honorific).optional(),
  languages: z.array(z.enum(Languages)).default([]).optional(),
  profileImage: z.instanceof(File).optional(),
  professionalBio: z.string().optional(),
  professionalName: z.string().optional(),
  profileImageUrl: z.string().nullable(),
})

export type UpdatePsychologistData = z.infer<typeof updatePsychologistSchema>
