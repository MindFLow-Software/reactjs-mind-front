import { z } from 'zod'
import { isBefore } from 'date-fns'

export const dateOfBirthSchema = z
  .date()
  .refine((d) => isBefore(d, new Date()), {
    message: 'Data de nascimento inválida',
  })
