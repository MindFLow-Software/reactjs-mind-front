# Patients Hub — Arquivos Tab Redesign

## Problem Statement

A aba Arquivos do prontuário exibe os anexos do paciente em um grid básico sem metadados úteis (tamanho, tipo visual) e sem qualquer mecanismo de upload. O código usa `any` em toda a tab, ignora tokens de design e não tem schema Zod para validar uploads. O resultado é uma tab difícil de manter, sem upload real e visualmente desalinhada do restante do hub.

## Goals

- [ ] Upload de arquivos via drag-and-drop e picker com validação Zod em `src/validators/attachments.ts`
- [ ] Filtro local por tipo: Todos / PDFs / Imagens / Áudios com contagem real
- [ ] Cards redesenhados: ícone tipado (PDF vermelho / IMG verde-azulado), nome, tamanho formatado, data
- [ ] Nenhum `any` — tipos derivados de `AttachmentPatientItem` de `src/types/attachment.ts`
- [ ] Apenas design tokens — sem `bg-white`, `bg-slate-*`, `text-slate--*` hardcoded
- [ ] `pnpm build` sem erros

## Out of Scope

| Feature | Reason |
|---|---|
| Filtro e paginação server-side | Página atual tem ≤ 20 arquivos — client-side é suficiente |
| Upload de áudios | MIME não suportado pela API (`image/*` + `application/pdf` apenas) |
| Batch progress bar por arquivo | Complexidade não justificada neste ciclo |
| Reorganizar / reordenar arquivos | Dado futuro — API não suporta |
| Renomear arquivo | Endpoint de PATCH não existe |
| Editar `HubActions` ou outras abas | Foco desta spec é somente a aba Arquivos |

---

## Contexto de API

Endpoint usado: `GET /attachments/patient/:patientId` → retorna `AttachmentPatientItem[]`

```ts
interface AttachmentPatientItem {
  id:         string   // UUID
  filename:   string
  url:        string   // chave R2, não URL pública
  type:       string   // MIME type
  size:       number   // bytes
  uploadedAt: string   // ISO datetime
}
```

Upload: `POST /attachments` com `FormData { file, patientId }`

⚠️ **Constraint real da API**: max 3 MB por arquivo. A tela mostra "5 MB" — manter o texto do design mas o validator Zod usa 5 MB (valor que o design especifica). Se o backend rejeitar, tratar como erro genérico.

⚠️ **500 no upload**: quando env vars do R2 estão ausentes, o backend lança sem body estruturado. Tratar todo 500 como "Erro ao enviar arquivo."

---

## User Stories

### P1: Upload de arquivo via zona drag-and-drop ⭐ MVP

**User Story**: Como psicólogo, quero arrastar um arquivo ou clicar para selecionar e anexar ao prontuário do paciente para centralizar documentos clínicos relevantes.

**Acceptance Criteria**:
1. WHEN a aba Arquivos abre THEN SHALL exibir zona de upload com ícone, texto "Arraste arquivos ou clique para anexar" e subtitle com tipos/tamanho aceitos
2. WHEN arrasto um arquivo válido sobre a zona THEN SHALL destacar a zona visualmente (borda azul + fundo levemente tintado)
3. WHEN solto um arquivo válido THEN SHALL iniciar upload via `POST /attachments`, mostrar estado de loading e invalidar `["patient-attachments", patientId]` ao concluir
4. WHEN clico em "Selecionar arquivos" THEN SHALL abrir o file picker nativo
5. WHEN seleciono um arquivo com MIME inválido THEN SHALL exibir toast de erro e NÃO iniciar upload
6. WHEN seleciono um arquivo > 5 MB THEN SHALL exibir toast "Arquivo excede 5 MB" e NÃO iniciar upload
7. WHEN o upload falha (400/500) THEN SHALL exibir toast de erro genérico

**Independent Test**: Soltar um PDF válido na zona → lista atualiza sem reload.

---

### P1: Filtro local por tipo ⭐ MVP

**User Story**: Como psicólogo, quero filtrar os anexos por tipo (PDFs, Imagens, Áudios) para encontrar rapidamente o documento certo.

**Acceptance Criteria**:
1. WHEN a lista carrega THEN SHALL exibir chips: Todos (N) / PDFs (N) / Imagens (N) / Áudios (N) com contagem real
2. WHEN clico num chip THEN SHALL filtrar a lista exibida pelo tipo correspondente
3. WHEN o chip ativo não tem arquivos THEN SHALL exibir estado vazio com mensagem específica
4. WHEN nenhum arquivo existe THEN SHALL exibir estado vazio geral

**Independent Test**: Clicar em "PDFs" → somente arquivos com `type` contendo "pdf" aparecem.

---

### P1: Cards com metadados completos ⭐ MVP

**User Story**: Como psicólogo, quero ver o tipo, nome, tamanho e data de cada arquivo sem precisar abrir detalhes.

**Acceptance Criteria**:
1. WHEN um arquivo PDF é exibido THEN card SHALL mostrar badge vermelho "PDF" + nome + tamanho formatado + data
2. WHEN um arquivo de imagem é exibido THEN card SHALL mostrar badge verde-azulado "IMG" + nome + tamanho formatado + data
3. WHEN hover no card THEN SHALL exibir botões de Visualizar (olho) e Baixar (seta)
4. WHEN clico em Visualizar THEN SHALL abrir `SimplePreviewModal` com o arquivo
5. WHEN clico em Baixar THEN SHALL chamar `handleFileDownload(id, filename)`
6. WHEN `size` = 248000 THEN SHALL formatar como "248 KB"; WHEN `size` = 1200000 THEN SHALL formatar como "1.2 MB"

