import { Layers } from 'lucide-react'
import { GridBackdrop } from '../shared/grid-backdrop/grid-backdrop'
import { GradientHighlight } from '../shared/gradient-highlight/gradient-highlight'
import { SectionHeading } from '../shared/section-heading/section-heading'
import { ResourceCard, type ResourceCardData } from '../resource-card/resource-card'
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
          <SectionHeading
            badge={{ icon: Layers, label: 'Recursos' }}
            heading={{
              className: 'lp-res-heading',
              content: (
                <>
                  Tudo que você precisa,{' '}
                  <GradientHighlight>em um só lugar.</GradientHighlight>
                </>
              ),
            }}
            subtitle={{
              className: 'lp-res-subtitle',
              content:
                'Construído para psicólogos que querem exercer sua profissão com excelência — sem perder tempo com burocracia.',
            }}
          />
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
