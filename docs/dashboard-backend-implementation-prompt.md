# Prompt para Claude: implementar dashboards agregadas no backend

Voce e o Claude trabalhando no backend do MindFlush. Antes de implementar, leia o codigo real do backend, especialmente Prisma schema, controllers, guards, use cases, presenters, repositorios e testes existentes. Nao assuma que a documentacao historica esta mais correta que o codigo.

## Contexto

O frontend React foi refatorado e hoje existem tres dashboards principais:

- Admin: `src/pages/app/admin/dashboard`
- Psicologo: `src/pages/app/psychologist/dashboard`
- Paciente: `src/pages/app/patient/dashboard`

Problema atual:

- Os hooks de dashboard fazem varias chamadas separadas ao backend.
- Alguns campos ainda vem de mocks no frontend.
- O objetivo e mover a agregacao para o backend e deixar cada hook principal fazer uma unica chamada HTTP:
  - `GET /dashboard/admin`
  - `GET /dashboard/psychologist`
  - `GET /dashboard/patient`

Todas as rotas novas devem ser autenticadas. As rotas de admin e psicologo precisam de checagem extra de autorizacao.

## Regras gerais obrigatorias

1. Todas as rotas novas devem usar o envelope padrao do backend, ou seja, retornar o payload em `data`.
2. Nao use mocks no frontend para campos dessas dashboards.
3. Mocks temporarios so podem ficar no backend quando explicitamente indicado abaixo.
4. Preserve o endpoint antigo `GET /dashboard` se ele ainda for usado por outras telas. Se for seguro, ele pode virar alias de `/dashboard/psychologist`, mas nao quebre compatibilidade sem confirmar.
5. Use os nomes e shapes abaixo para facilitar a migracao do frontend.
6. Campos monetarios devem ser retornados em centavos.
7. Datas de series devem ser strings ISO em granularidade diaria, preferencialmente `YYYY-MM-DD`.
8. Para `period`, aceite estes valores:

```ts
type DashboardPeriod = '7d' | '30d' | '90d' | 'year'
```

9. `period` deve ter default `30d`.
10. O range do periodo deve seguir a regra usada hoje no frontend: inicio em `startOfDay(now - PERIOD_DAYS[period])` e fim em `endOfDay(now)`.
11. Para calculos semanais, use a semana atual. Se o backend ja tiver convencao de timezone, siga ela. Caso contrario, use `America/Sao_Paulo`.
12. Se alguma tabela/entidade necessaria nao existir e for preciso criar uma tabela nova que nao esteja explicitamente autorizada neste prompt, PARE e pergunte ao usuario.

## Tipos compartilhados esperados pelo frontend

Use estes shapes como contrato de retorno. O frontend usa axios com interceptor que remove o envelope, entao a `data` do envelope deve ter exatamente estes objetos.

```ts
type DashboardPeriod = '7d' | '30d' | '90d' | 'year'

type AgeRange = '0-17' | '18-25' | '26-35' | '36-50' | '51+'

type Gender = 'OTHER' | 'FEMININE' | 'MASCULINE'

interface AgeRangeItem {
  range: AgeRange
  count: number
}

interface GenderItem {
  gender: Gender
  count: number
}

interface ITimeSeriesPoint {
  date: string
  count: number
}

enum InsightSeverity {
  INFO = 'INFO',
  WARNING = 'WARNING',
  CRITICAL = 'CRITICAL',
}

interface IDashboardInsight {
  id: string
  severity: InsightSeverity
  title: string
  description: string
  actionLabel?: string
}

interface IDashboardGoal {
  key: string
  label: string
  value: number
  target: number
  unit?: string
}

interface DailySessionMetric {
  date: string
  count: number
}
```

Observacao importante: alguns tipos atuais do frontend incluem `isLoading` e `isError` dentro de secoes da dashboard admin. Esses campos sao estado de UI. O ideal e o frontend preencher localmente como `false` apos sucesso. Se voce precisar retornar exatamente o tipo atual do frontend no backend, retorne `isLoading: false` e `isError: false`, mas nao crie logica de backend para esses campos.

