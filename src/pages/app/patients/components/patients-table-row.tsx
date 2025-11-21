"use client"

import { useState } from "react"
import { Search, Trash2, UserPen } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
// Importe os componentes de Dialog necessários para o Modal de Detalhes
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { PatientsDetails } from "./patients-details"
import { EditPatient } from "./edit-patient-dialog"
import { DeletePatientDialog } from "./delete-patient-dialog"

import { deletePatients } from "@/api/delete-patients"
import type { UpdatePatientData } from "@/api/upadate-patient"
import type { Patient } from "@/api/get-patients"

interface PatientsTableProps {
  patients: Patient[]
  isLoading: boolean
  perPage?: number
}

export function PatientsTable({ patients, isLoading, perPage = 10 }: PatientsTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16" />
            <TableHead className="w-[140px]">CPF</TableHead>
            <TableHead className="w-40">Paciente</TableHead>
            <TableHead className="w-[140px]">Telefone</TableHead>
            <TableHead className="w-40">Data de Nascimento</TableHead>
            <TableHead className="w-[140px]">Email</TableHead>
            <TableHead className="w-[140px]">Gênero</TableHead>
            {/* <TableHead className="w-[140px]">Status</TableHead> */}
            <TableHead className="w-[140px]">Opções</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading ? (
            Array.from({ length: perPage }).map((_, i) => (
              <TableRow key={i}>
                <TableHead colSpan={9}>
                  <Skeleton className="h-8 w-full" />
                </TableHead>
              </TableRow>
            ))
          ) : patients.length > 0 ? (
            patients.map((patient) => (
              <PatientsTableRowItem key={patient.id} patient={patient} />
            ))
          ) : (
            <TableRow>
              <TableHead colSpan={9} className="text-center text-muted-foreground py-6">
                Nenhum paciente cadastrado.
              </TableHead>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

function PatientsTableRowItem({ patient }: { patient: Patient }) {
  // Casting para garantir propriedades opcionais
  const p = patient as Patient & {
    role?: "PATIENT" | "ADMIN" | "DOCTOR";
    profileImageUrl?: string
  }

  const { id, cpf, email, firstName, lastName, dateOfBirth, phoneNumber, gender, status, role, profileImageUrl } = p

  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  const queryClient = useQueryClient()

  // Mutação para deletar (simplificada, pois o tratamento de erro/sucesso está no componente filho)
  const { mutateAsync: deletePatientFn, isPending: isDeleting } = useMutation({
    mutationFn: deletePatients,
    onSuccess: () => {
        // Invalida cache para atualizar a lista
        queryClient.invalidateQueries({ queryKey: ["patients"] })
    }
  })

  const patientDataForEdit: UpdatePatientData = {
    id,
    firstName,
    lastName,
    email,
    cpf,
    phoneNumber,
    dateOfBirth: new Date(dateOfBirth),
    gender,
    role: role || "PATIENT",
    isActive: status === "Ativo",
    profileImageUrl
  }

  const genderLabel = {
    MASCULINE: "Masculino",
    FEMININE: "Feminino",
    OTHER: "Outro",
  }[gender] || "Não informado"

  return (
    <TableRow>
      <TableCell>
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent>
            <DialogHeader>
                <DialogTitle>Detalhes do Paciente</DialogTitle>
                <DialogDescription>Visualização completa dos dados cadastrais.</DialogDescription>
            </DialogHeader>
            <PatientsDetails />
          </DialogContent>
        </Dialog>

        <Button
          variant="outline"
          size="xs"
          onClick={(e) => {
            e.stopPropagation()
            setIsDetailsOpen(true)
          }}
        >
          <Search className="h-3 w-3" />
          <span className="sr-only">Detalhes</span>
        </Button>
      </TableCell>

      <TableCell className="font-medium">{cpf}</TableCell>
      <TableCell className="font-medium">{firstName} {lastName}</TableCell>
      <TableCell className="text-muted-foreground">{phoneNumber}</TableCell>
      <TableCell className="text-muted-foreground">{new Date(dateOfBirth).toLocaleDateString("pt-BR")}</TableCell>
      <TableCell className="text-muted-foreground">{email}</TableCell>
      <TableCell className="text-muted-foreground">{genderLabel}</TableCell>

      {/* <TableCell>
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${status === "Ativo" ? "bg-green-500" : "bg-slate-400"}`} />
          <span className="font-medium text-muted-foreground">{status || "Inativo"}</span>
        </div>
      </TableCell> */}

      <TableCell>
        <div className="flex items-center gap-2">
          
          {/* Modal de Edição */}
          <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
             {isEditOpen && (
                <EditPatient
                  patient={patientDataForEdit}
                  onClose={() => setIsEditOpen(false)}
                />
             )}
          </Dialog>

          {/* MODAL DE EXCLUSÃO (USANDO SEU COMPONENTE) */}
          <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
            {/* Importante: Renderize o conteúdo apenas se estiver aberto para resetar estados internos */}
            {isDeleteOpen && (
                <DeletePatientDialog 
                    fullName={`${firstName} ${lastName}`}
                    isDeleting={isDeleting}
                    onClose={() => setIsDeleteOpen(false)}
                    onDelete={async () => await deletePatientFn(id)}
                />
            )}
          </Dialog>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsEditOpen(true)
                  }}
                  className="cursor-pointer h-7 w-7 hover:bg-blue-100 hover:text-blue-600 transition-colors"
                >
                  <UserPen className="h-4 w-4" />
                  <span className="sr-only">Editar</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">Editar paciente</TooltipContent>
            </Tooltip>

            {/* Botão Excluir */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsDeleteOpen(true)
                  }}
                  className="cursor-pointer h-7 w-7 hover:bg-red-100 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Excluir</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">Excluir paciente</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </TableCell>
    </TableRow>
  )
}