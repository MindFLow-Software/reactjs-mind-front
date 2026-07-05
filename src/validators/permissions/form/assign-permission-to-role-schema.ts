import { z } from 'zod'
import { permissionSlugSchema } from '@/validators/shared/permission-slug-schema'

export const assignPermissionToRoleSchema = z.object({
  roleName: z.string().min(1, 'Role é obrigatório'),
  permissionSlug: permissionSlugSchema,
})

export type AssignPermissionToRoleData = z.infer<
  typeof assignPermissionToRoleSchema
>
