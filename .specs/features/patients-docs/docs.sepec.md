# Spec — Gestão de Documentos (MindFlush)

> Versão: 1.0 · 24 mai 2026  
> Arquivo: `MindFlush Documentos.html`  
> Rota sugerida: `/documentos`  
> Componente raiz: `<main class="main">` dentro de `.app`  
> Padrão visual: idêntico ao módulo de Pacientes (mesmos tokens, mesma sidebar, mesma topbar)

---

## 1. Propósito

Tela central para **gestão dos anexos clínicos** do consultório: receitas, atestados, exames, fotos do paciente, contratos, relatórios, termos de consentimento, etc.

Permite ao psicólogo:
- **Listar** todos os documentos em formato de tabela densa e filtrável
- **Buscar** por nome, paciente, categoria ou tag
- **Filtrar** por paciente, tipo de arquivo, categoria clínica, status, data
- **Enviar** novos documentos (drag-and-drop + metadados estruturados)
- **Visualizar** sem sair da página (preview de PDF/imagem em drawer lateral)
- **Compartilhar** com o paciente via portal ou link expiráve
- **Exportar** seleção ou tudo (ZIP)
- **Gerenciar armazenamento** (quota, limpeza, arquivamento)

---

## 2. Estrutura da página (regiões)

```
┌────────────────────────────────────────────────────────────────┐
│ SIDEBAR │  TOPBAR (crumb · busca global ⌘K · 🔔 · Enviar doc)  │
│         ├──────────────────────────────────────────────────────┤
│ MENU    │  PAGE-HEAD                                            │
│ FIXO    │  ┌─🗂─┐ Gestão de Documentos        [Exportar][Enviar]│
│ (248px) │  └───┘ Anexos clínicos centralizados…                │
│         │                                                       │
│         │  STATS (4 cards: total · espaço · pendentes · arquiv) │
│         │                                                       │
│         │  ┌──────────────────────────────────────────────────┐│
│         │  │ CARD (.card) ─ container principal               ││
│         │  │  • Filters row (busca + chips + ordenação)        ││
│         │  │  • Bulk bar (aparece quando há seleção)           ││
│         │  │  • Tabela de documentos                           ││
│         │  │  • Footer com paginação                           ││
│         │  └──────────────────────────────────────────────────┘│
│         │                                                       │
│         │  HELP-BAR (atalhos: ⌘K, /, Esc, etc)                  │
└─────────┴──────────────────────────────────────────────────────┘
```

**Sobre essa página**:
- Drawer de preview (`.drawer`) — abre à direita ao clicar em uma linha
- Modal de upload (`.ud`) — abre ao clicar em "Enviar documento"
- Modal de compartilhamento via QR (`.qr`) — abre ao clicar em "Compartilhar"
- Cmd-palette (`.cmd`) — abre com ⌘K para navegação rápida
- Toast (`.toast`) — feedback transitório

---

## 3. Tokens de design (idênticos ao resto do app)

| Token | Valor | Uso |
|---|---|---|
| `--primary` | `#1e6fd9` | acentos, foco, botões primários |
| `--blue-50/100/700` | `#eff5fc / #dbe8f7 / #144687` | estados azuis (hover row, badges) |
| `--slate-50→900` | escala neutra | superfícies, textos |
| `--success` `#118a5a` | `--success-bg` `#e7f4ee` | docs enviados, OK |
| `--warn` `#b87c00` | `--warn-bg` `#fbf1df` | pendentes, expira |
| `--danger` `#b3261e` | `--danger-bg` `#fdecea` | excluir, vencido |
| `--pink` `#c2185b` | `--pink-bg` `#fce4ec` | categoria "Foto" |
| `--font-body` | Inter | corpo |
| `--font-title` | Inter Tight | títulos, números |
| `--radius` | 6px | inputs, botões |
| `--radius-lg` | 10px | cards, drawers |
| `--shadow-sm/md/lg` | sombras suaves | elevações |

> **Não inventar cores.** Reutilize sempre os tokens.

---

## 4. Componentes detalhados

### 4.1 Topbar

Idêntica à da página de Pacientes:
- Crumbs `Área clínica / Documentos` (current em peso 600)
- Busca global ⌘K (max-width 360px, ícone de lupa + kbd hint)
- Ícone de notificações com dot
- Botão primário **"Enviar documento"** com ícone upload

### 4.2 Page header

