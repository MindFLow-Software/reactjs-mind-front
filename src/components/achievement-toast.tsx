"use client"

import { useEffect, useState, useCallback } from "react"
import { createPortal } from "react-dom"
import { X, Trophy, Star, Zap, Crown } from "lucide-react"
import { cn } from "@/lib/utils"

export type AchievementVariant = "bronze" | "silver" | "gold" | "platinum"

interface AchievementToastProps {
    title: string
    description: string
    variant?: AchievementVariant
    onClose: () => void
    duration?: number
}

const CONFETTI_COLORS = {
    bronze: ["#D97706", "#F59E0B", "#FBBF24", "#FCD34D", "#FEF3C7"],
    silver: ["#64748B", "#94A3B8", "#CBD5E1", "#E2E8F0", "#F1F5F9"],
    gold: ["#EAB308", "#FACC15", "#FDE047", "#FEF08A", "#FEF9C3"],
    platinum: ["#06B6D4", "#22D3EE", "#67E8F9", "#A5F3FC", "#CFFAFE"],
}

interface ConfettiPieceProps {
    color: string
    delay: number
    left: number
    rotation: number
    scale: number
}

function ConfettiPiece({ color, delay, left, rotation, scale }: ConfettiPieceProps) {
    return (
        <div
            className="absolute top-0 w-2 h-2 opacity-0 animate-[confetti_1.5s_ease-out_forwards]"
            style={{
                left: `${left}%`,
                backgroundColor: color,
                animationDelay: `${delay}ms`,
                transform: `rotate(${rotation}deg) scale(${scale})`,
                borderRadius: Math.random() > 0.5 ? "50%" : "2px",
            }}
        />
    )
}

const VARIANTS = {
    bronze: {
        label: "Bronze",
        bg: "bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/80 dark:to-orange-950/60",
        border: "border-amber-300/60 dark:border-amber-700/50",
        glow: "shadow-[0_0_30px_-8px_rgba(217,119,6,0.35)] dark:shadow-[0_0_30px_-8px_rgba(217,119,6,0.25)]",
        iconBg: "bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600",
        iconRing: "ring-2 ring-amber-400/30 dark:ring-amber-500/20",
        progressBar: "from-amber-400 to-orange-500",
        labelColor: "text-amber-700 dark:text-amber-400",
        shimmer: "from-amber-200/0 via-amber-200/50 to-amber-200/0",
        Icon: Star,
    },
    silver: {
        label: "Prata",
        bg: "bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-900/80 dark:to-gray-900/60",
        border: "border-slate-300/60 dark:border-slate-600/50",
        glow: "shadow-[0_0_30px_-8px_rgba(148,163,184,0.4)] dark:shadow-[0_0_30px_-8px_rgba(148,163,184,0.25)]",
        iconBg: "bg-gradient-to-br from-slate-400 via-gray-300 to-slate-500",
        iconRing: "ring-2 ring-slate-300/40 dark:ring-slate-500/20",
        progressBar: "from-slate-400 to-gray-500",
        labelColor: "text-slate-600 dark:text-slate-400",
        shimmer: "from-slate-200/0 via-slate-200/50 to-slate-200/0",
        Icon: Zap,
    },
    gold: {
        label: "Ouro",
        bg: "bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950/80 dark:to-amber-950/60",
        border: "border-yellow-400/60 dark:border-yellow-600/50",
        glow: "shadow-[0_0_40px_-8px_rgba(234,179,8,0.45)] dark:shadow-[0_0_40px_-8px_rgba(234,179,8,0.35)]",
        iconBg: "bg-gradient-to-br from-yellow-400 via-amber-400 to-yellow-500",
        iconRing: "ring-2 ring-yellow-400/40 dark:ring-yellow-500/30",
        progressBar: "from-yellow-400 to-amber-500",
        labelColor: "text-yellow-700 dark:text-yellow-400",
        shimmer: "from-yellow-200/0 via-yellow-200/60 to-yellow-200/0",
        Icon: Trophy,
    },
    platinum: {
        label: "Platina",
        bg: "bg-gradient-to-br from-cyan-50 to-sky-50 dark:from-cyan-950/80 dark:to-sky-950/60",
        border: "border-cyan-400/60 dark:border-cyan-600/50",
        glow: "shadow-[0_0_50px_-8px_rgba(34,211,238,0.45)] dark:shadow-[0_0_50px_-8px_rgba(34,211,238,0.35)]",
        iconBg: "bg-gradient-to-br from-cyan-400 via-sky-400 to-blue-500",
        iconRing: "ring-2 ring-cyan-400/40 dark:ring-cyan-500/30",
        progressBar: "from-cyan-400 to-blue-500",
        labelColor: "text-cyan-700 dark:text-cyan-400",
        shimmer: "from-cyan-200/0 via-cyan-200/60 to-cyan-200/0",
        Icon: Crown,
    },
}

