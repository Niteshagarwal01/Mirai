import React from 'react';
import { useLocation, Link } from 'react-router-dom';

// Error page component for route-level errors
const ErrorPage = ({ error, errorInfo, isNotFound = false }) => {
  const location = useLocation();
  const path = location.pathname;

  return (
    <div style={{
      padding: '40px',
      backgroundColor: '#1a1a2e',
      color: '#fff',
      minHeight: '100vh',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center'
    }}>
      {isNotFound ? (
        <>
          <h1 style={{ color: '#ff5252', fontSize: '3rem', margin: '0 0 1rem' }}>404 - Page Not Found</h1>
          <p style={{ fontSize: '1.2rem', marginBottom: '2rem', maxWidth: '600px' }}>
            The page <code style={{ background: '#16213e', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>{path}</code> you're looking for doesn't exist or requires authentication.
          </p>
        </>
      ) : (
        <>
          <h1 style={{ color: '#ff5252', fontSize: '2.5rem', margin: '0 0 1rem' }}>⚠️ Something went wrong</h1>
          <p style={{ fontSize: '1.2rem', marginBottom: '2rem', maxWidth: '600px' }}>
            We encountered an error while trying to load this page.
          </p>
          <details style={{ whiteSpace: 'pre-wrap', marginTop: '20px', maxWidth: '800px', textAlign: 'left' }}>
            <summary style={{ cursor: 'pointer', fontSize: '18px', marginBottom: '10px' }}>
              Click to see error details
            </summary>
            <div style={{ 
              backgroundColor: '#16213e', 
              padding: '20px', 
              borderRadius: '8px',
              marginTop: '10px',
              overflow: 'auto'
            }}>
              <p><strong>Error:</strong> {error && error.toString()}</p>
              <p><strong>Stack:</strong></p>
              <pre>{errorInfo && errorInfo.componentStack}</pre>
            </div>
          </details>
        </>
      )}

      <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
        <Link to="/" style={{
          padding: '12px 24px',
          backgroundColor: '#6e40ff',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '16px',
          textDecoration: 'none',
          display: 'inline-block'
        }}>
          Go Home
        </Link>
        
        <button 
          onClick={() => window.location.reload()} 
          style={{
            padding: '12px 24px',
            backgroundColor: 'transparent',
            color: '#fff',
            border: '1px solid #6e40ff',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Reload Page
        </button>
      </div>
    </div>
  );
};

// Route Not Found component specifically for 404 errors
export const NotFound = () => {
  return <ErrorPage isNotFound={true} />;
};

// Class-based Error Boundary for catching rendering errors
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return <ErrorPage error={this.state.error} errorInfo={this.state.errorInfo} />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
