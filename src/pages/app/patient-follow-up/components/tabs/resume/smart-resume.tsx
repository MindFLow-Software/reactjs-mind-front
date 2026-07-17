import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, Award, ShieldCheck, Sparkle, Target } from 'lucide-react'

export function SmartResume() {
  return (
    <Card className="p-4! max-w-3/5">
      <CardHeader className="px-0!">
        <div className="flex items-center gap-2">
          <Sparkle size={14} className="text-violet-500" />
          <CardTitle className="text-sm">Resumo clínico inteligente</CardTitle>
        </div>
        <CardDescription>Gerado a partir das últimas 6 sessões</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 px-0!">
        <CardDescription>
          Mariana apresenta evolução consistente no manejo de sintomas ansiosos,
          com redução significativa nas escalas BAI (22 → 12) ao longo dos últimos 4 meses.
          Boa aderência às tarefas terapêuticas e à medicação em uso.
        </CardDescription>

        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4! border border-border w-full gap-2!">
            <CardHeader className="px-0!">
              <div className="flex items-center gap-2">
                <Target size={14} className="text-blue-500" />
                <CardTitle className="text-sm">Resumo clínico inteligente</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="list-disc">
                <li>Ansiedade generalizada</li>
                <li>Autoexigência profissional</li>
                <li>Padrão de sono irregular</li>
              </ul>
            </CardContent>
          </Card>
          <Card className="p-4! border border-border w-full gap-2!">
            <CardHeader className="flex! items-center gap-2 px-0!">
              <Award size={14} className="text-green-500" />
              <CardTitle className="text-sm">Objetivos terapêuticos</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc">
                <li>Regulação emocional</li>
                <li>Assertividade</li>
                <li>Autocompaixão</li>
              </ul>
            </CardContent>
          </Card>
          <Card className="p-4! border border-border w-full gap-2!">
            <CardHeader className="flex! items-center gap-2 px-0!">
              <ShieldCheck size={14} className="text-blue-500" />
              <CardTitle className="text-sm">Fatores de proteção</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc">
                <li>Rede de apoio familiar</li>
                <li>Vínculo estável</li>
                <li>Boa insight</li>
              </ul>
            </CardContent>
          </Card>
          <Card className="p-4! border border-border w-full gap-2!">
            <CardHeader className="flex! items-center gap-2 px-0!">
              <AlertCircle size={14} className="text-red-500" />
              <CardTitle className="text-sm">Fatores de risco</CardTitle>
              <CardDescription>Gerado a partir das últimas 6 sessões</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc">
                <li>Sobrecarga de trabalho</li>
                <li>Isolamento pontual</li>
                <li>Padrões perfeccionistas</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  )
}
