import { Gender } from '@/types/shared/enums'
import z from 'zod'

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*_])[A-Za-z\d!@#$%^&*_]{8,30}$/

export const registerPatientViaRegistrationLinkSchema = z.object({
  firstName: z.string().min(1, 'Obrigatório'),
  lastName: z.string().min(1, 'Obrigatório'),
  email: z.email({
    error: 'Email inválido',
  }),
  cpf: z.string().optional(),
  password: z
    .string()
    .min(8, 'Mínimo 8 caracteres')
    .max(30, 'Máximo 30 caracteres')
    .regex(
      passwordRegex,
      'Senha deve conter letra minúscula, maiúscula, número e especial (!@#$%^&*)',
    ),
  gender: z.enum(Gender),
  phoneNumber: z.string().optional(),
  dateOfBirth: z.coerce.date().optional(),
})

export type IRegisterPatientViaRegistrationLinkData = z.infer<
  typeof registerPatientViaRegistrationLinkSchema
>