- **Icon box 42×42** com fundo `--blue-50` e ícone de "pasta com linhas" (representa documento estruturado)
- Título **22px, peso 700**: "Gestão de Documentos"
- Subtítulo 13.5px `--slate-500`: descrição curta
- Ações à direita: **"Exportar tudo"** (secondary) + **"Enviar documento"** (primary)

### 4.3 Stats strip (4 cards)

Grid de 4 colunas. Cada `.stat` é clicável e aplica filtro.

| # | Ícone | Valor | Label | Cor do ícone |
|---|---|---|---|---|
| 1 | Documento | `48` | Total de arquivos | `--blue-50/primary` (default) |
| 2 | Disco/HD | `127MB` de 2GB | Armazenamento usado | `--success-bg/success` |
| 3 | Relógio | `5` | Pendentes de revisão | `--warn-bg/warn` |
| 4 | Arquivo morto | `12` | Arquivados (90+ dias) | `--slate-100/slate-600` |

**Comportamento**:
- Hover: borda muda para `--blue-300`, lift 1px, sombra sutil
- Active (filtro aplicado): borda `--primary`, ring `--ring`
- Click: aplica filtro na tabela e sincroniza com `?filter=...`

### 4.4 Card container `.card`

Wrapper branco com borda `--slate-200`, radius 10px, overflow hidden. Conté m:
1. Linha de filtros
2. Bulk bar (oculta por padrão)
3. Tabela
4. Footer com paginação

### 4.5 Filtros (`.filters`)

Linha horizontal flex, padding `12px 18px`, fundo branco.

**Esquerda**:
- Campo de busca (`.search-input`) — input com lupa, max 380px, placeholder "Buscar por nome, paciente, tag…", botão clear quando preenchido
- **Chips de filtro** (`.chip-filter`):
  - 📅 Todos os tipos · `48`
  - 📄 PDF · `28`
  - 🖼️ Imagens · `12`
  - 📝 DOC · `8`
- Após chips, separador, depois:
  - 📁 Categoria (dropdown: Receita, Atestado, Exame, Foto, Contrato, Relatório, Outros)
  - 👤 Paciente (combo com busca — mostra autocomplete)
  - 📆 Período (date range picker)

**Direita** (com `.filters-spacer`):
- Ordenação (dropdown: Mais recentes, Maior tamanho, Por nome A→Z)
- Botão alternar visualização (Tabela / Grid)
- Botão "Filtros avançados" (abre painel)

### 4.6 Bulk bar (`.bulk`)

Aparece quando ≥1 linha está selecionada. Faixa azul-clara.

- Esquerda: "N documentos selecionados"
- Direita: botões `.bulk-btn`:
  - 📥 Baixar (.zip)
  - 🔗 Compartilhar
  - 📦 Arquivar
  - 🏷️ Adicionar tag
  - 🗑️ Excluir (`.danger`)
- Botão "Limpar seleção"

### 4.7 Tabela de documentos

**Colunas** (em ordem):

| Col | Header | Largura | Conteúdo |
|---|---|---|---|
| 1 | ☐ (checkbox) | 38px | Seleção múltipla |
| 2 | NOME | flex | Thumb miniatura + nome do arquivo + extensão pequena |
| 3 | PACIENTE | min 200px | Avatar + nome (clicável → vai pro perfil) |
| 4 | CATEGORIA | auto | Badge colorido |
| 5 | TAMANHO | 100px | Texto tabular (ex.: `2.4 MB`) |
| 6 | ENVIADO EM | 130px | Data + "há X dias" abaixo |
| 7 | STATUS | auto | Badge: Compartilhado / Privado / Pendente / Expirado |
| 8 | AÇÕES | 110px right | Ícones: 👁️ ver · 📥 baixar · ⋯ menu |

**Header (`thead th`)**:
- 11px uppercase letter-spacing 0.06em
- Cor `--slate-500`, peso 600
- Sticky `top: 0`
- Colunas ordenáveis (NOME, TAMANHO, ENVIADO EM) com `.sortable` e indicador `▴/▾` em `--primary` quando ativo

**Linhas (`tbody tr`)**:
- Border-bottom 1px `--slate-100`
- Hover: bg `--blue-50` (todo container muda)
- Selected: bg `--blue-50` + `box-shadow: inset 3px 0 0 var(--primary)` na 1ª célula
- Cursor pointer (click → abre drawer)

