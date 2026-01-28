'use client'

import * as React from 'react'
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from 'lucide-react'
import { DayButton, DayPicker, getDefaultClassNames } from 'react-day-picker'

import { cn } from '@/lib/utils'
import { Button, buttonVariants } from '@/components/ui/button'

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = 'label',
  buttonVariant = 'ghost',
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>['variant']
}) {
  const defaultClassNames = getDefaultClassNames()

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        'bg-background group/calendar p-4 [--cell-size:--spacing(9)] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent',
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className,
      )}
      captionLayout={captionLayout}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString('default', { month: 'short' }),
        ...formatters,
      }}
      classNames={{
        root: cn('w-fit', defaultClassNames.root),
        months: cn(
          'flex gap-6 flex-col md:flex-row relative',
          defaultClassNames.months,
        ),
        month: cn('flex flex-col w-full gap-5', defaultClassNames.month),
        nav: cn(
          'flex items-center gap-1 w-full absolute top-0 inset-x-0 justify-between',
          defaultClassNames.nav,
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          'size-9 aria-disabled:opacity-30 p-0 select-none transition-all duration-200 hover:bg-accent/80 active:scale-95',
          defaultClassNames.button_previous,
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          'size-9 aria-disabled:opacity-30 p-0 select-none transition-all duration-200 hover:bg-accent/80 active:scale-95',
          defaultClassNames.button_next,
        ),
        month_caption: cn(
          'flex items-center justify-center h-(--cell-size) w-full px-(--cell-size)',
          defaultClassNames.month_caption,
        ),
        dropdowns: cn(
          'w-full flex items-center text-sm font-semibold justify-center h-(--cell-size) gap-2',
          defaultClassNames.dropdowns,
        ),
        dropdown_root: cn(
          'relative has-focus:border-primary/50 border border-input/60 shadow-sm has-focus:ring-primary/20 has-focus:ring-[3px] rounded-lg bg-background/50 backdrop-blur-sm transition-all duration-200 hover:border-primary/30 hover:bg-accent/50',
          defaultClassNames.dropdown_root,
        ),
        dropdown: cn(
          'absolute bg-popover inset-0 opacity-0 cursor-pointer',
          defaultClassNames.dropdown,
        ),
        caption_label: cn(
          'select-none font-semibold tracking-tight',
          captionLayout === 'label'
            ? 'text-sm'
            : 'rounded-lg pl-3 pr-1.5 flex items-center gap-1.5 text-sm h-9 [&>svg]:text-muted-foreground/70 [&>svg]:size-3.5 [&>svg]:transition-transform [&>svg]:duration-200 hover:[&>svg]:text-foreground',
          defaultClassNames.caption_label,
        ),
        table: 'w-full border-collapse',
        weekdays: cn('flex', defaultClassNames.weekdays),
        weekday: cn(
          'text-muted-foreground/80 rounded-md flex-1 font-medium text-xs select-none uppercase tracking-wider',
          defaultClassNames.weekday,
        ),
        week: cn('flex w-full mt-1.5', defaultClassNames.week),
        week_number_header: cn(
          'select-none w-(--cell-size)',
          defaultClassNames.week_number_header,
        ),
        week_number: cn(
          'text-xs select-none text-muted-foreground/60 font-medium',
          defaultClassNames.week_number,
        ),
        day: cn(
          'relative w-full h-full p-0.5 text-center [&:first-child[data-selected=true]_button]:rounded-l-lg [&:last-child[data-selected=true]_button]:rounded-r-lg group/day aspect-square select-none',
          defaultClassNames.day,
        ),
        range_start: cn(
          'rounded-l-lg bg-primary/10',
          defaultClassNames.range_start,
        ),
        range_middle: cn('rounded-none bg-primary/5', defaultClassNames.range_middle),
        range_end: cn('rounded-r-lg bg-primary/10', defaultClassNames.range_end),
        today: cn(
          'relative before:absolute before:inset-1 before:rounded-lg before:border-2 before:border-primary/40 before:pointer-events-none',
          defaultClassNames.today,
        ),
        outside: cn(
          'text-muted-foreground/40 aria-selected:text-muted-foreground/60',
          defaultClassNames.outside,
        ),
        disabled: cn(
          'text-muted-foreground/30 opacity-50 cursor-not-allowed',
          defaultClassNames.disabled,
        ),
        hidden: cn('invisible', defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => {
          return (
            <div
              data-slot="calendar"
              ref={rootRef}
              className={cn(className)}
              {...props}
            />
          )
        },
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === 'left') {
            return (
              <ChevronLeftIcon className={cn('size-4', className)} {...props} />
            )
          }

          if (orientation === 'right') {
            return (
              <ChevronRightIcon
                className={cn('size-4', className)}
                {...props}
              />
            )
          }

          return (
            <ChevronDownIcon className={cn('size-4', className)} {...props} />
          )
        },
        DayButton: CalendarDayButton,
        WeekNumber: ({ children, ...props }) => {
          return (
            <td {...props}>
              <div className="flex size-(--cell-size) items-center justify-center text-center">
                {children}
              </div>
            </td>
          )
        },
        ...components,
      }}
      {...props}
    />
  )
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const defaultClassNames = getDefaultClassNames()

  const ref = React.useRef<HTMLButtonElement>(null)
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString()}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        'transition-all duration-200 data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground data-[selected-single=true]:shadow-md data-[selected-single=true]:shadow-primary/25 data-[range-middle=true]:bg-primary/10 data-[range-middle=true]:text-foreground data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground data-[range-start=true]:shadow-md data-[range-start=true]:shadow-primary/25 data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground data-[range-end=true]:shadow-md data-[range-end=true]:shadow-primary/25 group-data-[focused=true]/day:border-primary group-data-[focused=true]/day:ring-primary/30 dark:hover:text-accent-foreground flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 leading-none font-medium group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:ring-[3px] data-[range-end=true]:rounded-lg data-[range-end=true]:rounded-r-lg data-[range-middle=true]:rounded-none data-[range-start=true]:rounded-lg data-[range-start=true]:rounded-l-lg [&>span]:text-xs [&>span]:opacity-70 hover:bg-accent/60 active:scale-95 rounded-lg',
        defaultClassNames.day,
        className,
      )}
      {...props}
    />
  )
}

export { Calendar, CalendarDayButton }
