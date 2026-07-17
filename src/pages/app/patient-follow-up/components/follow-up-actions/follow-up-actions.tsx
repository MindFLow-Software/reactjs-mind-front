import { Download, MoreVertical, Plus, Printer, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import './follow-up-actions.css'

export function FollowUpActions() {
  return (
    <div className="pfu-actions">
      <Button
        variant="outline"
        size="sm"
        className="pfu-action-export"
        disabled
      >
        <Download className="size-3.5" />
        <span className="hidden md:inline">Exportar</span>
      </Button>

      <Button size="sm" className="pfu-action-primary" disabled>
        <Plus className="size-3.5" />
        <span>Nova Sessao</span>
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="pfu-action-more">
            <MoreVertical className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem className="pfu-menu-item" disabled>
            <Printer className="size-4" /> Imprimir prontuario
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="pfu-menu-item-danger" disabled>
            <Trash2 className="size-4" /> Arquivar paciente
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
