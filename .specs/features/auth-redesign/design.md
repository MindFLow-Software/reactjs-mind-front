# Design — Auth Pages Redesign (F10)

---

## Component Architecture

```
AuthLayout (overhaul)
└── div.dark  ← forces dark CSS variables
    ├── AuthLeftPanel (new, React.memo)   [hidden on <md]
    │   ├── BrandLogo (logo.svg + "MindFlush" text)
    │   ├── SignInPanelContent  ← when path = /sign-in
    │   │   ├── Headline: "Bem-vindo de volta"
    │   │   └── QuoteBlock (tagline + attribution)
    │   └── SignUpPanelContent  ← when path = /sign-up
    │       ├── Headline: "Comece em 3 passos"
    │       └── StepCards (3 translucent cards)
    └── div.form-panel
        └── <Outlet />  ← sign-in / sign-up page

SignIn
├── useAuthRedirect()  ← extracted hook
│   └── BrandedLoader  ← while checking auth
└── SignInForm (React.memo)
    ├── email field (motion.div stagger 0)
    ├── password field (motion.div stagger 1)
    ├── submit + google buttons (motion.div stagger 2)
    └── sign-up link (motion.div stagger 3)

SignUp
└── SignUpForm (refactored)
    ├── Google button
    ├── Section: "Dados Pessoais"  ← firstName, lastName, CPF, phone, DOB, gender
    ├── <Separator />
    ├── Section: "Acesso"          ← email, password (+ strength checker)
    └── submit button
```

---

## New Files

| File | Purpose |
|---|---|
| `src/hooks/use-auth-redirect.ts` | Encapsulates auth-check API call + localStorage + redirect logic |
| `src/pages/auth/components/auth-left-panel.tsx` | Brand left panel, route-aware, React.memo |

---

## Modified Files

| File | Change type |
|---|---|
| `src/pages/_layouts/auth.tsx` | Complete rewrite — dark split grid, AuthLeftPanel, responsive |
| `src/pages/auth/sign-in.tsx` | Use `useAuthRedirect`, branded loader, no standalone layout |
| `src/pages/auth/sign-up.tsx` | Remove standalone layout wrapper (form lives in right panel via Outlet) |
| `src/pages/auth/components/sign-in-form.tsx` | Remove "use client", Framer Motion, dark styling, green CTA |
| `src/pages/auth/components/sign-up-form.tsx` | Remove "use client", fix hooks-in-render, dark styling, green CTA, section grouping |

---

## Visual Design Tokens (Auth-specific)

These are inline Tailwind values (not CSS variables) since they only apply to auth pages:

| Token | Value | Usage |
|---|---|---|
| Left panel gradient | `from-[#06111f] via-[#091b35] to-[#0c2347]` | `bg-gradient-to-br` — dark navy azul |
| Right panel bg | `bg-[#0b0b0b]` | Right panel wrapper |
| Input bg | `bg-[#141414]` | All inputs in auth forms |
| Input border | `border-[#2a2a2a]` | Input default border |
| Input border focus | `focus-visible:ring-blue-500` | Focus ring — azul padrão MindFlush |
| CTA button | `bg-blue-600 hover:bg-blue-700` | Primary submit — mesma cor do restante do app |
| Brand accent | `text-blue-400` | Links, ícones, step numbers, strength check |
| Brand hover | `text-blue-300` | Link hover states |
| Step number badge | `bg-blue-500/25 text-blue-300` | Círculo de número nos steps |
| Step card bg | `bg-white/10 backdrop-blur-sm` | Step indicator cards on left panel |
| Text primary | `text-white` | Headings |
| Text secondary | `text-white/60` | Descriptions |
| Note | **Não usar** `#4f35e1`, `#9282fa`, `#bdb4fa` | Esses tokens existem no CSS mas não são usados em nenhuma página do app |

---

## AuthLeftPanel — Sign-in Variant

```
┌─────────────────────────────────┐
│  [logo]  MindFlush              │  ← top-left, text-white
│                                 │
│                                 │
│   Bem-vindo de volta            │  ← text-3xl font-bold text-white
│   Acesse seu painel e           │  ← text-sm text-white/70
│   acompanhe seus pacientes.     │
│                                 │
│  ┌─────────────────────────┐    │
│  │ "A saúde mental é o     │    │  ← quote card, bg-white/10 rounded-xl p-4
│  │  alicerce de tudo."     │    │
│  │  — Psicóloga MindFlush  │    │
│  └─────────────────────────┘    │
│                                 │
│  © MindFlush 2026               │  ← bottom, text-xs text-white/40
└─────────────────────────────────┘
```

---

## AuthLeftPanel — Sign-up Variant

```
┌─────────────────────────────────┐
│  [logo]  MindFlush              │
│                                 │
│   Comece em 3 passos            │  ← text-3xl font-bold text-white
│   Cadastre-se e transforme      │  ← text-sm text-white/70
│   sua prática clínica.          │
│                                 │
│  ┌───┐  Crie sua conta          │  ← Step 1: bg-white/10 rounded-xl
│  │ 1 │  Preencha seus dados     │
│  └───┘                          │
│  ┌───┐  Configure seu espaço    │  ← Step 2
│  │ 2 │  Personalize a agenda    │
│  └───┘                          │
│  ┌───┐  Comece a atender        │  ← Step 3
│  │ 3 │  Seus pacientes esperam  │
│  └───┘                          │
│                                 │
│  © MindFlush 2026               │
└─────────────────────────────────┘
```

---

## useAuthRedirect Hook

```ts
// src/hooks/use-auth-redirect.ts
// Returns: { isChecking: boolean }
// Side effect: if authenticated → navigate to /dashboard or /admin-dashboard
// If not → sets isChecking = false, caller renders form

export function useAuthRedirect(): { isChecking: boolean }
```

Logic is identical to current `sign-in.tsx` `useEffect` — just extracted.

---

## Framer Motion Animation Pattern

```tsx
// Per-group stagger using variants
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04 } }
}
const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' } }
}

// Wrap form in:
<motion.div variants={containerVariants} initial="hidden" animate="visible">
  <motion.div variants={itemVariants}>/* email field */</motion.div>
  <motion.div variants={itemVariants}>/* password field */</motion.div>
  <motion.div variants={itemVariants}>/* buttons */</motion.div>
</motion.div>

// Gate:
const shouldAnimate = !useReducedMotion()
// Pass initial/animate only when shouldAnimate is true
```

---

## Responsive Behavior

| Breakpoint | Layout |
|---|---|
| `< md` (< 768px) | Single column — left panel hidden (`hidden md:flex`), right panel full width |
| `md–lg` | 40/60 split |
| `lg+` | 45/55 split |

The `<Outlet />` form content scrolls if needed (sign-up form is long).

---

## Sign-up Form — dateOfBirth Refactor

**Problem:** `useState` and `useEffect` are called inside a Controller render prop — this violates Rules of Hooks when the render prop is called conditionally or by Radix internals.

**Fix:** Extract the date input state to `SignUpForm` component scope:

```tsx
// In SignUpForm (component scope, not inside render prop):
const [dobInputValue, setDobInputValue] = useState("")

// In Controller render:
render={({ field }) => (
  // use dobInputValue / setDobInputValue from closure
  // field.value changes sync dobInputValue via useEffect at COMPONENT level
)}
```

`useEffect` watching `field.value` is also lifted to `SignUpForm` scope.
