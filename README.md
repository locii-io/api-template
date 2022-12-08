# Web and Server Template with Turborepo

Using Turborepo to manage both web and backend servers.

**Run/build/test both repos**

```bash
yarn dev
yarn build
yarn test
# yarn ...
```

**Run 2e2 tests both repos**
```bash
yarn test:e2e
```

** Environment Variables**
```
APP_NAME=Locii API Template
OKTA_DOMAIN=
OKTA_CLIENT_ID=
OKTA_CLIENT_SECRET
SESSION_SECRET=
JWT_SECRET=
NEW_RELIC_LICENSE_KEY=
```

### Helpful Links:

- **Tuborepo tutorial**: https://turbo.build/repo/docs/getting-started/create-new
- **Package installation**: https://turbo.build/repo/docs/handbook/package-installation
- **Run single workspace**: https://turbo.build/repo/docs/core-concepts/monorepos/filtering
- **Adding Test Scripts**: https://turbo.build/repo/docs/handbook/testing
