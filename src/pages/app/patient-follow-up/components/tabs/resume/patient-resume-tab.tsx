'use client'

import { ResumeStatCards } from './resume-stat-cards'
import { ResumeFrequencyChart } from './resume-frequency-chart'
// import { ResumeHumorChart } from './resume-humor-chart'
import { ResumeUpcomingEvents } from './resume-upcoming-events'
import { ResumeClinicalAlerts } from './resume-clinical-alerts'
import './patient-resume-tab.css'

export function PatientResumeTab() {
  return (
    <div className="prt-root">
      <ResumeStatCards />

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
