import { useState } from 'react'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PatientProfileStatus } from '@/types/patient-profile/patient-profile-status'
import type { IgetPatientProfileDetailsResponse } from '@/api/patient-profiles/get-patient-profile-details'

import { PatientDetailsHeader } from '../patient-details-header/patient-details-header'
import { PatientInfo } from '../patient-info/patient-info'
import { AnamnesisForm } from '../anamnesis/anamnesis-form'
import { PatientSessionsTimeline } from '../timeline/patient-sessions-timeline'
import { PatientFilesTab } from '../files/patient-files-tab'
import { PatientResumeTab } from '../patient-resume-tab/patient-resume-tab'
import './follow-up-tabs.css'

type PatientDetails = NonNullable<IgetPatientProfileDetailsResponse['patient']>
type DetailsMeta = IgetPatientProfileDetailsResponse['meta']

const FOLLOW_UP_TABS = [
  { value: 'clinical', label: 'Dados Cadastrais' },
  { value: 'anamnesis', label: 'Anamnese' },
  { value: 'timeline', label: 'Historico' },
  { value: 'docs', label: 'Arquivos' },
  { value: 'resume', label: 'Resumo' },
] as const

type PatientFollowUpTabsProps = {
  patient: PatientDetails
  timeline: {
    meta: DetailsMeta
    pageIndex: number
    onPageChange: (newIndex: number) => void
  }
}

export function PatientFollowUpTabs({
  patient,
  timeline,
}: PatientFollowUpTabsProps) {
  const [currentTab, setCurrentTab] = useState('clinical')

  const patientName = `${patient.firstName} ${patient.lastName}`

  return (
    <>
      <div className="pfu-header-wrap">
        <PatientDetailsHeader
          patient={{
            ...patient,
            status: patient.status ?? PatientProfileStatus.INACTIVE,
          }}
        />
      </div>

      <Tabs
        value={currentTab}
        onValueChange={setCurrentTab}
        className="pfu-tabs"
      >
        <TabsList className="pfu-tabs-list">
          {FOLLOW_UP_TABS.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="pfu-tab-trigger"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="clinical" className="pfu-tab-content">
          <PatientInfo
            patient={{
              dateOfBirth: patient.dateOfBirth,
              cpf: patient.cpf,
              email: patient.email,
              phoneNumber: patient.phoneNumber,
              gender: patient.gender,
            }}
          />
        </TabsContent>

        <TabsContent value="anamnesis" className="pfu-tab-content">
          <AnamnesisForm patientId={patient.id} patientName={patientName} />
        </TabsContent>

        <TabsContent value="timeline" className="pfu-tab-content">
          <PatientSessionsTimeline
            sessions={patient.sessions}
            patientName={patientName}
            pagination={timeline}
          />
        </TabsContent>

        <TabsContent value="docs">
          <PatientFilesTab patientId={patient.id} />
        </TabsContent>

        <TabsContent value="resume" className="pfu-tab-content">
          <PatientResumeTab />
        </TabsContent>
      </Tabs>
    </>
  )
}
