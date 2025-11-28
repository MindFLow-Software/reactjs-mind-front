import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function ResourcesGrid() {
    return (
        <section className="w-full bg-white py-24 border-t border-slate-100">
            <div className="container mx-auto px-6 md:px-8 lg:px-12">

                {/* Grid de 2 Colunas */}
                <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 lg:gap-4">

                    <div className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white transition-all duration-300 hover:shadow-xl hover:shadow-slate-900/5">

                        <div className="relative h-72 w-full overflow-hidden bg-slate-50 sm:h-80 lg:h-96">

                            {/* --- COLOQUE SUA IMAGEM AQUI --- */}
                            <img src="/mind.png" alt="Doc" className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105" />

                            {/* Placeholder visual (Pode apagar isso quando por a imagem) */}
                            <div className="flex h-full w-full items-center justify-center text-slate-300">
                                <span className="text-sm font-medium uppercase tracking-widest">Imagem 1 (Dashboard)</span>
                            </div>

                        </div>

                        {/* 2. CONTEÚDO */}
                        <div className="flex flex-1 flex-col justify-between border-t border-slate-100 p-8">
                            <div>
                                <h3 className="text-2xl font-bold tracking-tight text-slate-900">
                                    Menos Burocracia, Mais Escuta
                                </h3>
                                <p className="mt-3 text-base leading-relaxed text-slate-600">
                                    A tecnologia não deve atrapalhar seu atendimento. Criamos uma plataforma invisível e intuitiva que cuida da gestão, agenda e financeiro, para que sua atenção fique 100% no paciente.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* === CARD 2 (Direita) === */}
                    <div className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white transition-all duration-300 hover:shadow-xl hover:shadow-slate-900/5">

                        <div className="relative h-72 w-full overflow-hidden bg-slate-50 sm:h-80 lg:h-96">

                            {/* --- COLOQUE SUA IMAGEM AQUI --- */}
                            {/* <img src="/caminho-da-imagem-2.png" alt="AI" className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105" /> */}

                            <div className="flex h-full w-full items-center justify-center text-slate-300">
                                <span className="text-sm font-medium uppercase tracking-widest">Imagem 2 (IA Chat)</span>
                            </div>

                        </div>

                        {/* 2. CONTEÚDO */}
                        <div className="flex flex-1 flex-col justify-between border-t border-slate-100 p-8">
                            <div>
                                <h3 className="text-2xl font-bold tracking-tight text-slate-900">
                                    MindFlush AI
                                </h3>
                                <p className="mt-3 text-base leading-relaxed text-slate-600">
                                    Use nossa IA para transcrever sessões ou organizar sua agenda automaticamente, sem precisar lidar com configurações complexas.
                                </p>
                            </div>

                            <div className="mt-8">
                                <Link
                                    to="#ai"
                                    className="group/link inline-flex items-center text-sm font-bold text-blue-600 transition-colors hover:text-blue-700"
                                >
                                    Conhecer a IA
                                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/link:translate-x-1" />
                                </Link>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}