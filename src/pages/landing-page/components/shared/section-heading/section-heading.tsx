import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'

import { SectionBadge } from '../section-badge/section-badge'

interface SectionHeadingBadge {
  icon: LucideIcon
  label: string
}

interface SectionHeadingBlock {
  content: ReactNode
  className: string
}

interface SectionHeadingProps {
  badge: SectionHeadingBadge
  heading: SectionHeadingBlock
  subtitle: SectionHeadingBlock
}

export function SectionHeading({
  badge,
  heading,
  subtitle,
}: SectionHeadingProps) {
  return (
    <>
      <SectionBadge icon={badge.icon} label={badge.label} />

      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.08, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className={`${heading.className} lp-serif`}
      >
        {heading.content}
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.18, duration: 0.6 }}
        className={subtitle.className}
      >
        {subtitle.content}
      </motion.p>
    </>
  )
}
