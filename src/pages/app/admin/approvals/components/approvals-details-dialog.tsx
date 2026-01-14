"use client"

import { BadgeCheck, ExternalLink, FileText, Fingerprint, Phone } from "lucide-react"
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { formatCPF } from "@/utils/formatCPF"
import { formatPhone } from "@/utils/formatPhone"

interface ApprovalsDetailsDialogProps {
    psychologist: any
    onApprove: (id: string) => void
    onClose: () => void
}

export function ApprovalsDetailsDialog({ psychologist, onApprove, onClose }: ApprovalsDetailsDialogProps) {
    return (
        <DialogContent className="max-w-md p-0 overflow-hidden flex flex-col gap-0">
            <DialogHeader className="p-6 pb-4 border-b">
                <DialogTitle className="flex items-center gap-2 text-base">
                    <BadgeCheck className="h-5 w-5 text-primary" /> Verificação Profissional
                </DialogTitle>
                <DialogDescription className="text-xs">
                    Valide as credenciais para aprovação.
                </DialogDescription>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto max-h-[60vh] p-6 space-y-6 scrollbar-thin scrollbar-thumb-muted-foreground/20">
                <div className="space-y-4">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Dados Cadastrais</h4>
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm">
                            <Fingerprint className="h-4 w-4 text-muted-foreground/60" />
                            <span className="font-medium text-muted-foreground">CPF:</span> {formatCPF(psychologist.cpf)}
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-4 w-4 text-muted-foreground/60" />
                            <span className="font-medium text-muted-foreground">Número:</span>
                            <a href={`https://wa.me/55${psychologist.phoneNumber}`} target="_blank" className="text-primary hover:underline">
                                {formatPhone(psychologist.phoneNumber)}
                            </a>
                        </div>
                        <Badge variant="secondary" className="text-[10px] px-2 py-0 h-5">
                            {psychologist.expertise || "Não definido"}
                        </Badge>
                    </div>
                </div>

                <div className="space-y-3">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Conselho Profissional</h4>
                    <div className="p-4 border rounded-xl bg-muted/20 space-y-2.5">
                        <div className="text-sm font-bold flex items-center justify-between">
                            <span>CRP: {psychologist.crp}</span>
                            <a href="https://cadastro.cfp.org.br/" target="_blank" className="text-[10px] flex items-center gap-1 text-primary hover:underline">
                                Consultar <ExternalLink className="h-3 w-3" />
                            </a>
                        </div>
                        <p className="text-[10px] text-muted-foreground leading-relaxed">
                            Confirme se o registro está ativo e regular no conselho de classe.
                        </p>
                    </div>
                </div>

                <Separator />

                <div className="space-y-3">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Identificação (CRP/RG)</h4>
                    <div className="aspect-video w-full bg-muted/40 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 hover:bg-muted/60 transition-colors cursor-pointer group">
                        <FileText className="h-6 w-6 text-muted-foreground/70 group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] text-muted-foreground">Expandir documento</span>
                    </div>
                </div>
            </div>

            <div className="p-4 bg-muted/30 border-t flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={onClose} className="cursor-pointer h-8 text-xs px-4">
                    Fechar
                </Button>
                <Button size="sm" className="cursor-pointer h-8 text-xs bg-green-600 hover:bg-green-700 px-4" onClick={() => onApprove(psychologist.id)}>
                    Aprovar Profissional
                </Button>
            </div>
        </DialogContent>
    )
}