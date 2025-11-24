import {
    CalendarCheck,
    CreditCard,
    FileText,
    MessageCircle,
} from "lucide-react";

export function StatsSection() {
    return (
        <section className="relative overflow-hidden border-t border-slate-100 bg-white py-24">

            <div className="absolute inset-0 z-0 opacity-[0.03]"
                style={{ backgroundImage: 'radial-gradient(#1d4ed8 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
            </div>

            <div className="container relative z-10 mx-auto px-6 md:px-8 lg:px-12">

                <div className="grid gap-12 lg:grid-cols-2 lg:items-center">

                    <div className="relative max-w-lg">
                        <h2 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                            Gerenciando e otimizando a rotina dos
                            <span className="relative ml-2 inline-block">
                                especialistas.
                                <svg
                                    className="absolute -bottom-2 left-0 h-3 w-full text-blue-200"
                                    viewBox="0 0 100 10"
                                    preserveAspectRatio="none"
                                >
                                    <line
                                        x1="0"
                                        y1="5"
                                        x2="100"
                                        y2="5"
                                        stroke="currentColor"
                                        strokeWidth="8"
                                    />
                                </svg>
                            </span>
                        </h2>
                    </div>

                    <div className="flex flex-col gap-10 sm:flex-row sm:gap-16 lg:justify-end">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-blue-500 font-bold text-3xl">+</span>
                                <span className="text-5xl font-bold tracking-tight text-slate-900">1k</span>
                            </div>
                            <p className="mt-2 text-sm font-medium text-slate-600">Sessões realizadas</p>
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-blue-500 font-bold text-3xl">+</span>
                                <span className="text-5xl font-bold tracking-tight text-slate-900">5 0</span>
                            </div>
                            <p className="mt-2 text-sm font-medium text-slate-600">Clínicas ativas</p>
                        </div>
                    </div>
                </div>

                <div className="my-20 h-px w-full bg-slate-100 hidden lg:block" />

                <div className="grid grid-cols-1 gap-12 lg:grid-cols-4 lg:gap-0">

                    {/* Item 1 - Pix / Agenda */}
                    <div className="relative flex flex-col px-0 lg:px-6 lg:border-r lg:border-dashed lg:border-slate-300 first:pl-0">
                        <div className="mb-4 flex items-center gap-3">
                            <div className="h-6 w-1 rounded-full bg-blue-600"></div>
                            <CalendarCheck className="h-6 w-6 text-slate-700" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">Agendamento Fácil</h3>
                        <p className="mt-2 text-sm leading-relaxed text-slate-600">
                            Você terá sua própria agenda para marcar sessões nos horários que melhor se encaixam na sua rotina.
                        </p>
                    </div>

                    {/* Item 2 - Cartão / Prontuário */}
                    <div className="relative flex flex-col px-0 lg:px-6 lg:border-r lg:border-dashed lg:border-slate-300">
                        <div className="mb-4 flex items-center gap-3">
                            <div className="h-6 w-1 rounded-full bg-blue-600"></div>
                            <FileText className="h-6 w-6 text-slate-700" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">Prontuário Digital</h3>
                        <p className="mt-2 text-sm leading-relaxed text-slate-600">
                            Registre evoluções com total segurança, tudo fica criptografado, organizado por histórico e com opção de enviar arquivos do paciente.
                        </p>
                    </div>

                    {/* Item 3 - Boleto / Financeiro */}
                    <div className="relative flex flex-col px-0 lg:px-6 lg:border-r lg:border-dashed lg:border-slate-300">
                        <div className="mb-4 flex items-center gap-3">
                            <div className="h-6 w-1 rounded-full bg-blue-600"></div>
                            <CreditCard className="h-6 w-6 text-slate-700" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">Gestão Financeira</h3>
                        <p className="mt-2 text-sm leading-relaxed text-slate-600">
                            Controle pagamentos, emita recibos e saiba exatamente quanto sua clínica faturou no mês.
                        </p>
                    </div>

                    {/* Item 4 - Link / Lembretes */}
                    <div className="relative flex flex-col px-0 lg:px-6 last:pr-0">
                        <div className="mb-4 flex items-center gap-3">
                            <div className="h-6 w-1 rounded-full bg-blue-600"></div>
                            <MessageCircle className="h-6 w-6 text-slate-700" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">Lembretes via Zap</h3>
                        <p className="mt-2 text-sm leading-relaxed text-slate-600">
                            Reduza faltas enviando lembretes automáticos e links da sala de vídeo direto no WhatsApp.
                        </p>
                    </div>

                </div>
            </div>
        </section>
    );
}