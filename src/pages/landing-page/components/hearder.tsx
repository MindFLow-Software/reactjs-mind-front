import { Link } from "react-router-dom"
import { Brain } from "@phosphor-icons/react"

const navLinks = [
  { href: "#funcionalidades", label: "Funcionalidades" },
  { href: "#integracoes", label: "Integrações" },
  { href: "#solucoes", label: "Soluções" },
  { href: "#depoimentos", label: "Depoimentos" },
]

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-blue-600/10 bg-[rgba(248,250,255,0.85)] backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center px-6 md:px-8 lg:px-12">

        {/* Logo */}
        <div className="flex flex-1 items-center justify-start">
          <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <Brain size={28} weight="bold" className="text-blue-600" />
            <span
              className="hidden text-[19px] font-medium tracking-tight text-slate-900 lg:inline-block"
              style={{ fontFamily: "'Lora', serif" }}
            >
              MindFlush
            </span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="group relative pb-0.5 text-sm font-normal text-[#4B6080] transition-colors hover:text-blue-600"
            >
              {link.label}
              <span className="absolute bottom-0 left-0 right-0 h-[1.5px] origin-left scale-x-0 rounded-full bg-blue-600 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex flex-1 items-center justify-end gap-2">
          <Link to="/sign-in">
            <button className="hidden cursor-pointer rounded-lg px-3.5 py-1.5 text-sm font-normal text-[#4B6080] transition-all hover:bg-blue-600/[0.06] hover:text-blue-600 md:inline-flex bg-transparent border-none">
              Login
            </button>
          </Link>
          <Link to="/sign-up">
            <button className="cursor-pointer rounded-[10px] bg-blue-600 px-[18px] py-2 text-sm font-medium text-white shadow-[0_2px_8px_rgba(37,99,235,0.2)] transition-all hover:bg-blue-700 hover:-translate-y-px active:scale-[0.98] border-none">
              Cadastre-se
            </button>
          </Link>
        </div>

      </div>
    </header>
  )
}