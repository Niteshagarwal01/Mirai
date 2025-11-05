import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { voiceAgentAPI } from '../services/backendAPI.js';
import '../css/content-generator.css';
import '../css/voice-agent.css';

const VoiceAgent = () => {
  const { getToken } = useAuth();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [voiceAgents, setVoiceAgents] = useState([]);
  const [stats, setStats] = useState({
    activeAgents: 0,
    totalCalls: 0,
    successRate: 94.2
  });
  const [assistantData, setAssistantData] = useState({
    name: '',
    voice: 'Mark',
    language: 'English',
    temperature: '0.3',
    maxDuration: '180',
    systemPrompt: '',
    documents: null
  });

  // Load voice agents on component mount
  useEffect(() => {
    loadVoiceAgents();
  }, []);

  const loadVoiceAgents = async () => {
    try {
      const token = await getToken();
      const response = await voiceAgentAPI.getAll(token);
      
      if (response.success) {
        setVoiceAgents(response.assistants);
        setStats({
          activeAgents: response.assistants.length,
          totalCalls: response.assistants.reduce((sum, agent) => sum + (agent.totalCalls || 0), 0),
          successRate: 94.2
        });
      }
    } catch (error) {
      console.error('Failed to load voice agents:', error);
    }
  };

  const handleCreateAssistant = async () => {
    if (!assistantData.name || !assistantData.systemPrompt) {
      alert('Please fill in the required fields (Name and System Prompt)');
      return;
    }

    setLoading(true);
    try {
      const token = await getToken();
      
      // Convert the form data to match the API
      const voiceAgentData = {
        name: assistantData.name,
        type: 'voice-assistant',
        description: assistantData.systemPrompt,
        systemPrompt: assistantData.systemPrompt,
        voiceId: assistantData.voice.toLowerCase(),
        firstMessage: `Hello! I'm ${assistantData.name}, how can I help you today?`,
        endCallMessage: 'Thank you for calling. Have a great day!'
      };
      
      const response = await voiceAgentAPI.create(token, voiceAgentData);
      
      if (response.success) {
        alert('🎉 Voice Agent created successfully! Your AI assistant is ready to handle calls.');
        setShowCreateForm(false);
        setAssistantData({
          name: '',
          voice: 'Mark',
          language: 'English',
          temperature: '0.3',
          maxDuration: '180',
          systemPrompt: '',
          documents: null
        });
        loadVoiceAgents(); // Reload the list
      }
    } catch (error) {
      console.error('Voice agent creation error:', error);
      alert(`Failed to create voice agent: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (event) => {
    const files = event.target.files;
    setAssistantData({...assistantData, documents: files});
  };

  return (
    <div className="content-generator">
      <div className="page-header">
        <div className="header-icon">
          <i className="fas fa-microphone"></i>
        </div>
        <div className="header-content">
          <h1>Voice <span className="gradient-text">Agent</span></h1>
          <p>Create AI assistants that can make phone calls to your customers</p>
        </div>
        <button 
          className="create-assistant-btn"
          onClick={() => setShowCreateForm(true)}
        >
          <i className="fas fa-plus"></i>
          Create Assistant
        </button>
      </div>

      <div className="container">
        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-header">
              <h3>Assistants</h3>
            </div>
            <div className="stat-value">{stats.activeAgents}</div>
            <div className="stat-label">AI voice agents created</div>
          </div>
              
              <div className="stat-card">
                <div className="stat-header">
                  <h3>Total Calls</h3>
                </div>
                <div className="stat-value">{stats.totalCalls}</div>
                <div className="stat-label">Made with your assistants</div>
              </div>
              
              <div className="stat-card">
                <div className="stat-header">
                  <h3>Success Rate</h3>
                </div>
                <div className="stat-value">{stats.successRate}%</div>
                <div className="stat-label">Call completion rate</div>
              </div>
            </div>

            {/* Action Tabs */}
            <div className="action-tabs">
              <button className="tab-btn active">
                <i className="fas fa-robot"></i>
                Assistants
              </button>
              <button className="tab-btn">
                <i className="fas fa-bullhorn"></i>
                Campaigns
              </button>
              <button className="tab-btn">
                <i className="fas fa-history"></i>
                Call History
              </button>
            </div>

            {/* Empty State */}
            <div className="empty-state">
              <div className="empty-icon">
                <i className="fas fa-robot"></i>
              </div>
              <h2>No Voice Assistants Yet</h2>
              <p>Create your first AI voice assistant to start making automated calls to your customers.</p>
              <button 
                className="create-first-btn"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowCreateForm(true);
                }}
              >
                <i className="fas fa-plus"></i>
                Create Your First Assistant
              </button>
            </div>
          </div>

          {/* Modal Overlay - Always present but conditionally visible */}
          {showCreateForm && (
            <div className="modal-overlay" onClick={() => setShowCreateForm(false)}>
              <div className="modal-container" onClick={(e) => e.stopPropagation()}>
              {/* Create Assistant Form */}
              <div className="create-form-container">
                <div className="form-header">
                  <h2>
                    <i className="fas fa-microphone"></i>
                    Create Voice Assistant
                  </h2>
                  <button 
                    className="close-btn"
                    onClick={() => setShowCreateForm(false)}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>

              <div className="form-content">
                <div className="form-section">
                  <div className="form-row">
                    <div className="form-group half">
                      <label>Assistant Name*</label>
                      <input
                        type="text"
                        placeholder="e.g. Sales Assistant"
                        value={assistantData.name}
                        onChange={(e) => setAssistantData({...assistantData, name: e.target.value})}
                      />
                    </div>
                    <div className="form-group half">
                      <label>Voice</label>
                      <select
                        value={assistantData.voice}
                        onChange={(e) => setAssistantData({...assistantData, voice: e.target.value})}
                      >
                        <option value="Mark">Mark</option>
                        <option value="Sarah">Sarah</option>
                        <option value="David">David</option>
                        <option value="Emma">Emma</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group half">
                      <label>Language</label>
                      <select
                        value={assistantData.language}
                        onChange={(e) => setAssistantData({...assistantData, language: e.target.value})}
                      >
                        <option value="English">English</option>
                        <option value="Spanish">Spanish</option>
                        <option value="French">French</option>
                        <option value="German">German</option>
                      </select>
                    </div>
                    <div className="form-group half">
                      <label>Who Speaks First</label>
                      <select defaultValue="Assistant">
                        <option value="Assistant">Assistant</option>
                        <option value="Customer">Customer</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group half">
                      <label>Temperature (0-1)</label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="1"
                        value={assistantData.temperature}
                        onChange={(e) => setAssistantData({...assistantData, temperature: e.target.value})}
                      />
                    </div>
                    <div className="form-group half">
                      <label>Maximum Call Duration (seconds)</label>
                      <input
                        type="number"
                        value={assistantData.maxDuration}
                        onChange={(e) => setAssistantData({...assistantData, maxDuration: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>System Prompt*</label>
                    <textarea
                      rows="6"
                      placeholder="How should your assistant behave? What information should it provide?"
                      value={assistantData.systemPrompt}
                      onChange={(e) => setAssistantData({...assistantData, systemPrompt: e.target.value})}
                    ></textarea>
                    <div className="form-hint">
                      <i className="fas fa-info-circle"></i>
                      This prompt guides how your assistant will speak with customers.
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Upload Documents with Phone Numbers*</label>
                    <div className="file-upload-area">
                      <input
                        type="file"
                        id="documents"
                        multiple
                        accept=".pdf,.docx,.csv"
                        onChange={handleFileUpload}
                        style={{display: 'none'}}
                      />
                      <label htmlFor="documents" className="file-upload-label">
                        <i className="fas fa-upload"></i>
                        <span>Drag & drop files here, or click to select</span>
                        <div className="supported-formats">Supported formats: PDF, DOCX, CSV</div>
                      </label>
                    </div>
                    <div className="form-hint">
                      <i className="fas fa-info-circle"></i>
                      Upload PDF, DOCX, or CSV files containing phone numbers and context for the assistant. The system will automatically extract numbers to call.
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group half">
                      <label>Call Schedule</label>
                      <select>
                        <option value="immediate">Start Immediately</option>
                        <option value="scheduled">Schedule for Later</option>
                        <option value="recurring">Recurring Calls</option>
                      </select>
                    </div>

                    <div className="form-group half">
                      <label>Time Zone</label>
                      <select>
                        <option value="EST">Eastern Time (EST)</option>
                        <option value="CST">Central Time (CST)</option>
                        <option value="MST">Mountain Time (MST)</option>
                        <option value="PST">Pacific Time (PST)</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group half">
                      <label>Max Retries</label>
                      <input
                        type="number"
                        placeholder="3"
                        min="0"
                        max="10"
                      />
                    </div>

                    <div className="form-group half">
                      <label>Retry Delay (hours)</label>
                      <input
                        type="number"
                        placeholder="2"
                        min="1"
                        max="24"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Advanced Settings</label>
                    <textarea
                      rows="3"
                      placeholder="Additional configuration options, webhook URLs, or custom parameters..."
                    ></textarea>
                    <div className="form-hint">
                      <i className="fas fa-info-circle"></i>
                      Configure advanced options like webhooks, custom parameters, or integration settings.
                    </div>
                  </div>

                  <button className="create-btn" onClick={handleCreateAssistant} disabled={loading}>
                    <i className="fas fa-plus"></i>
                    {loading ? 'Creating...' : 'Create Assistant'}
                  </button>
                </div>
              </div>
            </div>
          </div>
      </div>
      )}
    </div>
  );
};
export default VoiceAgent;