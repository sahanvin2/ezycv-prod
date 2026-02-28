import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingScreen from './components/LoadingScreen';
import CookieConsent from './components/CookieConsent';
import SupportPopup from './components/SupportPopup';
import Maintenance from './pages/Maintenance';

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'));
const CVBuilder = lazy(() => import('./pages/CVBuilder'));
const CVTemplates = lazy(() => import('./pages/CVTemplates'));
const Wallpapers = lazy(() => import('./pages/Wallpapers'));
const StockPhotos = lazy(() => import('./pages/StockPhotos'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Upload = lazy(() => import('./pages/Upload'));
const AboutUs = lazy(() => import('./pages/AboutUs'));
const Contact = lazy(() => import('./pages/Contact'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const CookiePolicy = lazy(() => import('./pages/CookiePolicy'));
const NotFound = lazy(() => import('./pages/NotFound'));
const EditProfile = lazy(() => import('./pages/EditProfile'));
const Settings = lazy(() => import('./pages/Settings'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const PhoneLogin = lazy(() => import('./pages/PhoneLogin'));
const SupportUs = lazy(() => import('./pages/SupportUs'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));

// Loading fallback component - Fast and attractive
const PageLoader = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
    <div className="relative">
      <div className="w-12 h-12 rounded-full border-4 border-blue-100"></div>
      <div className="w-12 h-12 rounded-full border-4 border-transparent border-t-blue-600 animate-spin absolute top-0 left-0"></div>
    </div>
    <p className="text-gray-400 text-sm animate-pulse">Loading...</p>
  </div>
);

function App() {
  const [isLoading, setIsLoading] = useState(true);

  // Maintenance Mode - controlled by .env file
  // Set REACT_APP_MAINTENANCE_MODE=true in .env to enable maintenance page
  const isMaintenanceMode = process.env.REACT_APP_MAINTENANCE_MODE === 'true';

  useEffect(() => {
    // Quick initial load - just enough for fonts/styles
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  // Show maintenance page if maintenance mode is active
  if (isMaintenanceMode) {
    return <Maintenance />;
  }

  return (
    <ErrorBoundary>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Navbar />
          <main className="flex-grow">
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/cv-builder" element={<CVBuilder />} />
                <Route path="/cv-templates" element={<CVTemplates />} />
                <Route path="/wallpapers" element={<Wallpapers />} />
                <Route path="/wallpapers/:category" element={<Wallpapers />} />
                <Route path="/stock-photos" element={<StockPhotos />} />
                <Route path="/stock-photos/:category" element={<StockPhotos />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/phone-login" element={<PhoneLogin />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/upload" element={<Upload />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/cookies" element={<CookiePolicy />} />
                <Route path="/cookie-policy" element={<CookiePolicy />} />
                <Route path="/edit-profile" element={<EditProfile />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/support-us" element={<SupportUs />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
          <Toaster 
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#363636',
                color: '#fff',
                borderRadius: '12px',
              },
            }}
          />
          <CookieConsent />
          <SupportPopup />
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
