import { Footer } from './components/footer/footer'
import { Header } from './components/header/header'
import { HeroSection } from './components/hero/hero/hero'
import { IntegrationsSection } from './components/integrations-section/integrations-section'
import { ResourcesGrid } from './components/resources-grid/resources-grid'
import { StatsSection } from './components/stats-section/stats-section'
import { TestimonialsSection } from './components/testimonials/testimonials'
import './components/shared/landing-typography.css'

export function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <Header />

      <main className="flex-1">
        <HeroSection />
        <StatsSection />
        <IntegrationsSection />
        <ResourcesGrid />
        <TestimonialsSection />
      </main>
      <Footer />
    </div>
  )
}