## Endpoint 1: `GET /dashboard/admin`

### Autorizacao

Obrigatorio:

- Usuario autenticado.
- `user.platformRole === ADMIN`.
- Nao basta estar autenticado.
- Se ja existir guard/decorator de admin, use-o. Caso nao exista, crie um guard claro e reutilizavel.

Nao exige `x-psychologist-practice-context-id`.

### Query params

```ts
{
  period?: '7d' | '30d' | '90d' | 'year' // default '30d'
}
```

Se o padrao do backend atual preferir `startDate/endDate`, voce pode aceitar tambem esses parametros como alternativa, mas o frontend novo deve poder chamar apenas `period`.

### Response

```ts
interface IRegionStat {
  region: string
  count: number
}

interface ISpecialtyStat {
  specialty: string
  count: number
}

interface IAdminDashboardExecutive {
  isError: boolean
  isLoading: boolean
  sessions: number
  mrr: number
  psychologists: number
  patients: number
  clinics: number
  premium: number
  freemium: number
  conversionPercent: number
}

interface IAdminDashboardGrowth {
  isError: boolean
  isLoading: boolean
  newPsychologists: ITimeSeriesPoint[]
  newPatients: ITimeSeriesPoint[]
  clinics: ITimeSeriesPoint[]
}

interface IAdminDashboardRevenue {
  isError: boolean
  isLoading: boolean
  mrr: number
  premium: number
  freemium: number
  conversionPercent: number
  growthPercent: number
  churnPercent: number
}

interface IAdminDashboardActivity {
  isError: boolean
  isLoading: boolean
  completed: number
  rescheduled: number
  canceled: number
  activeUsers: number
}

interface IAdminDashboardPsychologists {
  isError: boolean
  isLoading: boolean
  byAge: AgeRangeItem[]
  byGender: GenderItem[]
  active: number
  inactive: number
  byState: IRegionStat[]
  specialties: ISpecialtyStat[]
}

interface IAdminDashboardPatients {
  isError: boolean
  isLoading: boolean
  total: number
  byAge: AgeRangeItem[]
  byGender: GenderItem[]
  byRegion: IRegionStat[]
}

interface IAdminDashboardData {
  executive: IAdminDashboardExecutive
  growth: IAdminDashboardGrowth
  revenue: IAdminDashboardRevenue
  activity: IAdminDashboardActivity
  psychologists: IAdminDashboardPsychologists
  patients: IAdminDashboardPatients
  suggestionsTotal: number
  insights: IDashboardInsight[]
}
```

### Regras de calculo

`executive.psychologists`

- Total de perfis de psicologo cadastrados na plataforma.

`executive.patients`

- Total de `PatientProfile` ativos na plataforma.
- Considere ativos os perfis com `status = ACTIVE` e que nao estejam arquivados.

`executive.sessions`

- Total de sessoes/agendamentos realizados no periodo.
- Use status `FINISHED`.

`executive.clinics`

- Total de clinicas ativas/parceiras, conforme entidade `Clinic`.
- Se existir `isActive`, conte apenas `isActive = true`.

`executive.mrr`, `revenue.mrr`

- Valor em centavos.
- Deve ser calculado a partir das entidades reais de assinatura/pagamento existentes.
- Leia o Prisma schema e as entidades atuais de `SubscriptionPlan`, `Payment` e qualquer modelo de assinatura existente.
- Se nao houver dados suficientes para definir uma assinatura ativa e recorrente, PARE e pergunte ao usuario antes de criar novas tabelas.

`premium`

- Numero de contas/usuarios com assinatura/plano pago ativo.
- Use a regra real de assinatura/pagamento existente no backend.
- Se a regra nao existir, PARE e pergunte antes de criar tabela nova.

`freemium`

- Numero de contas/usuarios ativos sem assinatura/plano pago ativo.

`conversionPercent`

- `premium / (premium + freemium) * 100`, arredondado para inteiro.
- Se denominador for zero, retorne `0`.

