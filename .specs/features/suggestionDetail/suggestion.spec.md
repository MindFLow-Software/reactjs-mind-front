# Spec — Modal de Detalhes da Sugestão

> Versão: 1.0 · 23 mai 2026  
> Página: `MindFlush Comunidade.html`  
> Componente raiz: `.dm-back > .dm`  
> Ponto de entrada: função `openDetail({title, votes, banner})` ou clique em qualquer `.sug` do board

---

## 1. Propósito

Modal full-screen-overlay que abre **ao clicar em um card de sugestão no board Kanban da Comunidade**. Mostra todos os detalhes que não cabem no card resumido: descrição completa, anexos, discussão (comentários), jornada (timeline de status), quem votou, sugestões relacionadas e ações administrativas.

É a **tela principal de engajamento** com uma ideia — onde o usuário decide se vota, comenta, ou apenas acompanha.

---

## 2. Hierarquia de regiões

```
┌──────────────────────────────────────────────────────────┐
│  STATUS BANNER (faixa colorida + stepper de 5 fases)    │  ← .dm-banner
├──────────────────────────────────────────────────────────┤
│  ┌────┐  TÍTULO GRANDE                       [🔔][↗][✕] │  ← .dm-head
│  │ ▲  │  pílula categoria · avatar · autor · data · 💬   │
│  │487 │                                                  │
│  │vot │                                                  │
│  └────┘                                                  │
├──────────────────────────────────┬───────────────────────┤
│  DESCRIÇÃO (card cinza claro)    │  ┌──────────────────┐ │
│  - parágrafos                    │  │ Quem votou       │ │  ← .dm-aside
│  - listas                        │  │ (avatares stack) │ │
│  - **negritos**                  │  └──────────────────┘ │
│                                  │  ┌──────────────────┐ │
│  ANEXOS (2-N thumbs)             │  │ Jornada          │ │
│                                  │  │ (timeline 7 stp) │ │
│  DISCUSSÃO (composer + thread)   │  └──────────────────┘ │
│  • staff message (roxo)          │  ┌──────────────────┐ │
│  • comentário regular            │  │ Mini-stats 2×2   │ │
│  • reply (recuo + borda)         │  └──────────────────┘ │
│  • [Ver mais 79 comentários]     │  ┌──────────────────┐ │
│                                  │  │ Relacionadas     │ │
│                                  │  └──────────────────┘ │
├──────────────────────────────────┴───────────────────────┤
│  [Copiar link] [Discutir no canal]            [Reportar] │  ← .dm-foot
└──────────────────────────────────────────────────────────┘
```

---

## 3. Camadas e dimensões

| Token | Valor | Comentário |
|---|---|---|
| Backdrop | `rgba(15,52,100,.50)` + `blur(4px)` | escurece o board |
| Z-index | `80` | acima de tudo exceto wizard (120) e success (140) |
| Largura | `min(960px, 100%)` | desktop confortável, mobile cheio |
| Altura | `max-height: 92vh` | scroll interno se passar |
| Radius | `14px` | mais alto que cards (10px) — sinaliza "destaque" |
| Sombra | `--shadow-lg` (`0 12px 32px rgba(15,52,100,.12)`) | profundidade clara |
| Padding externo do back | `4vh 20px 20px` | "respiro" no topo |
| Animação entrada | `dmIn 280ms cubic-bezier(.2,.9,.3,1.2)` | leve overshoot |
| Grid body | `1fr 290px` | main fluido, aside fixo |
| Mobile (<760px) | grid colapsa para 1 coluna | aside vai abaixo |

---

## 4. Componentes detalhados

### 4.1 Status banner (`.dm-banner`)

Faixa de **40px de altura** no topo, com fundo tinto pela cor do status e um **stepper inline de 5 fases**.

**Anatomia (esquerda → direita)**:
1. `blob` — bolinha 8×8 da cor do status
2. `label` — nome do status em **CAIXA ALTA**, 11.5px, peso 700, tracking 0.07em
3. `step-sep · ` — separador cinza-claro
4. **5 steps** (Aprovada → Em votação → Em estudo → Implementando → Concluído), cada um com:
   - `num` — círculo 16×16, checkmark se `.done`, número se pendente
   - rótulo curto
5. `spacer` (flex:1) — empurra o ID para a direita
6. `b-id` — código em monospace (ex.: `SUG-1247`) com ícone de link 11×11

**Variantes (4 esquemas de cor)**:
| Classe | Fundo | Texto label | Blob/icons |
|---|---|---|---|
| `.vot` | `--blue-50` `#eff5fc` | `--blue-700` | `--primary` |
| `.est` | `--purple-50` `#f5efff` | `--purple-700` | `--purple-500` |
| `.impl` | `--warn-bg` `#fbf1df` | `--warn` `#b87c00` | `--warn` |
| `.done` | `--success-bg` `#e7f4ee` | `--success` | `--success` |

