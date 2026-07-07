import { Footer } from './components/footer'
import { Header } from './components/hearder'
import { HeroSection } from './components/hero/hero'
import { IntegrationsSection } from './components/integrations-section'
import { ResourcesGrid } from './components/resources-grid'
import { StatsSection } from './components/stats-section'
import { TestimonialsSection } from './components/testimonials'
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
