import { useNavigate } from 'react-router-dom'
import { ArrowRight, Brain, Plus } from 'lucide-react'

import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/use-auth'

import { Button } from '@/components/ui/button'
import { ProfileCard } from './profile-card'

export function PsychologistCard() {
  const navigate = useNavigate()

  const { profile: me } = useAuth()

  const handleCreatePsychologistProfile = () => {
    navigate('/onboarding/psychologist')
  }

  const handleAddContext = () => {
    navigate('/profiles/context')
  }

  const hasPsychologistProfile = Boolean(me?.psychologistProfile)

  return (
    <ProfileCard.Root>
      <ProfileCard.Header
        icon={<Brain />}
        label="Para profissionais licenciados"
      />

      <ProfileCard.Content>
        {hasPsychologistProfile ? (
          <>
            <div>
              <h2 className="text-xl font-bold text-foreground">
                Perfil de psicólogo ativo
              </h2>
              <p className="text-sm text-muted-foreground">
                Seu perfil profissional já está configurado e pronto para uso.
              </p>
            </div>

            <div className="grid grid-cols-2 space-y-4 rounded-lg bg-muted/50 p-4">
              <div>
                <p className="text-xs tracking-wider text-muted-foreground uppercase">status</p>
                <div className="flex items-center gap-1.5">
                  <span
                    className={cn(
                      'size-2 rounded-full',
                      me?.isActive ? 'bg-green-500' : 'bg-red-400',
                    )}
                  />
                  <span className="text-sm font-medium text-foreground">
                    {me?.isActive ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-xs tracking-wider text-muted-foreground uppercase">crp</p>
                <p className="text-sm font-medium text-foreground">
                  {me?.psychologistProfile!.crp}
                </p>
              </div>

              <div>
                <p className="text-xs tracking-wider text-muted-foreground uppercase">
                  nome profissional
                </p>
                <p className="text-sm font-medium text-foreground">
                  {me?.psychologistProfile?.professionalName}
                </p>
              </div>

              <div>
                <p className="text-xs tracking-wider text-muted-foreground uppercase">contextos</p>
                <p className="text-sm font-medium text-foreground">
                  {me?.practiceContexts.length} contexto(s)
                </p>
              </div>
            </div>
          </>
        ) : (
          <>
            <div>
              <h2 className="text-xl font-bold text-foreground">
                Perfil de psicólogo
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Crie sua identidade profissional uma única vez — depois adicione
                quantos contextos de prática precisar.
              </p>
            </div>

            <ul className="space-y-2">
              <li className="flex gap-2 text-sm text-muted-foreground">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-blue-500" />
                CRP e credenciais validados
              </li>
              <li className="flex gap-2 text-sm text-muted-foreground">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-blue-500" />
                Adicione vários espaços de trabalho
              </li>
              <li className="flex gap-2 text-sm text-muted-foreground">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-blue-500" />
                Ferramentas para prática focada
              </li>
            </ul>
          </>
        )
        }
      </ProfileCard.Content >

      <ProfileCard.Footer>
        {hasPsychologistProfile ? (
          <Button className="w-full" variant="outline" onClick={handleAddContext}>
            <Plus className="mr-2 size-4" />
            Adicionar contexto
          </Button>
        ) : (
          <Button
            className="w-full bg-blue-600 text-white hover:bg-blue-700 hover:text-white dark:hover:bg-blue-950/30"
            onClick={handleCreatePsychologistProfile}
          >
            Criar perfil de psicólogo
            <ArrowRight className="ml-2 size-4" />
          </Button>
        )}
      </ProfileCard.Footer>
    </ProfileCard.Root >
  )
}
