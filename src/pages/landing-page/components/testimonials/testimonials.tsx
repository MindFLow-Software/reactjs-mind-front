import { motion } from 'framer-motion'
import { Star, MessageSquare } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { GridBackdrop } from '../shared/grid-backdrop/grid-backdrop'
import { GradientHighlight } from '../shared/gradient-highlight/gradient-highlight'
import { SectionHeading } from '../shared/section-heading/section-heading'
import './testimonials.css'

const TESTIMONIALS = [
  {
    name: 'Dra. Ana Clara',
    role: 'Psicóloga Clínica · SP',
    handle: '@ana.psi',
    content:
      'Finalmente consegui largar as planilhas do Excel. O MindFlush organizou minha agenda e meus prontuários em um só lugar. Indispensável!',
    image:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100',
  },
  {
    name: 'Paulo Roberto',
    role: 'Psicoterapeuta · RJ',
    handle: '@pauloroberto_psi',
    content:
      'A integração com o Google Agenda salvou minha vida. Meus pacientes recebem o link do Meet automaticamente. Sensacional!',
    image:
      'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=100&h=100',
  },
  {
    name: 'Mariana Souza',
    role: 'Psicóloga · BH',
    handle: '@marianapsico',
    content:
      'A parte financeira é incrível. Consigo ver exatamente quanto recebi e quem está pendente. O design é lindo e muito fácil de usar.',
    image:
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=100&h=100',
  },
  {
    name: 'Carlos Mendes',
    role: 'Psicólogo · DF',
    handle: '@carlos.terapia',
    content:
      'Eu tinha medo de usar software por causa da segurança dos dados. O MindFlush me passou total confiança com a criptografia. Recomendo.',
    image:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100',
  },
  {
    name: 'Fernanda Lima',
    role: 'Psicóloga · RS',
    handle: '@fer.psicologia',
    content:
      'O suporte é excelente e a plataforma não para de evoluir. É muito bom ver uma ferramenta feita pensando na nossa rotina.',
    image:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&h=100',
  },
  {
    name: 'Dr. Ricardo',
    role: 'Psicólogo · CE',
    handle: '@ricardo_psi',
    content:
      'Simplesmente a melhor plataforma para psicólogos hoje. O prontuário é super intuitivo e rápido de preencher entre as sessões.',
    image:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&h=100',
  },
]

function StarRating() {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
      ))}
    </div>
  )
}

function TestimonialCard({ data }: { data: (typeof TESTIMONIALS)[number] }) {
  return (
    <Card className="lp-tst-card">
      <div className="mb-3">
        <StarRating />
      </div>

      <p className="lp-tst-quote">&quot;{data.content}&quot;</p>

      <div className="flex items-center gap-3 border-t border-slate-50 pt-4">
        <img src={data.image} alt={data.name} className="lp-tst-avatar" />
        <div>
          <p className="lp-tst-name">{data.name}</p>
          <p className="lp-tst-role">{data.role}</p>
        </div>
      </div>
    </Card>
  )
}

export function TestimonialsSection() {
  const row2 = [...TESTIMONIALS].reverse()

  return (
    <section id="depoimentos" className="lp-tst-section">
      <GridBackdrop className="z-0" />
      <div className="lp-tst-glow" />

      <div className="container relative z-10 mx-auto mb-14 px-6 text-center md:px-8 lg:px-12">
        <SectionHeading
          badge={{ icon: MessageSquare, label: 'Depoimentos' }}
          heading={{
            className: 'lp-tst-heading',
            content: (
              <>
                Histórias reais de quem usa o{' '}
                <GradientHighlight>MindFlush.</GradientHighlight>
              </>
            ),
          }}
          subtitle={{
            className: 'lp-tst-subtitle',
            content:
              'Veja relatos de psicólogos que simplificaram a gestão do consultório e ganharam mais tempo para seus pacientes.',
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.7 }}
        className="relative z-10 flex flex-col gap-4"
      >
        <div className="lp-tst-fade-left" />
        <div className="lp-tst-fade-right" />

        <div className="flex overflow-hidden">
          <div className="lp-marquee flex min-w-full shrink-0 gap-4">
            {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
              <TestimonialCard key={`r1a-${i}`} data={t} />
            ))}
          </div>
          <div
            className="lp-marquee flex min-w-full shrink-0 gap-4"
            aria-hidden
          >
            {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
              <TestimonialCard key={`r1b-${i}`} data={t} />
            ))}
          </div>
        </div>

        <div className="flex overflow-hidden">
          <div className="lp-marquee-rev flex min-w-full shrink-0 gap-4">
            {[...row2, ...row2].map((t, i) => (
              <TestimonialCard key={`r2a-${i}`} data={t} />
            ))}
          </div>
          <div
            className="lp-marquee-rev flex min-w-full shrink-0 gap-4"
            aria-hidden
          >
            {[...row2, ...row2].map((t, i) => (
              <TestimonialCard key={`r2b-${i}`} data={t} />
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  )
}
