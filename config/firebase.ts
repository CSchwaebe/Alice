// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";

// SECURITY NOTE: These values are publicly visible in the client-side code.
// Protect your application by:
// 1. Setting up proper Firebase Security Rules
// 2. Using Firebase Authentication
// 3. Restricting database access patterns
// 4. Using server-side API routes for sensitive operations
const firebaseConfig = {
  // These values are public and required for client-side Firebase initialization
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const firestore = getFirestore(app);

export { app, database, firestore }; 

