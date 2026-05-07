import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

interface PatientsDataBlockProps {
    title?: ReactNode
    description?: ReactNode
    toolbar?: ReactNode
    children: ReactNode
    footer?: ReactNode
    className?: string
    contentClassName?: string
    isLoading?: boolean
}

export function PatientsDataBlock({
    title,
    description,
    toolbar,
    children,
    footer,
    className,
    contentClassName,
    isLoading,
}: PatientsDataBlockProps) {
    return (
        <section className={cn("space-y-4", className)}>
            {(title || description || isLoading) && (
                <header className="space-y-1">
                    {isLoading ? (
                        <Skeleton className="h-5 w-32" />
                    ) : (
                        title && <h2 className="text-base font-semibold tracking-tight">{title}</h2>
                    )}
                    {description && !isLoading && (
                        <p className="text-sm text-muted-foreground">{description}</p>
                    )}
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
