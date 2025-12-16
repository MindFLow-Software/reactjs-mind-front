"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, ShieldCheck, CheckCircle, Sparkles } from "lucide-react"
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
    <section className="relative overflow-hidden bg-linear-to-b from-slate-50 to-white pt-12 md:pt-20 lg:pt-32 pb-24">
      {/* Background Decorations */}
      <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[800px] h-[800px] bg-linear-to-br from-blue-100/50 to-indigo-100/50 rounded-full blur-3xl opacity-60 pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[600px] h-[600px] bg-linear-to-tr from-sky-100/50 to-blue-100/50 rounded-full blur-3xl opacity-60 pointer-events-none" />

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size-[40px_40px] mask-[radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="container relative z-10 mx-auto px-4 md:px-6 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* LEFT COLUMN: Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="flex flex-col items-start space-y-8"
          >
            {/* Trust Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="inline-flex items-center gap-3 rounded-full border border-slate-200/80 bg-white/90 backdrop-blur-md px-2 pl-2 py-1.5 pr-5 shadow-sm hover:shadow-lg hover:border-blue-200/80 transition-all duration-300 cursor-default group"
            >
              <div className="flex -space-x-2.5">
                {userAvatars.map((url, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="relative h-8 w-8 rounded-full border-2 border-white overflow-hidden shadow-sm group-hover:scale-105 transition-transform"
                  >
                    <img src={url || "/placeholder.svg"} alt={`User ${i}`} className="h-full w-full object-cover" />
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 }}
                  className="h-8 w-8 rounded-full border-2 border-white bg-linear-to-br from-blue-50 to-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-600 shadow-sm"
                >
                  +1k
                </motion.div>
              </div>
              <span className="text-sm font-medium text-slate-600">
                Escolhido por <span className="font-bold text-blue-600">Psicólogos</span>
              </span>
            </motion.div>

            {/* Headline */}
            <div className="space-y-5">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1.08]"
              >
                Foque no paciente. <br />
                <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 via-blue-600 to-indigo-600">
                  A gestão é conosco.
                </span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="max-w-lg text-lg text-slate-600 leading-relaxed"
              >
                Infraestrutura completa para sua clínica. Prontuários, agendamento e financeiro em um só lugar. Feito
                para psicólogos modernos.
              </motion.p>
            </div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
            >
              <Link to="/sign-in">
                <Button
                  size="lg"
                  className="cursor-pointer h-14 px-8 text-base rounded-full bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-600/30 transition-all duration-300 hover:shadow-xl hover:shadow-blue-600/40 hover:scale-[1.02] active:scale-[0.98] group"
                >
                  <Sparkles className="mr-2 h-4 w-4 opacity-80" />
                  Começar Gratuitamente
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </Link>
            </motion.div>

            {/* Security Badge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="flex items-center gap-6 pt-6 border-t border-slate-200/80 w-full max-w-md"
            >
              <div className="flex items-center gap-2.5 group cursor-default">
                <div className="p-2 rounded-full bg-linear-to-br from-green-50 to-green-100 text-green-600 group-hover:scale-110 transition-transform duration-300">
                  <ShieldCheck size={16} strokeWidth={2.5} />
                </div>
                <span className="text-sm font-medium text-slate-700">LGPD Compliance</span>
              </div>
              <div className="flex items-center gap-2.5 group cursor-default">
                <div className="p-2 rounded-full bg-linear-to-br from-blue-50 to-blue-100 text-blue-600 group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle size={16} strokeWidth={2.5} />
                </div>
                <span className="text-sm font-medium text-slate-700">Criptografia E2E</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
