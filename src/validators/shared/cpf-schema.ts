import { z } from 'zod'
import { isValidCPF } from '@/utils/validate-cpf'

export const cpfSchema = z
  .string()
  .refine((v) => isValidCPF(v), { message: 'CPF inválido' })
