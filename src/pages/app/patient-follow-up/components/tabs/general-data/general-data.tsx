'use client'

import { Copy, Video, SquarePen } from 'lucide-react'

import { Time } from '@/utils/time'
import { Mask } from '@/utils/mask'
import { Clipboard } from '@/utils/clipboard'
import type { IPatientProfile } from '@/types/patient-profile/patient-profile'

import { TabCard } from '../tab-card/tab-card'
import { FieldSection } from './field-section/field-section'
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
  const dateOfBirth = patient?.dateOfBirth
    ? Time.toBrazilianFormat(patient.dateOfBirth)
    : null

  const cpf = Mask.cpf(patient?.cpf)
  const phone = Mask.phone(patient?.phoneNumber)

  return (
    <div className="gd-general-data">
      <TabCard
        title="Dados cadastrais"
        description="Informações pessoais, contato e convênio"
        action={
          <CardActionButton
            variant="edit"
            label="Editar"
            icon={<SquarePen className="size-3.5" />}
          />
        }
      >
        <FieldSection label="Identificação">
          <FieldRow
            label="Nascimento"
            value={
              dateOfBirth ? (
                <>
                  <span className="font-mono tabular-nums">{dateOfBirth}</span>
                  <button
                    type="button"
                    onClick={() => Clipboard.copy(dateOfBirth)}
                    className="gd-copy-btn"
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
            value={
              patient.email ?? <CardActionButton label="Adicionar e-mail" />
            }
          />
        </FieldSection>

        <FieldSection label="Atendimento">
          <FieldRow
            label="Modalidade"
            value={
              <span className="gd-modality-badge">
                <Video className="size-3" />
                Online
              </span>
            }
          />
          <FieldRow label="Frequência" value={DASH} />
          <FieldRow label="Valor / Sessão" value={DASH} />
          <FieldRow label="Indicação" value={DASH} />
          <FieldRow label="Terapeuta resp." value={DASH} />
          <FieldRow label="Início" value={DASH} />
        </FieldSection>

        <FieldSection label="Endereço">
          <div className="gd-address-empty">
            Endereço não cadastrado.&nbsp;
            <button type="button" className="gd-address-empty__link" disabled>
              Adicionar agora
            </button>
          </div>
        </FieldSection>
      </TabCard>
    </div>
  )
}
