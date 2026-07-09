"use client";
import React, { useState } from 'react';
import { Heart, Mail, Lock, Eye, EyeOff, User, Phone, ArrowLeft, AlertCircle, X, CheckCircle } from 'lucide-react';

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

export default function SignUp({ onNavigate, onLogin }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [touched, setTouched] = useState({
    fullName: false,
    email: false,
    phone: false,
    password: false,
    confirmPassword: false
  });

  const showToast = (message, type) => {
    setToast({ message, type });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      return 'Email is required';
    }
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    if (!email.toLowerCase().includes('gmail') && !email.toLowerCase().includes('yahoo') && !email.toLowerCase().includes('hotmail') && !email.toLowerCase().includes('outlook')) {
      return 'Please use a valid email provider';
    }
    return '';
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phone) {
      return 'Phone number is required';
    }
    if (!phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))) {
      return 'Please enter a valid phone number (10-15 digits)';
    }
    return '';
  };

  const validatePassword = (password) => {
    if (!password) {
      return 'Password is required';
    }
    if (password.length < 8) {
      return 'Password must be at least 8 characters';
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/.test(password)) {
      return 'Password must contain uppercase, lowercase, and number';
    }
    return '';
  };

  const validateConfirmPassword = (confirmPassword, password) => {
    if (!confirmPassword) {
      return 'Please confirm your password';
    }
    if (confirmPassword !== password) {
      return 'Passwords do not match';
    }
    return '';
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({
      ...touched,
      [name]: true
    });

    let error = '';
    switch (name) {
      case 'fullName':
        if (!value.trim()) {
          error = 'Full name is required';
        } else if (value.trim().length < 3) {
          error = 'Name must be at least 3 characters';
        }
        break;
      case 'email':
        error = validateEmail(value);
        break;
      case 'phone':
        error = validatePhone(value);
        break;
      case 'password':
        error = validatePassword(value);
        if (touched.confirmPassword && formData.confirmPassword) {
          const confirmError = validateConfirmPassword(formData.confirmPassword, value);
          setErrors(prev => ({
            ...prev,
            confirmPassword: confirmError
          }));
        }
        break;
      case 'confirmPassword':
        error = validateConfirmPassword(value, formData.password);
        break;
      default:
        break;
    }

    setErrors({
      ...errors,
      [name]: error
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {
      fullName: !formData.fullName.trim() ? 'Full name is required' : '',
      email: validateEmail(formData.email),
      phone: validatePhone(formData.phone),
      password: validatePassword(formData.password),
      confirmPassword: validateConfirmPassword(formData.confirmPassword, formData.password)
    };

    setErrors(newErrors);
    setTouched({
      fullName: true,
      email: true,
      phone: true,
      password: true,
      confirmPassword: true
    });

    const hasErrors = Object.values(newErrors).some(error => error !== '');

    if (!hasErrors) {
      setIsLoading(true);

      try {
        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            password: formData.password
          })
        });

        const data = await response.json();

        if (data.success) {
          showToast('Account created successfully!', 'success');
          setFormData({
            fullName: '',
            email: '',
            phone: '',
            password: '',
            confirmPassword: ''
          });
          setTouched({
            fullName: false,
            email: false,
            phone: false,
            password: false,
            confirmPassword: false
          });
          setIsLoading(false);
        } else {
          setIsLoading(false);
          if (data.message.toLowerCase().includes('already') || data.message.toLowerCase().includes('exists')) {
            showToast('This email is already registered. Please use a different email or login.', 'error');
          } else {
            showToast(data.message || 'Signup failed. Please try again.', 'error');
          }
        }
      } catch (error) {
        setIsLoading(false);
        showToast('Signup failed. Please check if backend is running.', 'error');
        console.error('Signup error:', error);
      }
    } else {
      showToast('Please fix all validation errors before submitting', 'error');
    }
  };

  const handleBackClick = () => {
    if (onNavigate) {
      onNavigate('dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 flex items-center justify-center px-4 py-12">
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
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Back Button */}
        <button
          onClick={handleBackClick}
          className="mb-6 flex items-center text-rose-400 hover:text-rose-600 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          <span>Back to admin dashboard</span>
        </button>

        {/* Sign Up Card */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-rose-100 p-8">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-rose-300 to-pink-400 rounded-full flex items-center justify-center shadow-lg">
                <Heart className="h-9 w-9 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-rose-700 mb-2">Add New User</h1>
            <p className="text-rose-400">Sign up to add a new user</p>
          </div>

          {/* Sign Up Form */}
          <div className="space-y-5">
            {/* Full Name Field */}
            <div>
              <label className="block text-rose-600 font-medium mb-2">Full Name</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <User className="h-5 w-5 text-rose-300" />
                </div>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter your full name"
                  disabled={isLoading}
                  className={`w-full pl-10 pr-4 py-3 bg-rose-50/60 border rounded-lg text-rose-800 placeholder-rose-300 focus:outline-none transition-all ${errors.fullName && touched.fullName
                      ? 'border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-300/30'
                      : 'border-rose-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-300/30'
                    }`}
                  required
                />
              </div>
              {errors.fullName && touched.fullName && (
                <div className="flex items-center mt-2 text-red-400 text-sm">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  <span>{errors.fullName}</span>
                </div>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-rose-600 font-medium mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Mail className="h-5 w-5 text-rose-300" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter your email"
                  disabled={isLoading}
                  className={`w-full pl-10 pr-4 py-3 bg-rose-50/60 border rounded-lg text-rose-800 placeholder-rose-300 focus:outline-none transition-all ${errors.email && touched.email
                      ? 'border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-300/30'
                      : 'border-rose-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-300/30'
                    }`}
                  required
                />
              </div>
              {errors.email && touched.email && (
                <div className="flex items-center mt-2 text-red-400 text-sm">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  <span>{errors.email}</span>
                </div>
              )}
            </div>

            {/* Phone Field */}
            <div>
              <label className="block text-rose-600 font-medium mb-2">Phone Number</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Phone className="h-5 w-5 text-rose-300" />
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter your phone number"
                  disabled={isLoading}
                  className={`w-full pl-10 pr-4 py-3 bg-rose-50/60 border rounded-lg text-rose-800 placeholder-rose-300 focus:outline-none transition-all ${errors.phone && touched.phone
                      ? 'border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-300/30'
                      : 'border-rose-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-300/30'
                    }`}
                  required
                />
              </div>
              {errors.phone && touched.phone && (
                <div className="flex items-center mt-2 text-red-400 text-sm">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  <span>{errors.phone}</span>
                </div>
              )}
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
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Create a password"
                  disabled={isLoading}
                  className={`w-full pl-10 pr-12 py-3 bg-rose-50/60 border rounded-lg text-rose-800 placeholder-rose-300 focus:outline-none transition-all ${errors.password && touched.password
                      ? 'border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-300/30'
                      : 'border-rose-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-300/30'
                    }`}
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
              {errors.password && touched.password && (
                <div className="flex items-center mt-2 text-red-400 text-sm">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  <span>{errors.password}</span>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-rose-600 font-medium mb-2">Confirm Password</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Lock className="h-5 w-5 text-rose-300" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Confirm your password"
                  disabled={isLoading}
                  className={`w-full pl-10 pr-12 py-3 bg-rose-50/60 border rounded-lg text-rose-800 placeholder-rose-300 focus:outline-none transition-all ${errors.confirmPassword && touched.confirmPassword
                      ? 'border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-300/30'
                      : 'border-rose-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-300/30'
                    }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-rose-300 hover:text-rose-500 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.confirmPassword && touched.confirmPassword && (
                <div className="flex items-center mt-2 text-red-400 text-sm">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  <span>{errors.confirmPassword}</span>
                </div>
              )}
            </div>

            {/* Terms & Conditions */}
            <div>
              <label className="flex items-start cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 mt-1 text-rose-400 bg-rose-50 border-rose-300 rounded focus:ring-rose-400 focus:ring-2"
                  required
                  disabled={isLoading}
                />
                <span className="ml-2 text-rose-500 text-sm">
                  I agree to the{' '}
                  <span className="text-rose-600 hover:text-rose-700 cursor-pointer font-medium">Terms & Conditions</span>
                  {' '}and{' '}
                  <span className="text-rose-600 hover:text-rose-700 cursor-pointer font-medium">Privacy Policy</span>
                </span>
              </label>
            </div>

            {/* Sign Up Button */}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className={`w-full py-3.5 rounded-lg font-bold text-lg transition-all shadow-lg ${isLoading
                  ? 'bg-rose-200 text-rose-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-rose-400 to-pink-500 text-white hover:from-rose-500 hover:to-pink-600 hover:scale-105 hover:shadow-rose-300/50'
                }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-rose-300 border-t-transparent rounded-full animate-spin" />
                  <span>Creating Account...</span>
                </div>
              ) : (
                'Sign Up'
              )}
            </button>
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