import { z } from 'zod'

import { SuggestionCategory } from '@/types/suggestion/suggestion-category'

export const createSuggestionSchema = z.object({
  title: z
    .string()
    .min(10, 'O título deve ser descritivo (mín. 10 caracteres)')
    .max(80, 'Título muito longo'),
  description: z
    .string()
    .min(200, 'Por favor, detalhe sua sugestão com pelo menos 200 caracteres'),
  category: z.enum(SuggestionCategory, {
    message: 'Selecione a categoria da sua sugestão',
  }),
})

export type CreateSuggestionSchema = z.infer<typeof createSuggestionSchema>
