# Mind-high — Design System

> Documento canônico de design tokens, padrões de UI e regras de UX do produto **Mind-high** (plataforma clínica para psicólogos).
> Use-o como fonte de verdade ao implementar qualquer tela nova: cores, tipografia, espaçamentos, raios, sombras, componentes e estados.

---

## 1. Princípios de design

1. **Clareza clínica acima de tudo.** Densidade alta, mas respiração suficiente para leitura prolongada. Sem decoração desnecessária.
2. **Azul é o produto, slate é o silêncio.** Cor primária aparece apenas em ações ativas, foco e seleção. Tudo o que é informação “fria” é neutro.
3. **Estado sempre visível.** Hover, focus, valid, error, selected, active e disabled têm tratamentos distintos e consistentes.
4. **Cores semânticas têm significado fixo.** Verde = ativo/saudável. Âmbar = pendência/aviso. Vermelho = erro/excluir. Roxo = identidade não-binária/outro. Azul = primário/ação.
5. **Iconografia outline-only.** Sempre `stroke=currentColor`, `fill=none`, `stroke-linecap=round`, `stroke-linejoin=round`. Família Feather/Lucide.
6. **Movimentos sutis e curtos.** 100–220ms, easing padrão `cubic-bezier(.2,.9,.3,1)`. Nada salta na tela.

---

## 2. Design Tokens

### 2.1 Cores — Paleta primária (Azul · marca)

| Token | Hex | Uso |
|---|---|---|
| `--blue-50`  | `#eff5fc` | Fundo de hover suave, fundo de avatar/ícone primário, chip ativo, linha selecionada da tabela |
| `--blue-100` | `#dbe8f7` | Borda de ícones primários, badge ativo no chip, contador em chip ativo |
| `--blue-200` | `#b7d0ef` | X de chip removível, borda hover do drop |
| `--blue-300` | `#8cb4e3` | Borda hover de cards/stat |
| `--blue-400` | `#4e8ed3` | Gradiente do avatar (início) |
| `--blue-500` | `#1e6fd9` | **`--primary`** — botões, foco, tab ativa, link |
| `--blue-600` | `#1858b0` | **`--primary-hover`** — hover do primário, gradiente avatar (fim) |
| `--blue-700` | `#144687` | Texto azul sobre `--blue-50` |
| `--blue-800` | `#0f3564` | X do chip removível (texto) |
| `--blue-900` | `#0a2444` | (reservado para overlays muito escuros) |

### 2.2 Cores — Neutros (Slate)

| Token | Hex | Uso |
|---|---|---|
| `--page-bg`   | `#efefef` | **Fundo da página (body)** — cinza neutro que eleva cards brancos sem borda ou sombra pesada |
| `--slate-50`  | `#f5f7fa` | Fundo do `<thead>`, fundo do footer de dialog, hover ghost |
| `--slate-100` | `#eceff4` | Divisores leves, fundo de `<kbd>`, badge neutro, fundo de hover de close |
| `--slate-200` | `#dde2ea` | Bordas de input, divisores de header/tabs, borda secundária de botão |
| `--slate-300` | `#c3cad5` | Borda hover de input, borda de `.btn-secondary` |
| `--slate-400` | `#98a1b0` | Placeholders, ícones “lead”, chevron de select, texto muted |
| `--slate-500` | `#6b7485` | Subtítulos, labels secundárias, hints, ícones de coluna |
| `--slate-600` | `#4a5262` | Ícones de navegação, label de filtro |
| `--slate-700` | `#333a48` | Labels de campo, texto de botão secundário |
| `--slate-800` | `#1f2532` | Body text padrão |
| `--slate-900` | `#0f1420` | Títulos, valores fortes (stat-val, pat-name) |

### 2.3 Cores semânticas (estado)

| Token | Hex | Bg token | Bg hex | Onde aparece |
|---|---|---|---|---|
| `--success` | `#118a5a` | `--success-bg` | `#e7f4ee` | Tab concluída, check de input válido, badge "Ativo" (texto/ícone), trend up, ponto online |
| `--warn`    | `#b87c00` | `--warn-bg`    | `#fbf1df` | Stat de avaliação, badge "Pendente"/"Aguardando" |
| `--danger`  | `#b3261e` | `--danger-bg`  | `#fdecea` | Erros de validação, ações destrutivas, asterisco *, trend down, badge "Inativo" |
| `--pink`    | `#c2185b` | `--pink-bg`    | `#fce4ec` | Avatar de paciente feminino (texto), badge "Feminino" |

### 2.4 Cores — Gênero (escala **purple** para "Outros")

> O projeto já tinha rosa para `f` e azul para `m`. **Esta seção formaliza a escala roxa para `o` (Outro / não-binário / prefiro não dizer)**, mantendo o mesmo nível de cuidado das outras duas.

| Token | Hex | Uso |
|---|---|---|
| `--purple-50`  | `#f5efff` | Fundo do **badge `.gender.o`** na tabela e drawer; fundo do hover da pílula "Outro" |
| `--purple-100` | `#e8d9ff` | Fundo do **contador/badge secundário** (ex: filtro "Outros (3)"); fundo do **avatar pequeno** quando paciente é "Outro" e não há cor própria |
| `--purple-300` | `#b48aff` | **Borda** da pílula "Outro" ativa; **stroke médio** em gráficos (linha/série quando o segmento representa "Outros"); ícone do avatar pequeno |
| `--purple-500` | `#7c3aed` | **Fundo principal** quando "Outro" é a seleção primária (ex: ponto destacado em gráfico, ícone de filtro ativo); gradiente do avatar grande (início) |
| `--purple-600` | `#6929c4` | Gradiente do avatar grande (fim) |
| `--purple-700` | `#581c87` | **Cor do texto** em `--purple-50`/`--purple-100`; cor do label da pílula "Outro" quando ativa |

**CSS de declaração (adicionar ao `:root`):**

```css
:root {
  /* Gender — Other (purple) */
  --purple-50:  #f5efff;
  --purple-100: #e8d9ff;
  --purple-300: #b48aff;
  --purple-500: #7c3aed;
  --purple-600: #6929c4;
  --purple-700: #581c87;
}
```

**Regras de aplicação (decisão definitiva):**

| Componente | Background | Texto | Ícone | Borda |
|---|---|---|---|---|
| Badge `.gender.o` na tabela | `--purple-50` | `--purple-700` | `--purple-700` | nenhuma |
| Pílula radio "Outro" (estado normal) | `#fff` | `--slate-600` | `--slate-500` | `--slate-200` |
| Pílula radio "Outro" (hover) | `--purple-50` | `--purple-700` | `--purple-700` | `--slate-300` |
| Pílula radio "Outro" (ativa/checked) | `--purple-50` | `--purple-700` | `--purple-700` | `--purple-300` |
| Avatar de paciente "Outro" (lista) | `linear-gradient(135deg, var(--purple-300), var(--purple-600))` | `#fff` | — | — |
| Avatar grande (drawer/dialog header) | `linear-gradient(135deg, var(--purple-500), var(--purple-600))` | `#fff` | — | — |
| Chip de filtro "Gênero: Outros" (ativo) | `--purple-50` | `--purple-700` | `--purple-700` | `--purple-300` |
| Chip de filtro — contador | `--purple-100` | `--purple-700` | — | — |
| Gráfico de barras/pizza — fatia "Outros" | `--purple-300` | (label em `--purple-700` se em cima da fatia clara, `#fff` se sobre purple-500/600) | — | — |
| Gráfico de linhas — série "Outros" | `stroke: --purple-500`, área `--purple-100` 30% alpha | — | — | — |
| Ícone genérico “pessoa sem identidade definida” | `--purple-50` (bg) / `--purple-500` (stroke) | — | `--purple-500` | `--purple-100` |

**Não fazer:**
- Não usar roxo para erro, alerta ou status global do paciente — roxo é **exclusivo de identidade de gênero/categoria "outros"**.
- Não combinar roxo e rosa no mesmo componente (evita conflito visual com o feminino).

### 2.5 Outras cores utilitárias

| Uso | Cor |
|---|---|
| **Ring de foco** | `--ring: rgba(30,111,217,0.18)` — sempre 3px |
| **Overlay de modal** | `rgba(15,52,100,.45)` com `backdrop-filter: blur(3px)` |
| **Overlay de drawer** | `rgba(15,52,100,.32)` (sem blur) |
| **Overlay de command palette** | `rgba(15,52,100,.40)` |
| **Tooltip dark** | `--slate-900` bg, `#fff` texto |
| **PDF thumbnail** | `linear-gradient(135deg, #dc2626, #991b1b)` |
| **IMG thumbnail** | `linear-gradient(135deg, #0891b2, #0e7490)` |
| **DOC thumbnail** | `linear-gradient(135deg, #2563eb, #1e40af)` |

---

## 3. Tipografia

### 3.1 Famílias

```css
--font-body:  'Inter', system-ui, sans-serif;
--font-title: 'Inter Tight', 'Inter', system-ui, sans-serif;
```

Carregar via Google Fonts: `Inter:wght@400;500;600;700` + `Inter+Tight:wght@600;700`.
`font-variant-numeric: tabular-nums` em qualquer número que possa variar (idades, valores, contadores).

### 3.2 Escala tipográfica

| Token semântico | Tamanho | Peso | Família | Cor padrão | Uso |
|---|---|---|---|---|---|
| `display`         | 22px | 700 | title | `--slate-900` | `.page-title`, hero do dashboard |
| `h1-card`         | 18px | 700 | title | `--slate-900` | `.pd-title`, título de modal |
| `h2-card`         | 15px | 700 | title | `--slate-900` | `.card-title` |
| `h3`              | 14px | 700 | title | `--slate-900` | seções dentro de card |
| `stat-val`        | 22px | 700 | title | `--slate-900` | números grandes em stat strip |
| `body`            | 14px | 400 | body  | `--slate-800` | corpo padrão |
| `body-strong`     | 13.5px | 500/600 | body | `--slate-700`/`--slate-900` | inputs, células de tabela |
| `body-sm`         | 13px | 500 | body | `--slate-700` | botão, chip, sidebar |
| `meta`            | 12.5px | 500 | body | `--slate-500` | sub-texto de footer |
| `label`           | 12px | 600 | body | `--slate-700` | `.field-lbl` |
| `caption`         | 11.5px | 500 | body | `--slate-500` | `.field-hint`, meta de avatar, `.pat-meta` |
| `eyebrow`         | 11px UPPER `letter-spacing:.06em` | 700 | body | `--slate-500` | `.pd-section-title`, `<thead th>`, info-grid label |
| `tiny`            | 10.5px | 500/600 | body | `--slate-400` | helper inline, atalhos `<kbd>` |

**Regras:**
- `h1,h2,h3` HTML semânticos usam `letter-spacing: -.015em`.
- Títulos de modal usam `letter-spacing: -.01em`.
- `stat-val` usa `letter-spacing: -.02em`.
- Body padrão `line-height: 1.5`. Títulos `1.25`. Labels `1.4` (badges).

---

## 4. Espaçamento

Escala de 4px (`4, 8, 12, 16, 20, 24, 32, 40, 48`). Use múltiplos exatos. Nunca improvise.

| Token | Valor | Onde |
|---|---|---|
| `space-1` | 4px  | gap entre ícone e label inline, sep de toolbar |
| `space-2` | 6px  | gap interno de pílulas, botões pequenos |
| `space-3` | 8px  | gap padrão entre items horizontais (chips, botões) |
| `space-4` | 10px | gap em cards densos, padding interno de menu item |
| `space-5` | 12px | gap em grids de campo (linhas) |
| `space-6` | 14px | gap padrão de header de modal, padding interno de card |
| `space-7` | 16px | margin-bottom entre blocos médios |
| `space-8` | 18px | padding interno de filters, drawer-head |
| `space-9` | 20px | padding do body de modal |
| `space-10`| 22px | padding lateral do modal, drawer |
| `space-12`| 24px | padding horizontal da página |
| `space-16`| 32px | padding inferior da página |

**Grids canônicos:**
- 2 colunas: `grid-template-columns: 1fr 1fr; gap: 12px 14px;`
- 3 colunas: `grid-template-columns: 1.3fr 1fr 1fr;`
- 4 colunas (stats): `grid-template-columns: repeat(4,1fr); gap: 12px;`
- Stats > 4 itens → quebra em 2x4 mantendo 12px.

---

## 5. Raios, sombras, bordas

### 5.1 Raios

```css
--radius-sm: 4px;   /* checkbox, kbd, ações de linha, menu item, doc-thumb */
--radius:    6px;   /* inputs, botões, chips, dropdowns */
--radius-lg: 12px;  /* cards, stats, page-icon, upload-zone */
12px                /* modal, drawer (não tokenizado, usar literal) */
50%                 /* avatares, dots, badges-icon */
999px               /* pills (badge, gender, .pill-choice) */
```

### 5.2 Sombras

