import "./pill-radio.css"
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
        <div className="rp-pill-radio">
            {options.map((opt) => {
                const Icon    = opt.icon
                const checked = value === opt.value
                return (
                    <label
                        key={opt.value}
                        className={cn(
                            "rp-pill-radio__label",
                            checked
                                ? (opt.checkedCls ?? "rp-pill-radio__label--checked")
                                : "rp-pill-radio__label--unchecked"
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
