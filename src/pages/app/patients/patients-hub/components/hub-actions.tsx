import { Download, MoreVertical, Plus, Printer, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function HubActions() {
  return (
    <div className="phd-actions">
      <Button variant="outline" size="sm" className="phd-action-export">
        <Download className="size-3.5" />
        <span className="hidden md:inline">Exportar</span>
      </Button>

      <Button size="sm" className="phd-action-primary">
        <Plus className="size-3.5" />
        <span>Nova Sessao</span>
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="phd-action-more">
            <MoreVertical className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem className="phd-menu-item">
            <Printer className="size-4" /> Imprimir prontuario
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="phd-menu-item-danger">
            <Trash2 className="size-4" /> Arquivar paciente
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
