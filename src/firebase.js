// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
//import { secret } from '@aws-amplify/backend';

const firebaseConfig = {
  apiKey: secret('FIREBASE_API_KEY'),
  authDomain: secret('FIREBASE_AUTH_DOMAIN'),
  projectId: secret('FIREBASE_PROJECT_ID'),
  storageBucket: secret('FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: secret('FIREBASE_MESSAGING_SENDER_ID'),
  appId: secret('FIREBASE_APP_ID'),
  measurementId: secret('FIREBASE_MEASUREMENT_ID')
};
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export default app;