```css
--shadow-sm: 0 1px 2px rgba(15,52,100,.04);
--shadow:    0 1px 3px rgba(15,52,100,.06), 0 1px 2px rgba(15,52,100,.04);
--shadow-md: 0 4px 12px rgba(15,52,100,.08);
--shadow-lg: 0 12px 32px rgba(15,52,100,.12);
```

| Sombra | Uso |
|---|---|
| `shadow-sm` | Hover de stat, row-act, doc-thumb, avatar pequeno |
| `shadow`    | Cards estáticos importantes |
| `shadow-md` | Botão primário em hover (com cor: `0 4px 10px rgba(30,111,217,.18)`) |
| `shadow-lg` | Modais, drawers, dropdowns, command palette |

### 5.3 Bordas

- Borda padrão: `1px solid var(--slate-200)`.
- Borda de pílula radio: `1.5px solid var(--slate-200)` (espessura especial para destaque do checked).
- Borda de upload-zone: `2px dashed var(--slate-200)`.
- Borda de check: `1.5px solid var(--slate-300)` (input checkbox).

### 5.4 Z-index

```
modal/dialog:        70
command palette:     60
drawer:              50
drawer overlay:      40
topbar (sticky):     20
row-menu open:       10
row-act tooltip:      5
thead sticky:         1
```

---

## 6. Animações & transições

| Propriedade | Duração | Easing | Onde |
|---|---|---|---|
| `all` (default) | **120ms** | linear | Inputs, botões, chips, links de sidebar |
| Filter row, upload-zone | 150ms | linear | hover/drag de drop |
| Stat hover (transform) | 150ms | linear | `translateY(-1px)` |
| Stat shimmer (skeleton) | 1.4s | linear infinite | `@keyframes shimmer` |
| Pane troca (modal) | **180ms** | ease | `@keyframes pdIn` |
| Modal/dialog abertura | **220ms** | `cubic-bezier(.2,.9,.3,1)` | `@keyframes pdIn` |
| Barra de progresso (`pd-progress-fill`) | 240ms | ease | width |
| Drawer slide | **280ms** | `cubic-bezier(.2,.9,.3,1)` | translateX |

**Keyframe padrão de entrada:**
```css
@keyframes pdIn {
  from { opacity: 0; transform: translateY(8px) scale(.98); }
  to   { opacity: 1; transform: translateY(0)   scale(1);   }
}
```

Nunca animar `box-shadow` em listas; preferir `border-color` + `transform` para perf.

---

## 7. Layout global

```
.app  (display: grid; grid-template-columns: 248px 1fr; min-height: 100vh)
  ├ .sidebar    (248px fixa; fundo branco; borda direita slate-200; padding 16px 12px 12px)
  └ .main       (flex column; min-width 0)
       ├ .topbar    (sticky; top:0; z:20; padding 10px 24px; altura ~52px)
       └ .page      (padding 20px 24px 32px; max-width 1500px; centralizada)
            ├ .page-head   (título + ações)
            ├ .stats       (strip de 4 KPIs, mb 18px)
            └ .card        (componente principal da página)
```

**Sidebar:**
- Item: padding 8px 10px, gap 10px, font 13.5/500, slate-600.
- Ativo: bg `--blue-50`, texto `--blue-700`, font-weight 600, **rail vertical 3px** na esquerda em `--primary`.
- Hover: bg `--slate-50`, texto `--slate-800`.

**Topbar:**
- Inclui breadcrumbs, search global (atalho `/`), e ícones de ação (notification dot, settings).
- Search: input 8/12/8/34 padding, bg `--slate-50` → `#fff` ao focar.

---

## 8. Iconografia

- **Família:** Feather/Lucide.
- **Atributos fixos:** `viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"`.
- **Stroke-width:** `2` (padrão), `2.2` (md-btn), `2.5` (chevrons, X, check), `3.2` (mini-check dentro de badge).
- **Tamanhos canônicos:**

| Contexto | Tamanho |
|---|---|
| Botão padrão | 16×16 |
| Botão pequeno (bulk-btn, row-act, md-btn) | 13×13 |
| Icon-btn da topbar | 18×18 |
| `.pd-section-title` | 13×13 |
| `.page-icon`, `.pd-head-ico` | 20×20 (em container 40×40 ou 42×42) |
| `.stat-ico` | 18×18 |
| `.field-input-wrap > svg.lead` | 15×15 |
| Avatar pequeno (`.pat-avatar`) — quando ícone | 14×14 |
| `.badge .ico svg` | 9×9 |
| Gênero (`.gender svg`) | 11×11 |

- **Cor:** sempre `color:` (ou `currentColor`). Nunca `fill`.

---

## 9. Estados (universal)

### 9.1 Inputs

| Estado | Visual |
|---|---|
| Normal | border `--slate-200`, bg `#fff` |
| Hover | border `--slate-300` |
| Focus | border `--primary`, `box-shadow: 0 0 0 3px var(--ring)`, outline none |
| Valid | border `--success`, ícone check verde 14×14 right:10px |
| Error | border `--danger`, shadow `0 0 0 3px rgba(179,38,30,.12)`, label-error vermelho com circle-info |
| Disabled | opacity .5, cursor not-allowed |
| Read-only | bg `--slate-50`, border slate-200, texto slate-700 |

### 9.2 Botões

| Variante | Normal | Hover |
|---|---|---|
| `.btn-primary` | bg `--primary`, texto `#fff` | bg `--primary-hover`, shadow azul |
| `.btn-secondary` | bg `#fff`, texto `--slate-700`, border `--slate-300` | bg `--slate-50` |
| `.btn-ghost` | texto `--slate-600` sem fundo | bg `--slate-100`, texto `--slate-800` |
| Botão de ação destrutiva (bulk) | texto `--danger`, border `--danger-bg` | bg `--danger-bg` |

Padding padrão: `8px 14px`. Radius `var(--radius)`. Font 13/600. Gap 6px entre ícone e label.

### 9.3 Chips de filtro

- Normal: bg `#fff`, border `--slate-200`, texto `--slate-700`.
- Hover: border `--slate-300`, bg `--slate-50`.
- Ativo: border `--primary`, bg `--blue-50`, texto `--blue-700`, font-weight 600.
- Contador `.count`: bg `--slate-100` / texto `--slate-600` (neutro), bg `--blue-100` / texto `--blue-700` (ativo).
- X de remover (`.x`): círculo 14×14 `--blue-200`, texto `--blue-800`.

### 9.4 Linhas de tabela

- Hover: bg `--blue-50`.
- Selected: bg `--blue-50` + `inset 3px 0 0 var(--primary)` na primeira célula (rail esquerda).
- Border-bottom: `1px solid var(--slate-100)`.

### 9.5 Tabs/Stepper

