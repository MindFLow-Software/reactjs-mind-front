"use client"

import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface PatientsDataBlockProps {
    title?: ReactNode
    description?: ReactNode
    toolbar?: ReactNode
    children: ReactNode
    footer?: ReactNode
    className?: string
    contentClassName?: string
}

export function PatientsDataBlock({
    title,
    description,
    toolbar,
    children,
    footer,
    className,
    contentClassName,
}: PatientsDataBlockProps) {
    return (
        <section className={cn("space-y-4", className)}>
            {(title || description) && (
                <header className="space-y-1">
                    {title && <h2 className="text-base font-semibold tracking-tight">{title}</h2>}
                    {description && <p className="text-sm text-muted-foreground">{description}</p>}
                </header>
            )}

            {toolbar && <div>{toolbar}</div>}

            <div className={cn("w-full", contentClassName)}>
                {children}
            </div>

            {footer && <footer>{footer}</footer>}
        </section>
    )
}
