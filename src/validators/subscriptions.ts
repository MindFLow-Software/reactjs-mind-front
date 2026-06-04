import { z } from "zod"

// priceInCents: backend has no int() or min() — frontend enforces positive integer
export const createSubscriptionPlanSchema = z.object({
    name:         z.string(),
    description:  z.array(z.string()),
    priceInCents: z.number().int().positive("Valor deve ser positivo"),
    interval:     z.enum(["MONTHLY", "YEARLY"]),
})

export type CreateSubscriptionPlanData = z.infer<typeof createSubscriptionPlanSchema>
