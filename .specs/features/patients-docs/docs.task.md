# Task — Construir página Gestão de Documentos

> Arquivo alvo: `MindFlush Documentos.html`  
> Spec de referência: `docs/Documentos.spec.md`  
> Padrão visual: módulo de Pacientes (`MindFlush Pacientes.html`)  
> Estimativa total: **16-22h** (1 desenvolvedor sênior front-end)

---

## 🎯 Objetivo

Construir a página completa de **Gestão de Documentos** seguindo o padrão visual e de interação do MindFlush. A página é o hub central para uploads, visualização, organização e compartilhamento de anexos clínicos.

---

## ✅ Checklist por fase

### Fase 1 — Setup e chrome (≈1h)

- [ ] Copiar tokens de `:root` exatamente do arquivo `MindFlush Pacientes.html`
- [ ] Reusar sidebar com item `Documentos` marcado como `.active` e badge `48`
- [ ] Topbar com crumbs `Área clínica / Documentos`
- [ ] Busca global ⌘K (mesma implementação de outras páginas)
- [ ] Botão notificações com dot
- [ ] Botão "Enviar documento" (primary, ícone upload)
- [ ] Page-head com icon-box azul, título, subtítulo
- [ ] 2 botões: "Exportar tudo" (secondary), "Enviar documento" (primary)

### Fase 2 — Stats strip (≈30min)

- [ ] Grid 4 colunas `.stats`
- [ ] 4 cards (`Total`, `Armazenamento`, `Pendentes`, `Arquivados`)
- [ ] Cada card tem ícone, valor grande Inter Tight 22px, label
- [ ] Variantes de cor (default/green/warn/muted)
- [ ] Hover lift + sombra
- [ ] Click aplica filtro e sincroniza com query string
- [ ] Estado `.active` quando filtro está aplicado

### Fase 3 — Filtros (≈1.5h)

- [ ] Container `.filters` dentro do `.card`
- [ ] **Campo de busca** com:
  - Lupa à esquerda
  - Botão clear quando preenchido (`.clear`)
  - Debounce 220ms
  - Highlight em `<mark>` nas correspondências
- [ ] **Chips de tipo** (.chip-filter): Todos · PDF · Imagens · DOC
- [ ] Cada chip mostra `count` em pill
- [ ] **Dropdowns**: Categoria, Paciente (com autocomplete), Período (date range)
- [ ] Spacer para empurrar direita
- [ ] **Ordenação** (dropdown): Mais recentes / Maior tamanho / A-Z
- [ ] **Toggle Tabela/Grid** (botões com ícones)
- [ ] **Filtros avançados** (botão que abre painel ou drawer extra)
- [ ] Sincronizar tudo com URL params (`?type=pdf&patient=123&from=...`)

### Fase 4 — Bulk bar (≈45min)

- [ ] `.bulk` fica oculta por padrão; aparece quando ≥1 linha selecionada
- [ ] Animação de slide-down
- [ ] Mostra contagem "N documentos selecionados"
- [ ] 5 botões: Baixar (.zip) · Compartilhar · Arquivar · Adicionar tag · Excluir (`.danger`)
- [ ] Botão "Limpar seleção" à direita
- [ ] Click em Excluir → confirmação modal antes
- [ ] Bulk download chama `/api/documents/bulk/download` e baixa ZIP

### Fase 5 — Tabela (≈3h)

- [ ] `<table>` semântico
- [ ] Header sticky com background `--slate-50`
- [ ] 8 colunas (ver spec §4.7)
- [ ] Colunas ordenáveis com `.sortable` + ícone `▴/▾`
- [ ] Checkbox personalizado (`.ck`) com estado indeterminate
- [ ] Header tem checkbox "selecionar todos da página"
- [ ] **Linhas**:
  - Hover row: bg `--blue-50` inteiro
  - Selected: bg + box-shadow inset 3px primary na 1ª td
  - Click → abre drawer com preview
  - Click no avatar paciente → vai pro perfil (event.stopPropagation)
- [ ] **Célula NOME**:
  - Thumb 36×44 com gradient por tipo + dobra de página
  - Nome em peso 600 truncado
  - Sub-meta com tamanho/tipo
- [ ] **Célula PACIENTE**:
  - Avatar 34×34 com iniciais
  - Nome + sub-meta
  - Indicador online se aplicável
