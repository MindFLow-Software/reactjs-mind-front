import { useEffect, useState, type ChangeEvent } from 'react'
import type { FieldValues } from 'react-hook-form'
import { useFormContext, useWatch } from 'react-hook-form'
import type { Matcher } from 'react-day-picker'
import { CalendarIcon } from 'lucide-react'

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form'
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
  InputGroupButton,
} from '@/components/ui/input-group'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { Time } from '@/utils/time'

import type { IFormFieldBaseProps } from '../types'

import './date-input.css'

type IDateInputProps<TFieldValues extends FieldValues> =
  IFormFieldBaseProps<TFieldValues> & {
    minDate?: Date
    maxDate?: Date
    disableFuture?: boolean
    className?: string
  }

function buildDisabledMatcher({
  minDate,
  maxDate,
  disableFuture,
}: {
  minDate?: Date
  maxDate?: Date
  disableFuture?: boolean
}): Matcher[] {
  const matchers: Matcher[] = []

  if (disableFuture) matchers.push({ after: Time.today })
  if (minDate) matchers.push({ before: minDate })
  if (maxDate) matchers.push({ after: maxDate })

  return matchers
}

export function DateInput<TFieldValues extends FieldValues>({
  name,
  label,
  description,
  placeholder = 'DD/MM/AAAA',
  disabled,
  minDate,
  maxDate,
  disableFuture,
  className,
}: IDateInputProps<TFieldValues>) {
  const { control } = useFormContext<TFieldValues>()
  const value = useWatch({ control, name })

  const [display, setDisplay] = useState('')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!value) return
    setDisplay(Time.toBrazilianFormat(value))
  }, [value])

  const selectedDate = Time.parse(value) ?? undefined
  const disabledMatcher = buildDisabledMatcher({
    minDate,
    maxDate,
    disableFuture,
  })

  function handleTextChange(
    event: ChangeEvent<HTMLInputElement>,
    onChange: (next: Date | null) => void,
  ) {
    const masked = Time.maskDateInput(event.target.value)
    setDisplay(masked)

    const { date } = Time.textToDate(masked)
    const isAllowed = date && (!disableFuture || !Time.isFuture(date))
    onChange(isAllowed ? date : null)
  }

  function handleCalendarSelect(
    date: Date | undefined,
    onChange: (next: Date | null) => void,
  ) {
    onChange(date ?? null)
    setOpen(false)
  }

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="gap-1">
          {label && <FormLabel className="di-input-label">{label}</FormLabel>}
          <FormControl>
            <InputGroup className={cn('di-root', className)}>
              <InputGroupInput
                value={display}
                onChange={(event) => handleTextChange(event, field.onChange)}
                placeholder={placeholder}
                inputMode="numeric"
                maxLength={10}
                disabled={disabled}
                autoComplete="off"
                className="tabular-nums"
              />
              <InputGroupAddon align="inline-end">
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <InputGroupButton
                      type="button"
                      size="icon-xs"
                      aria-label="Abrir calendário"
                      disabled={disabled}
                    >
                      <CalendarIcon />
                    </InputGroupButton>
                  </PopoverTrigger>
                  <PopoverContent align="end" className="w-auto p-0">
                    <Calendar
                      mode="single"
                      captionLayout="dropdown"
                      selected={selectedDate}
                      defaultMonth={selectedDate}
                      startMonth={minDate ?? Time.minDate}
                      endMonth={maxDate ?? Time.today}
                      disabled={disabledMatcher}
                      onSelect={(date) =>
                        handleCalendarSelect(date, field.onChange)
                      }
                    />
                  </PopoverContent>
                </Popover>
              </InputGroupAddon>
            </InputGroup>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
