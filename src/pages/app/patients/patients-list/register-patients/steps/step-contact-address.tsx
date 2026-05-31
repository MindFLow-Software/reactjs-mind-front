import { Controller } from "react-hook-form"
import type { Control, UseFormRegister, FieldErrors } from "react-hook-form"
import { Info, Mail, MapPin, Phone } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { formatPhone } from "@/utils/formatPhone"
import { formatCEP } from "@/utils/formatCEP"
import { UF_LIST } from "@/utils/mappers"

import type { PatientFormData } from "@/validators/patients"
import { inputCls, selectCls, selectClassName } from "../form-styles"
import { SectionTitle } from "./section-title"

interface StepContactAddressProps {
    register:     UseFormRegister<PatientFormData>
    control:      Control<PatientFormData>
    errors:       FieldErrors<PatientFormData>
    onCepBlur:    () => void
    isCepLoading: boolean
}

export function StepContactAddress({
    register, control, errors,
    onCepBlur, isCepLoading,
}: StepContactAddressProps) {
    return (
        <div className="space-y-6">
            {/* Contato */}
            <div>
                <SectionTitle icon={Phone} label="Contato" />
                <div className="grid grid-cols-2 gap-x-3.5 gap-y-3">
                    <div>
                        <label className="mb-[5px] flex items-center gap-1 text-[12px] font-semibold text-foreground/80">
                            Celular
                        </label>
                        <div className="relative">
                            <Phone className="pointer-events-none absolute left-3 top-1/2 size-[14px] -translate-y-1/2 text-muted-foreground" />
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
                                        autoComplete="off"
                                        className={cn(inputCls, "pl-9 tabular-nums")}
                                    />
                                )}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="mb-[5px] block text-[12px] font-semibold text-foreground/80">E-mail</label>
                        <div className="relative">
                            <Mail className="pointer-events-none absolute left-3 top-1/2 size-[14px] -translate-y-1/2 text-muted-foreground" />
                            <Input
                                {...register("email")}
                                id="email"
                                type="email"
                                placeholder="paciente@email.com"
                                autoComplete="off"
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
                        <label className="mb-[5px] flex items-center justify-between text-[12px] font-semibold text-foreground/80">
                            CEP <span className="text-[10.5px] font-medium text-muted-foreground">preenche automático</span>
                        </label>
                        <Controller
                            name="cep"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    value={field.value ?? ""}
                                    onChange={(e) => field.onChange(formatCEP(e.target.value.replace(/\D/g, "").slice(0, 8)))}
                                    onBlur={() => { field.onBlur(); onCepBlur() }}
                                    ref={field.ref}
                                    placeholder="00000-000"
                                    inputMode="numeric"
                                    maxLength={9}
                                    autoComplete="off"
                                    className={cn(inputCls, "tabular-nums")}
                                />
                            )}
                        />
                    </div>
                    <div className="col-span-2">
                        <label className="mb-[5px] block text-[12px] font-semibold text-foreground/80">Logradouro</label>
                        <Input
                            {...register("logradouro")}
                            placeholder="Rua, número"
                            autoComplete="off"
                            disabled={isCepLoading}
                            className={cn(inputCls, isCepLoading && "opacity-50")}
                        />
                    </div>
                    <div>
                        <label className="mb-[5px] block text-[12px] font-semibold text-foreground/80">Bairro</label>
                        <Input
                            {...register("bairro")}
                            placeholder="Bairro"
                            autoComplete="off"
                            disabled={isCepLoading}
                            className={cn(inputCls, isCepLoading && "opacity-50")}
                        />
                    </div>
                    <div>
                        <label className="mb-[5px] block text-[12px] font-semibold text-foreground/80">Cidade</label>
                        <Input
                            {...register("cidade")}
                            placeholder="Cidade"
                            autoComplete="off"
                            disabled={isCepLoading}
                            className={cn(inputCls, isCepLoading && "opacity-50")}
                        />
                    </div>
                    <div>
                        <label className="mb-[5px] block text-[12px] font-semibold text-foreground/80">UF</label>
                        <Controller
                            name="uf"
                            control={control}
                            render={({ field }) => (
                                <select
                                    value={field.value ?? ""}
                                    onChange={(e) => field.onChange(e.target.value)}
                                    onBlur={field.onBlur}
                                    ref={field.ref}
                                    disabled={isCepLoading}
                                    style={selectCls}
                                    className={cn(selectClassName, isCepLoading && "opacity-50")}
                                >
                                    <option value="">—</option>
                                    {UF_LIST.map((s) => <option key={s}>{s}</option>)}
                                </select>
                            )}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
