import { z } from 'zod'
import { permissionSlugSchema } from '@/validators/shared/permission-slug-schema'

export const createPermissionSchema = z.object({
  slug: permissionSlugSchema,
  description: z.string().optional(),
})

export type CreatePermissionData = z.infer<typeof createPermissionSchema>
