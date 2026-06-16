'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Loader2, Timer, Eye, Info } from 'lucide-react'
import { format, parseISO, isValid } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { getPatientDetails } from '@/api/patients/get-patient-details'
import { usePsychologistProfile } from '@/hooks/use-psychologist-profile'
import {
  getSessionStatusLabel,
  FINISHED_SESSION_STATUSES,
} from '@/utils/mappers'
import { IMaskMixin } from 'react-imask'
import type { SessionItem } from '@/types/patient'

import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import { Button } from '@/components/ui/button'

import { PaginationDetailsPatients } from '@/components/pagination-details-patients'
import { EvolutionViewer } from './evolution-viewer'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface PatientsDetailsProps {
  patientId: string
}

const MaskedInfo = IMaskMixin(
  ({
    inputRef,
    ...props
  }: {
    inputRef: React.Ref<HTMLInputElement>
  } & React.InputHTMLAttributes<HTMLInputElement>) => (
    <input
      ref={inputRef}
      disabled
      className="bg-transparent border-none w-full text-right p-0 pointer-events-none font-medium tabular-nums focus:outline-none disabled:opacity-100 text-foreground h-auto"
      {...props}
    />
  ),
)

function DataField({ value, mask }: { value?: string | null; mask?: string }) {
  if (!value || value.trim() === '') {
    return (
      <span className="text-muted-foreground/60 italic text-xs font-normal">
        Não informado
      </span>
    )
  }

  if (mask) {
    return <MaskedInfo mask={mask} value={value} />
  }

  return <span className="font-medium text-foreground">{value}</span>
}

