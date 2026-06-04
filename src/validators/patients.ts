import { z } from 'zod'
import { isValidCPF } from '@/utils/validate-cpf'

const cpfField = z.preprocess(
    (v) => (v === "" ? undefined : v),
    z.string().optional().refine((v) => !v || isValidCPF(v), { message: "CPF inválido" }),
)

export const patientSchema = z.object({
  firstName: z
    .string()
    .min(1, 'Nome é obrigatório')
    .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/, 'Apenas letras são permitidas'),
  lastName: z
    .string()
    .min(1, 'Sobrenome é obrigatório')
    .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/, 'Apenas letras são permitidas'),
  phoneNumber: z.string().optional(),
  email: z.email('E-mail inválido').optional().or(z.literal('')),
  dateOfBirth: z
    .date()
    .nullable()
    .optional()
    .refine((d) => !d || d <= new Date(), {
      message: 'Data de nascimento inválida',
    }),
  cpf: z
    .string()
    .optional()
    .or(z.literal(''))
    .refine((v) => !v || isValidCPF(v), { message: 'CPF inválido' }),
  gender: z.enum(['FEMININE', 'MASCULINE', 'OTHER']),
  zipCode: z.string().optional().or(z.literal('')),
  street: z.string().optional().or(z.literal('')),
  number: z.string().optional().or(z.literal('')),
  neighborhood: z.string().optional().or(z.literal('')),
  complement: z.string().optional().or(z.literal('')),
  city: z.string().optional().or(z.literal('')),
  state: z.string().max(2).optional().or(z.literal('')),
  modality: z.enum(['ONLINE', 'PRESENCIAL', 'HIBRIDO']).optional(),
  frequency: z.string().optional(),
  price: z.string().optional(),
  source: z.string().optional(),
  notes: z.string().optional(),
})

export const updatePatientSchema = z.object({
    firstName:       z.string().optional(),
    lastName:        z.string().optional(),
    email:           z.preprocess((v) => (v === "" ? undefined : v), z.string().email("E-mail inválido").optional()),
    phoneNumber:     z.string().optional(),
    dateOfBirth:     z.date().nullable().optional(),
    cpf:             cpfField,
    gender:          z.enum(["FEMININE", "MASCULINE", "OTHER"]).optional(),
    profileImageUrl: z.string().optional(),
    attachmentIds:   z.array(z.string()).optional(),
})

export const fetchPatientsQuerySchema = z.object({
    pageIndex:     z.coerce.number().int().min(0).default(0),
    perPage:       z.coerce.number().int().min(1).default(10),
    filter:        z.string().optional(),
    status:        z.enum(["PENDING", "ACTIVE", "REJECTED", "BLOCKED"]).optional(),
    gender:        z.enum(["FEMININE", "MASCULINE", "OTHER"]).optional(),
    order:         z.enum(["asc", "desc"]).optional(),
    sessionVolume: z.string().optional(),
})

export const getPatientDetailsQuerySchema = z.object({
    pageIndex: z.coerce.number().int().min(0).default(0),
    perPage:   z.coerce.number().int().min(1).default(10),
})

// Both dates are required — omitting either causes 400 from the backend
export const newPatientsStatsQuerySchema = z.object({
    startDate: z.string().min(1, "Data inicial obrigatória"),
    endDate:   z.string().min(1, "Data final obrigatória"),
})

// POST /invites/:hash/register — backend does NOT validate CPF on this route
export const registerPatientViaInviteSchema = z.object({
    firstName:   z.string().min(1, "Nome é obrigatório"),
    lastName:    z.string().min(1, "Sobrenome é obrigatório"),
    email:       z.string().email("E-mail inválido"),
    password:    z.string()
        .min(8, "A senha deve conter, no mínimo, 8 caracteres")
        .regex(/[a-z]/, "A senha deve conter letras minúsculas")
        .regex(/[A-Z]/, "A senha deve conter letras maiúsculas")
        .regex(/[0-9]/, "A senha deve conter números")
        .regex(/[^A-Za-z0-9]/, "A senha deve conter caracteres especiais"),
    gender:      z.enum(["FEMININE", "MASCULINE", "OTHER"], { message: "Selecione seu gênero" }),
    phoneNumber: z.string().optional(),
    dateOfBirth: z.coerce.date().optional(),
    cpf:         z.string().optional(),
})

export type PatientFormData               = z.infer<typeof patientSchema>
export type UpdatePatientFormData         = z.infer<typeof updatePatientSchema>
export type FetchPatientsQuery            = z.infer<typeof fetchPatientsQuerySchema>
export type GetPatientDetailsQuery        = z.infer<typeof getPatientDetailsQuerySchema>
export type NewPatientsStatsQuery         = z.infer<typeof newPatientsStatsQuerySchema>
export type RegisterPatientViaInviteData  = z.infer<typeof registerPatientViaInviteSchema>