**Estados dos steps**:
- `.done` → bg = cor do status, texto colorido, check branco
- `.current` → bg = `--primary`, animação pulse (anel azul)
- pendente → bg `--slate-100`, número `--slate-500`

### 4.2 Cabeçalho (`.dm-head`)

Layout flex de 3 colunas: **vote-box** | **título+meta** | **ações**.

Padding `18px 22px 12px`.

#### a) Vote button (`.dm-vote`)
- **64px de largura**, padding `10px 4px`
- Borda 1.5px `--slate-200`, radius 6px, bg `--slate-50`
- 3 linhas verticais centralizadas:
  - Ícone chevron-up 18×18 `--slate-500`
  - Número grande: **Inter Tight 20px, peso 700, tabular-nums**
  - Label "VOTOS" 9px peso 700 uppercase tracking 0.06em
- **`.voted`**: bg `--blue-50`, borda `--primary`, todos elementos viram `--primary`
- Hover: borda `--primary` + bg `--blue-50`

#### b) Bloco título
- `.dm-title` — H2 **21px Inter Tight peso 700**, letter-spacing -0.015em, line-height 1.25
- `.dm-sub` (linha meta abaixo do título): pílula categoria → ponto separador (3×3) → avatar 18×18 com iniciais → "por **Autor**" → data → comentários

Separadores `.dot` são bolinhas 3×3 `--slate-300`.

#### c) Ações (`.dm-actions`)
3 ícones-botão 34×34, bg branco, borda `--slate-200`:
- 🔔 Seguir atualizações
- ↗ Compartilhar
- ✕ Fechar (sem borda)

### 4.3 Body — coluna principal (`.dm-main`)

Padding `6px 22px 22px`, scroll-y. Contém:

#### a) Descrição (`.dm-desc`)
- Card em `--slate-50` com borda `--slate-100`, radius 10px, padding `14px 16px`
- Texto 14px, line-height 1.6, cor `--slate-800`
- Suporta `<p>`, `<ul><li>`, `<strong>` (cor `--slate-900` peso 600)

#### b) Anexos (`.dm-attachments`)
Grid `auto-fill, minmax(130px, 1fr)`, gap 8px.
- Thumb `.dm-att`: aspect-ratio 4:3, radius 8px, bg gradient azul claro (variante `.png`)
- Ícone de imagem ao centro
- `.lbl` no rodapé com gradiente preto→transparente, nome do arquivo branco truncado

#### c) Seção títulos (`.dm-section-title`)
"ANEXOS", "DISCUSSÃO" — 11px uppercase peso 700 `--slate-500` tracking 0.06em.
- Ícone 13×13 à esquerda
- `count-mini` ao lado — pílula `--slate-100`, número 10.5px

#### d) Composer (`.dm-composer`)
Caixa de texto para novo comentário:
- Avatar do usuário logado (32×32)
- Wrap com borda, focus-within → borda primary + ring
- Textarea sem borda, min 64px, resize vertical
- Toolbar inferior (`--slate-50`): @mention, anexar, negrito, label "Markdown suportado", botão **Comentar** azul à direita

#### e) Thread (`.dm-thread`)
Lista de comentários, gap 14px. Cada `.dm-comment`:
- Avatar 32×32 colorido com iniciais
- Head row: nome (13px peso 600), role badge opcional, when (11.5px tabular)
- Texto 13px line-height 1.55 `--slate-700`
- Ações: ♥ curtidas, ↩ Responder (11.5px)

**Variantes**:
- `.staff-msg` — text box em fundo `--purple-50` borda `--purple-100`, role "Staff" roxa
- `.reply` — margin-left 34px + padding-left 14px + border-left 2px `--slate-100`
- Role "Autor" — badge azul `--blue-50`/`--blue-700`

Botão final "Ver mais N comentários" — `.btn-secondary` centralizado.

### 4.4 Body — aside (`.dm-aside`)

Coluna direita **fixa 290px**, fundo `--slate-50`, border-left `--slate-200`, padding 18px, gap 18px. Scroll independente.

Quatro cards (`.dm-card`):

#### a) Quem votou
- Stack de avatares 28×28 com overlap (-8px) e borda 2px branca
- Mostra 5 + `+482` em cinza
- Texto "**487** psicólogos votaram"

#### b) Jornada (timeline)
- Linha vertical contínua (`::before`) à esquerda
- 7 steps `.tl-step`:
  - `.done` — círculo verde sólido com check branco
  - `.current` — círculo azul com ícone de raio + **animação pulse de anel** (ringPulse 2s)
  - `.pending` — círculo branco borda cinza, label e ícone esmaecidos
