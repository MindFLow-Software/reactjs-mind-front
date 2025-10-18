import { Search, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

export function PatientsTableFilters() {
    return (
        <form className="flex items-center gap-2">
            <span className="text-sm font-semibold">Filtros:</span>
            <Input placeholder="CPF do paciente" className="h-8 w-auto" />
            <Input placeholder="Nome do paciente" className="h-8 w-[320px]" />
            <Select defaultValue="all">
                <SelectTrigger className="h-8 w-[200px] cursor-pointer">
                    <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Todos os status</SelectItem>
                    <SelectItem value="active">Em acompanhamento</SelectItem>
                    <SelectItem value="scheduled">Sessão agendada</SelectItem>
                    <SelectItem value="completed">Sessão concluída</SelectItem>
                    <SelectItem value="paused">Em pausa</SelectItem>
                    <SelectItem value="discharged">Alta terapêutica</SelectItem>
                </SelectContent>
            </Select>
            <Button variant="secondary" size="xs" type="submit">
                <Search className="mr-2 h-4 w-4" />
                Aplicar filtros
            </Button>
            <Button variant="outline" size="xs" type="button">
                <X className="mr-2 h-4 w-4" />
                Limpar filtros
            </Button>
        </form>
    )
}
