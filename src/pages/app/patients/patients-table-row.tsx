import { Search, UserPen, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { TableCell, TableRow } from '@/components/ui/table'

// interface PatitentsTableRow {}

export function PatitentsTableRow() {
    return (
        <TableRow>
            <TableCell>
                <Button variant="outline" size="xs">
                    <Search className="h-3 w-3" />
                    <span className="sr-only">Detalhes do paciente</span>
                </Button>
            </TableCell>

            <TableCell className="font-medium">12332112333</TableCell>
            <TableCell className="font-medium">Paulo Octavio de OliveiraStraforini</TableCell>
            <TableCell className="text-muted-foreground">há 3 dias</TableCell>
            <TableCell className="text-muted-foreground">em 2 dias</TableCell>

            <TableCell>
                <div className="flex items-center gap-2">
                    <span className="font-medium text-muted-foreground">Em acompanhamento</span>
                </div>
            </TableCell>
            <TableCell>
                <Button variant="outline" size="xs">
                    <UserPen className="mr-2 h-3 w-3" />
                    Editar
                </Button>
            </TableCell>
            <TableCell>
                <Button variant="ghost" size="xs">
                    <X className="mr-2 h-3 w-3" />
                    Excluir
                </Button>
            </TableCell>
        </TableRow>
    )
}