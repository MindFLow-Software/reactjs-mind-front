import { ShieldCheck, Video, BrainCircuit } from "lucide-react"
import { motion } from "framer-motion"

const solutions = [
    {
        icon: ShieldCheck,
        iconColor: "text-emerald-500",
        shape: "rounded-2xl",
        glowClass: "from-emerald-50/60 via-transparent to-transparent",
        rotateHover: "group-hover:rotate-3",
        title: "Proteção de Dados.",
        description:
            "Detecte riscos e armazene dados sensíveis com criptografia de ponta a ponta, garantindo conformidade total com a LGPD.",
        badge: null,
    },
    {
        icon: Video,
        iconColor: "text-blue-600",
        shape: "rounded-full",
        glowClass: "from-blue-50/60 via-transparent to-transparent",
        rotateHover: "group-hover:-rotate-3",
        title: "Videochamada Integrada.",
        description:
            "Sala de atendimento segura, sem limite de tempo e sem precisar instalar nada. Seu paciente clica e entra.",
        badge: null,
    },
    {
        icon: BrainCircuit,
        iconColor: "text-violet-500",
        shape: "rounded-2xl",
        glowClass: "from-violet-50/60 via-transparent to-transparent",
        rotateHover: "group-hover:rotate-1",
        title: "Assistente IA.",
        description:
            "Ferramenta inteligente que ajuda a transcrever sessões e sugerir rascunhos de evolução clínica para você ganhar tempo.",
        badge: "Em breve",
    },
]

export function SolutionsGrid() {
    return (
        <section id="solucoes" className="bg-white py-24 scroll-mt-20">
            <div className="container mx-auto px-6 md:px-8 lg:px-12">
                {/* Header */}
                <div className="mb-14 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
                    <div className="max-w-2xl">
                        <h2
                            className="text-[clamp(32px,4vw,48px)] font-medium tracking-tight text-slate-900 leading-[1.15]"
                            style={{ fontFamily: "'Lora', serif" }}
                        >
                            Uma suíte de{" "}
                            <span className="relative inline-block">
                                <em className="italic text-blue-600">soluções</em>
                                <motion.span
                                    initial={{ scaleX: 0 }}
                                    whileInView={{ scaleX: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.5, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                                    className="absolute bottom-[2px] -left-1 -right-1 h-[34%] bg-blue-200/40 rounded-sm -rotate-[0.4deg] origin-left -z-10"
                                />
                            </span>
                            <br />
                            para o seu negócio.
                        </h2>
                    </div>
                    <p className="max-w-md text-base font-light leading-relaxed text-[#4B6080]">
                        Centralize as operações da sua clínica com uma suíte completa. Nossa tecnologia une prontuários,
                        telemedicina e automação para garantir que seu consultório evolua.
                    </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 overflow-hidden rounded-3xl border border-blue-600/10 bg-white shadow-sm md:grid-cols-3 divide-y divide-blue-600/08 md:divide-y-0 md:divide-x md:divide-blue-600/08">
                    {solutions.map((s, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.5 }}
                            className="group relative flex flex-col transition-colors duration-300 hover:bg-[#F8FAFF]"
                        >
                            {/* Badge */}
                            {s.badge && (
                                <div className="absolute right-5 top-5 z-10 inline-flex items-center gap-1.5 rounded-full bg-violet-50 border border-violet-200/50 px-3 py-1">
                                    <span className="relative flex h-1.5 w-1.5">
                                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-75" />
                                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-violet-500" />
                                    </span>
                                    <span className="text-[10px] font-medium text-violet-700">{s.badge}</span>
                                </div>
                            )}

                            {/* Icon area */}
                            <div className="relative flex h-56 items-center justify-center overflow-hidden">
                                <div className="absolute inset-0 bg-[radial-gradient(rgba(37,99,235,0.07)_1px,transparent_1px)] bg-[size:16px_16px]" />
                                <div className={`absolute inset-0 bg-gradient-to-br ${s.glowClass} opacity-0 transition-opacity duration-500 group-hover:opacity-100`} />
                                <div
                                    className={`relative z-10 flex h-[88px] w-[88px] items-center justify-center bg-white ${s.shape} border border-blue-600/10 shadow-[0_8px_32px_rgba(0,0,0,0.08)] transition-all duration-500 group-hover:-translate-y-1.5 group-hover:shadow-[0_16px_40px_rgba(0,0,0,0.1)] ${s.rotateHover}`}
                                >
                                    <s.icon className={`h-10 w-10 ${s.iconColor} transition-transform duration-300 group-hover:scale-110`} strokeWidth={1.8} />
                                </div>
                            </div>

                            {/* Text */}
                            <div className="flex flex-1 flex-col border-t border-blue-600/08 p-7">
                                <h3
                                    className="mb-2.5 text-[18px] font-medium text-slate-900 transition-colors duration-300 group-hover:text-[#1E3A5F]"
                                    style={{ fontFamily: "'Lora', serif" }}
                                >
                                    {s.title}
                                </h3>
                                <p className="text-sm font-light leading-relaxed text-[#4B6080]">{s.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}