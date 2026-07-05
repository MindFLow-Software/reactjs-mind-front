import { z } from 'zod'
import { cpfSchema } from '@/validators/shared/cpf-schema'
import { Gender } from '@/types/enums'

const cpfField = z.preprocess(
  (v) => (v === '' ? undefined : v),
  cpfSchema.optional(),
)

export const updatePatientSchema = z.object({
  firstName: z.string().optional().describe('basicData'),
  lastName: z.string().optional().describe('basicData'),
  email: z
    .preprocess(
      (v) => (v === '' ? undefined : v),
      z.email('E-mail inválido').optional(),
    )
    .describe('contact'),
  phoneNumber: z.string().optional().describe('contact'),
  dateOfBirth: z.date().nullable().optional().describe('basicData'),
  cpf: cpfField.describe('basicData'),
  gender: z
    .enum(Gender)
    .optional()
    .describe('basicData'),
  profileImageUrl: z.string().optional().describe('basicData'),
  attachmentIds: z.array(z.string()).optional(),
})

export type UpdatePatientFormData = z.infer<typeof updatePatientSchema>
