## Installation

Make sure you have installed yarn v3+. Installation: https://yarnpkg.com/getting-started/install

```bash
$ yarn install
```

## Graphql

### Apollo Client(Admin Repo)

**Generate Typings**

- Automatic Typescript Type generation with Graphql Code Generator: https://www.apollographql.com/docs/react/development-testing/static-typing/
- use the `gql()` function from `./graphql/__generated__/gql` when writing Queries, Mutations, etc.
- run `yarn gql:codegen-w or yarn gql:codegen` from the root(Turborepo) directory whenever creating/updating `gql` requests in `/graphql/` folder to generate types. watch mode is preferred.

**Why didn't remove `__typename` from query or mutation?**

> For most objects in a graph, the **typename field is vital for proper identification and normalization. For the root query and mutation types, the **typename is not nearly as useful or important, because those types are singletons with only one instance per client.

- Source: https://www.apollographql.com/docs/react/caching/cache-configuration#overriding-root-operation-types-uncommon
- `skipTypename` option to disable `__typename`: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#config-api

## Getting Started

First, run the development server:

```bash
yarn dev
```
