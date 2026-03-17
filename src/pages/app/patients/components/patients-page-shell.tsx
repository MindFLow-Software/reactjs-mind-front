"use client"

import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface PatientsPageShellProps {
    title?: ReactNode
    description?: ReactNode
    icon?: ReactNode
    headerRight?: ReactNode
    filters?: ReactNode
    children: ReactNode
    pagination?: ReactNode
    className?: string
    contentClassName?: string
}

interface PatientsSurfaceProps {
    children: ReactNode
    className?: string
}

const BRAND_COLOR = "#2563eb"


export function PatientsSurface({ children, className }: PatientsSurfaceProps) {
    return (
        <section
            className={cn(
                "rounded-xl border border-border/70 bg-card/70 backdrop-blur-sm shadow-sm p-3 md:p-4",
                className
            )}
        >
            {children}
        </section>
    )
}

export function PatientsPageShell({
    title,
    description,
    icon,
    headerRight,
    filters,
    children,
    pagination,
    className,
    contentClassName,
}: PatientsPageShellProps) {
    return (
        <div className={cn("flex flex-col gap-4", className)}>
            {(title || description || headerRight) && (
                <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-l-4 pl-5 py-2" style={{ borderLeftColor: BRAND_COLOR }} >
                    <div className="space-y-1">
                        {title && (
                            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-3">
                                {icon}
                                <span>{title}</span>
                            </h1>
                        )}
                        {description && (
                            <p className="text-sm text-muted-foreground">{description}</p>
                        )}
                    </div>
                    {headerRight && <div className="shrink-0">{headerRight}</div>}
                </header>
            )}

            {filters && <PatientsSurface>{filters}</PatientsSurface>}

            <PatientsSurface className={cn("overflow-hidden", contentClassName)}>
                {children}
            </PatientsSurface>

            {pagination && <div>{pagination}</div>}
        </div>
    )
}
