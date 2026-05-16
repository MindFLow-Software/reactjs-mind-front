import type { ChangeEvent } from "react"
import { Controller } from "react-hook-form"
import type { Control, UseFormRegister, FieldErrors } from "react-hook-form"
import { parse as dateParse, isValid as dateIsValid } from "date-fns"
import { Check, Info, Shield, UserRound } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { formatCPF } from "@/utils/formatCPF"
import { formatAGE } from "@/utils/formatAGE"

import type { PatientFormData } from "@/validators/patients"
import { GENDER_OPTIONS } from "../constants"
import { inputCls } from "../form-styles"
import { SectionTitle } from "./section-title"
import { PillRadio } from "./pill-radio"
import { PatientAvatarUpload } from "./patient-avatar-upload"

function calcAge(ddmmyyyy: string): number | null {
    if (ddmmyyyy.length !== 10) return null
    const d = dateParse(ddmmyyyy, "dd/MM/yyyy", new Date())
    if (!dateIsValid(d) || d > new Date()) return null
    return formatAGE(d)
}

interface StepBasicDataProps {
    register:       UseFormRegister<PatientFormData>
    control:        Control<PatientFormData>
    errors:         FieldErrors<PatientFormData>
    cpfDigits:      string
    birthInput:     string
    onBirthChange:  (e: ChangeEvent<HTMLInputElement>, fieldOnChange: (v: Date | null) => void) => void
    onAvatarSelect: (f: File | null) => void
    patient?:       Record<string, unknown>
}

export function StepBasicData({
    register, control, errors,
    cpfDigits, birthInput, onBirthChange,
    onAvatarSelect, patient,
}: StepBasicDataProps) {
    const age      = calcAge(birthInput)
    const initials = patient
        ? `${String(patient.firstName ?? "")[0] ?? ""}${String(patient.lastName ?? "")[0] ?? ""}`.toUpperCase()
        : undefined

    return (
        <div className="space-y-5">
            <PatientAvatarUpload
                onFileSelect={onAvatarSelect}
                defaultValue={patient?.profileImageUrl as string | null | undefined}
                initials={initials}
            />

            {/* Identificação */}
            <div>
                <SectionTitle icon={UserRound} label="Identificação" />
                <div className="grid grid-cols-2 gap-x-3.5 gap-y-3">
                    <div>
                        <label className="mb-[5px] flex items-center gap-1 text-[12px] font-semibold text-slate-700">
                            Nome <span className="text-red-600">*</span>
                        </label>
                        <Input
                            {...register("firstName")}
                            id="firstName"
                            placeholder="Ex: Ana Luísa"
                            autoComplete="given-name"
                            className={cn(inputCls, errors.firstName && "border-red-600 focus-visible:ring-red-600/20")}
                        />
                        {errors.firstName && (
                            <p className="mt-1 flex items-center gap-1 text-[11.5px] font-medium text-red-600">
                                <Info className="size-3 shrink-0" />{errors.firstName.message}
                            </p>
                        )}
                    </div>
                    <div>
                        <label className="mb-[5px] flex items-center gap-1 text-[12px] font-semibold text-slate-700">
                            Sobrenome <span className="text-red-600">*</span>
                        </label>
                        <Input
                            {...register("lastName")}
                            id="lastName"
                            placeholder="Ex: Costa"
                            autoComplete="family-name"
                            className={cn(inputCls, errors.lastName && "border-red-600 focus-visible:ring-red-600/20")}
                        />
                        {errors.lastName && (
                            <p className="mt-1 flex items-center gap-1 text-[11.5px] font-medium text-red-600">
                                <Info className="size-3 shrink-0" />{errors.lastName.message}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Dados pessoais */}
            <div>
                <SectionTitle icon={Shield} label="Dados pessoais" />
                <div className="grid grid-cols-2 gap-x-3.5 gap-y-3">
                    {/* CPF */}
                    <div>
                        <label className="mb-[5px] flex items-center justify-between text-[12px] font-semibold text-slate-700">
                            CPF <span className="text-[10.5px] font-medium text-slate-400">verificação automática</span>
                        </label>
                        <div className="relative">
                            <Controller
                                name="cpf"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        id="cpf"
                                        value={field.value ?? ""}
                                        onChange={(e) => field.onChange(formatCPF(e.target.value))}
                                        onBlur={field.onBlur}
                                        ref={field.ref}
                                        placeholder="000.000.000-00"
                                        inputMode="numeric"
                                        className={cn(
                                            inputCls, "tabular-nums",
                                            cpfDigits.length === 11 && !errors.cpf && "border-emerald-500 pr-9",
                                            errors.cpf && "border-red-600 focus-visible:ring-red-600/20"
                                        )}
                                    />
                                )}
                            />
                            {cpfDigits.length === 11 && !errors.cpf && (
                                <Check className="absolute right-3 top-1/2 size-3.5 -translate-y-1/2 text-emerald-500" />
                            )}
                        </div>
                        {errors.cpf && (
                            <p className="mt-1 flex items-center gap-1 text-[11.5px] font-medium text-red-600">
                                <Info className="size-3 shrink-0" />{errors.cpf.message}
                            </p>
                        )}
                    </div>

                    {/* Nascimento */}
                    <div>
                        <label className="mb-[5px] block text-[12px] font-semibold text-slate-700">Nascimento</label>
                        <Controller
                            name="dateOfBirth"
                            control={control}
                            render={({ field }) => (
                                <div>
                                    <Input
                                        value={birthInput}
                                        onChange={(e) => onBirthChange(e, field.onChange)}
                                        placeholder="DD/MM/AAAA"
                                        maxLength={10}
                                        inputMode="numeric"
                                        className={cn(inputCls, "tabular-nums")}
                                    />
                                    {age !== null && (
                                        <p className="mt-1 text-[11.5px] text-slate-500">{age} anos</p>
                                    )}
                                </div>
                            )}
                        />
                    </div>
                </div>

                {/* Gênero */}
                <div className="mt-3">
                    <label className="mb-[5px] block text-[12px] font-semibold text-slate-700">Gênero</label>
                    <Controller
                        name="gender"
                        control={control}
                        render={({ field }) => (
                            <PillRadio name="gender" options={GENDER_OPTIONS} value={field.value} onChange={field.onChange} />
                        )}
                    />
                </div>
            </div>
        </div>
    )
}
