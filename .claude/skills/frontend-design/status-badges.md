# MindFlush — Padrão de Status (Badges)

Documento de referência para padronizar a representação visual de **status de paciente** em todo o software MindFlush. Use este padrão em todas as telas (lista de pacientes, prontuário, dashboard, agenda, etc.) para criar consistência e memória muscular.

---

## 1. Princípios

1. **Sempre 3 elementos**: ícone redondo colorido + label em português + fundo suave da mesma família de cor.
2. **Sem CAPS LOCK**, sem `text-transform: uppercase`. Use casing natural (`Ativo`, não `ATIVO`).
3. **Pílula** (`border-radius: 9999px`), nunca retângulo nem chip quadrado.
4. **Cor = significado**, não decoração:
   - Verde → estado positivo / em andamento saudável
   - Âmbar → atenção / aguardando ação
   - Vermelho → estado negativo / encerrado / bloqueado
5. **Ícone reforça o label** — nunca substitui. O texto deve estar sempre presente para acessibilidade.
6. **Tamanho único** na lista (12px / padding 3px 10px). Em headers de prontuário, pode escalar para 13px.

---

## 2. Tokens de cor

```css
/* Ativo — verde */
--badge-active-bg:   #dcfce7;
--badge-active-fg:   #166534;
--badge-active-ico:  #16a34a;

/* Avaliação / Pendente — âmbar */
--badge-pending-bg:  #fef3c7;
--badge-pending-fg:  #92400e;
--badge-pending-ico: #d97706;

/* Inativo / Encerrado — vermelho */
--badge-inactive-bg: #fee2e2;
--badge-inactive-fg: #991b1b;
--badge-inactive-ico:#dc2626;

/* Arquivado — ciano (uso secundário) */
--badge-archived-bg: #cffafe;
--badge-archived-fg: #155e75;
--badge-archived-ico:#0891b2;
```

> Os hexadecimais correspondem a `green-100/700/600`, `amber-100/800/600`, `red-100/800/600` e `cyan-100/800/600` do Tailwind.

---

## 3. Mapa canônico de status

| Chave (BD)   | Label PT-BR  | Cor      | Ícone (Lucide)      | Quando usar                                              |
|--------------|--------------|----------|---------------------|----------------------------------------------------------|
| `active`     | Ativo        | verde    | `Check`             | Paciente em acompanhamento ativo, sessões em curso       |
| `pending`    | Avaliação    | âmbar    | `Clock`             | Cadastro recém-criado, aguardando primeira sessão        |
| `inactive`   | Inativo      | vermelho | `X`                 | Sem sessões há > 60 dias, alta clínica ou desistência    |
| `archived`   | Arquivado    | ciano    | `ArrowDownToLine`   | Pasta movida para arquivo morto pelo psicólogo            |

⚠ **Não inventar status novos** sem atualizar este documento e os tipos compartilhados (`src/types/patient.ts`).

---

## 4. Componente React (referência)

Local sugerido: `src/components/ui/status-badge.tsx`

```tsx
import { Check, Clock, X, ArrowDownToLine } from "lucide-react";
import { cn } from "@/lib/utils";

export type PatientStatus = "active" | "pending" | "inactive" | "archived";

const STATUS_CONFIG: Record<
  PatientStatus,
  { label: string; bg: string; fg: string; ico: string; Icon: React.ComponentType<{ className?: string }> }
> = {
  active:   { label: "Ativo",     bg: "bg-green-100",  fg: "text-green-800",  ico: "bg-green-600",  Icon: Check },
  pending:  { label: "Avaliação", bg: "bg-amber-100",  fg: "text-amber-800",  ico: "bg-amber-600",  Icon: Clock },
  inactive: { label: "Inativo",   bg: "bg-red-100",    fg: "text-red-800",    ico: "bg-red-600",    Icon: X },
  archived: { label: "Arquivado", bg: "bg-cyan-100",   fg: "text-cyan-800",   ico: "bg-cyan-600",   Icon: ArrowDownToLine },
};

interface StatusBadgeProps {
  status: PatientStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const cfg = STATUS_CONFIG[status];
  const Icon = cfg.Icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full pl-1.5 pr-2.5 py-0.5",
        "text-xs font-semibold leading-tight whitespace-nowrap",
        cfg.bg,
        cfg.fg,
        className
      )}
    >
      <span className={cn("grid place-items-center w-3.5 h-3.5 rounded-full text-white", cfg.ico)}>
        <Icon className="w-2.5 h-2.5" strokeWidth={3.2} />
      </span>
      {cfg.label}
    </span>
  );
}
```

### Uso

```tsx
import { StatusBadge } from "@/components/ui/status-badge";

<StatusBadge status={patient.status} />
```

---

## 5. Padrões de tamanho

| Contexto                  | Tamanho        | Altura |
|---------------------------|----------------|--------|
| Linha de tabela           | `text-xs` (12px) | 22px |
| Cabeçalho de prontuário   | `text-sm` (13px) | 26px |
| Card de dashboard         | `text-xs` (12px) | 22px |

Para o tamanho `sm`, aceitar prop `size?: "sm" | "md"` no componente — `md` aumenta para `text-sm` e o ícone para `w-4 h-4`.

---

## 6. Acessibilidade

- O badge deve ter `aria-label` redundante apenas se o ícone vier sozinho. Como sempre exibimos o label de texto, **não é necessário aria-label adicional**.
- Contraste: todas as combinações fg/bg passam **WCAG AA** (≥ 4.5:1).
- Não use status apenas pela cor: o ícone e o texto carregam a informação para usuários com daltonismo.

---

## 7. Filtros (chips)

Os chips de filtro no topo da lista (Todos / Ativos / Inativos / Avaliação) seguem o **mesmo mapa de cores** mas em variação `outline` quando inativos:

```tsx
// Filtro inativo: borda da cor do status, fundo branco
// Filtro ativo: fundo da cor do status (versão -100), texto da versão -800
<button className={cn(
  "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold border transition",
  selected
    ? "bg-green-100 text-green-800 border-green-200"
    : "bg-white text-slate-600 border-slate-200 hover:border-green-300"
)}>
  <span className="w-1.5 h-1.5 rounded-full bg-green-600" />
  Ativos <span className="text-slate-400 font-medium">98</span>
</button>
```

---

## 8. Migração

Substituir todos os usos antigos:

```tsx
// ❌ Antes
<Badge variant="default">ATIVO</Badge>
<span className="bg-green-500 text-white px-2 py-1 rounded">Ativo</span>

// ✅ Depois
<StatusBadge status="active" />
```

Localizar com `grep -rn "ATIVO\|status.*Badge\|bg-green.*Ativo" src/`.

---

## 9. Checklist para Claude Code

- [ ] Criar `src/components/ui/status-badge.tsx` com o componente acima
- [ ] Adicionar tipo `PatientStatus` em `src/types/patient.ts` (se não existir)
- [ ] Substituir todos os badges de status na lista de pacientes (`patients-table.tsx`)
- [ ] Aplicar no header do prontuário
- [ ] Aplicar nos cards de paciente do dashboard
- [ ] Aplicar nos chips de filtro (variação outline)
- [ ] Remover quaisquer `text-transform: uppercase` nos badges existentes
- [ ] Garantir `lucide-react` instalado (já é dependência do projeto)
- [ ] Garantir `lucide-icons` para os icons
- [ ] Rodar `pnpm typecheck` e `pnpm lint`

---

**Versão**: 1.0 · **Data**: 08/05/2026 · **Owner**: Design System MindFlush
