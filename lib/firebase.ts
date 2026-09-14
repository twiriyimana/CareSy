
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getApp,
  getApps,
  initializeApp,
} from "firebase/app";

import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";

import { getFirestore } from "firebase/firestore";

import { Platform } from "react-native";

/* =====================================================
   FIREBASE CONFIGURATION
===================================================== */

const firebaseConfig = {
  apiKey:
    process.env.EXPO_PUBLIC_FIREBASE_API_KEY,

  authDomain:
    process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,

  projectId:
    process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,

  messagingSenderId:
    process.env
      .EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,

  appId:
    process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

/* =====================================================
   CHECK FIREBASE CONFIGURATION
===================================================== */

export const firebaseConfigured =
  Boolean(
    firebaseConfig.apiKey &&
      firebaseConfig.projectId &&
      firebaseConfig.appId
  );

/* =====================================================
   INITIALIZE FIREBASE APP
===================================================== */

export const app =
  firebaseConfigured
    ? getApps().length
      ? getApp()
      : initializeApp(
          firebaseConfig
        )
    : null;

/* =====================================================
   FIREBASE AUTHENTICATION
===================================================== */

export const auth = app
  ? (() => {
      try {
        /*
         * Web
         */
        if (Platform.OS === "web") {
          return getAuth(app);
        }

        /*
         * Android / iOS
         * Persist login using AsyncStorage.
         */
        return initializeAuth(
          app,
          {
            persistence:
              getReactNativePersistence(
                AsyncStorage
              ),
          }
        );
      } catch {
        /*
         * Auth may already have been
         * initialized.
         */
        return getAuth(app);
      }
    })()
  : undefined;

/* =====================================================
   FIRESTORE DATABASE
===================================================== */

export const db =
  app
    ? getFirestore(app)
    : undefined;
