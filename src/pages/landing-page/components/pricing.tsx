"use client"

import { CheckCircle2, Star } from "lucide-react";
import { motion } from "framer-motion";

const plans = [
    {
        name: "Starter",
        price: "R$ 47",
        priceAnnual: "R$ 39",
        period: "mês",
        periodAnnual: "ano",
        features: [
            "Prontuário ilimitado",
            "Agenda para 1 psicólogo",
            "Videochamada (30min/sessão)",
            "Financeiro básico",
            "Suporte por email"
        ],
        popular: false
    },
    {
        name: "Pro",
        price: "R$ 97",
        priceAnnual: "R$ 79",
        period: "mês",
        periodAnnual: "ano",
        features: [
            "Tudo do Starter",
            "Agenda ilimitada",
            "Videochamada ilimitada",
            "Financeiro avançado",
            "WhatsApp integrado",
            "Suporte prioritário",
            "Faturamento automático"
        ],
        popular: true
    },
    {
        name: "Enterprise",
        price: "R$ 197",
        priceAnnual: "R$ 159",
        period: "mês",
        periodAnnual: "ano",
        features: [
            "Tudo do Pro",
            "Multi-psicólogos",
            "Relatórios avançados",
            "IA Assistente",
            "API personalizada",
            "Suporte dedicado 24/7",
            "White-label opcional"
        ],
        popular: false
    }
];

export function PricingSection() {
    return (
        <section className="py-24 lg:py-32 bg-gradient-to-b from-slate-50 to-white">
            <div className="container mx-auto px-6 md:px-8 lg:px-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-20"
                >
                    <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full py-1.5 px-4 mb-8">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium text-blue-700">Planos simples e transparentes</span>
                    </div>
                    <h2 className="text-4xl lg:text-5xl font-medium tracking-tight text-slate-900 mb-6" style={{ fontFamily: "'Lora', serif" }}>
                        Escolha o plano perfeito
                        <br />
                        <span className="text-blue-600 italic">para sua clínica</span>
                    </h2>
                    <p className="text-xl font-light text-[#4B6080] max-w-2xl mx-auto leading-relaxed">
                        Todos os planos incluem 14 dias grátis. Sem contrato de fidelidade.
                    </p>
                </motion.div>

                {/* Toggle */}
                <div className="flex justify-center mb-16">
                    <div className="inline-flex bg-white border border-blue-200 rounded-full p-1 shadow-sm">
                        <button className="relative px-4 py-2 text-sm font-medium rounded-full transition-all bg-blue-600 text-white shadow-md">Mensal</button>
                        <button className="px-4 py-2 text-sm font-medium text-[#4B6080] hover:text-slate-900 transition-colors">Anual (20% off)</button>
                    </div>
                </div>

                {/* Plans */}
                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={plan.name}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className={`group relative bg-white border ${plan.popular ? 'border-blue-600 shadow-2xl shadow-blue-500/10 ring-4 ring-blue-50/50 translate-y-[-12px]' : 'border-slate-200 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/5'} rounded-3xl p-8 lg:p-10 transition-all duration-500 hover:-translate-y-2`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wide">
                                    Mais Popular
                                </div>
                            )}
                            <h3 className="text-2xl font-semibold text-slate-900 mb-4 text-center" style={{ fontFamily: "'Lora', serif" }}>{plan.name}</h3>
                            <div className="text-center mb-8">
                                <div className="text-4xl lg:text-5xl font-bold text-slate-900 mb-2">
                                    {plan.popular ? plan.priceAnnual : plan.price}
                                </div>
                                <div className="text-sm text-[#4B6080]">{plan.popular ? `/ ${plan.periodAnnual}` : `/ ${plan.period}`}</div>
                            </div>
                            <ul className="space-y-4 mb-8">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex items-start gap-3 text-slate-700">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                            <button className={`w-full py-4 px-6 rounded-2xl font-medium text-sm uppercase tracking-wide transition-all ${plan.popular ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl hover:-translate-y-1' : 'border border-slate-200 hover:border-blue-300 hover:bg-blue-50 text-slate-900 shadow-sm'}`}>
                                Escolher {plan.name}
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

