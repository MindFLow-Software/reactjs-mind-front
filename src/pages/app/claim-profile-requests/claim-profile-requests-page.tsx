import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Clock,
  Calendar,
  ShieldCheck,
  MoreVertical,
  ClipboardCheck,
} from 'lucide-react'

import { Time } from '@/utils/time'
import { useAuth } from '@/hooks/use-auth'
import { useHeaderStore } from '@/hooks/use-header-store'
import { translatedHonorific } from '@/constants/translated-honorific'
import { fetchClaimProfileRequests } from '@/api/patient-profiles/fetch-claim-profile-requests'

import {
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableHeader,
} from '@/components/ui/table'

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from '@/components/ui/dropdown-menu'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { UserAvatar } from '@/components/user-avatar'
import { Card, CardContent } from '@/components/ui/card'

export function ClaimProfileRequestsPage() {
  const { profile } = useAuth()
  const { setTitle } = useHeaderStore()

  const { data } = useQuery({
    queryKey: ['claim-profile-requests'],
    queryFn: fetchClaimProfileRequests,
  })

  const claimProfileRequests = data?.requests ?? []

  const honorific = profile?.psychologistProfile?.honorific
    ? translatedHonorific[profile.psychologistProfile.honorific]
    : ''

  useEffect(() => {
    setTitle('solicitações de vínculo')
  }, [setTitle])

  return (
    <main className="flex flex-col gap-2 max-xl">
      <header className="mb-4">
        <h1 className="text-xl">Solicitações de vínculo</h1>
        <p className="text-sm text-muted-foreground">
          Revise os pedidos de pacientes que desejam se conectar a perfis
          cadastrados por você.
        </p>
      </header>
      <div className="flex items-center gap-2 w-fit border border-green-500 bg-green-100 rounded-md p-2">
        <ShieldCheck className="text-green-800" size={16} />
        <p className="text-xs text-green-800">
          Aprove apenas solicitações que você reconhece. Em caso de dúvida,
          recuse ou confirme os dados diretamente com o paciente.
        </p>
      </div>
      <Card className="rounded-md">
        <CardContent>
          <Table className="rounded-xl border bg-background shadow-sm overflow-hidden">
            <TableHeader className="font-semibold">
              <TableHead className="text-[11px] uppercase tracking-wider text-muted-foreground pl-6">
                SOLICITANTE
              </TableHead>
              <TableHead className="text-[11px] uppercase tracking-wider text-muted-foreground">
                PERFIL CADASTRADO
              </TableHead>
              <TableHead className="text-[11px] uppercase tracking-wider text-muted-foreground">
                CPF / NASCIMENTO
              </TableHead>
              <TableHead className="text-[11px] uppercase tracking-wider text-muted-foreground w-44">
                SOLICITADO EM
              </TableHead>
              <TableHead className="text-[11px] uppercase tracking-wider text-muted-foreground w-44">
                STATUS
              </TableHead>
              <TableHead className="text-[11px] uppercase tracking-wider text-muted-foreground w-10 text-right pr-6">
                AÇÕES
              </TableHead>
            </TableHeader>
            {claimProfileRequests.map((request) => (
              <TableRow key={request.id} className="border pl-6">
                <TableCell>
                  <div className="flex items-center gap-2">
                    <UserAvatar
                      src={''}
                      name={request.requesterFirstName}
                      size="md"
                      colorSeed={request.id}
                    />
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {request.requesterFirstName}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {request.requesterEmail}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {request.requesterFirstName}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      por {honorific}{' '}
                      {profile?.psychologistProfile?.professionalName ?? '--'}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{request.requestedCpf}</span>
                    <span className="text-xs text-muted-foreground">
                      {request?.requesterDateOfBirth
                        ? request?.requesterDateOfBirth
                        : '--/--/----'}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 font-medium">
                      <Calendar size={14} />
                      <span>
                        {request.createdAt &&
                          Time.toBrazilianFormat(request.createdAt)}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    <Clock />
                    <span>Pendente</span>
                  </Badge>
                </TableCell>
                <TableCell className="flex flex-col gap-2 items-end">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 cursor-pointer text-muted-foreground hover:text-foreground"
                      >
                        <MoreVertical className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44">
                      <DropdownMenuItem className="cursor-pointer">
                        <ClipboardCheck className="mr-2 size-4" /> Revisar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </Table>
        </CardContent>
      </Card>
    </main>
  )
}
