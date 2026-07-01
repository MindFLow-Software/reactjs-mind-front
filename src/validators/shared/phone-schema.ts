import { z } from 'zod'

export const phoneSchema = z.string().refine(
  (v) => {
    const digits = v.replace(/\D/g, '')
    return digits.length === 10 || digits.length === 11
  },
  { message: 'Telefone inválido' },
)
