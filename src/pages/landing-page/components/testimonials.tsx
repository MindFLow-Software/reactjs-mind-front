import { motion } from "framer-motion"
import { Star, MessageSquare } from "lucide-react"

const BRAND = "#2563eb"
const BRAND_LIGHT = "#3b82f6"
const BG = "#F7F9FF"

const TESTIMONIALS = [
  {
    name: "Dra. Ana Clara",
    role: "Psicóloga Clínica · SP",
    handle: "@ana.psi",
    content:
      "Finalmente consegui largar as planilhas do Excel. O MindFlush organizou minha agenda e meus prontuários em um só lugar. Indispensável!",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100",
  },
  {
    name: "Paulo Roberto",
    role: "Psicoterapeuta · RJ",
    handle: "@pauloroberto_psi",
    content:
      "A integração com o Google Agenda salvou minha vida. Meus pacientes recebem o link do Meet automaticamente. Sensacional!",
    image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=100&h=100",
  },
  {
    name: "Mariana Souza",
    role: "Psicóloga · BH",
    handle: "@marianapsico",
    content:
      "A parte financeira é incrível. Consigo ver exatamente quanto recebi e quem está pendente. O design é lindo e muito fácil de usar.",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=100&h=100",
  },
  {
    name: "Carlos Mendes",
    role: "Psicólogo · DF",
    handle: "@carlos.terapia",
    content:
      "Eu tinha medo de usar software por causa da segurança dos dados. O MindFlush me passou total confiança com a criptografia. Recomendo.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100",
  },
  {
    name: "Fernanda Lima",
    role: "Psicóloga · RS",
    handle: "@fer.psicologia",
    content:
      "O suporte é excelente e a plataforma não para de evoluir. É muito bom ver uma ferramenta feita pensando na nossa rotina.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&h=100",
  },
  {
    name: "Dr. Ricardo",
    role: "Psicólogo · CE",
    handle: "@ricardo_psi",
    content:
      "Simplesmente a melhor plataforma para psicólogos hoje. O prontuário é super intuitivo e rápido de preencher entre as sessões.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&h=100",
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
    <div className="mx-2 flex h-full w-[320px] flex-shrink-0 flex-col rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
      <div className="mb-3">
        <StarRating />
      </div>

      <p className="flex-1 text-[14px] font-light leading-relaxed text-slate-600 mb-4">
        "{data.content}"
      </p>

      <div className="flex items-center gap-3 pt-4 border-t border-slate-50">
        <img
          src={data.image}
          alt={data.name}
          className="h-9 w-9 rounded-full object-cover border border-slate-100 shrink-0"
        />
        <div>
          <p className="text-[13px] font-semibold text-slate-800 leading-none mb-[4px]">{data.name}</p>
          <p className="text-[11px] font-light text-slate-400">{data.role}</p>
        </div>
      </div>
    </div>
  )
}

export function TestimonialsSection() {
  const row2 = [...TESTIMONIALS].reverse()

  return (
    <section
      id="depoimentos"
      className="relative overflow-hidden border-t border-slate-100 bg-[#F7F9FF] py-24 scroll-mt-20"
    >
      <style>{`
        @keyframes marquee     { 0% { transform: translateX(0); }    100% { transform: translateX(-50%); } }
        @keyframes marquee-rev { 0% { transform: translateX(-50%); } 100% { transform: translateX(0); } }
        .animate-marquee     { animation: marquee     42s linear infinite; }
        .animate-marquee-rev { animation: marquee-rev 48s linear infinite; }
      `}</style>

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
          background: "radial-gradient(ellipse at 80% 10%, rgba(37,99,235,0.07) 0%, transparent 65%)",
        }}
      />

      {/* Section header */}
      <div className="container relative z-10 mx-auto mb-14 px-6 text-center md:px-8 lg:px-12">
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
              <MessageSquare className="h-2.5 w-2.5 text-white" strokeWidth={2.5} />
            </span>
            Depoimentos
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.08, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-[clamp(28px,3.6vw,44px)] font-semibold tracking-tight text-slate-900 leading-[1.15] mb-4 max-w-[560px] mx-auto"
          style={{ fontFamily: "'Lora', serif" }}
        >
          Histórias reais de quem usa o{" "}
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
              MindFlush.
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
          className="mx-auto max-w-[440px] text-[15.5px] font-light leading-relaxed text-slate-500"
        >
          Veja relatos de psicólogos que simplificaram a gestão do consultório e ganharam mais tempo para seus pacientes.
        </motion.p>
      </div>

      {/* Carousel */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.7 }}
        className="relative z-10 flex flex-col gap-4"
      >
        {/* Fade masks */}
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32"
          style={{ background: `linear-gradient(to right, ${BG}, transparent)` }}
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32"
          style={{ background: `linear-gradient(to left, ${BG}, transparent)` }}
        />

        {/* Row 1 — forward */}
        <div className="flex overflow-hidden">
          <div className="flex animate-marquee min-w-full shrink-0 gap-4">
            {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
              <TestimonialCard key={`r1a-${i}`} data={t} />
            ))}
          </div>
          <div className="flex animate-marquee min-w-full shrink-0 gap-4" aria-hidden>
            {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
              <TestimonialCard key={`r1b-${i}`} data={t} />
            ))}
          </div>
        </div>

        {/* Row 2 — reverse */}
        <div className="flex overflow-hidden">
          <div className="flex animate-marquee-rev min-w-full shrink-0 gap-4">
            {[...row2, ...row2].map((t, i) => (
              <TestimonialCard key={`r2a-${i}`} data={t} />
            ))}
          </div>
          <div className="flex animate-marquee-rev min-w-full shrink-0 gap-4" aria-hidden>
            {[...row2, ...row2].map((t, i) => (
              <TestimonialCard key={`r2b-${i}`} data={t} />
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  )
}
