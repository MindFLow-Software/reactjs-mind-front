'use client'

import { ResumeStatCards } from './resume/resume-stat-cards'
import { ResumeFrequencyChart } from './resume/resume-frequency-chart'
import { ResumeHumorChart } from './resume/resume-humor-chart'
import { ResumeUpcomingEvents } from './resume/resume-upcoming-events'
import { ResumeClinicalAlerts } from './resume/resume-clinical-alerts'
import './patient-resume-tab.css'

export function PatientResumeTab() {
  return (
    <div className="prt-root">
      <ResumeStatCards />

      <div className="prt-charts-grid">
        <ResumeFrequencyChart />
        <ResumeHumorChart />
      </div>

      <div className="prt-bottom-grid">
        <ResumeUpcomingEvents />
        <ResumeClinicalAlerts />
      </div>
    </div>
  )
}
