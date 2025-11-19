import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import Vapi from '@vapi-ai/web';
import '../css/content-generator.css';

const VoiceAgent = () => {
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const [isCallActive, setIsCallActive] = useState(false);
  const [callStatus, setCallStatus] = useState('Ready to call');
  const [isMuted, setIsMuted] = useState(false);
  const [messages, setMessages] = useState([]);
  const [assistants, setAssistants] = useState([]);
  const [selectedAssistant, setSelectedAssistant] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState('voice'); // 'voice' or 'chat'
  const [chatInput, setChatInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const vapiInstanceRef = useRef(null);
  const chatEndRef = useRef(null);

  // Your VAPI credentials from environment variables
  const VAPI_API_KEY = import.meta.env.VITE_VAPI_PUBLIC_KEY || '27212012-b4a1-4792-abd5-79033b637907';
  const VAPI_ASSISTANT_ID = import.meta.env.VITE_VAPI_ASSISTANT_ID || '9b33243a-6af2-44f4-a9d2-eedeb9615561';

  const addMessage = (role, text) => {
    setMessages(prev => [...prev, { role, text, timestamp: new Date() }]);
  };

  // Fetch assistants from backend
  useEffect(() => {
    fetchAssistants();
  }, []);

  const fetchAssistants = async () => {
    try {
      const token = await getToken();
      const response = await fetch('http://localhost:3001/api/voice-agents/assistants', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      if (data.success && data.assistants && data.assistants.length > 0) {
        setAssistants(data.assistants);
        // Set default assistant
        const defaultAssistant = data.assistants.find(a => a.id === VAPI_ASSISTANT_ID) || data.assistants[0];
        setSelectedAssistant(defaultAssistant);
      } else {
        // Set default assistant if no assistants found
        const defaultAssistant = {
          id: VAPI_ASSISTANT_ID,
          name: 'Rai - Customer Support',
          model: { model: 'gpt-4o-mini' },
          voice: { voiceId: 'luna' }
        };
        setAssistants([defaultAssistant]);
        setSelectedAssistant(defaultAssistant);
      }
    } catch (error) {
      console.error('Error fetching assistants:', error);
      // Set default assistant if fetch fails
      const defaultAssistant = {
        id: VAPI_ASSISTANT_ID,
        name: 'Rai - Customer Support',
        model: { model: 'gpt-4o-mini' },
        voice: { voiceId: 'luna' }
      };
      setAssistants([defaultAssistant]);
      setSelectedAssistant(defaultAssistant);
    } finally {
      setLoading(false);
    }
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
        setCallStatus(`Connected - Speaking with ${selectedAssistant?.name || 'Assistant'}`);
        addMessage('system', `Call connected. ${selectedAssistant?.name || 'Assistant'} is ready to help you!`);
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
            setCallStatus(`Connected - Speaking with ${selectedAssistant?.name || 'Assistant'}`);
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
      addMessage('system', `Initiating call to ${selectedAssistant?.name || 'Assistant'}...`);

      const assistantId = selectedAssistant?.id || VAPI_ASSISTANT_ID;
      console.log('📞 Calling assistant:', assistantId);
      await vapiInstanceRef.current.start(assistantId);
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

  // Chat mode functions
  const sendChatMessage = async () => {
    if (!chatInput.trim() || isSending) return;

    const userMessage = chatInput.trim();
    setChatInput('');
    setIsSending(true);

    // Add user message to chat
    addMessage('user', userMessage);

    try {
      const token = await getToken();
      const response = await fetch('http://localhost:3001/api/voice-agents/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: userMessage,
          assistantId: selectedAssistant?.id || VAPI_ASSISTANT_ID
        })
      });

      const data = await response.json();
      
      if (data.success) {
        addMessage('assistant', data.response);
      } else {
        addMessage('system', 'Error: ' + (data.error || 'Failed to get response'));
      }
    } catch (error) {
      console.error('Chat error:', error);
      addMessage('system', 'Error sending message: ' + error.message);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendChatMessage();
    }
  };

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  return (
    <div className="content-generator-page">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1>Voice Calling Agent</h1>
          <p>Talk to AI - Powered by VAPI</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-primary" onClick={() => setShowCreateModal(true)}>
            <i className="fas fa-plus"></i> Create New Assistant
          </button>
          <button className="btn-secondary" onClick={() => navigate('/admin')}>
            <i className="fas fa-arrow-left"></i> Back
          </button>
        </div>
      </div>

      {/* Active Assistant Info */}
      {selectedAssistant && (
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '30px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #6e40ff 0%, #5530c7 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <i className="fas fa-robot" style={{ fontSize: '24px', color: 'white' }}></i>
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: '0 0 5px 0', fontSize: '1.2rem' }}>
                {selectedAssistant.name}
              </h3>
              <p style={{ margin: 0, opacity: 0.7, fontSize: '0.9rem' }}>
                Model: {selectedAssistant.model?.model || selectedAssistant.model || 'GPT-4o Mini'} • Voice: {selectedAssistant.voice?.voiceId || selectedAssistant.voice || 'Luna'}
              </p>
            </div>
            {assistants.length > 1 && (
              <select
                value={selectedAssistant.id}
                onChange={(e) => {
                  const assistant = assistants.find(a => a.id === e.target.value);
                  setSelectedAssistant(assistant);
                }}
                style={{
                  padding: '10px 15px',
                  background: 'var(--bg-card)',
                  border: '2px solid var(--border)',
                  borderRadius: '8px',
                  color: 'var(--text-main)',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  minWidth: '200px',
                  fontWeight: '500'
                }}
              >
                {assistants.map(assistant => (
                  <option 
                    key={assistant.id} 
                    value={assistant.id}
                    style={{
                      background: 'var(--bg-card)',
                      color: 'var(--text-main)',
                      padding: '10px'
                    }}
                  >
                    {assistant.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
      )}

      {/* Mode Toggle */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '30px',
        gap: '10px'
      }}>
        <button
          onClick={() => setMode('voice')}
          style={{
            padding: '12px 30px',
            background: mode === 'voice' ? 'linear-gradient(135deg, #6e40ff 0%, #5530c7 100%)' : 'var(--bg-card)',
            border: mode === 'voice' ? 'none' : '1px solid var(--border)',
            borderRadius: '10px',
            color: mode === 'voice' ? 'white' : 'var(--text-main)',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <i className="fas fa-phone"></i> Voice Call
        </button>
        <button
          onClick={() => setMode('chat')}
          style={{
            padding: '12px 30px',
            background: mode === 'chat' ? 'linear-gradient(135deg, #6e40ff 0%, #5530c7 100%)' : 'var(--bg-card)',
            border: mode === 'chat' ? 'none' : '1px solid var(--border)',
            borderRadius: '10px',
            color: mode === 'chat' ? 'white' : 'var(--text-main)',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <i className="fas fa-comments"></i> Text Chat
        </button>
      </div>

      {/* Main Interface */}
      <div className="content-type-selection">
        <div className="content-types-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
          
          {/* Call/Chat Controls */}
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
                  <i className="fas fa-robot"></i> {mode === 'voice' ? 'Voice Call' : 'Text Chat'}
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
                      color: (mode === 'voice' && isCallActive) ? '#10b981' : '#ef4444'
                    }}></i>
                    <span style={{ fontWeight: 600 }}>
                      {mode === 'voice' ? callStatus : 'Ready to chat'}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.85rem', opacity: 0.8, margin: 0 }}>
                    {mode === 'voice' 
                      ? (isCallActive 
                        ? `Speak naturally. ${selectedAssistant?.name || 'Assistant'} is listening and will respond.`
                        : `Click "Start Call" to talk with ${selectedAssistant?.name || 'Assistant'}`)
                      : 'Type your message below to chat with the assistant'
                    }
                  </p>
                </div>
              </div>

              {mode === 'voice' ? (
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
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{
                    padding: '15px',
                    background: 'rgba(110, 64, 255, 0.1)',
                    borderRadius: '12px',
                    display: 'flex',
                    gap: '10px',
                    alignItems: 'center'
                  }}>
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message..."
                      disabled={isSending}
                      style={{
                        flex: 1,
                        padding: '12px',
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border)',
                        borderRadius: '8px',
                        color: 'var(--text-main)',
                        fontSize: '0.95rem'
                      }}
                    />
                    <button
                      onClick={sendChatMessage}
                      disabled={!chatInput.trim() || isSending}
                      style={{
                        padding: '12px 20px',
                        background: 'linear-gradient(135deg, #6e40ff 0%, #5530c7 100%)',
                        border: 'none',
                        borderRadius: '8px',
                        color: 'white',
                        fontWeight: '600',
                        cursor: chatInput.trim() && !isSending ? 'pointer' : 'not-allowed',
                        opacity: chatInput.trim() && !isSending ? 1 : 0.5
                      }}
                    >
                      <i className="fas fa-paper-plane"></i> Send
                    </button>
                  </div>
                </div>
              )}
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
                <i className="fas fa-comments"></i> {mode === 'voice' ? 'Live Transcript' : 'Chat History'}
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
                        {msg.role === 'assistant' ? (selectedAssistant?.name || 'Assistant') : msg.role}
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
              <div ref={chatEndRef} />
            </div>
          </div>
        </div>
      </div>

      {/* Assistant Info */}
      <div className="content-type-selection">
        <h2><i className="fas fa-info-circle"></i> About Voice Agent</h2>
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
              <h3>AI-Powered Conversations</h3>
              <p>Advanced language models like GPT-4o Mini for natural and intelligent responses</p>
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
              <h3>Natural Voice Synthesis</h3>
              <p>High-quality voice generation with Deepgram for realistic and human-like speech</p>
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
              <h3>Multi-Modal Support</h3>
              <p>Switch between voice calls and text chat seamlessly for flexible communication</p>
            </div>
          </div>
        </div>
      </div>

      {/* Create Assistant Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2><i className="fas fa-plus-circle"></i> Create New Assistant</h2>
              <button className="modal-close" onClick={() => setShowCreateModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const assistantData = {
                name: formData.get('name'),
                systemPrompt: formData.get('systemPrompt'),
                model: formData.get('model'),
                voice: formData.get('voice'),
                firstMessage: formData.get('firstMessage')
              };
              
              try {
                setLoading(true);
                const token = await getToken();
                const response = await fetch('http://localhost:3001/api/voice-agents/assistants', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                  },
                  body: JSON.stringify(assistantData)
                });
                
                const data = await response.json();
                
                if (!response.ok) {
                  throw new Error(data.error || 'Failed to create assistant');
                }
                
                // Refresh assistants list
                await fetchAssistants();
                
                // Select the new assistant
                if (data.id) {
                  setSelectedAssistant(data);
                }
                
                setShowCreateModal(false);
                alert('Assistant created successfully! You can now use it for calls and chat.');
              } catch (error) {
                console.error('Error creating assistant:', error);
                alert('Failed to create assistant: ' + error.message);
              } finally {
                setLoading(false);
              }
            }}>
              <div className="form-group">
                <label htmlFor="name">
                  <i className="fas fa-robot"></i> Assistant Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="e.g., Customer Support Bot"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="systemPrompt">
                  <i className="fas fa-comment-dots"></i> System Prompt
                </label>
                <textarea
                  id="systemPrompt"
                  name="systemPrompt"
                  rows="4"
                  placeholder="Define the assistant's role, personality, and behavior..."
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="model">
                  <i className="fas fa-brain"></i> AI Model
                </label>
                <select id="model" name="model" required>
                  <option value="gpt-4o-mini">GPT-4o Mini (Faster, Cost-effective)</option>
                  <option value="gpt-4o">GPT-4o (Most Advanced)</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="voice">
                  <i className="fas fa-microphone"></i> Voice
                </label>
                <select id="voice" name="voice" required>
                  <option value="luna">Luna (Warm & Professional)</option>
                  <option value="aura">Aura (Energetic & Friendly)</option>
                  <option value="stellar">Stellar (Clear & Authoritative)</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="firstMessage">
                  <i className="fas fa-comment"></i> First Message
                </label>
                <input
                  type="text"
                  id="firstMessage"
                  name="firstMessage"
                  placeholder="e.g., Hi! How can I help you today?"
                  required
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i> Creating...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-check"></i> Create Assistant
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7);
          }
          50% {
            box-shadow: 0 0 0 20px rgba(255, 255, 255, 0);
          }
        }

        select {
          appearance: none;
          -webkit-appearance: none;
          -moz-appearance: none;
          background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
          background-repeat: no-repeat;
          background-position: right 10px center;
          background-size: 20px;
          padding-right: 40px !important;
        }

        select:hover {
          border-color: #6e40ff !important;
          background-color: rgba(110, 64, 255, 0.1) !important;
        }

        select:focus {
          outline: none;
          border-color: #6e40ff !important;
          box-shadow: 0 0 0 3px rgba(110, 64, 255, 0.2);
        }

        select option {
          background: #1a1c24;
          color: white;
          padding: 12px;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal-content {
          background: linear-gradient(135deg, #1a1c24 0%, #252836 100%);
          border-radius: 16px;
          max-width: 600px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px;
          border-bottom: 1px solid rgba(110, 64, 255, 0.2);
        }

        .modal-header h2 {
          margin: 0;
          color: white;
          font-size: 1.5rem;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .modal-close {
          background: none;
          border: none;
          color: #999;
          font-size: 1.5rem;
          cursor: pointer;
          padding: 0;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .modal-close:hover {
          background: rgba(255, 255, 255, 0.1);
          color: white;
        }

        .modal-content form {
          padding: 24px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          color: white;
          margin-bottom: 8px;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .form-group label i {
          color: #6e40ff;
        }

        .form-group input,
        .form-group textarea,
        .form-group select {
          width: 100%;
          padding: 12px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(110, 64, 255, 0.2);
          border-radius: 8px;
          color: white;
          font-size: 14px;
          transition: all 0.3s ease;
        }

        .form-group input:focus,
        .form-group textarea:focus,
        .form-group select:focus {
          outline: none;
          border-color: #6e40ff;
          background: rgba(255, 255, 255, 0.08);
        }

        .form-group textarea {
          resize: vertical;
          min-height: 100px;
        }

        .modal-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          margin-top: 24px;
        }

        .btn-secondary {
          padding: 12px 24px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          color: white;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.15);
        }

        .btn-primary {
          padding: 12px 24px;
          background: linear-gradient(135deg, #6e40ff 0%, #5028c8 100%);
          border: none;
          border-radius: 8px;
          color: white;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(110, 64, 255, 0.4);
        }

        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default VoiceAgent;
