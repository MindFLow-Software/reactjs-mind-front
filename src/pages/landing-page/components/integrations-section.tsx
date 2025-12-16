"use client"

import type React from "react"

import { ArrowRight, CreditCard, Mail, Calendar, Video, MessageCircle, Zap, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { WhatsappLogoIcon } from "@phosphor-icons/react"

interface IntegrationCardProps {
    icon: React.ReactNode
    label: string
    color: string
    delay?: number
    x: string | number
    y: string | number
    orbitDuration?: number
}

const FloatingCard = ({ icon, label, color, delay = 0, x, y, orbitDuration = 4 }: IntegrationCardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{
                opacity: { duration: 0.5, delay: delay * 0.1 },
                scale: { duration: 0.5, delay: delay * 0.1 },
            }}
            className="absolute hidden lg:flex items-center gap-3 p-3 pr-5 bg-white backdrop-blur-md border border-slate-200/80 shadow-lg rounded-2xl z-20 group cursor-default"
            style={{
                left: typeof x === "number" ? `${x}%` : x,
                top: typeof y === "number" ? `${y}%` : y,
            }}
        >
            <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-blue-500/0 via-blue-500/10 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{
                    duration: orbitDuration,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                    delay: delay * 0.2,
                }}
                className={`relative flex items-center justify-center w-11 h-11 rounded-xl ${color} text-white shadow-md`}
            >
                {icon}
                <div className="absolute inset-0 rounded-xl bg-linear-to-tr from-white/20 to-transparent" />
            </motion.div>
            <div className="flex flex-col">
                <span className="font-semibold text-slate-800 text-sm">{label}</span>
                <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Conectado
                </span>
            </div>
        </motion.div>
    )
}

const OrbitingDots = () => {
    return (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px]">
            {[...Array(8)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-2 h-2 rounded-full bg-blue-500/30"
                    style={{
                        top: "50%",
                        left: "50%",
                    }}
                    animate={{
                        x: [
                            Math.cos((i * Math.PI * 2) / 8) * 140,
                            Math.cos((i * Math.PI * 2) / 8 + Math.PI) * 140,
                            Math.cos((i * Math.PI * 2) / 8) * 140,
                        ],
                        y: [
                            Math.sin((i * Math.PI * 2) / 8) * 140,
                            Math.sin((i * Math.PI * 2) / 8 + Math.PI) * 140,
                            Math.sin((i * Math.PI * 2) / 8) * 140,
                        ],
                        opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "linear",
                        delay: i * 0.5,
                    }}
                />
            ))}
        </div>
    )
}