**Célula NOME**:
- Thumbnail **36×44px** com gradiente por tipo (mesma do `.doc-thumb`):
  - `.pdf` → vermelho `#dc2626 → #991b1b`
  - `.img` → cyan `#0891b2 → #0e7490`
  - `.doc` → azul `#2563eb → #1e40af`
  - `.xls` → verde `#16a34a → #15803d` (novo)
  - Canto superior direito com triângulo branco translúcido (dobra de página)
- Nome em peso 600 `--slate-900` truncado com ellipsis
- Linha 2 com tamanho/tipo (11px `--slate-500`)

**Célula PACIENTE**:
- Avatar 34×34 com iniciais (gradient azul ou cor por hash do nome)
- Nome peso 600 + sub-meta com CRM/CPF parcial
- Hover → underline no nome
- Indicador `.online` (bolinha verde 9×9 com borda branca) se paciente tem sessão hoje

**Badges de categoria** (`.badge` mas adaptados):
- `Receita` → `--blue-50` / `--blue-700`
- `Atestado` → `--success-bg` / `--success`
- `Exame` → `--purple-50` / `--purple-700` (precisa adicionar token)
- `Foto` → `--pink-bg` / `--pink`
- `Contrato` → `--warn-bg` / `--warn`
- `Relatório` → `--slate-100` / `--slate-700`
- `Termo` → `#fde8e8` / `--danger`

**Badges de status**:
- `Compartilhado` (verde, ícone share) — visível pelo paciente
- `Privado` (cinza, ícone lock) — só clínico
- `Pendente` (laranja, ícone hourglass) — aguarda assinatura/revisão
- `Expirado` (vermelho, ícone clock) — link expirou
- `Assinado` (azul, ícone check-circle) — termo assinado

**Ações inline (`.row-actions`)**:
- 30×30, gap 2px
- 👁️ Ver (preview no drawer) — `.primary`
- 📥 Baixar
- ⋯ Mais (`.row-more-wrap`) abre `.row-menu`:
  - Compartilhar link
  - Gerar QR
  - Mover para categoria…
  - Renomear
  - Arquivar
  - Substituir versão
  - Excluir (`.danger`)

**Tooltips** nos ícones via `data-tip="Texto"` (CSS pseudo-element).

### 4.8 Footer da tabela (`.table-foot`)

- Esquerda: "**Mostrando 1–20** de **48** documentos · 127MB"
- Direita: `.pagi` com botões prev/next/specific page + selector de tamanho de página (10/20/50/100)

### 4.9 Drawer de preview (`.drawer`)

Painel lateral direito 440px (90vw em mobile). Abre ao clicar em uma linha (ou no 👁️).

**Head** (`.drawer-head`):
- Thumb grande do doc
- Nome do arquivo em 15px peso 700
- Extensão + tamanho em sub
- Botão fechar `×` à direita

**Body** (`.drawer-body`):
- **Preview embedado**:
  - PDF: `<iframe>` com viewer nativo do browser
  - Imagem: `<img>` com zoom on hover
  - DOC/XLS: ícone grande + botão "Abrir externamente"
- **Info grid** (2 colunas):
  - Paciente (avatar + nome)
  - Categoria (badge)
  - Tamanho
  - Tipo
  - Enviado em (data + hora)
  - Por (autor — geralmente o próprio profissional)
  - Última visualização
  - Visualizações totais
- **Tags** (chips): #receita-controlada, #cid-f32, etc — adicionáveis
- **Notas internas** (textarea com markdown editor `.md-editor`)
- **Linha do tempo** (`.timeline-item`):
  - 21/05 — Enviado por Marina A.
  - 22/05 — Compartilhado com paciente via portal
  - 23/05 — Visualizado pelo paciente (1ª vez)
  - 24/05 — Reenviado por e-mail

**Footer** (`.drawer-foot`):
- 📤 Compartilhar
- 📥 Baixar
- 🗑️ Excluir (`.danger`)

### 4.10 Modal Enviar Documento (`.ud-back > .ud`)

Modal 640px de largura, padding generoso. **6 partes**:

1. **Head**: ícone + "Enviar documento" + sub "Adicione anexos clínicos a um ou mais pacientes" + botão fechar
2. **Zona de drop** (`.ud-zone`):
   - Border tracejada `--slate-200`, padding 24px
   - Ícone upload 44×44 dentro de quadrado branco
   - "Arraste arquivos aqui ou **clique para selecionar**"
   - "PDF, JPG, PNG, DOCX até 20MB cada"
   - Hover/drag: borda `--primary` + bg `--blue-50` + ring
