import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { List, X, ArrowRight, Brain } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import './header.css'

const navLinks = [
  { href: '#funcionalidades', label: 'Por que MindFlush' },
  { href: '#integracoes', label: 'Funcionalidades' },
  { href: '#depoimentos', label: 'Depoimentos' },
  { href: '#precos', label: 'Preços' },
]

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 16)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="lp-hdr"
    >
      <div className="mx-auto w-full max-w-5xl">
        <div
          className={cn(
            'lp-hdr-bar',
            scrolled ? 'lp-hdr-bar--scrolled' : 'lp-hdr-bar--top',
          )}
        >
          <div className="lp-hdr-shimmer" />

          <div className="relative z-10">
            <Link to="/" className="flex items-center gap-2 px-3.5 py-1.5">
              <Brain size={18} strokeWidth={2.5} className="text-primary" />
              <span className="text-[15px] font-semibold tracking-wide text-blue-700">
                MindFlush
              </span>
            </Link>
          </div>

          <nav className="relative z-10 hidden items-center gap-0.5 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="lp-hdr-nav-link group"
              >
                {link.label}
                <span className="lp-hdr-nav-underline" />
              </a>
            ))}
          </nav>

          <div className="relative z-10 ml-2 flex items-center gap-2">
            <Button
              asChild
              variant="ghost"
              className="lp-hdr-btn-outline hidden sm:inline-flex"
            >
              <Link to="/sign-in">Entrar</Link>
            </Button>

            <Button asChild variant="ghost" className="lp-hdr-btn-primary">
              <Link to="/sign-up">
                Começar Grátis
                <ArrowRight className="size-3" data-icon="inline-end" />
              </Link>
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={isMenuOpen}
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="lp-hdr-hamburger"
            >
              {isMenuOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <List className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="lp-hdr-mobile-menu"
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
                    className="lp-hdr-mobile-link"
                  >
                    {link.label}
                  </motion.a>
                ))}
              </nav>

              <div className="mt-3 flex flex-col gap-2 border-t border-blue-100 pt-3">
                <Button
                  asChild
                  variant="ghost"
                  className="lp-hdr-btn-outline-mobile"
                >
                  <Link to="/sign-in" onClick={() => setIsMenuOpen(false)}>
                    Entrar
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  className="lp-hdr-btn-primary-mobile"
                >
                  <Link to="/sign-up" onClick={() => setIsMenuOpen(false)}>
                    Começar Grátis
                    <ArrowRight className="h-4 w-4" data-icon="inline-end" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  )
}
