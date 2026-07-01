import { z } from 'zod'
import { cpfSchema } from '@/validators/shared/cpf-schema'

const cpfField = z.preprocess(
  (v) => (v === '' ? undefined : v),
  cpfSchema.optional(),
)

export const updatePatientSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.preprocess(
    (v) => (v === '' ? undefined : v),
    z.email('E-mail inválido').optional(),
  ),
  phoneNumber: z.string().optional(),
  dateOfBirth: z.date().nullable().optional(),
  cpf: cpfField,
  gender: z.enum(['FEMININE', 'MASCULINE', 'OTHER']).optional(),
  profileImageUrl: z.string().optional(),
  attachmentIds: z.array(z.string()).optional(),
})

export type UpdatePatientFormData = z.infer<typeof updatePatientSchema>
