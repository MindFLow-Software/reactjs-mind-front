import { useCallback, useState } from 'react'

import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import './mood-check-in.css'

interface IMoodOption {
  emoji: string
  label: string
}

const MOOD_OPTIONS: IMoodOption[] = [
  { emoji: '😞', label: 'Muito mal' },
  { emoji: '😕', label: 'Mal' },
  { emoji: '😐', label: 'Neutro' },
  { emoji: '🙂', label: 'Bem' },
  { emoji: '😄', label: 'Muito bem' },
]

export function MoodCheckIn() {
  const [selected, setSelected] = useState<string | null>(null)

  const handleSelect = useCallback((emoji: string) => {
    setSelected(emoji)
  }, [])

  return (
    <Card className="ptd-mood-card">
      <span className="ptd-mood-title">Como você está se sentindo hoje?</span>

      <div className="ptd-mood-options">
        {MOOD_OPTIONS.map((option) => (
          <button
            key={option.emoji}
            type="button"
            aria-label={option.label}
            className={cn(
              'ptd-mood-option',
              selected === option.emoji && 'ptd-mood-option--selected',
            )}
            onClick={() => handleSelect(option.emoji)}
          >
            {option.emoji}
          </button>
        ))}
      </div>

      <span className="ptd-mood-streak">
        Você registrou seu humor por 5 dias seguidos.
      </span>
    </Card>
  )
}
