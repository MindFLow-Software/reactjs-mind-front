import { useMemo, useState } from 'react'
import { subDays, startOfDay, endOfDay } from 'date-fns'

const DAYS_BY_RANGE: Record<string, number> = { '7d': 7, '30d': 30, '90d': 90 }

interface UseAdminChartTimeRangeOptions {
  endDate: Date | undefined
}

export function useAdminChartTimeRange({
  endDate,
}: UseAdminChartTimeRangeOptions) {
  const [timeRange, setTimeRange] = useState('30d')

  const { startDateToFetch, endDateToFetch } = useMemo(() => {
    const referenceDate = endDate ? new Date(endDate) : new Date()
    const daysToSubtract = DAYS_BY_RANGE[timeRange] ?? 30

    return {
      startDateToFetch: startOfDay(subDays(referenceDate, daysToSubtract)),
      endDateToFetch: endOfDay(referenceDate),
    }
  }, [timeRange, endDate])

  return { timeRange, setTimeRange, startDateToFetch, endDateToFetch }
}
