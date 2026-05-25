# patients-hub UI Redesign — Tasks

**Spec**: `.specs/features/patients-hub-ui-redesign/spec.md`
**Status**: Approved

---

## Execution Plan

```
T1 → T2 → T3 → pnpm build
```

Sequencial: cada componente depende do anterior para o layout funcionar corretamente.

---

## Task Breakdown

### T1: Redesign `patient-details-header.tsx`

**What**: Substituir o cabeçalho atual (só avatar + nome + ID) pelo novo layout com meta-linha e 4 stat chips horizontais. Receber `meta` e `sessions` como props adicionais.
**Where**: `src/pages/app/patients/patients-hub/components/patient-details-header.tsx`
**Depends on**: None
**Requirement**: HUB-UI-01, HUB-UI-02, HUB-UI-03

**Props novas**:
```ts
meta: { totalCount: number; averageDuration: number | null }
sessions: SessionItem[]   // para derivar última sessão
```

**Layout**:
```
┌─────────────────────────────────────────────────────────────┐
│ [Avatar]  Nome Sobrenome  [Badge Status]         [Exportar] [Nova Sessão] [⋮] │
│           21 anos · Masculino · ID: XXXX-X [copy]                             │
│ ─────────────────────────────────────────────────────────── │
│  SESSÕES        ÚLTIMA SESSÃO     PRESENÇA       PRÓXIMA    │
│  14 realizadas  há 42 dias        —              Sem agend. │
│                 04/04/2026                       + Agendar  │
└─────────────────────────────────────────────────────────────┘
```

**Nota de dados**:
- Última sessão: `sessions.at(-1)?.sessionDate` (ou `date`) — relativo com `formatDistanceToNow` de date-fns + ptBR
- Presença: `--` (dado futuro)
- Próxima: "Sem agendamento" (dado futuro)

**Done when**:
- [ ] Props interface atualizada para incluir `meta` e `sessions`
- [ ] Meta-linha exibe idade (via `formatAGE`), gênero formatado e ID abreviado com copy
- [ ] 4 stat chips horizontais presentes com labels uppercase e valores corretos
- [ ] Sem definições inline de formatação — usa `@/utils/*`
- [ ] Responsivo: em mobile stats empilham em 2×2

**Tests**: none
**Gate**: —

---

### T2: Redesign `patient-info.tsx` (Dados Cadastrais tab)

**What**: Substituir o grid de campos solto por dois cards side-by-side: "Identificação" e "Atendimento". Layout mais horizontal com labels em uppercase e CTAs inline para campos vazios.
**Where**: `src/pages/app/patients/patients-hub/components/patient-info.tsx`
**Depends on**: T1

**Layout do card Identificação**:
```
IDADE        NASCIMENTO    CPF           GÊNERO
21 anos      11/06/2004    + Adicionar   Masculino

TELEFONE            E-MAIL
+ Adicionar         + Adicionar
```

**Layout do card Atendimento** (dados futuros → placeholder `--`):
```
MODALIDADE   FREQUÊNCIA    VALOR/SESSÃO
--           --            --

INDICAÇÃO    TERAPEUTA RESP.   INÍCIO
--           --                --
```

**Estrutura JSX**:
```tsx
<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
  <Card>Identificação</Card>
  <Card>Atendimento</Card>
</div>
```

**Done when**:
- [ ] Dois cards side-by-side (lg:grid-cols-2), stack em mobile
- [ ] Card Identificação mostra todos os campos disponíveis
- [ ] Card Atendimento mostra placeholder `--` para dados futuros
- [ ] Campos com valor null/undefined mostram CTA azul "Adicionar X"
- [ ] Sem inline utils — usa `@/utils/*`

**Tests**: none
**Gate**: —

---

### T3: Atualizar `patients-details.tsx`

**What**: Passar as novas props (`meta`, `sessions`) para `PatientDetailsHeader` e remover o `HubActions` component (as actions agora estão no header). Mover a navegação de "voltar" e os controles de fila para fora do header block.
**Where**: `src/pages/app/patients/patients-hub/patients-details.tsx`
**Depends on**: T1, T2

**Mudanças**:
- Passar `meta` e `sessions={patientData.sessions}` para `PatientDetailsHeader`
- Remover `<HubActions />` do `headerRight` do `PatientsPageShell` (actions ficam no header)
- Remover o bloco `<div className="pb-5 border-b border-border/60">` que envolvia o header (o próprio header já tem separador)

**Done when**:
- [ ] `PatientDetailsHeader` recebe `meta` e `sessions`
- [ ] Nenhum `HubActions` component no JSX
- [ ] Build passa sem erros de tipo
- [ ] Gate: `pnpm build` ✅

**Tests**: none
**Gate**: build — `pnpm build`

**Commit**: `feat(patients-hub): redesign patient header with stats and identification cards layout`

---

## Granularity Check

| Task | Scope | Status |
|---|---|---|
| T1: Redesign patient-details-header | 1 componente, props novas + layout novo | ✅ |
| T2: Redesign patient-info | 1 componente, layout substituído | ✅ |
| T3: Atualizar patients-details | 1 page, apenas wiring de props | ✅ |

## Diagram-Definition Cross-Check

| Task | Depends On (body) | Diagram | Status |
|---|---|---|---|
| T1 | None | Início | ✅ |
| T2 | T1 | Após T1 | ✅ |
| T3 | T1, T2 | Após T2 | ✅ |

## Test Co-location Validation

Sem framework de testes — gate é `pnpm build`.

| Task | Camada | Matrix | Task diz | Status |
|---|---|---|---|---|
| T1 | Componente UI | none | none | ✅ |
| T2 | Componente UI | none | none | ✅ |
| T3 | Page (wiring) | none | build | ✅ |
