## Description

LOCII.io API framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

# Using Okta Authentication

- Create an account on okta with an email and password. or add a user to your okta organization. Make sure to add the user as email and password signup.
- Create an application with open id connect authentication. You will get the client id and secret from there.
- `dev-*.okta.com` will be the okta domain.
- Create a `.env` file by copying content from the `.env.template` file.
- Try visiting `localhost:4000`(home route) and it should redirect you to the okta login page. if you were already signed in before, you may need to log out from okta. after successful login, you will redirect to the home route and it should display the user info.
