"use client";
import React, { useState, useEffect, useRef } from "react";
import HospitalHomePage from "./Components/home";
import Login from "./Components/Registration/login";
import SignUp from "./Components/Registration/signup";
import AdminDashboard from "./Components/admindashboard";
import ResourceDetailPage from "./Components/ResourceDetailPage";
import ProgramDetailPage from "./Components/ProgramDetailPage";
import ResearchDetailPage from "./Components/ResearchDetailPage";

function App(): React.JSX.Element {
  const [currentPage, setCurrentPage] = useState<string>("login");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userToken, setUserToken] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedResource, setSelectedResource] = useState<string>("");
  const [selectedProgram, setSelectedProgram] = useState<string>("");

  // Tracks scroll position to restore when returning to home
  const savedScrollY = useRef<number>(0);

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    const role = localStorage.getItem('userRole');
    if (token && role) {
      setUserToken(token);
      setUserRole(role);
      setIsLoggedIn(true);
      setCurrentPage('home');
    } else {
      setCurrentPage('login');
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const protectedPages = ['home', 'admin-dashboard', 'signup', 'resource-detail', 'program-detail', 'research-detail'];
    if (!isLoading && protectedPages.includes(currentPage) && !isLoggedIn) {
      setCurrentPage('login');
      return;
    }
    if (!isLoading && currentPage === 'admin-dashboard' && userRole !== 'admin') {
      setCurrentPage(isLoggedIn ? 'home' : 'login');
      return;
    }
    if (!isLoading && currentPage === 'signup' && userRole !== 'admin' && isLoggedIn) {
      setCurrentPage('home');
    }
  }, [currentPage, isLoggedIn, userRole, isLoading]);

  // Restore scroll position whenever we return to the home page
  useEffect(() => {
    if (currentPage === 'home' && savedScrollY.current > 0) {
      const target = savedScrollY.current;
      savedScrollY.current = 0;
      // Double rAF ensures the DOM has fully painted before scrolling
      requestAnimationFrame(() =>
        requestAnimationFrame(() => window.scrollTo({ top: target, behavior: 'instant' as ScrollBehavior }))
      );
    }
  }, [currentPage]);

  const handleNavigation = (page: string): void => {
    const protectedPages = ['home', 'admin-dashboard', 'signup', 'resource-detail', 'program-detail', 'research-detail'];
    if (protectedPages.includes(page) && !isLoggedIn) { setCurrentPage('login'); return; }
    if (page === 'admin-dashboard' && userRole !== 'admin') { setCurrentPage('home'); return; }
    setCurrentPage(page);
  };

  const handleLogin = (token: string, role: string): void => {
    localStorage.setItem('userToken', token);
    localStorage.setItem('userRole', role);
    document.cookie = `userToken=${token}; path=/; max-age=86400`;
    document.cookie = `userRole=${role}; path=/; max-age=86400`;
    setUserToken(token);
    setUserRole(role);
    setIsLoggedIn(true);
    setCurrentPage("home");
  };

  const handleAdminLogin = (token: string): void => {
    localStorage.setItem('userToken', token);
    localStorage.setItem('userRole', 'admin');
    document.cookie = `userToken=${token}; path=/; max-age=86400`;
    document.cookie = `userRole=admin; path=/; max-age=86400`;
    setUserToken(token);
    setUserRole('admin');
    setIsLoggedIn(true);
    setCurrentPage("home");
  };

  const handleLogout = (): void => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userRole');
    document.cookie = 'userToken=; path=/; max-age=0';
    document.cookie = 'userRole=; path=/; max-age=0';
    setUserToken('');
    setUserRole(null);
    setIsLoggedIn(false);
    setCurrentPage("login");
  };

  const handleNavigateToSignup = (): void => {
    if (userRole === 'admin') setCurrentPage("signup");
  };

  const handleNavigateToAdminDashboard = (): void => {
    setCurrentPage("admin-dashboard");
  };

  const handleNavigateToHome = (): void => {
    setCurrentPage("home");
  };

  const handleNavigateToResource = (resourceSlug: string): void => {
    savedScrollY.current = typeof window !== 'undefined' ? window.scrollY : 0;
    setSelectedResource(resourceSlug);
    setCurrentPage("resource-detail");
  };

  const handleNavigateToProgram = (programSlug: string): void => {
    savedScrollY.current = typeof window !== 'undefined' ? window.scrollY : 0;
    setSelectedProgram(programSlug);
    setCurrentPage("program-detail");
  };

  const handleNavigateToResearch = (): void => {
    savedScrollY.current = typeof window !== 'undefined' ? window.scrollY : 0;
    setCurrentPage("research-detail");
  };

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #fdf6f0 0%, #fef0f5 40%, #f5f0fe 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#c9608c', fontFamily: "'Jost', sans-serif", fontSize: '1.1rem', fontWeight: 300 }}>Loading…</div>
      </div>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case "login":
        return <Login onNavigate={handleNavigation} onLogin={handleLogin} onAdminLogin={handleAdminLogin} />;

      case "signup":
        if (userRole !== 'admin') { setCurrentPage('home'); return null; }
        return (
          <SignUp
            onNavigate={(page: string) => {
              if (userRole === 'admin' && isLoggedIn && page === 'dashboard') handleNavigateToAdminDashboard();
              else handleNavigation(page);
            }}
            onLogin={handleLogin}
          />
        );

      case "admin-dashboard":
        if (!isLoggedIn || userRole !== 'admin') { setCurrentPage('home'); return null; }
        return (
          <AdminDashboard
            onLogout={handleLogout}
            userToken={userToken}
            onNavigateToSignup={handleNavigateToSignup}
            onNavigateToHome={handleNavigateToHome}
          />
        );

      case "resource-detail":
        if (!isLoggedIn) { setCurrentPage('login'); return null; }
        return (
          <ResourceDetailPage
            resourceSlug={selectedResource}
            onBack={handleNavigateToHome}
          />
        );

      case "program-detail":
        if (!isLoggedIn) { setCurrentPage('login'); return null; }
        return (
          <ProgramDetailPage
            programSlug={selectedProgram}
            onBack={handleNavigateToHome}
          />
        );

      case "research-detail":
        if (!isLoggedIn) { setCurrentPage('login'); return null; }
        return (
          <ResearchDetailPage
            onBack={handleNavigateToHome}
          />
        );

      case "home":
      default:
        if (!isLoggedIn) { setCurrentPage('login'); return null; }
        return (
          <HospitalHomePage
            onNavigate={handleNavigation}
            isLoggedIn={isLoggedIn}
            userRole={userRole}
            onLogout={handleLogout}
            onNavigateToResource={handleNavigateToResource}
            onNavigateToAdminDashboard={handleNavigateToAdminDashboard}
            onNavigateToProgram={handleNavigateToProgram}
            onNavigateToResearch={handleNavigateToResearch}
          />
        );
    }
  };

  return <div className="App">{renderPage()}</div>;
}

export default App;
