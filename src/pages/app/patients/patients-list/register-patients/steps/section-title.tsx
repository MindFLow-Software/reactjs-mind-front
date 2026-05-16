import type { ElementType } from "react"

interface SectionTitleProps {
    icon: ElementType
    label: string
}

export function SectionTitle({ icon: Icon, label }: SectionTitleProps) {
    return (
        <div className="mb-[10px] flex items-center gap-[7px]">
            <Icon className="size-[13px] shrink-0 text-blue-600" />
            <span className="text-[11px] font-bold uppercase tracking-[0.06em] text-slate-500">{label}</span>
        </div>
    )
}
