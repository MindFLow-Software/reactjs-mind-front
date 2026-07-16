'use client'

import { CalendarIcon } from 'lucide-react'
import { ptBR } from 'date-fns/locale'
import { type DateRange } from 'react-day-picker'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Time } from '@/utils/time'
import './date-picker-with-range.css'

type DatePickerWithRangeProps = {
  className?: string
  date: DateRange | undefined
  onDateChange: (date: DateRange | undefined) => void
}

function renderDateLabel(date: DateRange | undefined) {
  if (!date?.from) return <span>Selecione um período</span>

  if (!date.to) return Time.toBrazilianFormat(date.from)

  return `${Time.toBrazilianFormat(date.from)} - ${Time.toBrazilianFormat(date.to)}`
}

export function DatePickerWithRange({
  className,
  date,
  onDateChange,
}: DatePickerWithRangeProps) {
  return (
    <div className="grid gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={'outline'}
            className={cn(
              'pd-date-trigger',
              !date && 'text-muted-foreground',
              className,
            )}
          >
            <CalendarIcon className="mr-2 size-4" />
            {renderDateLabel(date)}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={onDateChange}
            numberOfMonths={2}
            locale={ptBR}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
