"use client"

import type React from "react"
import { ArrowRight, CreditCard, Mail, Calendar, Video, Zap, Users } from "lucide-react"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { WhatsappLogoIcon } from "@phosphor-icons/react"

interface IntegrationCardProps {
    icon: React.ReactNode
    label: string
    iconBg: string
    iconColor: string
    delay?: number
    x: string
    y: string
    orbitDuration?: number
    side?: "left" | "right"
}

const FloatingCard = ({ icon, label, iconBg, delay = 0, x, y, orbitDuration = 4, side }: IntegrationCardProps) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: delay * 0.12 }}
        className="absolute hidden lg:flex items-center gap-2.5 bg-white border border-blue-600/10 rounded-2xl px-4 py-2.5 shadow-md z-20"
        style={{ left: side === "left" ? x : undefined, right: side === "right" ? x : undefined, top: y }}
    >
        <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: orbitDuration, repeat: Infinity, ease: "easeInOut", delay: delay * 0.2 }}
            className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}
        >
            {icon}
        </motion.div>
        <div>
            <p className="text-[13px] font-medium text-slate-800 leading-none mb-1">{label}</p>
            <p className="text-[10px] font-medium text-emerald-600 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Conectado
            </p>
        </div>
    </motion.div>
)

const cards = {
    left: [
        { icon: <CreditCard className="w-4 h-4 text-purple-600" />, label: "Pagamentos", iconBg: "bg-purple-100", y: "8%", delay: 0, orbitDuration: 5 },
        { icon: <Mail className="w-4 h-4 text-emerald-600" />, label: "E-mail", iconBg: "bg-emerald-100", y: "43%", delay: 2, orbitDuration: 4.5 },
        { icon: <Calendar className="w-4 h-4 text-blue-600" />, label: "Agenda", iconBg: "bg-blue-100", y: "77%", delay: 4, orbitDuration: 5.5 },
    ],
    right: [
        { icon: <Users className="w-4 h-4 text-sky-600" />, label: "Pacientes", iconBg: "bg-sky-100", y: "8%", delay: 1, orbitDuration: 4 },
        { icon: <WhatsappLogoIcon className="w-4 h-4 text-green-600" />, label: "WhatsApp", iconBg: "bg-green-100", y: "43%", delay: 3, orbitDuration: 5 },
        { icon: <Video className="w-4 h-4 text-violet-600" />, label: "Videochamada", iconBg: "bg-violet-100", y: "77%", delay: 5, orbitDuration: 4.2 },
    ],
}

const mobileCards = [
    { icon: CreditCard, label: "Pagamentos", iconBg: "bg-purple-100", iconColor: "text-purple-600" },
    { icon: Users, label: "Pacientes", iconBg: "bg-sky-100", iconColor: "text-sky-600" },
    { icon: Mail, label: "E-mail", iconBg: "bg-emerald-100", iconColor: "text-emerald-600" },
    { icon: WhatsappLogoIcon, label: "WhatsApp", iconBg: "bg-green-100", iconColor: "text-green-600" },
    { icon: Calendar, label: "Agenda", iconBg: "bg-blue-100", iconColor: "text-blue-600" },
    { icon: Video, label: "Videochamada", iconBg: "bg-violet-100", iconColor: "text-violet-600" },
]

export function IntegrationsSection() {
    return (
        <section className="relative py-24 lg:py-32 overflow-hidden bg-[#F8FAFF]">
            {/* Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(80,100,200,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(80,100,200,0.05)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_50%,#000_40%,transparent_100%)] pointer-events-none" />

            <div className="container relative z-10 mx-auto px-4 text-center">
                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="inline-flex items-center gap-2 bg-white border border-blue-600/15 rounded-full py-1.5 pl-2.5 pr-4 mb-8 shadow-sm"
                >
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
                    </span>
                    <span className="text-[11px] font-medium text-[#4B6080] uppercase tracking-widest">Ecossistema Integrado</span>
                </motion.div>

                {/* Heading */}
                <motion.h2
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-[clamp(36px,5vw,60px)] font-medium tracking-tight text-slate-900 leading-[1.15] mb-6"
                    style={{ fontFamily: "'Lora', serif" }}
                >
                    Suas ferramentas favoritas,
                    <br />
                    <em className="italic text-blue-600">todas</em>{" "}
                    <span className="relative inline-block">
                        <span className="relative z-10">conectadas</span>
                        <motion.span
                            initial={{ scaleX: 0 }}
                            whileInView={{ scaleX: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.75, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                            className="absolute bottom-[2px] -left-1 -right-1 h-[34%] bg-blue-200/40 rounded-sm -rotate-[0.4deg] origin-left -z-10"
                        />
                    </span>
                </motion.h2>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="text-lg font-light text-[#4B6080] max-w-[540px] mx-auto leading-relaxed mb-11"
                >
                    Sincronize agenda, videochamadas e pagamentos em um só lugar.{" "}
                    <span className="font-medium text-[#1E3A5F]">Zero fricção, máxima produtividade.</span>
                </motion.p>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                >
                    <Link to="/sign-in">
                        <button className="group inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-[15px] font-medium px-8 py-3.5 rounded-full transition-all duration-200 hover:-translate-y-px shadow-lg shadow-blue-600/25 border-none cursor-pointer">
                            Conectar agora
                            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                        </button>
                    </Link>
                </motion.div>

                {/* Hub desktop */}
                <div className="relative h-[420px] w-full max-w-[720px] mx-auto mt-16 hidden lg:block">
                    {/* Orbit rings */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] h-[220px] rounded-full border border-dashed border-blue-600/12" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] rounded-full border border-dashed border-blue-600/08" />

                    {/* Center */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", duration: 0.6 }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
                    >
                        <div className="relative w-[88px] h-[88px] bg-white rounded-3xl border border-blue-600/15 shadow-xl flex items-center justify-center">
                            <div className="w-[52px] h-[52px] bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/30">
                                <Zap className="w-7 h-7 text-white" />
                            </div>
                        </div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[88px] h-[88px] rounded-3xl border-2 border-blue-500/20 animate-ping" style={{ animationDuration: "2s" }} />
                    </motion.div>

                    {/* Left cards */}
                    {cards.left.map((c, i) => (
                        <FloatingCard key={i} {...c} x="4%" side="left" iconColor="" />
                    ))}
                    {/* Right cards */}
                    {cards.right.map((c, i) => (
                        <FloatingCard key={i} {...c} x="4%" side="right" iconColor="" />
                    ))}
                </div>

                {/* Mobile grid */}
                <div className="lg:hidden grid grid-cols-2 gap-3 mt-12">
                    {mobileCards.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.08 }}
                            className="flex items-center gap-3 bg-white rounded-xl border border-blue-600/10 p-3.5 shadow-sm"
                        >
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${item.iconBg}`}>
                                <item.icon className={`w-4 h-4 ${item.iconColor}`} />
                            </div>
                            <div>
                                <p className="text-[13px] font-medium text-slate-800 leading-none mb-1">{item.label}</p>
                                <p className="text-[10px] font-medium text-emerald-600 flex items-center gap-1">
                                    <span className="w-1 h-1 rounded-full bg-emerald-500" />
                                    Conectado
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}