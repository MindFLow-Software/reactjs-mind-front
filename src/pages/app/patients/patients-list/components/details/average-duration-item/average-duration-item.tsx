import './average-duration-item.css'
import { Timer } from 'lucide-react'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'

type IAverageDurationItem = {
  averageDuration: number | null
}

export function AverageDurationItem({ averageDuration }: IAverageDurationItem) {
  return (
    <Item variant="outline" className="pdd-avg-item">
      <ItemMedia variant="icon" className="pdd-avg-media">
        <Timer className="h-5 w-5" />
      </ItemMedia>
      <ItemContent>
        <ItemTitle className="pdd-avg-title">
          Tempo médio de atendimento
        </ItemTitle>
        <span className="pdd-avg-desc">
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
