import { CalendarX } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function MonthCancellationsAmountCard() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-base font-semibold">
          Sessões canceladas (mês)
          <CalendarX className="size-5 text-teal-500 dar:text-teal-400" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        <span className="text-2xl font-bold tracking-tight">5</span>
        <p className="text-xs text-muted-foreground">
          <span className="text-red-500 dark:text-red-400">-8%</span> em
          relação ao mês anterior
        </p>
      </CardContent>
    </Card>
  )
}
