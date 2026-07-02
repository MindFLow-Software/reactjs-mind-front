import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'

import { useAuth } from '@/hooks/use-auth'
import { useActivePracticeContextStore } from '@/store/use-active-practice-context-store'

import { Button } from '@/components/ui/button'
import { PracticeContextCard } from './practice-context-card'
import { ProfileSectionHeader } from './profile-section-header'

import './psychologist-practice-contexts-section.css'

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

  const handleAccessPracticeContext = useCallback(
    (contextId: string) => {
      if (!contextId) return

      setActivePracticeContextId(contextId)
      navigate('/dashboard')
    },
    [navigate, setActivePracticeContextId],
  )

  if (practiceContexts.length === 0) return null

  return (
    <section className="w-full">
      <div className="pf-section-header-row">
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

      <div className="pf-cards-row">
        {practiceContexts?.map((context) => (
          <PracticeContextCard
            key={context.id}
            context={context}
            onSelect={handleAccessPracticeContext}
          />
        ))}
      </div>
    </section>
  )
}
