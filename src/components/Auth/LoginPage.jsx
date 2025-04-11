import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Eye, EyeOff, User, Mail, Lock, AlertTriangle, CheckCircle } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('signup');
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-xl">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Confirm Your Account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              We've sent a confirmation code to your email
            </p>
          </div>
          
          {successMessage && (
            <div className="bg-green-50 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative flex items-center" role="alert">
              <CheckCircle size={18} className="mr-2 text-green-500" />
              <span className="block sm:inline">{successMessage}</span>
            </div>
          )}
          
          {displayError && (
            <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative flex items-center" role="alert">
              <AlertTriangle size={18} className="mr-2 text-red-500" />
              <span className="block sm:inline">{displayError}</span>
            </div>
          )}
          
          <form className="mt-8 space-y-6" onSubmit={handleConfirmSignUp}>
            <div className="rounded-md shadow-sm -space-y-px">
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
                  className="appearance-none rounded-t-lg relative block w-full pl-10 px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="code"
                  name="code"
                  type="text"
                  required
                  className="appearance-none rounded-b-lg relative block w-full pl-10 px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Confirmation Code"
                  value={formData.code}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <button
                  type="button"
                  onClick={handleResendCode}
                  className="font-medium text-blue-600 hover:text-blue-500 inline-flex items-center"
                >
                  <Mail size={16} className="mr-1" />
                  Resend confirmation code
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-md transform transition-all duration-150 hover:shadow-lg hover:-translate-y-0.5"
              >
                {loading ? 'Confirming...' : 'Confirm Account'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            IELTS Mastery
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {activeTab === 'signin' ? 'Sign in to your account' : 'Create a new account'}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-4">
          <button
            className={`flex-1 py-3 px-4 text-center font-medium text-base transition-all duration-200 ${
              activeTab === 'signin'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('signin')}
          >
            Sign In
          </button>
          <button
            className={`flex-1 py-3 px-4 text-center font-medium text-base transition-all duration-200 ${
              activeTab === 'signup'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('signup')}
          >
            Register
          </button>
        </div>

        {successMessage && (
          <div className="bg-green-50 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative flex items-center" role="alert">
            <CheckCircle size={18} className="mr-2 text-green-500" />
            <span className="block sm:inline">{successMessage}</span>
          </div>
        )}

        {displayError && (
          <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative flex items-center" role="alert">
            <AlertTriangle size={18} className="mr-2 text-red-500" />
            <span className="block sm:inline">{displayError}</span>
          </div>
        )}

        {/* Sign In Form */}
        {activeTab === 'signin' && (
          <form className="mt-8 space-y-6" onSubmit={handleSignIn}>
            <div className="rounded-md shadow-sm -space-y-px">
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
                  className="appearance-none rounded-t-lg relative block w-full pl-10 px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showSignInPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-b-lg relative block w-full pl-10 pr-10 px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowSignInPassword(!showSignInPassword)}
                >
                  {showSignInPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-md transform transition-all duration-150 hover:shadow-lg hover:-translate-y-0.5"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>
        )}

        {/* Sign Up Form */}
        {activeTab === 'signup' && (
          <form className="mt-8 space-y-6" onSubmit={handleSignUp}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  className="appearance-none rounded-t-lg relative block w-full pl-10 px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
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
                  className="appearance-none relative block w-full pl-10 px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showSignUpPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  className="appearance-none relative block w-full pl-10 pr-10 px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                >
                  {showSignUpPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  )}
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="appearance-none rounded-b-lg relative block w-full pl-10 px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="text-sm text-gray-600">
              <p>Password must be at least 8 characters and include uppercase, lowercase, numbers, and special characters.</p>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-md transform transition-all duration-150 hover:shadow-lg hover:-translate-y-0.5"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginPage;