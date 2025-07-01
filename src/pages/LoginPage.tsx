// src/pages/LoginPage.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/auth-context';
import { useNavigate } from 'react-router-dom';
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/react/20/solid';

const LoginPage = () => {
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('Test@123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();

  // 移除不必要的 navigateToChat 和 useEffect
  // const navigateToChat = useCallback(() => { ... });
  // useEffect(() => { navigateToChat(); }, [isAuthenticated]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // 基本表单验证
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    
    if (!password.trim()) {
      setError('Password is required');
      return;
    }

    setError('');
    setLoading(true);
    
    try {
      console.log('Attempting login with:', email, password);
      await login(email, password);
      console.log('Login successful, navigating to chat');
      
      // 生成真实的Session ID（使用浏览器原生API）
      const realSessionId = crypto.randomUUID();
      
      // 跳转到动态路由（替换原来的session_test）
      navigate(`/${realSessionId}/chat`); 
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="absolute min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 inset-0 ">
    
      <div className="max-w-md w-full bg-white rounded-lg shadow-lgß overflow-hidden inset-0 item-center">
        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
            <p className="text-gray-600 mt-2">Sign in to your account</p>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <i className="fa fa-exclamation-circle text-red-500"></i>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">{error}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="text-left mb-6">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-12 block w-full bg-gray-100 border border-gray-300 rounded-lg py-3 px-4 text-gray-900 placeholder-gray-500 focus:outline-none transition duration-150 ease-in-out"
                  placeholder="your.email@example.com"
                  autoComplete="email"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="text-left mb-8">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-12 block w-full bg-gray-100 border border-gray-300 rounded-lg py-3 px-4 text-gray-900 placeholder-gray-500 focus:outline-none transition duration-150 ease-in-out"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <i className="fa fa-circle-o-notch fa-spin mr-2"></i>
                  Signing In...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>
        {/* 添加注册按钮 */}
        <div className="mt-4 text-center">
          <button
            onClick={() => navigate('/register')}
            className="text-blue-600 hover:underline"
          >
            Register
          </button>
        </div>

        <div className="bg-gray-50 py-4 px-6 text-center">
          <p className="text-gray-600 text-sm">
            Test credentials: <span className="text-blue-600">test@example.com</span> / <span className="text-blue-600">Test@123</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;