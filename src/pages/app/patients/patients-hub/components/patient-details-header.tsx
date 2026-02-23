"use client"

import { useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import {
    Tooltip,
    TooltipTrigger,
    TooltipContent,
    TooltipProvider,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { UserAvatar } from "@/components/user-avatar"
import { Copy, CheckCircle2, XCircle } from "lucide-react"

interface PatientDetailsHeaderProps {
    patient: {
        id: string
        firstName: string
        lastName: string
        status: "active" | "inactive"
        profileImageUrl: string | null
    }
}

export function PatientDetailsHeader({ patient }: PatientDetailsHeaderProps) {
    const shortId = useMemo(() => patient.id.substring(0, 10).toUpperCase(), [patient.id])
    const fullName = `${patient.firstName} ${patient.lastName}`

    const isPatientActive = patient.status === "active"

    const handleCopyId = () => {
        navigator.clipboard.writeText(patient.id)
    }

    return (
        <TooltipProvider delayDuration={200}>
            <header className="flex flex-col gap-5 pb-6">
                <div className="flex items-center gap-4">

                    <div className="relative shrink-0">
                        <UserAvatar
                            src={patient.profileImageUrl}
                            name={fullName}
                            className="h-16 w-16 border-2 border-background shadow-md ring-1 ring-border"
                        />

                        {/* Status indicador no Avatar (Cores sincronizadas) */}
                        <span className={cn(
                            "absolute -bottom-0.5 -right-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full border-2 border-background",
                            isPatientActive ? "bg-emerald-500" : "bg-zinc-500"
                        )}>
                            {isPatientActive && <span className="h-1.5 w-1.5 rounded-full bg-emerald-200 animate-pulse" />}
                        </span>
                    </div>

                    <div className="flex min-w-0 flex-col gap-1.5">
                        <div className="flex flex-wrap items-center gap-2.5">
                            <h1 className="truncate text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                                {fullName}
                            </h1>

                            {/* 🟢 Badge de Status (Padrão idêntico à Tabela e Info) */}
                            {isPatientActive ? (
                                <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/20 gap-1.5 h-[22px] px-2 text-[10px] font-bold uppercase tracking-tight">
                                    <CheckCircle2 className="h-3 w-3" /> Ativo
                                </Badge>
                            ) : (
                                <Badge variant="secondary" className="bg-zinc-500/10 text-zinc-600 border-zinc-500/20 gap-1.5 h-[22px] px-2 text-[10px] font-bold uppercase tracking-tight">
                                    <XCircle className="h-3 w-3" /> Inativo
                                </Badge>
                            )}
                        </div>

                        <div className="group inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Copy className="h-3 w-3 opacity-50 group-hover:opacity-100" />

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button
                                        onClick={handleCopyId}
                                        className="cursor-pointer font-mono text-[11px] tracking-wide bg-muted/50 px-1.5 py-0.5 rounded transition-colors hover:text-primary"
                                    >
                                        ID: {shortId}
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent side="bottom" className="text-xs">
                                    Copiar ID completo
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    </div>
                </div>
            </header>
        </TooltipProvider>
    )
}