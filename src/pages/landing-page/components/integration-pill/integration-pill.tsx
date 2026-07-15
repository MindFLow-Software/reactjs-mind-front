import { motion } from 'framer-motion'
import type { JSX } from 'react'
import './integration-pill.css'

export type PillDef = {
  id: string
  name: string
  description: string
  Icon: ({ size }: { size?: number }) => JSX.Element
  x: string
  y: string
  delay: number
  rotate?: number
  side: 'left' | 'right'
}

export function IntegrationPillCard({ pill }: { pill: PillDef }) {
  const Icon = pill.Icon
  return (
    <>
      <div className="lp-pill-icon">
        <Icon size={22} />
      </div>
      <div className="text-left">
        <p className="lp-pill-name">{pill.name}</p>
        <p className="lp-pill-desc">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
          <span className="text-emerald-600">{pill.description}</span>
        </p>
      </div>
    </>
  )
}

export function IntegrationPill({ pill }: { pill: PillDef }) {
  const isLeft = pill.side === 'left'

  return (
    <motion.div
      initial={{ opacity: 0, x: isLeft ? -28 : 28 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{
        delay: pill.delay,
        duration: 0.65,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="lp-pill absolute"
      style={{
        ...(isLeft ? { left: pill.x } : { right: pill.x }),
        top: pill.y,
        rotate: pill.rotate,
        minWidth: 190,
      }}
    >
      <IntegrationPillCard pill={pill} />
    </motion.div>
  )
}
