"use client"

import { useState, useEffect } from "react"
import { X, ChevronRight } from "lucide-react"
import { Brain } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import type { Popup } from "@/api/popups/popups"
import { cn } from "@/lib/utils"

interface WelcomeModalProps {
    popup: Popup
    onClose: (action: string) => void
}

export function WelcomeModal({ popup, onClose }: WelcomeModalProps) {
    const [isOpen, setIsOpen] = useState(false)

    // Aciona a animação de entrada ao montar o componente
    useEffect(() => {
        setIsOpen(true)
    }, [])

    // Gerencia o fechamento com animação de saída (300ms)
    const handleClose = (action: string) => {
        setIsOpen(false)
        setTimeout(() => {
            onClose(action)
        }, 300)
    }

    const handleCTA = () => handleClose("cta_clicked")

    // --- Definição de Estilos para Melhor Legibilidade ---

    const overlayStyles = cn(
        "fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300",
        isOpen
            ? "bg-slate-900/25 backdrop-blur-sm opacity-100"
            : "bg-slate-900/0 backdrop-blur-none opacity-0 pointer-events-none"
    )

    const modalContainerStyles = cn(
        "relative w-full max-w-2xl transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
        isOpen ? "scale-100 opacity-100 translate-y-0" : "scale-90 opacity-0 translate-y-8"
    )

    const iconBoxStyles = cn(
        "flex h-16 w-16 items-center justify-center rounded-xl bg-white shadow-md shadow-slate-200/50 border border-slate-100 transition-all duration-500 delay-100",
        isOpen ? "scale-100 opacity-100" : "scale-75 opacity-0"
    )

    const badgeStyles = cn(
        "mb-5 flex justify-center transition-all duration-500 delay-150",
        isOpen ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
    )

    const titleStyles = cn(
        "mb-4 text-center text-xl font-semibold tracking-tight text-slate-900 transition-all duration-500 delay-200 text-balance",
        isOpen ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
    )

    const bodyStyles = cn(
        "mb-8 text-center text-slate-500 leading-relaxed text-sm transition-all duration-500 delay-250 text-pretty",
        "[&_a]:text-slate-700 [&_a]:underline [&_a]:underline-offset-2 [&_a]:decoration-slate-300 [&_a:hover]:decoration-slate-500",
        isOpen ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
    )

    const buttonStyles = cn(
        "cursor-pointer group relative w-full overflow-hidden rounded-full bg-gradient-to-r from-blue-500 to-blue-700 py-6 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/30 hover:from-blue-600 hover:to-blue-800 border-0 delay-350",
        isOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
    )

    return (
        <div className={overlayStyles}>
            <div className={modalContainerStyles}>

                {/* Botão de Fechar */}
                <button
                    onClick={() => handleClose("closed")}
                    className="cursor-pointer absolute right-4 top-4 z-10 flex h-7 w-7 items-center justify-center rounded-full text-slate-400 transition-all duration-200 hover:bg-slate-100 hover:text-slate-600"
                    aria-label="Fechar modal"
                >
                    <X className="h-4 w-4" />
                </button>

                <div className="relative overflow-hidden rounded-2xl bg-white shadow-2xl shadow-slate-900/10">

                    {/* Background Grid Pattern */}
                    <div
                        className="absolute inset-0 opacity-[0.4]"
                        style={{
                            backgroundImage: `
                                linear-gradient(to right, #e2e8f0 1px, transparent 1px),
                                linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)
                            `,
                            backgroundSize: "28px 28px",
                        }}
                    />

                    {/* Header Gradient */}
                    <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-sky-300/80 via-blue-300/55 to-transparent rounded-t-xl" />

                    <div className="relative px-8 py-10 sm:px-10 sm:py-12">

                        {/* Ícone da Marca */}
                        <div className="mb-6 flex justify-center">
                            <div className={iconBoxStyles}>
                                <Brain className="h-8 w-8 text-blue-500" weight="duotone" />
                            </div>
                        </div>

                        {/* Badge de Boas-vindas */}
                        <div className={badgeStyles}>
                            <span className="inline-flex items-center rounded-full bg-white px-4 py-1.5 text-xs font-medium text-slate-500 border border-slate-100 shadow-sm">
                                Bem-vindo ao MindFlush
                            </span>
                        </div>

                        {/* Título do Popup */}
                        <h1 className={titleStyles}>
                            {popup.title}
                        </h1>

                        {/* Conteúdo do Popup (HTML) */}
                        <div
                            className={bodyStyles}
                            dangerouslySetInnerHTML={{ __html: popup.body || "" }}
                        />

                        {/* Botão de Chamada para Ação */}
                        <Button
                            onClick={handleCTA}
                            size="lg"
                            className={buttonStyles}
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                {popup.ctaText || "Começar Agora"}
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 transition-transform duration-300 group-hover:translate-x-0.5">
                                    <ChevronRight className="h-4 w-4" />
                                </span>
                            </span>
                        </Button>

                    </div>
                </div>
            </div>
        </div>
    )
}