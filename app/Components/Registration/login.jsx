"use client";
import React, { useState } from 'react';
import { Heart, Mail, Lock, Eye, EyeOff, ArrowLeft, X, CheckCircle, AlertCircle } from 'lucide-react';

// Toast Component
const Toast = ({ message, type, onClose }) => {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-red-400 to-rose-500';
  const Icon = type === 'success' ? CheckCircle : AlertCircle;

  return (
    <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50 animate-toast-slide-down">
      <div className={`${bgColor} text-white px-8 py-5 rounded-2xl shadow-2xl flex items-center space-x-4 min-w-[400px] max-w-[500px] backdrop-blur-lg border border-white/20`}>
        <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${type === 'success' ? 'bg-white/20' : 'bg-white/20'}`}>
          <Icon className="h-7 w-7" />
        </div>
        <p className="flex-1 font-semibold text-lg">{message}</p>
        <button 
          onClick={onClose} 
          className="hover:bg-white/20 rounded-full p-2 transition-all hover:scale-110 flex-shrink-0"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default function Login({ onNavigate, onLogin, onAdminLogin }) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type) => {
    setToast({ message, type });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      showToast('Please enter both email and password', 'error');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      console.log("Login response data:", data);
      
      if (data.success) {
        showToast('Login successful!', 'success');
        
        setTimeout(() => {
          if (data.user.role === 'admin') {
            console.log('Admin Login Successful - Navigating to Admin Dashboard');
            onAdminLogin(data.token);
          } else if (data.user.role === 'user') {
            console.log('User Login Successful - Navigating to User Dashboard');
            onLogin(data.token, data.user.role);
          } else {
            setIsLoading(false);
            showToast('Unknown user role. Please contact support.', 'error');
          }
        }, 1500);
      } else {
        setIsLoading(false);
        showToast(data.message || 'Invalid credentials', 'error');
      }
    } catch (error) {
      setIsLoading(false);
      showToast('Login failed. Please check if backend is running.', 'error');
      console.error('Login error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 flex items-center justify-center px-4">
      {/* Toast Notification */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}

      {/* Animated background circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-200/40 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
      
        {/* Login Card */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-rose-100 p-8">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-rose-300 to-pink-400 rounded-full flex items-center justify-center shadow-lg">
                <Heart className="h-9 w-9 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-rose-700 mb-2">Welcome Back</h1>
            <p className="text-rose-400">Login to access your account</p>
          </div>

          {/* Login Form */}
          <div className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-rose-600 font-medium mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Mail className="h-5 w-5 text-rose-300" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  disabled={isLoading}
                  className="w-full pl-10 pr-4 py-3 bg-rose-50/60 border border-rose-200 rounded-lg text-rose-800 placeholder-rose-300 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-300/30 transition-all"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-rose-600 font-medium mb-2">Password</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Lock className="h-5 w-5 text-rose-300" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  disabled={isLoading}
                  className="w-full pl-10 pr-12 py-3 bg-rose-50/60 border border-rose-200 rounded-lg text-rose-800 placeholder-rose-300 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-300/30 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-rose-300 hover:text-rose-500 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 text-rose-400 bg-rose-50 border-rose-300 rounded focus:ring-rose-400 focus:ring-2" 
                  disabled={isLoading}
                />
                <span className="ml-2 text-rose-500 text-sm">Remember me</span>
              </label>
            </div>

            {/* Login Button */}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className={`w-full py-3.5 rounded-lg font-bold text-lg transition-all shadow-lg ${
                isLoading
                  ? 'bg-rose-200 text-rose-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-rose-400 to-pink-500 text-white hover:from-rose-500 hover:to-pink-600 hover:scale-105 hover:shadow-rose-300/50'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-rose-300 border-t-transparent rounded-full animate-spin" />
                  <span>Logging in...</span>
                </div>
              ) : (
                'Login'
              )}
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-rose-100"></div>
            <div className="flex-1 border-t border-rose-100"></div>
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes toast-slide-down {
          from {
            transform: translate(-50%, -150%);
            opacity: 0;
          }
          to {
            transform: translate(-50%, 0);
            opacity: 1;
          }
        }
        .animate-toast-slide-down {
          animation: toast-slide-down 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
      `}</style>
    </div>
  );
}