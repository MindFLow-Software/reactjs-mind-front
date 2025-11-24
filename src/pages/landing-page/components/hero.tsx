import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

const userAvatars = [
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&h=64",
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=64&h=64",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=64&h=64",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=64&h=64",
];

export function Hero() {
    return (
        <section className="relative overflow-hidden bg-slate-50 pt-16 md:pt-20 lg:pt-32 pb-24">
            {/* Background Blur */}
            <div className="absolute top-1/2 -right-36 z-0 h-96 w-96 rounded-full bg-blue-600 opacity-20 blur-3xl filter" />
            <div className="absolute -top-24 -left-24 z-0 h-96 w-96 rounded-full bg-blue-400 opacity-20 blur-3xl filter" />

            <div className="container relative z-10 mx-auto px-6 md:px-8 lg:px-12">
                <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">

                    <div className="flex flex-col items-start space-y-8">

                        <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-1.5 shadow-sm">
                            <div className="flex -space-x-3">
                                {userAvatars.map((url, i) => (
                                    <img
                                        key={i}
                                        src={url}
                                        alt={`User ${i}`}
                                        className="h-8 w-8 rounded-full border-2 border-white object-cover"
                                    />
                                ))}
                            </div>
                            <span className="text-sm font-medium text-slate-600 pl-2">
                                Escolhido por <span className="font-bold text-blue-600">+100 Psicólogos</span>
                            </span>
                        </div>

                        <div className="space-y-4">
                            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                                Foque no paciente. <br />
                                <span className="text-blue-600">A gestão é conosco.</span>
                            </h1>
                            <p className="max-w-xl text-lg text-slate-600 leading-relaxed">
                                Infraestrutura completa para sua clínica. Prontuários, agendamento e financeiro em um só lugar. Feito para psicólogos modernos.
                            </p>
                        </div>

                        <div className="flex flex-col w-full gap-3 sm:flex-row sm:items-center cursor-pointer">
                            <Link  to="/sign-in" >
                                <Button size="lg" className="bg-blue-600 text-white hover:bg-blue-700 h-12 px-8 text-base shadow-lg shadow-blue-600/20">
                                    Começar agora
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                        </div>

                        <div className="flex items-center gap-8 pt-4">
                            <div className="flex items-center gap-2">
                                <div className="rounded-full bg-blue-100 p-2 text-blue-600">
                                    <ShieldCheck size={20} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-900">Seguro</p>
                                    <p className="text-xs text-slate-500">Dados criptografados</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* LADO DIREITO: Mockup Visual (CSS Puro) */}
                    <div className="relative mx-auto w-full max-w-[600px] lg:max-w-none">

                    </div>

                </div>
            </div>
        </section>
    );
}