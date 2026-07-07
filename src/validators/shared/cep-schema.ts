import { z } from 'zod'

export const cepSchema = z
  .string()
  .refine((v) => /^\d{8}$/.test(v.replace(/\D/g, '')), {
    message: 'CEP inválido',
  })
