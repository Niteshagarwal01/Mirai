import React, { useState, useEffect } from 'react';
import { testConnections } from '../utils/connectionTest';
import '../css/connection-status.css';

/**
 * Connection Status Component
 * Shows real-time status of all backend connections
 * Only visible in development mode
 */
const ConnectionStatus = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  // Auto-test on mount
  useEffect(() => {
    // Commented out to prevent errors on initial load
    // runTest();
  }, []);

  const runTest = async () => {
    setLoading(true);
    try {
      const testResults = await testConnections();
      setResults(testResults);
    } catch (error) {
      console.error('Connection test failed:', error);
    } finally {
      setLoading(false);
    }
  };

  // Only show in development
  if (import.meta.env.PROD) {
    return null;
  }

  // Temporarily disabled - uncomment to enable
  return null;

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      default: return '⏳';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return '#10b981';
      case 'error': return '#ef4444';
      case 'warning': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  return (
    <div className="connection-status-widget">
      <button 
        className="status-toggle"
        onClick={() => setIsOpen(!isOpen)}
        title="Connection Status"
      >
        🔌 {results && Object.values(results).filter(r => r.status === 'success').length}/{results && Object.keys(results).length}
      </button>

      {isOpen && (
        <div className="status-panel">
          <div className="status-header">
            <h3>🔌 Connection Status</h3>
            <button onClick={runTest} disabled={loading}>
              {loading ? '🔄 Testing...' : '🔄 Refresh'}
            </button>
          </div>

          {results ? (
            <div className="status-list">
              {Object.entries(results).map(([service, result]) => (
                <div 
                  key={service} 
                  className="status-item"
                  style={{ borderLeftColor: getStatusColor(result.status) }}
                >
                  <div className="status-item-header">
                    <span className="status-icon">{getStatusIcon(result.status)}</span>
                    <span className="status-service">{service.toUpperCase()}</span>
                  </div>
                  <div className="status-message">{result.message}</div>
                  {result.details && (
                    <details className="status-details">
                      <summary>Details</summary>
                      <pre>{JSON.stringify(result.details, null, 2)}</pre>
                    </details>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="status-loading">Running connection tests...</div>
          )}

          <div className="status-footer">
            <a 
              href="/API_KEYS_NEEDED.md" 
              target="_blank"
              className="setup-link"
            >
              📖 Setup Guide
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectionStatus;
