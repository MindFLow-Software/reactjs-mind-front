import { motion } from "framer-motion"
import { Plug, ArrowRight } from "lucide-react"
import type { JSX } from "react"
import { Link } from "react-router-dom"

const BRAND = "#2563eb"
const BRAND_LIGHT = "#3b82f6"

function WhatsAppIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="13" fill="#25D366" />
      <path
        d="M21.8 19.4c-.3-.15-1.8-.9-2.08-.99-.28-.1-.48-.15-.68.15-.2.3-.78.99-.96 1.19-.18.2-.36.22-.66.07-.3-.15-1.26-.46-2.4-1.48-.9-.8-1.5-1.78-1.68-2.08-.18-.3-.02-.46.14-.61.14-.14.3-.36.44-.54.14-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.68-1.64-.93-2.24-.24-.59-.5-.51-.68-.52-.18-.01-.38-.01-.58-.01-.2 0-.52.07-.8.38-.27.3-1.04 1.02-1.04 2.49 0 1.47 1.07 2.89 1.22 3.09.15.2 2.1 3.2 5.1 4.49.71.31 1.27.49 1.7.63.72.23 1.37.2 1.88.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.34Z"
        fill="white"
      />
    </svg>
  )
}

function GoogleCalendarIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <rect x="5" y="5" width="22" height="22" rx="3" fill="white" stroke="#e5e7eb" />
      <rect x="5" y="5" width="22" height="8" rx="3" fill="#4285F4" />
      <rect x="5" y="10" width="22" height="3" fill="#4285F4" />
      <text x="16" y="23" textAnchor="middle" fontSize="9" fontWeight="700" fill="#4285F4" fontFamily="sans-serif">16</text>
      <rect x="10" y="3" width="2" height="5" rx="1" fill="#4285F4" />
      <rect x="20" y="3" width="2" height="5" rx="1" fill="#4285F4" />
    </svg>
  )
}

function GoogleMeetIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <rect x="4" y="9" width="15" height="14" rx="2.5" fill="#00897B" />
      <path d="M19 14l9-5v14l-9-5V14Z" fill="#00BFA5" />
    </svg>
  )
}

function PixIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path fillRule="evenodd" clipRule="evenodd"
        d="M20.5 6.1a3.6 3.6 0 0 0-5.1 0l-1.1 1.1 3.2 3.2.5-.5a2.1 2.1 0 1 1 3 3l-.5.5 1.5 1.5 1.1-1.1a3.6 3.6 0 0 0 0-5.1l-2.6-2.6Z"
        fill="#32BCAD"
      />
      <path fillRule="evenodd" clipRule="evenodd"
        d="M11.5 25.9a3.6 3.6 0 0 0 5.1 0l1.1-1.1-3.2-3.2-.5.5a2.1 2.1 0 1 1-3-3l.5-.5-1.5-1.5-1.1 1.1a3.6 3.6 0 0 0 0 5.1l2.6 2.6Z"
        fill="#32BCAD"
      />
      <path fillRule="evenodd" clipRule="evenodd"
        d="M6.1 11.5a3.6 3.6 0 0 0 0 5.1l1.1 1.1 3.2-3.2-.5-.5a2.1 2.1 0 1 1 3-3l.5.5 1.5-1.5-1.1-1.1a3.6 3.6 0 0 0-5.1 0l-2.6 2.6Z"
        fill="#32BCAD"
      />
      <path fillRule="evenodd" clipRule="evenodd"
        d="M25.9 20.5a3.6 3.6 0 0 0 0-5.1l-1.1-1.1-3.2 3.2.5.5a2.1 2.1 0 1 1-3 3l-.5-.5-1.5 1.5 1.1 1.1a3.6 3.6 0 0 0 5.1 0l2.6-2.6Z"
        fill="#32BCAD"
      />
      <circle cx="16" cy="16" r="2" fill="#32BCAD" />
    </svg>
  )
}

function CfpIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <rect x="4" y="4" width="24" height="24" rx="5" fill="#EA580C" />
      <path
        d="M16 8c-2.2 0-4 1.8-4 4v1h-1a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-7a1 1 0 0 0-1-1h-1v-1c0-2.2-1.8-4-4-4Zm0 2a2 2 0 0 1 2 2v1h-4v-1a2 2 0 0 1 2-2Zm0 7a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z"
        fill="white"
      />
    </svg>
  )
}

function LgpdIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <rect x="4" y="4" width="24" height="24" rx="5" fill="#0369A1" />
      <path
        d="M16 7.5l7 2.6V16c0 3.9-3 7.5-7 8.4-4-.9-7-4.5-7-8.4v-5.9l7-2.6Z"
        stroke="white" strokeWidth="1.5" strokeLinejoin="round" fill="white" fillOpacity="0.15"
      />
      <path d="M13.5 16l1.8 1.8 3.5-3.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

type PillDef = {
  id: string
  name: string
  description: string
  Icon: ({ size }: { size?: number }) => JSX.Element
  x: string
  y: string
  delay: number
  rotate?: number
  side: "left" | "right"
}

