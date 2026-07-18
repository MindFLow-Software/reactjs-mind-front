'use client'

import { SmartResume } from './smart-resume'
import { ResumeStatCards } from './resume-stat-cards'
import { ResumeFrequencyChart } from './resume-frequency-chart'
// import { ResumeHumorChart } from './resume-humor-chart'
import { ResumeUpcomingEvents } from './resume-upcoming-events'
import { ResumeClinicalAlerts } from './resume-clinical-alerts'

import './patient-resume-tab.css'
import { RecentDocuments } from './recent-documents'

export function PatientResumeTab() {
  return (
    <div className="prt-root">
      <ResumeStatCards />
      
      <div className="flex gap-4">
        <SmartResume />
        <RecentDocuments />
      </div>

      <div className="prt-charts">
        <ResumeFrequencyChart />
        {/* <ResumeHumorChart /> */}
      </div>

      <div className="prt-bottom-grid">
        <ResumeUpcomingEvents />
        <ResumeClinicalAlerts />
      </div>
    </div>
  )
}
