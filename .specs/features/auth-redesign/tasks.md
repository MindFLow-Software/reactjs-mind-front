# Tasks — Auth Pages Redesign (F10)

**Status legend:** `[ ]` todo · `[>]` in progress · `[x]` done · `[!]` blocked

---

## T1 — Extract `useAuthRedirect` hook

**What:** Move a auth-check `useEffect` de `sign-in.tsx` para `src/hooks/use-auth-redirect.ts`.  
**Where:** `src/hooks/use-auth-redirect.ts` (new file)  
**Depends on:** —  
**Done when:**
- Hook exportado como `useAuthRedirect(): { isChecking: boolean }`
- Chama `api.get('/psychologist/me')`, seta localStorage em sucesso, navega por role
- Retorna `{ isChecking: false }` em 401/erro

Status: [x]

---

## T2 — Create `AuthLeftPanel` component

**What:** Novo componente com variantes sign-in / sign-up via `useLocation`.  
**Where:** `src/pages/auth/components/auth-left-panel.tsx` (new file)  
**Depends on:** —  
**Done when:**
- Gradiente púrpura escuro (`from-[#0c0a1a] via-[#120d28] to-[#1a1040]`)
- Logo BrainIcon em `text-[#9282fa]` + "MindFlush" em branco
- `/sign-in`: headline + quote + stats
- `/sign-up`: headline + 3 step-indicator cards (números em `#9282fa`)
- `aria-hidden="true"`, `React.memo`

Status: [x]

---

## T3 — Overhaul `AuthLayout`

**What:** Substituir o layout simples pelo dark split-panel.  
**Where:** `src/pages/_layouts/auth.tsx`  
**Depends on:** T2  
**Done when:**
- Root tem `className="dark"` (força CSS variables dark)
- Grid `grid-cols-1 md:grid-cols-[45%_55%] min-h-screen`
- Esquerda: `<AuthLeftPanel />` (hidden em mobile)
- Direita: `bg-[#0b0b0b]` + `<Outlet />`

Status: [x]

---

## T4 — Redesign `sign-in.tsx`

**What:** Usar `useAuthRedirect`, loader branded púrpura.  
**Where:** `src/pages/auth/sign-in.tsx`  
**Depends on:** T1, T3  
**Done when:**
- `useEffect` + `useState` substituídos por `useAuthRedirect()`
- Loader usa `BrainIcon text-[#9282fa]` + spinner `border-[#4f35e1]`
- Sem wrapper de centering próprio (vem do AuthLayout)

Status: [x]

---

## T5 — Redesign `SignInForm` (dark theme + animations + brand colors)

**What:** Visual overhaul + Framer Motion + cores MindFlush corretas.  
**Where:** `src/pages/auth/components/sign-in-form.tsx`  
**Depends on:** T3  
**Done when:**
- `"use client"` removido
- Inputs: `bg-[#141414] border-[#2a2a2a] focus-visible:ring-[#4f35e1]`
- Submit: `bg-[#4f35e1] hover:bg-[#3d27c4]`
- Links brand: `text-[#9282fa] hover:text-[#bdb4fa]`
- Framer Motion stagger com `useReducedMotion()`
- `React.memo`

Status: [x]

---

## T6 — Redesign `sign-up.tsx`

**What:** Remover wrapper próprio de centering.  
**Where:** `src/pages/auth/sign-up.tsx`  
**Depends on:** T3  
**Done when:**
- Sem `div.flex.min-h-svh.justify-center`
- Sem botão absoluto "Fazer Login" (movido para dentro do SignUpForm)
- Headline `text-white`, subtítulo `text-white/50`

Status: [x]

---

## T7 — Refactor + redesign `SignUpForm` (hooks fix + dark theme + brand colors)

**What:** Corrigir bug de Rules of Hooks, dark styling, cores MindFlush.  
**Where:** `src/pages/auth/components/sign-up-form.tsx`  
**Depends on:** T3  
**Done when:**
- `"use client"` removido
- `dobInputValue` state + `useEffect` levantados para escopo do componente (fora do render prop)
- Seções: "Dados Pessoais" → `<Separator bg-[#2a2a2a]>` → "Acesso"
- Todos inputs: `bg-[#141414] border-[#2a2a2a] focus-visible:ring-[#4f35e1]`
- Submit: `bg-[#4f35e1] hover:bg-[#3d27c4]`
- Password strength: ícones em `text-[#9282fa]`
- Link "Fazer login": `text-[#9282fa] hover:text-[#bdb4fa]`

Status: [x]

---

## T8 — Verify full auth flow

**What:** Verificação manual completa do fluxo de autenticação.  
**Where:** Todas as páginas de auth  
**Depends on:** T1–T7  
**Done when:**
- [ ] `/sign-in`: dark split panel renderiza corretamente (desktop e mobile)
- [ ] `/sign-in`: usuário não autenticado vê o formulário
- [ ] `/sign-in`: usuário autenticado redireciona para `/dashboard`
- [ ] `/sign-in`: erros de validação aparecem em vermelho
- [ ] `/sign-in`: botão Google OAuth funciona
- [ ] `/sign-in`: animações Framer Motion executam no mount
- [ ] `/sign-up`: painel esquerdo com 3 steps visível no desktop
- [ ] `/sign-up`: todos os campos validam (CPF, data, força da senha)
- [ ] `/sign-up`: submit bem-sucedido redireciona para `/sign-in`
- [ ] `/sign-up`: botão Google OAuth funciona
- [ ] Mobile < 768px: painel esquerdo oculto, formulário preenche a tela
- [ ] `npx tsc --noEmit` passa com 0 erros

**Gate:** Todos os checkboxes acima marcados

Status: [ ]

---

## Dependency Graph

```
T1 (hook)       ──┐
T2 (panel)      ──┤
                  ├── T3 (layout) ──┬── T4 (sign-in page)
                                    ├── T5 (sign-in form)
                                    ├── T6 (sign-up page)
                                    └── T7 (sign-up form)
                                             │
                                         T8 (verify)
```
