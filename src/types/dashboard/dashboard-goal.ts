export type IDashboardGoal = {
  label: 'sessions' | 'hours' | 'active-patients'
  current: number
  target: number
  percent: number
}
