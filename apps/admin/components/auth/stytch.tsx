import React from 'react';
import { StytchLogin } from '@stytch/nextjs';
import {
  StytchLoginConfig,
  OAuthProviders,
  OneTapPositions,
  Products,
  StyleConfig,
  StytchEvent,
  StytchError,
} from '@stytch/vanilla-js';

const sdkStyle: StyleConfig = {
  fontFamily: '"Helvetica New", Helvetica, sans-serif',
  buttons: {
    primary: {
      backgroundColor: '#19303d',
      textColor: '#ffffff',
    },
  },
};

const getDomainFromWindow = () => {
  // First, check if this function is being called on the frontend. If so, get domain from windown
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }

  return null;
};
const sdkConfig: StytchLoginConfig = {
  products: [Products.oauth, Products.emailMagicLinks],
  emailMagicLinksOptions: {
    loginRedirectURL: getDomainFromWindow() + '/authenticate',
    loginExpirationMinutes: 30,
    signupRedirectURL: getDomainFromWindow() + '/authenticate',
    signupExpirationMinutes: 30,
    createUserAsPending: false,
  },
  oauthOptions: {
    providers: [
      { type: OAuthProviders.Google, one_tap: true, position: OneTapPositions.embedded },
      { type: OAuthProviders.Apple },
      { type: OAuthProviders.Microsoft },
      { type: OAuthProviders.Facebook },
      { type: OAuthProviders.LinkedIn },
    ],
    loginRedirectURL: getDomainFromWindow() + '/authenticate',
    signupRedirectURL: getDomainFromWindow() + '/authenticate',
  },
};

const callbackConfig = {
  onEvent: (message: StytchEvent) => console.log(message),
  onError: (error: StytchError) => console.log(error),
};

const LoginWithStytchSDKUI = () => (
  <StytchLogin config={sdkConfig} styles={sdkStyle} callbacks={callbackConfig} />
);

export default LoginWithStytchSDKUI;
