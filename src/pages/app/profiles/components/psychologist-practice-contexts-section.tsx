import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '@/hooks/use-auth'
import { useActivePracticeContextStore } from '@/store/use-active-practice-context-store'

import { PracticeContextMainView } from './practice-context-main-view'

export function PsychologistPracticeContextsSection() {
  const navigate = useNavigate()
  const { profile } = useAuth()

  const activePracticeContextId = useActivePracticeContextStore(
    (state) => state.activePracticeContextId,
  )
  const setActivePracticeContextId = useActivePracticeContextStore(
    (state) => state.setActivePracticeContextId,
  )

  const practiceContexts = profile?.practiceContexts ?? []

  const featuredContext =
    practiceContexts.find((c) => c.id === activePracticeContextId) ??
    practiceContexts[0]

  const otherContexts = practiceContexts.filter(
    (c) => c.id !== featuredContext?.id,
  )

  const handleEnter = useCallback(
    (id: string) => {
      setActivePracticeContextId(id)
      navigate('/dashboard')
    },
    [setActivePracticeContextId, navigate],
  )

  const handleViewAll = useCallback(
    () => navigate('/profiles/contexts'),
    [navigate],
  )

  if (practiceContexts.length === 0) return null

  return (
    <section className="w-full">
      <PracticeContextMainView
        featuredContext={featuredContext}
        otherContexts={otherContexts}
        onEnter={handleEnter}
        onViewAll={handleViewAll}
      />
    </section>
  )
}
