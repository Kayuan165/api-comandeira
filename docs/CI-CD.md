# CI/CD e fluxo de branches

O workflow [`ci-cd.yml`](../.github/workflows/ci-cd.yml) implementa o fluxo:

```text
kayuan1 --(CI aprovado)--> PR para main --(merge)--> PR para master
                                                        |
                                                        +--> imagem Docker no GHCR
```

## O que acontece

1. Em cada push para `kayuan1`, `main` ou `master`, e em pull requests para
   `main` ou `master`, a pipeline instala as dependências com `npm ci`, verifica
   formatação, executa ESLint, testes com cobertura e o build NestJS.
2. Depois da validação, a imagem Docker é construída. Em branches que não são
   `master`, ela apenas é validada; em `master`, é publicada no GitHub Container
   Registry como `ghcr.io/<owner>/<repository>:<sha>` e `:latest`.
3. Um push bem-sucedido em `kayuan1` abre uma PR para `main`. Depois que essa PR
   é revisada e mergeada, o push em `main` abre outra PR para `master`.

O workflow não faz merge silencioso. Isso preserva revisão e proteção de branch;
se quiser automatizar o merge, habilite branch protection, required status checks
e auto-merge nas configurações do GitHub.

## Por que o Jest foi ajustado

O código usa imports como `src/usuario/usuario.service`. O TypeScript entende
esse alias por causa de `baseUrl`, mas o Jest precisava de `moduleNameMapper`.
Esse mapeamento foi adicionado ao `package.json` para que os testes funcionem
também no runner do GitHub Actions.

## Pré-requisitos para publicação

- A Actions deve ter permissão de escrita em **Packages**.
- O pacote do GHCR pode precisar ser marcado como público ou receber permissões
  adequadas para consumo por servidores de produção.
- O workflow publica a imagem, mas o deploy final em Kubernetes, VM ou outro
  provedor depende da infraestrutura e dos segredos desse ambiente; como esses
  dados não existem no projeto, essa etapa não foi inventada.
