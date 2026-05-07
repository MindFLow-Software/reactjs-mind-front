# Spec — Auth Pages Redesign (F10)

**Feature ID:** F10  
**Milestone:** M2  
**Complexity:** Large  
**Scope:** Layout + UI/UX overhaul of sign-in and sign-up pages (psychologist flow)

---

## Context

The current auth layout is a plain two-column grid with a muted background on the left and the form on the right. It has no visual identity, no brand storytelling, and no animations. The forms work correctly but:
- Carry `"use client"` directives that do nothing in Vite/React Router (Next.js artefact)
- SignUpForm embeds `useState`/`useEffect` inside a Controller render callback (sign-up-form.tsx:335–343) — illegal by Rules of Hooks, causes bugs in React Strict Mode
- Auth check in `sign-in.tsx` is inline `useEffect` state machine — hard to test/reuse
- No Framer Motion (already installed) entrance animations
- Light theme, low visual impact, no dark split panel

**Reference design:** screenshot (sign-up dark teal split panel) + abacatepay.com/login (premium dark feel).

---

## Requirements

### Layout

| ID | Requirement |
|---|---|
| R1 | `AuthLayout` renders a full-screen split panel: left 45% (brand), right 55% (form). Collapses to single-column (form only, left hidden) on viewport < `md` (768 px). |
| R2 | `AuthLayout` outer root wraps content with `className="dark"` so auth pages always render in dark mode regardless of user `ThemeProvider` setting. |
| R3 | Left panel has a dark green radial-to-linear gradient: center `#0d5c40` → edges `#071e17`. |
| R4 | Right panel background is `#0b0b0b` (near-black), form is centered, max-width 420 px. |
| R5 | Left panel content is route-aware: `/sign-in` shows brand tagline + inspirational quote; `/sign-up` shows "Comece em 3 passos" step-indicator cards. AuthLayout reads `useLocation()` to switch. |
| R6 | Left panel is `aria-hidden="true"` for screen readers (purely decorative context). |

### Sign-in page

| ID | Requirement |
|---|---|
| R7 | Auth-check logic (API call + localStorage + redirect) is extracted to `src/hooks/use-auth-redirect.ts`. |
| R8 | Loading state while auth-check runs renders a full-screen dark branded spinner (logo + `animate-spin` ring), not a plain blue spinner. |
| R9 | `SignInForm` is wrapped in `React.memo`. |
| R10 | `"use client"` directive removed from `sign-in-form.tsx`. |
| R11 | Inputs in `SignInForm` are styled for the dark panel (bg `#141414`, border `#2a2a2a`, focus ring brand-green). |
| R12 | Primary submit button uses dark-green accent (`bg-[#0d5c40] hover:bg-[#0a4a32]`) instead of `bg-blue-600`. |

### Sign-up page

| ID | Requirement |
|---|---|
| R13 | `"use client"` directive removed from `sign-up-form.tsx`. |
| R14 | `useState` / `useEffect` calls inside the `dateOfBirth` Controller render prop (sign-up-form.tsx:335–343) are refactored out: state lifted to the parent component (`SignUpForm`), render prop only handles display logic. |
| R15 | `SignUpForm` fields visually grouped into two logical sections with a subtle `<Separator />` between them: (1) Dados Pessoais — nome, CPF, telefone, gênero, data de nascimento; (2) Acesso — e-mail, senha. Single submit, no step navigation. |
| R16 | `SignUpForm` primary submit button uses same green accent as sign-in (R12). |
| R17 | SignUpForm styled for dark panel same as sign-in. |

### Animations

| ID | Requirement |
|---|---|
| R18 | `SignInForm` form fields animate in on mount using Framer Motion `motion.div` with `initial={{ opacity: 0, y: 10 }}` → `animate={{ opacity: 1, y: 0 }}`, stagger 40 ms per group. |
| R19 | Animations are skipped when `useReducedMotion()` returns true. |
| R20 | Only the right-panel form content animates. Left panel is static. |

### Performance

| ID | Requirement |
|---|---|
| R21 | No `"use client"` directives anywhere in auth pages or their components (Next.js artefacts, dead code in Vite). |
| R22 | `useEffect` inside Controller render prop (R14) is fixed — no hooks inside render callbacks. |
| R23 | `AuthLeftPanel` is wrapped in `React.memo` (static content, no need to re-render). |

### Accessibility

| ID | Requirement |
|---|---|
| R24 | All inputs retain `id`, `autoComplete`, `aria-invalid` attributes. |
| R25 | Password toggle button retains `aria-label`. |
| R26 | Focus rings are visible in dark theme (use `focus-visible:ring-[#0d5c40]` brand green). |

---

## Out of scope

- Multi-step form wizard with navigation (deferred)
- Forgot-password page redesign
- Patient sign-up form (`patient-sign-up-form.tsx`)
- `complete-registration.tsx` page
- Google OAuth success/complete pages
