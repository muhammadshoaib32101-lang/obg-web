"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import HospitalHomePage from "./Components/home";
import Login from "./Components/Registration/login";
import SignUp from "./Components/Registration/signup";
import UserDashboard from "./Components/dashboard";
import AdminDashboard from "./Components/admindashboard";

function App(): React.JSX.Element {
  const [currentPage, setCurrentPage] = useState<string>("home");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userToken, setUserToken] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check authentication on mount and URL change
  useEffect(() => {
    const token = localStorage.getItem('userToken');
    const role = localStorage.getItem('userRole');
    
    if (token && role) {
      setUserToken(token);
      setUserRole(role);
      setIsLoggedIn(true);
      
      // Navigate to appropriate dashboard
      if (role === 'admin') {
        setCurrentPage('admin-dashboard');
      } else {
        setCurrentPage('dashboard');
      }
    } else {
      // No auth, ensure we're on home or login
      if (!['home', 'login'].includes(currentPage)) {
        setCurrentPage('home');
      }
    }
    setIsLoading(false);
  }, []);

  // Protect routes when page changes
  useEffect(() => {
    const protectedPages = ['dashboard', 'admin-dashboard', 'signup'];
    
    if (!isLoading && protectedPages.includes(currentPage) && !isLoggedIn) {
      // Redirect to home if trying to access protected page without auth
      setCurrentPage('home');
    }

    // Prevent non-admin from accessing admin pages
    if (!isLoading && currentPage === 'admin-dashboard' && userRole !== 'admin') {
      setCurrentPage(isLoggedIn ? 'dashboard' : 'home');
    }

    // Prevent admin from accessing signup unless explicitly navigated
    if (!isLoading && currentPage === 'signup' && userRole !== 'admin' && isLoggedIn) {
      setCurrentPage('dashboard');
    }
  }, [currentPage, isLoggedIn, userRole, isLoading]);

  const handleNavigation = (page: string): void => {
    // Add navigation guards
    const protectedPages = ['dashboard', 'admin-dashboard', 'signup'];
    
    if (protectedPages.includes(page) && !isLoggedIn) {
      console.warn('Unauthorized access attempt to:', page);
      setCurrentPage('login');
      return;
    }

    if (page === 'admin-dashboard' && userRole !== 'admin') {
      console.warn('Non-admin tried to access admin dashboard');
      setCurrentPage('home');
      return;
    }

    setCurrentPage(page);
  };

  const handleLogin = (token: string, role: string): void => {
    localStorage.setItem('userToken', token);
    localStorage.setItem('userRole', role);
    
    // Also set in cookies for server-side protection
    document.cookie = `userToken=${token}; path=/; max-age=86400`; // 24 hours
    document.cookie = `userRole=${role}; path=/; max-age=86400`;
    
    setUserToken(token);
    setUserRole(role);
    setIsLoggedIn(true);
    setCurrentPage("dashboard");
  };

  const handleAdminLogin = (token: string): void => {
    localStorage.setItem('userToken', token);
    localStorage.setItem('userRole', 'admin');
    
    document.cookie = `userToken=${token}; path=/; max-age=86400`;
    document.cookie = `userRole=admin; path=/; max-age=86400`;
    
    setUserToken(token);
    setUserRole('admin');
    setIsLoggedIn(true);
    setCurrentPage("admin-dashboard");
  };

  const handleLogout = (): void => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userRole');
    
    // Clear cookies
    document.cookie = 'userToken=; path=/; max-age=0';
    document.cookie = 'userRole=; path=/; max-age=0';
    
    setUserToken('');
    setUserRole(null);
    setIsLoggedIn(false);
    setCurrentPage("home");
  };

  const handleAdminLogout = (): void => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userRole');
    
    document.cookie = 'userToken=; path=/; max-age=0';
    document.cookie = 'userRole=; path=/; max-age=0';
    
    setUserToken('');
    setUserRole(null);
    setIsLoggedIn(false);
    setCurrentPage("home");
  };

  const handleNavigateToSignup = (): void => {
    // Only allow admin to access signup
    if (userRole === 'admin') {
      setCurrentPage("signup");
    }
  };

  const handleNavigateToAdminDashboard = (): void => {
    setCurrentPage("admin-dashboard");
  };

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case "login":
        return (
          <Login 
            onNavigate={handleNavigation} 
            onLogin={handleLogin}
            onAdminLogin={handleAdminLogin}
          />
        );
      case "signup":
        // Double-check admin access
        if (userRole !== 'admin') {
          setCurrentPage('home');
          return null;
        }
        const isFromAdminDashboard = userRole === 'admin' && isLoggedIn;
        
        return (
          <SignUp 
            onNavigate={(page: string) => {
              if (isFromAdminDashboard && page === 'dashboard') {
                handleNavigateToAdminDashboard();
              } else {
                handleNavigation(page);
              }
            }} 
            onLogin={handleLogin}
          />
        );
      case "dashboard":
        // Verify user is logged in
        if (!isLoggedIn) {
          setCurrentPage('home');
          return null;
        }
        return <UserDashboard onLogout={handleLogout} />;
      case "admin-dashboard":
        // Verify admin access
        if (!isLoggedIn || userRole !== 'admin') {
          setCurrentPage('home');
          return null;
        }
        return (
          <AdminDashboard 
            onLogout={handleAdminLogout} 
            userToken={userToken}
            onNavigateToSignup={handleNavigateToSignup}
          />
        );
      case "home":
      default:
        return (
          <HospitalHomePage 
            onNavigate={handleNavigation} 
            isLoggedIn={isLoggedIn} 
            onLogout={handleLogout} 
          />
        );
    }
  };

  return <div className="App">{renderPage()}</div>;
}

export default App;