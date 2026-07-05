import z from 'zod'

export const claimAccountSchema = z.object({
  email: z.email().min(1, 'Obrigatório'),
})

export type ClaimAccountData = z.infer<typeof claimAccountSchema>
