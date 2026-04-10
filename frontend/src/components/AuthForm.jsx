import React, { useState } from 'react';
import axios from 'axios';

export default function AuthForm({ mode, onAuthSuccess }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // The endpoint changes based on the mode (login vs register)
    const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
    
    try {
      const res = await axios.post(`http://localhost:5001${endpoint}`, formData);
      
      // Save token to localStorage
      localStorage.setItem('token', res.data.token);
      
      // Notify App.jsx that we are logged in
      onAuthSuccess(res.data.token);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100">
          {error}
        </div>
      )}

      {mode === 'register' && (
        <div>
          <label className="block text-sm font-medium text-gray-700">Username</label>
          <input
            type="text"
            required
            className="w-full mt-1 p-3 border rounded-xl outline-none focus:ring-2 focus:ring-green-500"
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          required
          className="w-full mt-1 p-3 border rounded-xl outline-none focus:ring-2 focus:ring-green-500"
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          required
          className="w-full mt-1 p-3 border rounded-xl outline-none focus:ring-2 focus:ring-green-500"
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />
      </div>

      <button
        type="submit"
        className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition shadow-md"
      >
        {mode === 'login' ? 'Sign In' : 'Create Account'}
      </button>
    </form>
  );
}