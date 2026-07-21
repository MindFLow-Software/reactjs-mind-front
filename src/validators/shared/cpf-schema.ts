import { z } from 'zod'
import { is } from '@/utils/isness'

export const cpfSchema = z
  .string()
  .min(11, { error: 'CPF deve conter 11 caracteres' })
  .refine((v) => !v || is.cpf(v), { error: 'CPF inválido' })