`revenue.growthPercent`

- Crescimento percentual da receita do periodo atual contra periodo anterior de mesmo tamanho.
- Formula: `((mrrAtual - mrrAnterior) / mrrAnterior) * 100`, arredondado.
- Se `mrrAnterior = 0`, use `100` quando `mrrAtual > 0`, senao `0`.

`revenue.churnPercent`

- Percentual de assinaturas pagas que deixaram de estar ativas no periodo.
- Se nao existir informacao suficiente para identificar cancelamento/perda, PARE e pergunte antes de criar tabelas.

`growth.newPsychologists`

- Serie diaria no periodo.
- Cada ponto: `{ date, count }`.
- `count` = psicologos criados naquele dia.

`growth.newPatients`

- Serie diaria no periodo.
- `count` = `PatientProfile` criados naquele dia.

`growth.clinics`

- Serie diaria no periodo.
- `count` = clinicas criadas naquele dia.

`activity.completed`

- Total de appointments/sessoes `FINISHED` no periodo.

`activity.rescheduled`

- Total de appointments/sessoes `RESCHEDULED` no periodo.

`activity.canceled`

- Total de appointments/sessoes `CANCELED` no periodo.

`activity.activeUsers`

- Usuarios ativos na plataforma no periodo.
- Para isso, implemente rastreio de atividade do usuario:
  - Criar campos como `lastLoginAt` e, se fizer sentido no backend, `lastActivityAt`.
  - Atualizar `lastLoginAt` no login bem-sucedido.
  - Atualizar `lastActivityAt` em requisicoes autenticadas relevantes, se houver middleware/interceptor adequado.
- Para contagem de usuarios ativos, considere usuarios com `isActive = true` e `lastActivityAt` ou `lastLoginAt` dentro do periodo.

`psychologists.active` e `psychologists.inactive`

- Devem considerar atividade real do usuario e status ativo.
- Inativo deve incluir:
  - usuario com `isActive = false`;
  - conta inativa/bloqueada, se aplicavel;
  - psicologo sem login/atividade ha mais de 30 dias;
  - psicologo sem `lastLoginAt/lastActivityAt`, se nao houver outro sinal de atividade.
- Ativo deve ser psicologo com perfil ativo e usuario/conta ativos, com login/atividade nos ultimos 30 dias.

`psychologists.byAge`

- Distribuicao por idade dos usuarios que possuem perfil de psicologo.
- Use `User.dateOfBirth`.
- Retorne sempre as faixas `0-17`, `18-25`, `26-35`, `36-50`, `51+`, mesmo com `count = 0`.

`psychologists.byGender`

- Distribuicao por genero dos usuarios que possuem perfil de psicologo.
- Retorne os generos conhecidos, mesmo com `count = 0`.

`psychologists.byState`

- Distribuicao por UF/estado dos psicologos.
- Use endereco do usuario/contexto/clinica conforme fonte mais correta no schema.
- Se nao houver estado, agrupe em `Outros`.

`psychologists.specialties`

- Distribuicao por especialidade/area do psicologo.
- Use `PsychologistProfile.expertise` ou entidade equivalente.
- `specialty` pode ser o enum bruto se o backend nao tiver tradutor.

`patients.total`

- Mesmo valor de `executive.patients`.

`patients.byAge`

- Distribuicao de `PatientProfile` por idade.
- Use `PatientProfile.dateOfBirth`.
- Retorne sempre todas as faixas.

`patients.byGender`

- Distribuicao de `PatientProfile.gender`.

`patients.byRegion`

- Distribuicao por UF/estado de pacientes.
- Se nao houver estado, agrupe em `Outros`.

`suggestionsTotal`

- Total de sugestoes cadastradas.

`insights`

- Por enquanto, retorne dados mockados no backend, no shape `IDashboardInsight[]`.
- Nao implemente regras inteligentes ainda.
- Nao deixe esse mock no frontend.

## Endpoint 2: `GET /dashboard/psychologist`

