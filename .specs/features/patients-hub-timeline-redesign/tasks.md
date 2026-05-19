# Tasks — Histórico de Sessões Redesign

## Status Legend
`Pending` | `In Progress` | `Done` | `Blocked`

---

## T1 — Replace filter bar with chips + search

**Status**: Done  
**Touches**: `patient-sessions-timeline.tsx`

- Remove: Calendar popover date filter and Limpar button
- Add: horizontal chips row — Todas (N) / Realizadas (N) / Canceladas (N) / Faltas (N)
- Add: search Input (right side) filtering on `content` or `theme`
- Active chip: `bg-blue-600 text-white border-blue-600`; count badge inside chip
- State: `statusFilter: "all" | "Concluída" | "Cancelada" | "Falta"` + `searchText: string`
- Counts computed from `sessions` prop (current page)

**Acceptance**: TL-01, TL-02

---

## T2 — Group sessions by month

**Status**: Done  
**Touches**: `patient-sessions-timeline.tsx`

- After filtering, group sessions by `format(date, "MMMM yyyy", { locale: ptBR }).toUpperCase()`
- Preserve natural insertion order (Map)
- Render month header: `"MÊS AAAA"` left + `"N sessões"` right in `text-[11px] text-muted-foreground`
- Each group renders its session cards below the header

**Acceptance**: TL-03

---

## T3 — Redesign session cards (inline content, no dialog)

**Status**: Done  
**Touches**: `patient-sessions-timeline.tsx`

- Remove: Dialog, selectedSession state, CalendarDays/Timer/Maximize2 imports
- Remove: old timeline `border-l-2` wrapper
- Card layout: `flex gap-4 rounded-xl border bg-card p-4`
  - Left col: colored dot (`h-3 w-3 rounded-full`) — blue=Concluída, red=Cancelada, gray=Pendente, amber=Falta
  - Right col: date/time row + theme tag + content section
- "Concluída" card: label "NOTAS DA SESSÃO" + `content` text (or "Nenhuma nota registrada." italic)
- "Cancelada" card: `× Cancelada` red pill badge + label "MOTIVO" + `content` or "—"
- Hover actions (hidden by default, visible on group-hover): Pencil / Copy / MoreHorizontal
- ⋮ DropdownMenu: "Exportar PDF" item triggers PDF download (reuse logic from ExportPDFButton)

**Acceptance**: TL-04, TL-05, TL-06

---

## T4 — Verify build

**Status**: Done  
**Touches**: nothing new

- Run `pnpm build` — zero TypeScript or Vite errors
- Manually navigate to a patient's Histórico tab and confirm:
  - Chips render with correct counts
  - Search filters in real time
  - Sessions group by month
  - Cards render correctly per status
  - Hover actions appear

**Acceptance**: Success Criteria
