import { z } from 'zod'

export const editSuggestionSchema = z.object({
  title: z
    .string()
    .min(10, 'O título deve ser descritivo (mín. 10 caracteres)')
    .max(80, 'Título muito longo'),
  category: z.enum(
    [
      'UI_UX',
      'SCHEDULING',
      'REPORTS',
      'PRIVACY_LGPD',
      'INTEGRATIONS',
      'OTHERS',
    ],
    {
      message: 'Selecione a categoria da sua sugestão',
    },
  ),
  description: z
    .string()
    .min(200, 'Por favor, detalhe sua sugestão com pelo menos 200 caracteres'),
})

export type EditSuggestionSchema = z.infer<typeof editSuggestionSchema>