### Autorizacao

Obrigatorio:

- Usuario autenticado.
- Usuario deve possuir `psychologistProfile`.
- `psychologistProfile.isActive = true`.
- `psychologistProfile.status = ACTIVE`, se esse campo existir como `AccountStatus`.
- Deve existir contexto de atuacao ativo.
- A rota deve exigir `x-psychologist-practice-context-id`.
- O contexto deve pertencer ao `psychologistProfile` do usuario.
- `PsychologistPracticeContext.isActive = true`.

Use o `PracticeContextGuard` existente se ele ja faz essa validacao. Se ele nao validar perfil ativo/status, complemente.

### Query params

```ts
{
  period?: '7d' | '30d' | '90d' | 'year' // default '30d'
}
```

### Response

```ts
interface IAppointmentWithNames {
  id: string
  patientProfileId: string | null
  psychologistPracticeContextId: string | null
  diagnosis: string
  content: string | null
  scheduledAt: string
  durationInMin: number | null
  status: string
  createdAt: string
  patient: {
    firstName: string
    lastName: string
  } | null
  psychologist: {
    firstName: string
    lastName: string
  } | null
}

interface IPsychologistDashboardSummary {
  sessionsCompleted: number
  weeklyOccupancyPercent: number
  newPatients: number
  monthlyGoalProgressPercent: number
}

interface IPsychologistDashboardSessionsVolume {
  completed: DailySessionMetric[]
  cancelled: DailySessionMetric[]
  rescheduled: DailySessionMetric[]
}

interface IPsychologistDashboardSessionsStats {
  growthPercent: number
  dailyAverage: number
}

interface IPsychologistDashboardAgenda {
  today: IAppointmentWithNames[]
  tomorrow: IAppointmentWithNames[]
}

interface IPsychologistDashboardAttendance {
  attendedCount: number
  cancelledCount: number
  rescheduledCount: number
}

interface IPsychologistDashboardAnalytics {
  ageRange: AgeRangeItem[]
  gender: GenderItem[]
  weeklyOccupancyPercent: number
  retentionPercent: number
}

interface IPsychologistDashboardData {
  summary: IPsychologistDashboardSummary
  goals: IDashboardGoal[]
  sessionsVolume: IPsychologistDashboardSessionsVolume
  sessionsStats: IPsychologistDashboardSessionsStats
  agenda: IPsychologistDashboardAgenda
  insights: IDashboardInsight[]
  attendance: IPsychologistDashboardAttendance
  analytics: IPsychologistDashboardAnalytics
}
```

### Regras de calculo

Todos os dados deste endpoint devem ser filtrados pelo `psychologistPracticeContextId` ativo enviado no header.

`sessionsVolume.completed`

- Serie diaria no periodo.
- `count` = appointments/sessoes com status `FINISHED`.

`sessionsVolume.cancelled`

- Serie diaria no periodo.
- `count` = appointments/sessoes com status `CANCELED`.

`sessionsVolume.rescheduled`

- Serie diaria no periodo.
- `count` = appointments/sessoes com status `RESCHEDULED`.

`summary.sessionsCompleted`

- Soma de `sessionsVolume.completed`.

`sessionsStats.growthPercent`

- Mesma logica usada hoje no frontend:
  - dividir a serie do periodo ao meio;
  - somar metade anterior e metade atual;
  - calcular percentual de crescimento entre elas.
- Se a metade anterior for zero, retorne `100` se a atual for maior que zero, senao `0`.

`sessionsStats.dailyAverage`

- Media diaria de sessoes concluidas no periodo.
- Arredonde para uma casa decimal.

`attendance.attendedCount`

- Total de status `FINISHED` no periodo.

`attendance.cancelledCount`

- Total de status `CANCELED` no periodo.

`attendance.rescheduledCount`

- Total de status `RESCHEDULED` no periodo.

`summary.newPatients`

- Total de `PatientProfile` criados no periodo para o contexto atual.

`analytics.ageRange`

