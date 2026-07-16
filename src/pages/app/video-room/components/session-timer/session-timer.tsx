'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { Card } from '@/components/ui/card'
import { Clock, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import './session-timer.css'

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
      className={cn('vr-timer-card', isOvertime && 'bg-amber-50/20')}
    >
      <div className="vr-timer-body">
        <div className="vr-timer-header">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                'vr-timer-status-icon',
                isOvertime
                  ? 'bg-amber-100 text-amber-600'
                  : 'bg-primary/10 text-primary',
              )}
            >
              {isOvertime ? <AlertCircle size={14} /> : <Clock size={14} />}
            </div>
            <span className="vr-timer-status-label">
              {isOvertime ? 'Tempo Excedido' : 'Sessão Ativa'}
            </span>
          </div>
          <div className="vr-timer-clock">
            <div
              className={cn(
                'w-1.5 h-1.5 rounded-full animate-pulse',
                isOvertime ? 'bg-amber-500' : 'bg-emerald-500',
              )}
            />
            <span className="vr-timer-clock-time">
              Agora: {format(new Date(), 'HH:mm')}
            </span>
          </div>
        </div>

        <div className="vr-timer-ring-wrap">
          <svg
            className="vr-timer-ring-svg"
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
                'vr-timer-ring-progress',
                isOvertime ? 'text-amber-500' : 'text-primary',
              )}
            />
          </svg>

          <div className="vr-timer-readout">
            <span
              className={cn(
                'vr-timer-readout-value',
                isOvertime ? 'text-amber-600' : 'text-foreground',
              )}
            >
              {formatTime(seconds)}
            </span>
            <div className="flex flex-col items-center mt-3 gap-1">
              <span className="vr-timer-goal-label">
                Duração Alvo
              </span>
              <div className="vr-timer-goal-value">
                60:00 min
              </div>
            </div>
          </div>
        </div>

        <div className="vr-timer-progress-row">
          <div className="vr-timer-progress-meta">
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
          <div className="vr-timer-progress-track">
            <div
              className={cn(
                'vr-timer-progress-fill',
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
