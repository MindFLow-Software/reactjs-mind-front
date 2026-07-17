import { useState } from 'react'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PatientProfileStatus } from '@/types/patient-profile/patient-profile-status'
import type { IgetPatientProfileDetailsResponse } from '@/api/patient-profiles/get-patient-profile-details'

import { PatientDetailsHeader } from '../patient-details-header/patient-details-header'
import { PatientGeneralData } from '../tabs/general-data/general-data'
import { AnamnesisForm } from '../tabs/anamnesis/anamnesis-form'
import { PatientSessionsTimeline } from '../tabs/sessions-timeline/patient-sessions-timeline'
import { PatientFilesTab } from '../tabs/documents/patient-files-tab'
import { PatientResumeTab } from '../tabs/resume/patient-resume-tab'
import './follow-up-tabs.css'

type IFollowUpPatientDetails = NonNullable<
  IgetPatientProfileDetailsResponse['patient']
>
type IFollowUpDetailsMeta = IgetPatientProfileDetailsResponse['meta']

const FOLLOW_UP_TABS = [
  { value: 'clinical', label: 'Dados Cadastrais' },
  { value: 'anamnesis', label: 'Anamnese' },
  { value: 'timeline', label: 'Historico' },
  { value: 'docs', label: 'Arquivos' },
  { value: 'resume', label: 'Resumo' },
] as const

type IPatientFollowUpTabs = {
  patient: IFollowUpPatientDetails
  timeline: {
    meta: IFollowUpDetailsMeta
    pageIndex: number
    onPageChange: (newIndex: number) => void
  }
}

export function PatientFollowUpTabs({
  patient,
  timeline,
}: IPatientFollowUpTabs) {
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
          <PatientGeneralData
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
