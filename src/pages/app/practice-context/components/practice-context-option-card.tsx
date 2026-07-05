import './practice-context-option-card.css'
import type { ReactNode } from 'react'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Card,
  CardTitle,
  CardHeader,
  CardFooter,
  CardContent,
  CardDescription,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TitleIcon } from '@/components/title-icon'

type PracticeContextAccent = 'blue' | 'teal'

export interface PracticeContextOption {
  accent: PracticeContextAccent
  titleIconVariant: 'primary' | 'secondary'
  icon: ReactNode
  title: string
  description: string
  bullets: string[]
  onSelect: () => void
}

interface PracticeContextOptionCardProps {
  option: PracticeContextOption
}

export function PracticeContextOptionCard({
  option,
}: PracticeContextOptionCardProps) {
  const {
    accent,
    titleIconVariant,
    icon,
    title,
    description,
    bullets,
    onSelect,
  } = option

  return (
    <Card className="pctx-option-card">
      <div
        className={cn(
          'pctx-option-accent',
          accent === 'blue'
            ? 'pctx-option-accent-blue'
            : 'pctx-option-accent-teal',
        )}
      />
      <CardHeader className="flex items-center gap-2 p-0">
        <TitleIcon variant={titleIconVariant}>{icon}</TitleIcon>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="px-0 h-full flex flex-col gap-6">
        <CardDescription>{description}</CardDescription>
        <ul className="flex flex-col justify-center flex-1 gap-2">
          {bullets.map((bullet) => (
            <li key={bullet} className="pctx-option-bullet">
              <span
                className={cn(
                  'pctx-option-bullet-dot',
                  accent === 'blue'
                    ? 'pctx-option-bullet-dot-blue'
                    : 'pctx-option-bullet-dot-teal',
                )}
              />
              {bullet}
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="p-0 h-fit">
        <Button
          type="button"
          variant="outline"
          onClick={onSelect}
          className={
            accent === 'blue'
              ? 'pctx-option-button-blue'
              : 'pctx-option-button-teal'
          }
        >
          Continuar
          <ArrowRight className="ml-2 size-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
