"use client"

import { ThumbsUp, Calendar, Clock, Search, Rocket, ChevronRight, XCircle } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"
import type { Suggestion } from "@/api/get-suggestions"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface RoadmapCardProps {
    item: Suggestion
    onStatusChange: (id: string, status: string) => void
    isUpdating: boolean
}

const CATEGORY_LABELS: Record<string, string> = {
    UI_UX: "Interface / UX",
    SCHEDULING: "Agendamentos",
    REPORTS: "Relatórios",
    PRIVACY_LGPD: "Privacidade",
    INTEGRATIONS: "Integrações",
    OTHERS: "Outros",
}

const STEPS = [
    { id: "OPEN", label: "Votação", icon: Search, color: "text-blue-500", bg: "bg-blue-500/10" },
    { id: "UNDER_REVIEW", label: "Em Estudo", icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
    { id: "PLANNED", label: "Implementando", icon: Calendar, color: "text-purple-500", bg: "bg-purple-500/10" },
    { id: "IMPLEMENTED", label: "Concluído", icon: Rocket, color: "text-emerald-500", bg: "bg-emerald-500/10" },
]

export function RoadmapCard({ item, onStatusChange, isUpdating }: RoadmapCardProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <article className="bg-card border border-border rounded-[24px] p-5 cursor-pointer transition-all hover:shadow-md group min-w-0 w-full">
                    <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 min-w-0">

                        <div className="space-y-3 flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-md font-black uppercase tracking-wider shrink-0">
                                    {CATEGORY_LABELS[item.category] || item.category}
                                </span>
                                <div className="flex items-center gap-1.5 text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-full shrink-0 border border-amber-500/20">
                                    <ThumbsUp className="size-3.5 fill-amber-500/20" />
                                    <span className="text-[10px] font-black">{item.likesCount || 0}</span>
                                </div>
                            </div>

                            <div className="min-w-0">
                                <h3 className="font-bold text-foreground text-sm group-hover:text-primary transition-colors truncate break-words">
                                    {item.title}
                                </h3>
                                <p className="text-xs text-muted-foreground line-clamp-1 break-words italic">
                                    "{item.description}"
                                </p>
                            </div>

                            <div className="flex items-center gap-2 pt-2 border-t border-dashed border-border">
                                <div className="size-6 rounded-full bg-muted flex items-center justify-center border border-border text-muted-foreground font-bold text-[8px] shrink-0">
                                    {item.psychologistName?.substring(0, 2).toUpperCase()}
                                </div>
                                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-tight truncate">
                                    {item.psychologistName} • {format(new Date(item.createdAt), "dd/MM/yyyy")}
                                </span>
                            </div>
                        </div>

                        {/* Stepper de Status */}
                        <div
                            className="flex items-center gap-1 p-1 bg-muted/50 rounded-xl shrink-0 self-end xl:self-center"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {STEPS.map((step, index) => {
                                const isCurrent = item.status === step.id
                                return (
                                    <div key={step.id} className="flex items-center">
                                        <button
                                            disabled={isUpdating}
                                            onClick={() => onStatusChange(item.id, step.id)}
                                            className={cn(
                                                "cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all",
                                                isCurrent
                                                    ? `${step.bg} ${step.color} shadow-sm border border-border`
                                                    : "text-muted-foreground hover:bg-muted"
                                            )}
                                        >
                                            <step.icon className="size-3" />
                                            <span className={cn(!isCurrent && "hidden xl:inline")}>{step.label}</span>
                                        </button>
                                        {index < STEPS.length - 1 && <ChevronRight className="size-3 text-muted/50 mx-0.5" />}
                                    </div>
                                )
                            })}

                            <div className="ml-1 pl-1 border-l border-border">
                                <button
                                    onClick={() => onStatusChange(item.id, "REJECTED")}
                                    className="p-1.5 text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                                >
                                    <XCircle className="size-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </article>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[600px] border-border bg-card gap-6 rounded-3xl overflow-hidden">
                <DialogHeader>
                    <div className="mb-2">
                        <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-black uppercase">
                            {CATEGORY_LABELS[item.category] || item.category}
                        </span>
                    </div>
                    <DialogTitle className="text-xl font-bold text-foreground leading-tight break-words">
                        {item.title}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    <div className="bg-muted/30 p-5 rounded-2xl border border-border max-h-[350px] overflow-y-auto scrollbar-thin scrollbar-thumb-border">
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed break-words">
                            {item.description}
                        </p>
                    </div>

                    <footer className="flex items-center justify-between pt-4 border-t border-dashed border-border">
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="size-10 rounded-full bg-muted flex items-center justify-center border border-border text-muted-foreground font-bold text-xs shrink-0">
                                {item.psychologistName?.substring(0, 2).toUpperCase()}
                            </div>
                            <div className="flex flex-col min-w-0">
                                <span className="text-[10px] font-black text-muted-foreground uppercase">Sugestão enviada por</span>
                                <span className="text-xs font-bold text-foreground truncate">{item.psychologistName}</span>
                            </div>
                        </div>
                        <div className="text-right shrink-0">
                            <span className="text-[10px] font-black text-muted-foreground uppercase block">Data do Registro</span>
                            <span className="text-xs font-medium text-muted-foreground">
                                {format(new Date(item.createdAt), "dd 'de' MMMM", { locale: ptBR })}
                            </span>
                        </div>
                    </footer>
                </div>
            </DialogContent>
        </Dialog>
    )
}