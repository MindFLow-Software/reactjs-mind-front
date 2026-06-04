'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { Card } from '@/components/ui/card'
import { Clock, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SessionTimerProps {
  isActive: boolean
}

export function SessionTimer({ isActive }: SessionTimerProps) {
  const [seconds, setSeconds] = useState(0)
  const totalSecondsGoal = 3600

  useEffect(() => {
    let intervalId: number | undefined
    if (isActive) {
      intervalId = window.setInterval(
        () => setSeconds((prev) => prev + 1),
        1000,
      )
    } else {
      setSeconds(0)
    }
    return () => {
      if (intervalId) window.clearInterval(intervalId)
    }
  }, [isActive])

  const formatTime = (total: number) => {
    const h = Math.floor(total / 3600)
    const m = Math.floor((total % 3600) / 60)
    const s = total % 60

    if (h > 0) {
      return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
    }
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const isOvertime = seconds > totalSecondsGoal
  const radius = 85
  const circumference = 2 * Math.PI * radius

  const progress = Math.min(seconds / totalSecondsGoal, 1)
  const strokeDashoffset = circumference - progress * circumference

  if (!isActive) return null

  return (
    <Card
      className={cn(
        'w-full border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-card rounded-xl p-8 flex flex-col items-center justify-center transition-all duration-500',
        isOvertime && 'bg-amber-50/20',
      )}
    >
      <div className="relative z-10 w-full max-w-md flex flex-col items-center gap-6">
        <div className="flex justify-between w-full items-center px-4">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                'p-1.5 rounded-md transition-colors',
                isOvertime
                  ? 'bg-amber-100 text-amber-600'
                  : 'bg-primary/10 text-primary',
              )}
            >
              {isOvertime ? <AlertCircle size={14} /> : <Clock size={14} />}
            </div>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              {isOvertime ? 'Tempo Excedido' : 'Sessão Ativa'}
            </span>
          </div>
          <div className="flex items-center gap-2 bg-muted/50 px-3 py-1 rounded-full border border-border/40">
            <div
              className={cn(
                'w-1.5 h-1.5 rounded-full animate-pulse',
                isOvertime ? 'bg-amber-500' : 'bg-emerald-500',
              )}
            />
            <span className="text-[11px] font-bold text-foreground/70 tabular-nums">
              Agora: {format(new Date(), 'HH:mm')}
            </span>
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <svg
            className="transform -rotate-90 w-64 h-64 sm:w-72 sm:h-72"
            viewBox="0 0 200 200"
          >
            <circle
              cx="100"
              cy="100"
              r={radius}
              stroke="currentColor"
              strokeWidth="10"
              fill="transparent"
              className="text-muted/10"
            />
            <circle
              cx="100"
              cy="100"
              r={radius}
              stroke="currentColor"
              strokeWidth="10"
              fill="transparent"
              strokeDasharray={circumference}
              style={{
                strokeDashoffset,
                transition:
                  'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
              strokeLinecap="round"
              className={cn(
                'transition-colors duration-500',
                isOvertime ? 'text-amber-500' : 'text-primary',
              )}
            />
          </svg>

          <div className="absolute flex flex-col items-center justify-center text-center">
            <span
              className={cn(
                'text-6xl font-black tracking-tighter tabular-nums leading-none transition-colors duration-500',
                isOvertime ? 'text-amber-600' : 'text-foreground',
              )}
            >
              {formatTime(seconds)}
            </span>
            <div className="flex flex-col items-center mt-3 gap-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
                Duração Alvo
              </span>
              <div className="px-3 py-0.5 rounded-full bg-muted text-muted-foreground text-[11px] font-bold tabular-nums">
                60:00 min
              </div>
            </div>
          </div>
        </div>

        <div className="w-full space-y-3 px-4">
          <div className="flex justify-between items-end text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <span
                className={cn(isOvertime ? 'text-amber-600' : 'text-primary')}
              >
                {isOvertime ? '100%' : `${Math.floor(progress * 100)}%`}
              </span>
              {isOvertime ? 'Concluído (Meta)' : 'Progresso'}
            </span>
            <span>
              {isOvertime
                ? 'Sessão Prolongada'
                : `${Math.floor((totalSecondsGoal - seconds) / 60)} min restantes`}
            </span>
          </div>
          <div className="w-full h-2 bg-muted/30 rounded-full overflow-hidden border border-border/20">
            <div
              className={cn(
                'h-full transition-all duration-700 ease-out',
                isOvertime
                  ? 'bg-amber-500'
                  : 'bg-primary shadow-[0_0_15px_rgba(var(--primary),0.3)]',
              )}
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </div>
      </div>
    </Card>
  )
}
