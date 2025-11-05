import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { chatbotAPI } from '../services/backendAPI.js';
import '../css/content-generator.css';
import '../css/voice-agent.css';

const Chatbot = () => {
  const { getToken } = useAuth();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [chatbots, setChatbots] = useState([]);
  const [loadingBots, setLoadingBots] = useState(true);
  const [stats, setStats] = useState({
    activeChatbots: 0,
    totalConversations: 0,
    resolutionRate: 92.5
  });
  const [chatbotData, setChatbotData] = useState({
    name: '',
    type: 'customer-support',
    description: '',
    personality: 'professional',
    language: 'english',
    knowledgeBase: null,
    welcomeMessage: '',
    fallbackMessage: '',
    integrations: []
  });

  // Load chatbots on component mount
  useEffect(() => {
    loadChatbots();
  }, []);

  const loadChatbots = async () => {
    setLoadingBots(true);
    try {
      const token = await getToken();
      const response = await chatbotAPI.getAll(token);
      
      if (response.success) {
        setChatbots(response.chatbots);
        setStats({
          activeChatbots: response.chatbots.length,
          totalConversations: response.chatbots.reduce((sum, bot) => sum + (bot.totalConversations || 0), 0),
          resolutionRate: 92.5
        });
      }
    } catch (error) {
      console.error('Failed to load chatbots:', error);
    } finally {
      setLoadingBots(false);
    }
  };

  const handleCreateChatbot = async () => {
    if (!chatbotData.name || !chatbotData.description) {
      alert('Please fill in the required fields (Name and Description)');
      return;
    }

    setLoading(true);
    try {
      const token = await getToken();
      const response = await chatbotAPI.create(token, chatbotData);
      
      if (response.success) {
        alert('🎉 Chatbot created successfully! Your AI assistant is ready to help customers.');
        setShowCreateForm(false);
        setChatbotData({
          name: '',
          type: 'customer-support',
          description: '',
          personality: 'professional',
          language: 'english',
          knowledgeBase: null,
          welcomeMessage: '',
          fallbackMessage: '',
          integrations: []
        });
        loadChatbots(); // Reload the list
      }
    } catch (error) {
      console.error('Chatbot creation error:', error);
      alert(`Failed to create chatbot: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (event) => {
    const files = event.target.files;
    setChatbotData({...chatbotData, knowledgeBase: files});
  };

  const handleIntegrationChange = (integration, checked) => {
    if (checked) {
      setChatbotData({
        ...chatbotData, 
        integrations: [...chatbotData.integrations, integration]
      });
    } else {
      setChatbotData({
        ...chatbotData,
        integrations: chatbotData.integrations.filter(i => i !== integration)
      });
    }
  };

  return (
    <div className="content-generator">
      <div className="page-header">
        <div className="header-icon">
          <i className="fas fa-robot"></i>
        </div>
        <div className="header-content">
          <h1>AI <span className="gradient-text">Chatbot</span></h1>
          <p>Create intelligent chatbots powered by Chatbase for customer support and engagement</p>
        </div>
        <button 
          className="create-assistant-btn"
          onClick={() => setShowCreateForm(true)}
        >
          <i className="fas fa-plus"></i>
          New Chatbot
        </button>
      </div>

      <div className="container">
        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-header">
              <h3>Active Chatbots</h3>
            </div>
            <div className="stat-value">{stats.activeChatbots}</div>
            <div className="stat-label">Currently deployed</div>
          </div>
              
          <div className="stat-card">
            <div className="stat-header">
              <h3>Total Conversations</h3>
            </div>
            <div className="stat-value">{stats.totalConversations}</div>
            <div className="stat-label">This month</div>
          </div>
              
          <div className="stat-card">
            <div className="stat-header">
              <h3>Resolution Rate</h3>
            </div>
            <div className="stat-value">{stats.resolutionRate}%</div>
            <div className="stat-label">Customer satisfaction</div>
          </div>
        </div>

        {/* Action Tabs */}
        <div className="action-tabs">
          <button className="tab-btn active">
            <i className="fas fa-robot"></i>
            Chatbots
          </button>
          <button className="tab-btn">
            <i className="fas fa-comments"></i>
            Conversations
          </button>
          <button className="tab-btn">
            <i className="fas fa-chart-line"></i>
            Analytics
          </button>
        </div>

        {/* Loading State */}
        {loadingBots ? (
          <div className="loading-state">
            <div className="loading-spinner">
              <i className="fas fa-spinner fa-spin"></i>
            </div>
            <p>Loading your chatbots...</p>
          </div>
        ) : (
          <>
            {/* Empty State */}
            {chatbots.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  <i className="fas fa-robot"></i>
                </div>
                <h2>No Chatbots Created Yet</h2>
                <p>Create your first AI-powered chatbot to automate customer support and boost engagement.</p>
                <button 
                  className="create-first-btn"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowCreateForm(true);
                  }}
                >
                  <i className="fas fa-plus"></i>
                  Create Your First Chatbot
                </button>
              </div>
            ) : (
              <>
                {/* Success Message */}
                <div className="success-banner">
                  <div className="success-content">
                    <i className="fas fa-check-circle"></i>
                    <div>
                      <h3>Great! Your chatbots are ready</h3>
                      <p>You have {chatbots.length} active chatbot{chatbots.length !== 1 ? 's' : ''} helping your customers 24/7</p>
                    </div>
                  </div>
                  <button 
                    className="add-more-btn"
                    onClick={() => setShowCreateForm(true)}
                  >
                    <i className="fas fa-plus"></i>
                    Add New Chatbot
                  </button>
                </div>

                {/* Chatbots Grid */}
                <div className="bots-grid">
                  {chatbots.map((chatbot) => (
                    <div key={chatbot.id} className="bot-card">
                      <div className="bot-header">
                        <h3>{chatbot.name}</h3>
                        <div className="bot-status active">
                          <i className="fas fa-circle"></i>
                          Active
                        </div>
                      </div>
                      <p>{chatbot.description}</p>
                      <div className="bot-stats">
                        <div className="bot-stat">
                          <div className="stat-number">{chatbot.totalConversations || 0}</div>
                          <div className="stat-label">Conversations</div>
                        </div>
                        <div className="bot-stat">
                          <div className="stat-number">{chatbot.type?.replace('-', ' ') || 'General'}</div>
                          <div className="stat-label">Type</div>
                        </div>
                        <div className="bot-stat">
                          <div className="stat-number">95%</div>
                          <div className="stat-label">Accuracy</div>
                        </div>
                      </div>
                      <div className="bot-actions">
                        <button className="btn-secondary">
                          <i className="fas fa-cog"></i>
                          Configure
                        </button>
                        <button className="btn-primary">
                          <i className="fas fa-comments"></i>
                          Test Chat
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* Modal Overlay */}
      {showCreateForm && (
        <div className="modal-overlay" onClick={() => setShowCreateForm(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="create-form-container">
              <div className="form-header">
                <h2>
                  <i className="fas fa-robot"></i>
                  Create AI Chatbot
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
                      <label>Chatbot Name*</label>
                      <input
                        type="text"
                        placeholder="e.g. Customer Support Bot"
                        value={chatbotData.name}
                        onChange={(e) => setChatbotData({...chatbotData, name: e.target.value})}
                      />
                    </div>
                    <div className="form-group half">
                      <label>Chatbot Type</label>
                      <select
                        value={chatbotData.type}
                        onChange={(e) => setChatbotData({...chatbotData, type: e.target.value})}
                      >
                        <option value="customer-support">Customer Support</option>
                        <option value="sales">Sales Assistant</option>
                        <option value="lead-generation">Lead Generation</option>
                        <option value="faq">FAQ Bot</option>
                        <option value="booking">Booking Assistant</option>
                        <option value="ecommerce">E-commerce Helper</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Chatbot Description*</label>
                    <textarea
                      rows="3"
                      placeholder="Describe what your chatbot should help customers with..."
                      value={chatbotData.description}
                      onChange={(e) => setChatbotData({...chatbotData, description: e.target.value})}
                    ></textarea>
                  </div>

                  <div className="form-row">
                    <div className="form-group half">
                      <label>Personality</label>
                      <select
                        value={chatbotData.personality}
                        onChange={(e) => setChatbotData({...chatbotData, personality: e.target.value})}
                      >
                        <option value="professional">Professional</option>
                        <option value="friendly">Friendly</option>
                        <option value="casual">Casual</option>
                        <option value="formal">Formal</option>
                        <option value="enthusiastic">Enthusiastic</option>
                      </select>
                    </div>
                    <div className="form-group half">
                      <label>Primary Language</label>
                      <select
                        value={chatbotData.language}
                        onChange={(e) => setChatbotData({...chatbotData, language: e.target.value})}
                      >
                        <option value="english">English</option>
                        <option value="spanish">Spanish</option>
                        <option value="french">French</option>
                        <option value="german">German</option>
                        <option value="hindi">Hindi</option>
                        <option value="chinese">Chinese</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Knowledge Base Upload</label>
                    <div className="file-upload-area">
                      <input
                        type="file"
                        id="knowledgeBase"
                        multiple
                        accept=".pdf,.txt,.docx,.csv"
                        onChange={handleFileUpload}
                        style={{display: 'none'}}
                      />
                      <label htmlFor="knowledgeBase" className="file-upload-label">
                        <i className="fas fa-upload"></i>
                        <span>Upload documents to train your chatbot</span>
                        <div className="supported-formats">Supported: PDF, TXT, DOCX, CSV</div>
                      </label>
                    </div>
                    <div className="form-hint">
                      <i className="fas fa-info-circle"></i>
                      Upload FAQs, product manuals, or support documents to improve chatbot responses.
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group half">
                      <label>Welcome Message</label>
                      <input
                        type="text"
                        placeholder="Hi! How can I help you today?"
                        value={chatbotData.welcomeMessage}
                        onChange={(e) => setChatbotData({...chatbotData, welcomeMessage: e.target.value})}
                      />
                    </div>
                    <div className="form-group half">
                      <label>Fallback Message</label>
                      <input
                        type="text"
                        placeholder="I don't understand. Can you rephrase?"
                        value={chatbotData.fallbackMessage}
                        onChange={(e) => setChatbotData({...chatbotData, fallbackMessage: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Integration Platforms</label>
                    <div className="checkbox-grid">
                      <label className="checkbox-item">
                        <input
                          type="checkbox"
                          onChange={(e) => handleIntegrationChange('website', e.target.checked)}
                        />
                        <span className="checkmark"></span>
                        <div className="checkbox-content">
                          <i className="fas fa-globe"></i>
                          <span>Website Widget</span>
                        </div>
                      </label>

                      <label className="checkbox-item">
                        <input
                          type="checkbox"
                          onChange={(e) => handleIntegrationChange('whatsapp', e.target.checked)}
                        />
                        <span className="checkmark"></span>
                        <div className="checkbox-content">
                          <i className="fab fa-whatsapp"></i>
                          <span>WhatsApp</span>
                        </div>
                      </label>

                      <label className="checkbox-item">
                        <input
                          type="checkbox"
                          onChange={(e) => handleIntegrationChange('facebook', e.target.checked)}
                        />
                        <span className="checkmark"></span>
                        <div className="checkbox-content">
                          <i className="fab fa-facebook-messenger"></i>
                          <span>Facebook Messenger</span>
                        </div>
                      </label>

                      <label className="checkbox-item">
                        <input
                          type="checkbox"
                          onChange={(e) => handleIntegrationChange('telegram', e.target.checked)}
                        />
                        <span className="checkmark"></span>
                        <div className="checkbox-content">
                          <i className="fab fa-telegram"></i>
                          <span>Telegram</span>
                        </div>
                      </label>

                      <label className="checkbox-item">
                        <input
                          type="checkbox"
                          onChange={(e) => handleIntegrationChange('slack', e.target.checked)}
                        />
                        <span className="checkmark"></span>
                        <div className="checkbox-content">
                          <i className="fab fa-slack"></i>
                          <span>Slack</span>
                        </div>
                      </label>

                      <label className="checkbox-item">
                        <input
                          type="checkbox"
                          onChange={(e) => handleIntegrationChange('discord', e.target.checked)}
                        />
                        <span className="checkmark"></span>
                        <div className="checkbox-content">
                          <i className="fab fa-discord"></i>
                          <span>Discord</span>
                        </div>
                      </label>
                    </div>
                  </div>

                  <button className="create-btn" onClick={handleCreateChatbot} disabled={loading}>
                    <i className="fas fa-rocket"></i>
                    {loading ? 'Creating...' : 'Create Chatbot'}
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

export default Chatbot;