export function IntegrationsSection() {
    return (
        <section className="relative py-24 lg:py-32 overflow-hidden bg-linear-to-b from-slate-50 to-white">
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-400/8 blur-[120px] rounded-full" />
                <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-indigo-400/8 blur-[100px] rounded-full" />

                <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size-[32px_32px] mask-[radial-gradient(ellipse_80%_50%_at_50%_50%,#000_40%,transparent_100%)]" />
            </div>

            <div className="container relative z-10 mx-auto px-4 md:px-6">
                <div className="flex flex-col items-center text-center mb-16 lg:mb-20">
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm mb-6"
                    >
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                        <span className="text-xs font-semibold text-slate-600 tracking-wide uppercase">Ecossistema Integrado</span>
                    </motion.div>

                    {/* Heading */}
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 max-w-4xl mb-6"
                    >
                        Suas ferramentas favoritas,{" "}
                        <span className="relative inline-block">
                            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 via-indigo-600 to-blue-600">
                                conectadas
                            </span>
                            <svg
                                className="absolute -bottom-1 left-0 w-full h-2 text-blue-500/40"
                                viewBox="0 0 100 8"
                                preserveAspectRatio="none"
                            >
                                <path
                                    d="M0 6 Q 25 0 50 6 T 100 6"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    fill="none"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </span>
                    </motion.h2>

                    {/* Subheading */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-lg md:text-xl text-slate-600 max-w-2xl leading-relaxed mb-10"
                    >
                        Sincronize agenda, videochamadas e pagamentos em um só lugar.{" "}
                        <span className="text-slate-800 font-medium">Zero fricção, máxima produtividade.</span>
                    </motion.p>

                    {/* CTA Button */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                    >
                        <Link to="/sign-in">
                            <Button
                                size="lg"
                                className="cursor-pointer h-14 px-8 rounded-full text-base bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-600/25 group"
                            >
                                Conectar agora
                                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                    </motion.div>
                </div>

                {/* Integrations Visualization */}
                <div className="relative h-[450px] w-full max-w-5xl mx-auto hidden md:block">
                    {/* Orbiting Dots */}
                    <OrbitingDots />

                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] border border-dashed border-slate-200 rounded-full" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-dashed border-slate-200/50 rounded-full" />

                    {/* Center Hub */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, type: "spring" }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
                    >
                        <div className="relative">
                            <div className="absolute inset-0 w-28 h-28 bg-blue-500/20 blur-2xl rounded-full" />

                            <div className="relative w-28 h-28 bg-linear-to-br from-white to-slate-50 rounded-3xl shadow-2xl flex items-center justify-center border border-slate-100">
                                <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                                    <Zap className="w-8 h-8 text-white" />
                                </div>
                            </div>

                            <div className="absolute inset-0 rounded-3xl border-2 border-blue-500/20 animate-ping animation-duration-[2s]" />
                            <div className="absolute -inset-3 rounded-4xl border border-blue-500/10" />
                        </div>
                    </motion.div>

                    {/* Left Side Cards */}
                    <FloatingCard
                        icon={<CreditCard className="w-5 h-5" />}
                        label="Pagamentos"
                        color="bg-gradient-to-br from-purple-500 to-purple-600"
                        x="8%"
                        y="10%"
                        delay={0}
                        orbitDuration={5}
                    />
                    <FloatingCard
                        icon={<Mail className="w-5 h-5" />}
                        label="E-mail"
                        color="bg-gradient-to-br from-emerald-500 to-emerald-600"
                        x="5%"
                        y="45%"
                        delay={2}
                        orbitDuration={4.5}
                    />
                    <FloatingCard
                        icon={<Calendar className="w-5 h-5" />}
                        label="Agenda"
                        color="bg-gradient-to-br from-blue-500 to-blue-600"
                        x="12%"
                        y="78%"
                        delay={4}
                        orbitDuration={5.5}
                    />

                    {/* Right Side Cards */}
                    <FloatingCard
                        icon={<Users className="w-5 h-5" />}
                        label="Pacientes"
                        color="bg-gradient-to-br from-sky-500 to-sky-600"
                        x="72%"
                        y="10%"
                        delay={1}
                        orbitDuration={4}
                    />
                    <FloatingCard
                        icon={<WhatsappLogoIcon className="w-5 h-5" />}
                        label="WhatsApp"
                        color="bg-gradient-to-br from-green-500 to-green-600"
                        x="75%"
                        y="45%"
                        delay={3}
                        orbitDuration={5}
                    />
                    <FloatingCard
                        icon={<Video className="w-5 h-5" />}
                        label="Videochamada"
                        color="bg-gradient-to-br from-violet-500 to-violet-600"
                        x="68%"
                        y="78%"
                        delay={5}
                        orbitDuration={4.2}
                    />
                </div>

                <div className="md:hidden grid grid-cols-2 gap-3 mt-8">
                    {[
                        { icon: CreditCard, label: "Pagamentos", color: "from-purple-500 to-purple-600" },
                        { icon: Users, label: "Pacientes", color: "from-sky-500 to-sky-600" },
                        { icon: Mail, label: "E-mail", color: "from-emerald-500 to-emerald-600" },
                        { icon: MessageCircle, label: "WhatsApp", color: "from-green-500 to-green-600" },
                        { icon: Calendar, label: "Agenda", color: "from-blue-500 to-blue-600" },
                        { icon: Video, label: "Videochamada", color: "from-violet-500 to-violet-600" },
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-200 shadow-sm"
                        >
                            <div
                                className={`w-10 h-10 rounded-xl bg-linear-to-br ${item.color} flex items-center justify-center text-white shadow-sm`}
                            >
                                <item.icon className="w-5 h-5" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-semibold text-slate-800">{item.label}</span>
                                <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                                    <span className="w-1 h-1 rounded-full bg-emerald-500" />
                                    Conectado
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
