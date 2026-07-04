import { motion } from 'framer-motion'
import {
  Calendar,
  CheckCircle,
  DollarSign,
  FileText,
  TrendingUp,
  Users,
  Video,
} from 'lucide-react'
import { Brain } from '@phosphor-icons/react'
import { AvatarStack } from '../shared/avatar-stack'
import { AVATARS, BRAND, BRAND_LIGHT, BRAND_MUTED } from '../../constants'
import './dashboard-mockup.css'

const AVATAR_GRADIENT = `linear-gradient(135deg, ${BRAND}, ${BRAND_LIGHT})`
const STATUS_CONFIRMED = { background: '#DCFCE7', color: '#16a34a' }
const STATUS_PENDING = { background: '#FEF3C7', color: '#d97706' }

const SIDEBAR_ITEMS = [
  { icon: TrendingUp, label: 'Dashboard', active: true },
  { icon: Users, label: 'Pacientes' },
  { icon: Calendar, label: 'Agenda' },
  { icon: Video, label: 'Sessões' },
  { icon: FileText, label: 'Prontuários' },
  { icon: DollarSign, label: 'Financeiro' },
]

const METRIC_CARDS = [
  {
    label: 'Pacientes Ativos',
    value: '48',
    icon: Users,
    color: BRAND,
    bg: BRAND_MUTED,
  },
  {
    label: 'Sessões Hoje',
    value: '6',
    icon: Video,
    color: '#0284c7',
    bg: '#E0F2FE',
  },
  {
    label: 'A Receber',
    value: 'R$1.840',
    icon: DollarSign,
    color: '#d97706',
    bg: '#FEF3C7',
  },
  {
    label: 'Taxa Retorno',
    value: '94%',
    icon: TrendingUp,
    color: '#16a34a',
    bg: '#DCFCE7',
  },
]

const APPOINTMENTS = [
  { name: 'Lucas Mendes', time: '09:00', abord: 'TCC', confirmed: true },
  { name: 'Mariana Costa', time: '10:30', abord: 'Ansiedade', confirmed: true },
  { name: 'Rafael Souza', time: '14:00', abord: 'Depressão', confirmed: false },
]

function MockupSidebar() {
  return (
    <div className="lp-mk-sidebar">
      <div className="px-4 py-4 border-b border-slate-50">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center shadow-sm"
            style={{
              background: `linear-gradient(135deg, ${BRAND}, ${BRAND_LIGHT})`,
            }}
          >
            <Brain size={16} weight="bold" className="text-white" />
          </div>
          <div>
            <span className="text-[12px] font-bold text-slate-800 block leading-none">
              MindFlush
            </span>
            <span className="text-[9px] text-slate-400">Pro Plan</span>
          </div>
        </div>
      </div>
      <div className="flex-1 px-2 py-3 flex flex-col gap-0.5">
        {SIDEBAR_ITEMS.map(({ icon: Icon, label, active }) => (
          <div
            key={label}
            className="lp-mk-sidebar-item"
            style={
              active
                ? { background: BRAND_MUTED, color: BRAND }
                : { color: '#94a3b8' }
            }
          >
            <Icon className="w-3.5 h-3.5 shrink-0" />
            <span className="text-[11px] font-medium">{label}</span>
            {active && (
              <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500" />
            )}
          </div>
        ))}
      </div>
      <div className="px-3 pb-3">
        <div
          className="rounded-xl p-3 border border-blue-100"
          style={{ background: BRAND_MUTED }}
        >
          <p className="text-[10px] font-semibold text-blue-700 mb-1">
            Upgrade para Pro
          </p>
          <p className="text-[9px] text-blue-500 leading-tight">
            Desbloqueie relatórios avançados
          </p>
        </div>
      </div>
    </div>
  )
}

function MockupMetrics() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
      {METRIC_CARDS.map(({ label, value, icon: Icon, color, bg }) => (
        <div key={label} className="lp-mk-card">
          <div className="flex items-start justify-between mb-2">
            <p className="text-[9.5px] text-slate-400 leading-tight flex-1 pr-2">
              {label}
            </p>
            <div
              className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: bg }}
            >
              <Icon className="w-3 h-3" style={{ color }} />
            </div>
          </div>
          <p className="text-[18px] font-bold leading-none" style={{ color }}>
            {value}
          </p>
        </div>
      ))}
    </div>
  )
}

