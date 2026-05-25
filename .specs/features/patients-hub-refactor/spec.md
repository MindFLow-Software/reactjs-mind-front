# patients-hub Refactor — Specification

## Problem Statement

O `patients-hub` cresceu de forma orgânica e acumulou problemas de organização que dificultam manutenção:

1. Sub-componentes da anamnese vivem em `components/components/` — nome ambíguo sem domínio, e `anamnesis-form.tsx` fica separado dos próprios sub-componentes.
2. `patient-Info.tsx` define inline `formatCPF`, `formatPhoneNumber` e `calculateAge`, duplicando funções que já existem em `src/utils/`.
3. Nomenclatura inconsistente: `patient-Info.tsx` (capital I) quebra o padrão kebab-case do projeto.
4. `pagination.tsx` local é distinto do global mas não tem nome que comunique isso.
5. O padrão `src/validators/{domain}.ts` já existe mas não está documentado como regra canônica.

## Goals

- [ ] Eliminar a pasta `components/components/` e agrupar todos os arquivos de anamnese num subfolder com nome de domínio (`anamnesis/`)
- [ ] Remover duplicação de funções utilitárias inline — usar os utils existentes em `src/utils/`
- [ ] Corrigir naming inconsistente (`patient-Info.tsx` → `patient-info.tsx`)
- [ ] Renomear `pagination.tsx` local para `sessions-pagination.tsx`, explicitando seu escopo
- [ ] Build (`pnpm build`) passa sem erros de tipo após todas as mudanças

## Out of Scope

| Feature | Reason |
|---|---|
| Refatorar lógica interna dos componentes | Só reorganização estrutural, sem mudança de comportamento |
| Migrar para novos padrões de componente | Sem refactor de API de props |
| Adicionar testes automatizados | Projeto ainda não tem framework de testes |
| Criar novos validators Zod | Nenhum schema novo é necessário nesta área |
| Mover `metric-card`, `simple-preview-modal`, `export-pdf-button` para global | Fora do escopo desta iteração |

---

## User Stories

### P1: Reorganizar anamnese em subfolder de domínio ⭐ MVP

**User Story**: Como desenvolvedor mantendo o patients-hub, quero que todos os arquivos de anamnese estejam agrupados em `components/anamnesis/` para que eu possa encontrá-los e modificá-los sem navegar em pastas com nomes ambíguos.

**Why P1**: A pasta `components/components/` é o problema mais confuso — sem nome de domínio, sem relação visível com `anamnesis-form.tsx`.

**Acceptance Criteria**:

1. WHEN eu abro `components/` THEN não SHALL existir mais subpasta `components/`
2. WHEN eu abro `components/anamnesis/` THEN SHALL conter `anamnesis-form.tsx`, `anamnesis-header.tsx`, `anamnesis-toolbar.tsx`, `anamnesis-editor-block.tsx`, `anamnesis-navigation.tsx`, `anamnesis-skeleton.tsx`, `anamnesis-types.ts`, `anamnesis-utils.ts`
3. WHEN `pnpm build` é executado THEN SHALL passar sem erros de tipo

**Independent Test**: Abrir `components/` no explorer e verificar que só existe `anamnesis/` como subpasta. Abrir qualquer aba do paciente na UI e ver que renderiza sem erros.

---

### P1: Remover funções utilitárias inline em patient-info.tsx ⭐ MVP

**User Story**: Como desenvolvedor, quero que `patient-info.tsx` importe `formatCPF`, `formatPhone` e `formatAGE` de `src/utils/` em vez de redefinir localmente, para que alterações nos utils reflitam automaticamente em toda a UI.

**Why P1**: Duplicação de lógica causa inconsistência silenciosa — se o formato do CPF mudar no utils, `patient-info.tsx` não recebe a mudança.

**Acceptance Criteria**:

