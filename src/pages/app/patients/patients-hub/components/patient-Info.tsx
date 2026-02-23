"use client"

import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"
import type { Patient } from "@/api/get-patients"

interface PatientInfoProps {
    patient: Patient & { totalAppointments?: number }
}

const formatCPF = (value: string | null | undefined) => {
    if (!value) return "—"
    const cleanValue = value.replace(/\D/g, "")
    return cleanValue
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})/, "$1-$2")
}

const formatPhoneNumber = (value: string | null | undefined) => {
    if (!value) return "—"
    const cleanValue = value.replace(/\D/g, "")
    return cleanValue
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d)/, "$1-$2")
}

const calculateAge = (dob: string | null | undefined) => {
    if (!dob) return "—"
    const birthDate = new Date(dob)
    if (isNaN(birthDate.getTime())) return "—"

    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const m = today.getMonth() - birthDate.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--
    }
    return `${age} anos`
}

interface InfoFieldProps {
    label: string
    value: React.ReactNode
    isMono?: boolean
}

function InfoField({ label, value, isMono }: InfoFieldProps) {
    return (
        <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">
                {label}
            </span>
            <div className={cn(
                "text-sm font-medium flex items-center min-h-[22px]",
                isMono && "font-mono tabular-nums"
            )}>
                {value}
            </div>
        </div>
    )
}

export function PatientInfo({ patient }: PatientInfoProps) {
    const age = calculateAge(patient.dateOfBirth)
    const dobFormatted = patient.dateOfBirth
        ? format(new Date(patient.dateOfBirth), "dd/MM/yyyy", { locale: ptBR })
        : "—"

    return (
        <div className="border rounded-xl px-4 bg-card shadow-sm">
            <div className="text-sm font-bold py-4 border-b mb-2 flex justify-between items-center">
                <span>Informações de Cadastro</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-6 gap-x-8 py-4">
                <InfoField label="Idade" value={age} />
                <InfoField label="Nascimento" value={dobFormatted} isMono />
                <InfoField label="CPF" value={formatCPF(patient.cpf)} isMono />
                <InfoField label="Telefone / WhatsApp" value={formatPhoneNumber(patient.phoneNumber)} isMono />
                <InfoField label="E-mail de Contato" value={patient.email || "—"} />
            </div>
        </div>
    )
}