"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"

const userAvatars = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&h=64",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=64&h=64",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=64&h=64",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=64&h=64",
]

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white pt-16 md:pt-24 lg:pt-32 pb-24">
      {/* Background simplificado como na imagem */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="container relative z-10 mx-auto px-4 text-center">
        {/* Trust Badge - Centralizado */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-3 rounded-full border border-slate-100 bg-slate-50/50 px-3 py-1 mb-10"
        >
          <div className="flex -space-x-2">
            {userAvatars.slice(0, 3).map((url, i) => (
              <img key={i} src={url} className="h-6 w-6 rounded-full border-2 border-white object-cover" alt="User" />
            ))}
          </div>
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Confiado por +1k psicólogos
          </span>
        </motion.div>

        {/* Headline com o estilo "Handwritten" do modelo */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-slate-900 leading-[1.1] mb-8"
        >
          Foque no paciente, <br />
          <span className="relative inline-block px-2">
            <span className="relative z-10">a gestão</span>
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="absolute inset-0 bg-blue-100 -rotate-1 origin-left rounded-sm -z-10"
            />
          </span>{" "}
          é conosco.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="max-w-2xl mx-auto text-lg md:text-xl text-slate-500 mb-12"
        >
          Prontuários, agendamento e financeiro em um só lugar.
          A infraestrutura completa para sua clínica de psicologia.
        </motion.p>

        {/* Action Bar - Estilo Looo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <Link to="/sign-in">
            <Button size="lg" className="cursor-pointer rounded-xl bg-blue-600 hover:bg-blue-700 px-8 h-12">
              Começar Agora <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}