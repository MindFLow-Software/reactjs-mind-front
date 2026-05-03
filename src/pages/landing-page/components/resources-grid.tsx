import { motion } from "framer-motion"
import { ArrowRight, Layers } from "lucide-react"
import { Link } from "react-router-dom"

const BRAND = "#2563eb"
const BRAND_LIGHT = "#3b82f6"

const CARDS = [
  {
    tag: "Produtividade",
    image: "/mind3.png",
    title: "Menos burocracia,\nmais escuta",
    description:
      "Criamos uma plataforma invisível e intuitiva que cuida da gestão, agenda e financeiro para que sua atenção fique 100% no paciente.",
    href: "/sign-up",
  },
  {
    tag: "Design",
    image: "/mind5.png",
    title: "Design invisível,\ngestão poderosa",
    description:
      "Diga adeus aos sistemas travados e complexos. O MindFlush foi desenhado para fluir naturalmente — automatizando a burocracia com poucos toques.",
    href: "/sign-up",
  },
]

export function ResourcesGrid() {
  return (
    <section
      id="recursos"
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
        className="absolute left-0 top-0 w-[500px] h-[400px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 20% 10%, rgba(37,99,235,0.07) 0%, transparent 65%)",
        }}
      />

      <div className="container relative z-10 mx-auto px-6 md:px-8 lg:px-12">

        {/* Section header */}
        <div className="flex flex-col items-center text-center mb-14">
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
                <Layers className="h-2.5 w-2.5 text-white" strokeWidth={2.5} />
              </span>
              Recursos
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-[clamp(28px,3.6vw,44px)] font-semibold tracking-tight text-slate-900 leading-[1.15] mb-4 max-w-[540px]"
            style={{ fontFamily: "'Lora', serif" }}
          >
            Tudo que você precisa,{" "}
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
                em um só lugar.
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

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.18, duration: 0.6 }}
            className="text-[15.5px] font-light leading-relaxed text-slate-500 max-w-[420px]"
          >
            Construído para psicólogos que querem exercer sua profissão com excelência — sem perder tempo com burocracia.
          </motion.p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {CARDS.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.12 + i * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="group flex flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
            >
              {/* Image */}
              <div className="relative h-72 w-full overflow-hidden bg-[#F8FAFF] sm:h-80">
                <img
                  src={card.image}
                  alt={card.title}
                  className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
                <div
                  className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background: "linear-gradient(to bottom, transparent 50%, rgba(37,99,235,0.05) 100%)",
                  }}
                />
              </div>

              {/* Body */}
              <div className="flex flex-1 flex-col justify-between p-8">
                <div>
                  {/* Tag */}
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-blue-600 mb-4">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" />
                    {card.tag}
                  </span>

                  <h3
                    className="mb-3 whitespace-pre-line text-[22px] font-semibold leading-snug tracking-tight text-slate-900"
                    style={{ fontFamily: "'Lora', serif" }}
                  >
                    {card.title}
                  </h3>

                  <p className="text-[14.5px] font-light leading-relaxed text-slate-500">
                    {card.description}
                  </p>
                </div>

                <div className="mt-6">
                  <Link
                    to={card.href}
                    className="group/link inline-flex items-center gap-1.5 text-[13px] font-semibold transition-colors duration-200"
                    style={{ color: BRAND }}
                  >
                    Saiba mais
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover/link:translate-x-1" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
