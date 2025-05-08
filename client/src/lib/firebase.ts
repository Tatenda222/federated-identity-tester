import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Setup providers
export const googleProvider = new GoogleAuthProvider();

// Login functions
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google", error);
    throw error;
  }
};

export const loginWithProvider = async (provider: string) => {
  switch (provider) {
    case 'google':
      return signInWithGoogle();
    case 'federated':
      // This would connect to your main application's identity provider
      // For now, we'll use Google as a stand-in
      return signInWithGoogle();
    default:
      throw new Error(`Provider ${provider} not supported`);
  }
};

// Handle redirect result (for mobile devices)
export const handleRedirectResult = async () => {
  try {
    const result = await getRedirectResult(auth);
    return result?.user;
  } catch (error) {
    console.error("Error handling redirect result", error);
    throw error;
  }
};

// Logout function
export const logout = async () => {
  try {
    await auth.signOut();
  } catch (error) {
    console.error("Error signing out", error);
    throw error;
  }
};