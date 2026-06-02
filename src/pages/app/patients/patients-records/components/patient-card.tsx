import { Clock, ChevronRight } from "lucide-react"
import { formatDistanceToNow, parseISO } from "date-fns"
import { ptBR } from "date-fns/locale"

import { Card, CardContent } from "@/components/ui/card"
import { UserAvatar } from "@/components/user-avatar"
import type { Ipatient } from "@/types/patient"

interface PatientCardProps {
    patient: Ipatient
    onOpen: (id: string) => void
}

export function PatientCard({ patient, onOpen }: PatientCardProps) {
    return (
        <Card
            className="group hover:border-blue-500/50 transition-all cursor-pointer bg-card shadow-sm min-w-0 overflow-hidden"
            onClick={() => onOpen(patient.id)}
        >
            <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <UserAvatar
                        src={patient.profileImageUrl}
                        name={patient.name}
                        size="lg"
                        className="border-blue-100 shadow-sm"
                    />

                    <div className="flex flex-col">
                        <span className="font-semibold text-sm group-hover:text-blue-600 transition-colors line-clamp-1">
                            {patient.name}
                        </span>
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase font-bold">
                            <Clock className="size-3 text-blue-500/70" />
                            {patient.lastSessionAt ? (
                                `Ultima sessao: ${formatDistanceToNow(parseISO(patient.lastSessionAt), {
                                    addSuffix: true,
                                    locale: ptBR,
                                })}`
                            ) : (
                                "Sem sessoes registradas"
                            )}
                        </div>
                    </div>
                </div>
                <ChevronRight className="size-4 text-muted-foreground group-hover:text-blue-500 transition-transform group-hover:translate-x-1" />
            </CardContent>
        </Card>
    )
}
