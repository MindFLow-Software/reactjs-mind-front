import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'

import { useAuth } from '@/hooks/use-auth'
import { useActivePracticeContextStore } from '@/store/use-active-practice-context-store'

import { Button } from '@/components/ui/button'
import { PracticeContextCard } from './practice-context-card'
import { ProfileSectionHeader } from './profile-section-header'

export function PsychologistPracticeContextsSection() {
  const navigate = useNavigate()
  const { profile } = useAuth()

  const setActivePracticeContextId = useActivePracticeContextStore(
    (state) => state.setActivePracticeContextId,
  )

  const practiceContexts = profile?.practiceContexts ?? []

  const handleAddContext = () => {
    navigate('/profiles/context')
  }

  const handleAccessPracticeContext = useCallback((contextId: string) => {
    if (!contextId) return

    setActivePracticeContextId(contextId)
    navigate('/dashboard')
  }, [])

  if (practiceContexts.length === 0) return null

  return (
    <section className="w-full">
      <div className="flex items-start justify-between">
        <ProfileSectionHeader
          section="profissional"
          title="Seus contextos de atuação"
          label="Os contextos representam os ambientes em que você atende, como consultório particular ou clínica."
        />
        <Button
          size="sm"
          variant="outline"
          className="gap-2"
          onClick={handleAddContext}
        >
          <Plus size={16} />
          Adicionar Contexto
        </Button>
      </div>

      <div className="flex gap-4">
        {practiceContexts?.map((context) => (
          <PracticeContextCard
            context={context}
            onSelect={handleAccessPracticeContext}
          />
        ))}
      </div>
    </section>
  )
}
