import type { ITimeSeriesPoint } from '@/types/dashboard/time-series-point'

import type { ISessionsVolume, ISessionsVolumePoint } from './types'

function toDateKey(iso: string): string {
  return iso.slice(0, 10)
}

function indexByDate(points: ITimeSeriesPoint[]): Map<string, number> {
  return new Map(points.map((point) => [toDateKey(point.date), point.value]))
}

export function mergeSessionsVolume({
  completed,
  cancelled,
  rescheduled,
}: ISessionsVolume): ISessionsVolumePoint[] {
  const cancelledByDate = indexByDate(cancelled)
  const rescheduledByDate = indexByDate(rescheduled)

  return completed.map((point) => {
    const key = toDateKey(point.date)

    return {
      date: point.date,
      completed: point.value,
      cancelled: cancelledByDate.get(key) ?? 0,
      rescheduled: rescheduledByDate.get(key) ?? 0,
    }
  })
}
