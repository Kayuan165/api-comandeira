---

description: "Task list template for feature implementation (API-focused)"
---

# Tasks: [FEATURE NAME]

**Input**: Design documents from `/specs/[###-feature-name]/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests são OBRIGATÓRIOS para a API. Escreva testes unitários antes da implementação e confirme que falham (Red) antes de implementar (Green). Cobertura unitária de 100% é mandatória para código novo/alterado.

**Organization**: Tasks são agrupadas por user story para permitir implementação e testes independentes.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode rodar em paralelo (arquivos diferentes, sem dependências)
- **[Story]**: A qual história de usuário a tarefa pertence (ex.: US1)
- Incluir caminhos de arquivos exatos nas descrições

## Path Conventions (API)

- `src/` — código da API (controllers, services, dtos, schemas)
- `tests/unit/`, `tests/integration/`, `tests/contract/`

Remover qualquer tarefa relacionada a frontend, estilos ou templates visuais — reescrever como revisão de contracts/migrations/schemas quando aplicável.

---

## Phase 1: Setup (Infraestrutura da API)

**Propósito**: Inicializar projeto e infra básica

- [ ] T001 Criar estrutura de pastas conforme `plan.md`
- [ ] T002 Inicializar dependências e configuração (ver `package.json`)
- [ ] T003 [P] Configurar lint, formatter e hooks pré-commit

---

## Phase 2: Foundational (Prerequisitos Bloqueantes)

**Propósito**: Infraestrutura base que deve existir antes de qualquer user story

**⚠️ CRITICAL**: Nenhuma história de usuário pode avançar antes desta fase: DB/migrations, autenticação e roteamento base devem estar prontos.

Exemplos de tarefas fundamentais (ajustar conforme projeto):

- [ ] T004 Configurar schema e framework de migrations
- [ ] T005 [P] Implementar autenticação/autorização (se aplicável)
- [ ] T006 [P] Configurar roteamento e middlewares padrão
- [ ] T007 Criar modelos/entidades base
- [ ] T008 Configurar tratamento de erros e logging estruturado
- [ ] T009 Configurar gerenciamento de configuração por ambiente

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - [Title] (Priority: P1) 🎯 MVP

**Goal**: [Breve descrição do que a história entrega]

**Independent Test**: [Como verificar esta história isoladamente]

### Tests for User Story 1 (MANDATORY)

> **OBRIGATÓRIO**: Escreva testes primeiro (TDD). Os testes devem inicialmente falhar.

- [ ] T010 [P] [US1] Teste de contrato para [endpoint] em `tests/contract/test_[name].spec.ts`
- [ ] T011 [P] [US1] Teste de integração para [jornada] em `tests/integration/test_[name].spec.ts`

### Implementação da User Story 1

- [ ] T012 [P] [US1] Criar model/entidade em `src/modules/[feature]/schemas`
- [ ] T013 [P] [US1] Criar service em `src/modules/[feature]/services`
- [ ] T014 [US1] Implementar controller/endpoint em `src/modules/[feature]/controllers`
- [ ] T015 [US1] Adicionar validação, DTOs e tratamento de erro padrão
- [ ] T016 [US1] Garantir logs estruturados e métricas
- [ ] T017 [US1] Adicionar testes unitários correspondentes e atingir 100% coverage para os arquivos alterados

**Checkpoint**: User Story 1 deve estar funcional e testável independentemente

---

## Phase 4: User Story 2 - [Title] (Priority: P2)

**Goal**: [Breve descrição do que esta história entrega]

**Independent Test**: [Como verificar esta história isoladamente]

### Tests for User Story 2 (MANDATORY)

- [ ] T018 [P] [US2] Teste de contrato para [endpoint] em `tests/contract/test_[name].spec.ts`
- [ ] T019 [P] [US2] Teste de integração para [jornada] em `tests/integration/test_[name].spec.ts`

### Implementação da User Story 2

- [ ] T020 [P] [US2] Criar model/entidade em `src/modules/[feature]/schemas`
- [ ] T021 [US2] Implementar service em `src/modules/[feature]/services`
- [ ] T022 [US2] Implementar controller/endpoint em `src/modules/[feature]/controllers`
- [ ] T023 [US2] Escrever testes e garantir 100% coverage

**Checkpoint**: User Stories 1 e 2 devem funcionar independentemente

---

## Phase 5: User Story 3 - [Title] (Priority: P3)

[Adicionar conforme padrão acima]

---

## Phase N: Polish & Cross-Cutting Concerns

**Propósito**: Melhorias que afetam múltiplas user stories

- [ ] TXXX Atualizar documentação de API em `docs/` e OpenAPI
- [ ] TXXX Refatoração e limpeza de código
- [ ] TXXX Otimizações de performance
- [ ] TXXX Aumentar testes unitários onde necessário (manter 100% coverage)
- [ ] TXXX Fortalecer segurança (rate-limit, validações, sanitizer)
- [ ] TXXX Validar `quickstart.md` e scripts de deploy

---

## Dependencies & Execution Order

[Manter as mesmas regras de dependência e execução do template original; adaptar quando necessário]
