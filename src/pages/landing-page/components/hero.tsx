"use client"

import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"

const userAvatars = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&h=64",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=64&h=64",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=64&h=64",
]

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#F8FAFF] pt-20 md:pt-28 lg:pt-36 pb-28">
      {/* Grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(80,100,180,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(80,100,180,0.05)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_10%,#000_50%,transparent_100%)] pointer-events-none" />

      {/* Blob azul */}
      <div className="absolute top-[-240px] left-1/2 -translate-x-1/2 w-[640px] h-[640px] rounded-full bg-[radial-gradient(circle,rgba(191,214,255,0.4)_0%,transparent_65%)] pointer-events-none" />

      <div className="container relative z-10 mx-auto px-4 text-center">
        {/* Trust badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2.5 bg-white border border-blue-600/15 rounded-full py-1.5 pl-2 pr-3.5 mb-11 shadow-sm"
        >
          <div className="flex">
            {userAvatars.map((url, i) => (
              <img
                key={i}
                src={url}
                className="h-6 w-6 rounded-full border-2 border-white object-cover -ml-2 first:ml-0"
                alt=""
              />
            ))}
          </div>
          <span className="text-[11px] font-medium text-[#4B6080] uppercase tracking-widest">
            Confiado por +1k psicólogos
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-[clamp(40px,6vw,68px)] font-medium tracking-tight text-slate-900 leading-[1.12] mb-7"
          style={{ fontFamily: "'Lora', serif" }}
        >
          Foque no paciente,
          <br />
          <em className="italic text-blue-600">a</em>{" "}
          <span className="relative inline-block">
            <span className="relative z-10">gestão</span>
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.7, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="absolute bottom-[2px] -left-1 -right-1 h-[34%] bg-blue-200/45 rounded-sm -rotate-[0.5deg] origin-left -z-10"
            />
          </span>{" "}
          é conosco.
        </motion.h1>

        {/* Subtítulo */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.7 }}
          className="max-w-[520px] mx-auto text-lg font-light text-[#4B6080] leading-relaxed mb-12"
        >
          Prontuários, agendamento e financeiro em um só lugar.
          A infraestrutura completa para sua clínica de psicologia.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38, duration: 0.7 }}
          className="flex items-center justify-center gap-4"
        >
          <Link to="/sign-in">
            <button className="group inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-[15px] font-medium px-7 py-3.5 rounded-xl transition-all duration-200 hover:-translate-y-px active:scale-[0.98] cursor-pointer border-none">
              Começar Agora
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          </Link>
          <button className="text-sm text-[#4B6080] hover:text-slate-900 underline underline-offset-4 decoration-[rgba(75,96,128,0.3)] transition-colors cursor-pointer bg-transparent border-none">
            Ver demonstração
          </button>
        </motion.div>

        {/* Social proof */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.6 }}
          className="mt-14 flex items-center justify-center gap-7"
        >
          {["Sem contrato de fidelidade", "14 dias grátis", "LGPD compliant"].map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              {i > 0 && <div className="w-px h-4 bg-blue-600/12" />}
              <span className="w-1.5 h-1.5 rounded-full bg-blue-300" />
              <span className="text-[13px] text-[#7B93B0]">{item}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}