- [ ] **Badges de categoria** com 7 cores (Receita/Atestado/Exame/Foto/Contrato/Relatório/Termo)
- [ ] **Badges de status** com 5 estados
- [ ] **Ações inline** (`.row-actions`):
  - 👁️ Ver (primary)
  - 📥 Baixar
  - ⋯ Menu dropdown (`.row-menu` com 7 opções)
- [ ] Tooltips via `data-tip="..."`
- [ ] Click duplo no nome → edição inline (renomear)

### Fase 6 — Footer e paginação (≈30min)

- [ ] `.table-foot` com info à esquerda ("Mostrando X–Y de Z · NMB")
- [ ] `.pagi` com prev/next/páginas específicas
- [ ] Selector de tamanho de página (10/20/50/100)
- [ ] Disabled state nos extremos
- [ ] Atalhos: setas L/R para paginar quando focado

### Fase 7 — Drawer de preview (≈2.5h)

- [ ] `.drawer-back` semitransparente + `.drawer` slide-in
- [ ] Animação 280ms cubic-bezier
- [ ] **Head**: thumb grande, nome do arquivo, tamanho, botão fechar
- [ ] **Body**:
  - **Preview**:
    - PDF → `<iframe>` com viewer nativo (toolbar customizável)
    - Imagem → `<img>` com zoom on hover (ou modal lightbox no click)
    - Outros → ícone grande + botão "Abrir externamente"
  - **Info grid** 2 colunas (Paciente, Categoria, Tamanho, Tipo, Enviado em, Por, Última view, Total de views)
  - **Tags** chips editáveis (clicar para adicionar)
  - **Notas internas** com markdown editor (`.md-editor`)
  - **Timeline** de ações (timeline-item)
- [ ] **Foot**: Compartilhar + Baixar + Excluir (danger)
- [ ] Esc fecha drawer
- [ ] Backdrop click fecha
- [ ] Focus trap dentro do drawer
- [ ] Setas ↑↓ navegam para doc anterior/próximo da lista

### Fase 8 — Modal Enviar Documento (≈3h)

- [ ] `.ud-back > .ud` com animação `pdIn`
- [ ] **Head**: ícone + título + sub + botão fechar
- [ ] **Zona de drop** (`.ud-zone`):
  - Drag-enter: estilo `.drag`
  - Click → abre file picker
  - Aceitar múltiplos arquivos
- [ ] **Lista de arquivos** (`.ud-files`):
  - Renderizar `.ud-file` por arquivo
  - Thumb por tipo (pdf/img/doc/xls)
  - Nome + tamanho
  - Barra de progresso real (`xhr.upload.onprogress`)
  - Estado done: ✓ verde, esconde 🗑
  - Estado erro: ✗ vermelho, link "Tentar novamente"
  - Botão "Limpar tudo" no header da lista
- [ ] **Combo de Paciente** (`.ud-combo`):
  - Input com autocomplete
  - Lista flutuante (`.ud-combo-list`)
  - Itens com avatar + nome
  - Navegação ↑↓ + Enter
  - Selecionado vira chip (`.ud-pat-chip`) com botão remover
  - Suporta múltiplos pacientes
- [ ] **Pills de Categoria** (`.ud-pills`):
  - 6-7 opções radio
  - Aceita 1 valor por upload (ou aplicar por arquivo se quiser sofisticar)
- [ ] **Pills de Visibilidade**: Privado / Compartilhar com paciente
- [ ] **Notas** (textarea opcional)
- [ ] **Foot**:
  - Esquerda: "🔒 Criptografado em trânsito"
  - Direita: Cancelar + "Enviar (N arquivos)" primary
- [ ] **Drag global**: arrastar de fora da janela abre overlay e popula a lista
- [ ] Upload paralelo (3 simultâneos)
- [ ] Toast de sucesso ao terminar

### Fase 9 — Modal Compartilhar via QR (≈2h)

- [ ] `.qr-back > .qr` modal 440px
- [ ] **Head**: ícone + título + sub + botão fechar
- [ ] **QR card** com:
  - Frame decorativo com cantos azuis (`::before`/`::after` + `.qr-corner-*`)
  - QR 200×200 gerado dinamicamente (lib `qrcode.js`)
  - Overlay logo M centralizado (42×42)
  - Instruções
  - Link copiável (input readonly + botão Copiar com estado `.ok`)
  - Atalhos `.qr-share` grid 4 cols (WhatsApp/Email/Telegram/Mais)
  - Meta com "Expira em 7 dias" + botão "Regenerar" (com animação rotate)
