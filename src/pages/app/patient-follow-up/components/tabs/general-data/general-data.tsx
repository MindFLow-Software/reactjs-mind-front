'use client'

import {
  Copy,
  User,
  Plus,
  Video,
  MapPin,
  Activity,
  SquarePen,
} from 'lucide-react'

import { Time } from '@/utils/time'
import { Mask } from '@/utils/mask'
import { Clipboard } from '@/utils/clipboard'
import type { IPatientProfile } from '@/types/patient-profile/patient-profile'

import { CardSection } from './card-section/card-section'
import { GenderBadge } from './gender-badge/gender-badge'
import { CardActionButton } from './card-action-button/card-action-button'
import { FieldRow } from './field-row/field-row'

import './general-data.css'

const DASH = '—'

type IPatientGeneralData = {
  patient: Pick<
    IPatientProfile,
    'dateOfBirth' | 'cpf' | 'email' | 'phoneNumber' | 'gender'
  >
}

export function PatientGeneralData({ patient }: IPatientGeneralData) {
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
