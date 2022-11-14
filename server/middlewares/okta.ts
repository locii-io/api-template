import OktaJwtVerifier from '@okta/jwt-verifier';
import { ExpressOIDC } from '@okta/oidc-middleware';
import * as dotenv from 'dotenv';

dotenv.config();

const issuer = `https://${process.env.OKTA_DOMAIN}/oauth2/default`;
const client_id = process.env.OKTA_CLIENT_ID;
const client_secret = process.env.OKTA_CLIENT_SECRET;
console.log(issuer, client_id, client_secret);

export const oidc = new ExpressOIDC({
  issuer,
  client_id,
  client_secret,
  appBaseUrl: process.env.APP_BASE_URL || `http://localhost:${4000}`,
  scope: 'openid profile',
  //   loginRedirectUri: 'http://localhost:4000',
  //   logoutRedirectUri: 'http://localhost:4000',
});

const oktaJwtVerifier = new OktaJwtVerifier({
  issuer,
});

export function authenticationRequired(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const match = authHeader.match(/Bearer (.+)/);

  if (!match) {
    res.status(401);
    return next('Unauthorized');
  }

  const accessToken = match[1];
  return oktaJwtVerifier
    .verifyAccessToken(accessToken, ['api://special', 'api://default'])
    .then((jwt) => {
      req.jwt = jwt;
      next();
    })
    .catch((err) => {
      res.status(401).send(err.message);
    });
}
