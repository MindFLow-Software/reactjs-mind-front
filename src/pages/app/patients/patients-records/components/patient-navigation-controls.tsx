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
        <div className="flex items-center gap-4 bg-muted/40 px-3 py-1.5 rounded-full border border-border/50">
            <Button
                variant="ghost"
                size="icon"
                className="size-7 cursor-pointer disabled:opacity-30"
                disabled={!prevId}
                onClick={() => navigate(`/patients/${prevId}/details`)}
            >
                <ChevronLeft className="size-4" />
            </Button>

            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest tabular-nums">
                Paciente {current} de {total}
            </span>

            <Button
                variant="ghost"
                size="icon"
                className="size-7 cursor-pointer disabled:opacity-30"
                disabled={!nextId}
                onClick={() => navigate(`/patients/${nextId}/details`)}
            >
                <ChevronRight className="size-4" />
            </Button>
        </div>
    )
}