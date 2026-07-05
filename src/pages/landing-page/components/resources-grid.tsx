import { motion } from 'framer-motion'
import { Layers } from 'lucide-react'
import { GridBackdrop } from './shared/grid-backdrop'
import { SectionBadge } from './shared/section-badge'
import { GradientHighlight } from './shared/gradient-highlight'
import { ResourceCard, type ResourceCardData } from './resource-card'
import './resources-grid.css'

const CARDS: ResourceCardData[] = [
  {
    tag: 'Produtividade',
    image: '/mind3.png',
    title: 'Menos burocracia,\nmais escuta',
    description:
      'Criamos uma plataforma invisível e intuitiva que cuida da gestão, agenda e financeiro para que sua atenção fique 100% no paciente.',
    href: '/sign-up',
  },
  {
    tag: 'Design',
    image: '/mind5.png',
    title: 'Design invisível,\ngestão poderosa',
    description:
      'Diga adeus aos sistemas travados e complexos. O MindFlush foi desenhado para fluir naturalmente — automatizando a burocracia com poucos toques.',
    href: '/sign-up',
  },
]

export function ResourcesGrid() {
  return (
    <section id="recursos" className="lp-res-section">
      <GridBackdrop className="z-0" />
      <div className="lp-res-glow" />

      <div className="container relative z-10 mx-auto px-6 md:px-8 lg:px-12">
        <div className="mb-14 flex flex-col items-center text-center">
          <SectionBadge icon={Layers} label="Recursos" />

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lp-res-heading lp-serif"
          >
            Tudo que você precisa,{' '}
            <GradientHighlight>em um só lugar.</GradientHighlight>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.18, duration: 0.6 }}
            className="lp-res-subtitle"
          >
            Construído para psicólogos que querem exercer sua profissão com
            excelência — sem perder tempo com burocracia.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {CARDS.map((card, i) => (
            <ResourceCard key={card.title} data={card} delay={0.12 + i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  )
}
