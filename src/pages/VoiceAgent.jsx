import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Vapi from '@vapi-ai/web';
import '../css/content-generator.css';

const VoiceAgent = () => {
  const navigate = useNavigate();
  const [isCallActive, setIsCallActive] = useState(false);
  const [callStatus, setCallStatus] = useState('Ready to call');
  const [isMuted, setIsMuted] = useState(false);
  const [messages, setMessages] = useState([]);
  const vapiInstanceRef = useRef(null);

  // Your VAPI credentials
  const VAPI_API_KEY = '27212012-b4a1-4792-abd5-79033b637907';
  const VAPI_ASSISTANT_ID = '9b33243a-6af2-44f4-a9d2-eedeb9615561';

  const addMessage = (role, text) => {
    setMessages(prev => [...prev, { role, text, timestamp: new Date() }]);
  };

  useEffect(() => {
    // Initialize VAPI with npm package
    console.log('🔧 Initializing VAPI...');
    
    try {
      vapiInstanceRef.current = new Vapi(VAPI_API_KEY);

      // Event listeners
      vapiInstanceRef.current.on('call-start', () => {
        console.log('Call started');
        setIsCallActive(true);
        setCallStatus('Connected - Speaking with Rai');
        addMessage('system', 'Call connected. Rai is ready to help you!');
      });

      vapiInstanceRef.current.on('call-end', () => {
        console.log('Call ended');
        setIsCallActive(false);
        setCallStatus('Call ended');
        addMessage('system', 'Call ended. Thank you for using our service!');
      });

      vapiInstanceRef.current.on('speech-start', () => {
        console.log('User started speaking');
        setCallStatus('Listening...');
      });

      vapiInstanceRef.current.on('speech-end', () => {
        console.log('User stopped speaking');
        setCallStatus('Processing...');
      });

      vapiInstanceRef.current.on('message', (message) => {
        console.log('Message:', message);
        
        if (message.type === 'transcript' && message.transcriptType === 'final') {
          if (message.role === 'user') {
            addMessage('user', message.transcript);
          } else if (message.role === 'assistant') {
            addMessage('assistant', message.transcript);
            setCallStatus('Connected - Speaking with Rai');
          }
        }
      });

      vapiInstanceRef.current.on('error', (error) => {
        console.error('VAPI Error:', error);
        setCallStatus('Error: ' + error.message);
        addMessage('system', 'Error: ' + error.message);
      });

      console.log('✅ VAPI initialized successfully');
      setCallStatus('Ready to call');
    } catch (error) {
      console.error('❌ Error initializing VAPI:', error);
      setCallStatus('Failed to initialize');
    }

    return () => {
      if (vapiInstanceRef.current) {
        try {
          vapiInstanceRef.current.stop();
        } catch (e) {
          console.error('Error stopping call:', e);
        }
      }
    };
  }, []);

  const startCall = async () => {
    try {
      console.log('🔵 Starting call...');
      
      if (!vapiInstanceRef.current) {
        const errorMsg = 'VAPI SDK not loaded yet. Please refresh the page and try again.';
        console.error('❌', errorMsg);
        alert(errorMsg);
        setCallStatus('SDK not ready');
        return;
      }

      setCallStatus('Connecting...');
      addMessage('system', 'Initiating call to Rai...');

      console.log('📞 Calling assistant:', VAPI_ASSISTANT_ID);
      await vapiInstanceRef.current.start(VAPI_ASSISTANT_ID);
      console.log('✅ Call started successfully');
    } catch (error) {
      console.error('❌ Error starting call:', error);
      setCallStatus('Failed to connect');
      addMessage('system', 'Failed to start call: ' + error.message);
      alert('Failed to start call: ' + error.message);
    }
  };

  const endCall = () => {
    if (vapiInstanceRef.current && isCallActive) {
      vapiInstanceRef.current.stop();
      setIsCallActive(false);
      setCallStatus('Ready to call');
    }
  };

  const toggleMute = () => {
    if (vapiInstanceRef.current && isCallActive) {
      const newMutedState = !isMuted;
      vapiInstanceRef.current.setMuted(newMutedState);
      setIsMuted(newMutedState);
      addMessage('system', newMutedState ? 'Microphone muted' : 'Microphone unmuted');
    }
  };

  return (
    <div className="content-generator-page">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1>Voice Calling Agent</h1>
          <p>Talk to Rai - Your AI Customer Support Assistant</p>
        </div>
        <button className="btn-secondary" onClick={() => navigate('/admin')}>
          <i className="fas fa-arrow-left"></i> Back
        </button>
      </div>

      {/* Main Call Interface */}
      <div className="content-type-selection">
        <div className="content-types-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
          
          {/* Call Controls */}
          <div className="content-type-card" style={{ height: '500px' }}>
            <div className="type-image" style={{
              height: '200px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: isCallActive 
                ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' 
                : 'linear-gradient(135deg, #6e40ff 0%, #5530c7 100%)'
            }}>
              <div style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: isCallActive ? 'pulse 2s infinite' : 'none'
              }}>
                <i className={`fas ${isCallActive ? 'fa-phone' : 'fa-phone-alt'}`} style={{
                  fontSize: '48px',
                  color: 'white'
                }}></i>
              </div>
            </div>

            <div className="type-info" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ marginBottom: '15px' }}>
                  <i className="fas fa-robot"></i> Rai - Customer Support
                </h3>
                <div style={{
                  padding: '15px',
                  background: 'rgba(110, 64, 255, 0.1)',
                  borderRadius: '12px',
                  marginBottom: '20px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <i className={`fas fa-circle`} style={{
                      fontSize: '10px',
                      color: isCallActive ? '#10b981' : '#ef4444'
                    }}></i>
                    <span style={{ fontWeight: 600 }}>{callStatus}</span>
                  </div>
                  <p style={{ fontSize: '0.85rem', opacity: 0.8, margin: 0 }}>
                    {isCallActive 
                      ? 'Speak naturally. Rai is listening and will respond.'
                      : 'Click "Start Call" to talk with Rai'
                    }
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {!isCallActive ? (
                  <button 
                    className="btn-primary btn-full"
                    onClick={startCall}
                    style={{ padding: '15px' }}
                  >
                    <i className="fas fa-phone"></i> Start Call
                  </button>
                ) : (
                  <>
                    <button 
                      className="btn-secondary btn-full"
                      onClick={toggleMute}
                      style={{ padding: '12px' }}
                    >
                      <i className={`fas ${isMuted ? 'fa-microphone-slash' : 'fa-microphone'}`}></i>
                      {isMuted ? 'Unmute' : 'Mute'}
                    </button>
                    <button 
                      className="btn-primary btn-full"
                      onClick={endCall}
                      style={{ 
                        padding: '15px',
                        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                      }}
                    >
                      <i className="fas fa-phone-slash"></i> End Call
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Live Transcript */}
          <div className="content-type-card" style={{ height: '500px' }}>
            <div className="type-image" style={{
              height: '60px',
              display: 'flex',
              alignItems: 'center',
              padding: '0 20px',
              background: 'linear-gradient(135deg, #1a1c24 0%, #252836 100%)'
            }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>
                <i className="fas fa-comments"></i> Live Transcript
              </h3>
            </div>

            <div style={{
              flex: 1,
              padding: '20px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              {messages.length === 0 ? (
                <div style={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0.5,
                  textAlign: 'center'
                }}>
                  <div>
                    <i className="fas fa-comment-dots" style={{ fontSize: '48px', marginBottom: '15px', opacity: 0.3 }}></i>
                    <p>Call transcript will appear here</p>
                  </div>
                </div>
              ) : (
                messages.map((msg, idx) => (
                  <div 
                    key={idx}
                    style={{
                      padding: '12px 16px',
                      borderRadius: '12px',
                      background: msg.role === 'user' 
                        ? 'rgba(110, 64, 255, 0.2)'
                        : msg.role === 'assistant'
                        ? 'rgba(16, 185, 129, 0.2)'
                        : 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid ' + (
                        msg.role === 'user' 
                          ? 'rgba(110, 64, 255, 0.3)'
                          : msg.role === 'assistant'
                          ? 'rgba(16, 185, 129, 0.3)'
                          : 'rgba(255, 255, 255, 0.1)'
                      )
                    }}
                  >
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px',
                      marginBottom: '6px'
                    }}>
                      <i className={`fas ${
                        msg.role === 'user' ? 'fa-user' :
                        msg.role === 'assistant' ? 'fa-robot' :
                        'fa-info-circle'
                      }`} style={{ fontSize: '12px', opacity: 0.7 }}></i>
                      <span style={{ 
                        fontSize: '0.75rem', 
                        fontWeight: 600,
                        textTransform: 'capitalize',
                        opacity: 0.7
                      }}>
                        {msg.role === 'assistant' ? 'Rai' : msg.role}
                      </span>
                      <span style={{ 
                        fontSize: '0.7rem', 
                        opacity: 0.5,
                        marginLeft: 'auto'
                      }}>
                        {msg.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <p style={{ 
                      margin: 0, 
                      fontSize: '0.9rem',
                      lineHeight: 1.5
                    }}>
                      {msg.text}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Assistant Info */}
      <div className="content-type-selection">
        <h2><i className="fas fa-info-circle"></i> About Rai</h2>
        <div className="content-types-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          <div className="content-type-card">
            <div className="type-image" style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #1a1c24 0%, #252836 100%)'
            }}>
              <i className="fas fa-brain fa-3x" style={{ color: '#6e40ff' }}></i>
            </div>
            <div className="type-info">
              <h3>Powered by GPT-4o Mini</h3>
              <p>Advanced AI model for natural conversations and intelligent responses</p>
            </div>
          </div>

          <div className="content-type-card">
            <div className="type-image" style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #1a1c24 0%, #252836 100%)'
            }}>
              <i className="fas fa-microphone fa-3x" style={{ color: '#6e40ff' }}></i>
            </div>
            <div className="type-info">
              <h3>Deepgram Voice</h3>
              <p>High-quality voice synthesis with Luna voice model for natural speech</p>
            </div>
          </div>

          <div className="content-type-card">
            <div className="type-image" style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #1a1c24 0%, #252836 100%)'
            }}>
              <i className="fas fa-headset fa-3x" style={{ color: '#6e40ff' }}></i>
            </div>
            <div className="type-info">
              <h3>Customer Support</h3>
              <p>Trained specifically for TechSolutions customer service and support queries</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7);
          }
          50% {
            box-shadow: 0 0 0 20px rgba(255, 255, 255, 0);
          }
        }
      `}</style>
    </div>
  );
};

export default VoiceAgent;
