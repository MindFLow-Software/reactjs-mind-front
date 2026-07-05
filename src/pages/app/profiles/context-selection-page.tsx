import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'

import { useAuth } from '@/hooks/use-auth'
import { useActivePracticeContextStore } from '@/store/use-active-practice-context-store'

import { PracticeContextAllView } from './components/practice-context-all-view'

export function ContextSelectionPage() {
  const navigate = useNavigate()
  const { profile, isPending } = useAuth()

  const activePracticeContextId = useActivePracticeContextStore(
    (state) => state.activePracticeContextId,
  )
  const setActivePracticeContextId = useActivePracticeContextStore(
    (state) => state.setActivePracticeContextId,
  )

  const practiceContexts = profile?.practiceContexts ?? []

  const handleEnter = useCallback(
    (id: string) => {
      setActivePracticeContextId(id)
      navigate('/dashboard')
    },
    [setActivePracticeContextId, navigate],
  )

  const handleViewMain = useCallback(() => navigate('/profiles'), [navigate])

  const handleAdd = useCallback(() => navigate('/profiles/context'), [navigate])

  if (isPending) {
    return (
      <div className="min-h-screen w-full bg-background flex items-center justify-center text-muted-foreground">
        <Loader2 className="size-6 animate-spin" />
      </div>
    )
  }

  return (
    <PracticeContextAllView
      contexts={practiceContexts}
      activeContextId={activePracticeContextId}
      onEnter={handleEnter}
      onViewMain={handleViewMain}
      onAdd={handleAdd}
    />
  )
}
