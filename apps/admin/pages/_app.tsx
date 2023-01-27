import '../styles/globals.css';
import type { AppProps } from 'next/app';
import createEmotionCache from 'utils/createEmotionCache';
import { CacheProvider, EmotionCache } from '@emotion/react';
import Head from 'next/head';
import { ThemeProvider } from '@mui/material/styles';
import theme from 'utils/theme';
import { CssBaseline } from '@mui/material';
import { ApolloProvider } from '@apollo/client';
import client from 'utils/apollo-client';
import { createStytchUIClient } from '@stytch/nextjs/ui';
import { StytchProvider } from '@stytch/nextjs';

// eslint-disable-next-line turbo/no-undeclared-env-vars
const stytch = createStytchUIClient(process.env.NEXT_PUBLIC_STYTCH_PUBLIC_TOKEN || '');

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <StytchProvider stytch={stytch}>
          <ApolloProvider client={client}>
            <Component {...pageProps} />
          </ApolloProvider>
        </StytchProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}
