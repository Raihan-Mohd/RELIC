// Importing of the tools we need from the firebase package 
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

//importing of authentication tool from firebase
import { getAuth } from "firebase/auth";

// config from firebase
const firebaseConfig = {
  apiKey: "AIzaSyBRCBNyAavyDpEEBqxUxWuUemc9_rO33jE",
  authDomain: "relic-store.firebaseapp.com",
  projectId: "relic-store",
  storageBucket: "relic-store.firebasestorage.app",
  messagingSenderId: "314569658630",
  appId: "1:314569658630:web:82a9239fbb739100580e87"
};

// App Initialisation
const app = initializeApp(firebaseConfig);

// Initialising the Database and export it so the web app can use it
export const db = getFirestore(app);

// Initialize Authentication and export it
export const auth = getAuth(app);