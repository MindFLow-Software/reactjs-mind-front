import { ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'
import './security-notice.css'

type SecurityNoticeVariant = 'success' | 'info'

interface SecurityNoticeProps {
  description: string
  title?: string
  variant?: SecurityNoticeVariant
  className?: string
}

export function SecurityNotice({
  description,
  title,
  variant = 'success',
  className,
}: SecurityNoticeProps) {
  return (
    <div
      className={cn('security-notice', `security-notice-${variant}`, className)}
    >
      <ShieldCheck className="security-notice-icon" />
      <div>
        {title && <h3 className="security-notice-title">{title}</h3>}
        <p className="security-notice-description">{description}</p>
      </div>
    </div>
  )
}
