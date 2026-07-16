import type { ComponentProps, ReactNode } from 'react'
import { useMemo, useContext, createContext } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Loader2, RefreshCcw, AlertCircle } from 'lucide-react'

import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from '@/components/ui/card'

import {
  ChartTooltip,
  ChartContainer,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'

import {
  Select,
  SelectGroup,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from '@/components/ui/select'

import { Time } from '@/utils/time'

import './chart-card.css'
import { cn } from '@/lib/utils'

export type IChartCardState = {
  isLoading: boolean
  isError: boolean
  isEmpty: boolean
}

export type IChartCardKeys<T> = {
  name: keyof T & string
  value: keyof T & string
}

export type IChartCardPieDatum = {
  name: string
  count: number
}

export const CHART_CARD_PIE_KEYS: IChartCardKeys<IChartCardPieDatum> = {
  name: 'name',
  value: 'count',
}

type IChartCardContextValue = {
  state: IChartCardState
  onRetry?: () => void
}

type ChartCardSlot = 'header' | 'center'

const ChartCardContext = createContext<IChartCardContextValue>({
  state: { isLoading: false, isError: false, isEmpty: false },
})

const ChartCardSlotContext = createContext<ChartCardSlot>('header')

type IChartCardRoot = {
  state: IChartCardState
  onRetry?: () => void
  children: ReactNode
}

type IChartCardHeader = ComponentProps<'header'> & {
  title: string
  description: string
  icon?: ReactNode
  children?: ReactNode
}

type IChartCardTotal = ComponentProps<'div'> & {
  label: string
  value: number
}

type IChartCardBody = {
  children: ReactNode
}

type IChartCardPie<T extends object> = {
  data: T[]
  colors: string[]
  keys: IChartCardKeys<T>
  children?: ReactNode
}

type IChartCardLegend<T extends object> = {
  data: T[]
  colors: string[]
  keys: IChartCardKeys<T>
}

type IChartCardEmpty = {
  icon: ReactNode
  title: string
  subtitle: string
}

export enum ChartCardBarLayout {
  VERTICAL = 'VERTICAL',
  HORIZONTAL = 'HORIZONTAL',
}

type IChartCardBarOptions = {
  color?: string
  layout?: ChartCardBarLayout
}

type IChartCardBar<T extends object> = {
  data: T[]
  keys: IChartCardKeys<T>
  bar?: IChartCardBarOptions
}

export type IChartCardSeries<T> = {
  dataKey: keyof T & string
  color: string
  label?: string
}

type IChartCardTimeSeriesBar<T extends { date: string } & object> = {
  data: T[]
  series: readonly IChartCardSeries<T>[]
}

type IChartCardTimeRangeOption<T extends string> = {
  value: T
  label: string
}

type IChartCardTimeRange<T extends string> = {
  value: T
  onChange: (value: T) => void
  options: readonly IChartCardTimeRangeOption<T>[]
}

const BAR_RADIUS: Record<ChartCardBarLayout, [number, number, number, number]> =
  {
    [ChartCardBarLayout.VERTICAL]: [10, 10, 0, 0],
    [ChartCardBarLayout.HORIZONTAL]: [0, 10, 10, 0],
  }

function sumValues<T extends object>(data: T[], valueKey: keyof T & string) {
  return data.reduce((total, item) => total + Number(item[valueKey]), 0)
}

function ChartCardRoot({ state, onRetry, children }: IChartCardRoot) {
  const context = useMemo(() => ({ state, onRetry }), [state, onRetry])

  return (
    <ChartCardContext.Provider value={context}>
      <Card className="cc-card">{children}</Card>
    </ChartCardContext.Provider>
  )
}

function ChartCardHeader({
  title,
  description,
  icon,
  children,
  className,
}: IChartCardHeader) {
  return (
    <CardHeader className={cn('cc-header', className)}>
      <div className="cc-header-main">
        {icon}
        <div className="cc-header-text">
          <CardTitle className="cc-title">{title}</CardTitle>
          <CardDescription className="cc-description">
            {description}
          </CardDescription>
        </div>
      </div>
      {children}
    </CardHeader>
  )
}

function ChartCardTimeRange<T extends string>({
  value,
  onChange,
  options,
}: IChartCardTimeRange<T>) {
  return (
    <Select value={value} onValueChange={(next) => onChange(next as T)}>
      <SelectTrigger
        className="cc-select-trigger"
        aria-label="Selecionar período"
      >
        <SelectValue placeholder="Período" />
      </SelectTrigger>
      <SelectContent className="cc-select-content">
        <SelectGroup>
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className="cc-select-item"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

function ChartCardTotalHeader({ label, value, className }: IChartCardTotal) {
  return (
    <div className={cn('cc-total', className)}>
      <span className="cc-total-label">{label}</span>
      <span className="cc-total-value">{value.toLocaleString()}</span>
    </div>
  )
}

function ChartCardTotalCenter({ label, value }: IChartCardTotal) {
  return (
    <div className="cc-total-center">
      <span className="cc-total-center-value">{value.toLocaleString()}</span>
      <span className="cc-total-center-label">{label}</span>
    </div>
  )
}

function ChartCardTotal({ label, value, ...props }: IChartCardTotal) {
  const slot = useContext(ChartCardSlotContext)

  if (slot === 'center') {
    return <ChartCardTotalCenter label={label} value={value} />
  }

  return <ChartCardTotalHeader label={label} value={value} {...props} />
}

function ChartCardLoading() {
  return (
    <div className="cc-loading">
      <Loader2 className="cc-loading-icon" />
    </div>
  )
}

function ChartCardError() {
  const { onRetry } = useContext(ChartCardContext)

  return (
    <div className="cc-state">
      <div className="cc-state-icon cc-state-icon-error">
        <AlertCircle className="size-6" />
      </div>
      <p className="cc-state-title">Erro ao carregar dados</p>
      {onRetry && (
        <button onClick={onRetry} className="cc-retry-btn">
          <RefreshCcw size={12} /> Tentar novamente
        </button>
      )}
    </div>
  )
}

function ChartCardBodyContent({ children }: IChartCardBody) {
  const { state } = useContext(ChartCardContext)

  if (state.isLoading) return <ChartCardLoading />
  if (state.isError) return <ChartCardError />

  return <>{children}</>
}

function ChartCardBody({ children }: IChartCardBody) {
  return (
    <CardContent className="cc-body">
      <ChartCardBodyContent>{children}</ChartCardBodyContent>
    </CardContent>
  )
}

function ChartCardPie<T extends object>({
  data,
  colors,
  keys,
  children,
}: IChartCardPie<T>) {
  const {
    state: { isError, isLoading, isEmpty },
  } = useContext(ChartCardContext)

  if (isError || isLoading || isEmpty) return null

  const config = useMemo<ChartConfig>(() => {
    const entries = data.map(
      (item, index) =>
        [
          String(item[keys.name]),
          {
            label: String(item[keys.name]),
            color: colors[index % colors.length],
          },
        ] as const,
    )

    return Object.fromEntries(entries)
  }, [data, keys, colors])

  return (
    <ChartCardSlotContext.Provider value="center">
      <div className="cc-chart-wrap">
        <ChartContainer config={config} className="cc-chart-container">
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={data}
              dataKey={keys.value}
              nameKey={keys.name}
              innerRadius={65}
              outerRadius={90}
              stroke="var(--card)"
              paddingAngle={2}
            >
              {data.map((item, index) => (
                <Cell
                  key={String(item[keys.name])}
                  fill={colors[index % colors.length]}
                  className="cc-pie-cell"
                />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
        {children}
      </div>
    </ChartCardSlotContext.Provider>
  )
}

function ChartCardBar<T extends object>({ data, keys, bar }: IChartCardBar<T>) {
  const {
    state: { isError, isLoading, isEmpty },
  } = useContext(ChartCardContext)

  if (isError || isLoading || isEmpty) return null

  const layout = bar?.layout ?? ChartCardBarLayout.VERTICAL
  const isHorizontal = layout === ChartCardBarLayout.HORIZONTAL

  return (
    <ChartContainer config={{}} className="cc-bar-container">
      {isHorizontal ? (
        <BarChart data={data} layout="vertical">
          <XAxis dataKey={keys.value} type="number" allowDecimals={false} />
          <YAxis type="category" dataKey={keys.name} />
          <Tooltip />
          <Bar
            dataKey={keys.value}
            fill={bar?.color ?? 'var(--chart-1)'}
            radius={BAR_RADIUS[layout]}
          />
        </BarChart>
      ) : (
        <BarChart data={data} layout="horizontal">
          <XAxis dataKey={keys.name} />
          <YAxis tickCount={5} allowDecimals={false} />
          <Tooltip />
          <Bar
            dataKey={keys.value}
            fill={bar?.color ?? 'var(--chart-1)'}
            radius={BAR_RADIUS[layout]}
          />
        </BarChart>
      )}
    </ChartContainer>
  )
}

function ChartCardTimeSeriesBar<T extends { date: string } & object>({
  data,
  series,
}: IChartCardTimeSeriesBar<T>) {
  const {
    state: { isError, isLoading, isEmpty },
  } = useContext(ChartCardContext)

  if (isError || isLoading || isEmpty) return null

  const config = useMemo<ChartConfig>(() => {
    const entries = series.map(
      ({ dataKey, color, label }) => [dataKey, { color, label }] as const,
    )

    return Object.fromEntries(entries)
  }, [series])

  return (
    <ChartContainer config={config} className="cc-timeseries-container">
      <BarChart accessibilityLayer data={data} margin={{ left: 12, right: 12 }}>
        <CartesianGrid
          vertical={false}
          strokeDasharray="3 3"
          stroke="var(--border)"
        />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={32}
          stroke="var(--muted-foreground)"
          fontSize={12}
          tickFormatter={Time.toDayMonthAbbrev}
        />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              labelFormatter={Time.toDayMonthLong}
              indicator="dashed"
            />
          }
        />
        {series.map(({ dataKey, color }) => (
          <Bar
            key={dataKey}
            dataKey={dataKey}
            fill={color}
            radius={[4, 4, 0, 0]}
          />
        ))}
      </BarChart>
    </ChartContainer>
  )
}

function ChartCardLegend<T extends object>({
  data,
  colors,
  keys,
}: IChartCardLegend<T>) {
  const total = sumValues(data, keys.value) || 1

  return (
    <div className="cc-legend">
      {data.map((item, index) => {
        const percentage = ((Number(item[keys.value]) / total) * 100).toFixed(1)

        return (
          <div key={String(item[keys.name])} className="group cc-legend-item">
            <div className="cc-legend-dot-wrap">
              <div
                className="cc-legend-dot"
                style={{ backgroundColor: colors[index % colors.length] }}
              />
              <span className="cc-legend-label">{String(item[keys.name])}</span>
            </div>
            <span className="cc-legend-value">{percentage}%</span>
          </div>
        )
      })}
    </div>
  )
}

function ChartCardEmpty({ icon, title, subtitle }: IChartCardEmpty) {
  const { state } = useContext(ChartCardContext)

  if (state.isLoading || state.isError || !state.isEmpty) return null

  return (
    <div className="cc-state">
      <div className="cc-state-icon">{icon}</div>
      <p className="cc-state-title">{title}</p>
      <p className="cc-state-subtitle">{subtitle}</p>
    </div>
  )
}

export const ChartCard = Object.assign(ChartCardRoot, {
  Header: ChartCardHeader,
  TimeRange: ChartCardTimeRange,
  Total: ChartCardTotal,
  Body: ChartCardBody,
  Pie: ChartCardPie,
  Bar: ChartCardBar,
  TimeSeriesBar: ChartCardTimeSeriesBar,
  Legend: ChartCardLegend,
  Empty: ChartCardEmpty,
})