1. WHEN eu abro `patient-info.tsx` THEN não SHALL existir definições inline de `formatCPF`, `formatPhoneNumber` ou `calculateAge`
2. WHEN o componente é renderizado com dados válidos THEN SHALL exibir CPF, telefone e idade com a mesma formatação de antes
3. WHEN `patient.cpf` é `null` ou `undefined` THEN SHALL exibir `"--"`
4. WHEN `pnpm build` é executado THEN SHALL passar sem erros de tipo

**Independent Test**: Abrir a aba "Dados Cadastrais" de um paciente com CPF, telefone e data de nascimento preenchidos e verificar que os valores aparecem formatados corretamente.

---

### P1: Corrigir nomenclatura e renomear pagination local ⭐ MVP

**User Story**: Como desenvolvedor, quero que os arquivos sigam o padrão kebab-case do projeto e que `sessions-pagination.tsx` comunique claramente que pagina sessões (não pacientes), para que eu não confunda com o `src/components/pagination.tsx` global.

**Why P1**: Inconsistência de nomenclatura quebra o padrão acordado em CONVENTIONS.md e impede busca eficiente por nome.

**Acceptance Criteria**:

1. WHEN eu busco `patient-Info.tsx` no projeto THEN não SHALL existir esse arquivo
2. WHEN eu busco `patient-info.tsx` THEN SHALL existir e funcionar
3. WHEN eu busco `sessions-pagination.tsx` THEN SHALL existir na pasta `components/` do patients-hub
4. WHEN eu busco `pagination.tsx` dentro de `patients-hub/components/` THEN não SHALL existir
5. WHEN `pnpm build` é executado THEN SHALL passar sem erros de tipo

**Independent Test**: Abrir a aba "Historico" (timeline de sessões) e paginar — deve funcionar normalmente.

---

## Edge Cases

- WHEN `formatAGE` recebe valor `null` ou `undefined` THEN `patient-info.tsx` SHALL exibir `"--"` (a função do utils espera `string | Date`, o null-check fica no componente)
- WHEN o localStorage contém rascunho da anamnese THEN após a reorganização de arquivos SHALL continuar funcionando (nenhuma chave de storage muda)
- WHEN um arquivo é movido THEN todas as importações relativas internas SHALL ser atualizadas antes de deletar o original

---

## Requirement Traceability

| Requirement ID | Story | Status |
|---|---|---|
| HUB-01 | P1: Criar `components/anamnesis/` com todos os arquivos de anamnese | Verified |
| HUB-02 | P1: Mover `anamnesis-form.tsx` para `components/anamnesis/` | Verified |
| HUB-03 | P1: Renomear `types.ts` → `anamnesis-types.ts` | Verified |
| HUB-04 | P1: Atualizar imports internos dos arquivos movidos | Verified |
| HUB-05 | P1: Atualizar import de `AnamnesisForm` em `patients-details.tsx` | Verified |
| HUB-06 | P1: Remover inline utils de `patient-Info.tsx` | Verified |
| HUB-07 | P1: Renomear `patient-Info.tsx` → `patient-info.tsx` | Verified |
| HUB-08 | P1: Atualizar import de `PatientInfo` em `patients-details.tsx` | Verified |
| HUB-09 | P1: Renomear `pagination.tsx` → `sessions-pagination.tsx` | Verified |
| HUB-10 | P1: Atualizar import em `patient-sessions-timeline.tsx` | Verified |
| HUB-11 | P1: Deletar arquivos originais após migração | Verified |

**Coverage**: 11 total, 11 verificados ✅

---

## Success Criteria

- [ ] `pnpm build` passa sem erros após todas as mudanças
- [ ] Pasta `components/components/` não existe mais
- [ ] Nenhuma definição inline de `formatCPF`/`formatPhone`/`calculateAge` em componentes
- [ ] `patient-Info.tsx` e `pagination.tsx` (local) não existem mais
- [ ] Todas as 5 abas do paciente renderizam corretamente na UI
