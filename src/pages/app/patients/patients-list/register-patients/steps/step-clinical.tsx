import type { ChangeEvent } from "react"
import { Activity, FileText } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

import { MODALITY_OPTIONS } from "../constants"
import { inputCls, selectCls, selectClassName } from "../form-styles"
import { SectionTitle } from "./section-title"
import { PillRadio } from "./pill-radio"
import { MarkdownEditor } from "./markdown-editor"

interface StepClinicalProps {
    modality:          string
    onModalityChange:  (v: string) => void
    frequency:         string
    onFrequencyChange: (v: string) => void
    price:             string
    onPriceChange:     (e: ChangeEvent<HTMLInputElement>) => void
    source:            string
    onSourceChange:    (v: string) => void
    notes:             string
    onNotesChange:     (v: string) => void
}

export function StepClinical({
    modality, onModalityChange,
    frequency, onFrequencyChange,
    price, onPriceChange,
    source, onSourceChange,
    notes, onNotesChange,
}: StepClinicalProps) {
    return (
        <div className="space-y-6">
            {/* Atendimento */}
            <div>
                <SectionTitle icon={Activity} label="Atendimento" />
                <div className="grid grid-cols-2 gap-x-3.5 gap-y-4">
                    <div>
                        <label className="mb-[5px] block text-[12px] font-semibold text-slate-700">Modalidade</label>
                        <PillRadio name="modality" options={MODALITY_OPTIONS} value={modality} onChange={onModalityChange} />
                    </div>
                    <div>
                        <label className="mb-[5px] block text-[12px] font-semibold text-slate-700">Frequência</label>
                        <select
                            value={frequency}
                            onChange={(e) => onFrequencyChange(e.target.value)}
                            style={selectCls}
                            className={selectClassName}
                        >
                            {["Semanal", "Quinzenal", "Mensal", "Sob demanda"].map((f) => (
                                <option key={f}>{f}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="mb-[5px] block text-[12px] font-semibold text-slate-700">Valor da sessão</label>
                        <div className="relative">
                            <span className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-[13px] font-semibold text-slate-500">R$</span>
                            <Input
                                value={price}
                                onChange={onPriceChange}
                                placeholder="180,00"
                                inputMode="decimal"
                                className={cn(inputCls, "pl-9 tabular-nums")}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="mb-[5px] block text-[12px] font-semibold text-slate-700">Indicação</label>
                        <Input
                            value={source}
                            onChange={(e) => onSourceChange(e.target.value)}
                            placeholder="Como conheceu? (opcional)"
                            className={inputCls}
                        />
                    </div>
                </div>
            </div>

            {/* Notas clínicas */}
            <div>
                <SectionTitle icon={FileText} label="Queixa principal & observações" />
                <MarkdownEditor value={notes} onChange={onNotesChange} />
            </div>
        </div>
    )
}
