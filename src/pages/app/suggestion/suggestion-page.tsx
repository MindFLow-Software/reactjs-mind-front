'use client'

import { useEffect, useRef, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import {
  Hand,
  Search,
  XCircle,
  Plus,
  ChevronsUp,
  Zap,
  Check,
  ListFilter,
  BadgeCheck,
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'

import { useHeaderStore } from '@/store/use-header-store'
import { useDebounce } from '@/hooks/use-debounce'
import { getSuggestions } from '@/api/suggestions/get-suggestions'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { StatCard } from '@/components/stat-card'
import { cn } from '@/lib/utils'
import type { SuggestionCategory } from '@/types/suggestion/suggestion-category'
import { SuggestionColumn } from './components/board/suggestion-column'
import { SuggestionFilterChip } from './components/board/suggestion-filter-chip'
import { CreateSuggestion } from './components/create/create-suggestion'
import { SuggestionHelpButton } from './components/help/suggestion-help-button'
import {
  SUGGESTION_FILTER_CATEGORIES,
  SUGGESTION_COLUMN_CONFIG,
} from './suggestion-page-constants'
import './suggestion-page.css'

export function SuggestionPage() {
  const { setTitle } = useHeaderStore()
  const [search, setSearch] = useState('')
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] =
    useState<SuggestionCategory | null>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const debouncedSearch = useDebounce(search, 400)

  useEffect(() => {
    setTitle('Envios da Comunidade')
  }, [setTitle])

  const { data: suggestions, isLoading } = useQuery({
    queryKey: ['suggestions', debouncedSearch],
    queryFn: () =>
      getSuggestions({ search: debouncedSearch, sortBy: 'most_voted' }),
  })

  const totalCount = suggestions?.length ?? 0

  const filterByStatus = (status: SuggestionCategory | string) => {
    let filtered = suggestions?.filter((s) => s.status === status) ?? []
    if (selectedCategory)
      filtered = filtered.filter((s) => s.category === selectedCategory)
    return filtered
  }

  const categoryCount = (cat: SuggestionCategory) =>
    suggestions?.filter((s) => s.category === cat).length ?? 0

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement).tagName
      if (e.key === '/' && tag !== 'INPUT' && tag !== 'TEXTAREA') {
        e.preventDefault()
        searchInputRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <>
      <Helmet title="Envios da Comunidade" />

      <div className="sp-root">
        <header className="sp-header">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-3">
              <Hand className="size-6 text-blue-600" />
              <span>Sugestões da Comunidade</span>
            </h1>
            <p className="text-sm text-muted-foreground">
              Compartilhe ideias para melhorar o Mind — as mais votadas viram
              prioridade no desenvolvimento.
            </p>
          </div>
          <div className="shrink-0">
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  className="cursor-pointer gap-2 w-full lg:w-auto bg-blue-600 hover:bg-blue-700 shadow-sm transition-all"
                >
                  <Plus className="h-4 w-4" />
                  Nova sugestão
                </Button>
              </DialogTrigger>
              <CreateSuggestion onSuccess={() => setIsCreateOpen(false)} />
            </Dialog>
          </div>
        </header>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 shrink-0">
          <StatCard
            data={{
              icon: <BadgeCheck className="size-5 text-blue-500" />,
              iconBg: 'bg-blue-50 dark:bg-blue-950/30',
              value: '128',
              label: 'Sugestões totais',
            }}
          />
          <StatCard
            data={{
              icon: <ChevronsUp className="size-5 text-violet-500" />,
              iconBg: 'bg-violet-50 dark:bg-violet-950/30',
              value: '2.341',
              label: 'Votos da comunidade',
              trend: '+84 esta semana',
            }}
          />
          <StatCard
            data={{
              icon: <Zap className="size-5 text-red-500" />,
              iconBg: 'bg-red-50 dark:bg-red-950/30',
              value: '9',
              label: 'Em produção agora',
            }}
          />
          <StatCard
            data={{
              icon: <Check className="size-5 text-emerald-600" />,
              iconBg: 'bg-emerald-50 dark:bg-emerald-950/30',
              value: '42',
              label: 'Já implementadas',
              trend: '+6 nos últimos 30d',
            }}
          />
        </div>

        <div className="sp-toolbar">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative flex-1 min-w-[160px]">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
              <Input
                ref={searchInputRef}
                placeholder="Buscar sugestões"
                className="h-8 w-full pl-8 text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <XCircle className="size-3.5" />
                </button>
              )}
            </div>

            <button className="sp-sort-chip">
              <ListFilter className="size-3.5" />
              Mais votadas
            </button>

            <div className="h-4 w-px bg-border shrink-0" />

            <div className="flex items-center gap-1.5 flex-wrap">
              <SuggestionFilterChip
                data={{ label: 'Todas', count: totalCount }}
                isActive={selectedCategory === null}
                onClick={() => setSelectedCategory(null)}
              />
              {SUGGESTION_FILTER_CATEGORIES.map((cat) => (
                <SuggestionFilterChip
                  key={cat.value}
                  data={{
                    label: cat.label,
                    count: categoryCount(cat.value),
                    dot: cat.dot,
                  }}
                  isActive={selectedCategory === cat.value}
                  onClick={() =>
                    setSelectedCategory(
                      selectedCategory === cat.value ? null : cat.value,
                    )
                  }
                />
              ))}
            </div>
          </div>
        </div>

        <div className="sp-board" role="region">
          {SUGGESTION_COLUMN_CONFIG.map((column) => {
            const Icon = column.icon
            return (
              <SuggestionColumn
                key={column.status}
                title={column.title}
                icon={<Icon className={cn('size-4', column.iconColor)} />}
                badgeClass={column.badgeClass}
                suggestions={filterByStatus(column.status)}
                isLoading={isLoading}
              />
            )
          })}
        </div>
      </div>

      <SuggestionHelpButton />
    </>
  )
}
