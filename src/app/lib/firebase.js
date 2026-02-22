// Importing of the tools we need from the firebase package 
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

//importing of authentication tool from firebase
import { getAuth } from "firebase/auth";

// config from firebase - pulls it from .env file
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// App Initialisation
const app = initializeApp(firebaseConfig);

// Initialising the Database and export it so the web app can use it
export const db = getFirestore(app);

// Initialize Authentication and export it
export const auth = getAuth(app);