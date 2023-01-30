// Import FirebaseAuth and firebase.
import React, { useEffect, useState } from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { useMutation } from '@apollo/client';
import { LOGIN_WITH_TOKEN } from 'graphql/login';
import { useRouter } from 'next/router';

// Configure Firebase.
const config = {
  // eslint-disable-next-line turbo/no-undeclared-env-vars
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_APIKEY || '',
  // eslint-disable-next-line turbo/no-undeclared-env-vars
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTHDOMAIN || '',
  // ...
};
firebase.initializeApp(config);

// Configure FirebaseUI.
const uiConfig = {
  // Popup signin flow rather than redirect flow.
  signInFlow: 'popup',
  // We will display Google and Facebook as auth providers.
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
  ],
  callbacks: {
    // Avoid redirects after sign-in.
    signInSuccessWithAuthResult: () => false,
  },
};

function SignInScreen() {
  const [token, setToken] = useState(''); // Local signed-in state.
  const router = useRouter();
  const [mutateFunction, { data, loading, error }] = useMutation(LOGIN_WITH_TOKEN);

  // Listen to the Firebase Auth state and set the local state.
  useEffect(() => {
    const unregisterAuthObserver = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        user
          .getIdToken(/* forceRefresh */ true)
          .then(function (idToken) {
            console.log(JSON.stringify(idToken));
            setToken(idToken);
          })
          .catch(function (error) {
            // Handle error
          });
      } else {
        setToken('');
      }
    });
    return () => unregisterAuthObserver(); // Make sure we un-register Firebase observers when the component unmounts.
  }, []);

  // Listen to the Firebase Auth state and set the local state.
  useEffect(() => {
    if (token?.length) {
      const result = mutateFunction({
        variables: { provider: 'FIREBASE', token },
        onCompleted: (result) => {
          console.log(`Set Token: ${result?.loginWithToken?.token}`);
          localStorage.setItem('token', result?.loginWithToken?.token);
          router.replace('/dashboard');
        },
        onError: (error) => {
          setToken('');
          router.replace('/?error=' + JSON.stringify(error));
        },
      });
    }
  }, [mutateFunction, router, token]);

  if (!token?.length) {
    return <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />;
  }
  return (
    <div>
      <h1>My App</h1>
      <p>Welcome {firebase.auth().currentUser.displayName}! You are now signed-in!</p>
      <a onClick={() => firebase.auth().signOut()}>Sign-out</a>
    </div>
  );
}

export default SignInScreen;
