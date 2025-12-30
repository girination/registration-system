'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, initializeFirestore } from 'firebase/firestore'

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function initializeFirebase() {
  // If the public API key is missing, avoid initializing Firebase during build/prerender.
  // This prevents build-time errors (like `auth/invalid-api-key`) when env vars are not set.
  if (!firebaseConfig.apiKey) {
    console.warn('Firebase API key (NEXT_PUBLIC_FIREBASE_API_KEY) is not set; skipping Firebase initialization.');
    // Return lightweight no-op stubs so server-side code and prerenders don't crash.
    return {
      firebaseApp: {} as FirebaseApp,
      auth: {} as any,
      firestore: {} as any,
    };
  }

  if (!getApps().length) {
    const firebaseApp = initializeApp(firebaseConfig);
    return getSdks(firebaseApp);
  }

  // If already initialized, return the SDKs with the already initialized App
  return getSdks(getApp());
}

export function getSdks(firebaseApp: FirebaseApp) {
  // The `initializeFirestore` function is used here to configure experimental settings.
  // Using `getFirestore()` directly does not allow for these configurations.
  // The `experimentalForceLongPolling` setting is crucial in environments where
  // WebSockets may be restricted, ensuring a reliable connection via long-polling.
  const firestore = initializeFirestore(firebaseApp, {
    experimentalForceLongPolling: true,
  });

  return {
    firebaseApp,
    auth: getAuth(firebaseApp),
    firestore: firestore
  };
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';