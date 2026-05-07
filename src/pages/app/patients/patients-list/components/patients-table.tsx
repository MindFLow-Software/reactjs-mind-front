import { ArrowUp, ArrowDown, ArrowUpDown, SearchX, UserPlus } from "lucide-react"
import {
    Table, TableBody, TableCell,
    TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { PatientsTableRow } from "./patients-table-row"
import { PatientsTableLoading } from "./loading"
import type { Patient } from "@/api/get-patients"
import type { PatientSortOrder } from "@/hooks/use-patient-filters"
import { cn } from "@/lib/utils"

interface PatientsTableProps {
    patients: Patient[]
    isLoading: boolean
    perPage?: number
    hasActiveFilters?: boolean
    sortOrder?: PatientSortOrder
    onSortByName?: () => void
    onClearFilters?: () => void
    onRegister?: () => void
}

function SortIcon({ column, sortOrder }: { column: "name" | "other"; sortOrder?: PatientSortOrder }) {
    if (column !== "name") return <ArrowUpDown className="ml-1.5 h-3 w-3 text-muted-foreground/60" />
    return sortOrder === "asc"
        ? <ArrowUp className="ml-1.5 h-3 w-3 text-primary" />
        : <ArrowDown className="ml-1.5 h-3 w-3 text-primary" />
}

const COL_HEAD = "text-[11px] uppercase tracking-wider font-semibold text-muted-foreground whitespace-nowrap"

export function PatientsTable({
    patients,
    isLoading,
    perPage = 10,
    hasActiveFilters,
    sortOrder = "asc",
    onSortByName,
    onClearFilters,
    onRegister,
}: PatientsTableProps) {
    const colSpan = 8

    return (
        <div className="rounded-xl border bg-background shadow-sm overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                        {/* Checkbox */}
                        <TableHead className="w-[44px] pl-4">
                            <Checkbox aria-label="Selecionar todos" />
                        </TableHead>

                        {/* Paciente — sortable */}
                        <TableHead className={cn(COL_HEAD, "min-w-[180px]")}>
                            <button
                                type="button"
                                onClick={onSortByName}
                                className="flex items-center hover:text-foreground transition-colors cursor-pointer"
                                aria-label={`Ordenar por nome ${sortOrder === "asc" ? "Z-A" : "A-Z"}`}
                            >
                                Paciente
                                <SortIcon column="name" sortOrder={sortOrder} />
                            </button>
                        </TableHead>

                        <TableHead className={cn(COL_HEAD, "w-[110px]")}>
                            <span className="flex items-center">Status <ArrowUpDown className="ml-1.5 h-3 w-3 text-muted-foreground/60" /></span>
                        </TableHead>

                        <TableHead className={cn(COL_HEAD, "min-w-[200px]")}>
                            <span className="flex items-center">Contato <ArrowUpDown className="ml-1.5 h-3 w-3 text-muted-foreground/60" /></span>
                        </TableHead>

                        <TableHead className={cn(COL_HEAD, "w-[140px] hidden lg:table-cell")}>
                            <span className="flex items-center">Última Sessão <ArrowUpDown className="ml-1.5 h-3 w-3 text-muted-foreground/60" /></span>
                        </TableHead>

                        <TableHead className={cn(COL_HEAD, "w-[110px] hidden xl:table-cell")}>
                            <span className="flex items-center">Idade <ArrowUpDown className="ml-1.5 h-3 w-3 text-muted-foreground/60" /></span>
                        </TableHead>

                        <TableHead className={cn(COL_HEAD, "w-[110px] hidden xl:table-cell")}>
                            <span className="flex items-center">Gênero <ArrowUpDown className="ml-1.5 h-3 w-3 text-muted-foreground/60" /></span>
                        </TableHead>

                        <TableHead className={cn(COL_HEAD, "w-[110px] text-right pr-3")}>
                            Ações
                        </TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {isLoading ? (
                        <PatientsTableLoading rows={perPage} />
                    ) : patients.length > 0 ? (
                        patients.map((patient) => (
                            <PatientsTableRow key={patient.id} patient={patient} />
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={colSpan} className="py-20">
                                <div className="flex flex-col items-center justify-center gap-3 text-center">
                                    {hasActiveFilters ? (
                                        <>
                                            <div className="p-4 rounded-full bg-muted">
                                                <SearchX className="h-8 w-8 text-muted-foreground/40" />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium">Nenhum paciente encontrado</p>
                                                <p className="text-xs text-muted-foreground">Tente ajustar os filtros de busca</p>
                                            </div>
                                            <Button variant="outline" size="sm" onClick={onClearFilters}>
                                                Limpar filtros
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <div className="p-4 rounded-full bg-muted">
                                                <UserPlus className="h-8 w-8 text-muted-foreground/40" />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium">Nenhum paciente cadastrado</p>
                                                <p className="text-xs text-muted-foreground">Comece cadastrando seu primeiro paciente</p>
                                            </div>
                                            <Button size="sm" onClick={onRegister}>
                                                Cadastrar primeiro paciente
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
