import { z } from 'zod'
import { is } from '@/utils/isness'

const today = new Date()
const minDate = new Date(
  today.getFullYear() - 120,
  today.getMonth(),
  today.getDate(),
)
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,30}$/

export const signUpSchema = z.object({
  firstName: z.string().min(1, 'Obrigatório'),
  lastName: z.string().min(1, 'Obrigatório'),
  phoneNumber: z.string().min(1, 'Obrigatório').max(15),
  email: z.email('Email inválido').min(1, 'Obrigatório'),
  password: z
    .string()
    .min(8, 'Mínimo 8 caracteres')
    .max(30, 'Máximo 30 caracteres')
    .regex(passwordRegex, 'Senha muito fraca'),
  dateOfBirth: z
    .date({ message: 'Obrigatório' })
    .refine((d) => d >= minDate, { message: 'Data inválida.' })
    .refine((d) => d <= today, { message: 'Data não pode ser no futuro.' }),
  cpf: z
    .string()
    .min(11, 'CPF incompleto')
    .refine((v) => is.cpf(v), 'CPF inválido'),
  gender: z.enum(['MASCULINE', 'FEMININE', 'OTHER'], {
    message: 'Obrigatório',
  }),
})

export type SignUpFormData = z.infer<typeof signUpSchema>
