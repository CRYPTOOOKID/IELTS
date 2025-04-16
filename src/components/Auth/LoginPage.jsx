import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Eye, EyeOff, User, Mail, Lock, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const tabParam = queryParams.get('tab');
  
  const [activeTab, setActiveTab] = useState(tabParam === 'signin' ? 'signin' : 'signup');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: '',
    code: ''
  });
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [displayError, setDisplayError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  
  // Use the auth context
  const { user, loading, error, signIn, signUp, confirmSignUp, resendConfirmationCode } = useAuth();

  // Redirect if user is already authenticated
  useEffect(() => {
    if (user) {
      navigate('/skills');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setDisplayError(null);
    
    try {
      await signIn(formData.email, formData.password);
      // Navigation will happen automatically in the useEffect when user state changes
    } catch (error) {
      console.error('Error signing in:', error);
      setDisplayError(error.message);
      if (error.code === 'UserNotConfirmedException') {
        setShowConfirmation(true);
      }
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setDisplayError(null);
    
    if (formData.password !== formData.confirmPassword) {
      setDisplayError('Passwords do not match');
      return;
    }

    try {
      const result = await signUp(formData.email, formData.password, formData.name);
      
      // If sign up requires confirmation, show confirmation form
      if (result && result.nextStep && result.nextStep.signUpStep === 'CONFIRM_SIGN_UP') {
        setSuccessMessage('Account created successfully! Please check your email for verification code.');
        setTimeout(() => {
          setShowConfirmation(true);
          setSuccessMessage(null);
        }, 2000);
      }
    } catch (error) {
      console.error('Error signing up:', error);
      setDisplayError(error.message);
    }
  };

  const handleConfirmSignUp = async (e) => {
    e.preventDefault();
    setDisplayError(null);
    
    try {
      const result = await confirmSignUp(formData.email, formData.code);
      
      // If confirmation is complete, try to sign in
      if (result && result.isSignUpComplete) {
        setSuccessMessage('Account confirmed successfully!');
        try {
          await signIn(formData.email, formData.password);
          // Navigation will happen automatically in the useEffect when user state changes
        } catch (signInError) {
          setDisplayError('Confirmation successful. Please sign in.');
          setShowConfirmation(false);
          setActiveTab('signin');
        }
      }
    } catch (error) {
      console.error('Error confirming sign up:', error);
      setDisplayError(error.message);
    }
  };

  const handleResendCode = async () => {
    try {
      await resendConfirmationCode(formData.email);
      setSuccessMessage('Confirmation code resent successfully');
    } catch (error) {
      console.error('Error resending code:', error);
      setDisplayError(error.message);
    }
  };

  // Render confirmation form
  if (showConfirmation) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
              Verify Your Account
            </h2>
            <p className="mt-3 text-base text-gray-600">
              We've sent a verification code to your email
            </p>
          </div>
          
          {successMessage && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg flex items-center shadow-sm animate-fadeIn" role="alert">
              <CheckCircle size={20} className="text-green-500 mr-3 flex-shrink-0" />
              <span className="text-green-700">{successMessage}</span>
            </div>
          )}
          
          {displayError && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex items-center shadow-sm animate-fadeIn" role="alert">
              <AlertTriangle size={20} className="text-red-500 mr-3 flex-shrink-0" />
              <span className="text-red-700">{displayError}</span>
            </div>
          )}
          
          <form className="mt-8 space-y-6" onSubmit={handleConfirmSignUp}>
            <div className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none block w-full pl-10 px-3 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150"
                    placeholder="Your email address"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
                  Verification Code
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    id="code"
                    name="code"
                    type="text"
                    required
                    className="appearance-none block w-full pl-10 px-3 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150"
                    placeholder="Enter verification code"
                    value={formData.code}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={handleResendCode}
                className="text-blue-600 hover:text-blue-800 inline-flex items-center font-medium text-sm transition duration-150"
              >
                <Mail size={16} className="mr-2" />
                Resend code
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-md transform transition-all duration-150 hover:shadow-lg hover:-translate-y-0.5"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verifying...
                </span>
              ) : (
                <span className="flex items-center">
                  Verify Account
                  <ArrowRight className="ml-2 h-4 w-4" />
                </span>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
            IELTS Mastery
          </h2>
          <p className="mt-3 text-base text-gray-600">
            {activeTab === 'signin' ? 'Sign in to your account' : 'Create a new account'}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mt-8 flex rounded-lg border border-gray-200 p-1 bg-gray-50">
          <button
            className={`flex-1 py-2.5 px-4 text-center font-medium text-sm rounded-md transition-all duration-200 ${
              activeTab === 'signin'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => setActiveTab('signin')}
          >
            Sign In
          </button>
          <button
            className={`flex-1 py-2.5 px-4 text-center font-medium text-sm rounded-md transition-all duration-200 ${
              activeTab === 'signup'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => setActiveTab('signup')}
          >
            Register
          </button>
        </div>

        {successMessage && (
          <div className="mt-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-lg flex items-center shadow-sm animate-fadeIn" role="alert">
            <CheckCircle size={20} className="text-green-500 mr-3 flex-shrink-0" />
            <span className="text-green-700">{successMessage}</span>
          </div>
        )}
        
        {displayError && (
          <div className="mt-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex items-center shadow-sm animate-fadeIn" role="alert">
            <AlertTriangle size={20} className="text-red-500 mr-3 flex-shrink-0" />
            <span className="text-red-700">{displayError}</span>
          </div>
        )}

        {activeTab === 'signin' ? (
          <form className="mt-8 space-y-6" onSubmit={handleSignIn}>
            <div className="space-y-5">
              <div>
                <label htmlFor="signinEmail" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    id="signinEmail"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none block w-full pl-10 px-3 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150"
                    placeholder="Your email address"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="signinPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    id="signinPassword"
                    name="password"
                    type={showSignInPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    className="appearance-none block w-full pl-10 pr-10 px-3 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150"
                    placeholder="Your password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={() => setShowSignInPassword(!showSignInPassword)}
                      className="text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                      {showSignInPassword ? (
                        <EyeOff className="h-5 w-5" aria-hidden="true" />
                      ) : (
                        <Eye className="h-5 w-5" aria-hidden="true" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-md transform transition-all duration-150 hover:shadow-lg hover:-translate-y-0.5"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center">
                  Sign in
                  <ArrowRight className="ml-2 h-4 w-4" />
                </span>
              )}
            </button>
          </form>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSignUp}>
            <div className="space-y-5">
              <div>
                <label htmlFor="signupName" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    id="signupName"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    className="appearance-none block w-full pl-10 px-3 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150"
                    placeholder="Your full name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="signupEmail" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    id="signupEmail"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none block w-full pl-10 px-3 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150"
                    placeholder="Your email address"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="signupPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    id="signupPassword"
                    name="password"
                    type={showSignUpPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    className="appearance-none block w-full pl-10 pr-10 px-3 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                      className="text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                      {showSignUpPassword ? (
                        <EyeOff className="h-5 w-5" aria-hidden="true" />
                      ) : (
                        <Eye className="h-5 w-5" aria-hidden="true" />
                      )}
                    </button>
                  </div>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Password must be at least 8 characters and include lowercase, uppercase, numbers and symbols
                </p>
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showSignUpPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    className="appearance-none block w-full pl-10 px-3 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-md transform transition-all duration-150 hover:shadow-lg hover:-translate-y-0.5"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </span>
              ) : (
                <span className="flex items-center">
                  Create account
                  <ArrowRight className="ml-2 h-4 w-4" />
                </span>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginPage;