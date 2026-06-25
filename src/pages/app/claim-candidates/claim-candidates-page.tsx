import { useMutation, useQuery } from '@tanstack/react-query'
import { ArrowLeft, Clock, SearchCheck, ShieldCheck } from 'lucide-react'

import { createClaimRequest } from '@/api/patient-profiles/create-claim-request'
import { fetchClaimCandidates } from '@/api/patient-profiles/fetch-claim-candidates'

import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

import {
  Card,
  CardTitle,
  CardHeader,
  CardFooter,
  CardContent,
  CardDescription,
} from '@/components/ui/card'

import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export function ClaimCandidatesPage() {
  const { data } = useQuery({
    queryKey: ['claim-candidates'],
    queryFn: fetchClaimCandidates,
  })

  const candidates = data?.candidates ?? []

  const { mutateAsync, isPending: isCreatingClaimRequest } = useMutation({
    mutationKey: ['create-patient-claim-request'],
    mutationFn: createClaimRequest,
    onSuccess: () => {},
    onError: () => {},
  })

  const handleRequestBond = async (patientProfileId: string) => {
    await mutateAsync(patientProfileId)
  }

  const isDisabled = isCreatingClaimRequest

  return (
    <div className="flex justify-center p-4">
      <main className="flex flex-col gap-2 w-xl">
        <Link
          to="/profiles"
          className="text-xs flex items-center gap-1 cursor-pointer text-black mb-4"
        >
          <ArrowLeft size={14} />
          Voltar aos espaços de trabalho
        </Link>
        <div className="flex items-center gap-2">
          <SearchCheck size={16} />
          <p className="text-sm">Vínculos encontrados</p>
        </div>
        <Card className="max-lg">
          <CardHeader>
            <CardTitle className="text-2xl">
              Encontramos possíveis vínculos
            </CardTitle>
            <CardDescription>
              Localizamos alguns perfis criados por profissionais que podem
              estar associados a você. Revise as informações antes de solicitar
              o vínculo.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 w-fit border border-green-500 bg-green-100 rounded-md p-2">
              <ShieldCheck className="text-green-800" />
              <p className="text-xs text-green-800">
                Por segurança, seus dados completos serão liberados somente após
                a aprovação do profissional.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              {candidates.map(
                ({ patientFirstName, patientLastName, ...candidate }) => {
                  const fullName = `${patientFirstName} ${patientLastName}`
                  const initialLetters = patientFirstName
                    ?.slice(0, 1)
                    .concat(patientLastName?.slice(0, 1))

                  return (
                    <Card key={candidate.patientProfileId} className="gap-0">
                      <CardHeader className="flex justify-between border-b">
                        <div className="flex items-start gap-2">
                          <div className="flex items-center justify-center text-sm p-2 rounded-full bg-blue-200">
                            {initialLetters?.toLocaleUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm capitalize font-medium">
                              {candidate.psychologistDisplayName}
                            </p>
                            <p className="text-xs">
                              {candidate.psychologistCrp}
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className="flex items-center gap-2"
                        >
                          <Clock size={16} />
                          <p>Aguardando Confirmação</p>
                        </Badge>
                      </CardHeader>
                      <CardContent className="flex col-span-3 justify-between border-b py-4">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            PERFIL CRIADO EM
                          </p>
                          <p className="text-sm">
                            {format(
                              candidate.createdAt,
                              "dd 'de' MMMM 'de' yyyy",
                              {
                                locale: ptBR,
                              },
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            NOME CADASTRADO
                          </p>
                          <p className="text-sm">{fullName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            NASCIMENTO
                          </p>
                          <p className="text-sm">
                            {candidate.patientDateOfBirth}
                          </p>
                        </div>
                      </CardContent>
                      <CardFooter className="flex flex-row justify-between pt-4">
                        <p className="text-xs">
                          Informações sensíveis ficam ocultas até a confirmação.
                        </p>
                        <Button
                          size="xs"
                          disabled={isDisabled}
                          className="p-2 text-xs"
                          onClick={() =>
                            handleRequestBond(candidate.patientProfileId)
                          }
                        >
                          Socilitar Vínculo
                        </Button>
                      </CardFooter>
                    </Card>
                  )
                },
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
