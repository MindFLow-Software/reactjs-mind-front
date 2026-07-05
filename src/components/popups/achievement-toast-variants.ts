import { Trophy, Star, Zap, Crown, type LucideIcon } from 'lucide-react'

export type AchievementVariant = 'bronze' | 'silver' | 'gold' | 'platinum'

interface AchievementVariantStyle {
  label: string
  bg: string
  border: string
  glow: string
  iconBg: string
  iconRing: string
  progressBar: string
  labelColor: string
  shimmer: string
  Icon: LucideIcon
}

export const CONFETTI_COLORS: Record<AchievementVariant, string[]> = {
  bronze: ['#D97706', '#F59E0B', '#FBBF24', '#FCD34D', '#FEF3C7'],
  silver: ['#64748B', '#94A3B8', '#CBD5E1', '#E2E8F0', '#F1F5F9'],
  gold: ['#EAB308', '#FACC15', '#FDE047', '#FEF08A', '#FEF9C3'],
  platinum: ['#06B6D4', '#22D3EE', '#67E8F9', '#A5F3FC', '#CFFAFE'],
}

export const ACHIEVEMENT_VARIANTS: Record<
  AchievementVariant,
  AchievementVariantStyle
> = {
  bronze: {
    label: 'Bronze',
    bg: 'bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/80 dark:to-orange-950/60',
    border: 'border-amber-300/60 dark:border-amber-700/50',
    glow: 'shadow-[0_0_30px_-8px_rgba(217,119,6,0.35)]',
    iconBg: 'bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600',
    iconRing: 'ring-2 ring-amber-400/30',
    progressBar: 'from-amber-400 to-orange-500',
    labelColor: 'text-amber-700 dark:text-amber-400',
    shimmer: 'from-amber-200/0 via-amber-200/50 to-amber-200/0',
    Icon: Star,
  },
  silver: {
    label: 'Prata',
    bg: 'bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-900/80 dark:to-gray-900/60',
    border: 'border-slate-300/60 dark:border-slate-600/50',
    glow: 'shadow-[0_0_30px_-8px_rgba(148,163,184,0.4)]',
    iconBg: 'bg-gradient-to-br from-slate-400 via-gray-300 to-slate-500',
    iconRing: 'ring-2 ring-slate-300/40',
    progressBar: 'from-slate-400 to-gray-500',
    labelColor: 'text-slate-600 dark:text-slate-400',
    shimmer: 'from-slate-200/0 via-slate-200/50 to-slate-200/0',
    Icon: Zap,
  },
  gold: {
    label: 'Ouro',
    bg: 'bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950/80 dark:to-amber-950/60',
    border: 'border-yellow-400/60 dark:border-yellow-600/50',
    glow: 'shadow-[0_0_40px_-8px_rgba(234,179,8,0.45)]',
    iconBg: 'bg-gradient-to-br from-yellow-400 via-amber-400 to-yellow-500',
    iconRing: 'ring-2 ring-yellow-400/40',
    progressBar: 'from-yellow-400 to-amber-500',
    labelColor: 'text-yellow-700 dark:text-yellow-400',
    shimmer: 'from-yellow-200/0 via-yellow-200/60 to-yellow-200/0',
    Icon: Trophy,
  },
  platinum: {
    label: 'Platina',
    bg: 'bg-gradient-to-br from-cyan-50 to-sky-50 dark:from-cyan-950/80 dark:to-sky-950/60',
    border: 'border-cyan-400/60 dark:border-cyan-600/50',
    glow: 'shadow-[0_0_50px_-8px_rgba(34,211,238,0.45)]',
    iconBg: 'bg-gradient-to-br from-cyan-400 via-sky-400 to-blue-500',
    iconRing: 'ring-2 ring-cyan-400/40',
    progressBar: 'from-cyan-400 to-blue-500',
    labelColor: 'text-cyan-700 dark:text-cyan-400',
    shimmer: 'from-cyan-200/0 via-cyan-200/60 to-cyan-200/0',
    Icon: Crown,
  },
}
