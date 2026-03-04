"use client"

import { motion } from "framer-motion"
import { ArrowRight, Wallet, TrendingUp, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"

const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(value)

const financialData = [
    {
        label: "Recebido no Mês",
        value: 12450.00, // Placeholder para visualização
        description: "Pagamentos confirmados",
        icon: Wallet
    },
    {
        label: "A Receber na Semana",
        value: 3200.00, // Placeholder para visualização
        description: "Sessões agendadas",
        icon: TrendingUp
    },
]

export function FinanceSummaryWidget() {
    return (
        <div className="relative group overflow-hidden rounded-[2rem] border border-zinc-200 bg-white p-1 shadow-xl shadow-zinc-200/50 h-full flex flex-col">
            {/* Background Texture & Effects - Padronizado */}
            <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-emerald-100/50 blur-[100px] rounded-full" />

            <div className="relative bg-white/40 backdrop-blur-xl rounded-[1.8rem] p-6 h-full flex flex-col">
                {/* Header: Editorial Style */}
                <header className="flex justify-between items-end mb-8 px-2">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-emerald-600 mb-2">
                            <DollarSign className="size-4" />
                            <span className="text-[10px] font-bold tracking-[0.3em] uppercase">Performance</span>
                        </div>
                        <h2 className="text-3xl font-light tracking-tight text-zinc-900 italic">
                            Fluxo <span className="font-serif font-normal not-italic text-emerald-600">Financeiro</span>
                        </h2>
                    </div>
                </header>

                {/* Main Content Area: Grid de Valores */}
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 px-2 py-2">
                    {financialData.map((item, index) => (
                        <motion.div
                            key={item.label}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, ease: "circOut" }}
                            className="p-5 rounded-2xl bg-zinc-50/50 border border-zinc-100 flex flex-col justify-between group/card hover:bg-white hover:border-emerald-200 transition-all duration-500"
                        >
                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 group-hover/card:text-emerald-600 transition-colors">
                                    {item.label}
                                </p>
                                <p className="text-2xl font-serif text-zinc-900 tabular-nums leading-tight">
                                    {formatCurrency(item.value)}
                                </p>
                            </div>
                            <p className="text-[11px] text-zinc-400 font-medium mt-4 border-t border-zinc-200/50 pt-2">
                                {item.description}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Footer Link: PADRONIZADO */}
                <footer className="mt-8 pt-4 border-t border-zinc-100 flex items-center justify-between">
                    <p className="hidden sm:block text-[9px] text-zinc-400 font-bold uppercase tracking-widest px-2">
                        Relatórios detalhados disponíveis
                    </p>
                    <Button variant="link" className="text-zinc-400 hover:text-emerald-600 group/btn p-0 h-auto no-underline w-fit" asChild>
                        <a href="/dashboard-finance" className="flex items-center">
                            <span className="text-xs uppercase tracking-[0.2em] font-black">Ir ao financeiro</span>
                            <ArrowRight className="ml-2 size-3 group-hover/btn:translate-x-1 transition-transform" />
                        </a>
                    </Button>
                </footer>
            </div>
        </div>
    )
}