# Feature Specification: [FEATURE NAME]

**Feature Branch**: `[###-feature-name]`  
**Created**: [DATE]  
**Status**: Draft  
**Input**: User description: "$ARGUMENTS"

## User Scenarios & Testing *(mandatory)*

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.
  
  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

### User Story 1 - [Brief Title] (Priority: P1)

[Describe this user journey in plain language]

**Why this priority**: [Explain the value and why it has this priority level]

**Independent Test**: [Describe how this can be tested independently - e.g., "Can be fully tested by [specific action] and delivers [specific value]"]

**Acceptance Scenarios**:

1. **Given** [initial state], **When** [action], **Then** [expected outcome]
2. **Given** [initial state], **When** [action], **Then** [expected outcome]

---

### User Story 2 - [Brief Title] (Priority: P2)

[Describe this user journey in plain language]

**Why this priority**: [Explain the value and why it has this priority level]

**Independent Test**: [Describe how this can be tested independently]

**Acceptance Scenarios**:

1. **Given** [initial state], **When** [action], **Then** [expected outcome]

---

### User Story 3 - [Brief Title] (Priority: P3)

[Describe this user journey in plain language]

**Why this priority**: [Explain the value and why it has this priority level]

**Independent Test**: [Describe how this can be tested independently]

**Acceptance Scenarios**:

1. **Given** [initial state], **When** [action], **Then** [expected outcome]

---

[Add more user stories as needed, each with an assigned priority]

### Edge Cases

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right edge cases.
-->

- What happens when [boundary condition]?
- How does system handle [error scenario]?

## Requirements *(mandatory)*

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  # Especificação de Feature: [NOME DA FEATURE] — API

  **Feature Branch**: `[###-feature-name]`  
  **Criado**: [DATE]  
  **Status**: Draft  
  **Entrada**: descrição do usuário: "$ARGUMENTS"

  ## Cenários de Usuário & Testes (obrigatório)

  Priorizar histórias do usuário por importância (P1, P2, P3). Cada história deve ser
  independentemente testável com testes unitários e de contrato.

  ### User Story 1 - [Título breve] (Prioridade: P1)

  [Descrição da jornada em linguagem clara]

  **Por que é P1**: [Valor entregue]

  **Teste independente**: [Como verificar esta história isoladamente]

  **Cenários de Aceitação**:

  1. **Dado** [estado inicial], **Quando** [ação], **Então** [resultado esperado]

  ---

  ### Edge Cases (obrigatório)

  - Listar limites e falhas esperadas e como a API deve reagir (ex.: timeouts, payloads inválidos, concorrência)

  ## Requisitos Funcionais (obrigatório)

  - **FR-001**: A API deve [capabilidade específica]
  - **FR-002**: Endpoints devem validar entradas e retornar códigos HTTP apropriados
  - **FR-003**: Erros devem ser padronizados com um schema de erro comum
  - **FR-004**: Contratos OpenAPI devem estar sincronizados com implementações

  ## Entidades Principais

  - **[Entidade]**: atributos principais e relações (sem detalhes de implementação)

  ## Critérios de Sucesso

  - Testes unitários e de contrato passando (100% coverage para o código novo/alterado)
  - OpenAPI atualizado e validado
  - Migrations aplicáveis testadas em ambiente de integração

  ## Assunções

  - Lista de premissas (e.g., autenticação existente, disponibilidade de DB)