export function AchievementToast({
    title,
    description,
    variant = "bronze",
    onClose,
    duration = 10000,
}: AchievementToastProps) {
    const [isVisible, setIsVisible] = useState(false)
    const [confetti, setConfetti] = useState<ConfettiPieceProps[]>([])
    const style = VARIANTS[variant]
    const IconComponent = style.Icon

    const generateConfetti = useCallback(() => {
        const colors = CONFETTI_COLORS[variant]
        const pieces: ConfettiPieceProps[] = []

        for (let i = 0; i < 30; i++) {
            pieces.push({
                color: colors[Math.floor(Math.random() * colors.length)],
                delay: Math.random() * 300,
                left: Math.random() * 100,
                rotation: Math.random() * 360,
                scale: 0.5 + Math.random() * 1,
            })
        }

        setConfetti(pieces)
    }, [variant])

    useEffect(() => {
        const enterTimeout = setTimeout(() => {
            setIsVisible(true)
            generateConfetti()
        }, 50)

        const closeTimeout = setTimeout(() => {
            setIsVisible(false)
            setTimeout(onClose, 500)
        }, duration)

        return () => {
            clearTimeout(enterTimeout)
            clearTimeout(closeTimeout)
        }
    }, [onClose, duration, generateConfetti])

    if (typeof document === "undefined") return null

    return createPortal(
        <div
            role="alert"
            aria-live="assertive"
            className={cn("fixed top-4 right-4 z-[9999] w-full max-w-xs pointer-events-none", "flex justify-end")}
        >
            <div
                className={cn(
                    "pointer-events-auto relative overflow-hidden",
                    "w-full rounded-xl border backdrop-blur-xl",
                    "transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
                    style.bg,
                    style.border,
                    style.glow,
                    isVisible ? "translate-x-0 opacity-100 scale-100" : "translate-x-full opacity-0 scale-90",
                )}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {confetti.map((piece, i) => (
                        <ConfettiPiece key={i} {...piece} />
                    ))}
                </div>

                <div
                    className={cn(
                        "absolute inset-x-0 top-0 h-px bg-gradient-to-r",
                        style.shimmer,
                        "animate-[shimmer_2s_infinite]",
                    )}
                />

                <div className="relative p-3">
                    <div className="flex items-center gap-3">
                        <div
                            className={cn(
                                "relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                                "shadow-md transition-transform duration-300",
                                style.iconBg,
                                style.iconRing,
                            )}
                        >
                            <IconComponent className="h-5 w-5 text-white drop-shadow-sm" />
                        </div>

                        <div className="flex flex-col flex-1 min-w-0 gap-0.5">
                            <div className="flex items-center gap-2">
                                <span
                                    className={cn(
                                        "inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider",
                                        "bg-black/5 dark:bg-white/10",
                                        style.labelColor,
                                    )}
                                >
                                    <span className="inline-block w-1 h-1 rounded-full bg-current animate-pulse" />
                                    {style.label}
                                </span>
                            </div>

                            <h3 className="font-semibold text-sm text-foreground leading-tight">{title}</h3>
                            <p className="text-xs text-muted-foreground leading-snug line-clamp-2">{description}</p>
                        </div>

                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                setIsVisible(false)
                                setTimeout(onClose, 500)
                            }}
                            className={cn(
                                "shrink-0 p-1 rounded-md",
                                "text-muted-foreground/50 hover:text-foreground",
                                "hover:bg-black/5 dark:hover:bg-white/10",
                                "transition-all duration-200 cursor-pointer",
                                "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-current",
                            )}
                            aria-label="Fechar notificação"
                        >
                            <X className="h-3.5 w-3.5" />
                        </button>
                    </div>
                </div>

                <div className="h-0.5 bg-black/5 dark:bg-white/5">
                    <div
                        className={cn("h-full bg-gradient-to-r origin-left", style.progressBar, "animate-[shrink_linear_forwards]")}
                        style={{
                            animationDuration: `${duration}ms`,
                        }}
                    />
                </div>
            </div>
        </div>,
        document.body,
    )
}