- Cada step: label 12.5px peso 600 + when 11px tabular

#### c) Mini-stats
Grid 2×2 (`mini-stats`), separadores cinza:
- Votos · Comentários · Aberta há · Seguidores

#### d) Sugestões relacionadas
Lista de 3 itens. Cada um: número de votos à esquerda (peso 700) + título 12.5px clamp 2 linhas. Clicável (abre nova sugestão).

### 4.5 Footer (`.dm-foot`)

Faixa final, padding `12px 22px`, border-top, bg branco.
- À esquerda: 2 ações utilitárias (`Copiar link`, `Discutir no canal`) — `.dm-foot-btn`, 12px, ícone + texto
- À direita: `Reportar` em vermelho discreto (`.danger`)

---

## 5. Tipografia (resumo)

| Elemento | Família | Tamanho | Peso |
|---|---|---|---|
| Título sugestão | Inter Tight | 21px | 700 |
| Voto-número | Inter Tight | 20px | 700 |
| Descrição corpo | Inter | 14px | 400 |
| Comentário | Inter | 13px | 400 |
| Nome autor | Inter | 13px | 600 |
| Seções (uppercase) | Inter | 11px | 700 |
| Banner label | Inter | 11.5px | 700 |
| Meta/data | Inter | 11.5px | 400 |

---

## 6. Cores por status (referência rápida)

| Status | Bg banner | Bg do banner-secundário (sx-card) | Cor texto/icons |
|---|---|---|---|
| Votação | `#eff5fc` (blue-50) | `#dbe8f7` (blue-100) | `#144687` (blue-700) |
| Em estudo | `#f5efff` (purple-50) | `#e8d9ff` (purple-100) | `#581c87` (purple-700) |
| Implementando | `#fbf1df` (warn-bg) | `#f3deaa` | `#b87c00` (warn) |
| Concluído | `#e7f4ee` (success-bg) | `#c5e6d3` | `#118a5a` (success) |

---

## 7. Estados e interações

### Vote button
- Idle → Hover → Clicked (incrementa contador com bounce 280ms)
- Voted → Click → "Voto removido?" via toast (decrementa)
- Em coluna "Concluído": vote button vira **chip verde clicável** com badge "Disponível"

### Modal abrir/fechar
- Trigger: clique em `.sug` no board (NÃO em `.vote` — propagation stop)
- Backdrop click → fecha
- Tecla `Esc` → fecha (e cobre wizard + success também)
- Animação saída: `dmIn` reverse, 200ms

### Composer
- Empty → botão Comentar disabled (opacidade 0.5)
- ≥1 char → habilita botão
- Submit → adiciona ao topo da thread (mais recentes primeiro), toast "Comentário publicado"

### Timeline pulse
- Apenas o step `.current` pulsa (animação `ringPulse 2s infinite`)
- Anel cresce até 6px de spread, esmaece, repete

### Compartilhar (`↗`)
- Click → menu dropdown ou copia link e mostra toast "Link copiado ✓"

---

## 8. Acessibilidade

- `role="dialog" aria-modal="true" aria-labelledby="dm-title"`
- Focus trap dentro do modal enquanto aberto
- Esc fecha; foco volta ao card de origem
- Botões com `title` e `aria-label` quando só ícone
- Stepper do banner: ler como "etapa 4 de 5: Implementando" para SR
- Vote button: `aria-pressed` reflete estado `.voted`
- Contrast: todos textos passam em AA (testar especialmente `--slate-500` sobre `--slate-50`)

---

## 9. Responsividade

| Breakpoint | Comportamento |
|---|---|
| ≥760px | Layout 2 colunas (main 1fr, aside 290px) |
| <760px | Aside vai abaixo do main, border-top; banner stepper esconde steps intermediários (mantém só current + total); ações do head viram menu kebab |
| <520px | Vote button do head fica horizontal acima do título; composer footer empilha tools |

---

## 10. Dependências de design system

Tokens consumidos (definidos em `:root`):
- Cores: `--blue-50/100/300/700`, `--slate-50/100/200/300/400/500/700/800/900`, `--success`, `--success-bg`, `--purple-50/100/500/700`, `--warn`, `--warn-bg`, `--primary`, `--primary-hover`, `--ring`, `--danger`
- Fontes: `--font-body` (Inter), `--font-title` (Inter Tight)
- Raios: `--radius` (6), `--radius-sm` (4), `--radius-lg` (10)
- Sombras: `--shadow-sm`, `--shadow-md`, `--shadow-lg`

Ícones: SVG inline 24×24, stroke-based (lucide-style).