export function PatientsDetails({ patientId }: PatientsDetailsProps) {
  const [pageIndex, setPageIndex] = useState(0)
  const [selectedSession, setSelectedSession] = useState<SessionItem | null>(
    null,
  )

  const { data, isLoading } = useQuery({
    queryKey: ['patient-details', patientId, pageIndex],
    queryFn: () => getPatientDetails(patientId, pageIndex),
    enabled: !!patientId,
  })

  const { data: profile } = usePsychologistProfile()

  if (isLoading || !data) {
    return (
      <DialogContent className="flex items-center justify-center p-20">
        <DialogTitle className="sr-only">Carregando</DialogTitle>
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </DialogContent>
    )
  }

  const { patient, meta } = data
  const patientFullName =
    `${patient?.firstName ?? ''} ${patient?.lastName ?? ''}`.trim() ||
    'Paciente sem nome'

  const finishedSessions =
    patient?.sessions.filter((session: SessionItem) =>
      (FINISHED_SESSION_STATUSES as readonly string[]).includes(
        session.status?.toUpperCase(),
      ),
    ) ?? []

  const totalFinished = finishedSessions.length

  return (
    <DialogContent
      onOpenAutoFocus={(e) => e.preventDefault()}
      className="max-w-2xl max-h-[90vh] overflow-y-auto overflow-x-hidden"
    >
      <DialogHeader className={selectedSession ? 'sr-only' : ''}>
        <DialogTitle className="flex items-center gap-2">
          {patientFullName}
        </DialogTitle>
        <DialogDescription>
          Informações cadastrais e histórico clínico
        </DialogDescription>
      </DialogHeader>

      {selectedSession ? (
        <EvolutionViewer
          patientName={patientFullName}
          content={selectedSession.content || 'Nenhuma nota registrada.'}
          date={
            selectedSession.sessionDate ||
            selectedSession.date ||
            selectedSession.createdAt
          }
          diagnosis={selectedSession.theme || 'Sem tema'}
          psychologist={{
            name: profile
              ? `${profile.firstName} ${profile.lastName}`
              : 'Psicólogo Responsável',
            crp: profile?.crp || 'Não informado',
          }}
          onBack={() => setSelectedSession(null)}
        />
      ) : (
        <div className="space-y-8">
          <div className="rounded-lg border bg-card">
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="text-muted-foreground font-medium py-3">
                    Nome completo
                  </TableCell>
                  <TableCell className="text-right py-3">
                    <DataField
                      value={
                        patientFullName === 'Paciente sem nome'
                          ? null
                          : patientFullName
                      }
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-muted-foreground font-medium py-3">
                    CPF
                  </TableCell>
                  <TableCell className="text-right py-3">
                    <DataField value={patient?.cpf} mask="000.000.000-00" />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-muted-foreground font-medium py-3">
                    E-mail
                  </TableCell>
                  <TableCell className="text-right py-3 lowercase">
                    <DataField value={patient?.email} />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-muted-foreground font-medium py-3 border-none">
                    Telefone
                  </TableCell>
                  <TableCell className="text-right py-3 border-none">
                    <DataField
                      value={patient?.phoneNumber}
                      mask="(00) 00000-0000"
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <Item
            variant="outline"
            className=" border-sky-200 dark:bg-sky-950/10 dark:border-sky-900"
          >
            <ItemMedia variant="icon" className="text-sky-600">
              <Timer className="h-5 w-5" />
            </ItemMedia>
            <ItemContent>
              <ItemTitle className="text-sm font-semibold">
                Tempo médio de atendimento
              </ItemTitle>
              <span className="text-xs text-muted-foreground">
                Média baseada em sessões finalizadas
              </span>
            </ItemContent>
            <ItemActions>
              <div className="text-right">
                <span className="text-lg font-bold text-sky-700">
                  {meta.averageDuration || 0} min
                </span>
              </div>
            </ItemActions>
          </Item>

          <div className="space-y-4">
            <h3 className="text-sm font-bold flex items-center gap-2 px-1">
              <Info className="size-4 text-primary" />
              Histórico de Atendimentos
            </h3>

            <div className="rounded-md border">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="text-xs uppercase">Data</TableHead>
                    <TableHead className="text-xs uppercase">Tema</TableHead>
                    <TableHead className="text-right text-xs uppercase">
                      Status
                    </TableHead>
                    <TableHead className="text-right text-xs uppercase w-[60px]">
                      Ver
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patient?.sessions?.length ? (
                    patient.sessions.map((session: SessionItem) => {
                      const status = getSessionStatusLabel(session.status)
                      const isFinished = (
                        FINISHED_SESSION_STATUSES as readonly string[]
                      ).includes(session.status?.toUpperCase())

                      return (
                        <TableRow key={session.id} className="group">
                          <TableCell className="whitespace-nowrap tabular-nums text-xs">
                            {session.date && isValid(parseISO(session.date))
                              ? format(
                                  parseISO(session.date),
                                  'dd/MM/yy HH:mm',
                                  { locale: ptBR },
                                )
                              : '—'}
                          </TableCell>
                          <TableCell className="max-w-[180px] truncate italic text-muted-foreground text-xs">
                            {session.theme || 'Sem tema definido'}
                          </TableCell>
                          <TableCell
                            className={`text-right font-bold text-[10px] uppercase ${status.color}`}
                          >
                            {status.label}
                          </TableCell>
                          <TableCell className="text-right">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 cursor-pointer"
                                    disabled={!isFinished}
                                    onClick={() => setSelectedSession(session)}
                                  >
                                    <Eye size={14} className="text-primary" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent side="left">
                                  Abrir Documento
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="h-24 text-center text-muted-foreground italic"
                      >
                        Nenhum registro encontrado.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
                <TableFooter className="bg-transparent border-t">
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="text-xs text-muted-foreground py-4"
                    >
                      Total de sessões finalizadas
                    </TableCell>
                    <TableCell className="text-right font-bold py-4">
                      {totalFinished}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </div>

            <PaginationDetailsPatients
              pageIndex={meta.pageIndex}
              totalCount={meta.totalCount}
              perPage={meta.perPage}
              onPageChange={setPageIndex}
            />
          </div>
        </div>
      )}
    </DialogContent>
  )
}
