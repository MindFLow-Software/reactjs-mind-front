import { z } from "zod"

const permissionSlugSchema = z.string().regex(
    /^[a-z]+:[a-z]+$/,
    "Slug inválido — use o formato recurso:acao em letras minúsculas (ex: patients:create)",
)

export const createPermissionSchema = z.object({
    slug:        permissionSlugSchema,
    description: z.string().optional(),
})

export const assignPermissionToRoleSchema = z.object({
    roleName:       z.string().min(1, "Role é obrigatório"),
    permissionSlug: permissionSlugSchema,
})

export type CreatePermissionData        = z.infer<typeof createPermissionSchema>
export type AssignPermissionToRoleData  = z.infer<typeof assignPermissionToRoleSchema>
