# Plano de Implementação: [FEATURE] — API

**Data**: [DATE] | **Spec**: [link para specs/[###-feature]/spec.md]
**Entrada**: Especificação de feature em `/specs/[###-feature]/spec.md`

**Nota**: Este template é usado pelo comando `/speckit.plan`. Ajuste apenas
os campos marcados e mantenha coerência com a arquitetura da API.

## Resumo

[Resumo curto do requisito principal + abordagem técnica selecionada]

## Contexto Técnico (AÇÃO: preencher com valores concretos)

- **Linguagem / Versão**: e.g., `Node.js 20`, `TypeScript 5.x`
- **Framework**: e.g., `NestJS` (versão) — confirmar no `package.json`
- **Banco/Storage**: e.g., `MongoDB` / `Postgres` / `Redis` ou N/A
- **Testes**: `jest` (unidades/integration/contract) — 100% cobertura obrigatória
- **Documentação**: OpenAPI (gerada automaticamente) — rotas e schemas sincronizados
- **Ambiente alvo**: Linux container / Kubernetes / etc.
- **Metas de performance**: p95 < [valor], RPS esperado: [valor] (se aplicável)

## Constitution Check (Gates)

Antes de Phase 0 (research) o plano deve demonstrar:
- Arquitetura proposta e justificativa (alternativas consideradas)
- Contratos/DTOs/Schema iniciais (para geração de OpenAPI)
- Plano de testes (unitários, de contrato e integração)
- Impacto em migrations e dependências compartilhadas

## Estrutura recomendada para features de API

```text
specs/[###-feature]/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── openapi.yaml (ou json)  # contratos/contratos de API
└── tasks.md

src/
├── modules/[feature]/
│   ├── controllers/
│   ├── services/
│   ├── dtos/
│   └── schemas/
tests/
├── unit/
├── integration/
└── contract/
```

**Decisionamento de estrutura**: documente a escolha real aqui referenciando
os diretórios existentes no repositório (ex.: `src/pedidos`, `src/produto`).

## Rastreabilidade de Complexidade

Se existe qualquer violação das regras da constituição (ex.: aumento de scope,
dependências pesadas), registrar em uma tabela com justificativa e alternativas
rejeitadas no `plan.md`.

## Critérios de Pronto (DoD) para a feature

- Implementação passível de deploy.
- 100% de cobertura de testes unitários para código alterado/novo.
- Contratos (OpenAPI) atualizados e validados por testes de contrato.
- Migrations e scripts de DB incluídos e testados em integração.
- Documentação de uso (`quickstart.md`) atualizada.

---

## Estratégia de Entrega

- MVP-first: entregar slice mínimo que passa todos os testes e contratos.
- Entregas incrementais com PRs pequenos e revisões que validem testes e
  conformidade com a constituição.

