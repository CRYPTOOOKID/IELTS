import React, { createContext, useState, useEffect, useContext } from 'react';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  sendEmailVerification,
  updateProfile,
  sendPasswordResetEmail,
  getRedirectResult
} from 'firebase/auth';
import { auth, googleProvider } from '../../firebase/config';
import logger from '../../utils/logger';

// Create the authentication context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component that wraps the app and makes auth object available
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is authenticated on initial load and listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // Convert Firebase user to our expected format
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          emailVerified: firebaseUser.emailVerified,
          photoURL: firebaseUser.photoURL,
          // Adding some Cognito-like properties for compatibility
          attributes: {
            email: firebaseUser.email,
            name: firebaseUser.displayName,
            email_verified: firebaseUser.emailVerified
          },
          isSignedIn: true
        });
      } else {
        setUser(null);
      }
      setLoading(false);
      setError(null);
    });

    // Check for redirect result (in case fallback redirect was used)
    const checkRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          console.log('Google Sign-In redirect successful:', result.user);
          // The user state will be updated automatically by onAuthStateChanged
        }
      } catch (error) {
        console.error('Redirect result error:', error);
        setError(error.message);
      }
    };

    checkRedirectResult();

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Function to check the current authentication state
  const checkAuthState = async () => {
    try {
      setLoading(true);
      // Firebase automatically handles this through onAuthStateChanged
      // This function is kept for API compatibility
      const currentUser = auth.currentUser;
      if (currentUser) {
        setUser({
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName,
          emailVerified: currentUser.emailVerified,
          photoURL: currentUser.photoURL,
          attributes: {
            email: currentUser.email,
            name: currentUser.displayName,
            email_verified: currentUser.emailVerified
          },
          isSignedIn: true
        });
      } else {
        setUser(null);
      }
      setError(null);
    } catch (err) {
      setUser(null);
      logger.error('Error checking auth state:', err);
    } finally {
      setLoading(false);
    }
  };

  // Sign in function
  const signIn = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Check if email is verified
      if (!firebaseUser.emailVerified) {
        throw {
          code: 'UserNotConfirmedException',
          message: 'User is not confirmed. Please check your email for verification.'
        };
      }
      
      // Return result in Cognito-like format for compatibility
      const result = {
        isSignedIn: true,
        user: {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          emailVerified: firebaseUser.emailVerified,
          attributes: {
            email: firebaseUser.email,
            name: firebaseUser.displayName,
            email_verified: firebaseUser.emailVerified
          }
        }
      };
      
      return result;
    } catch (err) {
      // Convert Firebase errors to more user-friendly messages
      let errorMessage = err.message;
      if (err.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email address.';
      } else if (err.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password.';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address.';
      } else if (err.code === 'auth/user-disabled') {
        errorMessage = 'This account has been disabled.';
      } else if (err.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed login attempts. Please try again later.';
      }
      
      const error = { ...err, message: errorMessage };
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign up function
  const signUp = async (email, password, name) => {
    try {
      setLoading(true);
      setError(null);
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Update the user's display name
      if (name) {
        await updateProfile(firebaseUser, { displayName: name });
      }
      
      // Send email verification
      await sendEmailVerification(firebaseUser);
      
      // Return result in Cognito-like format for compatibility
      const result = {
        user: {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: name,
          emailVerified: false
        },
        nextStep: {
          signUpStep: 'CONFIRM_SIGN_UP'
        }
      };
      
      return result;
    } catch (err) {
      // Convert Firebase errors to more user-friendly messages
      let errorMessage = err.message;
      if (err.code === 'auth/email-already-in-use') {
        errorMessage = 'An account with this email already exists.';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address.';
      } else if (err.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Please choose a stronger password.';
      }
      
      const error = { ...err, message: errorMessage };
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Confirm sign up function (Firebase doesn't use codes, but we'll simulate for compatibility)
  const confirmSignUp = async (email, code) => {
    try {
      setLoading(true);
      setError(null);
      
      // In Firebase, email verification happens automatically when user clicks the link
      // For compatibility, we'll just check if the current user's email is verified
      await auth.currentUser?.reload();
      const currentUser = auth.currentUser;
      
      if (currentUser && currentUser.emailVerified) {
        return {
          isSignUpComplete: true,
          user: {
            uid: currentUser.uid,
            email: currentUser.email,
            displayName: currentUser.displayName,
            emailVerified: true
          }
        };
      } else {
        throw {
          code: 'CodeMismatchException',
          message: 'Please click the verification link in your email first, then try signing in.'
        };
      }
    } catch (err) {
      const error = { 
        ...err, 
        message: err.message || 'Email verification failed. Please check your email and click the verification link.'
      };
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      setLoading(true);
      setError(null);
      await firebaseSignOut(auth);
      setUser(null);
    } catch (err) {
      const errorMessage = 'Failed to sign out. Please try again.';
      setError(errorMessage);
      throw { ...err, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Resend confirmation code (send email verification)
  const resendConfirmationCode = async (email) => {
    try {
      setLoading(true);
      setError(null);
      
      const currentUser = auth.currentUser;
      if (currentUser) {
        await sendEmailVerification(currentUser);
      } else {
        throw new Error('No user is currently signed in');
      }
    } catch (err) {
      const errorMessage = 'Failed to resend verification email. Please try again.';
      setError(errorMessage);
      throw { ...err, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Password reset function (new functionality)
  const resetPassword = async (email) => {
    try {
      setLoading(true);
      setError(null);
      await sendPasswordResetEmail(auth, email);
    } catch (err) {
      let errorMessage = err.message;
      if (err.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email address.';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address.';
      }
      
      const error = { ...err, message: errorMessage };
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Google Sign-In function
  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Enhanced debugging
      console.log('Starting Google Sign-In...');
      console.log('Current URL:', window.location.origin);
      console.log('Auth instance:', auth);
      console.log('Google provider:', googleProvider);
      console.log('Provider custom parameters:', googleProvider.customParameters);
      console.log('Provider scopes:', googleProvider.scopes);
      
      // Validate auth configuration
      if (!auth || !googleProvider) {
        throw new Error('Firebase auth or Google provider not properly initialized');
      }
      
      // First try popup method
      let result;
      try {
        console.log('Attempting popup sign-in...');
        result = await signInWithPopup(auth, googleProvider);
        console.log('Popup sign-in successful');
      } catch (popupError) {
        console.log('Popup failed, error details:', {
          code: popupError.code,
          message: popupError.message,
          stack: popupError.stack
        });
        
        // If popup fails, try redirect method as fallback
        if (popupError.code === 'auth/popup-blocked' || 
            popupError.code === 'auth/popup-closed-by-user' ||
            popupError.code === 'auth/cancelled-popup-request' ||
            popupError.code === 'auth/internal-error') {
          
          console.log('Trying redirect method as fallback...');
          // Import signInWithRedirect dynamically to avoid issues
          const { signInWithRedirect } = await import('firebase/auth');
          await signInWithRedirect(auth, googleProvider);
          return; // Redirect will handle the rest
        } else {
          throw popupError; // Re-throw if it's not a popup-specific error
        }
      }
      
      const firebaseUser = result.user;
      
      console.log('Google Sign-In successful:', {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        emailVerified: firebaseUser.emailVerified
      });
      
      // Return result in Cognito-like format for compatibility
      const authResult = {
        isSignedIn: true,
        user: {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          emailVerified: firebaseUser.emailVerified,
          photoURL: firebaseUser.photoURL,
          attributes: {
            email: firebaseUser.email,
            name: firebaseUser.displayName,
            email_verified: firebaseUser.emailVerified,
            picture: firebaseUser.photoURL
          }
        }
      };
      
      return authResult;
    } catch (err) {
      console.error('Google Sign-In Error Details:', {
        code: err.code,
        message: err.message,
        stack: err.stack,
        name: err.name
      });
      
      // Convert Firebase errors to more user-friendly messages
      let errorMessage = err.message;
      if (err.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Sign-in was cancelled by closing the popup window.';
      } else if (err.code === 'auth/popup-blocked') {
        errorMessage = 'Pop-up was blocked by your browser. Please allow pop-ups for this site and try again.';
      } else if (err.code === 'auth/cancelled-popup-request') {
        errorMessage = 'Another sign-in popup is already open. Please close it and try again.';
      } else if (err.code === 'auth/account-exists-with-different-credential') {
        errorMessage = 'An account already exists with the same email address but different sign-in credentials.';
      } else if (err.code === 'auth/internal-error') {
        errorMessage = 'Internal error occurred. This might be a configuration issue. Please try again.';
      } else if (err.code === 'auth/configuration-not-found') {
        errorMessage = 'Google Sign-In configuration is missing. Please contact support.';
      } else if (err.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your internet connection and try again.';
      } else if (err.code === 'auth/unauthorized-domain') {
        errorMessage = 'This domain is not authorized for Google Sign-In. Please contact support.';
      } else if (err.code === 'auth/operation-not-allowed') {
        errorMessage = 'Google Sign-In is not enabled for this project. Please contact support.';
      } else if (err.message.includes('popup') || err.message.includes('Popup')) {
        errorMessage = 'Pop-up sign-in failed. Please try again or check your browser settings.';
      } else if (err.message.includes('configuration') || err.message.includes('not properly initialized')) {
        errorMessage = 'Google Sign-In is not properly configured. Please contact support.';
      }
      
      const error = { ...err, message: errorMessage };
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Value object that will be passed to consumers of this context
  const value = {
    user,
    loading,
    error,
    signIn,
    signUp,
    confirmSignUp,
    signOut,
    resendConfirmationCode,
    resetPassword,
    signInWithGoogle, // Google Sign-In function
    checkAuthState
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};