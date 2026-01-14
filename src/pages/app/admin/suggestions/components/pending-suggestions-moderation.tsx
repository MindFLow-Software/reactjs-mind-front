"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Check, X, MessageSquare, Loader2, Calendar, User } from "lucide-react"
import { format } from "date-fns"
import { toast } from "sonner"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { api } from "@/lib/axios"
import { updateSuggestionStatus } from "@/api/update-suggestion-status"

const CATEGORY_LABELS: Record<string, string> = {
    UI_UX: "UI / UX",
    SCHEDULING: "Agendamentos",
    REPORTS: "Relatórios",
    PRIVACY_LGPD: "Privacidade",
    INTEGRATIONS: "Integrações",
    OTHERS: "Outros",
}

export function PendingSuggestionsModeration() {
    const queryClient = useQueryClient()

    // 1. Busca apenas as sugestões que precisam de aprovação (PENDING)
    const { data: suggestions, isLoading } = useQuery({
        queryKey: ["admin", "suggestions", "pending"],
        queryFn: async () => {
            const response = await api.get("/suggestions", { params: { status: "PENDING" } })
            return response.data.suggestions
        },
    })

    // 2. Mutation para aprovar ou rejeitar
    const { mutateAsync: handleUpdateStatus, isPending: isUpdating } = useMutation({
        mutationFn: updateSuggestionStatus,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "suggestions"] })
            queryClient.invalidateQueries({ queryKey: ["admin", "suggestions-stats"] })
            toast.success("Ação realizada com sucesso!")
        },
        onError: () => toast.error("Falha ao processar moderação.")
    })

    const isEmpty = !suggestions || suggestions.length === 0

    return (
        <Card className="border-slate-200 shadow-md rounded-2xl overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-100 rounded-lg">
                        <MessageSquare className="size-5 text-amber-600" />
                    </div>
                    <div>
                        <CardTitle className="text-lg font-bold text-slate-800">Fila de Moderação</CardTitle>
                        <CardDescription className="text-xs">Sugestões aguardando revisão para tornarem-se públicas</CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-0">
                {isLoading ? (
                    <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-slate-300" /></div>
                ) : isEmpty ? (
                    <div className="p-12 text-center space-y-2">
                        <Check className="size-8 text-emerald-500 mx-auto opacity-20" />
                        <p className="text-sm text-slate-400 font-medium">Tudo em dia! Nenhuma sugestão pendente.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {suggestions.map((item: any) => (
                            <div key={item.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">

                                {/* Info da Sugestão */}
                                <div className="space-y-2 flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md">
                                            {CATEGORY_LABELS[item.category] || "Geral"}
                                        </span>
                                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                                            <Calendar className="size-3" /> {format(new Date(item.createdAt), "dd/MM/yy")}
                                        </span>
                                    </div>
                                    <h4 className="font-bold text-slate-800 text-sm">{item.title}</h4>
                                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{item.description}</p>

                                    <div className="flex items-center gap-2 text-[11px] text-slate-400 italic">
                                        <User className="size-3" /> Enviado por {item.psychologistName}
                                    </div>
                                </div>

                                {/* Ações Rápidas */}
                                <div className="flex items-center gap-2 shrink-0">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" size="sm" className="text-xs font-bold rounded-xl h-9">
                                                Visualizar
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="rounded-2xl">
                                            <DialogHeader>
                                                <DialogTitle className="text-xl font-bold">{item.title}</DialogTitle>
                                            </DialogHeader>
                                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm text-slate-600 mb-4">
                                                {item.description}
                                            </div>
                                            <div className="flex gap-3">
                                                <Button
                                                    onClick={() => handleUpdateStatus({ id: item.id, status: "OPEN" })}
                                                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 font-bold rounded-xl"
                                                    disabled={isUpdating}
                                                >
                                                    Aprovar e Publicar
                                                </Button>
                                                <Button
                                                    onClick={() => handleUpdateStatus({ id: item.id, status: "REJECTED" })}
                                                    variant="destructive"
                                                    className="flex-1 font-bold rounded-xl"
                                                    disabled={isUpdating}
                                                >
                                                    Rejeitar
                                                </Button>
                                            </div>
                                        </DialogContent>
                                    </Dialog>

                                    <Button
                                        onClick={() => handleUpdateStatus({ id: item.id, status: "OPEN" })}
                                        disabled={isUpdating}
                                        className="bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white border-emerald-100 size-9 p-0 rounded-xl transition-all"
                                    >
                                        <Check className="size-4" />
                                    </Button>
                                    <Button
                                        onClick={() => handleUpdateStatus({ id: item.id, status: "REJECTED" })}
                                        disabled={isUpdating}
                                        className="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border-red-100 size-9 p-0 rounded-xl transition-all"
                                    >
                                        <X className="size-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}