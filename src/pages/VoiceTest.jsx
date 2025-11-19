import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/content-generator.css';

const VoiceTest = () => {
  const navigate = useNavigate();
  const [isCallActive, setIsCallActive] = useState(false);
  const [callStatus, setCallStatus] = useState('idle');
  const [error, setError] = useState('');
  const [volumeLevel, setVolumeLevel] = useState(0);
  const vapiClientRef = useRef(null);

  const VAPI_PUBLIC_KEY = import.meta.env.VITE_VAPI_PUBLIC_KEY || '27212012-b4a1-4792-abd5-79033b637907';
  const ASSISTANT_ID = import.meta.env.VITE_VAPI_ASSISTANT_ID || '35ea6099-4093-4672-a972-e75818725b79';

  useEffect(() => {
    // Initialize VAPI client
    if (typeof window !== 'undefined' && window.vapiSDK) {
      try {
        const client = new window.vapiSDK.default(VAPI_PUBLIC_KEY);
        vapiClientRef.current = client;

        // Set up event listeners
        client.on('call-start', () => {
          console.log('✅ Call started');
          setCallStatus('active');
          setIsCallActive(true);
          setError('');
        });

        client.on('call-end', () => {
          console.log('📞 Call ended');
          setCallStatus('ended');
          setIsCallActive(false);
          setVolumeLevel(0);
        });

        client.on('speech-start', () => {
          console.log('🎤 User started speaking');
          setCallStatus('speaking');
        });

        client.on('speech-end', () => {
          console.log('🔇 User stopped speaking');
          setCallStatus('active');
        });

        client.on('volume-level', (level) => {
          setVolumeLevel(level);
        });

        client.on('error', (err) => {
          console.error('❌ VAPI Error:', err);
          setError(err.message || 'Call failed');
          setCallStatus('error');
          setIsCallActive(false);
        });

        client.on('message', (message) => {
          console.log('📨 Message:', message);
        });

        console.log('✅ VAPI client initialized');
      } catch (err) {
        console.error('Failed to initialize VAPI:', err);
        setError('Failed to initialize VAPI SDK');
      }
    } else {
      console.error('❌ VAPI SDK not loaded');
      setError('VAPI SDK not loaded. Please refresh the page.');
    }

    return () => {
      if (vapiClientRef.current && isCallActive) {
        vapiClientRef.current.stop();
      }
    };
  }, []);

  const startCall = async () => {
    if (!vapiClientRef.current) {
      setError('VAPI client not initialized');
      return;
    }

    setCallStatus('connecting');
    setError('');

    try {
      console.log('🔄 Starting call with assistant:', ASSISTANT_ID);
      await vapiClientRef.current.start(ASSISTANT_ID);
      console.log('✅ Call started successfully');
    } catch (err) {
      console.error('❌ Failed to start call:', err);
      setError('Failed to start call: ' + (err.message || 'Unknown error'));
      setCallStatus('error');
      setIsCallActive(false);
    }
  };

  const endCall = () => {
    if (vapiClientRef.current) {
      vapiClientRef.current.stop();
      console.log('📞 Call ended by user');
    }
    setCallStatus('ended');
    setIsCallActive(false);
    setVolumeLevel(0);
  };

  const getStatusColor = () => {
    switch (callStatus) {
      case 'connecting': return '#fbbf24';
      case 'active': return '#10b981';
      case 'speaking': return '#3b82f6';
      case 'error': return '#ef4444';
      case 'ended': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getStatusText = () => {
    switch (callStatus) {
      case 'connecting': return 'Connecting...';
      case 'active': return 'Call Active - Listening';
      case 'speaking': return 'You are speaking...';
      case 'error': return 'Call Failed';
      case 'ended': return 'Call Ended';
      default: return 'Ready to Call';
    }
  };

  return (
    <div className="content-generator-page">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1><i className="fas fa-phone-volume"></i> Voice Agent Test</h1>
          <p>Test VAPI voice calling in your browser</p>
        </div>
        <button className="btn-secondary" onClick={() => navigate('/admin')}>
          <i className="fas fa-arrow-left"></i> Back
        </button>
      </div>

      {/* Main Call Interface */}
      <div style={{ 
        maxWidth: '600px', 
        margin: '0 auto',
        padding: '40px 20px'
      }}>
        <div className="content-type-card" style={{
          textAlign: 'center',
          padding: '40px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '24px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)'
        }}>
          {/* Status Indicator */}
          <div style={{
            marginBottom: '30px'
          }}>
            <div style={{
              width: '120px',
              height: '120px',
              margin: '0 auto',
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${getStatusColor()} 0%, ${getStatusColor()}dd 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 0 40px ${getStatusColor()}66`,
              animation: isCallActive ? 'pulse 2s infinite' : 'none',
              position: 'relative'
            }}>
              <i className="fas fa-phone" style={{
                fontSize: '48px',
                color: 'white'
              }}></i>
              
              {/* Volume Indicator */}
              {isCallActive && volumeLevel > 0 && (
                <div style={{
                  position: 'absolute',
                  inset: -10,
                  borderRadius: '50%',
                  border: `3px solid ${getStatusColor()}`,
                  opacity: volumeLevel / 100,
                  animation: 'ripple 1s infinite'
                }}></div>
              )}
            </div>
          </div>

          {/* Status Text */}
          <h2 style={{ 
            marginBottom: '10px',
            color: getStatusColor()
          }}>
            {getStatusText()}
          </h2>

          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '20px',
              color: '#ef4444'
            }}>
              <i className="fas fa-exclamation-circle"></i> {error}
            </div>
          )}

          {/* Call Button */}
          {!isCallActive ? (
            <button
              onClick={startCall}
              disabled={callStatus === 'connecting'}
              className="btn-primary"
              style={{
                width: '100%',
                maxWidth: '300px',
                padding: '16px',
                fontSize: '1.1rem',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                boxShadow: '0 4px 20px rgba(16, 185, 129, 0.4)'
              }}
            >
              {callStatus === 'connecting' ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Connecting...
                </>
              ) : (
                <>
                  <i className="fas fa-phone"></i> Start Call
                </>
              )}
            </button>
          ) : (
            <button
              onClick={endCall}
              className="btn-primary"
              style={{
                width: '100%',
                maxWidth: '300px',
                padding: '16px',
                fontSize: '1.1rem',
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                boxShadow: '0 4px 20px rgba(239, 68, 68, 0.4)'
              }}
            >
              <i className="fas fa-phone-slash"></i> End Call
            </button>
          )}

          {/* Tips */}
          <div style={{
            marginTop: '30px',
            padding: '20px',
            background: 'rgba(110, 64, 255, 0.1)',
            border: '1px solid rgba(110, 64, 255, 0.2)',
            borderRadius: '12px',
            textAlign: 'left'
          }}>
            <h4 style={{ marginBottom: '10px' }}>
              <i className="fas fa-info-circle"></i> Tips:
            </h4>
            <ul style={{ 
              listStyle: 'none', 
              padding: 0,
              fontSize: '0.9rem',
              lineHeight: '1.8'
            }}>
              <li><i className="fas fa-check" style={{ color: '#10b981', marginRight: '8px' }}></i> Allow microphone access when prompted</li>
              <li><i className="fas fa-check" style={{ color: '#10b981', marginRight: '8px' }}></i> Speak clearly into your microphone</li>
              <li><i className="fas fa-check" style={{ color: '#10b981', marginRight: '8px' }}></i> Wait for the AI to respond</li>
            </ul>
          </div>

          {/* Assistant Info */}
          <div style={{
            marginTop: '20px',
            padding: '15px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '8px',
            fontSize: '0.85rem',
            color: 'var(--text-secondary)'
          }}>
            <p style={{ margin: '5px 0' }}>
              <strong>Assistant ID:</strong> {ASSISTANT_ID.substring(0, 20)}...
            </p>
            <p style={{ margin: '5px 0' }}>
              <strong>Status:</strong> Ready
            </p>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        @keyframes ripple {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default VoiceTest;
