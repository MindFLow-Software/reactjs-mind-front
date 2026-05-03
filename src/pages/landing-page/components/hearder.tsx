import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Brain } from "@phosphor-icons/react"
import { List, X, ArrowRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const navLinks = [
  { href: "#funcionalidades", label: "Por que MindFlush" },
  { href: "#integracoes", label: "Funcionalidades" },
  { href: "#depoimentos", label: "Depoimentos" },
  { href: "#precos", label: "Preços" },
]

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 16)
    window.addEventListener("scroll", handler, { passive: true })
    return () => window.removeEventListener("scroll", handler)
  }, [])

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-0 z-50 w-full px-4 pt-4 md:px-6"
    >
      <div className="mx-auto w-full max-w-5xl">
        <div
          className={`relative flex items-center justify-between rounded-full border px-2 py-3 backdrop-blur-xl transition-all duration-300 ${
            scrolled
              ? "border-blue-200/90 bg-white/95 shadow-[0_8px_32px_-12px_rgba(37,99,235,0.30)]"
              : "border-blue-100/80 bg-white/85 shadow-[0_18px_40px_-20px_rgba(37,99,235,0.5)]"
          }`}
        >
          {/* Shimmer gradient overlay */}
          <div
            className="pointer-events-none absolute inset-0 rounded-full opacity-80"
            style={{
              background:
                "linear-gradient(90deg, rgba(255,255,255,0.7), rgba(239,246,255,0.7), rgba(255,255,255,0.7))",
            }}
          />

          {/* Logo */}
          <div className="relative z-10">
            <Link
              to="/"
              className="flex items-center gap-2 px-3.5 py-1.5"
            >
              <Brain size={18} weight="bold" className="text-blue-700" />
              <span className="text-[15px] font-semibold tracking-wide text-blue-700">MindFlush</span>
            </Link>
          </div>

          {/* Nav */}
          <nav className="relative z-10 hidden items-center gap-0.5 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="group relative rounded-full px-3 py-1.5 text-[15px] font-medium text-slate-600 transition-colors duration-200 hover:text-blue-700"
              >
                {link.label}
                <span className="absolute inset-x-2 -bottom-[2px] h-[2px] origin-left scale-x-0 rounded-full bg-blue-500 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />
              </a>
            ))}
          </nav>

          {/* CTAs */}
          <div className="relative z-10 ml-2 flex items-center gap-2">
            <Link to="/sign-in" className="hidden sm:inline-flex">
              <button className="cursor-pointer rounded-full border border-blue-200 bg-white px-3.5 py-1.5 text-[15px] font-semibold text-blue-700 transition-all duration-200 hover:-translate-y-px hover:border-blue-300 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300">
                Entrar
              </button>
            </Link>

            <Link to="/sign-up">
              <button
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-full px-4 py-1.5 text-[15px] font-semibold text-white transition-all duration-200 hover:-translate-y-px active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
                style={{
                  background: "linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)",
                  boxShadow: "0 8px 20px -8px rgba(37,99,235,0.55)",
                }}
              >
                Começar Grátis
                <ArrowRight className="h-3 w-3" />
              </button>
            </Link>

            {/* Mobile hamburger */}
            <button
              type="button"
              aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
              aria-expanded={isMenuOpen}
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-blue-200 bg-white text-slate-700 transition-colors hover:bg-blue-50 md:hidden"
            >
              {isMenuOpen ? <X className="h-4 w-4" /> : <List className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="mt-2 rounded-2xl border border-blue-100 bg-white/95 p-3 shadow-[0_18px_40px_-20px_rgba(37,99,235,0.45)] backdrop-blur-xl md:hidden"
            >
              <nav className="flex flex-col gap-0.5">
                {navLinks.map((link, i) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.2 }}
                    onClick={() => setIsMenuOpen(false)}
                    className="rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-blue-50 hover:text-blue-700"
                  >
                    {link.label}
                  </motion.a>
                ))}
              </nav>

              <div className="mt-3 flex flex-col gap-2 border-t border-blue-100 pt-3">
                <Link to="/sign-in" onClick={() => setIsMenuOpen(false)}>
                  <button className="w-full rounded-xl border border-blue-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-50">
                    Entrar
                  </button>
                </Link>
                <Link to="/sign-up" onClick={() => setIsMenuOpen(false)}>
                  <button
                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-white transition-all active:scale-[0.98]"
                    style={{
                      background: "linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)",
                      boxShadow: "0 4px 12px rgba(37,99,235,0.35)",
                    }}
                  >
                    Começar Grátis
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  )
}
