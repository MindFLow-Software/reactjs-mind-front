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
import { Fragment, type ReactElement } from 'react'
import { AnamnesisSaveStatus, useAnamnesisContext } from '../anamnesis-context'

import './anamnesis-toolbar.css'

const STATUS_LABEL: Record<AnamnesisSaveStatus, string> = {
  [AnamnesisSaveStatus.SYNCED]: 'Salvo · há instantes',
  [AnamnesisSaveStatus.PENDING]: 'Sincronizando...',
  [AnamnesisSaveStatus.DRAFT]: 'Rascunho local',
}

type IToolbarItem = {
  id: number
  icon: ReactElement
  label: string
  marker: string
}

const TOOLBAR_CONFIG: IToolbarItem[] = [
  {
    id: 1,
    icon: <Bold className="size-3.5" />,
    label: 'Negrito',
    marker: '**',
  },
  {
    id: 2,
    icon: <Italic className="size-3.5" />,
    label: 'Itálico',
    marker: '*',
  },
  {
    id: 3,
    icon: <Underline className="size-3.5" />,
    label: 'Sublinhado',
    marker: '__',
  },
  { id: 4, icon: <List className="size-3.5" />, label: 'Lista', marker: '-' },
  {
    id: 5,
    icon: <ListOrdered className="size-3.5" />,
    label: 'Numerada',
    marker: '1.',
  },
  {
    id: 6,
    icon: <Quote className="size-3.5" />,
    label: 'Citação',
    marker: '> ',
  },
  {
    id: 7,
    icon: <MessageSquare className="size-3.5" />,
    label: 'Comentário',
    marker: '// ',
  },
]

export function AnamnesisToolbar() {
  const { saveStatus, onFormat } = useAnamnesisContext()

  return (
    <div className="ph-anamnesis-toolbar">
      <div className="ph-anamnesis-toolbar__buttons">
        {TOOLBAR_CONFIG.map((item) => (
          <Fragment key={item.id}>
            <ToolbarBtn
              onClick={() => onFormat(item.marker)}
              label={item.label}
            >
              {item.icon}
              <span className="ph-anamnesis-toolbar__btn-label">
                {item.label}
              </span>
            </ToolbarBtn>
            <div className="ph-anamnesis-toolbar__separator" />
          </Fragment>
        ))}
      </div>

      <div className="ph-anamnesis-toolbar__status">
        <span
          className={cn(
            'ph-anamnesis-toolbar__status-dot',
            saveStatus === AnamnesisSaveStatus.SYNCED
              ? 'ph-anamnesis-toolbar__status-dot--synced'
              : 'ph-anamnesis-toolbar__status-dot--pending',
          )}
        />
        <span className="ph-anamnesis-toolbar__status-label">
          {STATUS_LABEL[saveStatus]}
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
      className="ph-anamnesis-toolbar__btn"
    >
      {children}
    </Button>
  )
}