const PILLS: PillDef[] = [
  {
    id: "whatsapp",
    name: "WhatsApp",
    description: "Lembretes automáticos",
    Icon: WhatsAppIcon,
    x: "70%",
    y: "14%",
    delay: 0.25,
    rotate: -1.5,
    side: "left",
  },
  {
    id: "google-calendar",
    name: "Google Calendar",
    description: "Agenda sincronizada",
    Icon: GoogleCalendarIcon,
    x: "30%",
    y: "46%",
    delay: 0.38,
    rotate: 1,
    side: "left",
  },
  {
    id: "pix",
    name: "PIX & Pagamentos",
    description: "Cobranças automáticas",
    Icon: PixIcon,
    x: "70%",
    y: "74%",
    delay: 0.52,
    rotate: -0.8,
    side: "left",
  },
  {
    id: "google-meet",
    name: "Google Meet",
    description: "Sessões por vídeo",
    Icon: GoogleMeetIcon,
    x: "70%",
    y: "14%",
    delay: 0.32,
    rotate: 1.2,
    side: "right",
  },
  {
    id: "cfp",
    name: "Padrão CFP",
    description: "Prontuários conformes",
    Icon: CfpIcon,
    x: "30%",
    y: "46%",
    delay: 0.46,
    rotate: -1,
    side: "right",
  },
  {
    id: "lgpd",
    name: "LGPD",
    description: "Dados protegidos",
    Icon: LgpdIcon,
    x: "70%",
    y: "74%",
    delay: 0.60,
    rotate: 0.8,
    side: "right",
  },
]

function IntegrationPill({ pill }: { pill: PillDef }) {
  const Icon = pill.Icon
  const isLeft = pill.side === "left"

  return (
    <motion.div
      initial={{ opacity: 0, x: isLeft ? -28 : 28 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: pill.delay, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      className="absolute flex items-center gap-3 bg-white border border-slate-200/80 rounded-2xl px-4 py-3 shadow-[0_4px_20px_rgba(0,0,0,0.07)] hover:shadow-[0_6px_28px_rgba(37,99,235,0.12)] transition-shadow duration-300"
      style={{
        ...(isLeft ? { left: pill.x } : { right: pill.x }),
        top: pill.y,
        rotate: pill.rotate,
        minWidth: 190,
      }}
    >
      <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 shadow-sm">
        <Icon size={22} />
      </div>
      <div>
        <p className="text-[13.5px] font-semibold text-slate-800 leading-none mb-[5px]">{pill.name}</p>
        <p className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
          <span className="text-emerald-600">{pill.description}</span>
        </p>
      </div>
    </motion.div>
  )
}

export function IntegrationsSection() {
  const leftPills = PILLS.filter((p) => p.side === "left")
  const rightPills = PILLS.filter((p) => p.side === "right")

  return (
    <section
      id="integracoes"
      className="relative overflow-hidden border-t border-slate-100 bg-[#F7F9FF] scroll-mt-20"
    >
      {/* Grid background */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(37,99,235,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.05) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 70% 60% at 50% 40%, rgba(37,99,235,0.07) 0%, transparent 70%)",
        }}
      />

      {/* Inner container with relative positioning for pills */}
      <div className="relative z-10 min-h-[560px] flex items-center">

        {/* Left pills column */}
        <div className="absolute inset-y-0 left-0 w-[280px] hidden lg:block">
          {leftPills.map((pill) => (
            <IntegrationPill key={pill.id} pill={pill} />
          ))}
        </div>

        {/* Right pills column */}
        <div className="absolute inset-y-0 right-0 w-[280px] hidden lg:block">
          {rightPills.map((pill) => (
            <IntegrationPill key={pill.id} pill={pill} />
          ))}
        </div>

        {/* Center content */}
        <div className="w-full flex flex-col items-center text-center px-4 py-20 lg:py-28">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-3.5 py-1.5 text-[12px] font-semibold text-blue-600 shadow-sm">
              <span
                className="h-4 w-4 rounded-md flex items-center justify-center shrink-0"
                style={{ background: BRAND }}
              >
                <Plug className="h-2.5 w-2.5 text-white" strokeWidth={2.5} />
              </span>
              Integrações
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-[clamp(30px,4vw,54px)] font-semibold tracking-tight text-slate-900 leading-[1.15] mb-5 max-w-[580px]"
            style={{ fontFamily: "'Lora', serif" }}
          >
            Conecta com as ferramentas{" "}
            <span className="relative inline-block">
              <em
                className="not-italic"
                style={{
                  background: `linear-gradient(135deg, ${BRAND} 0%, ${BRAND_LIGHT} 100%)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                que você já usa.
              </em>
              <motion.span
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.65, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="absolute bottom-[3px] -left-1 -right-1 h-[30%] rounded-sm origin-left -z-10"
                style={{ background: "rgba(37,99,235,0.12)" }}
              />
            </span>
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.18, duration: 0.6 }}
            className="text-[15.5px] font-light leading-relaxed text-slate-500 mb-9 max-w-[420px]"
          >
            Nada de mudar sua rotina. O MindFlush se encaixa no seu fluxo de trabalho — do agendamento ao pagamento, tudo conectado e automático.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.26, duration: 0.55 }}
          >
            <Link
              to="/sign-up"
              className="group inline-flex items-center gap-2 text-white text-[14.5px] font-semibold px-7 py-3.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5"
              style={{
                background: `linear-gradient(135deg, ${BRAND} 0%, ${BRAND_LIGHT} 100%)`,
                boxShadow: `0 4px 20px rgba(37,99,235,0.35), 0 1px 4px rgba(37,99,235,0.2)`,
              }}
            >
              Explorar integrações
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </motion.div>

          {/* Mobile grid */}
          <div className="lg:hidden grid grid-cols-1 gap-3 mt-12 w-full max-w-[420px]">
            {PILLS.map((pill, i) => {
              const Icon = pill.Icon
              return (
                <motion.div
                  key={pill.id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-center gap-3 bg-white border border-slate-200/80 rounded-2xl px-4 py-3 shadow-sm"
                >
                  <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                    <Icon size={22} />
                  </div>
                  <div className="text-left">
                    <p className="text-[13.5px] font-semibold text-slate-800 leading-none mb-[5px]">{pill.name}</p>
                    <p className="flex items-center gap-1.5 text-[11px] font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                      <span className="text-emerald-600">{pill.description}</span>
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
