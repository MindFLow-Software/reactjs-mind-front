import { z } from "zod"
import { isValidCPF } from "@/utils/validate-cpf"

const today = new Date()
const minDate = new Date(today.getFullYear() - 120, today.getMonth(), today.getDate())
const maxDateForPro = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate())
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,30}$/

export const signInSchema = z.object({
    email:    z.string().email({ message: "E-mail inválido" }),
    password: z.string().min(1, { message: "A senha é obrigatória" }),
})

export const signUpFormSchema = z.object({
    firstName:   z.string().min(1, "Obrigatório"),
    lastName:    z.string().min(1, "Obrigatório"),
    phoneNumber: z.string().min(1, "Obrigatório").max(15),
    email:       z.string().email("Email inválido").min(1, "Obrigatório"),
    password:    z.string()
        .min(8, "Mínimo 8 caracteres")
        .max(30, "Máximo 30 caracteres")
        .regex(passwordRegex, "Senha muito fraca"),
    dateOfBirth: z.date({ message: "Obrigatório" })
        .refine((d) => d >= minDate, { message: "Data inválida." })
        .refine((d) => d <= maxDateForPro, { message: "Necessário ter 18+ anos." }),
    cpf:    z.string().min(11, "CPF incompleto").refine(isValidCPF, "CPF inválido"),
    gender: z.enum(["MASCULINE", "FEMININE", "OTHER"], { message: "Obrigatório" }),
})

export const patientSignUpSchema = z.object({
    firstName:   z.string().min(2, "Nome é obrigatório"),
    lastName:    z.string().min(2, "Sobrenome é obrigatório"),
    email:       z.string().email("E-mail inválido"),
    password:    z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
    phoneNumber: z.string().min(10, "Telefone inválido"),
    cpf:         z.string().min(11, "CPF inválido"),
    dateOfBirth: z.string().min(10, "Data de nascimento é obrigatória"),
    gender:      z.enum(["MASCULINE", "FEMININE", "OTHER"], { message: "Selecione seu gênero" }),
})

export const completeRegistrationSchema = z.object({
    crp:       z.string().min(4, "CRP é obrigatório"),
    expertise: z.enum(
        ["CLINICAL", "SOCIAL", "INFANT", "JURIDICAL", "PSYCHOTHERAPIST", "NEUROPSYCHOLOGY", "OTHER"],
        { error: "Selecione uma especialidade" }
    ),
    gender: z.enum(["MASCULINE", "FEMININE", "OTHER"], { error: "Selecione um gênero" }),
})

export type SignInSchema               = z.infer<typeof signInSchema>
export type SignUpFormData             = z.infer<typeof signUpFormSchema>
export type PatientSignUpSchema        = z.infer<typeof patientSignUpSchema>
export type CompleteRegistrationSchema = z.infer<typeof completeRegistrationSchema>
