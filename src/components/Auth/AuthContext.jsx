import React, { createContext, useState, useEffect, useContext } from 'react';
import { Amplify } from 'aws-amplify';
import * as Auth from 'aws-amplify/auth';
import logger from '../../utils/logger';

// AWS Configuration using environment variables
const awsConfig = {
  Auth: {
    Cognito: {
      region: import.meta.env.VITE_AWS_REGION || 'us-east-1',
      userPoolId: import.meta.env.VITE_AWS_USER_POOL_ID,
      userPoolClientId: import.meta.env.VITE_AWS_USER_POOL_CLIENT_ID,
      loginWith: {
        oauth: {
          domain: import.meta.env.VITE_AWS_OAUTH_DOMAIN,
          scopes: ['email', 'openid', 'profile'],
          redirectSignIn: import.meta.env.VITE_AWS_REDIRECT_SIGN_IN || window.location.origin,
          redirectSignOut: import.meta.env.VITE_AWS_REDIRECT_SIGN_OUT || window.location.origin,
          responseType: 'code'
        }
      }
    }
  }
};

// Only configure Amplify if we have the required environment variables
if (import.meta.env.VITE_AWS_USER_POOL_ID && import.meta.env.VITE_AWS_USER_POOL_CLIENT_ID) {
  Amplify.configure(awsConfig);
} else {
  logger.warn('AWS configuration missing. Set VITE_AWS_USER_POOL_ID and VITE_AWS_USER_POOL_CLIENT_ID environment variables.');
}

// Create the authentication context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component that wraps the app and makes auth object available
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is authenticated on initial load
  useEffect(() => {
    checkAuthState();
  }, []);

  // Function to check the current authentication state
  const checkAuthState = async () => {
    try {
      setLoading(true);
      const currentUser = await Auth.getCurrentUser();
      setUser(currentUser);
      setError(null);
    } catch (err) {
      setUser(null);
      // Don't set error at all for unauthenticated users - this is an expected state
      // for new users or logged out users
    } finally {
      setLoading(false);
    }
  };

  // Sign in function
  const signIn = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const result = await Auth.signIn({
        username: email,
        password
      });
      
      if (result.isSignedIn) {
        await checkAuthState();
      }
      
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Sign up function
  const signUp = async (email, password, name) => {
    try {
      setLoading(true);
      setError(null);
      const result = await Auth.signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
            name
          }
        }
      });
      
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Confirm sign up function
  const confirmSignUp = async (email, code) => {
    try {
      setLoading(true);
      setError(null);
      const result = await Auth.confirmSignUp({
        username: email,
        confirmationCode: code
      });
      
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      setLoading(true);
      setError(null);
      await Auth.signOut();
      setUser(null);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Resend confirmation code
  const resendConfirmationCode = async (email) => {
    try {
      setLoading(true);
      setError(null);
      await Auth.resendSignUpCode({
        username: email
      });
    } catch (err) {
      setError(err.message);
      throw err;
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
    checkAuthState
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};