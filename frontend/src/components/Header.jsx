import React from 'react';

export default function Header({ isAuthenticated, onLogout, onAuthClick }) {
  return (
    <header className="bg-white border-b border-gray-100 py-4 px-8 flex justify-between items-center sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-green-600 rounded-lg"></div>
        <h1 className="text-xl font-bold text-gray-800">Footprint Logger</h1>
      </div>
      
      <nav className="flex gap-4">
        {isAuthenticated ? (
          <button 
            onClick={onLogout}
            className="text-sm font-semibold text-gray-600 hover:text-red-600 transition"
          >
            Logout
          </button>
        ) : (
          <>
            <button 
              onClick={() => onAuthClick('login')}
              className="text-sm font-semibold text-gray-600 hover:text-green-600 transition"
            >
              Login
            </button>
            <button 
              onClick={() => onAuthClick('register')}
              className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-green-700 transition"
            >
              Sign Up
            </button>
          </>
        )}
      </nav>
    </header>
  );
}