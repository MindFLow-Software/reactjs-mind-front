import { ShieldCheck, Video, BrainCircuit } from "lucide-react"

export function SolutionsGrid() {
    const solutions = [
        {
            icon: ShieldCheck,
            iconColor: "text-emerald-500",
            iconBg: "bg-emerald-50",
            shape: "rounded-2xl",
            title: "Proteção de Dados.",
            description:
                "Detecte riscos e armazene dados sensíveis com criptografia de ponta a ponta, garantindo conformidade total com a LGPD.",
            badge: null,
        },
        {
            icon: Video,
            iconColor: "text-blue-500",
            iconBg: "bg-blue-50",
            shape: "rounded-full",
            title: "Videochamada Integrada.",
            description:
                "Sala de atendimento segura, sem limite de tempo e sem precisar instalar nada. Seu paciente clica e entra.",
            badge: null,
        },
        {
            icon: BrainCircuit,
            iconColor: "text-violet-500",
            iconBg: "bg-violet-50",
            shape: "rounded-2xl",
            title: "Assistente IA.",
            description:
                "Ferramenta inteligente que ajuda a transcrever sessões e sugerir rascunhos de evolução clínica para você ganhar tempo.",
            badge: "Em breve",
        },
    ]

    return (
        <section id="solucoes" className="bg-white py-24 scroll-mt-20">
            <div className="container mx-auto px-6 md:px-8 lg:px-12">
                {/* Header */}
                <div className="mb-16 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
                    <div className="max-w-2xl">
                        <h2 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                            Uma suíte de{" "}
                            <span className="relative inline-block">
                                soluções
                                <svg
                                    className="absolute -bottom-1 -left-2 -right-2 h-4 w-[calc(100%+16px)] text-blue-400"
                                    viewBox="0 0 200 12"
                                    fill="none"
                                    preserveAspectRatio="none"
                                >
                                    <path
                                        d="M2 8c40-6 80-6 120-2s56 4 76 0"
                                        stroke="currentColor"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        className="opacity-60"
                                    />
                                </svg>
                            </span>
                            <br />
                            para o seu negócio.
                        </h2>
                    </div>

                    <div className="max-w-lg">
                        <p className="text-lg leading-relaxed text-slate-600">
                            Centralize as operações da sua clínica com uma suíte completa. Nossa tecnologia une prontuários,
                            telemedicina e automação para garantir que seu consultório evolua.
                        </p>
                    </div>
                </div>

                {/* Grid de Cards */}
                <div className="grid grid-cols-1 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm md:grid-cols-3 md:divide-x md:divide-slate-200 divide-y divide-slate-200 md:divide-y-0">
                    {solutions.map((solution, index) => (
                        <div
                            key={index}
                            className="group relative flex flex-col transition-colors duration-300 hover:bg-slate-50/70"
                        >
                            {/* Badge */}
                            {solution.badge && (
                                <div className="absolute right-6 top-6 z-10">
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-linear-to-r from-violet-100 to-blue-100 px-3 py-1.5 text-xs font-semibold text-violet-700 ring-1 ring-violet-200/50">
                                        <span className="relative flex h-1.5 w-1.5">
                                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-75"></span>
                                            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-violet-500"></span>
                                        </span>
                                        {solution.badge}
                                    </span>
                                </div>
                            )}

                            {/* Área do Ícone */}
                            <div className="relative flex h-64 items-center justify-center overflow-hidden">
                                {/* Background com dots */}
                                <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] bg-size-[16px_16px] opacity-70" />

                                {/* Glow sutil no hover */}
                                <div
                                    className={`absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 ${index === 0
                                        ? "bg-linear-to-br from-emerald-50/50 via-transparent to-transparent"
                                        : index === 1
                                            ? "bg-linear-to-br from-blue-50/50 via-transparent to-transparent"
                                            : "bg-linear-to-br from-violet-50/50 via-transparent to-transparent"
                                        }`}
                                />

                                {/* Ícone */}
                                <div
                                    className={`relative flex h-24 w-24 items-center justify-center ${solution.shape} bg-white shadow-[0_8px_30px_-12px_rgba(0,0,0,0.12)] ring-1 ring-slate-100 transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] ${index === 0
                                        ? "group-hover:rotate-3"
                                        : index === 1
                                            ? "group-hover:-rotate-3"
                                            : "group-hover:rotate-1"
                                        }`}
                                >
                                    <solution.icon
                                        className={`h-10 w-10 ${solution.iconColor} transition-transform duration-300 group-hover:scale-110`}
                                        strokeWidth={1.8}
                                    />

                                    {/* Highlight interno */}
                                    <div
                                        className={`absolute inset-0 ${solution.shape} bg-linear-to-tr from-white/0 via-white/60 to-white/0 pointer-events-none`}
                                    />
                                </div>
                            </div>

                            {/* Área de Texto */}
                            <div className="flex flex-1 flex-col border-t border-slate-100 p-8">
                                <h3 className="text-lg font-bold text-slate-900 group-hover:text-slate-800 transition-colors">
                                    {solution.title}
                                </h3>
                                <p className="mt-2 text-sm leading-relaxed text-slate-600">{solution.description}</p>
                                
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
