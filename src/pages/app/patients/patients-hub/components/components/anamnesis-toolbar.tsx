import { Button } from "@/components/ui/button"
import { Bold, Italic, Underline, Highlighter, List, ListOrdered } from "lucide-react"

interface AnamnesisToolbarProps {
    onFormat: (marker: string) => void
    onList: (prefix: string, numbered?: boolean) => void
}

export function AnamnesisToolbar({ onFormat, onList }: AnamnesisToolbarProps) {
    return (
        <div className="flex flex-wrap items-center gap-2 rounded-xl bg-muted/45 p-2">
            <Button variant="secondary" size="sm" onClick={() => onFormat("**")} className="cursor-pointer bg-background/80">
                <Bold className="mr-1 h-4 w-4" /> Negrito
            </Button>
            <Button variant="secondary" size="sm" onClick={() => onFormat("*")} className="cursor-pointer bg-background/80">
                <Italic className="mr-1 h-4 w-4" /> Itálico
            </Button>
            <Button variant="secondary" size="sm" onClick={() => onFormat("__")} className="cursor-pointer bg-background/80">
                <Underline className="mr-1 h-4 w-4" /> Sublinhado
            </Button>
            <Button variant="secondary" size="sm" onClick={() => onFormat("==")} className="cursor-pointer bg-background/80">
                <Highlighter className="mr-1 h-4 w-4" /> Marca-texto
            </Button>
            <Button variant="secondary" size="sm" onClick={() => onList("-")} className="cursor-pointer bg-background/80">
                <List className="mr-1 h-4 w-4" /> Lista
            </Button>
            <Button variant="secondary" size="sm" onClick={() => onList("1.", true)} className="cursor-pointer bg-background/80">
                <ListOrdered className="mr-1 h-4 w-4" /> Numerada
            </Button>
        </div>
    )
}