function MockupSessionList() {
  return (
    <div className="lp-mk-panel overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-2">
          <span className="text-[11.5px] font-bold text-slate-800">
            Próximas Sessões
          </span>
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-600">
            Hoje
          </span>
        </div>
        <span className="text-[10px] font-semibold text-blue-500">
          Ver agenda →
        </span>
      </div>
      {APPOINTMENTS.map(({ name, time, abord, confirmed }) => (
        <div key={name} className="lp-mk-session-row">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0"
              style={{ background: AVATAR_GRADIENT }}
            >
              {name.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="text-[11.5px] font-semibold text-slate-800 truncate">
                {name}
              </p>
              <p className="text-[10px] text-slate-400">{abord}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[10.5px] font-medium text-slate-400">
              {time}
            </span>
            <span
              className="text-[9px] font-bold px-2 py-0.5 rounded-full"
              style={confirmed ? STATUS_CONFIRMED : STATUS_PENDING}
            >
              {confirmed ? 'Confirmado' : 'Pendente'}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

function MockupChrome() {
  return (
    <div className="flex items-center gap-2 px-4 py-3 bg-slate-50/80 border-b border-slate-100 backdrop-blur-sm">
      <div className="flex items-center gap-1.5">
        <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
        <span className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
        <span className="w-3 h-3 rounded-full bg-[#28C840]" />
      </div>
      <div className="flex-1 mx-3">
        <div className="max-w-xs mx-auto bg-white border border-slate-200 rounded-lg px-3 py-1 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400" />
          <span className="text-[11px] text-slate-400 font-mono truncate">
            app.mindflush.com.br
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div
          className="w-6 h-6 rounded-lg flex items-center justify-center"
          style={{ background: BRAND }}
        >
          <Brain size={12} weight="bold" className="text-white" />
        </div>
        <span className="text-[11px] font-semibold text-slate-600 hidden sm:inline">
          MindFlush
        </span>
      </div>
    </div>
  )
}

function MockupTopBar() {
  return (
    <div className="flex items-center justify-between px-5 py-3.5 bg-white border-b border-slate-100">
      <div>
        <p className="text-[10px] text-slate-400">
          Segunda-feira, 3 de Junho de 2025
        </p>
        <p className="text-[13.5px] font-bold text-slate-800">
          Bom dia, Dra. Ana Beatriz 👋
        </p>
      </div>
      <button
        className="flex items-center gap-1.5 text-white text-[11px] font-bold px-3.5 py-2 rounded-xl shadow-md"
        style={{
          background: `linear-gradient(135deg, ${BRAND}, ${BRAND_LIGHT})`,
          boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
        }}
      >
        + Nova Sessão
      </button>
    </div>
  )
}

function FloatingCards() {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: 20, y: -10 }}
        whileInView={{ opacity: 1, x: 0, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="lp-mk-float-card flex items-center gap-3 -top-6 right-6 md:right-0 md:-translate-x-6 sm:flex"
      >
        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
          <CheckCircle className="w-5 h-5 text-emerald-500" />
        </div>
        <div>
          <p className="text-[11.5px] font-bold text-slate-800">
            Prontuário salvo
          </p>
          <p className="text-[10px] text-slate-400">Sessão encerrada • agora</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -20, y: 10 }}
        whileInView={{ opacity: 1, x: 0, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.7, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="lp-mk-float-card top-16 -left-4 md:-left-8 hidden sm:block"
      >
        <div className="flex items-center gap-2 mb-1">
          <AvatarStack urls={AVATARS.slice(0, 4)} size={22} />
          <span className="text-[11.5px] font-bold text-slate-800">
            +1.200 psicólogos
          </span>
        </div>
        <p className="text-[10px] text-slate-400">confiam no MindFlush</p>
      </motion.div>
    </>
  )
}

export function DashboardMockup() {
  return (
    <div className="relative w-full mx-auto">
      <div className="lp-mk-glow" />

      <div className="lp-mk-frame">
        <MockupChrome />

        <div className="flex h-[400px] bg-slate-50">
          <MockupSidebar />

          <div className="flex-1 flex flex-col overflow-hidden">
            <MockupTopBar />
            <div className="flex-1 px-5 py-4 overflow-hidden">
              <MockupMetrics />
              <MockupSessionList />
            </div>
          </div>
        </div>
      </div>

      <FloatingCards />
    </div>
  )
}