- Numerinho 18×18 round; bg slate-100/cor slate-500 (neutro); primary/branco (ativo); success/branco (concluído).
- Borda inferior da aba ativa: 2px solid `--primary`.
- Aba com asterisco vermelho (`.req`) = obrigatória.

---

## 10. Componentes

### 10.1 Badge (status)

```
.badge        — pill, 12/600, padding 3px 10px 3px 6px, radius 999px, gap 5px
.badge .ico   — círculo 14×14 com check/clock/× em branco, stroke-width 3.2
```

| Tipo | bg | texto | ico bg |
|---|---|---|---|
| Active | `#dcfce7` | `#166534` | `#16a34a` |
| Pending | `#fef3c7` | `#92400e` | `#d97706` |
| Inactive | `#fee2e2` | `#991b1b` | `#dc2626` |
| Archived | `#cffafe` | `#155e75` | `#0891b2` |
| Danger   | `#fee2e2` | `#991b1b` | `#dc2626` |

**Regra:** sempre acompanhar badge com o `ico`. Texto sozinho não é badge — é texto.

### 10.2 Gender chip

```
.gender { font:11.5/600; padding:3px 9px; radius:999px; gap:5px; svg:11×11 }
.gender.f { bg:#fde7ef; color:#b3325b }                  /* Feminino — pink */
.gender.m { bg:var(--blue-50); color:var(--blue-700) }   /* Masculino — blue */
.gender.o { bg:var(--purple-50); color:var(--purple-700) }  /* Outro — purple */
```

**Atualização obrigatória:** trocar a regra atual de `.gender.o` (que usava slate-100/slate-600) para a roxa acima.

### 10.3 Avatar

```
.pat-avatar — 34×34, round, font-title 12.5/600, branco
              background: linear-gradient(135deg, …, …)
```

Gradientes por categoria:
- Feminino: `linear-gradient(135deg, #e7669a, #b3325b)`
- Masculino: `linear-gradient(135deg, #4e8ed3, #1858b0)`
- Outro: `linear-gradient(135deg, var(--purple-300), var(--purple-600))`
- Paciente inativo: `linear-gradient(135deg, #98a1b0, #4a5262)`

Variantes de tamanho:
- 28×28 (tabela densa de Documentos): font 11
- 34×34 (lista de Pacientes): font 12.5
- 48×48 (drawer head): font 15
- 60×60 (avatar uploader): font 20, com borda 2px branca + shadow-sm

Indicador online: dot 9×9 `--success` com borda 2px `#fff`, position absolute right:0 bottom:0.

### 10.4 Card

```
.card       — bg #fff, border none, radius 12px (--radius-lg), overflow hidden
              Elevação feita por contraste de cor com --page-bg (#efefef), não por borda ou sombra.
              Usar --shadow-sm apenas quando o card flutua sobre outro card (ex: dropdown, popover interno).
.card-head  — padding 14/18/12, border-bottom slate-100, flex gap 12
.card-title — 15/700/title/slate-900
.card-sub   — 12.5/slate-500/margin-top 1px
```

**Gap entre cards:** 8–12px. Preferir 8px em layouts densos, 12px em layouts respirados. Nunca usar divisores visuais entre cards — o gap e o contraste de fundo são suficientes.

#### 10.4.1 Divisores internos de card

Separam seções distintas dentro do mesmo card (ex: header → body, bloco de valor → bloco de resumo).

| Propriedade | Valor |
|---|---|
| Cor | `--slate-100` (`#eceff4`) — cinza quase invisível |
| Espessura | `1px solid` |
| Largura | `100%` — toca as bordas laterais do card sem padding extra |
| Margem vertical | 0 — o próprio padding das seções cria a respiração |

**Variantes:**

| Uso | Classe Tailwind | Equivalente CSS |
|---|---|---|
| Divisor principal (header/body) | `border-b border-border/50` | `border-bottom: 1px solid oklch(0.90 0.002 247.84 / 0.5)` |
| Divisor sutil (entre valores no mesmo bloco) | `border-b border-border/30` | mesmo token com 30% opacidade |

**Regras:**
- Nunca adicionar `padding-left` ou `padding-right` no divisor — ele deve ir de borda a borda do card.
- Nunca usar `--border` em opacidade total (100%) para divisores internos — fica pesado demais.
- Em dark mode, `border-border/50` já se adapta automaticamente via o token `--border` remapeado.

### 10.5 Stat (KPI strip)

```
.stat — 4 colunas, gap 12px, padding 14/16, radius 10px, cursor pointer
        flex; gap 12px; align-items center
.stat-ico — 36×36, radius 8px, bg blue-50/cor primary (padrão)
            .green → success-bg/success
            .warn  → warn-bg/warn
            .muted → slate-100/slate-600
            (novo) .purple → purple-50/purple-500 — opcional para “Outros” enquanto KPI
.stat-val — 22/700/title/slate-900 letter-spacing -.02em
.stat-lbl — 12/500/slate-500 margin-top 3px
.stat-trend.up → success
.stat-trend.dn → danger
```

Hover: border `--blue-300`, shadow-sm, translateY(-1px).
Active (filtro aplicado): border `--primary`, ring 3px.

### 10.6 Tabela

- `<thead th>`: bg `--slate-50`, 11/600 UPPER `letter-spacing:.06em`, padding 10/14, slate-500.
- `<tbody td>`: padding 11/14, slate-700, vertical-align middle.
- Sortable: cursor pointer, seta `↕` slate-300 → `--primary` quando ordenado.
- Linha checkbox: `appearance:none`, 16×16, border 1.5 slate-300, bg #fff. Checked = primary com check branco rotacionado 45°.

### 10.7 Drawer (detalhes do paciente)

- Largura `min(440px, 90vw)`. Slide-in direita.
- Overlay `rgba(15,52,100,.32)`, transition 200ms.
- `.drawer-head`: padding 18/22, avatar 48×48 + nome + close.
- `.info-grid`: 2 cols, gap 14×18, label eyebrow + val 13.5/500.
- `.drawer-section`: margin-top 18, padding-top 18, border-top slate-100.
- `.drawer-foot`: padding 14/22, bg slate-50, border-top slate-200, botões inline.

### 10.8 Modal dialog (.pd)

- 720px max, 92vh max-height, radius 12px, animation pdIn 220ms.
- Header: ícone 40×40 (blue-50/primary, border blue-100, radius 10px) + título 18/700 + sub 13/slate-500 + close 32×32.
- Tabs: 4 abas (Stepper) com numerinho 18×18, asterisco em obrigatórias, progress bar 2px na borda inferior.
- Body: padding 20/22, scroll vertical.
- Footer: padding 14/22, bg slate-50, [Voltar] [Cancelar] [Primário].

