import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import { BRAND } from '../../../constants'
import './section-badge.css'

interface SectionBadgeProps {
  icon: LucideIcon
  label: string
}

export function SectionBadge({ icon: Icon, label }: SectionBadgeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="mb-6"
    >
      <span className="lp-badge">
        <span className="lp-badge-icon" style={{ background: BRAND }}>
          <Icon className="h-2.5 w-2.5 text-white" strokeWidth={2.5} />
        </span>
        {label}
      </span>
    </motion.div>
  )
}
