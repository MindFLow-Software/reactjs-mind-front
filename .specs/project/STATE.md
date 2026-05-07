# State

## Decisions

- **D1 (2026-05-05):** Substituir horizontal bar charts de pizza por barras horizontais na faixa etária — alinha com o design de referência e é mais legível para distribuições ordinais
- **D2 (2026-05-05):** Manter Recharts (não migrar para outra lib) — já instalado, equipe familiarizada, suporte a todos os tipos de gráfico necessários
- **D3 (2026-05-05):** Usar `useQuery` (TanStack Query) em todos os cards — eliminar `useState+useEffect` manual que não aproveita cache
- **D4 (2026-05-05):** Agenda de hoje busca dados via `fetchAppointments` com filtro de data — endpoint já existe, sem necessidade de endpoint novo
- **D5 (2026-05-06):** Auth pages forçam dark mode via `className="dark"` no wrapper do AuthLayout — evita depender do ThemeProvider global, garante visual consistente
- **D6 (2026-05-06):** CTA primário nas auth pages usa verde `#0d5c40` (não azul) — alinha com o design de referência teal/green da tela de cadastro
- **D7 (2026-05-06):** `useAuthRedirect` extrai o auth-check inline do sign-in.tsx — preparação para reuso em outras páginas e facilita testes
- **D8 (2026-05-06):** `dateOfBirth` state/effect movido para o escopo de `SignUpForm` (fora do render prop do Controller) — correção de bug de Rules of Hooks em React Strict Mode
- **D9 (2026-05-06):** Tabela de pacientes reduzida de 9 para 6 colunas (CPF/Gênero/Idade movidos para modal de detalhes) — densidade visual excessiva e scroll horizontal em viewports < 1280px
- **D10 (2026-05-06):** Ações da tabela de pacientes agrupadas em DropdownMenu (3 pontos) em vez de 3 botões soltos — padrão mais limpo, escalável e consistente com padrões modernos de tabela
- **D11 (2026-05-06):** Virtualização condicional ativada apenas quando `meta.total > 50` — evita overhead de `@tanstack/react-virtual` para listas pequenas sem perder o benefício para listas grandes

## Blockers

_(nenhum)_

## Todos

- [x] Prints do design recebidos (2026-05-05) — detalhes visuais confirmados
- [x] Confirmar endpoint today: não existe — usar `getActiveAppointmentsGrouped` ou filtrar client-side via `fetchAppointments`
- [ ] Multi-série no SessionsBarChart requer backend retornar count por status — implementado com serie única + legenda visual por ora
- [ ] F10 Auth Redesign: implementar T1–T8 (spec em .specs/features/auth-redesign/)
- [ ] F13 Patients List Redesign: implementar T1–T10 (spec em .specs/features/patients-list-redesign/)

## Deferred Ideas

- Animações staggered com Framer Motion (M2)
- Export PDF da dashboard (M2+)
- Notificações real-time de agendamentos

## Preferences

_(nenhuma registrada)_
