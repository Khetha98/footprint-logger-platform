import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Landing from './components/Landing';
import Dashboard from './components/Dashboard';
import AuthForm from './components/AuthForm';

function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('landing'); // 'landing', 'login', 'register', 'dashboard'

  // Check if user is already logged in on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUser({ token });
      setView('dashboard');
    }
  }, []);

  const handleAuthSuccess = (token) => {
    setUser({ token });
    setView('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setView('landing');
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col font-sans text-gray-900">
      <Header 
        isAuthenticated={!!user} 
        onLogout={handleLogout} 
        onAuthClick={(type) => setView(type)}
      />

      <main className="flex-1 flex flex-col">
        {view === 'landing' && (
          <Landing onGetStarted={() => setView('register')} />
        )}
        
        {view === 'dashboard' && user && (
          <Dashboard />
        )}

        {(view === 'login' || view === 'register') && (
          <div className="flex-1 flex items-center justify-center p-6 bg-gradient-to-b from-white to-gray-50">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
              <h2 className="text-2xl font-bold mb-6 text-center capitalize text-gray-800">
                {view === 'login' ? 'Welcome Back' : 'Create Account'}
              </h2>
              
              <AuthForm 
                mode={view} 
                onAuthSuccess={handleAuthSuccess} 
              />
              
              <p className="mt-6 text-center text-sm text-gray-500">
                {view === 'login' ? "Don't have an account?" : "Already have an account?"}{' '}
                <button 
                  onClick={() => setView(view === 'login' ? 'register' : 'login')}
                  className="text-green-600 font-bold hover:underline transition-all"
                >
                  {view === 'login' ? 'Register here' : 'Login here'}
                </button>
              </p>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

// THIS IS THE LINE THAT WAS MISSING:
export default App;