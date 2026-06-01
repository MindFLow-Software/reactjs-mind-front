import { z } from "zod"
import { isValidCPF } from "@/utils/validate-cpf"

export const patientSchema = z.object({
    firstName:   z.string().min(1, "Nome é obrigatório").regex(/^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/, "Apenas letras são permitidas"),
    lastName:    z.string().min(1, "Sobrenome é obrigatório").regex(/^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/, "Apenas letras são permitidas"),
    phoneNumber: z.string().optional(),
    email:       z.string().email("E-mail inválido").optional().or(z.literal("")),
    dateOfBirth: z.date().nullable().optional().refine((d) => !d || d <= new Date(), { message: "Data de nascimento inválida" }),
    cpf:         z.string().optional().or(z.literal("")).refine((v) => !v || isValidCPF(v), { message: "CPF inválido" }),
    gender:      z.enum(["FEMININE", "MASCULINE", "OTHER"]),
    cep:         z.string().optional().or(z.literal("")),
    logradouro:  z.string().optional().or(z.literal("")),
    bairro:      z.string().optional().or(z.literal("")),
    cidade:      z.string().optional().or(z.literal("")),
    uf:          z.string().max(2).optional().or(z.literal("")),
    modality:    z.enum(["ONLINE", "PRESENCIAL", "HIBRIDO"]).optional(),
    frequency:   z.string().optional(),
    price:       z.string().optional(),
    source:      z.string().optional(),
    notes:       z.string().optional(),
})

export type PatientFormData = z.infer<typeof patientSchema>
