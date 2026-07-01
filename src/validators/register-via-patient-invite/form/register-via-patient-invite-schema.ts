import z from 'zod'

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,30}$/

export const registerViaPatientInviteSchema = z.object({
  firstName: z.string().min(1, 'Obrigatório'),
  lastName: z.string().min(1, 'Obrigatório'),
  email: z.email({
    error: 'Email inválido',
  }),
  cpf: z.string().optional(),
  password: z
    .string()
    .min(8, 'Mínimo 8 caracteres')
    .max(30, 'Máximo 30 caracteres')
    .regex(
      passwordRegex,
      'Senha deve conter letra minúscula, maiúscula, número e especial (!@#$%^&*)',
    ),
})

export type RegisterViaPatientInviteData = z.infer<
  typeof registerViaPatientInviteSchema
>
