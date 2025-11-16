import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import '../css/content-generator.css';

const Settings = () => {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('profile');
  const [settings, setSettings] = useState({
    notifications: true,
    emailUpdates: true,
    darkMode: true,
    language: 'english',
    timezone: 'UTC',
    autoSave: true,
    apiAccess: false
  });

  const [profile, setProfile] = useState({
    company: '',
    website: '',
    industry: 'technology',
    teamSize: '1-10'
  });

  const handleSave = () => {
    alert('Settings saved successfully!');
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: 'fas fa-user' },
    { id: 'preferences', name: 'Preferences', icon: 'fas fa-cog' },
    { id: 'security', name: 'Security', icon: 'fas fa-shield-alt' },
    { id: 'billing', name: 'Billing', icon: 'fas fa-credit-card' },
    { id: 'api', name: 'API Keys', icon: 'fas fa-key' },
    { id: 'account', name: 'Account', icon: 'fas fa-user-cog' }
  ];

  const industries = [
    'Technology', 'E-commerce', 'Healthcare', 'Finance', 'Education', 
    'Real Estate', 'Food & Beverage', 'Fashion', 'Automotive', 'Other'
  ];

  return (
    <div className="content-generator">
      <div className="page-header">
        <div className="header-icon">
          <i className="fas fa-cog"></i>
        </div>
        <div className="header-content">
          <h1>Settings <span className="gradient-text">Panel</span></h1>
          <p>Manage your account preferences and configuration</p>
        </div>
      </div>

      <div className="container">
        <div className="content-types-section">
          <h2>Settings Categories</h2>
          <div className="content-types-grid">
            {tabs.map(tab => (
              <div 
                key={tab.id}
                className={`content-type-card ${activeTab === tab.id ? 'selected' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <div className="content-type-icon">
                  <i className={tab.icon}></i>
                </div>
                <h3>{tab.name}</h3>
              </div>
            ))}
          </div>
        </div>

        <div className="content-grid">
          <div className="main-content">
            <div className="content-form-section">
            {activeTab === 'profile' && (
              <>
                <h2>Profile Information</h2>
                <div className="form-group">
                  <label>Full Name</label>
                  <input 
                    type="text" 
                    value={user?.get('firstName') || user?.get('username') || ''}
                    placeholder="Your full name"
                    disabled
                  />
                </div>

                <div className="form-group">
                  <label>Email Address</label>
                  <input 
                    type="email" 
                    value={user?.get('email') || ''}
                    placeholder="Your email address"
                    disabled
                  />
                </div>

                <div className="form-group">
                  <label>Company Name</label>
                  <input 
                    type="text" 
                    placeholder="Enter your company name..."
                    value={profile.company}
                    onChange={(e) => setProfile({...profile, company: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label>Website</label>
                  <input 
                    type="url" 
                    placeholder="https://yourwebsite.com"
                    value={profile.website}
                    onChange={(e) => setProfile({...profile, website: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label>Industry</label>
                  <select 
                    value={profile.industry}
                    onChange={(e) => setProfile({...profile, industry: e.target.value})}
                  >
                    {industries.map(industry => (
                      <option key={industry.toLowerCase()} value={industry.toLowerCase()}>
                        {industry}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Team Size</label>
                  <select 
                    value={profile.teamSize}
                    onChange={(e) => setProfile({...profile, teamSize: e.target.value})}
                  >
                    <option value="1-10">1-10 employees</option>
                    <option value="11-50">11-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="200+">200+ employees</option>
                  </select>
                </div>
              </>
            )}

            {activeTab === 'preferences' && (
              <>
                <h2>Preferences</h2>
                <div className="form-group">
                  <label>Language</label>
                  <select 
                    value={settings.language}
                    onChange={(e) => setSettings({...settings, language: e.target.value})}
                  >
                    <option value="english">English</option>
                    <option value="spanish">Spanish</option>
                    <option value="french">French</option>
                    <option value="german">German</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Timezone</label>
                  <select 
                    value={settings.timezone}
                    onChange={(e) => setSettings({...settings, timezone: e.target.value})}
                  >
                    <option value="UTC">UTC</option>
                    <option value="EST">EST</option>
                    <option value="PST">PST</option>
                    <option value="GMT">GMT</option>
                  </select>
                </div>

                <div className="option-buttons">
                  <button 
                    type="button"
                    className={`option-btn ${settings.notifications ? 'selected' : ''}`}
                    onClick={() => setSettings({...settings, notifications: !settings.notifications})}
                  >
                    <i className="fas fa-bell"></i>
                    Email Notifications
                  </button>
                  <button 
                    type="button"
                    className={`option-btn ${settings.autoSave ? 'selected' : ''}`}
                    onClick={() => setSettings({...settings, autoSave: !settings.autoSave})}
                  >
                    <i className="fas fa-save"></i>
                    Auto Save
                  </button>
                  <button 
                    type="button"
                    className={`option-btn ${settings.darkMode ? 'selected' : ''}`}
                    onClick={() => setSettings({...settings, darkMode: !settings.darkMode})}
                  >
                    <i className="fas fa-moon"></i>
                    Dark Mode
                  </button>
                </div>
              </>
            )}

            {activeTab === 'security' && (
              <>
                <h2>Security Settings</h2>
                <div className="form-group">
                  <label>Two-Factor Authentication</label>
                  <p>Enhance your account security with 2FA</p>
                  <button className="generate-btn secondary">
                    <i className="fas fa-shield-alt"></i>
                    Enable 2FA
                  </button>
                </div>

                <div className="form-group">
                  <label>Active Sessions</label>
                  <p>Manage your active login sessions</p>
                  <button className="generate-btn secondary">
                    <i className="fas fa-eye"></i>
                    View Sessions
                  </button>
                </div>
              </>
            )}

            <button className="generate-btn" onClick={handleSave}>
              <i className="fas fa-save"></i>
              Save Changes
            </button>
          </div>
        </div>

        <div className="sidebar">
          <div className="sidebar-card">
            <h3>Account Status</h3>
            <div className="stats-list">
              <div className="stat-item">
                <span className="stat-label">Plan</span>
                <span className="stat-value">Pro</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Status</span>
                <span className="stat-value">Active</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Member Since</span>
                <span className="stat-value">Jan 2024</span>
              </div>
            </div>
          </div>

          <div className="sidebar-card">
            <h3>Quick Actions</h3>
            <div className="recent-items">
              <div className="recent-item">
                <div className="item-icon">
                  <i className="fas fa-download"></i>
                </div>
                <div className="item-content">
                  <div className="item-title">Export Data</div>
                  <div className="item-date">Download your data</div>
                </div>
              </div>
              <div className="recent-item">
                <div className="item-icon">
                  <i className="fas fa-key"></i>
                </div>
                <div className="item-content">
                  <div className="item-title">API Keys</div>
                  <div className="item-date">Manage API access</div>
                </div>
              </div>
              <div className="recent-item">
                <div className="item-icon">
                  <i className="fas fa-credit-card"></i>
                </div>
                <div className="item-content">
                  <div className="item-title">Billing</div>
                  <div className="item-date">View billing info</div>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;