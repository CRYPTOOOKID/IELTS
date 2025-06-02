// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCgAitlVk2b1w9_Gfhgnc9sj3RSgF0pL7k",
  authDomain: "spinta-84f45.firebaseapp.com",
  projectId: "spinta-84f45",
  storageBucket: "spinta-84f45.firebasestorage.app",
  messagingSenderId: "432133633217",
  appId: "1:432133633217:web:b8a9b97671bfc3be4c1040",
  measurementId: "G-XVC30ZDSHQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Google Auth Provider with proper configuration
export const googleProvider = new GoogleAuthProvider();

// Add required scopes for Google Sign-In
googleProvider.addScope('email');
googleProvider.addScope('profile');

// Set custom parameters for better UX
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Export analytics if needed
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export default app; 