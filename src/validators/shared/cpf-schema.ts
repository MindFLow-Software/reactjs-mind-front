import { z } from 'zod'
import { is } from '@/utils/isness'

export const cpfSchema = z
  .string()
  .refine((v) => is.cpf(v), { message: 'CPF inválido' })
