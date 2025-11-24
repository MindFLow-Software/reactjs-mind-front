import { Header } from "./components/hearder"
import { Hero } from "./components/hero"
import { IntegrationsSection } from "./components/integrations-section"
import { ResourcesGrid } from "./components/resources-grid"
import { StatsSection } from "./components/stats-section"
import { TestimonialsSection } from "./components/testimonials"

export function LandingPage() {
    return (
        <div className="min-h-screen flex flex-col bg-slate-100">
            <Header />

            <main className="flex-1">
                <Hero />
                <StatsSection/>
                <IntegrationsSection/>
                <ResourcesGrid/>
                <TestimonialsSection/>
            </main>
        </div>
    )
}