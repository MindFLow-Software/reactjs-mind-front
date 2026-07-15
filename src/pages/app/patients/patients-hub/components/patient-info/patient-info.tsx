'use client'

import {
  Copy,
  User,
  Plus,
  Mars,
  Video,
  Venus,
  Equal,
  MapPin,
  Activity,
  SquarePen,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { CardSection } from '../card-section/card-section'

import './patient-info.css'
import { Time } from '@/utils/time'
import { Mask } from '@/utils/mask'
import type { Gender } from '@/types/shared/enums'
import { Clipboard } from '@/utils/clipboard'
import type { IPatientProfile } from '@/types/patient-profile/patient-profile'

interface PatientInfoProps {
  patient: Pick<
    IPatientProfile,
    'dateOfBirth' | 'cpf' | 'email' | 'phoneNumber' | 'gender'
  >
}

const DASH = '—'

function GenderBadge({ gender }: { gender: Gender }) {
  const map: Record<
    Gender,
    { label: string; icon: React.ReactNode; className: string }
  > = {
    MASCULINE: {
      label: 'Masculino',
      icon: <Mars className="size-3" />,
      className: 'ph-gender-badge--masculine',
    },
    FEMININE: {
      label: 'Feminino',
      icon: <Venus className="size-3" />,
      className: 'ph-gender-badge--feminine',
    },
    OTHER: {
      label: 'Outro',
      icon: <Equal className="size-3" />,
      className: 'ph-gender-badge--other',
    },
  }

  const { label, icon, className } = map[gender]

  return (
    <span className={cn('ph-gender-badge', className)}>
      {icon} {label}
    </span>
  )
}

function CardActionButton({
  label,
  icon,
  variant = 'add',
  onClick,
}: {
  label: string
  icon?: React.ReactNode
  variant?: 'add' | 'edit'
  onClick?: () => void
}) {
  if (variant === 'edit') {
    return (
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onClick}
        disabled={!onClick}
        className="ph-card-action-edit"
      >
        {icon}
        {label}
      </Button>
    )
  }

  return (
    <Button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className="ph-card-action-add"
    >
      <Plus className="size-3.5" />
      {label}
    </Button>
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
    <div className={cn('ph-field-row', !last && 'ph-field-row--bordered')}>
      <span className="ph-field-row__label">{label}</span>
      <div className="ph-field-row__value">{value}</div>
    </div>
  )
}

export function PatientInfo({ patient }: PatientInfoProps) {
  const age = Time.calculateAge(patient?.dateOfBirth)
  const dateOfBirth = patient?.dateOfBirth
    ? Time.toBrazilianFormat(patient.dateOfBirth)
    : null

  const cpf = Mask.cpf(patient?.cpf)
  const phone = Mask.phone(patient?.phoneNumber)

  return (
    <div className="ph-patient-info">
      <div className="ph-patient-info__grid">
        {/* Identificação */}
        <CardSection
          header={{
            icon: <User className="size-4 text-blue-600" />,
            iconBg: 'bg-blue-50 dark:bg-blue-950/30',
            title: 'Identificação',
            subtitle: 'Dados pessoais e contato',
            action: (
              <CardActionButton
                variant="edit"
                label="Editar"
                icon={<SquarePen className="size-3.5" />}
              />
            ),
          }}
        >
          <FieldRow label="Idade" value={age ?? DASH} />
          <FieldRow
            label="Nascimento"
            value={
              dateOfBirth ? (
                <>
                  <span className="font-mono tabular-nums">{dateOfBirth}</span>
                  <button
                    type="button"
                    onClick={() => Clipboard.copy(dateOfBirth)}
                    className="ph-copy-btn"
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
                <CardActionButton label="Adicionar CPF" />
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
                <CardActionButton label="Adicionar telefone" />
              )
            }
          />
          <FieldRow
            label="E-mail"
            last
            value={
              patient.email ?? <CardActionButton label="Adicionar e-mail" />
            }
          />
        </CardSection>

        {/* Atendimento */}
        <CardSection
          header={{
            icon: <Activity className="size-4 text-emerald-600" />,
            iconBg: 'bg-emerald-50 dark:bg-emerald-950/30',
            title: 'Atendimento',
            subtitle: 'Modalidade, frequência e valores',
            action: (
              <CardActionButton
                variant="edit"
                label="Editar"
                icon={<SquarePen className="size-3.5" />}
              />
            ),
          }}
        >
          <FieldRow
            label="Modalidade"
            value={
              <span className="ph-modality-badge">
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
        header={{
          icon: <MapPin className="size-4 text-violet-600" />,
          iconBg: 'bg-violet-50 dark:bg-violet-950/30',
          title: 'Endereço',
          subtitle: 'Localização do paciente',
          action: (
            <CardActionButton
              variant="edit"
              label="Adicionar"
              icon={<Plus className="size-3.5" />}
            />
          ),
        }}
      >
        <div className="ph-address-empty">
          Endereço não cadastrado.&nbsp;
          <button type="button" className="ph-address-empty__link" disabled>
            Adicionar agora
          </button>
        </div>
      </CardSection>
    </div>
  )
}
