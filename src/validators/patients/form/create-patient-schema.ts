import { z } from 'zod'
import { Gender } from '@/types/shared/enums'
import { cpfSchema } from '@/validators/shared/cpf-schema'
import { dateOfBirthSchema } from '@/validators/shared/date-of-birth-schema'

export const createPatientSchema = z.object({
  firstName: z
    .string()
    .min(1, 'Nome é obrigatório')
    .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/, 'Apenas letras são permitidas')
    .describe('basicData'),
  lastName: z
    .string()
    .min(1, 'Sobrenome é obrigatório')
    .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/, 'Apenas letras são permitidas')
    .describe('basicData'),
  phoneNumber: z.string().optional().describe('contact'),
  email: z.email('E-mail inválido').optional().describe('contact'),
  dateOfBirth: dateOfBirthSchema.nullable().optional().describe('basicData'),
  cpf: cpfSchema.optional().describe('basicData'),
  gender: z.enum(Gender).describe('basicData'),
  profileImageUrl: z.string().optional().describe('basicData'),
})

export type CreatePatientFormData = z.infer<typeof createPatientSchema>
