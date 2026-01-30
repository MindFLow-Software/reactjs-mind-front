"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "sonner"
import { TriangleAlert, Loader2, UserCheck } from "lucide-react"

interface ToggleStatusProps {
    fullName: string
    isActive: boolean
    onClose: () => void
    onInactivate: () => Promise<void>
    isPending: boolean
}

export function DeletePatientDialog({ fullName, isActive, onClose, onInactivate, isPending }: ToggleStatusProps) {
    const [, setError] = useState<string | null>(null)

    async function handleAction() {
        try {
            setError(null)
            await onInactivate()
            toast.success(`Paciente ${isActive ? 'inativado' : 'reativado'} com sucesso!`)
            onClose()
        } catch (err: any) {
            const errorMessage = err?.response?.data?.message || "Erro ao processar. Tente novamente."
            setError(errorMessage)
            toast.error(errorMessage)
        }
    }

    return (
        <DialogContent className="sm:max-w-[480px] p-0 gap-0 overflow-hidden border border-border bg-card shadow-xl">
            <div className="flex flex-col items-center justify-center p-8 pb-6 pt-10 text-center">
                <div className={`mb-6 flex h-20 w-20 items-center justify-center rounded-full ${isActive ? 'bg-destructive/10' : 'bg-emerald-500/10'}`}>
                    <div className={`flex h-12 w-12 items-center justify-center rounded-full shadow-sm ${isActive ? 'bg-destructive/20' : 'bg-emerald-500/20'}`}>
                        {isActive ? (
                            <TriangleAlert className="h-6 w-6 text-destructive" />
                        ) : (
                            <UserCheck className="h-6 w-6 text-emerald-500" />
                        )}
                    </div>
                </div>

                <DialogHeader className="mb-2">
                    <DialogTitle className="text-2xl font-bold text-foreground">
                        {isActive ? 'Inativar registro?' : 'Reativar registro?'}
                    </DialogTitle>
                </DialogHeader>

                <DialogDescription className="max-w-[85%] text-base text-muted-foreground mx-auto leading-relaxed">
                    {isActive
                        ? <>Você está prestes a inativar <strong>{fullName}</strong>. Ele deixará de aparecer nas buscas ativas.</>
                        : <>Você está reativando <strong>{fullName}</strong>. Ele voltará a aparecer normalmente no sistema.</>
                    }
                </DialogDescription>
            </div>

            <DialogFooter className="grid grid-cols-2 gap-0 border-t border-border bg-muted/30 p-0">
                <Button
                    variant="ghost"
                    onClick={onClose}
                    disabled={isPending}
                    className="cursor-pointer h-14 w-full rounded-none border-r border-border text-base font-medium text-muted-foreground hover:bg-muted"
                >
                    Cancelar
                </Button>

                <Button
                    variant="ghost"
                    onClick={handleAction}
                    disabled={isPending}
                    className={`cursor-pointer h-14 w-full rounded-none text-base font-bold transition-colors ${isActive
                            ? 'text-destructive hover:text-destructive-foreground'
                            : 'text-emerald-400 hover:text-emerald-600'
                        }`}
                >
                    {isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        isActive ? 'Sim, inativar' : 'Sim, reativar'
                    )}
                </Button>
            </DialogFooter>
        </DialogContent>
    )
}