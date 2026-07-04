'use client'

import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useQuery } from '@tanstack/react-query'
import { Loader2, RefreshCw } from 'lucide-react'

import { useHeaderStore } from '@/store/use-header-store'
import { getProfile } from '@/api/psychologists/get-profile'
import { Button } from '@/components/ui/button'
import { PsychologistProfileCard } from './components/psychologist-profile-card'
import { ActivityHeatmap } from './components/activity-heatmap'
import './account.css'

export function MockPsychologistProfilePage() {
  const { setTitle } = useHeaderStore()

  useEffect(() => {
    setTitle('Minha Conta')
  }, [setTitle])

  const {
    data: psychologist,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['psychologist-profile-v2'],
    queryFn: getProfile,
    staleTime: 1000 * 60 * 5,
  })

  if (isLoading) {
    return (
      <div className="acc-page-state gap-3">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
        <p className="text-sm text-muted-foreground animate-pulse">
          Carregando seu perfil...
        </p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="acc-page-state gap-4">
        <div className="acc-page-error-icon">
          <p className="text-4xl">😕</p>
        </div>
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold">Ops! Algo deu errado</h2>
          <p className="text-muted-foreground">
            Não conseguimos carregar os dados da sua conta agora.
          </p>
        </div>
        <Button variant="outline" onClick={() => refetch()} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Tentar novamente
        </Button>
      </div>
    )
  }

  return (
    <>
      <Helmet title="Minha Conta" />

      <div className="acc-page-root">
        {psychologist && (
          <PsychologistProfileCard psychologist={psychologist} />
        )}

        <div className="acc-page-heatmap-wrap">
          <ActivityHeatmap />
        </div>
      </div>
    </>
  )
}