- Distribuicao dos pacientes do contexto atual por faixa etaria.
- Use `PatientProfile.dateOfBirth`.
- Retorne todas as faixas, mesmo com zero.

`analytics.gender`

- Distribuicao dos pacientes do contexto atual por genero.

`weeklyOccupancyPercent`

- Percentual de horarios ocupados sobre a disponibilidade cadastrada na semana atual.
- Numerador: slots/minutos ocupados por appointments da semana atual no contexto.
- Denominador: slots/minutos disponiveis cadastrados em `PsychologistAvailability` para a semana atual.
- Considere como ocupando agenda os status que de fato reservam horario: `SCHEDULED`, `ATTENDING` e `FINISHED`.
- Nao conte `CANCELED`, `RESCHEDULED` e `NOT_ATTEND` como ocupacao.
- Se nao houver disponibilidade cadastrada no denominador, retorne `0`.
- Retorne inteiro de `0` a `100`.

`analytics.weeklyOccupancyPercent`

- Mesmo valor de `summary.weeklyOccupancyPercent`.

`analytics.retentionPercent`

- Percentual de pacientes com mais de uma sessao no periodo.
- Formula:
  - denominador = pacientes distintos com pelo menos uma sessao no periodo;
  - numerador = pacientes distintos com mais de uma sessao no periodo;
  - `numerador / denominador * 100`.
- Se denominador for zero, retorne `0`.
- Retorne inteiro de `0` a `100`.

`agenda.today`

- Appointments do contexto marcados para hoje.
- Ordenar por `scheduledAt ASC`.
- Incluir `patient` com `firstName` e `lastName`.
- Incluir `psychologist` se o shape atual do presenter exigir.

`agenda.tomorrow`

- Appointments do contexto marcados para amanha.
- Ordenar por `scheduledAt ASC`.

`goals`

- As metas devem ser configuraveis pelo psicologo por contexto de atuacao.
- Implemente persistencia por `PsychologistPracticeContext`.
- Se nao existir modelo atual para isso, crie uma tabela/modelo de configuracao de metas do dashboard, por exemplo:

```ts
PsychologistDashboardGoalSettings {
  id: string
  psychologistPracticeContextId: string // unique
  monthlySessionsTarget: number // default 60
  monthlyHoursTarget: number // default 80
  activePatientsTarget: number // default 35
  createdAt: Date
  updatedAt: Date
}
```

- Tambem implemente rota autenticada e com `PracticeContextGuard` para atualizar essas metas. Sugestao:

```http
PUT /dashboard/psychologist/goals
x-psychologist-practice-context-id: <uuid>
```

Body:

```ts
{
  monthlySessionsTarget: number
  monthlyHoursTarget: number
  activePatientsTarget: number
}
```

- Se o backend ja tiver padrao diferente para configuracoes por contexto, siga o padrao existente.
- Valide numeros inteiros nao negativos.
- Se nao houver configuracao salva, crie/retorne defaults.

Retorno de `goals` no dashboard:

```ts
[
  {
    key: 'sessions',
    label: 'Sessoes',
    value: sessionsCompleted,
    target: monthlySessionsTarget,
    unit: 'sessoes',
  },
  {
    key: 'hours',
    label: 'Horas atendidas',
    value: Math.round(totalMinutesWorkedInPeriod / 60),
    target: monthlyHoursTarget,
    unit: 'h',
  },
  {
    key: 'active-patients',
    label: 'Pacientes ativos',
    value: activePatientsInContext,
    target: activePatientsTarget,
    unit: 'pacientes',
  },
]
```

`summary.monthlyGoalProgressPercent`

- Percentual de progresso da meta de sessoes.
- Formula: `sessionsCompleted / monthlySessionsTarget * 100`, limitado a `100`.
- Se target for zero, retorne `0`.

`insights`

- Por enquanto, retorne dados mockados no backend, no shape `IDashboardInsight[]`.
- Nao implemente regras inteligentes ainda.

### Observacao sobre frontend

Hoje alguns componentes da dashboard do psicologo ainda chamam hooks proprios:

