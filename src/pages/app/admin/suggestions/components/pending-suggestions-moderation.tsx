"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Check, X, MessageSquare, Loader2, Calendar, User, Eye, Save, Tag, FileText, AlignLeft } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { toast } from "sonner"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { api } from "@/lib/axios"
import { updateSuggestionStatus } from "@/api/update-suggestion-status"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

const CATEGORY_LABELS: Record<string, string> = {
    UI_UX: "Interface / UX",
    SCHEDULING: "Agendamentos",
    REPORTS: "Relatórios",
    PRIVACY_LGPD: "Privacidade",
    INTEGRATIONS: "Integrações",
    OTHERS: "Outros",
}

export function PendingSuggestionsModeration() {
    const queryClient = useQueryClient()

    const { data: suggestions, isLoading } = useQuery({
        queryKey: ["admin", "suggestions", "pending"],
        queryFn: async () => {
            const response = await api.get("/suggestions", { params: { status: "PENDING" } })
            return response.data.suggestions
        },
    })

    const { mutateAsync: handleUpdateStatus, isPending: isUpdating } = useMutation({
        mutationFn: updateSuggestionStatus,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "suggestions"] })
            queryClient.invalidateQueries({ queryKey: ["admin", "suggestions-stats"] })
            toast.success("Sugestão aprovada com sucesso!")
        },
        onError: () => toast.error("Falha ao processar moderação.")
    })

    const isEmpty = !suggestions || suggestions.length === 0

    return (
        <Card className="border-border bg-card shadow-md rounded-2xl overflow-hidden">
            <CardHeader className="bg-muted/30 border-b border-border">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <MessageSquare className="size-5 text-primary" />
                    </div>
                    <div>
                        <CardTitle className="text-lg font-bold text-foreground">Fila de Moderação</CardTitle>
                        <CardDescription className="text-xs text-muted-foreground">Avalie e edite os feedbacks antes de torná-los públicos</CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-0 cursor-pointer">
                {isLoading ? (
                    <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-muted-foreground" /></div>
                ) : isEmpty ? (
                    <div className="p-12 text-center space-y-2">
                        <Check className="size-8 text-emerald-500 mx-auto opacity-20" />
                        <p className="text-sm text-muted-foreground font-medium">Nenhuma sugestão pendente no momento.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-border">
                        {suggestions.map((item: any) => (
                            <SuggestionModerationItem
                                key={item.id}
                                item={item}
                                onUpdate={handleUpdateStatus}
                                isUpdating={isUpdating}
                            />
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

function SuggestionModerationItem({ item, onUpdate, isUpdating }: { item: any, onUpdate: any, isUpdating: boolean }) {
    const [title, setTitle] = useState(item.title)
    const [category, setCategory] = useState(item.category)
    const [description, setDescription] = useState(item.description)
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    async function handleAction(status?: string) {
        try {
            await onUpdate({
                id: item.id,
                status: status || item.status,
                title,
                category,
                description
            })
            setIsDialogOpen(false)
        } catch (error) { }
    }

    return (
        <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-muted/50 transition-colors">
            <div className="space-y-2 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-primary/10 text-primary rounded-md tracking-wider">
                        {CATEGORY_LABELS[item.category] || "Geral"}
                    </span>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-medium">
                        <Calendar className="size-3" /> {format(new Date(item.createdAt), "dd/MM/yyyy", { locale: ptBR })}
                    </span>
                </div>
                <h4 className="font-bold text-foreground text-sm break-all leading-tight">{item.title}</h4>
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed max-w-3xl italic break-all">
                    "{item.description}"
                </p>
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-medium">
                    <User className="size-3" /> Enviado por {item.psychologistName || "Psicólogo"}
                </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-xs font-bold rounded-xl h-9 px-4 gap-2 hover:bg-primary/5 border-border cursor-pointer">
                            <Eye className="size-3.5" /> Revisar e Editar
                        </Button>
                    </DialogTrigger>

                    <DialogContent className="sm:max-w-[650px] border-border bg-card gap-6 rounded-2xl overflow-hidden min-w-0">
                        <DialogHeader className="min-w-0 overflow-hidden">
                            <DialogTitle className="text-xl font-bold text-foreground leading-tight break-all">Revisão de Conteúdo</DialogTitle>
                        </DialogHeader>

                        <div className="space-y-5 min-w-0 overflow-hidden">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2 min-w-0">
                                    <Label className="text-[10px] font-black uppercase text-muted-foreground flex items-center gap-2">
                                        <FileText className="size-3" /> Título (Editável)
                                    </Label>
                                    <Input
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="h-10 border-border bg-background focus-visible:ring-primary font-medium w-full text-foreground"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase text-muted-foreground flex items-center gap-2">
                                        <Tag className="size-3" /> Categoria
                                    </Label>
                                    <Select value={category} onValueChange={setCategory}>
                                        <SelectTrigger className="h-10 border-border bg-background font-medium text-foreground">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-popover border-border">
                                            {Object.entries(CATEGORY_LABELS).map(([val, label]) => (
                                                <SelectItem key={val} value={val}>{label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2 min-w-0">
                                <Label className="text-[10px] font-black uppercase text-muted-foreground flex items-center gap-2">
                                    <AlignLeft className="size-3" /> Descrição da Sugestão (Editável)
                                </Label>
                                <Textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="min-h-[220px] resize-none border-border bg-background focus-visible:ring-primary leading-relaxed text-muted-foreground text-sm break-all"
                                    placeholder="Corrija erros ou remova termos impróprios aqui..."
                                />
                            </div>

                            <footer className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t border-dashed border-border min-w-0 overflow-hidden">
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="size-9 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground shrink-0"><User className="size-4" /></div>
                                    <div className="flex flex-col text-[11px] min-w-0 overflow-hidden">
                                        <span className="font-black uppercase text-muted-foreground">Autor Original</span>
                                        <span className="font-bold text-foreground truncate">{item.psychologistName || "Não identificado"}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-[11px] min-w-0 overflow-hidden">
                                    <div className="size-9 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground shrink-0"><Calendar className="size-4" /></div>
                                    <div className="flex flex-col min-w-0 overflow-hidden">
                                        <span className="font-black uppercase text-muted-foreground">Enviado em</span>
                                        <span className="font-bold text-foreground truncate">{format(new Date(item.createdAt), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}</span>
                                    </div>
                                </div>
                            </footer>
                        </div>

                        <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-2">
                            <Button
                                variant="ghost"
                                onClick={() => handleAction()}
                                disabled={isUpdating}
                                className="flex-1 rounded-xl font-bold h-11 text-muted-foreground hover:bg-muted cursor-pointer"
                            >
                                <Save className="size-4 mr-2" /> Salvar Edição
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <div className="flex items-center gap-1 border-l border-border pl-2 ml-1 shrink-0">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    onClick={() => handleAction("OPEN")}
                                    disabled={isUpdating}
                                    variant="ghost" size="icon"
                                    className="text-emerald-600 hover:bg-emerald-500/10 size-9 rounded-xl transition-all cursor-pointer"
                                >
                                    {isUpdating ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top"><p>Aprovar sugestão</p></TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    onClick={() => handleAction("REJECTED")}
                                    disabled={isUpdating}
                                    variant="ghost" size="icon"
                                    className="text-red-500 hover:bg-red-500/10 size-9 rounded-xl transition-all cursor-pointer"
                                >
                                    {isUpdating ? <Loader2 className="size-4 animate-spin" /> : <X className="size-4" />}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top"><p>Rejeitar sugestão</p></TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </div>
        </div>
    )
}