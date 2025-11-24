import {
    FileText,
    Calendar,
    Wallet,
    Video,
    Lock,
    BrainCircuit
} from "lucide-react";

const features = [
    {
        icon: FileText,
        title: "Prontuário Eletrônico",
        description: "Anote sessões, crie evoluções e armazene documentos com total segurança. Tudo organizado por paciente."
    },
    {
        icon: Calendar,
        title: "Agenda Inteligente",
        description: "Gestão completa de horários, com confirmações automáticas para reduzir faltas e conflitos."
    },
    {
        icon: Wallet,
        title: "Controle Financeiro",
        description: "Saiba exatamente quanto vai receber. Emissão de recibos, controle de sessões pagas e pendentes."
    },
    {
        icon: Video,
        title: "Telemedicina Integrada",
        description: "Sala de vídeo segura e criptografada dentro da plataforma. Sem precisar enviar links do Zoom ou Meet."
    },
    {
        icon: Lock,
        title: "Segurança e LGPD",
        description: "Seus dados e de seus pacientes blindados. Criptografia de ponta a ponta e conformidade total com a lei."
    },
    {
        icon: BrainCircuit,
        title: "Resumos com IA",
        description: "Ferramentas auxiliares para identificar padrões e ajudar na elaboração de laudos mais precisos."
    }
];

export function Features() {
    return (
        <section id="produtos" className="bg-white py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">

                {/* Cabeçalho da Seção */}
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-base font-semibold leading-7 text-blue-600">
                        Tudo em um só lugar
                    </h2>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                        A plataforma completa para sua clínica
                    </p>
                    <p className="mt-6 text-lg leading-8 text-slate-600">
                        Elimine planilhas e papéis. O MindFlush centraliza toda a gestão do seu consultório para você focar no que importa: o paciente.
                    </p>
                </div>

                {/* Grid de Features */}
                <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                    <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                        {features.map((feature) => (
                            <div key={feature.title} className="group relative flex flex-col rounded-2xl border border-slate-200 bg-slate-50 p-8 transition-all hover:border-blue-200 hover:bg-white hover:shadow-xl hover:shadow-blue-900/5">
                                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-slate-900">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 transition-transform group-hover:scale-110">
                                        <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                                    </div>
                                    {feature.title}
                                </dt>
                                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600">
                                    <p className="flex-auto">{feature.description}</p>
                                </dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>
        </section>
    )
}