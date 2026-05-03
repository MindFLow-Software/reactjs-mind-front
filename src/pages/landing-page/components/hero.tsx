import { motion } from "framer-motion"
import { ArrowRight, Play, Calendar, Users, TrendingUp, CheckCircle, Video, FileText, DollarSign, Zap, Check } from "lucide-react"
import { Brain } from "@phosphor-icons/react"
import { Link } from "react-router-dom"

const BRAND = "#2563eb"
const BRAND_LIGHT = "#3b82f6"
const BRAND_MUTED = "#EFF6FF"
const AVATAR_GRADIENT = `linear-gradient(135deg, #2563eb, #3b82f6)`
const STATUS_CONFIRMED = { background: "#DCFCE7", color: "#16a34a" }
const STATUS_PENDING = { background: "#FEF3C7", color: "#d97706" }

const PLATFORMS = ["CFP", "LGPD", "PIX", "PRONTUÁRIO", "CBO", "E MAIS"]

const AVATARS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&h=64",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=64&h=64",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=64&h=64",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=64&h=64",
]

const SIDEBAR_ITEMS = [
  { icon: TrendingUp, label: "Dashboard", active: true },
  { icon: Users, label: "Pacientes" },
  { icon: Calendar, label: "Agenda" },
  { icon: Video, label: "Sessões" },
  { icon: FileText, label: "Prontuários" },
  { icon: DollarSign, label: "Financeiro" },
]

const METRIC_CARDS = [
  { label: "Pacientes Ativos", value: "48", icon: Users, color: BRAND, bg: BRAND_MUTED },
  { label: "Sessões Hoje", value: "6", icon: Video, color: "#0284c7", bg: "#E0F2FE" },
  { label: "A Receber", value: "R$1.840", icon: DollarSign, color: "#d97706", bg: "#FEF3C7" },
  { label: "Taxa Retorno", value: "94%", icon: TrendingUp, color: "#16a34a", bg: "#DCFCE7" },
]

const APPOINTMENTS = [
  { name: "Lucas Mendes", time: "09:00", abord: "TCC", confirmed: true },
  { name: "Mariana Costa", time: "10:30", abord: "Ansiedade", confirmed: true },
  { name: "Rafael Souza", time: "14:00", abord: "Depressão", confirmed: false },
]

function SparkleIcon({ size = 14, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2 L13.5 10.5 L22 12 L13.5 13.5 L12 22 L10.5 13.5 L2 12 L10.5 10.5 Z" />
    </svg>
  )
}

