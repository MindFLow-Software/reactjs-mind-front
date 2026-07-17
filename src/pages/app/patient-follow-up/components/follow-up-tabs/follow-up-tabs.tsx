import { useState } from 'react'
import { Activity, ClipboardList, FileText, Sparkles, User } from 'lucide-react'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { IgetPatientProfileDetailsResponse } from '@/api/patient-profiles/get-patient-profile-details'

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
  { value: 'clinical', label: 'Dados Gerais', Icon: User },
  { value: 'anamnesis', label: 'Anamnese', Icon: ClipboardList },
  { value: 'timeline', label: 'Sessões', Icon: Activity },
  { value: 'docs', label: 'Documentos', Icon: FileText },
  { value: 'resume', label: 'Resumo Inteligente', Icon: Sparkles },
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
    <Tabs value={currentTab} onValueChange={setCurrentTab} className="pfu-tabs">
      <TabsList className="pfu-tabs-list">
        {FOLLOW_UP_TABS.map(({ value, label, Icon }) => (
          <TabsTrigger key={value} value={value} className="pfu-tab-trigger">
            <Icon className="size-4" />
            <span>{label}</span>
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

      <TabsContent value="docs" className="pfu-tab-content">
        <PatientFilesTab patientId={patient.id} />
      </TabsContent>

      <TabsContent value="resume" className="pfu-tab-content">
        <PatientResumeTab />
      </TabsContent>
    </Tabs>
  )
}