- [ ] Click no Copiar → `navigator.clipboard.writeText()` + estado ok 2s
- [ ] Click no Regenerar → chama endpoint, gera novo QR com animação
- [ ] Cada botão de share abre URL específica:
  - WhatsApp: `https://wa.me/?text=...`
  - Email: `mailto:?subject=...&body=...`
  - Telegram: `https://t.me/share/url?url=...`

### Fase 10 — Cmd palette (≈1h)

- [ ] `.cmd-back > .cmd` abre com ⌘K (Cmd+K) ou Ctrl+K
- [ ] Input grande com lupa
- [ ] Lista filtrada de comandos
- [ ] Navegação ↑↓ + Enter
- [ ] Estado active highlight
- [ ] Comandos sugeridos:
  - "Enviar documento" (kbd: U)
  - "Filtrar por: Receitas"
  - "Filtrar por: Exames"
  - "Ir para Pacientes" (kbd: G P)
  - "Buscar paciente: <input>"
- [ ] Empty state: "Nenhum resultado"
- [ ] Esc fecha

### Fase 11 — Atalhos de teclado (≈45min)

- [ ] `⌘K` / `Ctrl+K` → cmd palette
- [ ] `/` → focar busca da tabela
- [ ] `U` → abrir upload modal
- [ ] `Esc` → fechar topo da pilha (drawer > modal > palette)
- [ ] `J/K` → navegar linhas (k=up, j=down — vim style)
- [ ] `Enter` na linha focada → abre drawer
- [ ] `X` na linha focada → marca checkbox
- [ ] `Shift+J/K` → estende seleção
- [ ] `⌘A` → selecionar todos da página
- [ ] Help bar (`.helpbar`) no fim mostrando atalhos

### Fase 12 — Responsividade (≈1.5h)

- [ ] **≥980px**: layout completo
- [ ] **<980px**:
  - Sidebar vira off-canvas (botão hamburger)
  - Stats 2×2
  - Tabela esconde colunas STATUS e CATEGORIA
- [ ] **<760px**:
  - Tabela vira **cards empilhados** (cada doc é um card)
  - Thumb à esquerda, info à direita, ações no rodapé
- [ ] **<520px**:
  - Modal upload ocupa tela inteira
  - Drawer ocupa 100vw

### Fase 13 — Acessibilidade (≈1h)

- [ ] `<table>` semântico com `<th scope="col">` e `<caption>` sr-only
- [ ] Linhas focáveis (tabindex 0), Enter abre drawer
- [ ] Setas navegam linhas
- [ ] Checkboxes com `aria-checked` e suporte a indeterminate
- [ ] Drawer/modais com `role="dialog" aria-modal="true"`
- [ ] Focus trap em drawer/modais
- [ ] Live region anuncia: "3 documentos selecionados, ações disponíveis"
- [ ] Contraste AA em todos os badges
- [ ] Skip link "Pular para a tabela"

### Fase 14 — Performance (≈1h)

- [ ] Lazy load thumbs além da viewport (IntersectionObserver)
- [ ] Virtualização se >100 linhas (tanstack-virtual ou simples por slice)
- [ ] Cache de blob URLs de previews
- [ ] Paginação server-side se >500 docs
- [ ] Upload chunked para arquivos >10MB
- [ ] Debounce em busca/filtros (220ms)

---

## 🔌 Integração com backend

Endpoints obrigatórios (ver spec §14):

```
GET    /api/documents?type=&patient=&from=&to=&q=&page=&pageSize=&sort=
GET    /api/documents/:id
POST   /api/documents (multipart, chunks suportados)
PATCH  /api/documents/:id
DELETE /api/documents/:id (soft delete)
POST   /api/documents/:id/share
DELETE /api/documents/:id/share
POST   /api/documents/:id/archive
POST   /api/documents/:id/restore
POST   /api/documents/bulk/download (retorna stream ZIP)
GET    /api/documents/storage (quota + uso)
POST   /api/documents/:id/versions (substituir mantendo histórico)
GET    /api/patients/search?q= (autocomplete)
```

