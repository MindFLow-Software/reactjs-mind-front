import { Skeleton } from "@/components/ui/skeleton"
import { TableCell, TableRow } from "@/components/ui/table"

interface PatientsTableLoadingProps {
    rows?: number
}

export function PatientsTableLoading({ rows = 10 }: PatientsTableLoadingProps) {
    return (
        <>
            {Array.from({ length: rows }).map((_, i) => (
                <TableRow key={`skeleton-${i}`} className="hover:bg-transparent">
                    {/* Checkbox */}
                    <TableCell className="pl-4 w-[44px]">
                        <Skeleton className="h-4 w-4 rounded" />
                    </TableCell>
                    {/* Paciente */}
                    <TableCell>
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                            <div className="space-y-1.5">
                                <Skeleton className="h-3.5 w-32" />
                                <Skeleton className="h-2.5 w-24" />
                            </div>
                        </div>
                    </TableCell>
                    {/* Status */}
                    <TableCell>
                        <Skeleton className="h-6 w-16 rounded-full" />
                    </TableCell>
                    {/* Contato */}
                    <TableCell>
                        <div className="space-y-1.5">
                            <Skeleton className="h-3 w-32" />
                            <Skeleton className="h-3 w-40" />
                        </div>
                    </TableCell>
                    {/* Última Sessão */}
                    <TableCell className="hidden lg:table-cell">
                        <Skeleton className="h-3 w-20" />
                    </TableCell>
                    {/* Idade */}
                    <TableCell className="hidden xl:table-cell">
                        <div className="space-y-1.5">
                            <Skeleton className="h-3.5 w-14" />
                            <Skeleton className="h-2.5 w-20" />
                        </div>
                    </TableCell>
                    {/* Gênero */}
                    <TableCell className="hidden xl:table-cell">
                        <Skeleton className="h-6 w-20 rounded-full" />
                    </TableCell>
                    {/* Ações */}
                    <TableCell className="pr-3">
                        <div className="flex items-center justify-end gap-1">
                            <Skeleton className="h-8 w-8 rounded-md" />
                            <Skeleton className="h-8 w-8 rounded-md" />
                            <Skeleton className="h-8 w-8 rounded-md" />
                        </div>
                    </TableCell>
                </TableRow>
            ))}
        </>
    )
}
