import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail 
} from 'firebase/auth';
import { Database, Lock, Mail } from 'lucide-react';

export default function AuthPage() {

  useEffect(() => {
    console.log('AuthPage component loaded');
  }, []);
  
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [showResetForm, setShowResetForm] = useState(false);
  
  const navigate = useNavigate();
  const auth = getAuth();

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      if (isLogin) {
        // Login
        await signInWithEmailAndPassword(auth, email, password);
        navigate('/dashboard');
      } else {
        // Sign up
        await createUserWithEmailAndPassword(auth, email, password);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(formatFirebaseError(err.code));
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await sendPasswordResetEmail(auth, email);
      setResetSent(true);
    } catch (err) {
      setError(formatFirebaseError(err.code));
    } finally {
      setLoading(false);
    }
  };

  const formatFirebaseError = (errorCode) => {
    switch (errorCode) {
      case 'auth/invalid-email':
        return 'Invalid email address';
      case 'auth/user-disabled':
        return 'This account has been disabled';
      case 'auth/user-not-found':
        return 'No account found with this email';
      case 'auth/wrong-password':
        return 'Incorrect password';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters';
      case 'auth/too-many-requests':
        return 'Too many unsuccessful login attempts. Please try again later';
      default:
        return 'An error occurred. Please try again';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto p-4 flex items-center">
          <Database className="text-blue-600 mr-2" />
          <h1 className="text-xl font-semibold text-gray-800">SQL Data Analysis AI</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 border border-gray-200">
          {/* Title */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">
              {showResetForm ? 'Reset Password' : (isLogin ? 'Welcome Back' : 'Create Account')}
            </h2>
            {!showResetForm && (
              <p className="mt-2 text-gray-600">
                {isLogin 
                  ? 'Sign in to access your SQL data analysis tools' 
                  : 'Sign up to get started with SQL data analysis'}
              </p>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          {/* Reset Password Success Message */}
          {resetSent && (
            <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md text-sm">
              Password reset email sent! Please check your inbox.
            </div>
          )}

          {showResetForm ? (
            /* Password Reset Form */
            <form onSubmit={handlePasswordReset} className="space-y-4">
              <div className="space-y-1">
                <label htmlFor="reset-email" className="text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <Mail size={18} />
                  </div>
                  <input
                    id="reset-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 px-4 rounded-md text-white font-medium 
                  ${loading 
                    ? 'bg-blue-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 transition'}`}
              >
                {loading ? 'Processing...' : 'Send Reset Link'}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setShowResetForm(false)}
                  className="text-sm text-blue-600 hover:text-blue-800 transition"
                >
                  Back to sign in
                </button>
              </div>
            </form>
          ) : (
            /* Login/Signup Form */
            <form onSubmit={handleAuth} className="space-y-4">
              <div className="space-y-1">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <Mail size={18} />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Password
                  </label>
                  {isLogin && (
                    <button
                      type="button"
                      onClick={() => setShowResetForm(true)}
                      className="text-xs text-blue-600 hover:text-blue-800 transition"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <Lock size={18} />
                  </div>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="••••••••"
                    minLength={6}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 px-4 rounded-md text-white font-medium 
                  ${loading 
                    ? 'bg-blue-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 transition'}`}
              >
                {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
              </button>
            </form>
          )}

          {/* Toggle Between Login and Signup */}
          {!showResetForm && (
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="ml-1 text-blue-600 hover:text-blue-800 transition font-medium"
                >
                  {isLogin ? "Sign up" : "Sign in"}
                </button>
              </p>
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="mt-12 w-full max-w-4xl">
          <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">
            Why use SQL Data Analysis AI?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h4 className="font-medium text-lg text-gray-800 mb-2">Natural Language Queries</h4>
              <p className="text-gray-600">
                Ask questions about your data in plain English, and get SQL queries automatically generated.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h4 className="font-medium text-lg text-gray-800 mb-2">Instant Insights</h4>
              <p className="text-gray-600">
                Get immediate answers and visualizations from your SQL data without writing complex queries.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h4 className="font-medium text-lg text-gray-800 mb-2">Secure & Private</h4>
              <p className="text-gray-600">
                Your data remains private and secure with our protected authentication system.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4 mt-12">
        <div className="max-w-4xl mx-auto px-4 flex justify-between items-center">
          <p className="text-sm text-gray-500">SQL Data Analysis AI</p>
          <p className="text-sm text-gray-500">© 2025</p>
        </div>
      </footer>
    </div>
  );
}
