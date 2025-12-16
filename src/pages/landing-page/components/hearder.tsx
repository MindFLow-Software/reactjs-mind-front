import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Brain } from "@phosphor-icons/react";

export function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-slate-50/80 backdrop-blur-md">
            <div className="container mx-auto flex h-16 items-center px-6 md:px-8 lg:px-12">

                {/* LADO ESQUERDO: Logo */}
                <div className="flex flex-1 items-center justify-start">
                    <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
                        <div className="text-blue-600">
                            <Brain size={32} weight="bold" />
                        </div>
                        <span className="hidden text-xl font-bold tracking-tight text-slate-900 lg:inline-block">
                            MindFlush
                        </span>
                    </Link>
                </div>

                {/* CENTRO: Navegação */}
                <nav className="hidden items-center gap-8 md:flex">
                    <a
                        href="#funcionalidades"
                        className="text-sm font-medium text-slate-600 transition-colors hover:text-blue-600"
                    >
                        Funcionalidades
                    </a>
                    <a
                        href="#integracoes"
                        className="text-sm font-medium text-slate-600 transition-colors hover:text-blue-600"
                    >
                        Integrações
                    </a>
                    <a
                        href="#solucoes"
                        className="text-sm font-medium text-slate-600 transition-colors hover:text-blue-600"
                    >
                        Soluções
                    </a>
                    <a
                        href="#depoimentos"
                        className="text-sm font-medium text-slate-600 transition-colors hover:text-blue-600"
                    >
                        Depoimentos
                    </a>
                </nav>

                {/* LADO DIREITO: Botões */}
                <div className="flex flex-1 items-center justify-end gap-3">
                    <Link to="/sign-in">
                        <Button variant="ghost" size="sm" className="cursor-pointer hidden bg-transparent text-slate-700 hover:bg-slate-200 hover:text-blue-700 md:inline-flex">
                            Login
                        </Button>
                    </Link>

                    <Link to="/sign-up">
                        <Button size="sm" className="cursor-pointer bg-blue-600 font-semibold text-white shadow-sm hover:bg-blue-700">
                            Cadastre-se
                        </Button>
                    </Link>
                </div>

            </div>
        </header>
    )
}