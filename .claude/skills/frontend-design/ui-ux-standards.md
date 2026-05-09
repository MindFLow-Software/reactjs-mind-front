# MindFlush — Padrão UI/UX Completo

Documento de referência extraído do código real do projeto. Use **sempre** para garantir consistência visual em todas as telas.

---

## Índice

1. [Tokens de Design](#1-tokens-de-design)
2. [Tipografia](#2-tipografia)
3. [Espaçamento e Grid](#3-espaçamento-e-grid)
4. [Bordas e Raio](#4-bordas-e-raio)
5. [Sombras e Elevação](#5-sombras-e-elevação)
6. [Ícones](#6-ícones)
7. [Dark Mode](#7-dark-mode)
8. [Componentes — Cards](#8-componentes--cards)
9. [Componentes — Tabelas](#9-componentes--tabelas)
10. [Componentes — Botões](#10-componentes--botões)
11. [Componentes — Badges e Status](#11-componentes--badges-e-status)
12. [Componentes — Formulários](#12-componentes--formulários)
13. [Componentes — Dialogs e Modais](#13-componentes--dialogs-e-modais)
14. [Componentes — Empty States](#14-componentes--empty-states)
15. [Componentes — Chips de Filtro](#15-componentes--chips-de-filtro)
16. [Layout de Página](#16-layout-de-página)
17. [Responsividade](#17-responsividade)
18. [Acessibilidade](#18-acessibilidade)
19. [Animações e Transições](#19-animações-e-transições)
20. [Regras Gerais (DO / DON'T)](#20-regras-gerais-do--dont)

---

## 1. Tokens de Design

### CSS Variables (definidas em `src/global.css`)

> Sempre use variáveis semânticas via classes Tailwind (`bg-card`, `text-foreground`, etc.), não os hexadecimais diretos.

#### Cores semânticas — uso no Tailwind

| Classe Tailwind         | Onde usar                                                  |
|-------------------------|------------------------------------------------------------|
| `bg-background`         | Fundo principal da página                                  |
| `bg-card`               | Fundo de cards, painéis, superfícies elevadas              |
| `bg-muted`              | Fundo de elementos secundários (tabs, inputs desativados)  |
| `bg-muted/50`           | Hover states de linhas, fundo de chips não selecionados    |
| `bg-primary`            | Ações primárias, destaques de brand (azul)                 |
| `text-foreground`       | Texto principal                                            |
| `text-muted-foreground` | Texto secundário, labels, placeholders                     |
| `text-primary`          | Links, labels de ação                                      |
| `border-border`         | Todas as bordas padrão                                     |
| `border-border/70`      | Bordas suaves (dentro de cards)                            |
| `ring-ring`             | Focus ring padrão                                          |

#### Cor primária (brand)

```
Primária: azul — oklch(0.623 0.214 259.815) ≈ blue-600
Foreground sobre primária: branco (#ffffff)

Uso inline equivalente: bg-blue-600, text-blue-600, bg-blue-500/10
Uso semântico: bg-primary, text-primary, border-primary, ring-ring

⚠️ --color-accent-primary (#4f35e1, roxo) é token de design system legado —
   NÃO é o primary da UI. Não usar como cor de ação ou destaque.
```

#### Tokens customizados (não usar como Tailwind, apenas em CSS)

```css
--color-accent-primary: #4f35e1
--color-accent-blue:    #027df0
--color-background-primary: #151515
--color-background-secondary: #1e1e1e
```

---

## 2. Tipografia

### Fontes

```
Títulos: 'Inter Tight', sans-serif
Corpo:   'Inter', sans-serif
Mono:    font-mono (IDs, CPFs, datas, números tabularizados)
```

### Escala de texto em contexto real

| Contexto                         | Classes                                              |
|----------------------------------|------------------------------------------------------|
| Título de página (H1)            | `text-2xl font-bold tracking-tight text-foreground`  |
| Título de card / seção           | `text-base font-semibold text-foreground`            |
| Título de dialog                 | `text-lg leading-none font-semibold`                 |
| Valor de métrica (número grande) | `text-4xl font-bold tabular-nums text-foreground`    |
| Valor de métrica (número médio)  | `text-2xl font-bold tabular-nums leading-none`       |
| Label de campo/seção             | `text-xs font-semibold uppercase tracking-wider text-muted-foreground` |
| Body padrão                      | `text-sm text-foreground`                            |
| Descrição / subtítulo            | `text-sm text-muted-foreground`                      |
| Texto pequeno / metadado         | `text-xs text-muted-foreground`                      |
| Texto mínimo (11px)              | `text-[11px] text-muted-foreground`                  |
| ID / código / CPF                | `font-mono text-[11px] tracking-wide`                |
| Números em tabela                | `tabular-nums`                                       |

### Regras de texto

- **Sem `text-transform: uppercase`** em badges ou labels de status.
- Usar `uppercase` apenas em section labels internos (ex.: `SectionLabel` dentro de modais).
- Truncate com `truncate` + `max-w-[...]` quando texto pode transbordar.
- Texto com quebra semântica: `line-clamp-2`, nunca truncate abrupto sem tooltip.

---

## 3. Espaçamento e Grid

### Gaps padrão

| Gap       | px  | Contexto                                     |
|-----------|-----|----------------------------------------------|
| `gap-0.5` | 2px | Elementos dentro de uma célula compacta      |
| `gap-1`   | 4px | Ícone + texto dentro de badge/chip           |
| `gap-1.5` | 6px | Ícone + label dentro de botão ou badge       |
| `gap-2`   | 8px | Campos de form inline, itens de toolbar      |
| `gap-3`   | 12px| Entre seções dentro de um card               |
| `gap-4`   | 16px| Entre cards no grid, entre grupos de campos  |
| `gap-5`   | 20px| Entre blocos de seção na página              |
| `gap-6`   | 24px| Espaçamento interno de card principal        |

### Padding interno de containers

| Nível        | Classes              | Uso                              |
|--------------|----------------------|----------------------------------|
| Compacto     | `p-2` / `px-2 py-1` | Chips, badges, botões pequenos   |
| Padrão       | `p-4` / `px-4 py-2` | Células de tabela, itens de menu |
| Card padrão  | `px-5 py-4`          | MetricCard                       |
| Card generoso| `px-6 py-5`          | Modal body, DataBlock            |
| Card mobile  | `p-4 md:p-6`         | Responsive card padding          |

### Grids de página

```tsx
// Dashboard — métricas
<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

// Dashboard — conteúdo principal + sidebar
<div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_340px]">

// Dashboard — bottom row
<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

// Patients — métricas (4 colunas)
<div className="grid grid-cols-2 lg:grid-cols-4 gap-3 px-6 pt-2 pb-0">

// Forms — 2 colunas
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

// Forms — 3 colunas
<div className="grid grid-cols-3 gap-4">
```

---

## 4. Bordas e Raio

### Raios canônicos

| Token Tailwind  | Valor aprox. | Onde usar                              |
|-----------------|-------------|----------------------------------------|
| `rounded-md`    | 6px         | Elementos de formulário (Input, Select)|
| `rounded-lg`    | 8px         | Tooltips, Popovers, DropdownMenus      |
| `rounded-xl`    | 12px        | Cards de métrica, botões CTA, chips    |
| `rounded-2xl`   | 16px        | Modais, surfaces de prontuário         |
| `rounded-[20px]`| 20px        | Cards shadcn padrão `<Card>`           |
| `rounded-full`  | 9999px      | Avatares, badges de status, pills      |

### Bordas padrão

```tsx
// Padrão — qualquer card/surface
border border-border

// Suave — dentro de cards
border border-border/70

// Divisor interno
border-b border-border/60

// Dashed — upload zones, empty states
border border-dashed border-border

// Colorida — accent/brand
border-l-4 border-primary   // header de seção
border-blue-500/20           // ring de ícone em métrica card
```

---

## 5. Sombras e Elevação

```tsx
// Sombra mínima — cards, superfícies
shadow-sm

// Sombra média — modais, dropdowns, cards com hover
shadow-md

// Hover effect
hover:shadow-md

// Glow customizado — botão CTA azul
shadow-[0_2px_8px_rgba(37,99,235,0.25)]

// Ring de ícone em métrica card
ring-1 ring-{color}-500/20
```

### Hierarquia de elevação

1. Fundo de página (`bg-background`)
2. Cards/surfaces (`bg-card shadow-sm`)
3. Toolbars/headers internos (`bg-muted/40`)
4. Dropdowns/Popovers (`z-50 shadow-md`)
5. Dialogs/Modais (`z-50 shadow-lg overlay bg-black/50`)

---

## 6. Ícones

**Biblioteca:** `lucide-react` (única, não misturar com outras)

### Tamanhos padrão

| Contexto                          | Classe             |
|-----------------------------------|--------------------|
| Badge / chip (ícone dentro)       | `h-3 w-3`          |
| Botão sm / toolbar                | `h-3.5 w-3.5`      |
| Botão padrão / nav                | `h-4 w-4`          |
| Card header / seção               | `h-5 w-5`          |
| Hero / empty state                | `size-5` a `size-8`|
| Ícone em container circular       | `h-5 w-5` (container `h-10 w-10`) |

### Container de ícone (métrica / ação rápida)

```tsx
// Pequeno (métrica card)
<div className="rounded-lg bg-{color}-500/10 p-2 ring-1 ring-{color}-500/20">
  <Icon className="size-4 text-{color}-500" />
</div>

// Médio (section header)
<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/40">
  <Icon className="h-5 w-5 text-blue-600" />
</div>

// Grande (empty state)
<div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted/50">
  <Icon className="size-5 text-muted-foreground/50" />
</div>
```

### Ícones por função semântica

| Função              | Ícone(s)                                      |
|---------------------|-----------------------------------------------|
| Paciente            | `UserRound`, `UserRoundPlus`, `UsersRound`    |
| Status ativo        | `Check`, `CheckCircle2`, `Activity`           |
| Status inativo      | `X`, `XCircle`                                |
| Status pendente     | `Clock`                                       |
| Status arquivado    | `ArrowDownToLine`                             |
| Navegação anterior  | `ChevronLeft`, `ChevronsLeft`                 |
| Navegação próxima   | `ChevronRight`, `ChevronsRight`               |
| Busca               | `Search`                                      |
| Filtros             | `SlidersHorizontal`                           |
| Calendário          | `CalendarIcon`, `CalendarDays`, `CalendarPlus`|
| Fechar / limpar     | `X`                                           |
| Copiar              | `Copy`                                        |
| Carregando          | `Loader2` + `animate-spin`                    |
| Mais opções         | `MoreVertical`                                |
| Editar              | `Pencil`                                      |
| Arquivar            | `Archive`, `ArchiveRestore`                   |
| Sessão / vídeo      | `Video`                                       |
| Gênero feminino     | `Venus`                                       |
| Gênero masculino    | `Mars`                                        |
| Outros / neutro     | `Users`                                       |
| Telefone            | `Phone`                                       |
| Email               | `Mail`                                        |
| Endereço            | `MapPin`                                      |
| Clínico             | `Stethoscope`                                 |
| Documentos          | `FileText`                                    |
| Câmera / foto       | `Camera`                                      |
| Tendência alta      | `TrendingUp`                                  |
| Tendência baixa     | `TrendingDown`                                |

---

## 7. Dark Mode

**Implementação:** classe `.dark` no `<html>`, gerenciada por `ThemeProvider`.  
**Storage:** `localStorage` key `MindFlush-theme` (valores: `light` | `dark` | `system`).

### Regras de dark mode

1. **Sempre adicionar variante `dark:`** quando usar cores opacas/fixas em bg e text.
2. Usar variáveis semânticas (`bg-card`, `text-foreground`) sempre que possível — elas já adaptam automaticamente.
3. Para cores inline (emerald, blue, zinc), sempre duplicar:

```tsx
// ✅ Correto
className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"

// ✅ Correto — usando variável semântica (já adapta)
className="bg-muted text-muted-foreground"

// ❌ Errado — sem dark mode em cor fixa
className="bg-emerald-100 text-emerald-700"
```

### Padrão de cor por categoria (light / dark)

| Cor       | Light bg            | Light text        | Dark bg                | Dark text          |
|-----------|---------------------|-------------------|------------------------|--------------------|
| Verde     | `bg-emerald-100`    | `text-emerald-700`| `dark:bg-emerald-900/30`| `dark:text-emerald-400`|
| Azul      | `bg-blue-100`       | `text-blue-700`   | `dark:bg-blue-900/30`  | `dark:text-blue-400`  |
| Âmbar     | `bg-amber-100`      | `text-amber-700`  | `dark:bg-amber-900/30` | `dark:text-amber-400` |
| Vermelho  | `bg-red-100`        | `text-red-700`    | `dark:bg-red-900/30`   | `dark:text-red-400`   |
| Rosa      | `bg-pink-100`       | `text-pink-700`   | `dark:bg-pink-900/30`  | `dark:text-pink-400`  |
| Zinco     | `bg-zinc-100`       | `text-zinc-600`   | `dark:bg-zinc-800/50`  | `dark:text-zinc-400`  |

---

## 8. Componentes — Cards

### Card de Métrica (patients-list e dashboard)

```tsx
// Padrão usado na patients-list
<div className="flex items-center gap-4 rounded-xl border bg-card px-5 py-4 shadow-sm">
  <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-lg", iconBg)}>
    {icon}  {/* h-5 w-5 text-{color}-600 */}
  </div>
  <div className="flex flex-col gap-0.5">
    <span className="text-2xl font-bold tabular-nums leading-none">{value}</span>
    <span className="text-xs text-muted-foreground font-medium">{label}</span>
    {sub && <span className="text-[11px] font-medium text-muted-foreground">{sub}</span>}
  </div>
</div>
```

### Card de Dashboard (com gradiente top bar)

```tsx
<Card className="relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
  {/* Barra colorida no topo — obrigatória */}
  <div className="absolute inset-x-0 top-0 h-1 rounded-t-xl bg-gradient-to-r from-{color}-400 to-{color}-600" />

  <div className="flex items-start justify-between">
    <p className="text-sm text-muted-foreground">{label}</p>
    {/* Ícone */}
    <div className="rounded-lg bg-{color}-500/10 p-2 ring-1 ring-{color}-500/20">
      <Icon className="size-4 text-{color}-500" />
    </div>
  </div>

  <div className="mt-3">
    <p className="text-4xl font-bold tabular-nums text-foreground">{value}</p>
    {/* Delta opcional */}
    {delta > 0 && (
      <div className="mt-2 flex items-center gap-1.5">
        <span className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
          <TrendingUp className="size-3" /> +{delta}
        </span>
        <span className="text-xs text-muted-foreground">vs. 30 dias anteriores</span>
      </div>
    )}
  </div>
</Card>
```

**Cores de gradiente por tipo:**
- Pacientes: `from-blue-400 to-blue-600`
- Sessões: `from-violet-400 to-violet-600`
- Horas: `from-amber-400 to-amber-600`
- Inativos/alerta: `from-red-400 to-red-600`

### Card de Ação Rápida

```tsx
<button className="flex items-center gap-3 rounded-xl border border-border bg-background p-3.5 cursor-pointer text-left transition-colors hover:bg-muted/50 active:bg-muted">
  <Icon className={cn("size-5 shrink-0", iconClass)} />
  <div className="min-w-0">
    <p className="text-sm font-semibold text-foreground leading-tight">{title}</p>
    <p className="text-xs text-muted-foreground">{subtitle}</p>
  </div>
</button>
// Grid: grid grid-cols-2 gap-2 dentro de CardContent
```

### Surface de página (PatientsDataBlock)

```tsx
// Surface principal de conteúdo
<div className="rounded-xl border border-border/70 bg-card/70 backdrop-blur-sm shadow-sm p-4 md:p-6">

// Surface de prontuário (mais elevada)
<div className="min-w-0 w-full space-y-6 rounded-2xl bg-card px-5 py-5 md:px-6 md:py-6 shadow-sm">
```

---

## 9. Componentes — Tabelas

### Estrutura canônica

```tsx
<Table>
  <TableHeader>
    <TableRow className="border-b hover:bg-transparent">
      <TableHead className="w-[44px] pl-4">  {/* Checkbox */}
        <Checkbox />
      </TableHead>
      <TableHead>Nome</TableHead>
      <TableHead className="w-[110px]">Status</TableHead>
      {/* ... */}
    </TableRow>
  </TableHeader>
  <TableBody>
    {items.map((item) => (
      <TableRow
        key={item.id}
        className={cn(
          "group hover:bg-muted/40 transition-colors",
          !item.isActive && "opacity-60 bg-muted/20",  // linha inativa
        )}
      >
        <TableCell className="w-[44px] pl-4">
          <Checkbox aria-label={`Selecionar ${item.name}`} className="cursor-pointer" />
        </TableCell>
        <TableCell className="min-w-[180px]">
          {/* Conteúdo da célula */}
        </TableCell>
        <TableCell className="w-[110px]">
          <StatusBadge status={item.isActive ? "active" : "inactive"} />
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

### Widths padrão de colunas

| Coluna             | Largura              |
|--------------------|----------------------|
| Checkbox           | `w-[44px] pl-4`      |
| Status badge       | `w-[110px]`          |
| Gênero             | `w-[110px] hidden xl:table-cell` |
| Idade              | `w-[110px] hidden xl:table-cell` |
| Última sessão      | `w-[140px] hidden lg:table-cell` |
| Contato            | `min-w-[200px]`      |
| Nome (principal)   | `min-w-[180px]`      |
| Ações              | `w-[110px] pr-3`     |

### Célula de paciente (nome + avatar + CPF)

```tsx
<div className="flex items-center gap-3">
  <UserAvatar src={profileImageUrl} name={fullName} size="md" colorSeed={id} />
  <div className="flex flex-col gap-0.5">
    <span className="font-semibold text-sm leading-tight text-nowrap">{fullName}</span>
    <span className="text-[11px] text-muted-foreground font-mono tracking-tight">
      {cpf ? formatCPF(cpf) : "—"}
    </span>
  </div>
</div>
```

### Célula de contato

```tsx
<div className="flex flex-col gap-1">
  <div className="flex items-center gap-1.5">
    <Phone className="h-3 w-3 text-muted-foreground shrink-0" aria-hidden="true" />
    <span className="text-xs font-medium tabular-nums">{formatPhone(phoneNumber) || "—"}</span>
  </div>
  <div className="flex items-center gap-1.5">
    <Mail className="h-3 w-3 text-muted-foreground shrink-0" aria-hidden="true" />
    <Tooltip>
      <TooltipTrigger>
        <span className="text-xs text-muted-foreground truncate max-w-[160px] cursor-default">{email || "—"}</span>
      </TooltipTrigger>
      {email && <TooltipContent className="text-xs">{email}</TooltipContent>}
    </Tooltip>
  </div>
</div>
```

### Estado de linha inativa

```tsx
// Linha de registro inativo
className={cn("group hover:bg-muted/40 transition-colors", !isActive && "opacity-60 bg-muted/20")}
```

---

## 10. Componentes — Botões

### Variantes shadcn disponíveis

| Variante      | Uso                                              |
|---------------|--------------------------------------------------|
| `default`     | Ação primária neutra                             |
| `destructive` | Ação destrutiva (deletar, inativar)              |
| `outline`     | Ação secundária (Cancelar, Voltar)               |
| `secondary`   | Ação terciária                                   |
| `ghost`       | Ação inline sem destaque (Limpar filtros)        |
| `link`        | Ação de navegação inline                         |

### Tamanhos

| Size      | Altura | Padding      | Uso                          |
|-----------|--------|--------------|------------------------------|
| `default` | h-10   | px-4 py-2    | Ação padrão                  |
| `sm`      | h-9    | px-3         | Barra de filtros, toolbar    |
| `xs`      | h-8    | px-2.5       | Ações compactas dentro de table |
| `lg`      | h-11   | px-8         | CTA principal da página      |
| `icon`    | h-10 w-10 | centrado  | Botões de apenas ícone       |

### Botão CTA primário (azul)

```tsx
// Padrão do projeto para "cadastrar", "salvar", "confirmar"
<Button
  className="cursor-pointer gap-2 bg-blue-600 hover:bg-blue-700 text-white"
>
  <Icon className="h-4 w-4" />
  Label
</Button>

// Versão hero (header de página)
<button className={cn(
  "flex h-9 cursor-pointer items-center gap-2 rounded-xl px-4",
  "bg-blue-600 text-[13px] font-medium text-white",
  "shadow-[0_2px_8px_rgba(37,99,235,0.25)] transition-all",
  "hover:bg-blue-700 hover:-translate-y-px active:scale-[0.98]"
)}>
  <Icon className="h-4 w-4" />
  Label
</button>
```

### Botões de navegação multi-step (modais)

```tsx
// Voltar
<Button type="button" variant="outline" onClick={handleBack} className="cursor-pointer gap-1">
  <ChevronLeft className="h-4 w-4" /> Voltar
</Button>

// Continuar
<Button type="button" onClick={handleNext} className="cursor-pointer gap-1 bg-blue-600 hover:bg-blue-700 text-white">
  Continuar <ChevronRight className="h-4 w-4" />
</Button>

// Cancelar
<Button type="button" variant="outline" onClick={onClose} className="cursor-pointer">
  Cancelar
</Button>
```

### Botão de submit (formulários multi-step)

```tsx
// IMPORTANTE: sempre type="button" + onClick={handleSubmit(onSubmit)()}
// NUNCA type="submit" dentro de form com múltiplos passos
<Button
  type="button"
  disabled={isBusy}
  onClick={() => handleSubmit(onSubmit)()}
  className="cursor-pointer gap-2 bg-blue-600 hover:bg-blue-700 text-white"
>
  {isBusy && <Loader2 className="h-4 w-4 animate-spin" />}
  {isBusy ? "Salvando…" : "Cadastrar paciente"}
  {!isBusy && <ChevronRight className="h-4 w-4" />}
</Button>
```

### Regras de botões

- Sempre `cursor-pointer` em botões interativos.
- Sempre `type="button"` em botões dentro de `<form>` que não são submit.
- Nunca `type="submit"` no botão final de form multi-step (usar onClick explícito).
- Estado loading: `Loader2` com `animate-spin` + texto "Salvando…" + `disabled`.

---

## 11. Componentes — Badges e Status

### StatusBadge (canônico para status de paciente)

```tsx
import { StatusBadge } from "@/components/ui/status-badge"

// Tamanho padrão (tabela, card)
<StatusBadge status="active" />
<StatusBadge status="inactive" />
<StatusBadge status="pending" />
<StatusBadge status="archived" />

// Tamanho maior (header de prontuário)
<StatusBadge status={patient.status} size="md" />
```

**Mapa de status:**

| Chave        | Label     | Cor    | Ícone           |
|--------------|-----------|--------|-----------------|
| `active`     | Ativo     | Verde  | `Check`         |
| `pending`    | Avaliação | Âmbar  | `Clock`         |
| `inactive`   | Inativo   | Vermelho| `X`            |
| `archived`   | Arquivado | Ciano  | `ArrowDownToLine`|

### Badge de gênero

```tsx
const GENDER_CONFIG = {
  MASCULINE: { label: "Masculino", icon: Mars,  className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-0" },
  FEMININE:  { label: "Feminino",  icon: Venus, className: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400 border-0" },
  OTHER:     { label: "Outro",     icon: Users, className: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800/50 dark:text-zinc-400 border-0" },
}

<Badge className={cn("gap-1.5 h-6 px-2.5 text-[11px] font-semibold", genderCfg.className)}>
  <genderCfg.icon className="h-3 w-3" aria-hidden="true" />
  {genderCfg.label}
</Badge>
```

### Badge de delta (tendência)

```tsx
// Positivo
<span className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
  <TrendingUp className="size-3" /> +{delta}
</span>

// Negativo
<span className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-semibold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
  <TrendingDown className="size-3" /> -{delta}
</span>
```

### Regras de badges

- **Sem `uppercase`** em badges de status (usar casing natural: `Ativo`, não `ATIVO`).
- **Sem retângulos** — sempre `rounded-full` (pílula) para status.
- **Sempre ícone + texto** — nunca apenas cor.
- Não inventar status novos sem atualizar `src/types/patient.ts` e `status-badges.md`.

---

## 12. Componentes — Formulários

### Estrutura de campos (react-hook-form + zod)

```tsx
// Campo individual padrão
<div className="space-y-1.5">
  <Label htmlFor="field" className={cn("text-xs", errors.field && "text-red-500")}>
    Label <span className="text-red-500">*</span>  {/* asterisco apenas em obrigatórios */}
  </Label>
  <Input
    id="field"
    {...register("field")}
    placeholder="..."
    className={cn(errors.field && "border-red-500 focus-visible:ring-red-500")}
  />
  {errors.field && (
    <p role="alert" className="text-[11px] text-red-500">{errors.field.message}</p>
  )}
</div>
```

### Seção de formulário (SectionLabel)

```tsx
// Separador visual de seção dentro de modal
<div className="flex items-center gap-2 mb-3">
  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[10px] font-bold text-blue-600 dark:bg-blue-900/40 dark:text-blue-400">
    {Icon ? <Icon className="h-3 w-3" /> : letter}  {/* "A", "B" ou ícone */}
  </div>
  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
    {label}
  </span>
</div>
```

### Input com ícone à esquerda

```tsx
<div className="relative">
  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
  <Input id="phone" placeholder="..." className="pl-9" />
</div>
// pl-9 = padding-left para acomodar ícone (h-3.5 w-3.5 + left-3)
```

### Regras de formulário

- Validação com `mode: "onChange"` no `useForm`.
- Mensagens de erro: `text-[11px] text-red-500` com `role="alert"`.
- Label de campo: `text-xs`.
- Campos desabilitados/futuros: `opacity-60 pointer-events-none select-none` no container.
- `onKeyDown` no form para evitar submit via Enter: `(e) => { if (e.key === "Enter" && e.target instanceof HTMLInputElement) e.preventDefault() }`.
- Nunca usar `type="submit"` em forms multi-passo.

### Modal multi-step

```tsx
// Estrutura canônica
<DialogContent className="w-full max-w-3xl max-h-[95vh] overflow-y-auto sm:rounded-2xl gap-0 p-0">
  {/* Header com step indicator */}
  <DialogHeader className="px-6 pt-6 pb-4 border-b">
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/40">
        <Icon className="h-5 w-5 text-blue-600" />
      </div>
      <div>
        <DialogTitle className="text-base font-semibold leading-tight">{title}</DialogTitle>
        <DialogDescription className="text-xs mt-0.5">{description}</DialogDescription>
      </div>
    </div>
    <StepIndicator current={step} />
  </DialogHeader>

  {/* Body */}
  <form onSubmit={(e) => e.preventDefault()} onKeyDown={preventEnterSubmit}>
    <div className="px-6 py-5 space-y-6 min-h-[320px]">
      {/* Conteúdo do step */}
    </div>

    {/* Footer */}
    <div className="flex items-center justify-between gap-4 border-t px-6 py-4">
      <div />
      <div className="flex items-center gap-2 ml-auto">
        {/* Voltar, Cancelar, Continuar/Cadastrar */}
      </div>
    </div>
  </form>
</DialogContent>
```

---

## 13. Componentes — Dialogs e Modais

### Dialog padrão (confirmação)

```tsx
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  {isOpen && <MyContent onSuccess={() => setIsOpen(false)} />}  {/* lazy mount */}
</Dialog>
```

> **Sempre** usar `{isOpen && <Component />}` para lazy mount — evita renders desnecessários.

### Overlay e Content

- Overlay: `bg-black/50`
- Content max-width: `max-w-3xl` (modais grandes), `max-w-md` (confirmação simples)
- Border radius: `sm:rounded-2xl`
- Padding zero no content quando tem header/footer próprios: `gap-0 p-0`

### Diálogo de ação destrutiva (inativar / arquivar)

```tsx
// Ícone central de confirmação
<div className={cn(
  "mb-6 flex h-20 w-20 items-center justify-center rounded-full",
  isDestructive ? "bg-destructive/10" : "bg-emerald-500/10"
)}>
  <div className={cn(
    "flex h-12 w-12 items-center justify-center rounded-full shadow-sm",
    isDestructive ? "bg-destructive/20" : "bg-emerald-500/20"
  )}>
    <Icon className={cn("h-6 w-6", isDestructive ? "text-destructive" : "text-emerald-500")} />
  </div>
</div>
```

---

## 14. Componentes — Empty States

```tsx
<div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted/50">
    <Icon className="size-5 text-muted-foreground/50" />
  </div>
  <p className="text-sm font-medium text-foreground">{title}</p>
  <p className="text-xs text-muted-foreground">{description}</p>
  {action && (
    <Button variant="outline" size="sm" onClick={action.onClick} className="mt-2">
      {action.label}
    </Button>
  )}
</div>

// Versão para dentro de tabela (célula spanning)
<div className="flex min-w-0 flex-1 flex-col items-center justify-center gap-6 rounded-lg border-dashed p-6 md:p-12 text-center">
  {/* mesmo padrão acima */}
</div>
```

---

## 15. Componentes — Chips de Filtro

### Outline pill (padrão de filtro de status)

```tsx
// Estrutura de TABS
const TABS = [
  { value: "all",      label: "Todos",    on: "bg-slate-100 text-slate-800 border-slate-200",  off: "bg-background text-muted-foreground border-border", hover: "hover:border-slate-400" },
  { value: "active",   label: "Ativos",   dot: "bg-green-600", on: "bg-green-100 text-green-800 border-green-200",   off: "bg-background text-muted-foreground border-border", hover: "hover:border-green-400" },
  { value: "inactive", label: "Inativos", dot: "bg-red-600",   on: "bg-red-100 text-red-800 border-red-200",         off: "bg-background text-muted-foreground border-border", hover: "hover:border-red-400" },
]

// Renderização
<div className="flex items-center gap-2">
  {TABS.map((tab) => {
    const selected = activeFilter === tab.value
    return (
      <button
        key={tab.value}
        type="button"
        onClick={() => setFilter(tab.value)}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border transition-all cursor-pointer",
          selected ? tab.on : cn(tab.off, tab.hover)
        )}
      >
        {tab.dot && <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", tab.dot)} />}
        {tab.label}
        <span className="tabular-nums font-medium opacity-60">{count}</span>
      </button>
    )
  })}
</div>
```

### Regras de chips de filtro

- Sempre `rounded-full` (pílula), não `rounded-md`.
- Selecionado: fundo colorido (`bg-{color}-100`), borda colorida (`border-{color}-200`).
- Não selecionado: fundo neutro, borda neutra + hover colorido.
- Contagem: sempre `opacity-60 tabular-nums` ao lado do label.
- Dot de cor: `h-1.5 w-1.5 rounded-full` com a cor do status.

---

## 16. Layout de Página

### Shell de página padrão (PatientsPageShell)

```tsx
<div className="flex flex-col gap-4">
  {/* Header */}
  <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-l-4 border-primary pl-5 py-2">
    <div className="space-y-1">
      <h1 className="text-2xl font-bold tracking-tight flex items-center gap-3">
        {icon} <span>{title}</span>
      </h1>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
    {headerRight}  {/* CTA ou controles */}
  </header>

  {/* Filtros */}
  {filters && (
    <div className="rounded-xl border border-border/70 bg-card/70 backdrop-blur-sm shadow-sm p-4 md:p-6">
      {filters}
    </div>
  )}

  {/* Conteúdo principal */}
  <div className="rounded-xl border border-border/70 bg-card/70 backdrop-blur-sm shadow-sm overflow-hidden">
    {children}
  </div>

  {/* Paginação */}
  {pagination}
</div>
```

### Destaque de header de seção

```tsx
// Borda esquerda colorida = separação visual de seções
className="border-l-4 border-primary pl-5 py-2"
```

### Sidebar

```
Expandida: 16rem (256px)
Colapsada: 3rem (48px) — ícones apenas
Mobile:    18rem (288px) — drawer
```

---

## 17. Responsividade

### Breakpoints

| Breakpoint | Largura | Uso típico                        |
|------------|---------|-----------------------------------|
| `sm`       | 640px   | Tablet, layout 2 colunas inicial  |
| `md`       | 768px   | Padding generoso, px-6            |
| `lg`       | 1024px  | Layout desktop, sidebar visível   |
| `xl`       | 1280px  | Colunas extras em tabela          |

### Padrões responsive

```tsx
// Colunas adaptativas
grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:grid-cols-4

// Flex direction
flex-col sm:flex-row

// Esconder em mobile, mostrar em desktop
hidden lg:table-cell    // coluna de tabela opcional
hidden sm:inline        // texto descritivo de botão
hidden sm:block         // label de step indicator

// Padding responsivo
p-4 md:p-6
px-4 md:px-6

// Container sidebar
lg:grid-cols-[1fr_340px]  // conteúdo + agenda fixa

// Largura de modal
w-full max-w-3xl
```

---

## 18. Acessibilidade

### Regras obrigatórias

1. **`cursor-pointer`** em todos os elementos clicáveis (não apenas `<button>`).
2. **`aria-label`** em botões que só têm ícone.
3. **`aria-hidden="true"`** em ícones decorativos dentro de texto.
4. **`role="alert"`** em mensagens de erro de formulário.
5. **`type="button"`** explícito em todos os `<button>` dentro de `<form>`.
6. **Focus visible** mantido — não remover `focus-visible:ring-*`.
7. **`disabled:cursor-not-allowed`** em elementos desabilitados.

### Focus ring padrão

```
focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
```

### Tooltip para textos truncados

```tsx
// Sempre usar Tooltip quando texto trunca
<Tooltip>
  <TooltipTrigger asChild>
    <span className="truncate max-w-[160px] cursor-default">{text}</span>
  </TooltipTrigger>
  <TooltipContent className="text-xs">{text}</TooltipContent>
</Tooltip>
```

---

## 19. Animações e Transições

### Transições padrão

```tsx
// Cores (hover states)
transition-colors

// Tudo (shadow, transform, color)
transition-all

// Color + shadow específico
transition-[color,box-shadow]
```

### Hover effects

```tsx
// Card hover
hover:shadow-md

// Botão CTA com lift
hover:-translate-y-px active:scale-[0.98]

// Botão de like/ação
hover:scale-105 active:scale-95

// Link / texto
hover:text-foreground
hover:text-primary

// Row de tabela
hover:bg-muted/40
```

### Animações de entrada/saída (Radix UI)

```
Dialog:   data-[state=open]:animate-in data-[state=closed]:animate-out fade-in-0 zoom-in-95
Dropdown: data-[state=open]:animate-in data-[state=closed]:animate-out fade-out-0 zoom-out-95
Tooltip:  animate-in fade-in-0 zoom-in-95
```

### Loading spinner

```tsx
<Loader2 className="h-4 w-4 animate-spin" />
// Sempre com texto contextual ao lado: "Salvando…", "Carregando…"
```

---

## 20. Regras Gerais (DO / DON'T)

### ✅ DO — Sempre fazer

- Usar `cn()` da `@/lib/utils` para combinar classes condicionais.
- Usar variáveis semânticas do Tailwind (`bg-card`, `text-muted-foreground`) em vez de cores fixas.
- Adicionar `dark:` variant em toda cor inline que não é semântica.
- Manter `cursor-pointer` em todos os elementos interativos.
- Usar `StatusBadge` de `@/components/ui/status-badge` para qualquer status de paciente.
- Manter `tabular-nums` em todos os números (IDs, CPF, contagens, valores).
- Usar `shrink-0` em ícones dentro de flex containers para evitar compressão.
- Lazy mount de dialogs: `{isOpen && <Component />}`.
- Tooltips em textos truncados.
- `min-w-0` em containers flex com conteúdo truncável.
- Importar ícones individualmente: `import { Check, Clock } from "lucide-react"`.

### ❌ DON'T — Nunca fazer

- ❌ `text-transform: uppercase` em badges ou labels de status.
- ❌ `type="submit"` em formulários multi-step — usar onClick explícito.
- ❌ Criar status de paciente novos sem atualizar `src/types/patient.ts`.
- ❌ Remover `focus-visible:ring-*` (quebra acessibilidade por teclado).
- ❌ Usar cores fixas sem dark mode variant (`bg-emerald-100` sem `dark:bg-emerald-900/30`).
- ❌ Badges apenas por cor sem ícone e texto.
- ❌ `sleep` ou `setTimeout` para simular estados de loading.
- ❌ `any` sem `// eslint-disable-next-line @typescript-eslint/no-explicit-any` e justificativa.
- ❌ Inline styles (`style={{ ... }}`), exceto `style={{ height }}` em skeletons dinâmicos.
- ❌ Hardcoded pixel sizes em classes Tailwind quando existe token equivalente.
- ❌ Misturar bibliotecas de ícones — apenas `lucide-react`.
- ❌ Import default de ícone: `import Check from "lucide-react/dist/esm/icons/check"` — usar named import.

---

**Versão**: 1.0 · **Data**: 09/05/2026 · **Owner**: Design System MindFlush  
**Referências**: `status-badges.md`, `src/components/ui/`, `src/global.css`
