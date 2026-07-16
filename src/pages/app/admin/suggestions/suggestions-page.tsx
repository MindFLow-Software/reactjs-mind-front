'use client'

import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { LayoutGrid } from 'lucide-react'

import { useHeaderStore } from '@/store/use-header-store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { MostVotedSuggestionsCard } from './components/most-voted-suggestions-card/most-voted-suggestions-card'
import { PendingSuggestionsModeration } from './components/pending-suggestions-moderation/pending-suggestions-moderation'
import { SuggestionRanking } from './components/ranking-table/ranking-table'
import './suggestions-page.css'

export function AdminSuggestionsPage() {
  const { setTitle } = useHeaderStore()

  useEffect(() => {
    setTitle('Painel de Sugestões')
  }, [setTitle])

  return (
    <>
      <Helmet title="Sugestões e Sugestões" />

      <div className="ads-page-root">
        <div>
          <Card className="ads-page-banner">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-3">
                <span className="ads-page-banner-icon">
                  <LayoutGrid className="size-4" />
                </span>
                Priorização de Sugestões
              </CardTitle>
            </CardHeader>

            <CardContent>
              <p className="ads-page-banner-text">
                As sugestões mais votadas representam demandas reais dos
                psicólogos. Priorize-as movendo para{' '}
                <span className="font-semibold text-white underline underline-offset-2">
                  Em Análise
                </span>{' '}
                para notificar automaticamente os autores.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="col-span-12 lg:col-span-8">
            <PendingSuggestionsModeration />
          </div>
        </div>

        <div className="ads-page-grid">
          <div className="flex flex-col gap-6">
            <MostVotedSuggestionsCard />
          </div>
          <div className="flex flex-col gap-6">
            <SuggestionRanking />
          </div>
        </div>
      </div>
    </>
  )
}
