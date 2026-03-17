import { Footer } from "./components/footer"
import { Header } from "./components/hearder"
import { HeroSection } from "./components/hero"
import { IntegrationsSection } from "./components/integrations-section"
import { ResourcesGrid } from "./components/resources-grid"
import { SolutionsGrid } from "./components/solutions-grid"
import { StatsSection } from "./components/stats-section"
import { TestimonialsSection } from "./components/testimonials"

export function LandingPage() {
    return (
        <div className="min-h-screen flex flex-col bg-slate-100">
            <Header />

            <main className="flex-1">
                <HeroSection />
                <StatsSection/>
                <IntegrationsSection/>
                <ResourcesGrid/>
                <SolutionsGrid/>
                <TestimonialsSection/>
            </main>
            <Footer/>
        </div>
    )
}