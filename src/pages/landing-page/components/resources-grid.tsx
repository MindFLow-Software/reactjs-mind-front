import { ArrowRight } from "lucide-react"

export function ResourcesGrid() {
  return (
    <section className="w-full bg-white py-24 border-t border-slate-100">
      <div className="container mx-auto px-6 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {/* Card 1 */}
          <div className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white transition-all duration-500 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-100">
            <div className="relative h-72 w-full overflow-hidden bg-slate-50 sm:h-80 lg:h-96">
              <img
                src="/mind3.png"
                alt="Dashboard MindFlush"
                className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              />
            </div>

            <div className="flex flex-1 flex-col justify-between p-8">
              <div>
                <h3 className="text-2xl font-bold tracking-tight text-slate-900 transition-colors duration-300 group-hover:text-slate-800">
                  Menos Burocracia, Mais Escuta
                </h3>
                <p className="mt-4 text-base leading-relaxed text-slate-500">
                  A tecnologia não deve atrapalhar seu atendimento. Criamos uma plataforma invisível e intuitiva que
                  cuida da gestão, agenda e financeiro, para que sua atenção fique 100% no paciente.
                </p>
              </div>

              <div className="mt-6 flex items-center gap-2 text-sm font-medium text-slate-400 transition-colors duration-300 group-hover:text-blue-600">
                <span>Saiba mais</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white transition-all duration-500 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-100">
            <div className="relative h-72 w-full overflow-hidden bg-slate-50 sm:h-80 lg:h-96">
              <img
                src="/mind5.png"
                alt="Design Intuitivo MindFlush"
                className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              />
            </div>

            <div className="flex flex-1 flex-col justify-between p-8">
              <div>
                <h3 className="text-2xl font-bold tracking-tight text-slate-900 transition-colors duration-300 group-hover:text-slate-800">
                  Design invisível, gestão poderosa
                </h3>
                <p className="mt-4 text-base leading-relaxed text-slate-500">
                  Diga adeus aos sistemas travados e complexos. O MindFlush foi desenhado para fluir naturalmente,
                  automatizando a burocracia com poucos toques para que sua energia fique 100% disponível para seus
                  pacientes.
                </p>
              </div>

              <div className="mt-6 flex items-center gap-2 text-sm font-medium text-slate-400 transition-colors duration-300 group-hover:text-blue-600">
                <span>Saiba mais</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
