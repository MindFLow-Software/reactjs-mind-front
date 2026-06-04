import { Button } from '@/components/ui/button'
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Quote,
  MessageSquare,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface AnamnesisToolbarProps {
  onFormat: (marker: string) => void
  onList: (prefix: string, numbered?: boolean) => void
  saveStatus: 'synced' | 'pending' | 'draft'
}

export function AnamnesisToolbar({
  onFormat,
  onList,
  saveStatus,
}: AnamnesisToolbarProps) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-xl border border-border/50 bg-muted/30 px-3 py-2">
      <div className="flex flex-wrap items-center gap-1">
        <ToolbarBtn onClick={() => onFormat('**')} label="Negrito">
          <Bold className="h-3.5 w-3.5" />
          <span className="text-xs">Negrito</span>
        </ToolbarBtn>
        <ToolbarBtn onClick={() => onFormat('*')} label="Itálico">
          <Italic className="h-3.5 w-3.5" />
          <span className="text-xs">Itálico</span>
        </ToolbarBtn>
        <ToolbarBtn onClick={() => onFormat('__')} label="Sublinhado">
          <Underline className="h-3.5 w-3.5" />
          <span className="text-xs">Sublinhado</span>
        </ToolbarBtn>
        <div className="mx-1 h-4 w-px bg-border/60" />
        <ToolbarBtn onClick={() => onList('-')} label="Lista">
          <List className="h-3.5 w-3.5" />
          <span className="text-xs">Lista</span>
        </ToolbarBtn>
        <ToolbarBtn onClick={() => onList('1.', true)} label="Numerada">
          <ListOrdered className="h-3.5 w-3.5" />
          <span className="text-xs">Numerada</span>
        </ToolbarBtn>
        <div className="mx-1 h-4 w-px bg-border/60" />
        <ToolbarBtn onClick={() => onFormat('> ')} label="Citação">
          <Quote className="h-3.5 w-3.5" />
          <span className="text-xs">Citação</span>
        </ToolbarBtn>
        <ToolbarBtn onClick={() => onFormat('// ')} label="Comentário">
          <MessageSquare className="h-3.5 w-3.5" />
          <span className="text-xs">Comentário</span>
        </ToolbarBtn>
      </div>

      {/* Save status */}
      <div className="flex shrink-0 items-center gap-1.5">
        <span
          className={cn(
            'h-1.5 w-1.5 rounded-full',
            saveStatus === 'synced' ? 'bg-emerald-500' : 'bg-amber-400',
          )}
        />
        <span className="text-[11px] text-muted-foreground whitespace-nowrap">
          {saveStatus === 'synced'
            ? 'Salvo · há instantes'
            : saveStatus === 'pending'
              ? 'Sincronizando...'
              : 'Rascunho local'}
        </span>
      </div>
    </div>
  )
}

function ToolbarBtn({
  onClick,
  label,
  children,
}: {
  onClick: () => void
  label: string
  children: React.ReactNode
}) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      aria-label={label}
      className="h-7 gap-1 px-2 text-muted-foreground hover:text-foreground hover:bg-background/80 cursor-pointer"
    >
      {children}
    </Button>
  )
}
