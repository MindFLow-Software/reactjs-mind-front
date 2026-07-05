import { z } from 'zod'

export const suggestionsListFilterSchema = z.object({
  search: z.string().optional(),
  category: z
    .enum([
      'UI_UX',
      'SCHEDULING',
      'REPORTS',
      'PRIVACY_LGPD',
      'INTEGRATIONS',
      'OTHERS',
    ])
    .optional(),
  status: z
    .union([
      z.enum([
        'PENDING',
        'OPEN',
        'UNDER_REVIEW',
        'PLANNED',
        'IMPLEMENTED',
        'REJECTED',
      ]),
      z.array(
        z.enum([
          'PENDING',
          'OPEN',
          'UNDER_REVIEW',
          'PLANNED',
          'IMPLEMENTED',
          'REJECTED',
        ]),
      ),
    ])
    .optional(),
  sortBy: z.string().optional(),
})

export type SuggestionsListFilterQuery = z.infer<
  typeof suggestionsListFilterSchema
>
