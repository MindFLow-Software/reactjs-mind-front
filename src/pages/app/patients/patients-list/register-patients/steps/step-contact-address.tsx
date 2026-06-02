import { useFormContext } from "react-hook-form"
import { Mail, MapPin, Phone } from "lucide-react"
import { Input } from "@/components/ui/input"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { formatPhone } from "@/utils/formatPhone"
import { formatCEP } from "@/utils/formatCEP"
import { UF_LIST } from "@/utils/mappers"

import "./step-contact-address.css"
import type { PatientFormData } from "@/validators/patients"
import { SectionTitle } from "./section-title"
import { Normalizer } from "@/utils/normalizer"
import type { UseCepLookupReturn } from "@/hooks/use-cep-lookup"

interface StepContactAddressProps {
    onCepChange:    UseCepLookupReturn['onCepChange']
    isCepLoading: boolean
}

export function StepContactAddress({ onCepChange, isCepLoading }: StepContactAddressProps) {
    const { control } = useFormContext<PatientFormData>()

    const handleCepChange = (cepValue: string) => {
        const cep = Normalizer.digits(cepValue)
        const fomattedCep = formatCEP(cep.slice(0, 8))
        onCepChange(cep)

        return fomattedCep
    }

    return (
        <div className="space-y-6">
            {/* Contato */}
            <div>
                <SectionTitle icon={Phone} label="Contato" />
                <div className="patient-form-grid-2">
                    <FormField control={control} name="phoneNumber" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Celular</FormLabel>
                            <div className="relative">
                                <Phone className="patient-icon-prefix" />
                                <FormControl>
                                    <Input
                                        id="phoneNumber"
                                        value={field.value ?? ""}
                                        onChange={(e) => field.onChange(formatPhone(e.target.value))}
                                        onBlur={field.onBlur}
                                        ref={field.ref}
                                        placeholder="(00) 00000-0000"
                                        inputMode="numeric"
                                        autoComplete="off"
                                        className={cn("patient-input", "pl-9 tabular-nums")}
                                    />
                                </FormControl>
                            </div>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={control} name="email" render={({ field, fieldState }) => (
                        <FormItem>
                            <FormLabel>E-mail</FormLabel>
                            <div className="relative">
                                <Mail className="patient-icon-prefix" />
                                <FormControl>
                                    <Input
                                        {...field}
                                        id="email"
                                        type="email"
                                        placeholder="paciente@email.com"
                                        autoComplete="off"
                                        className={cn("patient-input", "pl-9", fieldState.invalid && "border-red-600 focus-visible:ring-red-600/20")}
                                    />
                                </FormControl>
                            </div>
                            <FormMessage />
                        </FormItem>
                    )} />
                </div>
            </div>

            {/* Endereço */}
            <div>
                <SectionTitle icon={MapPin} label="Endereço" />
                <div className="patient-form-grid-3">
                    <FormField control={control} name="zipCode" render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex items-center justify-between">
                                CEP <span className="patient-field-hint">preenche automático</span>
                            </FormLabel>
                            <FormControl>
                                <Input
                                    value={field.value ?? ""}
                                    onChange={(e) => {
                                        field.onChange(handleCepChange(e.target.value))
                                    }}
                                    ref={field.ref}
                                    placeholder="00000-000"
                                    inputMode="numeric"
                                    maxLength={9}
                                    autoComplete="off"
                                    className={cn("patient-input", "tabular-nums")}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={control} name="street" render={({ field }) => (
                        <FormItem className="col-span-2">
                            <FormLabel>Logradouro</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder="Rua, número"
                                    autoComplete="off"
                                    disabled={isCepLoading}
                                    className={cn("patient-input", isCepLoading && "opacity-50")}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={control} name="neighborhood" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Bairro</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder="Bairro"
                                    autoComplete="off"
                                    disabled={isCepLoading}
                                    className={cn("patient-input", isCepLoading && "opacity-50")}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={control} name="city" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Cidade</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder="Cidade"
                                    autoComplete="off"
                                    disabled={isCepLoading}
                                    className={cn("patient-input", isCepLoading && "opacity-50")}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={control} name="state" render={({ field }) => (
                        <FormItem>
                            <FormLabel>UF</FormLabel>
                            <Select
                                value={field.value ?? ""}
                                onValueChange={field.onChange}
                                disabled={isCepLoading}
                            >
                                <FormControl>
                                    <SelectTrigger className={cn("patient-input", "cursor-pointer", isCepLoading && "opacity-50")}>
                                        <SelectValue placeholder="—" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {UF_LIST.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )} />
                </div>
            </div>
        </div>
    )
}
