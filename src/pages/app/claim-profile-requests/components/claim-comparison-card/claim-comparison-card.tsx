import { Fragment } from 'react'

import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import './claim-comparison-card.css'

type ClaimComparisonAccent = 'requester' | 'profile'

interface ClaimComparisonField {
  label: string
  value: string | null | undefined
}

interface ClaimComparisonCardProps {
  title: string
  accent: ClaimComparisonAccent
  fields: ClaimComparisonField[]
}

export function ClaimComparisonCard({
  title,
  accent,
  fields,
}: ClaimComparisonCardProps) {
  return (
    <Card className="cpr-compare-card">
      <CardHeader className="p-0">
        <CardTitle className="cpr-compare-title">
          <span
            className={cn('cpr-compare-dot', `cpr-compare-dot-${accent}`)}
          />
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 p-0">
        {fields.map((field, index) => (
          <Fragment key={field.label}>
            {index > 0 && <Separator />}
            <div className="flex flex-col">
              <span className="cpr-compare-label">{field.label}</span>
              <span className="cpr-compare-value">{field.value}</span>
            </div>
          </Fragment>
        ))}
      </CardContent>
    </Card>
  )
}