function DashboardMockup() {
  return (
    <div className="relative w-full mx-auto">
      <div
        className="absolute -inset-8 rounded-3xl blur-3xl pointer-events-none will-change-transform"
        style={{ background: `radial-gradient(ellipse at 50% 40%, rgba(37,99,235,0.13) 0%, transparent 70%)` }}
      />

      <div className="relative rounded-t-2xl border border-blue-100/80 bg-white overflow-hidden shadow-[0_-4px_40px_0_rgba(37,99,235,0.12),0_24px_80px_-8px_rgba(37,99,235,0.18)]">
        {/* Browser chrome */}
        <div className="flex items-center gap-2 px-4 py-3 bg-slate-50/80 border-b border-slate-100 backdrop-blur-sm">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
            <span className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
            <span className="w-3 h-3 rounded-full bg-[#28C840]" />
          </div>
          <div className="flex-1 mx-3">
            <div className="max-w-xs mx-auto bg-white border border-slate-200 rounded-lg px-3 py-1 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400" />
              <span className="text-[11px] text-slate-400 font-mono truncate">app.mindflush.com.br</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: BRAND }}>
              <Brain size={12} weight="bold" className="text-white" />
            </div>
            <span className="text-[11px] font-semibold text-slate-600 hidden sm:inline">MindFlush</span>
          </div>
        </div>

        {/* App UI */}
        <div className="flex h-[400px] bg-slate-50">
          {/* Sidebar */}
          <div className="w-[200px] border-r border-slate-100 bg-white flex-col shrink-0 hidden md:flex">
            <div className="px-4 py-4 border-b border-slate-50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center shadow-sm" style={{ background: `linear-gradient(135deg, ${BRAND}, ${BRAND_LIGHT})` }}>
                  <Brain size={16} weight="bold" className="text-white" />
                </div>
                <div>
                  <span className="text-[12px] font-bold text-slate-800 block leading-none">MindFlush</span>
                  <span className="text-[9px] text-slate-400">Pro Plan</span>
                </div>
              </div>
            </div>
            <div className="flex-1 px-2 py-3 space-y-0.5">
              {SIDEBAR_ITEMS.map(({ icon: Icon, label, active }) => (
                <div
                  key={label}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors"
                  style={active ? { background: BRAND_MUTED, color: BRAND } : { color: "#94a3b8" }}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span className="text-[11px] font-medium">{label}</span>
                  {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500" />}
                </div>
              ))}
            </div>
            <div className="px-3 pb-3">
              <div className="rounded-xl p-3 border border-blue-100" style={{ background: BRAND_MUTED }}>
                <p className="text-[10px] font-semibold text-blue-700 mb-1">Upgrade para Pro</p>
                <p className="text-[9px] text-blue-500 leading-tight">Desbloqueie relatórios avançados</p>
              </div>
            </div>
          </div>

          {/* Main */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Top bar */}
            <div className="flex items-center justify-between px-5 py-3.5 bg-white border-b border-slate-100">
              <div>
                <p className="text-[10px] text-slate-400">Segunda-feira, 3 de Junho de 2025</p>
                <p className="text-[13.5px] font-bold text-slate-800">Bom dia, Dra. Ana Beatriz 👋</p>
              </div>
              <button
                className="flex items-center gap-1.5 text-white text-[11px] font-bold px-3.5 py-2 rounded-xl shadow-md"
                style={{ background: `linear-gradient(135deg, ${BRAND}, ${BRAND_LIGHT})`, boxShadow: "0 4px 12px rgba(37,99,235,0.3)" }}
              >
                + Nova Sessão
              </button>
            </div>

            <div className="flex-1 px-5 py-4 overflow-hidden">
              {/* Metric cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                {METRIC_CARDS.map(({ label, value, icon: Icon, color, bg }) => (
                  <div key={label} className="bg-white rounded-xl p-3.5 border border-slate-100 shadow-sm">
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-[9.5px] text-slate-400 leading-tight flex-1 pr-2">{label}</p>
                      <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0" style={{ background: bg }}>
                        <Icon className="w-3 h-3" style={{ color }} />
                      </div>
                    </div>
                    <p className="text-[18px] font-bold leading-none" style={{ color }}>{value}</p>
                  </div>
                ))}
              </div>

              {/* Session list */}
              <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                  <div className="flex items-center gap-2">
                    <span className="text-[11.5px] font-bold text-slate-800">Próximas Sessões</span>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-600">Hoje</span>
                  </div>
                  <span className="text-[10px] font-semibold text-blue-500">Ver agenda →</span>
                </div>
                {APPOINTMENTS.map(({ name, time, abord, confirmed }) => (
                  <div key={name} className="flex items-center justify-between px-4 py-2.5 border-b border-slate-50/80 last:border-0 hover:bg-blue-50/20 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0"
                        style={{ background: AVATAR_GRADIENT }}
                      >
                        {name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11.5px] font-semibold text-slate-800 truncate">{name}</p>
                        <p className="text-[10px] text-slate-400">{abord}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10.5px] font-medium text-slate-400">{time}</span>
                      <span
                        className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                        style={confirmed ? STATUS_CONFIRMED : STATUS_PENDING}
                      >
                        {confirmed ? "Confirmado" : "Pendente"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating card — confirmed */}
      <motion.div
        initial={{ opacity: 0, x: 20, y: -10 }}
        whileInView={{ opacity: 1, x: 0, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="absolute -top-6 right-6 md:right-0 md:-translate-x-6 bg-white rounded-2xl border border-slate-100 shadow-2xl px-4 py-3 flex items-center gap-3 sm:flex"
      >
        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
          <CheckCircle className="w-5 h-5 text-emerald-500" />
        </div>
        <div>
          <p className="text-[11.5px] font-bold text-slate-800">Prontuário salvo</p>
          <p className="text-[10px] text-slate-400">Sessão encerrada • agora</p>
        </div>
      </motion.div>

      {/* Floating card — social proof */}
      <motion.div
        initial={{ opacity: 0, x: -20, y: 10 }}
        whileInView={{ opacity: 1, x: 0, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.7, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-16 -left-4 md:-left-8 bg-white rounded-2xl border border-slate-100 shadow-2xl px-4 py-3 hidden sm:block"
      >
        <div className="flex items-center gap-2 mb-1">
          <div className="flex">
            {AVATARS.map((url, i) => (
              <img key={i} src={url} width={22} height={22} loading="lazy"
                className="w-[22px] h-[22px] rounded-full border-2 border-white object-cover -ml-2 first:ml-0" alt="" />
            ))}
          </div>
          <span className="text-[11.5px] font-bold text-slate-800">+1.200 psicólogos</span>
        </div>
        <p className="text-[10px] text-slate-400">confiam no MindFlush</p>
      </motion.div>
    </div>
  )
}

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#F7F9FF] pt-20 md:pt-28">
      {/* Background grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(37,99,235,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.05) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Top radial glow */}
      <div
        className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[600px] pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 50% 0%, rgba(37,99,235,0.18) 0%, transparent 60%)` }}
      />

      {/* Sparkle decorations */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-28 left-[8%] text-blue-300/60 hidden lg:block"
      >
        <SparkleIcon size={20} />
      </motion.div>
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute top-40 right-[10%] text-blue-400/50 hidden lg:block"
      >
        <SparkleIcon size={14} />
      </motion.div>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute top-64 left-[20%] text-blue-200/70 hidden xl:block"
      >
        <SparkleIcon size={10} />
      </motion.div>
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        className="absolute top-52 right-[22%] text-blue-300/50 hidden xl:block"
      >
        <SparkleIcon size={16} />
      </motion.div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6">

        {/* Social proof pill */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="flex justify-center mb-10"
        >
          <div className="inline-flex items-center gap-3 bg-white/90 border border-blue-100 rounded-full py-1.5 pl-2 pr-5 shadow-sm backdrop-blur-sm">
            <div className="flex">
              {AVATARS.slice(0, 3).map((url, i) => (
                <img key={i} src={url} width={26} height={26} loading="lazy"
                  className="w-[26px] h-[26px] rounded-full border-2 border-white object-cover -ml-2 first:ml-0" alt="" />
              ))}
            </div>
            <div className="flex items-center gap-1.5">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
              <span className="text-[12px] text-slate-500">
                <strong className="text-slate-700 font-semibold">+1.200 psicólogos</strong> já usam o MindFlush
              </span>
            </div>
          </div>
        </motion.div>

        {/* Headline */}
        <div className="text-center mb-6">
          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.08 }}
            className="font-title text-[clamp(40px,6vw,72px)] font-semibold tracking-tight text-slate-900 leading-[1.09]"
          >
            Foque no paciente{" "}
            <span className="inline-block align-middle mb-1">
              <Brain size="0.8em" weight="bold" style={{ color: BRAND }} />
            </span>
            <br />
            A gestão{" "}
            <span
              className="relative inline-block"
              style={{
                background: `linear-gradient(135deg, ${BRAND} 0%, ${BRAND_LIGHT} 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              fica conosco
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.95, duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
                className="absolute -bottom-1 left-0 right-0 h-[6px] rounded-full origin-left -z-10"
                style={{ background: `linear-gradient(90deg, rgba(37,99,235,0.25), rgba(59,130,246,0.1))` }}
              />
            </span>
            {" "}
            <span className="inline-flex items-center gap-1.5 text-[0.48em] font-semibold bg-blue-50 border border-blue-200/80 text-blue-600 rounded-full px-3 py-1.5 align-middle mb-1 whitespace-nowrap">
              <Zap className="w-3 h-3 fill-blue-500" />
              em minutos por dia
            </span>
          </motion.h1>
        </div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="text-center max-w-[460px] mx-auto text-[16.5px] text-slate-500 font-light leading-relaxed mb-9"
        >
          Prontuários, agendamento, financeiro e videochamadas
          em um só lugar — feito para psicólogos.
        </motion.p>

        {/* Platform logos */}
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
            <span key={p} className="text-[10px] font-semibold uppercase tracking-wide bg-white border border-slate-200/80 text-slate-400 px-2.5 py-[3px] rounded-full shadow-sm">
              {p}
            </span>
          ))}
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.34, duration: 0.7 }}
          className="flex items-center justify-center gap-3 mb-5"
        >
          <Link
            to="/sign-up"
            className="group inline-flex items-center gap-2 text-white text-[15px] font-bold px-8 py-3.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98]"
            style={{
              background: `linear-gradient(135deg, ${BRAND} 0%, ${BRAND_LIGHT} 100%)`,
              boxShadow: `0 4px 16px rgba(37,99,235,0.35), 0 1px 3px rgba(37,99,235,0.2)`,
            }}
          >
            Começar Grátis
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>

          <button className="group inline-flex items-center gap-2.5 bg-white hover:bg-slate-50 text-slate-600 text-[15px] font-medium px-6 py-3.5 rounded-xl transition-all duration-200 border border-slate-200 hover:border-blue-200 cursor-pointer shadow-sm hover:shadow-md">
            <span
              className="w-7 h-7 rounded-full border flex items-center justify-center transition-all duration-200 group-hover:border-blue-300 shrink-0"
              style={{ borderColor: "#dbeafe", background: BRAND_MUTED }}
            >
              <Play className="w-2.5 h-2.5 ml-0.5" style={{ color: BRAND }} />
            </span>
            Ver demonstração
          </button>
        </motion.div>

        {/* Trust bullets */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.44, duration: 0.6 }}
          className="flex items-center justify-center gap-5 mb-14 flex-wrap"
        >
          {["14 dias grátis", "Sem cartão de crédito", "LGPD compliant"].map((item) => (
            <div key={item} className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                <Check className="w-2.5 h-2.5 text-blue-500" />
              </div>
              <span className="text-[12.5px] text-slate-400">{item}</span>
            </div>
          ))}
        </motion.div>

        {/* Dashboard mockup — overflows section */}
        <motion.div
          initial={{ opacity: 0, y: 48 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          className="relative px-0 sm:px-4 md:px-8"
        >
          <DashboardMockup />
          <div
            className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none"
            style={{ background: "linear-gradient(to top, #F7F9FF 0%, transparent 100%)" }}
          />
        </motion.div>

      </div>
    </section>
  )
}