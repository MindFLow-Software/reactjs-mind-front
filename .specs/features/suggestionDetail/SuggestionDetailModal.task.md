# Task — Construir o Modal de Detalhes da Sugestão

> Arquivo alvo: `MindFlush Comunidade.html`  
> Spec de referência: `docs/SuggestionDetailModal.spec.md`  
> Componente raiz: `.dm-back > .dm`  
> Estimativa: 6-10h (1 desenvolvedor sênior front-end)

---

## 🎯 Objetivo

Construir o **modal de detalhes** que abre quando o usuário clica em uma sugestão no board. Inclui descrição completa, anexos, discussão (comentários com replies), timeline de jornada, lista de votantes e sugestões relacionadas.

---

## ✅ Checklist de implementação

### Fase 1 — Estrutura e chrome (≈1h)

- [ ] Criar wrapper `.dm-back` (fixed, inset:0, z-80, backdrop blur, scroll-y)
- [ ] Criar container `.dm` com largura `min(960px,100%)`, max-height 92vh, radius 14px
- [ ] Implementar animação `dmIn` (cubic-bezier(.2,.9,.3,1.2), 280ms)
- [ ] Layout vertical 4 regiões: banner → head → body (2col) → foot
- [ ] Função `openDetail({title, votes, banner})` que aplica dados e mostra
- [ ] Função `closeDetail()` ligada a: botão ✕, click no backdrop, tecla Esc
- [ ] Focus trap dentro do modal enquanto aberto

### Fase 2 — Status banner (≈1.5h)

- [ ] Faixa `.dm-banner` 40px com 4 variantes de cor (.vot / .est / .impl / .done)
- [ ] Blob colorido + label uppercase 11.5px
- [ ] Stepper inline de 5 fases: Aprovada → Em votação → Em estudo → Implementando → Concluído
- [ ] Cada step tem `num` (círculo 16×16) + label curto + separador `→`
- [ ] Estados: `.done` (check branco), `.current` (azul com pulse), pendente (cinza)
- [ ] Identificador `SUG-NNNN` em monospace à direita (com ícone de link)
- [ ] Banner inteiro mudar de cor conforme status atual da sugestão

### Fase 3 — Cabeçalho do modal (≈1h)

- [ ] **Vote button** `.dm-vote` 64px largura, layout vertical (ícone + número grande + "VOTOS")
- [ ] Estado `.voted` (bg + borda + cor azul)
- [ ] Hover lift e mudança de cor
- [ ] Animação de incremento ao clicar (scale bounce ~280ms)
- [ ] **Bloco título**: h2 21px Inter Tight peso 700
- [ ] **Sub-meta**: pílula categoria + ponto sep + avatar + autor + data + comentários
- [ ] **3 ações** à direita: 🔔 seguir, ↗ compartilhar, ✕ fechar
- [ ] Click no vote NÃO fecha o modal nem propaga para o card de origem

### Fase 4 — Coluna principal (≈2h)

- [ ] **Descrição** `.dm-desc` — card cinza claro, suporta `<p>`, `<ul>`, `<strong>`
- [ ] **Anexos** grid auto-fill min 130px, thumbnails 4:3 com label inferior em gradiente
- [ ] **Seções título** uppercase 11px + ícone + contador opcional
- [ ] **Composer**:
  - Avatar do usuário logado
  - Textarea com focus-within ring
  - Toolbar: @mention, anexar, **B**, "Markdown suportado", botão Comentar azul
  - Disabled enquanto vazio, enabled com ≥1 char
- [ ] **Thread**:
  - Comentário regular (avatar + nome + when + texto + curtir/responder)
  - Variante `.staff-msg` (text box roxo, role "Staff" roxa)
  - Variante `.reply` (recuo 34px + border-left)
  - Role "Autor" badge azul
  - Botão "Ver mais N comentários" no fim

### Fase 5 — Aside (≈2h)

