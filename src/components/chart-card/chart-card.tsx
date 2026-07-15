import type { ReactNode } from 'react'
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

export type IChartCardState = {
  isLoading: boolean
  isError: boolean
  isEmpty: boolean
}

export type IChartCardKeys<T> = {
  name: keyof T & string
  value: keyof T & string
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

type IChartCardRootProps = {
  state: IChartCardState
  onRetry?: () => void
  children: ReactNode
}

type IChartCardHeaderProps = {
  title: string
  description: string
  children?: ReactNode
}

type IChartCardTotalProps = {
  label: string
  value: number
}

type IChartCardBodyProps = {
  children: ReactNode
}

type IChartCardPieProps<T extends object> = {
  data: T[]
  colors: string[]
  keys: IChartCardKeys<T>
  children?: ReactNode
}

type IChartCardLegendProps<T extends object> = {
  data: T[]
  colors: string[]
  keys: IChartCardKeys<T>
}

type IChartCardEmptyProps = {
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

type IChartCardBarProps<T extends object> = {
  data: T[]
  keys: IChartCardKeys<T>
  bar?: IChartCardBarOptions
}

type IChartCardTimeSeriesBarProps<T extends { date: string } & object> = {
  data: T[]
  dataKey: keyof T & string
  color: string
}

type IChartCardTimeRangeOption<T extends string> = {
  value: T
  label: string
}

type IChartCardTimeRangeProps<T extends string> = {
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

function ChartCardRoot({ state, onRetry, children }: IChartCardRootProps) {
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
  children,
}: IChartCardHeaderProps) {
  return (
    <CardHeader className="cc-header">
      <div className="cc-header-text">
        <CardTitle className="cc-title">{title}</CardTitle>
        <CardDescription className="cc-description">
          {description}
        </CardDescription>
      </div>
      {children}
    </CardHeader>
  )
}

function ChartCardTimeRange<T extends string>({
  value,
  onChange,
  options,
}: IChartCardTimeRangeProps<T>) {
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

function ChartCardTotalHeader({ label, value }: IChartCardTotalProps) {
  return (
    <div className="cc-total">
      <span className="cc-total-label">{label}</span>
      <span className="cc-total-value">{value.toLocaleString()}</span>
    </div>
  )
}

function ChartCardTotalCenter({ label, value }: IChartCardTotalProps) {
  return (
    <div className="cc-total-center">
      <span className="cc-total-center-value">{value.toLocaleString()}</span>
      <span className="cc-total-center-label">{label}</span>
    </div>
  )
}

function ChartCardTotal({ label, value }: IChartCardTotalProps) {
  const slot = useContext(ChartCardSlotContext)

  if (slot === 'center')
    return <ChartCardTotalCenter label={label} value={value} />

  return <ChartCardTotalHeader label={label} value={value} />
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

function ChartCardBodyContent({ children }: IChartCardBodyProps) {
  const { state } = useContext(ChartCardContext)

  if (state.isLoading) return <ChartCardLoading />
  if (state.isError) return <ChartCardError />

  return <>{children}</>
}

function ChartCardBody({ children }: IChartCardBodyProps) {
  const { state } = useContext(ChartCardContext)

  if (state.isEmpty && !state.isLoading && !state.isError) return null

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
}: IChartCardPieProps<T>) {
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

function ChartCardBar<T extends object>({
  data,
  keys,
  bar,
}: IChartCardBarProps<T>) {
  const layout = bar?.layout ?? ChartCardBarLayout.VERTICAL
  const isHorizontal = layout === ChartCardBarLayout.HORIZONTAL

  const axes = isHorizontal ? (
    <>
      <XAxis dataKey={keys.value} type="number" allowDecimals={false} />
      <YAxis dataKey={keys.name} type="category" />
    </>
  ) : (
    <>
      <XAxis dataKey={keys.name} />
      <YAxis tickCount={5} allowDecimals={false} />
    </>
  )

  return (
    <div className="cc-bar-wrap">
      <ChartContainer config={{}} className="cc-bar-container">
        <BarChart data={data} layout={isHorizontal ? 'vertical' : 'horizontal'}>
          {axes}
          <Tooltip />
          <Bar
            dataKey={keys.value}
            fill={bar?.color ?? 'var(--chart-1)'}
            radius={BAR_RADIUS[layout]}
          />
        </BarChart>
      </ChartContainer>
    </div>
  )
}

function ChartCardTimeSeriesBar<T extends { date: string } & object>({
  data,
  dataKey,
  color,
}: IChartCardTimeSeriesBarProps<T>) {
  const config = useMemo<ChartConfig>(
    () => ({ [dataKey]: { color } }),
    [dataKey, color],
  )

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
        <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartContainer>
  )
}

function ChartCardLegend<T extends object>({
  data,
  colors,
  keys,
}: IChartCardLegendProps<T>) {
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

function ChartCardEmpty({ icon, title, subtitle }: IChartCardEmptyProps) {
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
