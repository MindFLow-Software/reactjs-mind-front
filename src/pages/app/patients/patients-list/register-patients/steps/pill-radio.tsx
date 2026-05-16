import type { ElementType } from "react"
import { cn } from "@/lib/utils"

export interface PillOption {
    value:       string
    label:       string
    icon?:       ElementType | null
    checkedCls?: string
}

interface PillRadioProps {
    name:     string
    options:  readonly PillOption[]
    value:    string
    onChange: (v: string) => void
}

export function PillRadio({ name, options, value, onChange }: PillRadioProps) {
    return (
        <div className="flex flex-wrap gap-2">
            {options.map((opt) => {
                const Icon    = opt.icon
                const checked = value === opt.value
                return (
                    <label
                        key={opt.value}
                        className={cn(
                            "flex cursor-pointer items-center gap-[6px] rounded-[6px] border-[1.5px] px-3 py-[7px] text-[12.5px] font-semibold transition-all duration-[120ms]",
                            checked
                                ? (opt.checkedCls ?? "border-blue-600 bg-blue-50 text-blue-700")
                                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                        )}
                    >
                        <input
                            type="radio"
                            name={name}
                            value={opt.value}
                            checked={checked}
                            onChange={() => onChange(opt.value)}
                            className="sr-only"
                        />
                        {Icon && <Icon className="size-[13px]" />}
                        {opt.label}
                    </label>
                )
            })}
        </div>
    )
}
