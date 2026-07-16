import { z } from 'zod'

import { Gender } from '@/types/shared/enums'
import { cpfSchema } from '@/validators/shared/cpf-schema'

export const updatePatientSchema = z.object({
  firstName: z.string().optional().describe('basicData'),
  lastName: z.string().optional().describe('basicData'),
  email: z.email('E-mail inválido').optional().describe('contact'),
  phoneNumber: z.string().optional().describe('contact'),
  dateOfBirth: z.date().nullable().optional().describe('basicData'),
  cpf: cpfSchema.describe('basicData'),
  gender: z.enum(Gender).optional().describe('basicData'),
  profileImageUrl: z.string().optional().describe('basicData'),
  attachmentIds: z.array(z.string()).optional(),
})

export type UpdatePatientFormData = z.infer<typeof updatePatientSchema>
