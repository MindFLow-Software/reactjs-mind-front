export function getGreeting(): string {
  const h = new Date().getHours()
  if (h >= 5 && h < 12) return 'Bom dia'
  if (h >= 12 && h < 18) return 'Boa tarde'
  return 'Boa noite'
}

export function formatTime(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  if (hours === 0) return `${minutes}m`
  if (minutes === 0) return `${hours}h`
  return `${hours}h ${minutes}m`
}

export function calcGrowthPercentage(
  current: number,
  previous: number,
): number {
  if (previous === 0) return current > 0 ? 100 : 0
  return Math.round(((current - previous) / previous) * 100)
}

export function calcDailyAverage(values: number[]): number {
  if (values.length === 0) return 0
  const total = values.reduce((acc, value) => acc + value, 0)
  return Math.round((total / values.length) * 10) / 10
}

export function sumDailyCounts(series: { count: number }[]): number {
  return series.reduce((total, point) => total + point.count, 0)
}

export function calcSessionsGrowth(series: { count: number }[]): number {
  if (series.length < 2) return 0
  const mid = Math.floor(series.length / 2)
  const previous = sumDailyCounts(series.slice(0, mid))
  const current = sumDailyCounts(series.slice(mid))
  return calcGrowthPercentage(current, previous)
}
