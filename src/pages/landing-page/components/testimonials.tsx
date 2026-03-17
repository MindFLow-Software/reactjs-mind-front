"use client"

import { motion } from "framer-motion"

const testimonials = [
    {
        name: "Dra. Ana Clara", handle: "@ana.psi",
        content: "Finalmente consegui largar as planilhas do Excel. O MindFlush organizou minha agenda e meus prontuários em um só lugar. Indispensável!",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100",
    },
    {
        name: "Paulo Roberto", handle: "@pauloroberto_psi",
        content: "A integração com o Google Agenda salvou minha vida. Meus pacientes recebem o link do Meet automaticamente. Sensacional!",
        image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=100&h=100",
    },
    {
        name: "Mariana Souza", handle: "@marianapsico",
        content: "A parte financeira é incrível. Consigo ver exatamente quanto recebi e quem está pendente. O design é lindo e muito fácil de usar.",
        image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=100&h=100",
    },
    {
        name: "Carlos Mendes", handle: "@carlos.terapia",
        content: "Eu tinha medo de usar software por causa da segurança dos dados. O MindFlush me passou total confiança com a criptografia. Recomendo.",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100",
    },
    {
        name: "Fernanda Lima", handle: "@fer.psicologia",
        content: "O suporte é excelente e a plataforma não para de evoluir. É muito bom ver uma ferramenta feita pensada na nossa rotina.",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&h=100",
    },
    {
        name: "Dr. Ricardo", handle: "@ricardo_psi",
        content: "Simplesmente a melhor plataforma para psicólogos hoje. O prontuário é super intuitivo e rápido de preencher entre as sessões.",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&h=100",
    },
]

// Ícone X (antigo Twitter)
const XIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-blue-200 flex-shrink-0">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zM17.083 20.026h1.833L7.084 4.126H5.117z" />
    </svg>
)

function TestimonialCard({ data }: { data: typeof testimonials[0] }) {
    return (
        <div className="mx-2 flex h-full w-[320px] flex-shrink-0 flex-col rounded-[18px] border border-blue-600/10 bg-white p-5 shadow-sm transition-all duration-300 hover:border-blue-600/20 hover:shadow-[0_6px_24px_rgba(37,99,235,0.1)] hover:-translate-y-0.5">
            <div className="flex items-center justify-between mb-3.5">
                <div className="flex items-center gap-2.5">
                    <img src={data.image} alt={data.name} className="h-9 w-9 rounded-full object-cover border border-blue-600/10 flex-shrink-0" />
                    <div>
                        <p className="text-[13px] font-medium text-slate-900 leading-none mb-1">{data.name}</p>
                        <p className="text-[11px] font-light text-slate-400">{data.handle}</p>
                    </div>
                </div>
                <XIcon />
            </div>
            <p className="text-[14px] font-light leading-relaxed text-[#4B6080]">{data.content}</p>
        </div>
    )
}

export function TestimonialsSection() {
    const row2 = [...testimonials].reverse()

    return (
        <section id="depoimentos" className="bg-[#F8FAFF] py-24 overflow-hidden scroll-mt-20">
            <style>{`
        @keyframes marquee     { 0% { transform: translateX(0); }    100% { transform: translateX(-50%); } }
        @keyframes marquee-rev { 0% { transform: translateX(-50%); } 100% { transform: translateX(0); } }
        .animate-marquee     { animation: marquee     40s linear infinite; }
        .animate-marquee-rev { animation: marquee-rev 45s linear infinite; }
        .group-pause:hover .animate-marquee,
        .group-pause:hover .animate-marquee-rev { animation-play-state: paused; }
      `}</style>

            {/* Header */}
            <div className="container mx-auto mb-14 px-6 text-center md:px-8 lg:px-12">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="inline-flex items-center gap-2 bg-white border border-blue-600/15 rounded-full py-1.5 pl-2.5 pr-4 mb-7 shadow-sm"
                >
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500" />
                    </span>
                    <span className="text-[11px] font-medium text-[#4B6080] uppercase tracking-widest">Depoimentos</span>
                </motion.div>

                <motion.h2
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-[clamp(30px,4vw,46px)] font-medium tracking-tight text-slate-900 leading-[1.2] mb-5"
                    style={{ fontFamily: "'Lora', serif" }}
                >
                    Histórias reais de quem usa o{" "}
                    <span className="relative inline-block">
                        <em className="italic text-blue-600">MindFlush</em>
                        <motion.span
                            initial={{ scaleX: 0 }}
                            whileInView={{ scaleX: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                            className="absolute bottom-[2px] -left-1 -right-1 h-[34%] bg-blue-200/40 rounded-sm -rotate-[0.3deg] origin-left -z-10"
                        />
                    </span>{" "}
                    no dia a dia.
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="mx-auto max-w-[540px] text-[17px] font-light leading-relaxed text-[#4B6080]"
                >
                    Veja relatos de psicólogos que simplificaram a gestão do consultório
                    e ganharam mais tempo para focar nos pacientes.
                </motion.p>
            </div>

            {/* Carousel */}
            <div className="relative flex flex-col gap-5">
                {/* Fade masks */}
                <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-28 bg-gradient-to-r from-[#F8FAFF] to-transparent" />
                <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-28 bg-gradient-to-l from-[#F8FAFF] to-transparent" />

                {/* Row 1 */}
                <div className="group-pause flex overflow-hidden">
                    <div className="flex animate-marquee min-w-full shrink-0 gap-4">
                        {[...testimonials, ...testimonials].map((t, i) => <TestimonialCard key={`r1-${i}`} data={t} />)}
                    </div>
                    <div className="flex animate-marquee min-w-full shrink-0 gap-4" aria-hidden>
                        {[...testimonials, ...testimonials].map((t, i) => <TestimonialCard key={`r1d-${i}`} data={t} />)}
                    </div>
                </div>

                {/* Row 2 */}
                <div className="group-pause flex overflow-hidden">
                    <div className="flex animate-marquee-rev min-w-full shrink-0 gap-4">
                        {[...row2, ...row2].map((t, i) => <TestimonialCard key={`r2-${i}`} data={t} />)}
                    </div>
                    <div className="flex animate-marquee-rev min-w-full shrink-0 gap-4" aria-hidden>
                        {[...row2, ...row2].map((t, i) => <TestimonialCard key={`r2d-${i}`} data={t} />)}
                    </div>
                </div>
            </div>
        </section>
    )
}