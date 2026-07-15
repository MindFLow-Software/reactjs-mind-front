import type { ReactNode } from 'react'
import { useMemo, useContext, createContext } from 'react'
import { Cell, Pie, PieChart } from 'recharts'
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

function ChartCardHeader({ title, description }: IChartCardHeaderProps) {
  return (
    <CardHeader className="cc-header">
      <CardTitle className="cc-title">{title}</CardTitle>
      <CardDescription className="cc-description">
        {description}
      </CardDescription>
    </CardHeader>
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
  Total: ChartCardTotal,
  Body: ChartCardBody,
  Pie: ChartCardPie,
  Legend: ChartCardLegend,
  Empty: ChartCardEmpty,
})
