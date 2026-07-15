import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from '@/components/ui/card'

import './psychologists-activity-card.css'

type IPsychologistsActivityCard = {
  active: number
  inactive: number
}

export function PsychologistsActivityCard({
  active,
  inactive,
}: IPsychologistsActivityCard) {
  const total = active + inactive
  const activeRatio = total === 0 ? 0 : (active / total) * 100

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Atividade</CardTitle>
          <CardDescription>Ativos vs. inativos</CardDescription>
        </div>
      </CardHeader>

      <CardContent className="adb-psy-activity-content">
        <div className="adb-psy-activity-track">
          <div
            className="adb-psy-activity-fill"
            style={{ width: `${activeRatio}%` }}
          />
        </div>

        <ul className="adb-psy-activity-list">
          <li className="adb-psy-activity-item">
            <span className="adb-psy-activity-legend">
              <span className="adb-psy-activity-dot adb-psy-activity-dot--active" />
              Ativos
            </span>
            <span className="adb-psy-activity-count">{active}</span>
          </li>
          <li className="adb-psy-activity-item">
            <span className="adb-psy-activity-legend">
              <span className="adb-psy-activity-dot adb-psy-activity-dot--inactive" />
              Sem atividade (30d)
            </span>
            <span className="adb-psy-activity-count">{inactive}</span>
          </li>
        </ul>

        <p className="adb-psy-activity-total">
          Base total:{' '}
          <span className="adb-psy-activity-total-value">{total}</span>
        </p>
      </CardContent>
    </Card>
  )
}
