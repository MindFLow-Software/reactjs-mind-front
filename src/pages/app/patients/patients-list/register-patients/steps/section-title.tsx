import "./section-title.css"
import type { ElementType } from "react"

interface SectionTitleProps {
    icon: ElementType
    label: string
}

export function SectionTitle({ icon: Icon, label }: SectionTitleProps) {
    return (
        <div className="rp-section-title">
            <Icon className="rp-section-title__icon" />
            <span className="rp-section-title__label">{label}</span>
        </div>
    )
}
