import { z } from 'zod'

const expertiseSchema = z.enum([
  'OTHER',
  'SOCIAL',
  'INFANT',
  'CLINICAL',
  'JURIDICAL',
  'EDUCATIONAL',
  'ORGANIZATIONAL',
  'PSYCHOTHERAPIST',
  'NEUROPSYCHOLOGY',
])

// gender, cpf, dateOfBirth are NOT updatable via this endpoint
export const updatePsychologistSchema = z.object({
  firstName: z.string().min(1, 'Nome é obrigatório'),
  lastName: z.string().min(1, 'Sobrenome é obrigatório'),
  email: z.email('E-mail inválido').optional(),
  phoneNumber: z.string().optional(),
  crp: z.string().optional(),
  expertise: expertiseSchema.optional(),
  profileImageUrl: z.string().optional(),
})

export type UpdatePsychologistData = z.infer<typeof updatePsychologistSchema>
