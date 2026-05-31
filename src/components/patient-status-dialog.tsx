import { useState } from "react"
import { Loader2, UserRoundCheck, TriangleAlert } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface PatientStatusDialogProps {
    mode:      "archive" | "reactivate"
    fullName:  string
    onClose:   () => void
    onConfirm: () => Promise<void>
    isPending: boolean
}

const CONFIG = {
    archive: {
        icon:        TriangleAlert,
        iconBg:      "bg-red-100 dark:bg-red-950/40",
        iconColor:   "text-red-500",
        title:       "Arquivar paciente?",
        description: (name: string) => (
            <>
                Você está prestes a arquivar{" "}
                <span className="font-semibold text-foreground">{name}</span>.
                {" "}O histórico é preservado e você pode reativá-lo a qualquer momento.
            </>
        ),
        confirmLabel:  "Sim, arquivar",
        confirmClass:  "bg-red-600 hover:bg-red-700 text-white",
        successToast:  (name: string) => `Paciente ${name} arquivado com sucesso.`,
    },
    reactivate: {
        icon:        UserRoundCheck,
        iconBg:      "bg-emerald-100 dark:bg-emerald-950/40",
        iconColor:   "text-emerald-600",
        title:       "Reativar paciente?",
        description: (name: string) => (
            <>
                Você está prestes a reativar{" "}
                <span className="font-semibold text-foreground">{name}</span>.
                {" "}O paciente voltará a aparecer na lista de ativos.
            </>
        ),
        confirmLabel:  "Sim, reativar",
        confirmClass:  "bg-emerald-600 hover:bg-emerald-700 text-white",
        successToast:  (name: string) => `Paciente ${name} reativado com sucesso.`,
    },
} as const

export function PatientStatusDialog({ mode, fullName, onClose, onConfirm, isPending }: PatientStatusDialogProps) {
    const [, setError] = useState<string | null>(null)
    const cfg = CONFIG[mode]
    const Icon = cfg.icon

    async function handleAction() {
        try {
            setError(null)
            await onConfirm()
            toast.success(cfg.successToast(fullName))
            onClose()
        } catch (err: unknown) {
            const message = (err as { message?: string })?.message ?? "Erro ao processar. Tente novamente."
            setError(message)
            toast.error(message)
        }
    }

    return (
        <DialogContent className="sm:max-w-[420px] gap-0 overflow-hidden rounded-2xl border border-border bg-card p-0 shadow-xl">
            <div className="flex flex-col items-center px-8 pb-6 pt-8 text-center">
                <div className={cn("mb-5 grid h-16 w-16 shrink-0 place-items-center rounded-full", cfg.iconBg)}>
                    <Icon className={cn("h-6 w-6 shrink-0", cfg.iconColor)} strokeWidth={1.75} />
                </div>

                <DialogHeader className="mb-3 space-y-0">
                    <DialogTitle className="text-[20px] font-bold tracking-tight text-foreground">
                        {cfg.title}
                    </DialogTitle>
                </DialogHeader>

                <DialogDescription className="text-[14px] leading-relaxed text-muted-foreground">
                    {cfg.description(fullName)}
                </DialogDescription>
            </div>

            <DialogFooter className="grid grid-cols-2 gap-3 px-6 pb-6 pt-2">
                <Button
                    variant="outline"
                    onClick={onClose}
                    disabled={isPending}
                    className="h-12 w-full cursor-pointer rounded-xl font-semibold"
                >
                    Cancelar
                </Button>

                <Button
                    onClick={handleAction}
                    disabled={isPending}
                    className={`h-12 w-full cursor-pointer rounded-xl font-semibold ${cfg.confirmClass}`}
                >
                    {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : cfg.confirmLabel}
                </Button>
            </DialogFooter>
        </DialogContent>
    )
}
