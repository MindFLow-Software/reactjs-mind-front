'use client'

import { Link } from 'react-router-dom'
import { Bell, Slash } from 'lucide-react'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { useHeaderStore } from '@/store/use-header-store'
import { cn } from '@/lib/utils'

export function Header() {
  const { title, titleHref, subtitle, subtitleHref } = useHeaderStore()

  return (
    <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center gap-4 border-b bg-white/95 px-6 backdrop-blur supports-backdrop-filter:bg-white/60">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />

        <nav
          className="flex items-center gap-2 text-sm"
          aria-label="Breadcrumb"
        >
          <Link
            to="/dashboard"
            className="text-muted-foreground hover:text-foreground transition-colors hidden sm:inline-block"
          >
            MindFlush
          </Link>
          <Slash className="h-4 w-4 text-muted-foreground/50 hidden sm:inline-block" />

          {titleHref ? (
            <Link
              to={titleHref}
              className={cn(
                'transition-colors duration-300 hover:text-foreground',
                subtitle
                  ? 'text-muted-foreground'
                  : 'font-semibold text-foreground',
              )}
            >
              {title}
            </Link>
          ) : (
            <span
              className={cn(
                'transition-colors duration-300',
                subtitle
                  ? 'text-muted-foreground'
                  : 'font-semibold text-foreground',
              )}
            >
              {title}
            </span>
          )}

          {subtitle && (
            <>
              <Slash className="h-4 w-4 text-muted-foreground/50" />
              {subtitleHref ? (
                <Link
                  to={subtitleHref}
                  className="font-semibold text-foreground hover:text-blue-600 transition-colors animate-in fade-in slide-in-from-left-2 duration-300"
                >
                  {subtitle}
                </Link>
              ) : (
                <span className="font-semibold text-foreground animate-in fade-in slide-in-from-left-2 duration-300">
                  {subtitle}
                </span>
              )}
            </>
          )}
        </nav>
      </div>

      <div className="flex-1" />

      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="relative text-muted-foreground hover:text-foreground"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-red-600 border-2 border-background"></span>
          <span className="sr-only">Notificações</span>
        </Button>
      </div>
    </header>
  )
}
