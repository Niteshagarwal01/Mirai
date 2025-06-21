import { Routes, Route, useLocation, Navigate, Outlet } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Home from './pages/Home.jsx'
import Login from './pages/login.jsx'
import Signup from './pages/signup.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import ContentGenerator from './pages/ContentGenerator.jsx'
import UpgradeToPro from './pages/UpgradeToPro.jsx'
import './css/App.css'
import './css/custom-login-fix.css'
import './css/feature-detail.css'
import './css/feature-grid.css'
import './css/login-styles.css'
import './css/onboarding.css'
import './css/pricing-page.css'
import './css/registration-styles.css'
import './css/admin-dashboard.css'
import './css/content-generator.css'
import './css/upgrade-pro.css'
import { initializeAnimations } from './components/script.js'

// Protected route component
const ProtectedRoute = ({ element, allowedRoles = [] }) => {
  const userJson = localStorage.getItem('user');
  const user = userJson ? JSON.parse(userJson) : null;
  
  // Check if user is authenticated and has an allowed role
  if (!user || (allowedRoles.length > 0 && !allowedRoles.includes(user.role))) {
    return <Navigate to="/login" replace />;
  }
  
  return element;
};

function App() {
  const location = useLocation();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  
  // Initialize animations when component mounts and on route changes
  useEffect(() => {
    // Small delay to ensure DOM is rendered
    const timer = setTimeout(() => {
      initializeAnimations();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [location.pathname]); // Re-run when route changes
  
  // Listen for changes to user in localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      setUser(JSON.parse(localStorage.getItem('user')) || null);
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <div className="App">
      <div className="cursor-dot" id="cursor-dot"></div>
      <div className="cursor-outline" id="cursor-outline"></div>
          {/* //Fixed Fluid Elements */}
      <div className="fluid-element" id="fluid1"></div>
      <div className="fluid-element" id="fluid2"></div>
      <div className="fluid-element" id="fluid3"></div>   
    
        <main>          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/upgrade-pro" element={<UpgradeToPro />} />
            <Route 
              path="/admin" 
              element={<ProtectedRoute element={<AdminDashboard />} allowedRoles={['admin']} />}
            >
              <Route path="content" element={<ContentGenerator />} />
            </Route>
            {/* Keep this route for backward compatibility */}
            <Route
              path="/content-generator"
              element={<Navigate to="/admin/content" replace />}
            />
          </Routes>
        </main>
    </div>
  )
}

export default App
