import { z } from "zod"
import { isValidCPF } from "@/utils/validate-cpf"

const today          = new Date()
const minBirthDate   = new Date(today.getFullYear() - 120, today.getMonth(), today.getDate())
const maxBirthDate   = new Date(today.getFullYear() - 18,  today.getMonth(), today.getDate())

// Only [!@#$%^&*] — backend rejects other special chars with 400
const psychologistPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,30}$/

const expertiseSchema = z.enum([
    "OTHER",
    "SOCIAL",
    "INFANT",
    "CLINICAL",
    "JURIDICAL",
    "EDUCATIONAL",
    "ORGANIZATIONAL",
    "PSYCHOTHERAPIST",
    "NEUROPSYCHOLOGY",
])

// HH:mm — accepts single-digit hour e.g. "9:00" and "09:00"
const timeSchema = z.string().regex(
    /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
    "Formato de hora inválido — use HH:mm (ex: 09:00)",
)

export const createPsychologistSchema = z.object({
    firstName:       z.string().min(1, "Obrigatório"),
    lastName:        z.string().min(1, "Obrigatório"),
    email:           z.string().email("E-mail inválido"),
    password:        z.string()
        .min(8,  "Mínimo 8 caracteres")
        .max(30, "Máximo 30 caracteres")
        .regex(psychologistPasswordRegex, "Senha deve conter letra minúscula, maiúscula, número e especial (!@#$%^&*)"),
    phoneNumber:     z.string().min(1, "Obrigatório"),
    dateOfBirth:     z.date({ message: "Obrigatório" })
        .refine((d) => d >= minBirthDate, { message: "Data inválida." })
        .refine((d) => d <= maxBirthDate, { message: "Necessário ter 18+ anos." }),
    cpf:             z.string().min(11, "CPF incompleto").refine(isValidCPF, "CPF inválido"),
    gender:          z.enum(["OTHER", "FEMININE", "MASCULINE"], { message: "Obrigatório" }),
    crp:             z.string().optional(),
    profileImageUrl: z.string().optional(),
})

// gender, cpf, dateOfBirth are NOT updatable via this endpoint
export const updatePsychologistSchema = z.object({
    firstName:       z.string().optional(),
    lastName:        z.string().optional(),
    email:           z.preprocess((v) => (v === "" ? undefined : v), z.string().email("E-mail inválido").optional()),
    phoneNumber:     z.string().optional(),
    crp:             z.string().optional(),
    expertise:       expertiseSchema.optional(),
    profileImageUrl: z.string().optional(),
})

export const fetchPsychologistsQuerySchema = z.object({
    pageIndex: z.coerce.number().int().min(0).default(0),
    perPage:   z.coerce.number().int().min(1).default(10),
})

// POST /availabilities replaces the entire schedule — send the full desired list
export const setAvailabilitySchema = z.object({
    slots: z.array(
        z.object({
            dayOfWeek: z.number().int().min(0).max(6),
            startTime: timeSchema,
            endTime:   timeSchema,
        }),
    ).min(1, "Defina ao menos um horário"),
})

// from/to require full ISO 8601 with timezone — "2026-05-01T00:00:00.000Z"
// If both are omitted, backend defaults to the last 30 days
export const newPsychologistsCountQuerySchema = z.object({
    from: z.string().datetime({ message: "Use ISO 8601 com timezone (ex: 2026-05-01T00:00:00.000Z)" }).optional(),
    to:   z.string().datetime({ message: "Use ISO 8601 com timezone (ex: 2026-05-31T23:59:59.999Z)" }).optional(),
})

export type CreatePsychologistData        = z.infer<typeof createPsychologistSchema>
export type UpdatePsychologistData        = z.infer<typeof updatePsychologistSchema>
export type FetchPsychologistsQuery       = z.infer<typeof fetchPsychologistsQuerySchema>
export type SetAvailabilityData           = z.infer<typeof setAvailabilitySchema>
export type NewPsychologistsCountQuery    = z.infer<typeof newPsychologistsCountQuerySchema>