### 10.9 Command Palette

- Atalho: `Ctrl/⌘ + K`.
- Largura `min(560px, 92vw)`, top 14vh, radius 10px.
- Input 15/normal/slate-900, sem borda, padding 14/18.
- Item: padding 8/12, radius var(--radius), 13.5/slate-700.
- Item ativo: bg `--blue-50`, texto `--blue-700`.
- KBD à direita: 10.5/slate-400/mono.

### 10.10 Toast

- Pílula flutuante bottom-center.
- Bg `--slate-900`, texto `#fff`, font 13/500.
- Radius `--radius`. Padding 10/16. Box-shadow `--shadow-lg`.
- Animação: opacity + translateY(8px) 200ms. Auto-dismiss em 2.4s.
- Variantes opcionais: prefixar com ícone (✓ verde para success, ✕ vermelho para erro).

### 10.11 Markdown editor

- Container border slate-200, radius 8px; focus-within → border primary + ring.
- Toolbar bg slate-50, border-bottom slate-200; tabs "Escrever"/"Visualizar"; 8 botões em 3 grupos.
- Textarea ui-monospace 13/line-height 1.6.
- Preview com hierarquia h1/h2/h3 em font-title; blockquote com borda primary 3px + bg blue-50.

### 10.12 Upload zone (dropzone)

- `2px dashed slate-200`, radius 10px, padding 22px, bg slate-50, text-align center.
- Hover/drag → border primary + bg blue-50.
- Ícone redondo 42×42 bg #fff cor primary borda blue-100.
- Lista de arquivos abaixo, cada item bg #fff border slate-200 radius 6 padding 7/10.

### 10.13 Pill choice (radio segmentado)

```
.pill-choice         — flex; gap:6px; flex-wrap:wrap
.pill-choice input   — display:none
.pill-choice label   — padding 7/12, border 1.5px slate-200, radius 6,
                       12.5/600/slate-600, bg #fff, gap 6, svg 13×13
:hover               — border slate-300, bg slate-50
:checked + label     — border primary, bg blue-50, color blue-700
```

**Variação roxa (Outro):**
- Para `input[value="o"]:checked + label` aplicar: `border: 1.5px solid var(--purple-300); background: var(--purple-50); color: var(--purple-700)`.

---

## 11. Gráficos & visualizações

> Quando o produto exibir gráficos (distribuição de gênero, tendências de sessão, status), seguir estas regras.

### 11.1 Paleta canônica de séries

