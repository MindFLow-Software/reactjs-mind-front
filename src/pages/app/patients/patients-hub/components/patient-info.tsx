'use client'

import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  Copy,
  SquarePen,
  MapPin,
  Activity,
  User,
  Video,
  Plus,
} from 'lucide-react'
import { toast } from 'sonner'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import type { Gender } from '@/types/patient'

interface PatientInfoProps {
  patient: {
    dateOfBirth?: string | Date | null
    cpf?: string | null
    email?: string | null
    phoneNumber?: string | null
    gender?: Gender | null
  }
}

const DASH = '—'

function formatCPF(value: string | null | undefined) {
  if (!value) return null
  return value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
}

function formatPhone(value: string | null | undefined) {
  if (!value) return null
  const d = value.replace(/\D/g, '')
  return d.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2')
}

function calculateAge(dob: string | Date | null | undefined) {
  if (!dob) return null
  const birth = new Date(dob)
  if (isNaN(birth.getTime())) return null
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
  return `${age} anos`
}

function GenderBadge({ gender }: { gender: Gender }) {
  const map: Record<
    Gender,
    { label: string; symbol: string; className: string }
  > = {
    MASCULINE: {
      label: 'Masculino',
      symbol: '♂',
      className:
        'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300',
    },
    FEMININE: {
      label: 'Feminino',
      symbol: '♀',
      className:
        'bg-pink-50 text-pink-700 dark:bg-pink-950/40 dark:text-pink-300',
    },
    OTHER: {
      label: 'Outro',
      symbol: '◈',
      className:
        'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300',
    },
  }
  const { label, symbol, className } = map[gender]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold',
        className,
      )}
    >
      {symbol} {label}
    </span>
  )
}

function AddLink({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline cursor-pointer"
    >
      + {label}
    </button>
  )
}

function FieldRow({
  label,
  value,
  last,
}: {
  label: string
  value: React.ReactNode
  last?: boolean
}) {
  return (
    <div
      className={cn(
        'flex items-center gap-4 py-3',
        !last && 'border-b border-border/40',
      )}
    >
      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground w-32 shrink-0">
        {label}
      </span>
      <div className="text-sm text-foreground flex items-center gap-2 min-w-0">
        {value}
      </div>
    </div>
  )
}

function CardSection({
  icon,
  iconBg,
  title,
  subtitle,
  action,
  children,
}: {
  icon: React.ReactNode
  iconBg: string
  title: string
  subtitle: string
  action?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center gap-3 mb-1 pb-4 border-b border-border/40">
        <div
          className={cn(
            'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
            iconBg,
          )}
        >
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground leading-tight">
            {title}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
        </div>
        {action}
      </div>
      <div>{children}</div>
    </div>
  )
}

function EditButton() {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-7 gap-1.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer shrink-0"
    >
      <SquarePen className="size-3.5" />
      Editar
    </Button>
  )
}

export function PatientInfo({ patient }: PatientInfoProps) {
  const age = calculateAge(patient.dateOfBirth)
  const dob = patient.dateOfBirth
    ? format(new Date(patient.dateOfBirth), 'dd/MM/yyyy', { locale: ptBR })
    : null
  const cpf = formatCPF(patient.cpf)
  const phone = formatPhone(patient.phoneNumber)

  function copyToClipboard(value: string, label: string) {
    navigator.clipboard
      .writeText(value)
      .then(() => toast.success(`${label} copiado!`))
  }

  return (
    <div className="space-y-4 mt-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Identificação */}
        <CardSection
          icon={<User className="size-4 text-blue-600" />}
          iconBg="bg-blue-50 dark:bg-blue-950/30"
          title="Identificação"
          subtitle="Dados pessoais e contato"
          action={<EditButton />}
        >
          <FieldRow label="Idade" value={age ?? DASH} />
          <FieldRow
            label="Nascimento"
            value={
              dob ? (
                <>
                  <span className="font-mono tabular-nums">{dob}</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(dob, 'Data de nascimento')}
                    className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                  >
                    <Copy className="size-3" />
                  </button>
                </>
              ) : (
                DASH
              )
            }
          />
          <FieldRow
            label="CPF"
            value={
              cpf ? (
                <span className="font-mono tabular-nums">{cpf}</span>
              ) : (
                <AddLink label="Adicionar CPF" />
              )
            }
          />
          <FieldRow
            label="Gênero"
            value={
              patient.gender ? <GenderBadge gender={patient.gender} /> : DASH
            }
          />
          <FieldRow
            label="Telefone"
            value={
              phone ? (
                <span className="font-mono tabular-nums">{phone}</span>
              ) : (
                <AddLink label="Adicionar telefone" />
              )
            }
          />
          <FieldRow
            label="E-mail"
            last
            value={patient.email ?? <AddLink label="Adicionar e-mail" />}
          />
        </CardSection>

        {/* Atendimento */}
        <CardSection
          icon={<Activity className="size-4 text-emerald-600" />}
          iconBg="bg-emerald-50 dark:bg-emerald-950/30"
          title="Atendimento"
          subtitle="Modalidade, frequência e valores"
          action={<EditButton />}
        >
          <FieldRow
            label="Modalidade"
            value={
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                <Video className="size-3" />
                Online
              </span>
            }
          />
          <FieldRow label="Frequência" value={DASH} />
          <FieldRow label="Valor / Sessão" value={DASH} />
          <FieldRow
            label="Indicação"
            value={<span className="text-muted-foreground">{DASH}</span>}
          />
          <FieldRow label="Terapeuta resp." value={DASH} />
          <FieldRow label="Início" last value={DASH} />
        </CardSection>
      </div>

      {/* Endereço */}
      <CardSection
        icon={<MapPin className="size-4 text-violet-600" />}
        iconBg="bg-violet-50 dark:bg-violet-950/30"
        title="Endereço"
        subtitle="Localização do paciente"
        action={
          <Button
            variant="ghost"
            size="sm"
            className="h-7 gap-1.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer shrink-0"
          >
            <Plus className="size-3.5" />
            Adicionar
          </Button>
        }
      >
        <div className="flex items-center justify-center py-6 text-sm text-muted-foreground">
          Endereço não cadastrado.&nbsp;
          <button
            type="button"
            className="text-blue-600 dark:text-blue-400 font-medium hover:underline cursor-pointer"
          >
            Adicionar agora
          </button>
        </div>
      </CardSection>
    </div>
  )
}
