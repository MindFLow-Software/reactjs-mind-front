import { CalendarCheck, CreditCard, FileText, MessageCircle } from "lucide-react"
import { motion } from "framer-motion"

const features = [
    {
        icon: CalendarCheck,
        title: "Agendamento Fácil",
        description: "Você terá sua própria agenda para marcar sessões nos horários que melhor se encaixam na sua rotina.",
    },
    {
        icon: FileText,
        title: "Prontuário Digital",
        description: "Registre evoluções com total segurança, tudo fica criptografado, organizado por histórico e com opção de enviar arquivos do paciente.",
    },
    {
        icon: CreditCard,
        title: "Gestão Financeira",
        description: "Controle pagamentos, emita recibos e saiba exatamente quanto sua clínica faturou no mês.",
    },
    {
        icon: MessageCircle,
        title: "Lembretes via Zap",
        description: "Reduza faltas enviando lembretes automáticos e links da sala de vídeo direto no WhatsApp.",
    },
]

export function StatsSection() {
    return (
        <section id="funcionalidades" className="relative overflow-hidden border-t border-slate-100 bg-white py-24 scroll-mt-20">
            {/* Dot background */}
            <div
                className="absolute inset-0 z-0 pointer-events-none"
                style={{ backgroundImage: "radial-gradient(rgba(37,99,235,0.055) 1px, transparent 1px)", backgroundSize: "24px 24px" }}
            />

            <div className="container relative z-10 mx-auto px-6 md:px-8 lg:px-12">
                {/* Top row */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="max-w-[480px] text-[clamp(28px,3.5vw,44px)] font-medium tracking-tight text-slate-900 leading-[1.2]"
                        style={{ fontFamily: "'Lora', serif" }}
                    >
                        Gerenciando e otimizando
                        <br />
                        a rotina dos{" "}
                        <span className="relative inline-block">
                            <em className="italic text-blue-600">especialistas.</em>
                            <motion.span
                                initial={{ scaleX: 0 }}
                                whileInView={{ scaleX: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.5, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                                className="absolute bottom-[2px] -left-1 -right-1 h-[34%] bg-blue-200/40 rounded-sm -rotate-[0.3deg] origin-left -z-10"
                            />
                        </span>
                    </motion.h2>

                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.15 }}
                        className="flex gap-14 flex-shrink-0"
                    >
                        {[{ num: "1k", label: "Sessões realizadas" }, { num: "50", label: "Clínicas ativas" }].map((s, i) => (
                            <div key={i}>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-2xl font-medium text-blue-600">+</span>
                                    <span className="text-[52px] font-medium text-slate-900 leading-none tracking-tight" style={{ fontFamily: "'Lora', serif" }}>
                                        {s.num}
                                    </span>
                                </div>
                                <p className="mt-1.5 text-[13px] text-[#4B6080]">{s.label}</p>
                            </div>
                        ))}
                    </motion.div>
                </div>

                <div className="hidden lg:block w-full h-px bg-slate-100 mb-16" />

                {/* Features */}
                <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
                    {features.map((f, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.08, duration: 0.5 }}
                            className={`flex flex-col px-0 lg:px-7 ${i < features.length - 1 ? "lg:border-r lg:border-dashed lg:border-blue-600/12" : ""} ${i === 0 ? "lg:pl-0" : ""} ${i === features.length - 1 ? "lg:pr-0" : ""}`}
                        >
                            <div className="mb-3.5 flex items-center gap-2.5">
                                <div className="w-[3px] h-[22px] rounded-full bg-blue-600 flex-shrink-0" />
                                <f.icon className="h-[22px] w-[22px] text-slate-700" strokeWidth={1.8} />
                            </div>
                            <h3 className="mb-2 text-[16px] font-medium text-slate-900" style={{ fontFamily: "'Lora', serif" }}>
                                {f.title}
                            </h3>
                            <p className="text-sm font-light leading-relaxed text-[#4B6080]">{f.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}