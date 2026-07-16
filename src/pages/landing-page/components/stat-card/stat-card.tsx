import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import './stat-card.css'

export type StatCardData = {
  icon: LucideIcon
  value: string
  label: string
  iconColor: string
  iconBg: string
}

type StatCardProps = {
  data: StatCardData
  delay: number
}

export function StatCard({ data, delay }: StatCardProps) {
  const { icon: Icon, value, label, iconColor, iconBg } = data

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      className="lp-stat-card"
    >
      <div className="lp-stat-icon" style={{ background: iconBg }}>
        <Icon
          className="h-4 w-4"
          style={{ color: iconColor }}
          strokeWidth={2}
        />
      </div>
      <p className="lp-stat-value lp-serif">{value}</p>
      <p className="lp-stat-label">{label}</p>
    </motion.div>
  )
}
