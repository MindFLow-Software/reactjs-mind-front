import { Search, UserRoundPlus, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { RegisterPatients } from './register-patients'

export function PatientsTableFilters() {
    return (
        <div className="flex w-full items-center justify-between">
            {/* LADO ESQUERDO - FILTROS */}
            <form className="flex flex-wrap items-center gap-2">
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

            <Dialog>
                <DialogTrigger asChild className='cursor-pointer'>
                    <Button size="xs" className="gap-2">
                        <UserRoundPlus className="w-4 h-4" />
                        Cadastrar paciente
                    </Button>
                </DialogTrigger>
                <RegisterPatients />
            </Dialog>
        </div>
    )
}
