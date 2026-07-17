import { cn } from '@/lib/utils'

import './field-row.css'

type IFieldRow = {
  label: string
  value: React.ReactNode
  last?: boolean
}

export function FieldRow({ label, value, last }: IFieldRow) {
  return (
    <div className={cn('fr-row', !last && 'fr-row--bordered')}>
      <span className="fr-row__label">{label}</span>
      <div className="fr-row__value">{value}</div>
    </div>
  )
}