**Auth**: bearer JWT em `Authorization`.  
**Auditoria**: todo endpoint deve registrar `userId + action + targetId + timestamp` no log de auditoria (LGPD/CFP).

---

## 🧪 Casos de teste manuais

### Visual
1. Sem documentos → empty state com ilustração + CTA "Enviar primeiro"
2. Com 48 docs → tabela completa, paginação ativa
3. Com 500 docs → virtualização funciona, sem jank
4. Tipos diferentes (PDF/IMG/DOC/XLS) → cores e thumbs corretos
5. Status diferentes → 5 badges visíveis
6. Modal upload sem arquivos → desabilita "Enviar"
7. Drawer com PDF → preview embedado
8. Drawer com IMG → preview com zoom
9. Drawer com DOC → fallback "Abrir externamente"

### Interação
10. Click em linha → abre drawer
11. Click no avatar do paciente → vai pro perfil (NÃO abre drawer)
12. Click no checkbox → bulk bar aparece
13. Shift+click → seleção em range
14. Cmd+A → seleciona todos
15. Drag arquivo de fora → modal upload abre populado
16. Upload com erro → "Tentar novamente" funciona
17. Renomear inline (duplo click) → salva no Enter
18. Compartilhar → QR aparece, copiar copia link
19. Excluir → confirmação obrigatória
20. ⌘K → palette abre
21. U → modal upload abre
22. J/K → navegação funciona
23. Esc fecha (drawer > modal > palette nessa ordem)

### Estados
24. Filtro por tipo PDF → mostra só PDFs, count atualiza
25. Filtro por paciente → mostra só dele
26. Busca "receita" → highlight nas correspondências
27. Ordenação por TAMANHO → maior primeiro
28. Bulk de 5 docs → ZIP baixa com nome correto

### Conformidade
29. Excluir → soft delete (volta com restore por 30 dias)
30. Doc com retenção 20 anos → não deleta fisicamente
31. Log de auditoria → cada ação registrada
32. Compartilhar gera link com expiração

### Responsivo
33. <980px → sidebar vira drawer
34. <760px → tabela vira cards
35. <520px → modais full-screen
36. iPad landscape → layout não quebra

---

## 🚫 Fora do escopo

- Editor de PDF inline (anotações, marcações) — separar em tarefa futura
- OCR de documentos (extrair texto de imagens)
- Assinatura digital integrada com Gov.br — exige integração separada
- Detecção automática de categoria por IA — futuro
- Versionamento avançado com diff visual
- Sistema de permissões granular (apenas profissional autorizado vs todos)

---

## 📝 Notas para o desenvolvedor

- **Reuse máximo** dos componentes existentes (`.card`, `.btn`, `.badge`, `.ck`, `.field-*`, `.pd-*`). Não recrie chrome.
- **Tabelas grandes**: prefira CSS `contain: layout style paint` nas linhas para isolar repaints
- **Upload**: use `XMLHttpRequest` para ter `progress` event real (fetch só dá no fim)
- **Drag global**: cuidado com `dragenter`/`dragleave` (eles disparam em filhos). Use contador.
- **QR**: gere localmente com `qrcode.js` em vez de bater na API toda vez
- **Datas**: use `Intl.RelativeTimeFormat` para "há X dias", e `Intl.DateTimeFormat` para datas
- **Thumbs**: gere server-side para PDF e DOC; para IMG use o próprio arquivo redimensionado com `srcset`
- **Cores de gradient nos thumbs**: estão hard-coded no CSS para 3 tipos — adicione `.xls` (verde) se aceitarem planilhas
- **Tags**: armazene como `string[]` no DB, com índice GIN se PostgreSQL
- **Não use `scrollIntoView`** — pode quebrar o overlay; use `scrollTop` direto
- Toast aparece no centro-inferior por 3s (já existe `.toast` no CSS)

---

## 🎨 Padrão visual a copiar

A página é **gêmea visual** de `MindFlush Pacientes.html`:
- Mesma sidebar
- Mesma topbar
- Mesmo padrão de stats
- Mesmo card container
- Mesma estrutura de filtros + tabela + footer
- Mesmo cmd palette

**A única coisa que muda é o conteúdo** (colunas, filtros, ações específicas de doc). Use o arquivo de Pacientes como referência de marcação e CSS sempre que possível — economiza 30% do tempo.
