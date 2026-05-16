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
})

export type PatientFormData = z.infer<typeof patientSchema>
