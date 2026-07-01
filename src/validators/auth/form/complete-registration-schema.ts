import { z } from 'zod'

export const completeRegistrationSchema = z.object({
  crp: z.string().min(4, 'CRP é obrigatório'),
  expertise: z.enum(
    [
      'CLINICAL',
      'SOCIAL',
      'INFANT',
      'JURIDICAL',
      'EDUCATIONAL',
      'ORGANIZATIONAL',
      'PSYCHOTHERAPIST',
      'NEUROPSYCHOLOGY',
      'OTHER',
    ],
    { error: 'Selecione uma especialidade' },
  ),
  gender: z.enum(['MASCULINE', 'FEMININE', 'OTHER'], {
    error: 'Selecione um gênero',
  }),
})

export type CompleteRegistrationSchema = z.infer<
  typeof completeRegistrationSchema
>
