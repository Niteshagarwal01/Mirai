import React, { useState } from 'react';
import '../css/content-generator.css';
import '../css/voice-agent.css';

const EmailMarketing = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [campaignData, setCampaignData] = useState({
    name: '',
    type: 'newsletter',
    subject: '',
    content: '',
    contacts: null
  });

  const handleCreateCampaign = () => {
    alert('🚧 Email Campaign creation is under development! This beautiful interface is ready for when our AI backend is connected.');
  };

  const handleFileUpload = (event) => {
    const files = event.target.files;
    setCampaignData({...campaignData, contacts: files});
  };

  return (
    <div className="content-generator">
      <div className="page-header">
        <div className="header-icon">
          <i className="fas fa-envelope"></i>
        </div>
        <div className="header-content">
          <h1>Email <span className="gradient-text">Marketing</span></h1>
          <p>Create and manage AI-powered email campaigns</p>
        </div>
        <button 
          className="create-assistant-btn"
          onClick={() => setShowCreateForm(true)}
        >
          <i className="fas fa-plus"></i>
          New Campaign
        </button>
      </div>

      <div className="container">
        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-header">
              <h3>Active Campaigns</h3>
            </div>
            <div className="stat-value">0</div>
            <div className="stat-label">Currently running campaigns</div>
          </div>
              
          <div className="stat-card">
            <div className="stat-header">
              <h3>Total Emails Sent</h3>
            </div>
            <div className="stat-value">0</div>
            <div className="stat-label">This month</div>
          </div>
              
          <div className="stat-card">
            <div className="stat-header">
              <h3>Average Open Rate</h3>
            </div>
            <div className="stat-value">24.5%</div>
            <div className="stat-label">Last 30 days</div>
          </div>
        </div>

        {/* Action Tabs */}
        <div className="action-tabs">
          <button className="tab-btn active">
            <i className="fas fa-envelope"></i>
            Campaigns
          </button>
          <button className="tab-btn">
            <i className="fas fa-chart-bar"></i>
            Analytics
          </button>
          <button className="tab-btn">
            <i className="fas fa-cog"></i>
            Templates
          </button>
        </div>

        {/* Empty State */}
        <div className="empty-state">
          <div className="empty-icon">
            <i className="fas fa-envelope"></i>
          </div>
          <h2>No Email Campaigns Yet</h2>
          <p>Create your first AI-powered email campaign to start reaching your customers.</p>
          <button 
            className="create-first-btn"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowCreateForm(true);
            }}
          >
            <i className="fas fa-plus"></i>
            Create Your First Campaign
          </button>
        </div>
      </div>

      {/* Modal Overlay */}
      {showCreateForm && (
        <div className="modal-overlay" onClick={() => setShowCreateForm(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="create-form-container">
              <div className="form-header">
                <h2>
                  <i className="fas fa-envelope"></i>
                  Create Email Campaign
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
                      <label>Campaign Name*</label>
                      <input
                        type="text"
                        placeholder="e.g. Newsletter Campaign"
                        value={campaignData.name}
                        onChange={(e) => setCampaignData({...campaignData, name: e.target.value})}
                      />
                    </div>
                    <div className="form-group half">
                      <label>Campaign Type</label>
                      <select
                        value={campaignData.type}
                        onChange={(e) => setCampaignData({...campaignData, type: e.target.value})}
                      >
                        <option value="newsletter">Newsletter</option>
                        <option value="promotional">Promotional</option>
                        <option value="welcome">Welcome Series</option>
                        <option value="announcement">Announcement</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Subject Line*</label>
                    <input
                      type="text"
                      placeholder="Enter compelling subject line..."
                      value={campaignData.subject}
                      onChange={(e) => setCampaignData({...campaignData, subject: e.target.value})}
                    />
                  </div>

                  <div className="form-group">
                    <label>Email Content*</label>
                    <textarea
                      rows="6"
                      placeholder="Describe your email content or let AI generate it for you..."
                      value={campaignData.content}
                      onChange={(e) => setCampaignData({...campaignData, content: e.target.value})}
                    ></textarea>
                    <div className="form-hint">
                      <i className="fas fa-info-circle"></i>
                      Our AI will generate professional email content based on your description.
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Upload Contact List*</label>
                    <div className="file-upload-area">
                      <input
                        type="file"
                        id="contacts"
                        multiple
                        accept=".csv,.xlsx"
                        onChange={handleFileUpload}
                        style={{display: 'none'}}
                      />
                      <label htmlFor="contacts" className="file-upload-label">
                        <i className="fas fa-upload"></i>
                        <span>Drag & drop CSV or Excel files here, or click to select</span>
                        <div className="supported-formats">Supported formats: CSV, Excel</div>
                      </label>
                    </div>
                    <div className="form-hint">
                      <i className="fas fa-info-circle"></i>
                      Upload CSV or Excel files containing email addresses. First column should be 'email'.
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group half">
                      <label>Send Schedule</label>
                      <select>
                        <option value="immediate">Send Immediately</option>
                        <option value="scheduled">Schedule for Later</option>
                        <option value="recurring">Recurring Campaign</option>
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

                  <button className="create-btn" onClick={handleCreateCampaign}>
                    <i className="fas fa-paper-plane"></i>
                    Create Campaign
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

export default EmailMarketing;