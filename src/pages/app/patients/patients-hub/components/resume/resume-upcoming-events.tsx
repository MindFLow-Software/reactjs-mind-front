import { CalendarClock, Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export function ResumeUpcomingEvents() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950/30">
              <CalendarClock className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-sm font-semibold">
                Próximos eventos
              </CardTitle>
              <CardDescription className="text-[11px]">
                Agendamentos confirmados
              </CardDescription>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 gap-1 text-xs text-blue-600 hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-950/30 cursor-pointer"
          >
            <Plus className="h-3 w-3" />
            Agendar
          </Button>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="pt-0">
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted/40">
            <CalendarClock className="h-5 w-5 text-muted-foreground/40" />
          </div>
          <p className="text-sm font-semibold text-foreground">
            Sem próximos agendamentos
          </p>
          <p className="mt-1 max-w-[220px] text-xs text-muted-foreground">
            Agende uma nova sessão para retomar o acompanhamento.
          </p>
          <Button
            size="sm"
            className="mt-4 h-8 gap-1.5 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            Agendar agora
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
