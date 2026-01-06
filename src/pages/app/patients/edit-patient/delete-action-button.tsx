"use client"

import { useState } from "react" // Adicionado
import { Trash2, Loader2, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

interface DeleteActionButtonProps {
    onDelete: () => Promise<void> // Forçamos ser uma Promise
    itemName?: string
    isLoading?: boolean
    className?: string
}

export function DeleteActionButton({
    onDelete,
    itemName,
    isLoading = false,
    className
}: DeleteActionButtonProps) {
    const [open, setOpen] = useState(false) // Controle manual do Dialog

    const handleConfirm = async (e: React.MouseEvent) => {
        e.preventDefault() // Impede o fechamento automático imediato
        try {
            await onDelete()
            setOpen(false) // Fecha o modal apenas no sucesso
        } catch (error) {
            // O erro já é tratado pelo toast no pai, mantemos o modal aberto se falhar
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    disabled={isLoading}
                    className={cn(
                        "cursor-pointer h-8 w-8 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200",
                        className
                    )}
                >
                    {isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                </Button>
            </AlertDialogTrigger>

            <AlertDialogContent className="max-w-[400px] rounded-2xl">
                <AlertDialogHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
                            <AlertTriangle className="h-5 w-5 text-destructive" />
                        </div>
                        <AlertDialogTitle className="text-xl font-semibold tracking-tight">Excluir arquivo?</AlertDialogTitle>
                    </div>
                    <AlertDialogDescription className="text-sm text-muted-foreground leading-relaxed">
                        A exclusão de <span className="font-semibold text-foreground break-all">{itemName}</span> é permanente.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter className="mt-4">
                    <AlertDialogCancel disabled={isLoading} className="rounded-xl border-none hover:bg-muted/50">
                        Cancelar
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleConfirm}
                        className="rounded-xl bg-destructive hover:bg-destructive/90 text-white"
                    >
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sim, Excluir"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}