3. **Lista de arquivos** (`.ud-files`):
   - Aparece quando há ao menos 1 arquivo
   - Cada `.ud-file`: thumb por tipo + nome truncado + tamanho + barra de progresso (se uploading) + ✓ verde (se done) + 🗑 remover
4. **Meta** (`.ud-meta`):
   - **Paciente** (`.ud-combo`) — combo com autocomplete buscando da base. Resultado vira chip (`.ud-pat-chip`). Pode múltiplos.
   - **Categoria** (`.ud-pills`) — radio buttons em pills: Receita / Atestado / Exame / Foto / Contrato / Outros
   - **Visibilidade** (pills): 🔒 Privado / 👁 Compartilhar com paciente
   - **Notas** (textarea opcional)
5. **Foot**:
   - Esquerda: indicador "🔒 Criptografado em trânsito"
   - Direita: Cancelar + **Enviar (N arquivos)** primary

**Comportamento**:
- Drag globalmente abre destaque
- Upload em paralelo (≤3 simultâneos)
- Progress real (XHR/fetch progress)
- Falha individual: mostra erro inline com botão "Tentar novamente"
- Sucesso: confeti pequeno + toast "N documentos enviados com sucesso"

### 4.11 Modal Compartilhar via QR (`.qr-back > .qr`)

Modal 440px com QR code no centro.

- **Frame** com cantos azuis decorativos (`::before`/`::after`)
- QR 200×200 (gerar com biblioteca `qrcode.js` ou similar)
- Overlay com logo M no centro (42×42)
- Instruções: "Escaneie com o app do paciente"
- Link copiável (`.qr-link` com input readonly + botão Copiar)
- Atalhos de compartilhamento (`.qr-share`) — grid 4 colunas: WhatsApp, E-mail, Telegram, Mais
- Meta (`.qr-meta`): "🕐 Expira em 7 dias" + botão "Regenerar link"

### 4.12 Cmd palette (`.cmd-back > .cmd`)

Abre com **⌘K** (Mac) ou **Ctrl+K** (Win). Modal 560px no topo (14vh do top).

- Input grande com lupa
- Lista filtrada de comandos:
  - Navegar para Pacientes (kbd: G P)
  - Enviar documento (kbd: U)
  - Filtrar por: Receitas, Exames, …
  - Buscar paciente: "Maria Silva"
- Highlight em `--blue-50` no item ativo
- Estado vazio: "Nenhum resultado para 'xxx'"

### 4.13 Help bar (`.helpbar`)

Linha discreta no fim da página com atalhos:
- `⌘K` Busca
- `U` Enviar
- `/` Focar busca
- `Esc` Fechar
- `J/K` Navegar linhas

---

## 5. Tipografia

| Elemento | Família | Tamanho | Peso |
|---|---|---|---|
| Título página | Inter Tight | 22px | 700 |
| Stat val | Inter Tight | 22px | 700 |
| Card-title | Inter Tight | 15px | 700 |
| Nome arquivo (linha) | Inter | 13.5px | 600 |
| Header tabela | Inter | 11px UPPERCASE | 600 |
| Corpo tabela | Inter | 13.5px | 400-500 |
| Badge | Inter | 12px | 600 |
| Sub-meta | Inter | 11.5px | 500 |
| Botões | Inter | 13px | 600 |

---

## 6. Estados e interações

### Tabela
- Hover row → bg `--blue-50` (linha inteira)
- Click row → abre drawer com preview daquele doc
- Click no avatar do paciente → para a pág do paciente (link separado, não abre drawer)
- Click no thumb do doc → abre preview fullscreen (modal lightbox)
- Click no checkbox → seleciona linha, mostra `.bulk` no topo
- Shift+click → seleção em range
- Ctrl/Cmd+A → seleciona todos da página atual

### Drag-and-drop global
- Arrastar arquivo de fora pra qualquer lugar da página → overlay azul translúcido com "Solte para enviar"
- Solta → abre modal `.ud` já com o(s) arquivo(s) na lista

