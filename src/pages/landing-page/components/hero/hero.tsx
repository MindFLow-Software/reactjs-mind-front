import { motion } from 'framer-motion'
import { GridBackdrop } from '../shared/grid-backdrop'
import { HeroSparkles } from './hero-sparkles'
import { HeroCopy } from './hero-copy'
import { DashboardMockup } from './dashboard-mockup'
import './hero.css'

export function HeroSection() {
  return (
    <section className="lp-hero-section">
      <GridBackdrop />
      <div className="lp-hero-glow" />
      <HeroSparkles />

      <div className="container relative z-10 mx-auto px-4 sm:px-6">
        <HeroCopy />

        <motion.div
          initial={{ opacity: 0, y: 48 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          className="relative px-0 sm:px-4 md:px-8"
        >
          <DashboardMockup />
          <div className="lp-hero-mockup-fade" />
        </motion.div>
      </div>
    </section>
  )
}
