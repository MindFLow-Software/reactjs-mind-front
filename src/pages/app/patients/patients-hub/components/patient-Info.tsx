"use client"

import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"

interface PatientInfoProps {
    patient: {
        dateOfBirth?: string | Date | null
        cpf?: string | null
        email?: string | null
        phoneNumber?: string | null
    }
}

const EMPTY_VALUE = "--"

const formatCPF = (value: string | null | undefined) => {
    if (!value) return EMPTY_VALUE
    return value
        .replace(/\D/g, "")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})/, "$1-$2")
}

const formatPhoneNumber = (value: string | null | undefined) => {
    if (!value) return EMPTY_VALUE
    const cleanValue = value.replace(/\D/g, "")
    return cleanValue
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d)/, "$1-$2")
}

const calculateAge = (dob: string | Date | null | undefined) => {
    if (!dob) return EMPTY_VALUE

    const birthDate = new Date(dob)
    if (isNaN(birthDate.getTime())) return EMPTY_VALUE

    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--
    }

    return `${age} anos`
}

function InfoField({ label, value, isMono }: { label: string; value: React.ReactNode; isMono?: boolean }) {
    return (
        <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">
                {label}
            </span>
            <div className={cn("text-sm font-medium flex items-center min-h-[22px]", isMono && "font-mono tabular-nums")}>
                {value}
            </div>
        </div>
    )
}

export function PatientInfo({ patient }: PatientInfoProps) {
    const age = calculateAge(patient.dateOfBirth)

    const dobFormatted = patient.dateOfBirth
        ? format(new Date(patient.dateOfBirth), "dd/MM/yyyy", { locale: ptBR })
        : EMPTY_VALUE

    return (
        <div className="rounded-xl px-1 md:px-2">
            <div className="text-sm font-bold pb-4 mb-2 border-b border-border/60">
                Informacoes de Cadastro
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-7 gap-x-8 py-2">
                <InfoField label="Idade" value={age} />
                <InfoField label="Nascimento" value={dobFormatted} isMono />
                <InfoField label="CPF" value={formatCPF(patient.cpf)} isMono />
                <InfoField label="Telefone / WhatsApp" value={formatPhoneNumber(patient.phoneNumber)} isMono />
                <InfoField label="E-mail de Contato" value={patient.email || EMPTY_VALUE} />
            </div>
        </div>
    )
}