- [ ] Container `.dm-aside` 290px fixo, bg cinza claro, scroll independente
- [ ] **Card "Quem votou"** — stack de avatares 28×28 com overlap, +N em cinza, contagem total
- [ ] **Card "Jornada"** — timeline vertical com 5-7 steps:
  - Linha contínua vertical (`::before`)
  - Estados: done (verde sólido), current (azul com pulse), pending (esmaecido)
  - Animação `ringPulse 2s infinite` apenas no `.current`
- [ ] **Mini-stats** 2×2 grid (votos, comentários, aberta há, seguidores)
- [ ] **Card "Relacionadas"** — lista de 3 sugestões com votos à esquerda e título clamp 2 linhas

### Fase 6 — Footer e ações (≈30min)

- [ ] `.dm-foot` com 3 botões: Copiar link, Discutir no canal, Reportar (vermelho)
- [ ] Click em "Copiar link" → `navigator.clipboard.writeText(...)` + toast
- [ ] Click em "Reportar" → abre confirmação modal (sub-tarefa futura)

### Fase 7 — Responsividade e polish (≈1h)

- [ ] Breakpoint <760px: aside vai abaixo do main com border-top
- [ ] Breakpoint <520px: vote button do head fica horizontal acima do título
- [ ] Banner em mobile esconde steps intermediários (mantém current + total)
- [ ] Testar scroll interno: main e aside scrollam independente
- [ ] Verificar que descrição longa não quebra layout

### Fase 8 — Acessibilidade (≈30min)

- [ ] `role="dialog" aria-modal="true" aria-labelledby="dm-title"`
- [ ] Vote button com `aria-pressed` espelhando estado `.voted`
- [ ] Botões só com ícone têm `aria-label` + `title`
- [ ] Stepper: incluir texto SR-only "etapa 4 de 5"
- [ ] Esc fecha o modal e devolve foco ao card de origem
- [ ] Contrast: passar AA em todos textos sobre fundos coloridos (especialmente `--slate-500` sobre `--slate-50`)

---

## 🔌 Integrações com backend (a definir)

| Endpoint | Quando chamar | Resposta esperada |
|---|---|---|
| `GET /api/suggestions/:id` | Ao abrir o modal | Objeto completo: título, descrição, votos, comentários, anexos, jornada, autor, status |
| `POST /api/suggestions/:id/vote` | Click no vote button | `{ voted: bool, newCount: int }` |
| `POST /api/suggestions/:id/follow` | Click no 🔔 | `{ following: bool }` |
| `POST /api/suggestions/:id/comments` | Submit do composer | Objeto comentário recém-criado |
| `POST /api/comments/:id/like` | Click ♥ comentário | `{ liked: bool, newCount: int }` |
| `GET /api/suggestions/:id/related` | Ao abrir | Array com até 3 sugestões similares |
| `POST /api/suggestions/:id/report` | Click "Reportar" | confirma recebimento |

---

## 🧪 Casos de teste manuais

### Visual
1. Abrir sugestão em cada um dos 4 status → banner muda de cor corretamente
2. Sugestão sem anexos → seção "Anexos" some
3. Sugestão sem comentários → thread some, composer permanece
4. Sugestão própria → role "Autor" aparece em respostas
5. Descrição com >300 palavras → scroll interno do `.dm-main` funciona

### Interação
6. Click no card do board → modal abre com dados corretos
7. Click no `.vote` dentro do card → vota SEM abrir modal
8. Click em backdrop → fecha modal
9. Tecla Esc → fecha modal
10. Click em "Copiar link" → mostra toast "Link copiado ✓"
11. Comentário com >10 linhas → renderiza com line-height correto
12. Reply aninhada → tem indent visual (34px + border-left)

### Estados
13. Vote button no estado `voted` → cor azul, contador atualizado
14. Click novamente no vote `voted` → desvota, decrementa
15. Timeline `current` → tem animação pulse
16. Status "Concluído" → timeline mostra todos steps como done

### Responsivo
17. Reduzir para 760px → aside vai para baixo
18. Reduzir para 480px → header empilha, banner reduz steps
19. Mobile (320px) → modal continua usável, sem corte

---

## 🚫 Fora do escopo desta tarefa