- `PatientsAmountCard`
- `MonthPatientsAmountCard`
- `TotalWorkHoursCard`
- `SessionsBarChart`
- `TodayAgenda`
- `PatientsByAgeChart`
- `PatientsByGenderChart`

Apos este endpoint existir, o frontend deve ser refatorado para esses componentes consumirem os dados vindos de `usePsychologistDashboard`, sem novas chamadas HTTP. O backend deve retornar todos os campos acima para permitir essa refatoracao.

## Endpoint 3: `GET /dashboard/patient`

### Autorizacao

Obrigatorio:

- Usuario autenticado.
- Nao exige `x-psychologist-practice-context-id`.
- A rota deve buscar o `PatientProfile` do usuario autenticado.

### Query params

Nenhum obrigatorio.

### Response

O hook atual precisa renderizar estado vazio quando o usuario nao possui perfil de paciente. Por isso, retorne um wrapper com `hasPatientProfile`.

```ts
enum SessionModality {
  ONLINE = 'ONLINE',
  PRESENTIAL = 'PRESENTIAL',
}

interface IPatientNextSession {
  date: string
  psychologistName: string
  psychologistAvatarUrl: string | null
  durationMinutes: number
  modality: SessionModality
}

interface IPatientJournalEntry {
  id: string
  date: string
  title: string
  excerpt: string
}

interface IPatientPsychologistCard {
  id: string
  name: string
  avatarUrl: string | null
  specialty: string
  rating: number
  pricePerSession: number
  isLinked: boolean
}

interface IPatientDashboardData {
  patientName: string
  nextSession: IPatientNextSession | null
  goals: IDashboardGoal[]
  journal: IPatientJournalEntry[]
  psychologists: IPatientPsychologistCard[]
}

interface IPatientDashboardResponse {
  hasPatientProfile: boolean
  data: IPatientDashboardData
}
```

Quando nao houver `PatientProfile` ativo para o usuario:

```ts
{
  hasPatientProfile: false,
  data: {
    patientName: '',
    nextSession: null,
    goals: [],
    journal: [],
    psychologists: [],
  },
}
```

Quando houver perfil:

```ts
{
  hasPatientProfile: true,
  data: IPatientDashboardData,
}
```

### Regras de calculo

`PatientProfile` alvo

- Use o perfil de paciente vinculado ao usuario autenticado.
- Se houver multiplos perfis, siga a mesma ordenacao/fonte usada por `GET /me` hoje. Se o backend nao tiver ordem definida, use o primeiro perfil `ACTIVE`.

`patientName`

- Nome do usuario autenticado: `${user.firstName} ${user.lastName}`.

`nextSession`

- Proximo appointment futuro do `PatientProfile`.
- Status validos: `SCHEDULED` e, se fizer sentido no dominio atual, `ATTENDING`.
- Ordenar por `scheduledAt ASC` e pegar o primeiro.
- `psychologistName`: nome do psicologo vinculado ao contexto do appointment.
- `psychologistAvatarUrl`: `User.profileImageUrl` do psicologo, se existir.
- `durationMinutes`: `appointment.durationInMin`, com fallback para `50` se o backend ja usar esse default. Se nao houver default conhecido, retorne `0` ou `null` somente se o frontend for ajustado; o tipo atual espera `number`.
- `modality`:
  - se `PsychologistPracticeContext.sessionFormat = ONLINE`, retorne `ONLINE`;
  - se `IN_PERSON`, retorne `PRESENTIAL`;
  - se `HYBRID` e nao houver informacao no appointment para diferenciar, use uma regra documentada no presenter. Se nao existir regra aceitavel no produto, PARE e pergunte.

`goals`

- Por enquanto, retornar `[]` ou mocks simples no backend.
- Esta funcionalidade sera implementada posteriormente.
- Nao criar tabela nova de metas terapeuticas de paciente sem confirmacao do usuario.

`journal`

