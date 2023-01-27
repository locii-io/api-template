import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { LOGIN_WITH_TOKEN } from '../graphql/login';
import { useMutation } from '@apollo/client';

const OAUTH_TOKEN = 'oauth';
const MAGIC_LINKS_TOKEN = 'magic_links';
const RESET_LOGIN = 'login';

const LoginWithToken = (token: string) => {};

function selectProvider(stytch_token_type: string) {
  if (stytch_token_type === OAUTH_TOKEN) return 'STYTCH_OAUTH';
  else if (stytch_token_type && [MAGIC_LINKS_TOKEN, RESET_LOGIN].includes(stytch_token_type))
    return 'STYTCH_MAGICLINK';
}
const Authenticate = () => {
  const router = useRouter();
  const [mutateFunction, { data, loading, error }] = useMutation(LOGIN_WITH_TOKEN);
  useEffect(() => {
    if (!router?.query) {
      return;
    }
    const stytch_token_type = router?.query?.stytch_token_type?.toString() || '';
    const token = router?.query?.token?.toString();
    const provider = selectProvider(stytch_token_type);
    if (token && provider) {
      const result = mutateFunction({
        variables: { provider, token },
        onCompleted: (result) => {
          console.log(`Set Token: ${result?.loginWithToken?.token}`);
          localStorage.setItem('token', result?.loginWithToken?.token);
          router.replace('/dashboard');
        },
        onError: (error) => {
          router.replace('/?error=' + JSON.stringify(error));
        },
      });
    }
  }, [router, mutateFunction]);

  return null;
};

export default Authenticate;
