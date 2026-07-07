import { motion } from 'framer-motion'

function SparkleIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2 L13.5 10.5 L22 12 L13.5 13.5 L12 22 L10.5 13.5 L2 12 L10.5 10.5 Z" />
    </svg>
  )
}

const SPARKLES = [
  {
    size: 20,
    rotate: 360,
    duration: 20,
    className: 'top-28 left-[8%] text-blue-300/60 hidden lg:block',
  },
  {
    size: 14,
    rotate: -360,
    duration: 15,
    className: 'top-40 right-[10%] text-blue-400/50 hidden lg:block',
  },
  {
    size: 10,
    rotate: 360,
    duration: 25,
    className: 'top-64 left-[20%] text-blue-200/70 hidden xl:block',
  },
  {
    size: 16,
    rotate: -360,
    duration: 18,
    className: 'top-52 right-[22%] text-blue-300/50 hidden xl:block',
  },
]

export function HeroSparkles() {
  return (
    <>
      {SPARKLES.map(({ size, rotate, duration, className }, i) => (
        <motion.div
          key={i}
          animate={{ rotate }}
          transition={{ duration, repeat: Infinity, ease: 'linear' }}
          className={`absolute ${className}`}
        >
          <SparkleIcon size={size} />
        </motion.div>
      ))}
    </>
  )
}
