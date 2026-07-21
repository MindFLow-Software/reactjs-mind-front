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
- **D12 (2026-07-16):** UI Standardization Refactor — envelope de resposta da API (`success`/`data`/`error.code`) FORA de escopo desta feature; vira spec separada futura. Esta refatoração é somente camada de apresentação (shadcn + RHF + tokens), sem mudar payloads/schemas/rotas
- **D13 (2026-07-16):** Landing-page e video-room INCLUÍDOS no escopo da UI Standardization Refactor — padroniza botões/cards/tipografia/ícones/dialogs, preservando layout de marketing e comportamento dos controles LiveKit

## Blockers

- **B1 (2026-06-14):** D20 — `POST /billing` contrato incerto: não está claro se `{ subscriptionPlanId, amount }` cria um registro local de `Payment` ou apenas aciona pagamento externo. `AccountStatusGuard` pode bloquear o psicólogo após pagamento externo sem registro local. **Não implementar MIG-60 (createBillingSchema) até resolução com o time de backend.**

## Todos

- [x] Prints do design recebidos (2026-05-05) — detalhes visuais confirmados
- [x] Confirmar endpoint today: não existe — usar `getActiveAppointmentsGrouped` ou filtrar client-side via `fetchAppointments`
- [ ] **ATIVO (2026-06-14):** Migração Entity-Relation — 74 requisitos em 10 commits atômicos (spec em `.specs/features/entity-relation-migration/spec.md`, design em `.specs/features/entity-relation-migration/design.md`)
- [ ] Multi-série no SessionsBarChart requer backend retornar count por status — implementado com serie única + legenda visual por ora
- [ ] F10 Auth Redesign: implementar T1–T8 (spec em .specs/features/auth-redesign/)
- [ ] F13 Patients List Redesign: implementar T1–T10 (spec em .specs/features/patients-list-redesign/)
- [ ] Patients List Refactor (PLR-01–PLR-09): fix backend contract + clean orchestrator (spec em .specs/features/patients-list-refactor/)
- [ ] **NOVO (2026-07-16):** UI Standardization Refactor (UISR-01–UISR-40): spec + **design.md** prontos em `.specs/features/ui-standardization-refactor/`. 28 stories de UI + 12 cross-cutting (UISR-29–40) encodam CLAUDE.md e `.specs/codebase/*` à risca; spec tem Compliance Matrix. Design define 4 camadas: L0 tokens (add `--success`/`--warning` + registrar `--color-gender-*` no global.css), L1 fundação (form-fields, IconBox, typography, ConfirmDialog, ModalShell/StepperDialog, badges, MetricCard, Button+data-icon, shadcn primitives), L2 migrações, L3 varreduras. Decisões-chave: field anatomy = FormField+Form (não Field/FieldError); currency via react-number-format; add `Normalizer.maskCpf/maskPhone`; date via `Time` (já existe). **spec + design + tasks TODOS prontos.** `tasks.md` = 35 tasks (TSK-01→35) com model+effort cada, Global DoD encodando UISR-29–40, traceability 40 reqs, validation tables. Sem framework de teste (TESTING.md) → Tests=none(manual), Gate=`pnpm.cmd exec tsc -b --noEmit`+eslint. Ordem: L0(TSK-01)→L1 fundação(TSK-02–18)→L2 migrações(TSK-19–31)→L3 sweeps(TSK-32–35). **Próximo passo: Execute (implement)** — começar por TSK-01

## Deferred Ideas

- Animações staggered com Framer Motion (M2)
- Export PDF da dashboard (M2+)
- Notificações real-time de agendamentos

## Preferences

_(nenhuma registrada)_
