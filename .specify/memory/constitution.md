# SpecKit Constitution — API Comanda

## Princípios Centrais

### I. Engenharia Sênior e Simplicidade
Todas as decisões técnicas devem favorecer baixa complexidade, alta coesão e responsabilidade única. Mudanças arquiteturais devem ser justificadas com alternativas e trade-offs.

### II. Test-First e Cobertura (Obrigatório)
Testes unitários são mandatórios e devem alcançar 100% de cobertura no código da API. O ciclo Red-Green-Refactor é obrigatório: escrever os testes → ver os testes falharem → implementar → refatorar.

### III. Padrões de Nomenclatura e Consistência
Respeitar os padrões já adotados no projeto: `camelCase` para identificadores (variáveis e funções), `PascalCase` para classes/dtos/entidades. Padronizar nomes de arquivos e pastas conforme convenção existente.

### IV. Reutilização por Módulos/Services/Middlewares
Criar módulos, `services` e `middlewares` reutilizáveis e globais quando aplicável; evitar conceitos de UI/estilos — foco em domínio, contratos, migrations e schemas.

### V. Observabilidade e Documentação Automática
Instrumentação mínima: logs estruturados, métricas e traces para operações críticas. Toda rota pública deve ter documentação automática (OpenAPI/Swagger) gerada a partir de decorators/contratos.

## Restrições e Exclusões (API-specific)
- Não incluir ou referenciar arquivos/artefatos de front-end (SCSS/CSS/templates/UI). Reescrever regras front-end como equivalentes de API (ex.: revisar SCSS → revisar migrations/schemas/contracts).
- Não criar branches automaticamente via tasks/agentes; fluxo de branches é definido pela equipe (PRs em branches feature/* criadas manualmente pelo autor).

## Fluxo de Desenvolvimento e Gates
- Antes de implementar: o `plan.md` do spec deve passar pela "Constitution Check" (portanto o plano precisa justificar decisões arquiteturais e listar testes obrigatórios).
- PRs devem validar: build, lint, testes unitários (100% coverage), geração de documentação OpenAPI e checagem de contratos (quando aplicável).

## Governança
- Emendas a esta constituição exigem: (1) justificativa técnica; (2) plano de migração; (3) aprovação em revisão de arquitetura.
- Complexidade adicional deve ser documentada no `plan.md` com alternativas rejeitadas e razões.

**Version**: 1.0.0 | **Ratified**: 2026-05-25 | **Last Amended**: 2026-05-25
