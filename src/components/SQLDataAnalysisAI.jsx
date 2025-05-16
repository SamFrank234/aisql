import { useState, useEffect } from 'react';
import { MessageSquare, Database, Send, LogOut } from 'lucide-react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

export default function SQLDataAnalysisAI() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  
  const navigate = useNavigate();
  const auth = getAuth();

  // Check authentication status on component mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        // User is signed in
        setUser(currentUser);
      } else {
        // User is signed out, redirect to login
        navigate('/login');
      }
      setAuthLoading(false);
    });
    
    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [auth, navigate]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      // Redirect will happen automatically due to the onAuthStateChanged listener
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!query.trim()) return;
    
    setLoading(true);
    setError(null);

    const CORS_PROXY = 'https://desolate-earth-42075-5b537d902179.herokuapp.com/';
    const TARGET_API = 'https://app2.text2sql.ai/api/external/fix-sql';   
    
    const body = {
        'prompt': query,
        'type': 'postgres',
        'connectionID': '2c07c463-a19e-4ab1-9ec3-9374f31b7466',
    };

    try {
      // Replace with your actual API endpoint
      const response = await fetch(CORS_PROXY + TARGET_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer c7b2e54786580b200771445f51766aa43e6263cf96c45dfde6b34e33d9e3a77f',
        },
        body: JSON.stringify(body),
      });
     
      console.log('response', response)
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message || 'An error occurred while processing your query');
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header with User Info */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto p-4 flex items-center justify-between">
          <div className="flex items-center">
            <Database className="text-blue-600 mr-2" />
            <h1 className="text-xl font-semibold text-gray-800">SQL Data Analysis AI</h1>
          </div>
          
          {/* User Profile and Sign Out */}
          <div className="flex items-center">
            <div className="mr-4 text-sm text-gray-600">
              {user?.email}
            </div>
            <button 
              onClick={handleSignOut}
              className="flex items-center text-gray-600 hover:text-red-600 transition"
              title="Sign out"
            >
              <LogOut size={18} />
              <span className="ml-1">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 flex flex-col">
        {/* Welcome Section */}
        <div className="text-center my-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Natural Language Data Analysis</h2>
          <p className="text-gray-600 mb-6 max-w-lg mx-auto">
            Ask a question about NYC public salaries and get a response backed by raw data. No hallucinating.
          </p>
        </div>

        {/* Query Form */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6 shadow-sm">
          <form onSubmit={handleSubmit}>
            <div>
            <label htmlFor="query" className="block text-sm font-medium text-gray-700 mb-2">
              Your Query:
            </label>
            </div>
            <div>
            <textarea
              id="query"
              rows="5"
              placeholder="Who had the highest salary in 2024?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
              required
            />
            </div>

            <button
              type="submit"
              disabled={loading || !query.trim()}
              className={`w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                loading || !query.trim() 
                  ? 'bg-blue-300 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <Send size={18} className="mr-2" />
                  Submit Query
                </>
              )}
            </button>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
            <p className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
              </svg>
              {error}
            </p>
          </div>
        )}

        {/* Results Section */}
        {result && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
              <MessageSquare className="text-blue-500 mr-2" size={20} />
              Query Results
            </h3>
            
            <div className="bg-gray-50 rounded-md p-4 border border-gray-200 overflow-auto">
              <pre className="text-sm text-gray-800 whitespace-pre-wrap">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4 mt-auto">
        <div className="max-w-4xl mx-auto px-4 flex justify-between items-center">
          <p className="text-sm text-gray-500">SQL Data Analysis API</p>
          <p className="text-sm text-gray-500">© 2025</p>
        </div>
      </footer>
    </div>
  );
}
