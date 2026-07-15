'use client'

import { Link } from 'react-router-dom'
import { Bell, Slash } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { useHeaderStore } from '@/store/use-header-store'

import './header.css'

export function Header() {
  const { title, titleHref, subtitle, subtitleHref } = useHeaderStore()

  const titleClass = cn(
    'hdr-crumb',
    subtitle ? 'hdr-crumb-muted' : 'hdr-crumb-current',
  )

  return (
    <header className="hdr-root">
      <div className="hdr-crumbs-left">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />

        <nav className="hdr-nav" aria-label="Breadcrumb">
          <Link to="/dashboard" className="hdr-brand-link">
            MindFlush
          </Link>
          <Slash className="hdr-slash" />

          {titleHref ? (
            <Link to={titleHref} className={titleClass}>
              {title}
            </Link>
          ) : (
            <span className={titleClass}>{title}</span>
          )}

          {subtitle && (
            <>
              <Slash className="hdr-slash-visible" />
              {subtitleHref ? (
                <Link to={subtitleHref} className="hdr-subtitle">
                  {subtitle}
                </Link>
              ) : (
                <span className="hdr-subtitle-static">{subtitle}</span>
              )}
            </>
          )}
        </nav>
      </div>

      <div className="hdr-spacer" />

      <div className="hdr-actions">
        <Button variant="ghost" size="icon" className="hdr-bell-btn">
          <Bell className="h-5 w-5" />
          <span className="hdr-bell-dot" />
          <span className="sr-only">Notificações</span>
        </Button>
      </div>
    </header>
  )
}
