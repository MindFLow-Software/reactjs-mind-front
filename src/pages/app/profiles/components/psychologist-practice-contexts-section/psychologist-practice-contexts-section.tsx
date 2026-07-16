import { useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '@/hooks/use-auth'
import { useActivePracticeContextStore } from '@/store/use-active-practice-context-store'

import { ProfileSectionHeader } from '../profile-section-header/profile-section-header'
import { PracticeContextFeaturedCard } from '../practice-context-featured-card/practice-context-featured-card'

import './psychologist-practice-contexts-section.css'

export function PsychologistPracticeContextsSection() {
  const navigate = useNavigate()

  const { profile } = useAuth()
  const { setActivePracticeContextId } = useActivePracticeContextStore()

  const practiceContexts = profile?.practiceContexts ?? []

  const featuredContext = practiceContexts[0]

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

  const actions = useMemo(
    () => ({ onEnter: handleEnter, onViewAll: handleViewAll }),
    [handleEnter, handleViewAll],
  )

  if (practiceContexts.length === 0) return null

  return (
    <section className="flex flex-col w-full">
      <ProfileSectionHeader
        section="contextos"
        title="Seus contextos de atuação"
        label="Os contextos representam os ambientes em que você atende, como consultório particular ou clínica."
      />
      <PracticeContextFeaturedCard
        context={featuredContext}
        otherContextsCount={otherContexts.length}
        actions={actions}
      />
    </section>
  )
}
