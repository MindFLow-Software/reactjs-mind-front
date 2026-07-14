import z from 'zod'

import { Gender } from '@/types/shared/enums'
import { cpfSchema } from '@/validators/shared/cpf-schema'
import { dateOfBirthSchema } from '@/validators/shared/date-of-birth-schema'

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*_])[A-Za-z\d!@#$%^&*_]{8,30}$/

export const createUserSchema = z.object({
  firstName: z.string().min(1, 'Obrigatório'),
  lastName: z.string().min(1, 'Obrigatório'),
  email: z.email('E-mail inválido'),
  password: z
    .string()
    .min(8, 'Mínimo 8 caracteres')
    .max(30, 'Máximo 30 caracteres')
    .regex(
      passwordRegex,
      'Senha deve conter letra minúscula, maiúscula, número e especial (!@#$%^&*)',
    ),
  gender: z.enum(Gender, {
    message: 'Obrigatório',
  }),
  dateOfBirth: dateOfBirthSchema.optional(),
  cpf: cpfSchema.optional(),
  phoneNumber: z.string().optional(),
})

export type CreateUserData = z.infer<typeof createUserSchema>
