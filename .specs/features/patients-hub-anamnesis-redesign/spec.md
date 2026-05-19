# Anamnese — Redesign do Editor

## Problem Statement

O editor de anamnese atual usa um layout vertical simples (toolbar + blocos empilhados + navegação horizontal). O design de referência propõe um layout sidebar + editor com visual mais profissional: painel lateral de seções com word count por bloco, blocos numerados com heading estilizado, resize automático do textarea (mas sem resize handle manual), e status de salvamento por bloco e na toolbar.

## Goals

- [ ] Layout sidebar (seções) + área principal (editor)
- [ ] Sidebar mostra nome de cada seção, word count e barra de progresso (N/7 preenchidos)
- [ ] Cada bloco exibe número, título como heading editável, textarea auto-grow sem resize manual, word count + status "Salvo automaticamente" abaixo
- [ ] Toolbar ganha Citação e Comentário; save status "● Salvo · há instantes" à direita
- [ ] `pnpm build` passa sem erros

## Out of Scope

| Feature | Reason |
|---|---|
| Modo "expand" do bloco (ícone ↗) | Funcionalidade futura |
| Formatação de Citação/Comentário com Markdown real | Os markers existentes são suficientes por enquanto |
| Mudança na lógica de auto-save | Só UI, lógica permanece igual |

---

## User Stories

### P1: Sidebar de seções com word count ⭐ MVP

**User Story**: Como psicólogo, quero ver no painel lateral a lista de seções com quantas palavras cada uma tem, e um indicador de progresso de preenchimento, para saber de relance o que ainda falta preencher.

**Acceptance Criteria**:
1. WHEN a aba Anamnese abre THEN a sidebar SHALL listar todas as seções com nome e word count
2. WHEN uma seção tem 0 palavras THEN seu word count SHALL exibir `0`
3. WHEN clico numa seção na sidebar THEN o editor SHALL rolar e focar naquele bloco
4. WHEN a seção ativa muda THEN a sidebar SHALL destacar a seção com borda esquerda colorida
5. WHEN N seções têm conteúdo THEN SHALL exibir "Preenchido N/total" com barra de progresso

### P1: Blocos numerados com heading e auto-grow ⭐ MVP

**User Story**: Como psicólogo, quero que cada bloco mostre seu número, título em estilo heading, e que o textarea cresça sozinho ao escrever — sem handle de resize manual.

**Acceptance Criteria**:
1. WHEN renderiza um bloco THEN SHALL exibir o número (1, 2, 3...) à esquerda do título
2. WHEN o título é renderizado THEN SHALL parecer um heading (sem borda de input visível por padrão)
3. WHEN escrevo no textarea THEN ele SHALL crescer automaticamente para acomodar o texto
4. WHEN o textarea é renderizado THEN NÃO SHALL ter resize handle (cursor de resize não aparece)
5. WHEN o bloco tem conteúdo THEN SHALL exibir "✓ Salvo automaticamente · N palavras" abaixo

### P1: Toolbar com save status ⭐ MVP

**User Story**: Como psicólogo, quero ver o status de salvamento na toolbar ("● Salvo · há instantes") e ter botões de Citação e Comentário.

**Acceptance Criteria**:
1. WHEN o conteúdo está sincronizado THEN a toolbar SHALL exibir "● Salvo · há instantes" à direita
2. WHEN está sincronizando THEN SHALL exibir "● Sincronizando..."
3. WHEN há rascunho local THEN SHALL exibir "● Rascunho local"
4. WHEN clico Citação THEN SHALL aplicar marker `>` no texto selecionado
5. WHEN clico Comentário THEN SHALL aplicar marker `//` no texto selecionado

---

## Requirement Traceability

| ID | Story | Status |
|---|---|---|
| ANA-01 | P1: Sidebar vertical com word count por seção | Pending |
| ANA-02 | P1: Barra de progresso "Preenchido N/total" | Pending |
| ANA-03 | P1: Highlight da seção ativa na sidebar | Pending |
| ANA-04 | P1: Bloco numerado com título heading estilizado | Pending |
| ANA-05 | P1: Textarea auto-grow sem resize handle | Pending |
| ANA-06 | P1: Word count + "Salvo automaticamente" por bloco | Pending |
| ANA-07 | P1: Save status na toolbar | Pending |
| ANA-08 | P1: Botões Citação e Comentário na toolbar | Pending |

## Success Criteria

- [ ] Sidebar exibe word counts reais por seção
- [ ] Barra de progresso correta
- [ ] Textarea cresce mas não tem handle manual
- [ ] Save status visível na toolbar
- [ ] `pnpm build` limpo
