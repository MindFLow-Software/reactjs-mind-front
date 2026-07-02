import type { PsychologistPracticeContext } from '@/types/psychologist'

import { PracticeContextFeaturedCard } from './practice-context-featured-card'
import { ProfileSectionHeader } from './profile-section-header'

interface PracticeContextMainViewProps {
  featuredContext: PsychologistPracticeContext
  otherContexts: PsychologistPracticeContext[]
  onEnter: (id: string) => void
  onViewAll: () => void
}

export function PracticeContextMainView({
  featuredContext,
  otherContexts,
  onEnter,
  onViewAll,
}: PracticeContextMainViewProps) {
  return (
    <div className="flex flex-col gap-3">
      <ProfileSectionHeader
        section="contextos"
        title="Seus contextos de atuação"
        label="Os contextos representam os ambientes em que você atende, como consultório particular ou clínica."
      />
      <PracticeContextFeaturedCard
        context={featuredContext}
        otherContextsCount={otherContexts.length}
        onEnter={onEnter}
        onViewAll={onViewAll}
      />
    </div>
  )
}
