# Google OAuth Login — Specification

## Problem Statement

A tela de login atual só aceita email + senha. Psicólogos que já possuem conta Google esperam poder entrar com um clique, sem criar e lembrar mais uma senha. Além disso, o backend já tem o fluxo OAuth completo implementado (T16 concluído), tornando este um wiring de frontend puro.

## Goals

- [ ] Psicólogo existente consegue entrar no app via Google em menos de 3 cliques, sem digitar credenciais.
- [ ] Psicólogo novo que se cadastra via Google completa o registro complementar (CRP, especialidade, gênero) e chega ao dashboard sem atrito.

## Out of Scope

| Feature | Razão |
|---|---|
| Redesign visual da tela de login | Pedido explícito de manter layout atual, apenas adicionar botão |
| LinkedIn OAuth | Pós-v1, definido no PROJECT.md |
| Outros provedores OAuth (Apple, GitHub) | Não há suporte no backend |
| Alteração do fluxo de logout | Não impactado |
| Refresh automático de token | Backend gerencia via cookies HttpOnly |

---

## User Stories

### P1: Botão "Entrar com Google" na tela de login — AUTH-01 ⭐ MVP

**User Story**: Como psicólogo, quero clicar em "Entrar com Google" na tela de login para ser redirecionado ao fluxo OAuth do Google, sem precisar digitar email e senha.

**Why P1**: É o ponto de entrada de todo o fluxo. Sem isso nada mais funciona.

**Acceptance Criteria**:

1. WHEN o usuário acessa `/sign-in` THEN a tela SHALL exibir um botão "Entrar com Google" com ícone do Google, abaixo do formulário de email/senha, separado por um divider "ou".
2. WHEN o usuário clica em "Entrar com Google" THEN o browser SHALL navegar para `{VITE_API_URL}/auth/google` (redirect completo, não AJAX).
3. WHEN o botão está sendo clicado THEN ele SHALL exibir estado de loading/disabled para evitar duplo clique.

**Independent Test**: Acessar `/sign-in`, clicar no botão e verificar que o browser navega para a URL do Google OAuth (ou para a URL do backend que redireciona para o Google).

---

### P1: Callback de sucesso — usuário existente — AUTH-02 ⭐ MVP

**User Story**: Como psicólogo existente, após autenticar no Google e ser redirecionado de volta ao app, quero ser logado automaticamente e ir para o dashboard.

**Why P1**: É o caminho feliz principal — sem isso o fluxo OAuth é inútil.

**Contexto técnico**:
- O backend redireciona para `FRONTEND_OAUTH_SUCCESS_URL` (ex: `/auth/google/success`) com os cookies `access_token` e `refresh_token` já setados no browser.
- O frontend precisa de uma rota que: (1) chame `GET /psychologist/me` para buscar os dados do usuário, (2) salve `isAuthenticated=true` e `user={...}` no localStorage, (3) redirecione para `/dashboard`.

**Acceptance Criteria**:

1. WHEN o browser chega em `/auth/google/success` THEN o app SHALL exibir uma tela de loading ("Finalizando login...").
2. WHEN a tela de loading carrega THEN o app SHALL chamar `GET /psychologist/me` com os cookies do browser.
3. WHEN `GET /psychologist/me` retorna com sucesso THEN o app SHALL salvar `isAuthenticated=true` e `user={...}` no localStorage e redirecionar para `/dashboard`.
4. WHEN `GET /psychologist/me` falha (qualquer erro) THEN o app SHALL redirecionar para `/sign-in` com uma mensagem de erro via toast: "Não foi possível completar o login. Tente novamente."

**Independent Test**: Simular chegada na rota `/auth/google/success` (com cookies mockados ou sem) e verificar o redirecionamento correto para `/dashboard` ou `/sign-in`.

---

### P1: Callback de cadastro complementar — usuário novo — AUTH-03 ⭐ MVP

**User Story**: Como psicólogo novo que se cadastrou via Google pela primeira vez, quero preencher os dados complementares obrigatórios (CRP, especialidade, gênero) para completar meu cadastro e acessar o dashboard.

**Why P1**: Sem isso, novos usuários ficam presos — o backend não os deixa acessar o sistema sem o registro completo.

