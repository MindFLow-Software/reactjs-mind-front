# Structure — MindFlush Frontend

## Raiz do Projeto

```
c:\Projetos\MindFLush_FrontEnd\
├── src/                    # Código-fonte
├── public/                 # Assets estáticos
├── .specs/                 # Documentação do projeto (tlc-spec-driven)
├── package.json
├── vite.config.ts          # Plugins: react, tailwindcss. Alias: @/ → src/
├── tsconfig.json           # Referencia tsconfig.app.json + tsconfig.node.json
└── tsconfig.app.json       # Target ES2022, strict, moduleResolution: bundler
```

## `src/`

```
src/
├── global.css              # Tailwind 4 import + @theme inline (tokens de cor, tipografia, radius)
├── main.tsx                # Entry point
├── App.tsx                 # Providers: HelmetProvider, ThemeProvider, QueryClientProvider, RouterProvider
├── routes.tsx              # createBrowserRouter — todas as rotas com loaders e guards
├── env.ts                  # Schema Zod para variáveis de ambiente (VITE_API_URL, VITE_ENABLE_API_DELAY)
│
├── api/                    # Funções HTTP (uma por arquivo, verbo+substantivo)
│   ├── sign-in.ts
│   ├── sign-out.ts
│   ├── get-profile.ts
│   ├── update-psychologist.ts
│   ├── fetch-appointments.ts
│   ├── create-appointment.ts
│   ├── cancel-appointment.ts
│   ├── reschedule-appointment.ts
│   ├── delete-appointment.ts
│   ├── start-appointment.ts
│   ├── start-appointment-session.ts
│   ├── finish-appointment-session.ts
│   ├── update-appointment.ts
│   ├── get-scheduled-appointment.ts
│   ├── get-active-appointments-grouped.ts
│   ├── get-available-slots.ts
│   ├── appointments.ts
│   ├── get-patients-filter.ts
│   ├── get-patient-by-cpf.ts
│   ├── get-patient-by-name.ts
│   ├── get-patients-by-age.ts
│   ├── get-patients-by-gender.ts
│   ├── get-patients-with-scheduled.ts
│   ├── get-amount-patients-card.ts
│   ├── toggle-patient-status.ts
│   ├── delete-patients.ts
│   ├── get-patient-attachments.ts
│   ├── delete-attachment.ts
│   ├── fetch-dashboard-data.ts
│   ├── get-daily-sessions-metrics.ts
│   ├── get-monthly-sessions-count.ts
│   ├── livekit.ts          # Token LiveKit (não ativo no v1)
│   └── popups.ts
│
├── components/
│   ├── ui/                 # Primitivos de UI (shadcn/ui pattern)
│   │   ├── button.tsx      # CVA variants: default, destructive, outline, secondary, ghost, link
│   │   ├── input.tsx
│   │   ├── form.tsx        # Wrapper React Hook Form
│   │   ├── label.tsx
│   │   ├── select.tsx
│   │   ├── checkbox.tsx
│   │   ├── avatar.tsx
│   │   ├── badge.tsx
│   │   ├── card.tsx
│   │   ├── table.tsx
│   │   ├── sidebar.tsx     # Sistema completo (20+ componentes, Ctrl+B toggle)
│   │   ├── nav-main.tsx
│   │   ├── nav-user.tsx
│   │   ├── nav-projects.tsx
│   │   ├── team-switcher.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── alert-dialog.tsx
│   │   ├── popover.tsx
│   │   ├── sheet.tsx
│   │   ├── tooltip.tsx
│   │   ├── collapsible.tsx
│   │   ├── separator.tsx
│   │   ├── skeleton.tsx
│   │   ├── chart.tsx       # Wrapper Recharts
│   │   ├── empty.tsx       # Estado vazio
│   │   ├── field.tsx
│   │   ├── item.tsx
│   │   └── kbd.tsx
│   ├── popups/
│   │   └── achievement-toast.tsx
│   ├── theme/
│   │   ├── theme-provider.tsx
│   │   └── theme-toggle.tsx
│   ├── account-menu.tsx
│   ├── nav-link.tsx
│   ├── pagination.tsx
│   ├── pagination-details-patients.tsx
│   └── popup-renderer.tsx  # PopupManager do AppLayout
│
├── hooks/
│   ├── use-mobile.ts             # useIsMobile() — breakpoint 768px
│   ├── use-api-mutation.ts       # (vazio — não implementado)
│   ├── use-psychologist-profile.ts
│   ├── use-patient-filters.ts    # Filtros via URL (useSearchParams + Zod)
│   ├── use-appointment-session.ts
│   ├── use-patient-achievements.ts
│   └── use-header-store.ts       # Zustand: título/subtítulo do Header
│   └── use-invite-store.ts       # Zustand persist: dados de convite
│
├── lib/
│   ├── axios.ts            # Instância Axios configurada (base URL, interceptors)
│   ├── react-query.ts      # QueryClient exportado
│   └── utils.ts            # cn() = twMerge(clsx(...))
│
├── pages/
│   ├── 404.tsx
│   ├── _layouts/
│   │   ├── app.tsx         # AppLayout (SidebarProvider + Header + Outlet + PopupManager)
│   │   └── auth.tsx        # AuthLayout (grid 2 colunas: branding | form)
│   ├── landing-page/
│   │   └── landing-page.tsx
│   ├── auth/
│   │   ├── sign-in.tsx
│   │   ├── sign-up.tsx
│   │   ├── protected-route.tsx
│   │   └── components/
│   │       └── patient-sign-up-form.tsx
│   └── app/
│       ├── dashboard/
│       │   ├── dashboard.tsx
│       │   └── components/ (cards de KPI, gráficos, date-range-picker)
│       ├── finance/
│       │   ├── dashboard-finance.tsx
│       │   └── components/ (cards de métricas, gráficos)
│       ├── account/
│       │   ├── account.tsx
│       │   └── components/ (profile-card, edit-dialog, avatar-upload, activity-heatmap)
│       ├── appointment/
│       │   ├── appointment-list/
│       │   │   ├── appointment-list.tsx
│       │   │   └── components/ (dialogs, calendar-view, filters, register)
│       │   └── availability-page/
│       │       ├── availability-page.tsx
│       │       └── components/
│       ├── patients/
│       │   ├── components/         # Compartilhados entre sub-módulos
│       │   ├── patients-list/
│       │   │   ├── patients-list.tsx
│       │   │   ├── components/     # table, row, filters, dialogs
│       │   │   └── register-patients/ # formulário de cadastro
│       │   ├── patients-hub/       # /patients/:id/details
│       │   │   ├── patients-details.tsx
│       │   │   └── components/     # anamnese, timeline, arquivos, info
│       │   ├── patients-docs/      # /patients-docs
│       │   │   ├── patients-docs.tsx
│       │   │   └── components/
│       │   └── patients-records/   # /patients-records
│       │       └── patients-records.tsx
│       ├── suggestion/
│       │   ├── suggestion-page.tsx
│       │   └── components/
│       ├── video-room/
│       │   ├── appoinmets-room.tsx
│       │   └── components/ (control-bar, participant-tile, session-notes, timer)
│       └── admin/
│           ├── dashboard/
│           ├── approvals/
│           └── suggestions/
│
├── types/
│   ├── appointment.ts      # Appointment interface + AppointmentStatus enum + Request/Response
│   ├── enum-gender.ts      # type Gender = "MASCULINE" | "FEMININE" | "OTHER"
│   └── expertise.ts        # type Expertise, PsychologistRole, PatientRole
│
└── utils/
    ├── formatCPF.ts
    ├── formatPhone.ts
    ├── formatCEP.ts
    ├── formatAGE.ts
    └── mappers.ts          # ROLE_TRANSLATIONS, EXPERTISE_TRANSLATIONS
```
