import { ShieldCheck } from 'lucide-react'

import { cn } from '@/lib/utils'

import './security-notice.css'

type ISecurityNoticeVariant = 'success' | 'info'

type ISecurityNotice = {
  description: string
  title?: string
  variant?: ISecurityNoticeVariant
  className?: string
}

export function SecurityNotice({
  description,
  title,
  variant = 'success',
  className,
}: ISecurityNotice) {
  return (
    <div
      className={cn(
        'sn-root',
        variant === 'success' ? 'sn-success' : 'sn-info',
        className,
      )}
    >
      <ShieldCheck className="sn-icon" />
      <div>
        {title && <h3 className="sn-title">{title}</h3>}
        <p className="sn-description">{description}</p>
      </div>
    </div>
  )
}
