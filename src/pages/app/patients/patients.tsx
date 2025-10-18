import { Search, UserPen, X } from 'lucide-react'
import { Helmet } from 'react-helmet-async'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'

export function Patients() {
    return (
        <>
            <Helmet title="Pedidos" />

            <div className="flex flex-col gap-4">
                <h1 className="text-3xl font-bold tracking-tight">Pacientes</h1>
            </div>
            <div className="space-y-2.5">
                <form className="flex items-center gap-2">
                    <span className="text-sm font-semibold">Filtros:</span>
                    <Input placeholder="Nome do cliente" className="h-8 w-[320px]" />
                </form>

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-sky-50/60">
                                <TableHead className="w-[64px]" />
                                <TableHead className="w-[140px]">CPF</TableHead>
                                <TableHead className='w-[160px]'>Paciente</TableHead>
                                <TableHead className="w-[160px]">Data de Nascimento</TableHead>
                                <TableHead className="w-[140px]">Próxima Sessão</TableHead>
                                <TableHead className="w-[140px]">Status</TableHead>
                                <TableHead className="w-[164px]" />
                                <TableHead className="w-[132px]" />
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {Array.from({ length: 8 }).map((_, i) => (
                                <TableRow key={i}>
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
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </>
    )
}