### Upload progress
- Barra `.ud-file-bar-fill` cresce conforme `xhr.upload.onprogress`
- Done → barra fica verde, ✓ aparece, 🗑 some
- Erro → barra fica vermelha, texto "Falhou" + link "Tentar novamente"

### Filtros sincronizados
- Cada chip/dropdown atualiza a URL: `?type=pdf&patient=123&from=2026-01-01`
- Page refresh mantém o estado

### Pesquisa
- Busca instantânea com debounce 220ms
- Highlight em `<mark>` nas correspondências
- Empty state quando 0 resultados: ilustração + "Nenhum documento encontrado para 'xxx'"

### Edição inline
- Click duplo no nome do arquivo → vira input editável (renomeio)
- Enter → salva, Esc → cancela

---

## 7. Ações administrativas (clinical-safe)

| Ação | Confirmação? | Auditoria? |
|---|---|---|
| Visualizar | Não | Sim (log de acesso) |
| Baixar | Não | Sim |
| Compartilhar | Sim (modal QR) | Sim |
| Renomear | Não | Sim |
| Mover categoria | Não | Sim |
| Arquivar | Sim ("Confirmar arquivamento?") | Sim |
| Excluir | Sim (modal com input "DELETE") | Sim, hard-delete só após 30 dias |
| Restaurar (de arquivados) | Não | Sim |
| Substituir versão | Sim | Sim, mantém versão anterior |

> ⚠️ **CFP/LGPD**: documentos clínicos têm retenção mínima de **20 anos**. "Excluir" na verdade marca como deletado; remoção física só após 20 anos OU solicitação formal do titular.

---

## 8. Acessibilidade

- Tabela com `<table>` semântico, `<th scope="col">`, `<caption>` sr-only
- Linhas focáveis com Tab, Enter abre drawer
- Setas ↑↓ navegam entre linhas quando uma está focada
- Checkboxes com `aria-checked` (incluindo `indeterminate`)
- Drawer: `role="dialog" aria-modal="true"` + focus trap
- Esc fecha drawer/modal/palette
- Anúncios SR ao selecionar bulk: "3 documentos selecionados, ações disponíveis"
- Contraste AA em badges (verificar `.badge.pending` com peso 600 em `#92400e`)

---

## 9. Performance

- **Lazy load** de thumbs além da viewport
- **Virtualização** da tabela quando >100 linhas (use `IntersectionObserver` ou biblioteca como `tanstack-virtual`)
- **Cache** dos previews de PDF (blob URLs reaproveitáveis)
- **Pagination server-side** quando volume >500 docs
- Upload chunked para arquivos >10MB

---

## 10. Responsividade

| Breakpoint | Comportamento |
|---|---|
| ≥980px | Layout completo, sidebar fixa, tabela 8 colunas |
| <980px | Sidebar vira off-canvas (botão hamburger), stats em 2×2, tabela esconde colunas STATUS e CATEGORIA (mover para drawer) |
| <760px | Tabela vira **cards empilhados** — cada doc é um card com thumb à esquerda + info à direita + ações no rodapé do card |
| <520px | Modal upload ocupa tela inteira, drawer também (`.drawer { width: 100vw }`) |

---

## 11. Mockup ASCII de referência

