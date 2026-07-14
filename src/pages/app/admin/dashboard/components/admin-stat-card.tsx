import type { ReactNode } from 'react'
import { AlertCircle } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import './admin-stat-card.css'

type AdminStatCardAccent = 'red' | 'blue' | 'amber'

interface AdminStatCardProps {
  icon: ReactNode
  accent: AdminStatCardAccent
  title: string
  subtitle: string
  query: {
    value: string | number | null
    isLoading: boolean
    isError: boolean
  }
}

export function AdminStatCard({
  icon,
  accent,
  title,
  subtitle,
  query,
}: AdminStatCardProps) {
  return (
    <Card className={cn('adb-stat-card', `adb-stat-card--${accent}`)}>
      <div className="relative z-10 flex flex-col">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className={cn('adb-stat-icon', `adb-stat-icon--${accent}`)}>
              {icon}
            </div>

            <div className="flex flex-col">
              <span className="adb-stat-title">{title}</span>
              <span className="adb-stat-subtitle">{subtitle}</span>
            </div>
          </div>
        </div>

        <Separator className="adb-stat-separator" />

        {query.isLoading ? (
          <div className="flex flex-col gap-2">
            <Skeleton className="h-10 w-28" />
            <Skeleton className="h-4 w-48" />
          </div>
        ) : query.isError ? (
          <div className="adb-stat-error">
            <AlertCircle className="size-4" />
            <span className="text-sm font-medium">Erro ao carregar dados</span>
          </div>
        ) : (
          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
              <span className="adb-stat-value">
                {query.value && typeof query.value === 'number'
                  ? query.value.toLocaleString('pt-BR')
                  : query.value}
              </span>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
