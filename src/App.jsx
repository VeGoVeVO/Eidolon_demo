import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { LanguageProvider } from './i18n/LanguageContext';
import { ProcessTrackerProvider } from './contexts/ProcessTracker';
import PageTransition from './components/PageTransition';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import MainApp from './pages/MainApp';
import Wardrobe from './pages/Wardrobe';
import Outfits from './pages/Outfits';
import Marketplace from './pages/Marketplace';
import Usage from './pages/Usage';
import Premium from './pages/Premium';
import Subscription from './pages/Subscription';
import { seedDemoData } from './utils/demoStorage';
import './App.css';

function AnimatedRoutes({
  isAuthenticated,
  user,
  handleLoginSuccess,
  handleLogout,
}) {
  const location = useLocation();

  return (
    <PageTransition key={location.pathname}>
      <Routes location={location}>
        {/* Public Home Page */}
        <Route
          path="/"
          element={<Home isAuthenticated={isAuthenticated} user={user} />}
        />

        {/* Login Page */}
        <Route
          path="/login"
          element={
            isAuthenticated ?
            <Navigate to="/profile" replace /> :
            <LoginPage onLoginSuccess={handleLoginSuccess} />
          }
        />

        {/* Profile Page (formerly MainApp at /) */}
        <Route
          path="/profile"
          element={
            isAuthenticated ?
            <MainApp user={user} onLogout={handleLogout} /> :
            <Navigate to="/login" replace />
          }
        />

        {/* Wardrobe Page */}
        <Route
          path="/wardrobe"
          element={
            isAuthenticated ?
            <Wardrobe user={user} onLogout={handleLogout} /> :
            <Navigate to="/login" replace />
          }
        />

        {/* Outfits Page */}
        <Route
          path="/outfits"
          element={
            isAuthenticated ?
            <Outfits user={user} onLogout={handleLogout} /> :
            <Navigate to="/login" replace />
          }
        />

        {/* Marketplace Page */}
        <Route
          path="/marketplace"
          element={
            isAuthenticated ?
            <Marketplace user={user} onLogout={handleLogout} /> :
            <Navigate to="/login" replace />
          }
        />

        {/* Usage Page */}
        <Route
          path="/usage"
          element={
            isAuthenticated ?
            <Usage user={user} onLogout={handleLogout} /> :
            <Navigate to="/login" replace />
          }
        />

        {/* Premium Page */}
        <Route
          path="/premium"
          element={
            isAuthenticated ?
            <Premium user={user} onLogout={handleLogout} /> :
            <Navigate to="/login" replace />
          }
        />

        {/* Subscription Page */}
        <Route
          path="/subscription"
          element={
            isAuthenticated ?
            <Subscription user={user} onLogout={handleLogout} /> :
            <Navigate to="/login" replace />
          }
        />
      </Routes>
    </PageTransition>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize dark mode from localStorage on app load
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Check if user is already logged in
    const storedUser = localStorage.getItem('virtual_tryon_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('virtual_tryon_user');
      }
    }

    setLoading(false);
  }, []);
  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('virtual_tryon_user', JSON.stringify(userData));
    seedDemoData();
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('virtual_tryon_user');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-50 dark:bg-neutral-900">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-neutral-200 dark:border-neutral-700 border-t-neutral-900 dark:border-t-neutral-100 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600 dark:text-neutral-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <LanguageProvider>
      <ProcessTrackerProvider>
        <Router>
          <AnimatedRoutes
            isAuthenticated={isAuthenticated}
            user={user}
            handleLoginSuccess={handleLoginSuccess}
            handleLogout={handleLogout}
          />
        </Router>
      </ProcessTrackerProvider>
    </LanguageProvider>
  );
}

export default App;

