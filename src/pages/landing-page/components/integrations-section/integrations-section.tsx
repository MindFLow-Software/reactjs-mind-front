import { motion } from 'framer-motion'
import { Plug, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { GridBackdrop } from '../shared/grid-backdrop/grid-backdrop'
import { GradientHighlight } from '../shared/gradient-highlight/gradient-highlight'
import { SectionHeading } from '../shared/section-heading/section-heading'
import {
  IntegrationPill,
  IntegrationPillCard,
  type PillDef,
} from '../integration-pill/integration-pill'
import {
  CfpIcon,
  GoogleCalendarIcon,
  GoogleMeetIcon,
  LgpdIcon,
  PixIcon,
  WhatsAppIcon,
} from '../integration-icons/integration-icons'
import './integrations-section.css'

const PILLS: PillDef[] = [
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    description: 'Lembretes automáticos',
    Icon: WhatsAppIcon,
    x: '70%',
    y: '14%',
    delay: 0.25,
    rotate: -1.5,
    side: 'left',
  },
  {
    id: 'google-calendar',
    name: 'Google Calendar',
    description: 'Agenda sincronizada',
    Icon: GoogleCalendarIcon,
    x: '30%',
    y: '46%',
    delay: 0.38,
    rotate: 1,
    side: 'left',
  },
  {
    id: 'pix',
    name: 'PIX & Pagamentos',
    description: 'Cobranças automáticas',
    Icon: PixIcon,
    x: '70%',
    y: '74%',
    delay: 0.52,
    rotate: -0.8,
    side: 'left',
  },
  {
    id: 'google-meet',
    name: 'Google Meet',
    description: 'Sessões por vídeo',
    Icon: GoogleMeetIcon,
    x: '70%',
    y: '14%',
    delay: 0.32,
    rotate: 1.2,
    side: 'right',
  },
  {
    id: 'cfp',
    name: 'Padrão CFP',
    description: 'Prontuários conformes',
    Icon: CfpIcon,
    x: '30%',
    y: '46%',
    delay: 0.46,
    rotate: -1,
    side: 'right',
  },
  {
    id: 'lgpd',
    name: 'LGPD',
    description: 'Dados protegidos',
    Icon: LgpdIcon,
    x: '70%',
    y: '74%',
    delay: 0.6,
    rotate: 0.8,
    side: 'right',
  },
]

export function IntegrationsSection() {
  const leftPills = PILLS.filter((p) => p.side === 'left')
  const rightPills = PILLS.filter((p) => p.side === 'right')

  return (
    <section id="integracoes" className="lp-int-section">
      <GridBackdrop className="z-0" />
      <div className="lp-int-glow" />

      <div className="relative z-10 flex min-h-[560px] items-center">
        <div className="lp-pill-col-left">
          {leftPills.map((pill) => (
            <IntegrationPill key={pill.id} pill={pill} />
          ))}
        </div>

        <div className="lp-pill-col-right">
          {rightPills.map((pill) => (
            <IntegrationPill key={pill.id} pill={pill} />
          ))}
        </div>

        <div className="flex w-full flex-col items-center px-4 py-20 text-center lg:py-28">
          <SectionHeading
            badge={{ icon: Plug, label: 'Integrações' }}
            heading={{
              className: 'lp-int-heading',
              content: (
                <>
                  Conecta com as ferramentas{' '}
                  <GradientHighlight>que você já usa.</GradientHighlight>
                </>
              ),
            }}
            subtitle={{
              className: 'lp-int-subtitle',
              content:
                'Nada de mudar sua rotina. O MindFlush se encaixa no seu fluxo de trabalho — do agendamento ao pagamento, tudo conectado e automático.',
            }}
          />

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.26, duration: 0.55 }}
          >
            <Link to="/sign-up" className="lp-int-cta group">
              Explorar integrações
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </motion.div>

          <div className="mt-12 grid w-full max-w-[420px] grid-cols-1 gap-3 lg:hidden">
            {PILLS.map((pill, i) => (
              <motion.div
                key={pill.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: i * 0.06,
                  duration: 0.5,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="lp-pill-mobile"
              >
                <IntegrationPillCard pill={pill} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
