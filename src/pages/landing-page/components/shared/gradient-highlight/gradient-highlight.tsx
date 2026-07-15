import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import './gradient-highlight.css'

interface GradientHighlightProps {
  children: ReactNode
  underlineDelay?: number
}

export function GradientHighlight({
  children,
  underlineDelay = 0.65,
}: GradientHighlightProps) {
  return (
    <span className="relative inline-block">
      <em className="lp-gradient-text not-italic">{children}</em>
      <motion.span
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{
          delay: underlineDelay,
          duration: 0.9,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="lp-gradient-underline"
      />
    </span>
  )
}
