import { z } from 'zod'
import { isValidCPF } from '@/utils/validate-cpf'
import { Gender } from '@/types/patient'

const today = new Date()
const minDate = new Date(
  today.getFullYear() - 120,
  today.getMonth(),
  today.getDate(),
)
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,30}$/

export const signInSchema = z.object({
  email: z.email({ message: 'E-mail inválido' }),
  password: z.string().min(1, { message: 'A senha é obrigatória' }),
})

export const signUpFormSchema = z.object({
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
  cpf: z.string().min(11, 'CPF incompleto').refine(isValidCPF, 'CPF inválido'),
  gender: z.enum(['MASCULINE', 'FEMININE', 'OTHER'], {
    message: 'Obrigatório',
  }),
})

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

export type SignInSchema = z.infer<typeof signInSchema>
export type SignUpFormData = z.infer<typeof signUpFormSchema>
export type PatientSignUpSchema = z.infer<typeof patientSignUpSchema>
