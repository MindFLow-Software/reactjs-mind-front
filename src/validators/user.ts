import z from 'zod'

import { Time } from '@/utils/time'
import { isValidCPF } from '@/utils/validate-cpf'

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,30}$/

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
  gender: z.enum(['OTHER', 'FEMININE', 'MASCULINE'], {
    message: 'Obrigatório',
  }),
  dateOfBirth: z
    .date()
    .refine((date) => !Time.isFuture(new Date(date)), {
      message: 'Data não pode ser no futuro.',
    })
    .optional(),
  cpf: z
    .string()
    .min(11, 'CPF incompleto')
    .refine(isValidCPF, 'CPF inválido')
    .optional(),
  phoneNumber: z.string().optional(),
})
