import { Timer } from 'lucide-react'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'

interface AverageDurationItemProps {
  averageDuration: number | null
}

export function AverageDurationItem({
  averageDuration,
}: AverageDurationItemProps) {
  return (
    <Item variant="outline" className="pdd-avg-item">
      <ItemMedia variant="icon" className="text-sky-600">
        <Timer className="h-5 w-5" />
      </ItemMedia>
      <ItemContent>
        <ItemTitle className="text-sm font-semibold">
          Tempo médio de atendimento
        </ItemTitle>
        <span className="text-xs text-muted-foreground">
          Média baseada em sessões finalizadas
        </span>
      </ItemContent>
      <ItemActions>
        <div className="text-right">
          <span className="pdd-avg-value">{averageDuration || 0} min</span>
        </div>
      </ItemActions>
    </Item>
  )
}
