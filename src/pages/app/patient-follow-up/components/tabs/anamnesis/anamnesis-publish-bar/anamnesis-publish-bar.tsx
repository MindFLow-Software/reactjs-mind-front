import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, CircleDashed } from 'lucide-react'

import './anamnesis-publish-bar.css'

type IAnamnesisPublishBar = {
  isDraft: boolean
  canPublish: boolean
  isPending: boolean
  onPublish: () => void
}

export function AnamnesisPublishBar({
  isDraft,
  canPublish,
  isPending,
  onPublish,
}: IAnamnesisPublishBar) {
  return (
    <div className="ph-anamnesis-publish-bar">
      <Badge
        variant={isDraft ? 'secondary' : 'default'}
        className="ph-anamnesis-publish-bar__badge"
      >
        {isDraft ? (
          <CircleDashed className="ph-anamnesis-publish-bar__badge-icon" />
        ) : (
          <CheckCircle2 className="ph-anamnesis-publish-bar__badge-icon" />
        )}
        {isDraft ? 'Rascunho' : 'Publicado'}
      </Badge>

      <Button
        size="sm"
        onClick={onPublish}
        disabled={!canPublish || isPending}
        className="ph-anamnesis-publish-bar__publish-btn"
      >
        Publicar
      </Button>
    </div>
  )
}