| Categoria | Cor principal | Cor de fundo (área 30% alpha) |
|---|---|---|
| Geral / Total | `--primary` (#1e6fd9) | rgba(30,111,217,.15) |
| Feminino     | `#e7669a` | `#fde7ef` |
| Masculino    | `--blue-400` (#4e8ed3) | `--blue-50` |
| **Outro**    | `--purple-300` (#b48aff) | `--purple-50` (#f5efff) |
| Ativo        | `--success` | `--success-bg` |
| Pendente     | `--warn` | `--warn-bg` |
| Inativo      | `--danger` | `--danger-bg` |

### 11.2 Regras

- Eixos: cor `--slate-400`, font 11/500, gridlines `--slate-100`.
- Tooltip: bg `--slate-900`, texto `#fff`, padding 8/10, radius 6, 12/500, shadow-md.
- Legendas: 12/500/slate-600, dot 10×10 round.
- Mínimo de 3 categorias = usar paleta canônica. Mais que 6 = agrupar em "Outros (X)" com cor purple-300.
- Stroke padrão linhas: 2px. Stroke ativo/hover: 3px.
- Pizzas/donuts: gap 2px entre fatias com `stroke: #fff stroke-width: 2`.

### 11.3 Badge de contagem em gráfico (legend)

- Wrapper: pílula 999, padding 2/10/2/6, gap 5.
- Dot 8×8 round na cor da série.
- Texto 12/600 cor da série em escala 700 (ex: `--purple-700` para Outros).

---

## 12. Acessibilidade

- Contraste mínimo AA. Slate-500 sobre slate-50 = 4.7:1 ✓.
- `:focus-visible` sempre tem ring 3px var(--ring).
- Modais com `role="dialog" aria-modal="true" aria-labelledby="…"`.
- Inputs com label associado (`<label for>` ou wrapping).
- Botões com aria-label quando icon-only.
- Hit target mínimo 36×36 em desktop, 44×44 em touch.
- Não usar cor como único portador de informação — sempre acompanhar com texto/ícone (ex: badges com ícone, gráficos com legendas, gender com palavra completa).

---

## 13. Densidade / breakpoints

- Container max-width: 1500px.
- Sidebar: 248px fixa em ≥1024px; vira drawer em <1024px (overlay slide-in).
- Stat strip: 4 cols ≥1200px; 2x2 em <1200px; 1x4 em <600px.
- Grid de campos 3 colunas vira 1 coluna em <640px.
- Modal: width `min(720px, 100%)`; padding interno 20/22 desktop, 16/18 mobile.

---

## 14. Linguagem & copywriting

- **Tom:** profissional, conciso, em português brasileiro.
- **Verbos no infinitivo** em ações: "Cadastrar paciente", "Exportar tudo", "Baixar (.zip)".
- **Mensagens de sucesso curtas:** "Paciente cadastrado!", "Documento removido".
- **Erros são acionáveis:** "Nome é obrigatório" > "Campo vazio". Sempre dizer o que fazer.
- **Helpers em cinza** (`--slate-400`/`--slate-500`) com `letter-spacing: 0` e `text-transform: none` (mesmo quando dentro de section-title uppercase).
- **Placeholders mostram exemplo, não instrução:** "Ex: Ana Luísa" > "Digite o nome".

---

## 15. Checklist para nova tela

1. [ ] Usa `--primary` apenas em ações ativas (botão, foco, tab ativa, link).
2. [ ] Cor semântica respeita: verde=ativo, âmbar=pendente, vermelho=erro, roxo=outros.
3. [ ] Tipografia consegue ser mapeada a um token da seção 3.2.
4. [ ] Espaçamentos são múltiplos de 4.
5. [ ] Inputs têm os 6 estados (normal/hover/focus/valid/error/disabled).
6. [ ] Botões têm hover claramente distinto.
7. [ ] Ícones outline-only, currentColor, com tamanho da seção 8.
8. [ ] Hover em listas usa `--blue-50`. Selected adiciona rail 3px primary.
9. [ ] Modais usam `pdIn 220ms`. Drawers 280ms cubic-bezier.
10. [ ] Todo número exibido tem `tabular-nums`.
11. [ ] Estados ARIA presentes em diálogos, botões icon-only, e tabs.
12. [ ] Mensagens em pt-BR, verbos no infinitivo.
13. [ ] Não inventou nova cor — usou apenas tokens da seção 2.
14. [ ] Cards: `bg-white` sem borda, `border-radius: 12px`, sobre `--page-bg` (`#efefef`). Sombra pesada é proibida — contraste de fundo faz o trabalho.

---

## 16. Snippet base para nova página

```html
<!doctype html><html lang="pt-BR"><head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Mind-high — {Tela}</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Inter+Tight:wght@600;700&display=swap" rel="stylesheet" />
<style>
  :root {
    /* Blue */
    --blue-50:#eff5fc; --blue-100:#dbe8f7; --blue-200:#b7d0ef; --blue-300:#8cb4e3;
    --blue-400:#4e8ed3; --blue-500:#1e6fd9; --blue-600:#1858b0; --blue-700:#144687;
    --blue-800:#0f3564; --blue-900:#0a2444;
    /* Slate */
    --slate-50:#f5f7fa; --slate-100:#eceff4; --slate-200:#dde2ea; --slate-300:#c3cad5;
    --slate-400:#98a1b0; --slate-500:#6b7485; --slate-600:#4a5262; --slate-700:#333a48;
    --slate-800:#1f2532; --slate-900:#0f1420;
    /* Semantics */
    --success:#118a5a; --success-bg:#e7f4ee;
    --warn:#b87c00;    --warn-bg:#fbf1df;
    --danger:#b3261e;  --danger-bg:#fdecea;
    --pink:#c2185b;    --pink-bg:#fce4ec;
    /* Purple — Other gender */
    --purple-50:#f5efff; --purple-100:#e8d9ff; --purple-300:#b48aff;
    --purple-500:#7c3aed; --purple-600:#6929c4; --purple-700:#581c87;
    /* Primary */
    --primary:var(--blue-500); --primary-hover:var(--blue-600);
    --ring:rgba(30,111,217,0.18);
    /* Page background */
    --page-bg:#efefef;
    /* Radii */
    --radius:6px; --radius-sm:4px; --radius-lg:12px;
    /* Fonts */
    --font-body:'Inter',system-ui,sans-serif;
    --font-title:'Inter Tight','Inter',system-ui,sans-serif;
    /* Shadows */
    --shadow-sm:0 1px 2px rgba(15,52,100,.04);
    --shadow:0 1px 3px rgba(15,52,100,.06),0 1px 2px rgba(15,52,100,.04);
    --shadow-md:0 4px 12px rgba(15,52,100,.08);
    --shadow-lg:0 12px 32px rgba(15,52,100,.12);
  }
  *{box-sizing:border-box} html,body{margin:0;padding:0}
  body{font-family:var(--font-body);background:var(--page-bg);color:var(--slate-800);font-size:14px;line-height:1.5;-webkit-font-smoothing:antialiased}
  button{font-family:inherit;cursor:pointer;border:0;background:none;color:inherit}
  input,select{font-family:inherit;font-size:14px}
  h1,h2,h3{font-family:var(--font-title);margin:0;letter-spacing:-.015em;color:var(--slate-900)}
  a{color:var(--primary);text-decoration:none}
</style>
</head>
<body>
  <!-- conteúdo aqui -->
</body></html>
```

---

## 17. Dark Theme

> O tema escuro é uma **inversão semântica**, não uma simples troca de cores. Os tokens primários (`--primary`, `--success`, `--danger`, `--warn`, `--purple-*`) **mantêm sua identidade**, mas o que era "fundo claro/texto escuro" vira "fundo escuro/texto claro". O brand azul fica ligeiramente **mais saturado** para sobreviver no escuro.

### 17.1 Princípios

1. **Nunca preto puro.** Use slate-900 (`#0b1220`) como background base. Preto puro causa fadiga em telas OLED clínicas e mata sombras.
2. **Hierarquia por elevação, não só por cor.** No claro, hierarquia é por borda/sombra. No escuro, hierarquia é por **brilho relativo do background** (background → surface → surface-elevated).
3. **Texto nunca branco puro.** `#fff` puro causa "halação". Use `#e7ecf3` como texto principal.
4. **Cores semânticas ficam vivas mas dessaturadas em 10–15%** quando aparecem como fundo de badge, para não vibrarem.
5. **Sombra trabalha em conjunto com borda clara.** No escuro, `box-shadow` quase não rende — combine com `border: 1px solid <surface mais claro>`.

### 17.2 Ativação

O tema é controlado por um atributo `data-theme="dark"` no `<html>` (ou `<body>`). Toggle padrão: ícone sol/lua na topbar; persistido em `localStorage.theme`.

```js
const setTheme = (t) => {
  document.documentElement.dataset.theme = t;
  localStorage.setItem('theme', t);
};
// init
setTheme(localStorage.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
```

### 17.3 Tokens em modo escuro

Sobrescrever apenas o necessário dentro de `[data-theme="dark"]`:

```css
[data-theme="dark"] {
  /* ===== Surfaces (semantic, não slate-X invertidos) ===== */
  --page-bg:         #0b1220;   /* fundo da página (body) — mesmo que --bg no dark */
  --bg:              #0b1220;   /* alias de compatibilidade */
  --surface:         #121a2b;   /* card, modal, drawer, sidebar */
  --surface-elevated:#1a2440;   /* dropdown, popover, tooltip dark já era preto */
  --surface-sunken:  #08101c;   /* thead da tabela, footers, áreas “rebaixadas” */
  --surface-hover:   #1c2742;   /* hover de linha de tabela, hover de item de menu */

  /* ===== Slates invertidos (semântica: claro/escuro de texto) ===== */
  --slate-50:  #0b1220;  /* (antigo bg page → vira o bg page) */
  --slate-100: #121a2b;  /* divisores/badges leves */
  --slate-200: #1f2a44;  /* bordas de input, divisores */
  --slate-300: #2a3759;  /* bordas hover/secondary */
  --slate-400: #6e7894;  /* placeholders, ícones lead, chevrons */
  --slate-500: #98a1b8;  /* subtítulos, hints, labels secundárias */
  --slate-600: #b3bccf;  /* ícones de nav */
  --slate-700: #cfd6e4;  /* labels de campo */
  --slate-800: #e0e5ee;  /* body text */
  --slate-900: #e7ecf3;  /* títulos, valores fortes */

  /* ===== Blue (brand) — leve aumento de saturação ===== */
  --blue-50:   #16243f;  /* fundo de chip ativo, badge primário, linha selecionada */
  --blue-100:  #1d3057;  /* contador em chip ativo, borda de ícone primary */
  --blue-200:  #2a4577;
  --blue-300:  #3d63a0;
  --blue-400:  #5b86c4;  /* gradiente avatar (início) */
  --blue-500:  #4a90f0;  /* PRIMARY (mais brilhante para destacar no escuro) */
  --blue-600:  #2e76d6;  /* PRIMARY hover */
  --blue-700:  #a8c5f4;  /* TEXTO azul sobre --blue-50 escuro */
  --blue-800:  #c5d8f7;
  --blue-900:  #e0eaf9;

  /* ===== Semantic states (bg suave + texto claro) ===== */
  --success:    #4ade80;   /* texto/ícone em superfícies escuras */
  --success-bg: #0f2a1d;   /* fundo de badge "Ativo" */
  --warn:       #fbbf24;
  --warn-bg:    #2a1f08;
  --danger:     #f87171;
  --danger-bg:  #2a0f0e;
  --pink:       #f48fb1;
  --pink-bg:    #2a1119;

  /* ===== Purple (Outros) — Mais brilhante no escuro ===== */
  --purple-50:  #1d1430;   /* fundo de badge .gender.o */
  --purple-100: #2a1f4a;   /* fundo de contador, avatar pequeno */
  --purple-300: #c4a2ff;   /* TEXTO/stroke em superfícies escuras */
  --purple-500: #a78bfa;   /* fatia de gráfico, foco primário */
  --purple-600: #8b6ef5;   /* gradiente fim */
  --purple-700: #d9c5ff;   /* TEXTO sobre --purple-50/100 */

  /* ===== Primary + ring ===== */
  --primary:       var(--blue-500);
  --primary-hover: var(--blue-600);
  --ring:          rgba(74,144,240,0.30);   /* mais opaco para sobreviver no escuro */

  /* ===== Shadows — quase nulas, dependem de borda ===== */
  --shadow-sm: 0 1px 2px rgba(0,0,0,.30);
  --shadow:    0 1px 3px rgba(0,0,0,.40), 0 1px 2px rgba(0,0,0,.30);
  --shadow-md: 0 4px 12px rgba(0,0,0,.45);
  --shadow-lg: 0 12px 32px rgba(0,0,0,.55);

  /* ===== Overlays ===== */
  --overlay-modal:   rgba(0,0,0,.62);
  --overlay-drawer:  rgba(0,0,0,.50);
  --overlay-palette: rgba(0,0,0,.55);
}
```

### 17.4 Mapeamento direto (claro → escuro)

| Elemento | Light | Dark |
|---|---|---|
| Body background | `--page-bg` (#efefef) | `--page-bg` / `--bg` (#0b1220) |
| Card / modal / drawer | `#fff` | `--surface` (#121a2b) |
| Sidebar | `#fff` | `--surface` |
| Topbar | `#fff` | `--surface` |
| Thead da tabela | `--slate-50` | `--surface-sunken` (#08101c) |
| Footer de modal / table-foot | `--slate-50` | `--surface-sunken` |
| Input background (padrão) | `#fff` | `--surface-elevated` (#1a2440) |
| Input background (search/filtro) | `--slate-50` | `--surface-sunken` |
| Input border | `--slate-200` | `--slate-200` (já remapeado p/ #1f2a44) |
| Tooltip background | `--slate-900` (escuro) | `--slate-900` (claro!) — **inverte** com texto `--bg` |
| Hover de linha | `--blue-50` (#eff5fc) | `--blue-50` (#16243f) |
| Linha selecionada | mesma do hover | mesma do hover |
| Rail vertical de seleção | `--primary` | `--primary` (mais brilhante) |
| Texto sobre `--blue-50` | `--blue-700` (#144687) | `--blue-700` (#a8c5f4) |

### 17.5 Componentes — ajustes específicos no dark

#### Badges de status
Bg fica **muito escuro saturado**, texto **bem claro** da mesma família, ícone redondo mantém a cor viva.

| Badge | bg | texto | ícone bg |
|---|---|---|---|
| Active | `--success-bg` `#0f2a1d` | `#86efac` | `--success` `#4ade80` |
| Pending | `--warn-bg` `#2a1f08` | `#fcd34d` | `--warn` `#fbbf24` |
| Inactive | `--danger-bg` `#2a0f0e` | `#fca5a5` | `--danger` `#f87171` |
| Archived | `#082e34` | `#67e8f9` | `#22d3ee` |

#### Gender chips

```css
[data-theme="dark"] .gender.f { background:#2a1119; color:#f48fb1 }
[data-theme="dark"] .gender.m { background:var(--blue-50); color:var(--blue-700) }
[data-theme="dark"] .gender.o { background:var(--purple-50); color:var(--purple-700) }
```

#### Avatares
Os gradientes **não mudam** — eles foram pensados para funcionar em ambos os temas. Apenas a borda branca em volta do avatar grande do uploader passa a ser `--surface` (#121a2b) para fundir com o card.

#### Botões

```css
[data-theme="dark"] .btn-primary       { background:var(--primary); color:#0b1220 }       /* texto escuro sobre azul claro */
[data-theme="dark"] .btn-primary:hover { background:#5fa3ff; box-shadow:0 4px 10px rgba(74,144,240,.28) }
[data-theme="dark"] .btn-secondary     { background:var(--surface-elevated); color:var(--slate-700); border-color:var(--slate-300) }
[data-theme="dark"] .btn-secondary:hover { background:var(--surface-hover) }
[data-theme="dark"] .btn-ghost:hover   { background:var(--surface-elevated); color:var(--slate-800) }
```

**Decisão importante:** no `.btn-primary` o texto fica **escuro** (`#0b1220`) sobre o azul mais claro `#4a90f0`. Isso garante AA (~9.8:1) e é mais legível que branco puro.

#### Chips de filtro

```css
[data-theme="dark"] .chip-filter        { background:var(--surface-elevated); border-color:var(--slate-200); color:var(--slate-700) }
[data-theme="dark"] .chip-filter:hover  { background:var(--surface-hover); border-color:var(--slate-300) }
[data-theme="dark"] .chip-filter.active { background:var(--blue-50); border-color:var(--primary); color:var(--blue-700) }
```

#### Sidebar

- Item ativo: bg `--blue-50` (já é o escuro `#16243f`), texto `--blue-700` (claro `#a8c5f4`), rail `--primary`.
- Hover: bg `--surface-hover`.
- Borda da brand-section e user: `--slate-200`.

#### Modal/Drawer

- `.pd`: bg `--surface`, sem mudança de radius.
- Overlay: `--overlay-modal` (`rgba(0,0,0,.62)`) com `backdrop-filter: blur(4px)` (1px a mais que no claro).
- `.pd-head` e `.pd-foot`: borda `--slate-200`; `.pd-foot` background `--surface-sunken`.
- `.pd-head-ico`: bg `--blue-50` (#16243f), cor `--primary` (#4a90f0), borda `--blue-100`.

#### Markdown editor (dark)

- Container bg `--surface`; borda `--slate-200`.
- Toolbar bg `--surface-sunken`.
- Textarea bg `--surface`; ui-monospace cor `--slate-800`.
- Preview bg `--surface`; blockquote bg `--blue-50` (escuro), borda esquerda `--primary`.
- Code inline bg `--surface-sunken`, texto `--blue-700`.

#### Upload zone

- Borda dashed `--slate-300` (mais visível no escuro que slate-200).
- Bg padrão `--surface-elevated`.
- Hover/drag: borda `--primary`, bg `--blue-50` (escuro).
- Lista de arquivos: cada item bg `--surface-elevated`, borda `--slate-200`.

#### Tabela

- thead bg `--surface-sunken`, texto `--slate-500`.
- tbody row hover/selected bg `--blue-50` (escuro).
- Border-bottom de linha: `--slate-100` (já remapeado para `#121a2b`, quase invisível — intencional).
- Checkbox `--surface-elevated` bg, borda `--slate-300`.

### 17.6 Gráficos no dark

| Categoria | Stroke | Área (alpha 25%) |
|---|---|---|
| Geral | `--primary` (#4a90f0) | rgba(74,144,240,.22) |
| Feminino | `#ec7aa5` | rgba(236,122,165,.20) |
| Masculino | `#5b86c4` | rgba(91,134,196,.20) |
| **Outro** | `--purple-500` (#a78bfa) | rgba(167,139,250,.22) |
| Ativo | `#4ade80` | rgba(74,222,128,.18) |
| Pendente | `#fbbf24` | rgba(251,191,36,.18) |
| Inativo | `#f87171` | rgba(248,113,113,.18) |

- Gridlines: `rgba(255,255,255,.06)` (em vez de `--slate-100`).
- Eixos: cor `--slate-500`.
- Tooltip do gráfico: bg `#e7ecf3` (slate-900 invertido), texto `--bg`. Inverter mantém o contraste alto sem competir com a cor da série.
- Legenda dot 8×8: mesma cor do stroke.

### 17.7 Estados de input no dark

| Estado | Visual |
|---|---|
| Normal | bg `--surface-elevated` `#1a2440`, border `--slate-200` `#1f2a44`, texto `--slate-800` `#e0e5ee` |
| Hover  | border `--slate-300` `#2a3759` |
| Focus  | border `--primary`, shadow `0 0 0 3px var(--ring)` (alpha .30) |
| Valid  | border `--success`, check verde `#4ade80` |
| Error  | border `--danger`, shadow `0 0 0 3px rgba(248,113,113,.20)`, label vermelho `#fca5a5` |
| Disabled | opacity .45, cursor not-allowed |
| Read-only | bg `--surface-sunken`, texto `--slate-600` |
| Placeholder | cor `--slate-400` (`#6e7894`) |

### 17.8 Acessibilidade (dark)

- Texto principal (`--slate-800` no dark = `#e0e5ee`) sobre `--surface` (`#121a2b`) = **contraste 12.4:1** ✓
- `--slate-500` sobre `--surface` = **5.6:1** ✓
- `--primary` (`#4a90f0`) sobre `--surface` = **6.0:1** ✓
- Botão primary texto escuro sobre primary bg = **9.8:1** ✓
- `--purple-700` (`#d9c5ff`) sobre `--purple-50` (`#1d1430`) = **9.1:1** ✓
- Foco visível: ring 3px com alpha .30 (mais opaco que no claro) garante visibilidade.

### 17.9 Sintaxe @media de fallback

Quando o usuário **não** tem preferência salva e não há toggle, respeitar o sistema:

```css
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    /* mesmas declarações de [data-theme="dark"] */
  }
}
```

### 17.10 Tabela de equivalência rápida (cheat sheet)

| Use | Light | Dark |
|---|---|---|
| Background da página | `#efefef` (`--page-bg`) | `#0b1220` |
| Card | `#fff` | `#121a2b` |
| Card elevado / popover | `#fff` | `#1a2440` |
| Texto principal | `#1f2532` | `#e0e5ee` |
| Texto secundário | `#6b7485` | `#98a1b8` |
| Borda padrão | `#dde2ea` | `#1f2a44` |
| Hover de item | `#eff5fc` | `#16243f` |
| Primary | `#1e6fd9` | `#4a90f0` |
| Texto sobre primary | `#fff` | `#0b1220` |
| Purple (Outros) bg | `#f5efff` | `#1d1430` |
| Purple (Outros) texto | `#581c87` | `#d9c5ff` |

### 17.11 O que NÃO mudar no dark

- Raios (`--radius-*`) — geometria é geometria.
- Tipografia (família, tamanhos, pesos).
- Espaçamentos.
- Duração de animações.
- Comportamento de focus/keyboard.
- Hierarquia de z-index.

---

## 18. Resumo das mudanças desta versão (changelog)

- **Adicionada escala `--purple-*`** (50, 100, 300, 500, 600, 700) reservada para identidade "Outro".
- `.gender.o` migrado de slate → purple-50/purple-700.
- Pílula radio "Outro" no dialog Cadastrar paciente recebe borda purple-300 quando ativa.
- Definida regra de uso de roxo em gráficos (série "Outros" → stroke purple-500, área purple-100 30%).
- Definido avatar para pacientes "Outro": gradiente `purple-300 → purple-600`.
- **Adicionada seção Dark Theme completa** (seção 17): superfícies semânticas, tokens invertidos, mapeamento por componente, ajustes para botões/inputs/gráficos, contraste AA verificado, snippet de ativação via `data-theme`.
- **`--page-bg: #efefef`** introduzido como token dedicado para fundo da página. Separado do `--slate-50` para que cards brancos (`#fff`) se elevem por contraste de cor puro, sem borda ou sombra pesada.
- **`--radius-lg` aumentado de 10px para 12px** — arredondamento médio, nem quadrado nem pill, alinhado ao padrão visual de cards modernos.
- **Cards sem borda** (`border: none`): elevação feita exclusivamente pelo contraste `#fff` sobre `--page-bg`. `--shadow-sm` reservado para cards sobrepostos (popover dentro de card). Checklist item 14 adicionado.

— fim do design-system.md —
