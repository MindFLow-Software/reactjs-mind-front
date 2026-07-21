import { useId } from 'react'
import { AlertCircle, Award, ShieldCheck, Sparkles, Target } from 'lucide-react'

import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from '@/components/ui/card'

import { Badge } from '@/components/ui/badge'

import './smart-resume.css'
import { cn } from '@/lib/utils'

export function SmartResume() {
  const COLORS = ['blue', 'green', 'orange', 'red']

  const SUB_CARD_CONTENT_LIST = [
    {
      id: useId(),
      icon: Target,
      title: 'Resumo clínico inteligente',
      list: [
        'Ansiedade generalizada',
        'Autoexigência profissional',
        'Padrão de sono irregular',
      ],
    },
    {
      id: useId(),
      icon: Award,
      title: 'Objetivos terapêuticos',
      list: ['Regulação emocional', 'Assertividade', 'Autocompaixão'],
    },
    {
      id: useId(),
      icon: ShieldCheck,
      title: 'Fatores de proteção',
      list: ['Rede de apoio familiar', 'Vínculo estável', 'Boa insight'],
    },
    {
      id: useId(),
      icon: AlertCircle,
      title: 'Fatores de risco',
      list: [
        'Sobrecarga de trabalho',
        'Isolamento pontual',
        'Padrões perfeccionistas',
      ],
    },
  ]

  return (
    <Card className="sr-card">
      <CardHeader className="sr-header">
        <div>
          <div className="sr-header-title-row">
            <Sparkles size={14} className="text-violet-500" />
            <CardTitle className="text-sm">
              Resumo clínico inteligente
            </CardTitle>
          </div>
          <CardDescription className="text-[13px]">
            Gerado a partir das últimas 6 sessões
          </CardDescription>
        </div>
        <Badge className="sr-badge">IA · Beta</Badge>
      </CardHeader>
      <CardContent className="sr-content">
        <CardDescription className="text-[13px]">
          Mariana apresenta evolução consistente no manejo de sintomas ansiosos,
          com redução significativa nas escalas BAI (22 → 12) ao longo dos
          últimos 4 meses. Boa aderência às tarefas terapêuticas e à medicação
          em uso.
        </CardDescription>

        <div className="sr-grid">
          {SUB_CARD_CONTENT_LIST.map(({ id, title, icon: Icon, list }, i) => {
            const color = COLORS[i]

            return (
              <Card key={id} className="sr-sub-card">
                <CardHeader className="sr-sub-card-header">
                  <div className="sr-header-title-row">
                    <div
                      className={cn(
                        'sr-sub-card-icon-wrap',
                        `sr-icon-wrap-${color}`,
                      )}
                    >
                      <Icon size={14} className={`text-${color}-500`} />
                    </div>
                    <CardTitle className="sr-sub-card-title">{title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="sr-sub-card-content">
                  <ul className="sr-sub-card-list">
                    {list.map((item, i) => (
                      <li key={i} className="sr-sub-card-list-item">
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
