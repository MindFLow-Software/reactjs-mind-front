import { z } from 'zod'

const saveAnamnesisSectionSchema = z.object({
  id: z.uuid().nullable().optional(),
  title: z.string().trim().min(1),
  content: z.string(),
  order: z.int().min(0),
})

export const saveAnamnesisSchema = z.object({
  isDraft: z.boolean().optional().default(false),
  sections: z.array(saveAnamnesisSectionSchema),
})
