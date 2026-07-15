import './patients-table-empty.css'
import { SearchX, UserPlus } from 'lucide-react'
import type { ElementType } from 'react'

import { Button } from '@/components/ui/button'
import { TableCell, TableRow } from '@/components/ui/table'

type IPatientsTableEmpty = {
  filters: { active?: boolean; onClear?: () => void }
  onRegister?: () => void
}

type IEmptyCopy = {
  icon: ElementType
  title: string
  description: string
  action: string
  variant: 'outline' | 'default'
}

const FILTERED_COPY: IEmptyCopy = {
  icon: SearchX,
  title: 'Nenhum paciente encontrado',
  description: 'Tente ajustar os filtros de busca',
  action: 'Limpar filtros',
  variant: 'outline',
}

const BLANK_COPY: IEmptyCopy = {
  icon: UserPlus,
  title: 'Nenhum paciente cadastrado',
  description: 'Comece cadastrando seu primeiro paciente',
  action: 'Cadastrar primeiro paciente',
  variant: 'default',
}

export function PatientsTableEmpty({
  filters,
  onRegister,
}: IPatientsTableEmpty) {
  const copy = filters.active ? FILTERED_COPY : BLANK_COPY
  const onAction = filters.active ? filters.onClear : onRegister
  const Icon = copy.icon

  return (
    <TableRow>
      <TableCell colSpan={8} className="ptbe-cell">
        <div className="ptbe-body">
          <div className="ptbe-icon-box">
            <Icon className="ptbe-icon" />
          </div>
          <div className="ptbe-text">
            <p className="ptbe-title">{copy.title}</p>
            <p className="ptbe-description">{copy.description}</p>
          </div>
          <Button
            size="sm"
            variant={copy.variant}
            onClick={onAction}
            className="ptbe-action"
          >
            {copy.action}
          </Button>
        </div>
      </TableCell>
    </TableRow>
  )
}