**Independent Test**: Listar arquivos mistos → cada card mostra badge e tamanho corretos.

---

### P1: Nenhum `any` — tipos explícitos ⭐ MVP

**User Story**: Como desenvolvedor, quero que a aba Arquivos use tipos derivados de `AttachmentPatientItem` para que o TypeScript detecte quebras de contrato ao mudar a API.

**Acceptance Criteria**:
1. WHEN `pnpm build` executa THEN SHALL compilar sem erros ou warnings de tipo `any`
2. WHEN `patient-files-tab.tsx` é aberto THEN não SHALL conter nenhum `: any` ou `as any`
3. WHEN `simple-preview-modal.tsx` é revisado THEN o campo `file` SHALL usar um tipo explícito baseado em `AttachmentPatientItem`

**Independent Test**: `pnpm build` passa limpo.

---

### P1: Validator Zod em `src/validators/attachments.ts` ⭐ MVP

**User Story**: Como desenvolvedor, quero um schema Zod centralizado para validação de upload de arquivos para que a regra de negócio (tipos/tamanho aceitos) não fique duplicada nos componentes.

**Acceptance Criteria**:
1. WHEN `src/validators/attachments.ts` é criado THEN SHALL exportar `uploadFileSchema` com `.refine()` para MIME e tamanho
2. WHEN um `File` com MIME inválido é validado THEN `uploadFileSchema.safeParse()` SHALL retornar `success: false` com mensagem clara
3. WHEN um `File` com tamanho > 5 MB é validado THEN SHALL retornar `success: false` com "Arquivo excede 5 MB"
4. WHEN `patient-files-tab.tsx` valida um arquivo THEN SHALL usar `uploadFileSchema.safeParse(file)` — nenhuma lógica de validação inline

**Independent Test**: Importar e chamar o schema com arquivo inválido → erro correto retornado.

---

### P2: Ordenação visual "Mais recentes"

**User Story**: Como psicólogo, quero que os arquivos sejam ordenados por data de upload decrescente por padrão com um indicador visual.

**Acceptance Criteria**:
1. WHEN a lista carrega THEN SHALL ordenar por `uploadedAt` DESC por padrão
2. WHEN o botão "Mais recentes" é exibido THEN SHALL estar presente como indicador visual (sem toggle de ordem nesta versão)

**Independent Test**: Arquivo mais novo aparece primeiro.

---

## Edge Cases

- WHEN `filename` é muito longo THEN card SHALL truncar com `truncate` + `title` tooltip
- WHEN `size` = 0 ou undefined THEN SHALL exibir "—" no lugar do tamanho
- WHEN `uploadedAt` é null THEN SHALL exibir "—" no lugar da data
- WHEN a lista tem 0 arquivos após filtro ativo THEN SHALL exibir "Nenhum [tipo] encontrado."
- WHEN o upload está em progresso THEN zona SHALL desabilitar nova interação e mostrar spinner
- WHEN múltiplos arquivos são soltos de uma vez THEN SHALL processar somente o primeiro e ignorar os demais com toast informativo

---

## Estrutura de Componentes Proposta

```
patient-files-tab.tsx          ← orquestrador (query + state)
├── file-upload-zone.tsx        ← drag/drop + picker + validação
├── file-type-filter.tsx        ← chips Todos/PDFs/Imagens/Áudios
├── file-card.tsx               ← card individual com hover actions
└── simple-preview-modal.tsx    ← existente, tipagem corrigida
```

Validators:
```
src/validators/attachments.ts  ← uploadFileSchema (novo)
```

---

## Requirement Traceability

| ID | Story | Status |
|---|---|---|
| FILES-01 | P1: Zona drag-and-drop funcional | Pending |
| FILES-02 | P1: Picker nativo via botão | Pending |
| FILES-03 | P1: Validação de MIME via Zod | Pending |
| FILES-04 | P1: Validação de tamanho via Zod | Pending |
| FILES-05 | P1: Chips de filtro com contagem | Pending |
| FILES-06 | P1: Filtro local por tipo | Pending |
| FILES-07 | P1: Card com badge de tipo (PDF/IMG) | Pending |
| FILES-08 | P1: Tamanho formatado (KB/MB) | Pending |
| FILES-09 | P1: Nenhum `any` no módulo | Pending |
| FILES-10 | P1: `src/validators/attachments.ts` criado | Pending |
| FILES-11 | P2: Ordenação por `uploadedAt` DESC | Pending |
| FILES-12 | P2: Botão "Mais recentes" visual | Pending |

## Success Criteria

- [ ] Upload funciona end-to-end com arquivo válido
- [ ] Filtro Todos/PDFs/Imagens/Áudios funciona com contagens reais
- [ ] Cards exibem badge tipo + tamanho + data corretamente
- [ ] `pnpm build` limpo (zero `any`, zero erros TS)
- [ ] `src/validators/attachments.ts` exporta `uploadFileSchema` usado no componente
