import { memo, useState, useCallback } from "react"
import {
    MoreHorizontal, Search, ExternalLink, Pencil,
    UserX, UserCheck, Phone, AtSign, CheckCircle2, XCircle,
} from "lucide-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { format, formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"

import { TableCell, TableRow } from "@/components/ui/table"
import { Dialog } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { PatientsDetails } from "./patients-details"
import { DeletePatientDialog } from "./delete-patient-dialog"
import { RegisterPatients } from "../register-patients/register-patients"
import { deletePatients } from "@/api/delete-patients"
import { UserAvatar } from "@/components/user-avatar"
import { formatPhone } from "@/utils/formatPhone"

import type { Patient } from "@/api/get-patients"
import { useNavigate } from "react-router-dom"
import { cn } from "@/lib/utils"

interface PatientsTableRowProps {
    patient: Patient
}

export const PatientsTableRow = memo(function PatientsTableRow({ patient }: PatientsTableRowProps) {
    const navigate = useNavigate()
    const [isDetailsOpen, setIsDetailsOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)

    const queryClient = useQueryClient()

    const { id, firstName, lastName, email, phoneNumber, profileImageUrl, isActive, lastSessionAt } = patient

    const { mutateAsync: toggleStatusFn, isPending: isUpdating } = useMutation({
        mutationFn: () => deletePatients(id, !isActive),
        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ["patients"] }),
                queryClient.invalidateQueries({ queryKey: ["patient-details", id] }),
            ])
        },
    })

    const handleOpenDetails  = useCallback(() => setIsDetailsOpen(true), [])
    const handleOpenEdit     = useCallback(() => setIsEditOpen(true), [])
    const handleOpenDelete   = useCallback(() => setIsDeleteOpen(true), [])
    const handleNavigate     = useCallback(() => {
        sessionStorage.removeItem("active_patient_queue")
        sessionStorage.removeItem("active_patient_queue_source")
        navigate(`/patients/${id}/details`, { state: { from: "patients-list" } })
    }, [navigate, id])

    const lastSessionRelative = lastSessionAt
        ? formatDistanceToNow(new Date(lastSessionAt), { addSuffix: true, locale: ptBR })
        : null

    const lastSessionExact = lastSessionAt
        ? format(new Date(lastSessionAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
        : null

    return (
        <TableRow
            className={cn(
                "group hover:bg-muted/50 transition-[background-color,border-color] border-l-2 border-l-transparent hover:border-l-primary/50",
                !isActive && "opacity-60 bg-muted/20"
            )}
        >
            {/* Avatar + Nome */}
            <TableCell>
                <div className="flex items-center gap-3">
                    <UserAvatar
                        src={profileImageUrl}
                        name={`${firstName} ${lastName}`}
                        size="md"
                    />
                    <span className="font-semibold text-sm leading-tight text-nowrap">
                        {firstName} {lastName}
                    </span>
                </div>
            </TableCell>

            {/* Status */}
            <TableCell>
                {isActive ? (
                    <Badge className="bg-emerald-500/15 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/20 gap-1.5 h-[22px] px-2 text-[10px] font-bold uppercase tracking-tight">
                        <CheckCircle2 className="h-3 w-3" aria-hidden="true" /> Ativo
                    </Badge>
                ) : (
                    <Badge variant="secondary" className="bg-muted text-muted-foreground gap-1.5 h-[22px] px-2 text-[10px] font-bold uppercase tracking-tight">
                        <XCircle className="h-3 w-3" aria-hidden="true" /> Inativo
                    </Badge>
                )}
            </TableCell>

            {/* Telefone */}
            <TableCell>
                <div className="flex items-center gap-1.5 tabular-nums">
                    <Phone className="h-3 w-3 text-muted-foreground shrink-0" aria-hidden="true" />
                    <span className="text-xs font-medium">{phoneNumber ? formatPhone(phoneNumber) : "—"}</span>
                </div>
            </TableCell>

            {/* E-mail */}
            <TableCell className="hidden md:table-cell">
                <TooltipProvider delayDuration={0}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="flex items-center gap-1.5 cursor-default">
                                <AtSign className="h-3 w-3 text-muted-foreground shrink-0" aria-hidden="true" />
                                <span className="text-xs font-medium truncate max-w-[160px]">
                                    {email || "—"}
                                </span>
                            </div>
                        </TooltipTrigger>
                        {email && (
                            <TooltipContent className="text-xs font-medium">{email}</TooltipContent>
                        )}
                    </Tooltip>
                </TooltipProvider>
            </TableCell>

            {/* Última Sessão */}
            <TableCell className="hidden md:table-cell">
                {lastSessionRelative ? (
                    <TooltipProvider delayDuration={0}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <span className="text-xs font-medium cursor-default">{lastSessionRelative}</span>
                            </TooltipTrigger>
                            <TooltipContent className="text-xs">{lastSessionExact}</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                ) : (
                    <span className="text-xs text-muted-foreground">Sem sessões</span>
                )}
            </TableCell>

            {/* Ações */}
            <TableCell className="text-right">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 cursor-pointer opacity-60 group-hover:opacity-100 transition-opacity"
                            aria-label={`Ações do paciente ${firstName} ${lastName}`}
                        >
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onSelect={handleOpenDetails}>
                            <Search className="mr-2 h-4 w-4" />
                            Ver detalhes
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={handleNavigate}>
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Prontuário completo
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={handleOpenEdit}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onSelect={handleOpenDelete}
                            className="text-destructive focus:text-destructive"
                        >
                            {isActive
                                ? <><UserX className="mr-2 h-4 w-4" /> Inativar</>
                                : <><UserCheck className="mr-2 h-4 w-4" /> Reativar</>
                            }
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </TableCell>

            {/* Modais */}
            <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                {isDetailsOpen && <PatientsDetails patientId={id} />}
            </Dialog>

            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                {isEditOpen && (
                    <RegisterPatients
                        patient={patient}
                        onSuccess={() => setIsEditOpen(false)}
                    />
                )}
            </Dialog>

            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                {isDeleteOpen && (
                    <DeletePatientDialog
                        fullName={`${firstName} ${lastName}`}
                        isActive={isActive}
                        isPending={isUpdating}
                        onClose={() => setIsDeleteOpen(false)}
                        onInactivate={async () => {
                            await toggleStatusFn()
                            setIsDeleteOpen(false)
                        }}
                    />
                )}
            </Dialog>
        </TableRow>
    )
})
