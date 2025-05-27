import React, { createContext, useState, useEffect, useContext } from 'react';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithRedirect,
  signInWithPopup,
  getRedirectResult,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  sendEmailVerification,
  updateProfile,
  sendPasswordResetEmail
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

  // Handle Google Sign-In redirect result (define this before useEffect)
  const handleGoogleRedirectResult = async () => {
    try {
      console.log('Checking for Google Sign-In redirect result...');
      console.log('Session storage googleSignInAttempt:', sessionStorage.getItem('googleSignInAttempt'));
      console.log('Current URL:', window.location.href);
      
      const result = await getRedirectResult(auth);
      console.log('Raw redirect result:', result);
      
      if (result) {
        // User successfully signed in via redirect
        const firebaseUser = result.user;
        console.log('Google Sign-In successful via redirect:', firebaseUser);
        
        // Clear the session storage since we're successful
        sessionStorage.removeItem('googleSignInAttempt');
        sessionStorage.removeItem('redirectAfterAuth');
        
        // Manually update the user state immediately
        const userObj = {
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
          },
          isSignedIn: true
        };
        
        console.log('Setting user state manually:', userObj);
        setUser(userObj);
        
        // Set loading to false since we're done
        setLoading(false);
        setError(null);
        
        // Return result in Cognito-like format for compatibility
        const authResult = {
          isSignedIn: true,
          user: userObj
        };
        
        return authResult;
      } else {
        // Check if we were expecting a redirect result
        const wasGoogleSignInAttempt = sessionStorage.getItem('googleSignInAttempt');
        if (wasGoogleSignInAttempt) {
          console.warn('Expected Google Sign-In redirect result but got null');
          console.log('This might indicate a redirect issue or domain not authorized');
          // Don't clear the session storage yet, maybe the result is still coming
        }
      }
      
      // No redirect result (normal page load)
      return null;
      
    } catch (err) {
      console.error('Google Sign-In Redirect Error:', err);
      console.error('Error code:', err.code);
      console.error('Error message:', err.message);
      
      // Clear session storage on error
      sessionStorage.removeItem('googleSignInAttempt');
      sessionStorage.removeItem('redirectAfterAuth');
      
      // Convert Firebase errors to more user-friendly messages
      let errorMessage = err.message;
      if (err.code === 'auth/account-exists-with-different-credential') {
        errorMessage = 'An account already exists with the same email address but different sign-in credentials.';
      } else if (err.code === 'auth/internal-error') {
        errorMessage = 'Google Sign-In is not properly configured. Please contact support.';
      } else if (err.code === 'auth/configuration-not-found') {
        errorMessage = 'Google Sign-In configuration is missing. Please contact support.';
      } else if (err.code === 'auth/unauthorized-domain') {
        const currentDomain = window.location.hostname;
        errorMessage = `This domain (${currentDomain}) is not authorized for Google Sign-In. Please contact the administrator to add this domain to Firebase Console under Authentication → Settings → Authorized domains.`;
        console.error('Unauthorized domain error. Domain needs to be added to Firebase Console:', currentDomain);
      }
      
      const error = { ...err, message: errorMessage };
      setError(error.message);
      setLoading(false);
      throw error;
    }
  };

  // Check if user is authenticated on initial load and listen for auth state changes
  useEffect(() => {
    console.log('AuthContext useEffect: Setting up auth state listener');
    
    // Log domain information for debugging
    console.log('🔍 Domain Debug Info:');
    console.log('- Current hostname:', window.location.hostname);
    console.log('- Current origin:', window.location.origin);
    console.log('- Current href:', window.location.href);
    console.log('- Firebase auth domain:', auth.config.authDomain);
    console.log('- Expected domains: spinta.org, www.spinta.org, localhost');
    
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      console.log('Auth state changed:', firebaseUser ? `User: ${firebaseUser.email}` : 'No user');
      
      if (firebaseUser) {
        // Convert Firebase user to our expected format
        const userObj = {
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
        };
        
        console.log('Setting user in AuthContext:', userObj);
        setUser(userObj);
      } else {
        console.log('Clearing user in AuthContext');
        setUser(null);
      }
      setLoading(false);
      setError(null);
    });

    // Check for Google Sign-In redirect result when the component mounts
    const checkRedirectResult = async () => {
      try {
        console.log('Checking for redirect result...');
        const result = await handleGoogleRedirectResult();
        if (result) {
          console.log('Redirect result found:', result);
        } else {
          console.log('No redirect result found');
          
          // If no redirect result but we had a Google Sign-In attempt, check current auth state
          const wasGoogleSignInAttempt = sessionStorage.getItem('googleSignInAttempt');
          if (wasGoogleSignInAttempt) {
            console.log('Google Sign-In attempt detected - checking current auth state...');
            const currentUser = auth.currentUser;
            if (currentUser) {
              console.log('Found authenticated user in Firebase auth:', currentUser);
              // Manually trigger the auth state
              const userObj = {
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
              };
              
              console.log('Manually setting user state from current auth:', userObj);
              setUser(userObj);
              setLoading(false);
              sessionStorage.removeItem('googleSignInAttempt');
            } else {
              console.log('No current user found - clearing stuck session storage');
              // If we had a sign-in attempt but no user and no redirect result, clear the session
              sessionStorage.removeItem('googleSignInAttempt');
              sessionStorage.removeItem('redirectAfterAuth');
              
              // For localhost development, show helpful message
              if (window.location.hostname === 'localhost') {
                console.warn('🚨 LOCALHOST GOOGLE SIGN-IN ISSUE:');
                console.warn('This might be because:');
                console.warn('1. localhost is not added to Firebase Console authorized domains');
                console.warn('2. Google Sign-In redirect doesn\'t work well in development');
                console.warn('3. Try testing in production (spinta.org) instead');
                
                setError('Google Sign-In redirect failed. This is common in localhost development. Please try in production or use email/password sign-in for testing.');
              }
            }
          }
        }
      } catch (error) {
        console.error('Error handling redirect result:', error);
        setLoading(false);
      }
    };

    checkRedirectResult();

    // Cleanup subscription on unmount
    return () => {
      console.log('AuthContext useEffect: Cleaning up auth state listener');
      unsubscribe();
    };
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

  // Google Sign-In function (popup for localhost, redirect for production)
  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Log for debugging
      console.log('Starting Google Sign-In...');
      console.log('Current domain:', window.location.hostname);
      console.log('Current URL:', window.location.href);
      
      const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      
      if (isLocalhost) {
        console.log('🔧 Using popup method for localhost development');
        // Use popup for localhost development
        try {
          const result = await signInWithPopup(auth, googleProvider);
          const firebaseUser = result.user;
          
          console.log('Google Sign-In successful via popup:', firebaseUser);
          
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
          
          setLoading(false);
          return authResult;
          
        } catch (popupError) {
          console.error('Popup method failed, falling back to redirect:', popupError);
          // Fall back to redirect if popup fails
        }
      }
      
      console.log('🌐 Using redirect method for production');
      // Store the current path to return to after redirect
      sessionStorage.setItem('redirectAfterAuth', '/skills');
      sessionStorage.setItem('googleSignInAttempt', 'true');
      
      // Redirect to Google sign-in (this will leave the page)
      await signInWithRedirect(auth, googleProvider);
      
      // Note: This function will not continue past this point for redirect
      
    } catch (err) {
      console.error('Google Sign-In Error:', err);
      console.error('Error code:', err.code);
      console.error('Error message:', err.message);
      console.error('Current domain:', window.location.hostname);
      
      // Clear the session storage on error
      sessionStorage.removeItem('googleSignInAttempt');
      sessionStorage.removeItem('redirectAfterAuth');
      
      // Convert Firebase errors to more user-friendly messages
      let errorMessage = err.message;
      if (err.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Sign-in was cancelled.';
      } else if (err.code === 'auth/popup-blocked') {
        errorMessage = 'Browser blocked the sign-in popup. Please allow popups and try again.';
      } else if (err.code === 'auth/cancelled-popup-request') {
        errorMessage = 'Only one sign-in request at a time is allowed.';
      } else if (err.code === 'auth/account-exists-with-different-credential') {
        errorMessage = 'An account already exists with the same email address but different sign-in credentials.';
      } else if (err.code === 'auth/internal-error') {
        errorMessage = 'Google Sign-In is not properly configured. Please contact support.';
      } else if (err.code === 'auth/configuration-not-found') {
        errorMessage = 'Google Sign-In configuration is missing. Please contact support.';
      } else if (err.code === 'auth/unauthorized-domain') {
        const currentDomain = window.location.hostname;
        errorMessage = `This domain (${currentDomain}) is not authorized for Google Sign-In. Please contact the administrator to add this domain to Firebase Console under Authentication → Settings → Authorized domains.`;
        console.error('Unauthorized domain error. Domain needs to be added to Firebase Console:', currentDomain);
      }
      
      const error = { ...err, message: errorMessage };
      setError(error.message);
      setLoading(false);
      throw error;
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
    handleGoogleRedirectResult, // Google Sign-In redirect result handler
    checkAuthState
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};