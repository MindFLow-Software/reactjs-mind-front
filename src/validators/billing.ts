import { z } from 'zod'

export const createBillingSchema = z.object({
  patientEmail: z.string().email('E-mail inválido'),
  patientTaxId: z
    .string()
    .min(11, 'CPF/CNPJ inválido')
    .max(18, 'CPF/CNPJ inválido'),
  patientName: z.string().min(1, 'Nome é obrigatório'),
  amountInCents: z.number().int().min(100, 'Valor mínimo é R$ 1,00'),
  consultationDetails: z.string().min(1, 'Descrição é obrigatória'),
  frequency: z.enum(['ONE_TIME', 'MULTIPLE_PAYMENTS']),
  methods: z
    .array(z.enum(['PIX', 'CARD']))
    .min(1, 'Selecione ao menos um método de pagamento'),
  returnUrl: z.string().url('URL inválida'),
  completionUrl: z.string().url('URL inválida'),
})

export type CreateBillingData = z.infer<typeof createBillingSchema>
