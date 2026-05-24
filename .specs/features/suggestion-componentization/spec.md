# Suggestion Componentization Specification

## Problem Statement

`suggestion/components/` é um diretório plano com 5 arquivos sem agrupamento semântico. À medida que o módulo cresce, fica difícil localizar e manter componentes específicos. Além disso, `useDebounce` está definido inline dentro de `suggestion-page.tsx`, sendo um utilitário genérico que pertence a `src/hooks/`.

## Goals

- [ ] Organizar `suggestion/components/` em subdiretórios que refletem a responsabilidade de cada componente
- [ ] Extrair `useDebounce` de `suggestion-page.tsx` para `src/hooks/use-debounce.ts`
- [ ] Confirmar `src/validators/suggestions.ts` como local canônico para schemas Zod do domínio (já existe)
- [ ] Nenhuma mudança funcional — zero alterações de lógica

## Out of Scope

| Feature | Reason |
|---|---|
| Extrair lógica de like-toggle de `suggestion-column.tsx` para um hook | Refactor funcional — fora do escopo de reorganização estrutural |
| Modificar schemas em `src/validators/suggestions.ts` | Já está correto e canônico |
| Mover `src/env.ts` Zod usage | Validação de ambiente — padrão distinto, não é form schema |
| Adicionar novos componentes ou features | Reorganização puramente estrutural |

---

## Proposed Target Structure

```
src/pages/app/suggestion/
├── suggestion-page.tsx               ← atualizado: remove useDebounce inline, importa de hooks
└── components/
    ├── board/                        ← renderização do kanban
    │   └── suggestion-column.tsx
    ├── create/                       ← fluxo de criação de sugestão
    │   ├── create-suggestion.tsx
    │   ├── suggestion-attachments.tsx
    │   └── suggestion-success-dialog.tsx
    └── help/                         ← overlay de ajuda standalone
        └── suggestion-help-button.tsx

src/hooks/
└── use-debounce.ts                   ← extraído de suggestion-page.tsx (genérico)

src/validators/                       ← JÁ EXISTE, sem alterações
├── suggestions.ts
├── auth.ts
├── patients.ts
└── attachments.ts
```

---

## User Stories

### P1: Reorganizar components em subdiretórios semânticos ⭐ MVP

**User Story**: Como desenvolvedor mantendo o módulo de sugestões, quero componentes agrupados por responsabilidade para localizar o arquivo certo sem escanear uma lista plana.

**Why P1**: Núcleo do pedido. Tudo mais é secundário.

**Acceptance Criteria**:

1. WHEN um desenvolvedor abre `suggestion/components/` THEN verá exatamente 3 subdiretórios: `board/`, `create/`, `help/`
2. WHEN um desenvolvedor navega para `board/` THEN encontrará `suggestion-column.tsx`
3. WHEN um desenvolvedor navega para `create/` THEN encontrará os 3 arquivos do fluxo de criação (`create-suggestion.tsx`, `suggestion-attachments.tsx`, `suggestion-success-dialog.tsx`)
4. WHEN um desenvolvedor navega para `help/` THEN encontrará `suggestion-help-button.tsx`
5. WHEN a aplicação é buildada após a reorganização THEN compila sem erros TypeScript
6. WHEN a página de sugestões é aberta no browser THEN todas as funcionalidades funcionam identicamente ao antes

**Independent Test**: `pnpm build` sem erros. Abrir a página de sugestões: kanban renderiza, busca funciona, like toggling funciona, create dialog abre, help button abre.

---

### P1: Extrair `useDebounce` para `src/hooks/` ⭐ MVP

**User Story**: Como desenvolvedor, quero que `useDebounce` esteja em `src/hooks/` para que possa ser reutilizado em outros módulos sem duplicação.

**Why P1**: Hook genérico definido inline em um page component viola a convenção do projeto e impede reutilização.

**Acceptance Criteria**:

1. WHEN o arquivo `src/hooks/use-debounce.ts` é criado THEN ele exporta `useDebounce<T>(value: T, delay: number): T`
2. WHEN `suggestion-page.tsx` é aberto THEN não há definição inline de `useDebounce`
3. WHEN `suggestion-page.tsx` importa o hook THEN usa `@/hooks/use-debounce`

**Independent Test**: Grep por `function useDebounce` em `suggestion-page.tsx` — zero resultados.

---

## Import Update Map

Apenas caminhos mudam. Nenhuma lógica é alterada.

| Arquivo | Import atual | Import correto |
|---|---|---|
| `suggestion-page.tsx` | `./components/suggestion-column` | `./components/board/suggestion-column` |
| `suggestion-page.tsx` | `function useDebounce` (inline) | `@/hooks/use-debounce` |
| `create-suggestion.tsx` | `./suggestion-attachments` | `./suggestion-attachments` ✓ mesma pasta |
| `create-suggestion.tsx` | `./suggestion-success-dialog` | `./suggestion-success-dialog` ✓ mesma pasta |

---

## Edge Cases

- WHEN `useDebounce` é extraído THEN a assinatura genérica `<T>(value: T, delay: number): T` deve ser preservada exatamente
- WHEN arquivos são movidos no Windows THEN git deve ser informado do rename para evitar perda de histórico

---

## Requirement Traceability

| Requirement ID | Story | Status |
|---|---|---|
| SUGG-01 | P1: Criar `board/` e mover `suggestion-column.tsx` | Pending |
| SUGG-02 | P1: Criar `create/` e mover 3 arquivos do fluxo de criação | Pending |
| SUGG-03 | P1: Criar `help/` e mover `suggestion-help-button.tsx` | Pending |
| SUGG-04 | P1: Extrair `useDebounce` para `src/hooks/use-debounce.ts` | Pending |
| SUGG-05 | P1: Atualizar imports em `suggestion-page.tsx` | Pending |
| SUGG-06 | P1: TypeScript build passa com zero erros | Pending |

---

## Success Criteria

- [ ] `suggestion/components/` contém apenas subdiretórios (`board/`, `create/`, `help/`) — sem arquivos soltos
- [ ] `src/hooks/use-debounce.ts` existe e exporta `useDebounce`
- [ ] `suggestion-page.tsx` não define `useDebounce` inline
- [ ] `pnpm tsc --noEmit` passa com zero erros
- [ ] `src/validators/suggestions.ts` permanece inalterado