- Sistema completo de menções `@usuário` (apenas o ícone visual está aqui)
- Suporte real a Markdown (apenas o label informando)
- Confirmação modal de "Reportar" (separar em outra tarefa)
- Sub-menu de compartilhamento (WhatsApp, X, etc) — apenas copiar link
- Lazy loading de comentários antigos (botão "Ver mais N" pode ser estático nesta versão)
- Sistema de gamificação/badges nos avatares dos votantes

---

## 📝 Notas para o desenvolvedor

- **Toda animação ≤300ms** para não atrapalhar fluxo
- **Vote button é o elemento de mais peso visual** depois do título — não diminuir
- **Banner é a primeira coisa que o usuário vê** ao abrir — comunica status sem ler texto
- **Aside cards têm padding maior que main sections** porque competem menos pela atenção
- **Não usar `scrollIntoView`** — quebra o overlay; usar `scrollTop` direto
- **Mobile**: o aside vira "rodapé" do main, NÃO um drawer separado (decisão deliberada de UX — usuário entende fluxo de cima pra baixo)
- Reusar tokens existentes do `:root` — não inventar cores novas
- Ícones: SVG inline 24×24 stroke-based (estilo lucide). Spreads próximos: 13×13 para meta, 18×18 para vote, 26×26 para anexos

---

## 🎨 Mockup ASCII de referência

```
╔══════════════════════════════════════════════════════════════╗
║ ● EM IMPLEMENTAÇÃO  ✓ Aprovada → ✓ Em votação → … SUG-1247  ║
╠══════════════════════════════════════════════════════════════╣
║ ┌──┐                                                          ║
║ │▲ │ Videochamada nativa (sem precisar de Google Meet)        ║
║ │487│ ● Fluxo  ·  (CA) por Carolina A.  ·  há 2 meses  · 💬 83║
║ │vot│                                       🔔  ↗  ✕          ║
║ └──┘                                                          ║
╠═══════════════════════════════════╤══════════════════════════╣
║ ┌─────────────────────────────┐  │  ┌─ Quem votou ────────┐ ║
║ │ Atualmente, todo paciente…  │  │  │ (CA)(RP)(JL)(FA)+482│ ║
║ │ Minha proposta: …           │  │  │ 487 psicólogos…     │ ║
║ │ • Link único permanente     │  │  └─────────────────────┘ ║
║ │ • Sala de espera virtual    │  │                          ║
║ └─────────────────────────────┘  │  ┌─ Jornada ───────────┐ ║
║                                   │  │ ✓ Sugestão enviada  │ ║
║ ANEXOS [2]                        │  │ ✓ Aprovada modera.. │ ║
║ ┌──────┐ ┌──────┐                 │  │ ⚡ Em implementação │ ║
║ │ 📷   │ │ 📷   │                 │  │ ○ Beta privado      │ ║
║ └──────┘ └──────┘                 │  └─────────────────────┘ ║
║                                   │                          ║
║ DISCUSSÃO [83]    mais recentes ↓ │  ┌──────┬──────────────┐ ║
║ ┌────────────────────────────┐    │  │ 487  │ 83           │ ║
║ │ (MH) Equipe Mind-high Staff│    │  │ votos│ coment       │ ║
║ │ 🎉 Boas notícias! …        │    │  └──────┴──────────────┘ ║
║ │ ♥ 47 curtidas  ↩ Responder │    │                          ║
║ └────────────────────────────┘    │  ┌─ Relacionadas ──────┐ ║
║                                   │  │ 312 Transcrição…    │ ║
║ (JL) Júlia Lemos  há 1 sem        │  │ 204 App mobile…     │ ║
║ Importantíssimo! …                │  │  87 Relatório…      │ ║
║                                   │  └─────────────────────┘ ║
║   └─ (CA) Carolina A. Autor       │                          ║
║      Concordo Júlia! …            │                          ║
╠═══════════════════════════════════╧══════════════════════════╣
║ [📋 Copiar link] [💬 Discutir no canal]            [⚠ Reportar]║
╚══════════════════════════════════════════════════════════════╝
```
