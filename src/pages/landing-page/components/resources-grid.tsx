import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

const cards = [
  {
    tag: "Produtividade",
    image: "/mind3.png",
    title: "Menos Burocracia,\nMais Escuta",
    description:
      "A tecnologia não deve atrapalhar seu atendimento. Criamos uma plataforma invisível e intuitiva que cuida da gestão, agenda e financeiro, para que sua atenção fique 100% no paciente.",
  },
  {
    tag: "Design",
    image: "/mind5.png",
    title: "Design invisível,\ngestão poderosa",
    description:
      "Diga adeus aos sistemas travados e complexos. O MindFlush foi desenhado para fluir naturalmente, automatizando a burocracia com poucos toques para que sua energia fique 100% disponível para seus pacientes.",
  },
]

export function ResourcesGrid() {
  return (
    <section className="w-full bg-white py-24 border-t border-slate-100">
      <div className="container mx-auto px-6 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {cards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.6 }}
              className="group flex flex-col overflow-hidden rounded-3xl border border-blue-600/10 bg-white transition-all duration-300 hover:border-blue-600/20 hover:shadow-[0_8px_40px_rgba(37,99,235,0.08)] hover:-translate-y-0.5"
            >
              {/* Image */}
              <div className="relative h-72 w-full overflow-hidden bg-[#F8FAFF] sm:h-80 lg:h-80">
                <img
                  src={card.image}
                  alt={card.title}
                  className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
                {/* Bottom fade on hover */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-blue-600/[0.04] opacity-0 transition-opacity duration-400 group-hover:opacity-100" />
              </div>

              {/* Body */}
              <div className="flex flex-1 flex-col justify-between p-8">
                <div>
                  {/* Tag */}
                  <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                    <span className="text-[11px] font-medium uppercase tracking-widest text-blue-600">
                      {card.tag}
                    </span>
                  </div>

                  <h3
                    className="mb-3 text-[22px] font-medium leading-snug tracking-tight text-slate-900 transition-colors duration-300 group-hover:text-[#1E3A5F] whitespace-pre-line"
                    style={{ fontFamily: "'Lora', serif" }}
                  >
                    {card.title}
                  </h3>

                  <p className="text-[15px] font-light leading-relaxed text-[#4B6080]">
                    {card.description}
                  </p>
                </div>

                <div className="mt-5 flex items-center gap-1.5 text-[13px] font-medium text-slate-400 transition-colors duration-300 group-hover:text-blue-600">
                  <span>Saiba mais</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}