import { cn } from '@/lib/utils'

export interface CardSectionProps {
  icon: React.ReactNode
  iconBg: string
  title: string
  subtitle: string
  action?: React.ReactNode
  children: React.ReactNode
}

export function CardSection({
  icon,
  iconBg,
  title,
  subtitle,
  action,
  children,
}: CardSectionProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center gap-3 mb-1 pb-4 border-b border-border/40">
        <div
          className={cn(
            'flex size-9 shrink-0 items-center justify-center rounded-lg',
            iconBg,
          )}
        >
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground leading-tight">
            {title}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
        </div>
        {action}
      </div>
      <div>{children}</div>
    </div>
  )
}
