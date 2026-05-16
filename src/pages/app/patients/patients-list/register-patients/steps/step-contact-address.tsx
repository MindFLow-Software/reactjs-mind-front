import type { ChangeEvent } from "react"
import { Controller } from "react-hook-form"
import type { Control, UseFormRegister, FieldErrors } from "react-hook-form"
import { Info, Mail, MapPin, Phone } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { formatPhone } from "@/utils/formatPhone"

import type { PatientFormData } from "@/validators/patients"
import { inputCls, selectCls, selectClassName } from "../form-styles"
import { SectionTitle } from "./section-title"

const UF_LIST = ["SP", "RJ", "MG", "RS", "PR", "SC", "BA", "DF", "GO", "PE", "CE", "AM", "PA", "MA", "PB", "RN", "AL", "PI", "ES", "MT", "MS", "RO", "TO", "AC", "AP", "RR", "SE"]

interface StepContactAddressProps {
    register:          UseFormRegister<PatientFormData>
    control:           Control<PatientFormData>
    errors:            FieldErrors<PatientFormData>
    cep:               string
    onCepChange:       (e: ChangeEvent<HTMLInputElement>) => void
    street:            string
    onStreetChange:    (v: string) => void
    district:          string
    onDistrictChange:  (v: string) => void
    city:              string
    onCityChange:      (v: string) => void
    uf:                string
    onUfChange:        (v: string) => void
}

export function StepContactAddress({
    register, control, errors,
    cep, onCepChange,
    street, onStreetChange,
    district, onDistrictChange,
    city, onCityChange,
    uf, onUfChange,
}: StepContactAddressProps) {
    return (
        <div className="space-y-6">
            {/* Contato */}
            <div>
                <SectionTitle icon={Phone} label="Contato" />
                <div className="grid grid-cols-2 gap-x-3.5 gap-y-3">
                    <div>
                        <label className="mb-[5px] flex items-center gap-1 text-[12px] font-semibold text-slate-700">
                            Celular <span className="text-red-600">*</span>
                        </label>
                        <div className="relative">
                            <Phone className="pointer-events-none absolute left-3 top-1/2 size-[14px] -translate-y-1/2 text-slate-400" />
                            <Controller
                                name="phoneNumber"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        id="phoneNumber"
                                        value={field.value ?? ""}
                                        onChange={(e) => field.onChange(formatPhone(e.target.value))}
                                        onBlur={field.onBlur}
                                        ref={field.ref}
                                        placeholder="(00) 00000-0000"
                                        inputMode="numeric"
                                        autoComplete="tel"
                                        className={cn(inputCls, "pl-9 tabular-nums")}
                                    />
                                )}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="mb-[5px] block text-[12px] font-semibold text-slate-700">E-mail</label>
                        <div className="relative">
                            <Mail className="pointer-events-none absolute left-3 top-1/2 size-[14px] -translate-y-1/2 text-slate-400" />
                            <Input
                                {...register("email")}
                                id="email"
                                type="email"
                                placeholder="paciente@email.com"
                                autoComplete="email"
                                className={cn(inputCls, "pl-9", errors.email && "border-red-600")}
                            />
                        </div>
                        {errors.email && (
                            <p className="mt-1 flex items-center gap-1 text-[11.5px] font-medium text-red-600">
                                <Info className="size-3 shrink-0" />{errors.email.message}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Endereço */}
            <div>
                <SectionTitle icon={MapPin} label="Endereço" />
                <div className="grid grid-cols-3 gap-x-3.5 gap-y-3">
                    <div>
                        <label className="mb-[5px] flex items-center justify-between text-[12px] font-semibold text-slate-700">
                            CEP <span className="text-[10.5px] font-medium text-slate-400">preenche automático</span>
                        </label>
                        <Input
                            value={cep}
                            onChange={onCepChange}
                            placeholder="00000-000"
                            inputMode="numeric"
                            maxLength={9}
                            className={cn(inputCls, "tabular-nums")}
                        />
                    </div>
                    <div className="col-span-2">
                        <label className="mb-[5px] block text-[12px] font-semibold text-slate-700">Logradouro</label>
                        <Input
                            value={street}
                            onChange={(e) => onStreetChange(e.target.value)}
                            placeholder="Rua, número"
                            className={inputCls}
                        />
                    </div>
                    <div>
                        <label className="mb-[5px] block text-[12px] font-semibold text-slate-700">Bairro</label>
                        <Input
                            value={district}
                            onChange={(e) => onDistrictChange(e.target.value)}
                            placeholder="Bairro"
                            className={inputCls}
                        />
                    </div>
                    <div>
                        <label className="mb-[5px] block text-[12px] font-semibold text-slate-700">Cidade</label>
                        <Input
                            value={city}
                            onChange={(e) => onCityChange(e.target.value)}
                            placeholder="Cidade"
                            className={inputCls}
                        />
                    </div>
                    <div>
                        <label className="mb-[5px] block text-[12px] font-semibold text-slate-700">UF</label>
                        <select
                            value={uf}
                            onChange={(e) => onUfChange(e.target.value)}
                            style={selectCls}
                            className={selectClassName}
                        >
                            <option value="">—</option>
                            {UF_LIST.map((s) => <option key={s}>{s}</option>)}
                        </select>
                    </div>
                </div>
            </div>
        </div>
    )
}
