"use client"

import { Activity, DollarSign, ShieldCheck, Lock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MetricCard } from "./metric-card"

interface PatientResumeTabProps {
    meta: {
        totalCount: number
        averageDuration: number
    }
}

export function PatientResumeTab({ meta }: PatientResumeTabProps) {
    const formattedDuration = `${meta.averageDuration || 0}min`

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <MetricCard
                title="Sessões Totais"
                value={meta.totalCount}
                subLabel="Duração média"
                subValue={formattedDuration}
                icon={Activity}
            />

            <Card className="shadow-sm border-border bg-card/50">
                <CardHeader className="py-2 px-4">
                    <CardTitle className="text-[10px] uppercase text-muted-foreground flex items-center gap-2 font-bold tracking-wider">
                        <DollarSign className="size-3 text-emerald-600" />
                        Saldo Pendente
                    </CardTitle>
                </CardHeader>
                <CardContent className="py-2 px-4">
                    <p className="text-xl font-bold text-foreground tabular-nums">R$ 0,00</p>
                    <p className="text-[10px] text-muted-foreground">Valor total devido</p>
                </CardContent>
            </Card>

            <Card className="shadow-sm border-border bg-card/50 sm:col-span-2 lg:col-span-1">
                <CardHeader className="py-2 px-4">
                    <CardTitle className="text-[10px] uppercase text-muted-foreground flex items-center gap-2 font-bold tracking-wider">
                        <ShieldCheck className="size-3 text-amber-600" />
                        Segurança LGPD
                    </CardTitle>
                </CardHeader>
                <CardContent className="py-2 px-4 flex justify-between items-center">
                    <div>
                        <p className="text-xs font-semibold text-foreground">Criptografia Ativa</p>
                        <p className="text-[10px] text-muted-foreground">Dados protegidos</p>
                    </div>
                    <Lock className="size-4 text-amber-400/40" />
                </CardContent>
            </Card>
        </div>
    )
}