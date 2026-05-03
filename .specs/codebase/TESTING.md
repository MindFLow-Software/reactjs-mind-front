# Testing — MindFlush Frontend

## Estado Atual

Nenhum framework de teste está configurado. O `package.json` não possui script `test` nem dependências de teste (vitest, jest, testing-library).

## Gates Automatizados (v1)

| Gate | Comando | O que verifica |
|---|---|---|
| Type checking | `pnpm build` (via `tsc -b`) | Erros de tipo TypeScript em todo o projeto |
| Lint | `pnpm lint` | Regras ESLint + import sort |

Execute `pnpm build` antes de qualquer PR para garantir que o código compila sem erros de tipo.

## Testes Manuais

Verificação visual e funcional manual é o processo atual para validar features.

## Recomendação Futura (pós-v1)

- **Unit/Integration**: Vitest (alinhado com Vite, sem config extra)
- **Component testing**: @testing-library/react
- **E2E**: Playwright (integra bem com Vite)
