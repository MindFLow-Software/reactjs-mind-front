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
                <header className="rounded-xl border border-border/70 bg-gradient-to-r from-card to-muted/30 p-4 md:p-5 shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                            {title && (
                                <h1 className="text-xl md:text-2xl font-bold tracking-tight flex items-center gap-2">
                                    {icon}
                                    <span>{title}</span>
                                </h1>
                            )}
                            {description && (
                                <p className="text-sm text-muted-foreground">{description}</p>
                            )}
                        </div>
                        {headerRight && <div className="shrink-0">{headerRight}</div>}
                    </div>
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
