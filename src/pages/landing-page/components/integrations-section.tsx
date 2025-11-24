"use client"

import type React from "react"

import { ArrowRight } from "lucide-react"
import { GoogleLogo, WhatsappLogo, VideoCamera, CreditCard, CalendarBlank, EnvelopeSimple } from "@phosphor-icons/react"

// Button component simples para React puro
function Button({
    children,
    className = "",
    onClick,
}: { children: React.ReactNode; className?: string; onClick?: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`inline-flex items-center justify-center rounded-md font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${className}`}
        >
            {children}
        </button>
    )
}

interface IntegrationCardProps {
    icon: React.ReactNode
    label: string
    bgColor: string
    iconColor: string
    position: string
    delay?: string
}

function IntegrationCard({ icon, label, bgColor, iconColor, position, delay = "0s" }: IntegrationCardProps) {
    return (
        <div
            className={`${position} hidden lg:flex flex-row items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-lg shadow-slate-900/5 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-slate-900/10 hover:-translate-y-1 animate-float`}
            style={{
                animationDelay: delay,
                animationDuration: "6s",
                animationTimingFunction: "ease-in-out",
                animationIterationCount: "infinite",
            }}
        >
            <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl ${bgColor} ${iconColor} transition-transform duration-300 group-hover:rotate-12`}
            >
                {icon}
            </div>
            <span className="pr-2 font-semibold text-slate-800 text-sm whitespace-nowrap">{label}</span>
        </div>
    )
}

export function IntegrationsSection() {
    return (
        <section
            id="integracoes"
            className="relative overflow-hidden  bg-linear-to-b from-slate-50 to-white py-24 lg:py-32"
        >
            {/* Background Pattern (Grid) */}
            <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size-[32px_32px]"></div>

            {/* Gradient overlay */}
            <div className="absolute inset-0 z-0 bg-gradient-radial from-transparent via-white/40 to-white/80"></div>

            {/* Orbs */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: "8s" }}></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: "10s", animationDelay: "2s" }}></div>

            <div className="container relative z-10 mx-auto px-6 md:px-8 lg:px-12">
                <div className="relative mx-auto max-w-4xl text-center">

                    {/* Badge */}
                    <div className="mb-6 flex justify-center animate-fade-in-down">
                        <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur-sm transition-all hover:shadow-md hover:scale-105">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                            </span>
                            Integrações Poderosas
                        </span>
                    </div>

                    {/* Título */}
                    <h2 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl animate-fade-in-up text-balance">
                        Conecte as ferramentas que{" "}
                        <span className="relative inline-block">
                            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-blue-500">
                                você já ama usar
                            </span>
                            <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 200 8" fill="none">
                                <path d="M1 5.5C50 2.5 150 2.5 199 5.5" stroke="url(#gradient)" strokeWidth="3" strokeLinecap="round" />
                                <defs>
                                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
                                        <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.8" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </span>
                    </h2>

                    {/* Subtítulo */}
                    <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-slate-600 animate-fade-in" style={{ animationDelay: "0.2s" }}>
                        O MindFlush trabalha em <strong className="text-slate-700 font-semibold">harmonia perfeita</strong> com sua agenda, videochamadas e ferramentas financeiras. Sincronize tudo em um clique,
                        <span className="text-blue-600 font-medium"> sem complicação</span>.
                    </p>

                    {/* Botão */}
                    <div className="mt-12 flex justify-center animate-fade-in" style={{ animationDelay: "0.4s" }}>
                        <Button
                            className="group relative h-14 rounded-full bg-linear-to-r from-blue-500 to-blue-600 px-8 text-base font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-xl hover:shadow-blue-500/30 hover:scale-105 active:scale-100"
                        >
                            <span className="relative z-10 flex items-center">
                                Acesse agora
                                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                            </span>
                            <div className="absolute inset-0 rounded-full bg-linear-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-shimmer"></div>
                        </Button>
                    </div>

                    {/* ---- CARDS ESPELHADOS ---- */}

                    {/* Esquerda Superior → Stripe & Pix */}
                    <IntegrationCard
                        position="absolute -left-35 top-8"
                        icon={<CreditCard size={24} weight="fill" />}
                        label="Boleto & Pix"
                        bgColor="bg-indigo-50"
                        iconColor="text-indigo-600"
                        delay="4s"
                    />

                    {/* Esquerda Meio → Outlook */}
                    <IntegrationCard
                        position="absolute -left-28 bottom-37"
                        icon={<EnvelopeSimple size={24} weight="bold" />}
                        label="Email"
                        bgColor="bg-sky-50"
                        iconColor="text-sky-600"
                        delay="3s"
                    />

                    {/* Esquerda Inferior → Apple Calendar */}
                    <IntegrationCard
                        position="absolute -left-28 bottom-2"
                        icon={<CalendarBlank size={24} weight="bold" />}
                        label="Calendario"
                        bgColor="bg-slate-100"
                        iconColor="text-slate-800"
                        delay="5s"
                    />

                    {/* Direita Superior → Google Agenda */}
                    <IntegrationCard
                        position="absolute -right-26 top-8"
                        icon={<GoogleLogo size={24} weight="bold" />}
                        label="Agenda"
                        bgColor="bg-blue-50"
                        iconColor="text-blue-600"
                        delay="0s"
                    />

                    {/* Direita Meio → WhatsApp */}
                    <IntegrationCard
                        position="absolute -right-26 top-38"
                        icon={<WhatsappLogo size={24} weight="fill" />}
                        label="WhatsApp"
                        bgColor="bg-green-50"
                        iconColor="text-green-600"
                        delay="1s"
                    />

                    {/* Direita Inferior → Zoom & Meet */}
                    <IntegrationCard
                        position="absolute -right-22 bottom-2"
                        icon={<VideoCamera size={24} weight="fill" />}
                        label="Video Conferencia"
                        bgColor="bg-blue-500"
                        iconColor="text-white"
                        delay="2s"
                    />

                </div>
            </div>
        </section>
    )
}
