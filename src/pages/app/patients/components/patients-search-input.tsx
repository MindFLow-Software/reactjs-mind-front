"use client"

import { Search } from "lucide-react"
import type { ComponentProps } from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type InputProps = ComponentProps<typeof Input>

interface PatientsSearchInputProps extends InputProps {
    wrapperClassName?: string
}

export function PatientsSearchInput({
    wrapperClassName,
    className,
    ...props
}: PatientsSearchInputProps) {
    return (
        <div className={cn("relative w-full lg:w-[320px] shrink-0", wrapperClassName)}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
                {...props}
                className={cn(
                    "h-9 w-full rounded-lg border-border/70 bg-background shadow-sm pl-9 text-sm placeholder:text-muted-foreground/80 focus-visible:ring-2 focus-visible:ring-blue-500/30 focus-visible:border-blue-400 transition",
                    className
                )}
            />
        </div>
    )
}
