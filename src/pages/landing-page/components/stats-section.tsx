import { motion } from 'framer-motion'
import { ArrowUpRight, TrendingUp, Clock, Users, CalendarX } from 'lucide-react'
import { Link } from 'react-router-dom'
import { GridBackdrop } from './shared/grid-backdrop'
import { SectionBadge } from './shared/section-badge'
import { GradientHighlight } from './shared/gradient-highlight'
import { AvatarStack } from './shared/avatar-stack'
import { StatCard, type StatCardData } from './stat-card'
import { AVATARS, BRAND, BRAND_MUTED } from '../constants'
import './stats-section.css'

const STAT_CARDS: StatCardData[] = [
  {
    icon: Clock,
    value: '3h',
    label: 'Horas administrativas economizadas por semana',
    iconColor: '#0284c7',
    iconBg: '#E0F2FE',
  },
  {
    icon: Users,
    value: '94%',
    label: 'Taxa de retenção de pacientes na plataforma',
    iconColor: '#16a34a',
    iconBg: '#DCFCE7',
  },
]

export function StatsSection() {
  return (
    <section id="funcionalidades" className="lp-stats-section">
      <GridBackdrop className="z-0" />
      <div className="lp-stats-glow" />

      <div className="container relative z-10 mx-auto px-6 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="flex flex-col">
            <SectionBadge icon={TrendingUp} label="Resultados comprovados" />

            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: 0.08,
                duration: 0.7,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="lp-stats-heading lp-serif"
            >
              Mais tempo para cuidar{' '}
              <GradientHighlight underlineDelay={0.6}>
                dos seus pacientes.
              </GradientHighlight>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.18, duration: 0.6 }}
              className="lp-stats-subtitle"
            >
              Reduza a burocracia, aumente o faturamento e entregue uma
              experiência de alto nível para cada paciente — com muito menos
              esforço.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.26, duration: 0.5 }}
              className="mb-10"
            >
              <Link
                to="/sign-up"
                className="lp-stats-link group"
                style={{ color: BRAND }}
              >
                Ver demonstração completa
                <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.36, duration: 0.6 }}
              className="flex items-center gap-3.5"
            >
              <AvatarStack urls={AVATARS} size={30} imgClassName="shadow-sm" />
              <div>
                <p className="lp-stats-proof-name">+1.200 psicólogos</p>
                <p className="lp-stats-proof-sub">confiam no MindFlush</p>
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: 0.15,
                duration: 0.7,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="lp-stats-featured col-span-1 sm:col-span-2"
            >
              <div className="lp-stats-featured-glow" />
              <div
                className="lp-stats-featured-icon"
                style={{ background: BRAND_MUTED }}
              >
                <CalendarX
                  className="h-4 w-4"
                  style={{ color: BRAND }}
                  strokeWidth={2}
                />
              </div>
              <p className="lp-stats-featured-value lp-serif">89%</p>
              <p className="lp-stats-featured-label">
                Redução de faltas com lembretes automáticos via WhatsApp
              </p>
            </motion.div>

            {STAT_CARDS.map((card, i) => (
              <StatCard key={card.value} data={card} delay={0.28 + i * 0.1} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
