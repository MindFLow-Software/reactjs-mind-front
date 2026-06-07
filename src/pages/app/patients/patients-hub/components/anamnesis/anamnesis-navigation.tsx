import { memo } from 'react'
import { cn } from '@/lib/utils'
import { List } from 'lucide-react'
import { useAnamnesisContext } from './anamnesis-context'

import './anamnesis-navigation.css'

export const AnamnesisNavigation = memo(function AnamnesisNavigation() {
  const { sections, activeBlockId, jumpToBlock } = useAnamnesisContext()

  if (sections.length === 0) return null

  const filled = sections.filter((s) => s.wordCount > 0).length
  const total = sections.length
  const progressPct = total > 0 ? Math.round((filled / total) * 100) : 0

  return (
    <aside className="ph-anamnesis-navigation">
      <div className="ph-anamnesis-navigation__header">
        <List size={12} className="ph-anamnesis-navigation__header-icon" />
        <span className="ph-anamnesis-navigation__header-label">Seções</span>
      </div>

      <div className="ph-anamnesis-navigation__list">
        {sections.map((section) => {
          const isActive = activeBlockId === section.id
          return (
            <button
              key={section.id}
              type="button"
              onClick={() => jumpToBlock(section.id)}
              className={cn(
                'ph-anamnesis-navigation__item',
                isActive && 'ph-anamnesis-navigation__item--active',
              )}
            >
              <span
                className={cn(
                  'ph-anamnesis-navigation__item-label',
                  isActive && 'ph-anamnesis-navigation__item-label--active',
                )}
              >
                {section.label || 'Sem título'}
              </span>
              <span
                className={cn(
                  'ph-anamnesis-navigation__item-count',
                  section.wordCount > 0 &&
                    'ph-anamnesis-navigation__item-count--filled',
                )}
              >
                {section.wordCount}
              </span>
            </button>
          )
        })}
      </div>

      <div className="ph-anamnesis-navigation__footer">
        <div className="ph-anamnesis-navigation__progress-row">
          <span className="ph-anamnesis-navigation__progress-label">
            Preenchido
          </span>
          <span className="ph-anamnesis-navigation__progress-count">
            {filled}/{total}
          </span>
        </div>
        <div className="ph-anamnesis-navigation__progress-track">
          <div
            className="ph-anamnesis-navigation__progress-fill"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>
    </aside>
  )
})