```
┌────────────────────────────────────────────────────────────────────────┐
│ 🗂  Gestão de Documentos                          [↓ Exportar] [↑ Enviar]│
│     Anexos clínicos centralizados…                                       │
├────────────────────────────────────────────────────────────────────────┤
│ ┌─📄─────┐ ┌─💾────────┐ ┌─⏳───────┐ ┌─📦──────────┐                  │
│ │  48    │ │ 127MB/2GB │ │  5       │ │  12         │                  │
│ │ Total  │ │ Armazena. │ │ Pendente │ │ Arquivados  │                  │
│ └────────┘ └───────────┘ └──────────┘ └─────────────┘                  │
├────────────────────────────────────────────────────────────────────────┤
│ ┌──────────────────────────────────────────────────────────────────────┐│
│ │ 🔍 Buscar…    [Todos·48] [PDF·28] [IMG·12]  Categoria▾ Paciente▾    ││
│ ├──────────────────────────────────────────────────────────────────────┤│
│ │ ☐  NOME              PACIENTE      CATEG.    TAM.   ENVIADO  STATUS ││
│ ├──────────────────────────────────────────────────────────────────────┤│
│ │ ☐ [📕] Receita…pdf   👤 Ana S.    Receita   1.2MB  21/05  ✓Compart ││
│ │ ☐ [📘] Anamnese…doc  👤 João P.   Relatório 480KB  20/05  🔒Privado ││
│ │ ☐ [📷] Exame_lab.jpg 👤 Maria T.  Exame     2.4MB  19/05  ⏳Pendente││
│ │ ☐ [📕] Termo_cons…   👤 Ana S.    Termo     320KB  15/05  ✓Assinado ││
│ │ …                                                                    ││
│ ├──────────────────────────────────────────────────────────────────────┤│
│ │ Mostrando 1–20 de 48 · 127MB           [‹] 1 2 3 [›]   20/pág ▾     ││
│ └──────────────────────────────────────────────────────────────────────┘│
│                                                                          │
│ ⌘K Busca · U Enviar · / Buscar · J/K Navegar · Esc Fechar               │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 12. Dependências externas

| Lib | Versão | Para quê |
|---|---|---|
| `jszip` | 3.10.1 | Gerar ZIP no "Exportar tudo" e bulk download |
| `qrcode.js` | 1.5+ | Gerar QR code no modal de compartilhamento |
| PDF.js (opcional) | 4.0+ | Preview interno de PDFs sem depender do viewer nativo |

> Já temos `jszip` carregado no head do arquivo.

---

## 13. Modelo de dados sugerido (TypeScript)

```ts
type Document = {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;             // 'application/pdf', 'image/jpeg', etc
  size: number;                  // bytes
  category: 'receita' | 'atestado' | 'exame' | 'foto' | 'contrato' | 'termo' | 'relatorio' | 'outros';
  patientIds: string[];          // suporta múltiplos pacientes (raro mas existe)
  uploadedAt: string;            // ISO 8601
  uploadedBy: string;            // user id (geralmente o profissional)
  status: 'private' | 'shared' | 'pending_signature' | 'signed' | 'expired';
  tags: string[];
  notes?: string;                // markdown
  shareUrl?: string;             // URL única se shared
  shareExpiresAt?: string;
  archived: boolean;
  archivedAt?: string;
  versions: Array<{
    id: string;
    uploadedAt: string;
    storageRef: string;
  }>;
  storageRef: string;            // referência no S3/disco
  viewCount: number;
  lastViewedAt?: string;
  signatureRequest?: {
    requestedAt: string;
    signedAt?: string;
    method: 'gov.br' | 'manual';
  };
};
```

---

## 14. Endpoints sugeridos

| Método | Rota | Comportamento |
|---|---|---|
| GET | `/api/documents` | Lista paginada com filtros via query params |
| GET | `/api/documents/:id` | Detalhe + signed URL para preview |
| POST | `/api/documents` (multipart) | Upload (suporta chunks se >10MB) |
| PATCH | `/api/documents/:id` | Renomear, mover categoria, atualizar notas/tags |
| POST | `/api/documents/:id/share` | Gera link público temporário + QR |
| DELETE | `/api/documents/:id/share` | Revoga link |
| POST | `/api/documents/:id/archive` | Marca como arquivado |
| POST | `/api/documents/:id/restore` | Restaura de arquivados |
| DELETE | `/api/documents/:id` | Soft delete (status='deleted') |
| POST | `/api/documents/bulk/download` | Retorna ZIP com IDs específicos |
| GET | `/api/documents/storage` | Quota, uso, projeção |
| POST | `/api/documents/:id/versions` | Substitui mantendo histórico |
| GET | `/api/patients/search?q=...` | Autocomplete de pacientes (modal upload) |

---

## 15. Princípios que guiaram o design

1. **Densidade alta** — psicólogos lidam com 100-500 docs/ano. A tabela precisa caber muito sem rolar.
2. **Sem perder o paciente do contexto** — toda linha mostra o paciente; um clique leva ao perfil dele.
3. **Drawer > página separada** — preview no drawer mantém o usuário na lista.
4. **Bulk não é exceção** — psicólogos exportam muito (auditoria, mudança de sistema). Bulk-bar é first-class.
5. **Cor por tipo, não por status** — o status é informação secundária; o tipo (PDF vs IMG) é o que o cérebro reconhece primeiro.
6. **Atalhos pra tudo** — usuários power se beneficiam de ⌘K, J/K navigation, U pra upload.
7. **Conformidade LGPD/CFP integrada** — não é opcional: arquivamento, retenção e log de acesso são parte do core.
