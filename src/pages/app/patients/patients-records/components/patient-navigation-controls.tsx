import { ChevronLeft, ChevronRight } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"

interface PatientNavigationControlsProps {
    prevId: string | null
    nextId: string | null
    current: number
    total: number
}

export function PatientNavigationControls({
    prevId,
    nextId,
    current,
    total
}: PatientNavigationControlsProps) {
    const navigate = useNavigate()

    return (
        <div className="flex items-center gap-3 rounded-lg border border-border/60 bg-card px-3 py-1.5">
            <Button
                variant="outline"
                size="icon"
                className="size-8 cursor-pointer rounded-md border-border/70 bg-background text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-35 disabled:text-muted-foreground"
                disabled={!prevId}
                onClick={() => navigate(`/patients/${prevId}/details`)}
                aria-label="Paciente anterior"
            >
                <ChevronLeft className="size-4.5" />
            </Button>

            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider tabular-nums whitespace-nowrap">
                Paciente {current} de {total}
            </span>

            <Button
                variant="outline"
                size="icon"
                className="size-8 cursor-pointer rounded-md border-border/70 bg-background text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-35 disabled:text-muted-foreground"
                disabled={!nextId}
                onClick={() => navigate(`/patients/${nextId}/details`)}
                aria-label="Próximo paciente"
            >
                <ChevronRight className="size-4.5" />
            </Button>
        </div>
    )
}
