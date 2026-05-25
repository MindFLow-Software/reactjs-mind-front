import { FilterX } from "lucide-react"

export function RecordsEmptyState() {
    return (
        <div className="col-span-full py-20 flex flex-col items-center text-muted-foreground border-2 border-dashed rounded-2xl">
            <FilterX className="size-10 mb-2 opacity-20" />
            <p className="text-sm">Nenhum prontuario encontrado.</p>
        </div>
    )
}
