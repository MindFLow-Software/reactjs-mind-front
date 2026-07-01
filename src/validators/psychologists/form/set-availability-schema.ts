import { z } from 'zod'

// HH:mm — accepts single-digit hour e.g. "9:00" and "09:00"
const timeSchema = z
  .string()
  .regex(
    /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
    'Formato de hora inválido — use HH:mm (ex: 09:00)',
  )

// POST /availabilities replaces the entire schedule — send the full desired list
export const setAvailabilitySchema = z.object({
  slots: z
    .array(
      z.object({
        dayOfWeek: z.number().int().min(0).max(6),
        startTime: timeSchema,
        endTime: timeSchema,
      }),
    )
    .min(1, 'Defina ao menos um horário'),
})

export type SetAvailabilityData = z.infer<typeof setAvailabilitySchema>
