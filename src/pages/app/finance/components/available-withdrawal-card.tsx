"use client"

import { useState } from "react"
import { Eye, EyeOff, Wallet, ArrowDownToLine } from "lucide-react"

interface AvailableWithdrawalCardProps {
    totalAvailable: number
    pendingAmount: number
    lastWithdrawal?: number
}

export function AvailableWithdrawalCard({
    totalAvailable = 8750.0,
    pendingAmount = 1250.0,
    lastWithdrawal = 3500.0,
}: AvailableWithdrawalCardProps) {
    const [isBalanceVisible, setIsBalanceVisible] = useState(true)

    const formatCurrency = (value: number) =>
        new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(value)

    const maskedValue = "R$ ••••••"

    return (
        <div className="relative w-full max-w-sm">
            {/* Main wallet container */}
            <div className="relative">
                {/* Green card peeking from top */}
                <div className="relative z-10 mx-4">
                    <div
                        className="bg-linear-to-r from-emerald-500 to-emerald-400 rounded-t-xl px-5 py-3 flex justify-between items-center shadow-lg"
                        style={{
                            clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 85%, 0 100%)",
                        }}
                    >
                        <div className="flex items-center gap-2 text-white">
                            <Wallet className="w-4 h-4" />
                            <span className="font-semibold text-lg">Disponível</span>
                        </div>
                        <span className="text-white font-bold text-lg">
                            {isBalanceVisible ? formatCurrency(totalAvailable) : "R$ •••"}
                        </span>
                    </div>
                </div>

                {/* Wallet body */}
                <div
                    className="relative bg-linear-to-b from-gray-800 to-gray-900 rounded-2xl -mt-4 pt-8 pb-6 px-6"
                    style={{
                        boxShadow: "inset 0 2px 4px rgba(0,0,0,0.3), 0 10px 30px rgba(0,0,0,0.3)",
                    }}
                >
                    {/* Leather texture overlay */}
                    <div
                        className="absolute inset-0 rounded-2xl opacity-30 pointer-events-none"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                        }}
                    />

                    {/* Stitching effect - border */}
                    <div
                        className="absolute inset-2 rounded-xl pointer-events-none"
                        style={{
                            border: "2px dashed rgba(255,255,255,0.15)",
                        }}
                    />

                    {/* Curved notch at top */}
                    <div
                        className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-linear-to-b from-gray-700 to-gray-800"
                        style={{
                            borderRadius: "0 0 50% 50%",
                        }}
                    />

                    {/* Content */}
                    <div className="relative z-10 flex flex-col items-center mt-4">
                        {/* Hide/Show toggle */}
                        <button
                            onClick={() => setIsBalanceVisible(!isBalanceVisible)}
                            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-3"
                        >
                            <span className="text-sm">{isBalanceVisible ? "Esconder Saldo" : "Mostrar Saldo"}</span>
                            {isBalanceVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>

                        {/* Main balance */}
                        <div className="text-center">
                            <p className="text-4xl font-bold text-white mb-1">
                                {isBalanceVisible ? formatCurrency(totalAvailable) : maskedValue}
                            </p>
                            <p className="text-emerald-400 font-medium text-sm">Total para saque</p>
                        </div>

                        {/* Divider */}
                        <div className="h-px w-full bg-linear-to-r from-transparent via-white/10 to-transparent my-4" />

                        {/* Footer Stats */}
                        <div className="flex w-full justify-between px-2">
                            <div className="text-center">
                                <p className="text-gray-400 text-xs mb-1">Pendente</p>
                                <p className="text-amber-400 font-bold text-sm">
                                    {isBalanceVisible ? formatCurrency(pendingAmount) : "•••"}
                                </p>
                            </div>
                            <div className="text-center">
                                <p className="text-gray-400 text-xs mb-1">Último saque</p>
                                <p className="text-gray-300 font-bold text-sm">
                                    {isBalanceVisible ? formatCurrency(lastWithdrawal) : "•••"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Bottom tab with icon */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-4 bg-emerald-500 rounded-t-full flex items-center justify-center">
                        <ArrowDownToLine className="w-3 h-3 text-white mb-1" />
                    </div>
                </div>
            </div>
        </div>
    )
}