- Por enquanto, retornar `[]` ou mocks simples no backend.
- Esta funcionalidade sera implementada posteriormente.
- Nao criar tabela nova de diario sem confirmacao do usuario.

`psychologists`

- Se o paciente ja estiver vinculado a um `PsychologistPracticeContext`, retorne o psicologo vinculado como card com `isLinked: true`.
- Se nao estiver vinculado, retorne alguns psicologos aleatorios ativos como recomendacao simples.
- Nao implementar sistema de recomendacao personalizada agora.
- Limite sugerido: 3 psicologos.
- `rating`: ainda nao existe sistema real de avaliacao; pode ser hardcoded no mapper/presenter, por exemplo `4.8`.
- `pricePerSession`: usar `PsychologistPracticeContext.consultationFee` em centavos; se nulo, retornar `0`.
- `specialty`: usar `PsychologistProfile.expertise` ou uma traducao existente.
- `avatarUrl`: usar `User.profileImageUrl` do psicologo.

## Migracoes e modelos novos autorizados

Voce esta autorizado a criar:

1. Campos de atividade em `User` ou `Account`, por exemplo:

```ts
lastLoginAt: Date | null
lastActivityAt: Date | null
```

Use esses campos para contar usuarios/psicologos ativos e inativos.

2. Modelo/tabela de metas do psicologo por contexto, se nao existir algo equivalente:

```ts
PsychologistDashboardGoalSettings
```

Nao crie tabelas novas para diario de paciente, metas terapeuticas de paciente, recomendacao personalizada, rating, assinatura/pagamento ou insights sem confirmacao previa do usuario.

## Pontos onde voce deve PARAR e perguntar

Pare e pergunte ao usuario antes de implementar se encontrar qualquer um destes casos:

1. O schema de pagamentos/assinaturas nao permite calcular MRR, premium, freemium, churn ou crescimento sem criar tabela nova.
2. O modelo de disponibilidade nao permite calcular ocupacao semanal por slots/minutos.
3. A relacao entre `PatientProfile`, `Appointment` e `PsychologistPracticeContext` nao permite montar `nextSession` com psicologo.
4. O backend tem nomes de status/enums diferentes dos usados no frontend (`FINISHED`, `CANCELED`, `RESCHEDULED`, `SCHEDULED`, `ATTENDING`, `NOT_ATTEND`).
5. Ja existe modelo de metas por contexto com semantica diferente.
6. O formato de envelope global ou guards globais for diferente do descrito.
7. Para implementar alguma regra voce precisar criar entidades alem das duas autorizadas acima.

## Testes obrigatorios

Adicione testes coerentes com o padrao do backend:

- Autorizacao de `/dashboard/admin`:
  - usuario nao autenticado;
  - usuario autenticado nao admin;
  - admin autenticado.
- Autorizacao de `/dashboard/psychologist`:
  - sem contexto;
  - contexto de outro psicologo;
  - contexto inativo;
  - psicologo sem profile ativo;
  - psicologo valido.
- `/dashboard/patient`:
  - usuario sem patient profile retorna `hasPatientProfile: false`;
  - usuario com patient profile retorna dados basicos.
- Calculos:
  - period range;
  - series diarias com dias zerados;
  - occupancy semanal;
  - retention;
  - goals por contexto;
  - ativos/inativos por `lastLoginAt/lastActivityAt` e `isActive`.

## Resultado esperado

Ao final:

- `GET /dashboard/admin` retorna todos os dados da dashboard admin em uma unica chamada.
- `GET /dashboard/psychologist` retorna todos os dados da dashboard do psicologo em uma unica chamada e isolado pelo contexto ativo.
- `GET /dashboard/patient` retorna todos os dados da dashboard do paciente em uma unica chamada.
- Nao existem mocks necessarios no frontend para renderizar essas dashboards.
- Os mocks temporarios de `insights`, `goals`/`journal` do paciente e `rating` de psicologo ficam no backend, claramente isolados em presenter/mapper ou use case, com TODOs.
- Rotas admin e psicologo estao protegidas por checagens server-side reais.
