import { motion } from 'framer-motion'
import { ArrowRight, Check, Play, Zap } from 'lucide-react'
import { Brain } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import { AvatarStack } from '../shared/avatar-stack'
import { AVATARS, BRAND, BRAND_MUTED } from '../../constants'
import './hero-copy.css'

const PLATFORMS = ['CFP', 'LGPD', 'PIX', 'PRONTUÁRIO', 'CBO', 'E MAIS']
const TRUST_ITEMS = [
  '14 dias grátis',
  'Sem cartão de crédito',
  'LGPD compliant',
]

export function HeroCopy() {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        className="flex justify-center mb-10"
      >
        <div className="lp-hero-proof-pill">
          <AvatarStack urls={AVATARS.slice(0, 3)} size={26} />
          <div className="flex items-center gap-1.5">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
            <span className="text-[12px] text-slate-500">
              <strong className="text-slate-700 font-semibold">
                +1.200 psicólogos
              </strong>{' '}
              já usam o MindFlush
            </span>
          </div>
        </div>
      </motion.div>

      <div className="text-center mb-6">
        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.08 }}
          className="lp-hero-headline"
        >
          Foque no paciente{' '}
          <span className="inline-block align-middle mb-1">
            <Brain size="0.8em" weight="bold" style={{ color: BRAND }} />
          </span>
          <br />A gestão{' '}
          <span className="relative inline-block">
            <span className="lp-gradient-text">fica conosco</span>
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{
                delay: 0.95,
                duration: 1.0,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="lp-hero-underline"
            />
          </span>{' '}
          <span className="lp-hero-badge-min">
            <Zap className="w-3 h-3 fill-blue-500" />
            em minutos por dia
          </span>
        </motion.h1>
      </div>

      <motion.p
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.7 }}
        className="lp-hero-subtitle"
      >
        Prontuários, agendamento, financeiro e videochamadas em um só lugar —
        feito para psicólogos.
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.28, duration: 0.6 }}
        className="flex items-center justify-center gap-2 flex-wrap mb-8"
      >
        <span className="text-[10.5px] font-semibold text-slate-500 uppercase tracking-widest mr-1">
          Compatível com
        </span>
        {PLATFORMS.map((p) => (
          <span key={p} className="lp-hero-platform">
            {p}
          </span>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.34, duration: 0.7 }}
        className="flex items-center justify-center gap-3 mb-5"
      >
        <Link to="/sign-up" className="lp-hero-cta-primary group">
          Começar Grátis
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
        </Link>

        <button className="lp-hero-cta-secondary group">
          <span
            className="lp-hero-cta-play"
            style={{ background: BRAND_MUTED }}
          >
            <Play className="w-2.5 h-2.5 ml-0.5" style={{ color: BRAND }} />
          </span>
          Ver demonstração
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.44, duration: 0.6 }}
        className="flex items-center justify-center gap-5 mb-14 flex-wrap"
      >
        {TRUST_ITEMS.map((item) => (
          <div key={item} className="flex items-center gap-1.5">
            <div className="lp-hero-trust-check">
              <Check className="w-2.5 h-2.5 text-blue-500" />
            </div>
            <span className="text-[12.5px] text-slate-400">{item}</span>
          </div>
        ))}
      </motion.div>
    </>
  )
}
