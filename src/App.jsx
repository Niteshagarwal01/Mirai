import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useUser } from '@clerk/clerk-react'
import { AuthenticateWithRedirectCallback } from '@clerk/clerk-react'
import Home from './pages/Home.jsx'
import Login from './pages/login.jsx'
import Signup from './pages/signup.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import ContentGenerator from './pages/ContentGenerator.jsx'
import UpgradeToPro from './pages/UpgradeToPro.jsx'
import PaymentPage from './pages/PaymentPage.jsx'
import BusinessPlanner from './pages/BusinessPlanner.jsx'
import { NotFound } from './ErrorBoundary.jsx'
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
import './css/payment-page.css'
import './css/business-planner.css'

// Protected route component using Clerk
const ProtectedRoute = ({ element }) => {
  const { isSignedIn, isLoaded } = useUser();
  
  // Wait for Clerk to load
  if (!isLoaded) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#0a0a14',
        color: '#fff'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{
            border: '4px solid rgba(110, 64, 255, 0.1)',
            borderTop: '4px solid #6e40ff',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }
  
  // Check if user is authenticated
  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }
  
  return element;
};

function App() {
  const location = useLocation();

  // Custom cursor functionality
  useEffect(() => {
    const cursorDot = document.getElementById('cursor-dot');
    const cursorOutline = document.getElementById('cursor-outline');
    
    if (!cursorDot || !cursorOutline) return;

    const handleMouseMove = (e) => {
      const posX = e.clientX;
      const posY = e.clientY;
      
      // Update cursor dot position immediately
      cursorDot.style.left = `${posX}px`;
      cursorDot.style.top = `${posY}px`;
      
      // Update cursor outline with smooth animation
      cursorOutline.animate({
        left: `${posX}px`,
        top: `${posY}px`
      }, {
        duration: 500,
        fill: 'forwards'
      });
    };

    const handleMouseEnter = () => {
      cursorDot.classList.add('hovering');
      cursorOutline.classList.add('hovering');
    };

    const handleMouseLeave = () => {
      cursorDot.classList.remove('hovering');
      cursorOutline.classList.remove('hovering');
    };

    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove);
    
    // Add hover effects for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .btn-primary, .btn-secondary, .feature-item, .pricing-card, input, textarea');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    // Cleanup
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, [location.pathname]); // Re-run when route changes

  return (
    <div className="App">
      <div className="cursor-dot" id="cursor-dot"></div>
      <div className="cursor-outline" id="cursor-outline"></div>
      
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/upgrade-pro" element={<UpgradeToPro />} />
          <Route path="/payment" element={<ProtectedRoute element={<PaymentPage />} />} />
          <Route path="/sso-callback" element={<AuthenticateWithRedirectCallback />} />
          
          {/* User Dashboard - accessible to all authenticated users */}
          <Route 
            path="/admin" 
            element={<ProtectedRoute element={<AdminDashboard />} />}
          >
            <Route index element={<AdminDashboard />} />
            <Route path="content" element={<ContentGenerator />} />
            <Route path="business-planner" element={<BusinessPlanner />} />
          </Route>
          
          {/* Backward compatibility */}
          <Route path="/business-planner" element={<Navigate to="/admin/business-planner" replace />} />
          <Route path="/content-generator" element={<Navigate to="/admin/content" replace />} />
          
          {/* 404 route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
