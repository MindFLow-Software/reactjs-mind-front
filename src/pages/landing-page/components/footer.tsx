import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { Brain, InstagramLogo, LinkedinLogo, YoutubeLogo } from "@phosphor-icons/react"
import { ArrowRight, Shield, Clock } from "lucide-react"

const BRAND = "#2563eb"
const BRAND_LIGHT = "#3b82f6"

function XIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zM17.083 20.026h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

const LINK_GROUPS = [
  {
    title: "Produto",
    links: [
      { label: "Funcionalidades", href: "#funcionalidades" },
      { label: "Integrações", href: "#integracoes" },
      { label: "Planos e Preços", href: "#planos" },
      { label: "Novidades", href: "#" },
    ],
  },
  {
    title: "Conta",
    links: [
      { label: "Criar conta grátis", to: "/sign-up" },
      { label: "Fazer login", to: "/sign-in" },
      { label: "Recuperar senha", to: "/forgot-password" },
    ],
  },
  {
    title: "Suporte",
    links: [
      { label: "Central de Ajuda", href: "#" },
      { label: "Falar no WhatsApp", href: "#" },
      { label: "ajuda@mindflush.com.br", href: "mailto:ajuda@mindflush.com.br" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Termos de Uso", to: "/termos" },
      { label: "Privacidade", to: "/privacidade" },
      { label: "Política de Cookies", to: "/cookies" },
      { label: "Status do sistema", href: "#" },
    ],
  },
]

const SOCIALS = [
  { icon: LinkedinLogo, href: "#", label: "LinkedIn", hoverColor: "#0A66C2" },
  { icon: InstagramLogo, href: "#", label: "Instagram", hoverColor: "#E1306C" },
  { icon: YoutubeLogo, href: "#", label: "YouTube", hoverColor: "#FF0000" },
]

function LinkItem({ link }: { link: { label: string; to?: string; href?: string } }) {
  const className =
    "group relative w-fit text-[13px] font-light text-slate-500 no-underline transition-colors duration-200 hover:text-blue-600"
  const inner = (
    <>
      {link.label}
      <span className="absolute -bottom-px left-0 right-0 h-px origin-left scale-x-0 rounded-full bg-blue-500 transition-transform duration-300 group-hover:scale-x-100" />
    </>
  )

  if (link.to) return <Link to={link.to} className={className}>{inner}</Link>
  return <a href={link.href} className={className}>{inner}</a>
}

export function Footer() {
  return (
    <footer className="w-full border-t border-slate-100 bg-white">

      {/* CTA Strip */}
      <div
        className="relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${BRAND} 0%, ${BRAND_LIGHT} 100%)` }}
      >
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        <div className="container relative mx-auto px-6 py-14 md:px-8 lg:px-12">
          <div className="flex flex-col items-center gap-8 text-center lg:flex-row lg:justify-between lg:text-left">
            <div>
              <h2
                className="text-[clamp(22px,3vw,34px)] font-semibold tracking-tight text-white leading-[1.2] mb-2"
                style={{ fontFamily: "'Lora', serif" }}
              >
                Pronto para simplificar seu consultório?
              </h2>
              <p className="text-[15px] font-light text-blue-100 max-w-[420px]">
                Junte-se a mais de 1.200 psicólogos que já recuperaram horas do seu dia.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <div className="flex items-center gap-4 text-[12px] text-blue-100 font-light">
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  14 dias grátis
                </span>
                <span className="flex items-center gap-1.5">
                  <Shield className="h-3.5 w-3.5" />
                  LGPD compliant
                </span>
              </div>
              <Link
                to="/sign-up"
                className="group inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-[14px] font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                style={{ color: BRAND }}
              >
                Começar grátis
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer body */}
      <div className="container mx-auto px-6 md:px-8 lg:px-12">
        <div className="flex flex-col gap-12 lg:flex-row lg:gap-16 py-14">

          {/* Brand column */}
          <div className="flex flex-col lg:w-[220px] lg:shrink-0">
            <Link to="/" className="group flex items-center gap-2 mb-4 transition-opacity hover:opacity-80 w-fit">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center shadow-sm"
                style={{ background: `linear-gradient(135deg, ${BRAND}, ${BRAND_LIGHT})` }}
              >
                <Brain size={16} weight="bold" className="text-white" />
              </div>
              <span
                className="text-[17px] font-semibold tracking-tight text-slate-900"
                style={{ fontFamily: "'Lora', serif" }}
              >
                MindFlush
              </span>
            </Link>

            <p className="text-[13px] font-light leading-relaxed text-slate-500 mb-6">
              Simplificando a gestão de consultórios de psicologia em todo o Brasil.
            </p>

            <div className="flex items-center gap-3">
              {SOCIALS.map(({ icon: Icon, href, label, hoverColor }) => (
                <motion.a
                  key={label}
                  href={href}
                  aria-label={label}
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-100 bg-slate-50 text-slate-400 transition-colors duration-200"
                  style={{ ["--hover-color" as string]: hoverColor }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = hoverColor)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "")}
                >
                  <Icon size={16} />
                </motion.a>
              ))}
              <motion.a
                href="#"
                aria-label="X (Twitter)"
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-100 bg-slate-50 text-slate-400 transition-colors duration-200 hover:text-slate-900"
              >
                <XIcon size={14} />
              </motion.a>
            </div>
          </div>

          {/* Links grid */}
          <div className="grid flex-1 grid-cols-2 gap-8 md:grid-cols-4">
            {LINK_GROUPS.map((group) => (
              <div key={group.title} className="flex flex-col gap-3">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                  {group.title}
                </span>
                <nav className="flex flex-col gap-2.5">
                  {group.links.map((link) => (
                    <LinkItem key={link.label} link={link} />
                  ))}
                </nav>
              </div>
            ))}
          </div>

        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-100 py-6 md:flex-row">
          <span className="text-[12.5px] font-light text-slate-400">
            &copy; {new Date().getFullYear()} MindFlush. Todos os direitos reservados.
          </span>
          <span className="text-[12px] font-light text-slate-300">
            Feito com cuidado para psicólogos brasileiros 🧠
          </span>
        </div>
      </div>

    </footer>
  )
}
