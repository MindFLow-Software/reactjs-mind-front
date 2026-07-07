import { z } from 'zod'

export const permissionSlugSchema = z
  .string()
  .regex(
    /^[a-z]+:[a-z]+$/,
    'Slug inválido — use o formato recurso:acao em letras minúsculas (ex: patients:create)',
  )
