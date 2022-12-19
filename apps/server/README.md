## Description

LOCII.io API framework TypeScript starter repository.

## Installation

Make sure you have installed yarn v3+. Installation: https://yarnpkg.com/getting-started/install

```bash
$ yarn install
```

## Graphql

### Apollo Client(Admin Repo)

- Automatic Typescript Type generation with Graphql Code Generator: https://www.apollographql.com/docs/react/development-testing/static-typing/
- use the `gql()` function from `./graphql/__generated__/gql` when writing Queries, Mutations, etc.
- run `yarn gql:codegen or yarn gql:codegen-w` from the root(Turborepo) directory whenever creating/updating `gql` requests in `/graphql/` folder to generate types.
