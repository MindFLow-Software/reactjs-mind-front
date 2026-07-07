'use client'

import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  format,
  startOfToday,
  eachDayOfInterval,
  isSameDay,
  startOfWeek,
  endOfWeek,
  startOfYear,
  endOfYear,
  getYear,
  isAfter,
  isBefore,
  startOfDay,
} from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import {
  getDailySessionsMetrics,
  type DailySessionMetric,
} from '@/api/metrics/get-daily-sessions-metrics'
import { getProfile } from '@/api/auth/get-profile'
import './activity-heatmap.css'

export function ActivityHeatmap() {
  const today = startOfToday()
  const currentYear = getYear(today)

  const [selectedYear, setSelectedYear] = useState(currentYear)
  const [hoveredDay, setHoveredDay] = useState<{
    day: DailySessionMetric
    x: number
    y: number
  } | null>(null)

  const { data: profile } = useQuery({
    queryKey: ['psychologist-profile'],
    queryFn: getProfile,
  })

  // Garante que o intervalo seja SEMPRE o ano inteiro (Jan a Dez)
  const dateRange = useMemo(() => {
    const firstDay = startOfYear(new Date(selectedYear, 0, 1))
    const lastDay = endOfYear(new Date(selectedYear, 0, 1))
    return {
      start: startOfWeek(firstDay), // Começa no domingo da primeira semana
      end: endOfWeek(lastDay), // Termina no sábado da última semana
      apiStart: firstDay.toISOString(),
      apiEnd: lastDay.toISOString(),
    }
  }, [selectedYear])

  const { data: serverData, isLoading } = useQuery({
    queryKey: ['appointment-metrics-heatmap', selectedYear],
    queryFn: () =>
      getDailySessionsMetrics(dateRange.apiStart, dateRange.apiEnd),
  })

  const availableYears = useMemo(() => {
    if (!profile?.createdAt) return [currentYear]
    const creationYear = getYear(new Date(profile.createdAt))
    const years = []
    for (let y = currentYear; y >= creationYear; y--) {
      years.push(y)
    }
    return years
  }, [profile?.createdAt, currentYear])

  const { weeks, months } = useMemo(() => {
    const allDays = eachDayOfInterval({
      start: dateRange.start,
      end: dateRange.end,
    })
    const weeksArray: DailySessionMetric[][] = []
    const monthsArray: { name: string; colStart: number }[] = []

    let currentWeek: DailySessionMetric[] = []
    let lastMonth = -1

    allDays.forEach((date) => {
      const metric = serverData?.find((d) => isSameDay(new Date(d.date), date))
      const dayData: DailySessionMetric = {
        date: date.toISOString(),
        count: metric?.count || 0,
      }

      // Marcar posição dos meses
      if (date.getMonth() !== lastMonth && getYear(date) === selectedYear) {
        monthsArray.push({
          name: format(date, 'MMM', { locale: ptBR }),
          colStart: weeksArray.length,
        })
        lastMonth = date.getMonth()
      }

      currentWeek.push(dayData)

      if (date.getDay() === 6) {
        weeksArray.push(currentWeek)
        currentWeek = []
      }
    })

    return { weeks: weeksArray, months: monthsArray }
  }, [serverData, dateRange, selectedYear])

  const getColor = (count: number, dateStr: string) => {
    const date = new Date(dateStr)
    const isFuture = isAfter(date, today)
    const isOutsideSelectedYear = getYear(date) !== selectedYear
    const isBeforeCreation =
      profile?.createdAt &&
      isBefore(date, startOfDay(new Date(profile.createdAt)))

    if (isFuture || isOutsideSelectedYear || isBeforeCreation)
      return 'bg-slate-100/50 dark:bg-slate-800/20'
    if (count === 0) return 'bg-slate-100 dark:bg-slate-800'

    // Escala de azul conforme o seu print
    if (count <= 2) return 'bg-blue-200 dark:bg-blue-900/40'
    if (count <= 4) return 'bg-blue-400 dark:bg-blue-700/60'
    if (count <= 6) return 'bg-blue-500'
    return 'bg-blue-600'
  }

  if (isLoading) return <Skeleton className="h-[220px] w-full rounded-xl" />

  return (
    <div className="acc-heat-card">
      <div className="flex flex-col gap-8">
        {/* Header: Título e Seletor de Ano */}
        <div className="acc-heat-header">
          <div className="flex flex-col gap-1">
            <h3 className="acc-heat-title">Atividade de Sessões</h3>
            <p className="acc-heat-subtitle">
              Frequência diária de atendimentos no ano de {selectedYear}
            </p>
          </div>

          <div className="acc-heat-year-toggle">
            {availableYears.map((year) => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={cn(
                  'acc-heat-year-btn',
                  selectedYear === year
                    ? 'acc-heat-year-btn--active'
                    : 'acc-heat-year-btn--inactive',
                )}
              >
                {year}
              </button>
            ))}
          </div>
        </div>

        {/* Heatmap Grid */}
        <div className="w-full overflow-hidden">
          <div className="acc-heat-scroll">
            <div className="min-w-max flex flex-col gap-2">
              {/* Meses */}
              <div className="acc-heat-months-row">
                {months.map((month, i) => (
                  <span
                    key={i}
                    className="acc-heat-month-label"
                    style={{ left: `${month.colStart * 15}px` }}
                  >
                    {month.name}
                  </span>
                ))}
              </div>

              <div className="flex gap-4">
                {/* Dias da Semana */}
                <div className="acc-heat-weekdays">
                  <div className="acc-heat-weekday-row">Dom</div>
                  <div className="acc-heat-weekday-row" />
                  <div className="acc-heat-weekday-row">Ter</div>
                  <div className="acc-heat-weekday-row" />
                  <div className="acc-heat-weekday-row">Qui</div>
                  <div className="acc-heat-weekday-row" />
                  <div className="acc-heat-weekday-row">Sáb</div>
                </div>

                {/* Grid de Células */}
                <div className="flex gap-[5px]">
                  {weeks.map((week, weekIndex) => (
                    <div key={weekIndex} className="acc-heat-week-col">
                      {week.map((day, dayIndex) => {
                        const date = new Date(day.date)
                        const isInactive =
                          isAfter(date, today) || getYear(date) !== selectedYear

                        return (
                          <div
                            key={dayIndex}
                            className={cn(
                              'acc-heat-cell',
                              getColor(day.count, day.date),
                              !isInactive && 'acc-heat-cell--active',
                            )}
                            onMouseEnter={(e) => {
                              if (isInactive) return
                              const rect =
                                e.currentTarget.getBoundingClientRect()
                              setHoveredDay({
                                day,
                                x: rect.left + rect.width / 2,
                                y: rect.top,
                              })
                            }}
                            onMouseLeave={() => setHoveredDay(null)}
                          />
                        )
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer: Legenda */}
        <div className="acc-heat-footer">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="acc-heat-legend-label">Menos</span>
              <div className="flex gap-1">
                {[0, 2, 4, 6, 8].map((v) => (
                  <div
                    key={v}
                    className={cn(
                      'acc-heat-legend-swatch',
                      getColor(v, today.toISOString()),
                    )}
                  />
                ))}
              </div>
              <span className="acc-heat-legend-label">Mais</span>
            </div>
          </div>
          <p className="acc-heat-legend-note">
            * Dados sincronizados em tempo real
          </p>
        </div>
      </div>

      {/* Tooltip (Fixed Portal Style) */}
      {hoveredDay && (
        <div
          className="acc-heat-tooltip"
          style={{
            left: hoveredDay.x,
            top: hoveredDay.y - 12,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <div className="acc-heat-tooltip-box">
            <p className="acc-heat-tooltip-count">
              {hoveredDay.day.count}{' '}
              {hoveredDay.day.count === 1 ? 'sessão' : 'sessões'}
            </p>
            <p className="acc-heat-tooltip-date">
              {format(new Date(hoveredDay.day.date), "EEEE, d 'de' MMMM", {
                locale: ptBR,
              })}
            </p>
            <div className="acc-heat-tooltip-arrow" />
          </div>
        </div>
      )}
    </div>
  )
}
