import { z } from 'zod'
import { Gender } from '@/types/patient'

export const patientSignUpSchema = z.object({
  firstName: z.string().min(1, 'Nome é obrigatório'),
  lastName: z.string().min(1, 'Sobrenome é obrigatório'),
  email: z.email('E-mail inválido'),
  password: z
    .string()
    .min(8, 'A senha deve conter, no mínimo, 8 caracteres')
    .regex(/[a-z]/, 'A senha deve conter letras minúsculas')
    .regex(/[A-Z]/, 'A senha deve conter letras maiúsculas')
    .regex(/[0-9]/, 'A senha deve conter números')
    .regex(/[^A-Za-z0-9]/, 'A senha deve conter caracteres especiais'),
  phoneNumber: z.string().min(10, 'Telefone inválido'),
  cpf: z.string().min(11, 'CPF inválido'),
  dateOfBirth: z.coerce.date().optional(),
  gender: z.enum(Gender, {
    message: 'Selecione seu gênero',
  }),
})

export type PatientSignUpSchema = z.infer<typeof patientSignUpSchema>