**Contexto técnico**:
- O backend redireciona para `FRONTEND_OAUTH_INCOMPLETE_URL` (ex: `/auth/google/complete?token={uuid}`) com um `token` na query string.
- O `token` é um UUID temporário que identifica o registro incompleto.
- O frontend deve chamar `POST /auth/complete-registration` com o token + dados complementares.
- Campos obrigatórios: **CRP**, **especialidade** (`Expertise`), **gênero** (`Gender`).

**Acceptance Criteria**:

1. WHEN o browser chega em `/auth/google/complete?token={uuid}` THEN o app SHALL exibir um formulário de cadastro complementar com os campos: CRP (texto com máscara), especialidade (select), gênero (select).
2. WHEN o `token` não está presente na query string THEN o app SHALL redirecionar para `/sign-in` com toast de erro.
3. WHEN o usuário submete o formulário com dados válidos THEN o app SHALL chamar `POST /auth/complete-registration` com `{ token, crp, expertise, gender }`.
4. WHEN `POST /auth/complete-registration` retorna com sucesso THEN o app SHALL chamar `GET /psychologist/me`, salvar os dados no localStorage e redirecionar para `/dashboard`.
5. WHEN `POST /auth/complete-registration` retorna erro de validação THEN o app SHALL exibir as mensagens de erro nos campos correspondentes.
6. WHEN `POST /auth/complete-registration` retorna erro de token inválido/expirado THEN o app SHALL redirecionar para `/sign-in` com toast: "Link de cadastro expirado. Tente novamente com o Google."
7. WHEN o formulário é submetido THEN o botão SHALL entrar em estado de loading até a resposta da API.

**Independent Test**: Acessar `/auth/google/complete?token=test-uuid`, preencher o formulário e verificar chamada à API + redirecionamento para `/dashboard`.

---

## Edge Cases

- WHEN o usuário já está autenticado e acessa `/sign-in` THEN o app SHALL redirecionar para `/dashboard` (comportamento já existente — manter).
- WHEN o usuário clica em "Entrar com Google" e cancela o fluxo no Google (clica em "Cancelar" na tela do Google) THEN o backend redireciona para `FRONTEND_OAUTH_INCOMPLETE_URL` ou para uma URL de erro — verificar com o backend qual URL é usada nesse caso e tratar com toast + redirect para `/sign-in`.
- WHEN a rota `/auth/google/success` é acessada diretamente sem cookies válidos THEN `GET /me` falhará — tratar conforme AUTH-02 critério 4.
- WHEN a rota `/auth/google/complete` é acessada sem `?token=` THEN redirecionar para `/sign-in` (AUTH-03 critério 2).

---

## Novas Rotas Necessárias

| Rota | Componente | Descrição |
|---|---|---|
| `/auth/google/success` | `GoogleOAuthSuccess` | Página de loading + wiring pós-OAuth |
| `/auth/google/complete` | `GoogleOAuthComplete` | Formulário de cadastro complementar |

Ambas ficam no layout `AuthLayout` (sem sidebar, sem header autenticado).

## Novas Chamadas de API Necessárias

| Função | Endpoint | Arquivo sugerido |
|---|---|---|
| `completeGoogleRegistration` | `POST /auth/complete-registration` | `src/api/complete-google-registration.ts` |

> `GET /psychologist/me` já existe em `src/api/get-profile.ts` — reutilizar.

---

## Requirement Traceability

| Requirement ID | Story | Status |
|---|---|---|
| AUTH-01 | P1: Botão "Entrar com Google" | Verified |
| AUTH-02 | P1: Callback sucesso (usuário existente) | Verified |
| AUTH-03 | P1: Callback cadastro complementar (usuário novo) | Verified |

**Coverage:** 3 total, 3 implementados ✅

---

## Success Criteria

- [ ] Psicólogo existente clica em "Entrar com Google", autentica no Google e chega em `/dashboard` sem digitar senha.
- [ ] Psicólogo novo clica em "Entrar com Google", preenche CRP + especialidade + gênero e chega em `/dashboard`.
- [ ] Cancelar o fluxo no Google não quebra o app — usuário volta para `/sign-in` com mensagem clara.
- [ ] Acessar `/auth/google/success` ou `/auth/google/complete` diretamente (sem o fluxo OAuth) não quebra o app.
