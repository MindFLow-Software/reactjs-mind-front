import { motion } from "framer-motion"
import { ArrowUpRight, TrendingUp, Clock, Users, CalendarX } from "lucide-react"
import { Link } from "react-router-dom"

const BRAND = "#2563eb"
const BRAND_LIGHT = "#3b82f6"
const BRAND_MUTED = "#EFF6FF"

const STAT_CARDS = [
  {
    id: "featured",
    icon: CalendarX,
    label: "Redução de faltas com lembretes automáticos",
    value: "89%",
    iconColor: BRAND,
    iconBg: BRAND_MUTED,
    featured: true,
  },
  {
    id: "conversions",
    icon: Clock,
    label: "Horas administrativas recuperadas por semana",
    value: "3h",
    iconColor: "#0284c7",
    iconBg: "#E0F2FE",
    featured: false,
  },
  {
    id: "efficiency",
    icon: TrendingUp,
    label: "Aumento médio no faturamento mensal",
    value: "2×",
    iconColor: "#16a34a",
    iconBg: "#DCFCE7",
    featured: false,
  },
]

const AVATARS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&h=64",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=64&h=64",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=64&h=64",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=64&h=64",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=64&h=64",
]

function StatCard({
  card,
  index,
}: {
  card: (typeof STAT_CARDS)[number]
  index: number
}) {
  const Icon = card.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.2 + index * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`relative flex flex-col rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-md ${
        card.featured ? "row-span-1" : ""
      }`}
    >
      <div
        className="mb-4 w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: card.iconBg }}
      >
        <Icon className="w-4.5 h-4.5" style={{ color: card.iconColor }} strokeWidth={2} />
      </div>

      <p
        className="text-[clamp(52px,5vw,68px)] font-semibold leading-none tracking-tight text-slate-900 mb-3"
        style={{ fontFamily: "'Lora', serif" }}
      >
        {card.value}
      </p>

      <p className="text-[13.5px] font-light leading-relaxed text-slate-500">{card.label}</p>
    </motion.div>
  )
}

export function StatsSection() {
  return (
    <section
      id="funcionalidades"
      className="relative overflow-hidden border-t border-slate-100 bg-[#F7F9FF] py-24 scroll-mt-20"
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
        className="absolute right-0 top-0 w-[600px] h-[500px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 80% 20%, rgba(37,99,235,0.08) 0%, transparent 65%)",
        }}
      />

      <div className="container relative z-10 mx-auto px-6 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20 items-center">

          {/* Left — text column */}
          <div className="flex flex-col">
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
                  <TrendingUp className="h-2.5 w-2.5 text-white" strokeWidth={2.5} />
                </span>
                Resultados comprovados
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="text-[clamp(30px,3.8vw,46px)] font-semibold tracking-tight text-slate-900 leading-[1.15] mb-5"
              style={{ fontFamily: "'Lora', serif" }}
            >
              Mais tempo para cuidar{" "}
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
                  dos seus pacientes.
                </em>
                <motion.span
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
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
              className="text-[15.5px] font-light leading-relaxed text-slate-500 mb-8 max-w-[400px]"
            >
              Reduza a burocracia, aumente o faturamento e
              entregue uma experiência de alto nível para cada paciente — com muito menos esforço.
            </motion.p>

            {/* CTA link */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.26, duration: 0.5 }}
              className="mb-10"
            >
              <Link
                to="/sign-up"
                className="group inline-flex items-center gap-1.5 text-[14px] font-semibold transition-colors duration-200"
                style={{ color: BRAND }}
              >
                Ver demonstração completa
                <ArrowUpRight
                  className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            </motion.div>

            {/* Social proof */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.36, duration: 0.6 }}
              className="flex items-center gap-3.5"
            >
              <div className="flex">
                {AVATARS.map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    width={30}
                    height={30}
                    loading="lazy"
                    alt=""
                    className="w-[30px] h-[30px] rounded-full border-2 border-white object-cover -ml-2 first:ml-0 shadow-sm"
                  />
                ))}
              </div>
              <div>
                <p className="text-[13px] font-semibold text-slate-700 leading-none mb-0.5">
                  +1.200 psicólogos
                </p>
                <p className="text-[12px] text-slate-400 font-light">confiam no MindFlush</p>
              </div>
            </motion.div>
          </div>

          {/* Right — stat cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Featured card — full width */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="col-span-1 sm:col-span-2 relative flex flex-col rounded-2xl border border-blue-100/80 bg-white p-7 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div
                className="absolute top-0 right-0 w-32 h-32 rounded-2xl pointer-events-none"
                style={{
                  background: `radial-gradient(ellipse at 80% 20%, rgba(37,99,235,0.07) 0%, transparent 70%)`,
                }}
              />
              <div
                className="mb-5 w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: BRAND_MUTED }}
              >
                <CalendarX className="w-4 h-4" style={{ color: BRAND }} strokeWidth={2} />
              </div>
              <p
                className="text-[clamp(56px,6vw,76px)] font-semibold leading-none tracking-tight text-slate-900 mb-3"
                style={{ fontFamily: "'Lora', serif" }}
              >
                89%
              </p>
              <p className="text-[13.5px] font-light leading-relaxed text-slate-500 max-w-[280px]">
                Redução de faltas com lembretes automáticos via WhatsApp
              </p>
            </motion.div>

            {/* Two smaller cards */}
            {[
              {
                icon: Clock,
                value: "3h",
                label: "Horas administrativas economizadas por semana",
                iconColor: "#0284c7",
                iconBg: "#E0F2FE",
              },
              {
                icon: Users,
                value: "94%",
                label: "Taxa de retenção de pacientes na plataforma",
                iconColor: "#16a34a",
                iconBg: "#DCFCE7",
              },
            ].map((card, i) => {
              const Icon = card.icon
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.28 + i * 0.1, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col rounded-2xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <div
                    className="mb-4 w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: card.iconBg }}
                  >
                    <Icon className="w-4 h-4" style={{ color: card.iconColor }} strokeWidth={2} />
                  </div>
                  <p
                    className="text-[clamp(40px,4vw,56px)] font-semibold leading-none tracking-tight text-slate-900 mb-3"
                    style={{ fontFamily: "'Lora', serif" }}
                  >
                    {card.value}
                  </p>
                  <p className="text-[12.5px] font-light leading-relaxed text-slate-500">{card.label}</p>
                </motion.div>
              )
            })}
          </div>

        </div>
      </div>
    </section>
  )
}
