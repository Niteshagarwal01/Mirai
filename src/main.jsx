import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App.jsx';
import ErrorBoundary from './ErrorBoundary.jsx';
import './css/index.css';

// Get Clerk publishable key from environment
const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!CLERK_PUBLISHABLE_KEY) {
  console.warn('Missing VITE_CLERK_PUBLISHABLE_KEY in .env file');
  console.warn('Add: VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxx');
}

// Wrapper component to handle redirects from localStorage
const AppWithRedirectHandler = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const redirectPath = localStorage.getItem('redirectAfterLoad');
    if (redirectPath) {
      localStorage.removeItem('redirectAfterLoad');
      navigate(redirectPath);
    }
  }, [navigate]);
  
  return <App />;
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
        <BrowserRouter>
          <AppWithRedirectHandler />
        </BrowserRouter>
      </ClerkProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
