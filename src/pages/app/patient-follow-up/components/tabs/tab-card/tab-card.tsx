import type { ReactNode } from 'react'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import './tab-card.css'

type ITabCard = {
  title: string
  description: string
  action?: ReactNode
  children: ReactNode
}

export function TabCard({ title, description, action, children }: ITabCard) {
  return (
    <Card className="ftc-card">
      <CardHeader className="ftc-card__head">
        <div className="ftc-card__title-wrap">
          <CardTitle className="ftc-card__title">{title}</CardTitle>
          <CardDescription className="ftc-card__subtitle">
            {description}
          </CardDescription>
        </div>
        {action}
      </CardHeader>
      <CardContent className="ftc-card__body">{children}</CardContent>
    </Card>
  )
}
