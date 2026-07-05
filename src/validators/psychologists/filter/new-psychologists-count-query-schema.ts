import { z } from 'zod'

// from/to require full ISO 8601 with timezone — "2026-05-01T00:00:00.000Z"
// If both are omitted, backend defaults to the last 30 days
export const newPsychologistsCountQuerySchema = z.object({
  from: z.iso
    .datetime({
      message: 'Use ISO 8601 com timezone (ex: 2026-05-01T00:00:00.000Z)',
    })
    .optional(),
  to: z.iso
    .datetime({
      message: 'Use ISO 8601 com timezone (ex: 2026-05-31T23:59:59.999Z)',
    })
    .optional(),
})

export type NewPsychologistsCountQuery = z.infer<
  typeof newPsychologistsCountQuerySchema
>
