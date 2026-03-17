import { Link } from "react-router-dom"
import { Brain, InstagramLogo, LinkedinLogo, YoutubeLogo } from "@phosphor-icons/react"

const XIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zM17.083 20.026h1.833L7.084 4.126H5.117z" />
    </svg>
)

const linkGroups = [
    {
        title: "Conta",
        links: [
            { label: "Cadastre-se", to: "/sign-up" },
            { label: "Login", to: "/sign-in" },
        ],
    },
    {
        title: "Suporte",
        links: [
            { label: "ajuda@mindflush.com", href: "mailto:ajuda@mindflush.com" },
            { label: "Falar no WhatsApp", href: "#" },
            { label: "Central de Ajuda", href: "#" },
        ],
    },
    {
        title: "Website",
        links: [
            { label: "Funcionalidades", href: "#funcionalidades" },
            { label: "Integrações", href: "#integracoes" },
            { label: "Planos e Preços", href: "#taxas" },
            { label: "Documentação", href: "#documentacao" },
        ],
    },
    {
        title: "Legal",
        links: [
            { label: "Termos de uso", to: "/termos" },
            { label: "Privacidade", to: "/privacidade" },
            { label: "Status do sistema", href: "#" },
        ],
    },
]

const linkClass =
    "group relative w-fit text-[13px] font-light text-[#4B6080] no-underline transition-colors hover:text-blue-600"

const LinkItem = ({ link }: { link: { label: string; to?: string; href?: string } }) => {
    const inner = (
        <>
            {link.label}
            <span className="absolute -bottom-px left-0 right-0 h-px origin-left scale-x-0 rounded-full bg-blue-600 transition-transform duration-300 group-hover:scale-x-100" />
        </>
    )

    if (link.to) {
        return (
            <Link to={link.to} className={linkClass}>
                {inner}
            </Link>
        )
    }

    return (
        <a href={link.href} className={linkClass}>
            {inner}
        </a>
    )
}

export function Footer() {
    return (
        <footer className="w-full bg-white border-t border-blue-600/10 pt-16 md:pt-20">
            <div className="container mx-auto px-6 md:px-8 lg:px-12">

                {/* Top */}
                <div className="flex flex-col gap-12 lg:flex-row lg:gap-12 pb-14">

                    {/* Brand */}
                    <div className="flex flex-col lg:w-[220px] lg:flex-shrink-0 lg:border-r lg:border-blue-600/[0.08] lg:pr-12">
                        <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-80 mb-4">
                            <Brain size={28} weight="bold" className="text-blue-600" />
                            <span
                                className="text-[18px] font-medium tracking-tight text-slate-900"
                                style={{ fontFamily: "'Lora', serif" }}
                            >
                                MindFlush
                            </span>
                        </Link>
                        <p className="text-[13px] font-light leading-relaxed text-[#4B6080]">
                            Simplificando a gestão de clínicas de psicologia em todo o Brasil.
                        </p>
                    </div>

                    {/* Links */}
                    <div className="grid flex-1 grid-cols-2 gap-8 md:grid-cols-4">
                        {linkGroups.map((group) => (
                            <div key={group.title} className="flex flex-col gap-3.5">
                                <span className="text-[11px] font-medium uppercase tracking-widest text-blue-600">
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

                {/* Bottom */}
                <div className="flex flex-col items-center justify-between gap-4 border-t border-dashed border-blue-600/10 py-6 md:flex-row">
                    <span className="text-[13px] font-light text-slate-400">
                        Painel central &copy; MindFlush — {new Date().getFullYear()}
                    </span>

                    <div className="flex items-center gap-5">
                        <a href="#" className="text-slate-300 transition-all duration-200 hover:-translate-y-0.5 hover:text-[#0A66C2]">
                            <LinkedinLogo size={20} />
                        </a>
                        <a href="#" className="text-slate-300 transition-all duration-200 hover:-translate-y-0.5 hover:text-[#E1306C]">
                            <InstagramLogo size={20} />
                        </a>
                        <a href="#" className="text-slate-300 transition-all duration-200 hover:-translate-y-0.5 hover:text-slate-900">
                            <XIcon />
                        </a>
                        <a href="#" className="text-slate-300 transition-all duration-200 hover:-translate-y-0.5 hover:text-[#FF0000]">
                            <YoutubeLogo size={20} />
                        </a>
                    </div>
                </div>

            </div>
        </footer>
    )
}