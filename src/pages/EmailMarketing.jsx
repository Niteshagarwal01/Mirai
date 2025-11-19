import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import '../css/content-generator.css';

const EmailMarketing = () => {
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [setupForm, setSetupForm] = useState({
    companyName: '',
    email: '',
    phone: '',
    industry: '',
    currentEmailVolume: '',
    requirements: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleInputChange = (e) => {
    setSetupForm({
      ...setupForm,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmitSetup = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = await getToken();
      const response = await fetch('http://localhost:3001/api/email-setup/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(setupForm)
      });

      if (response.ok) {
        setSubmitSuccess(true);
        setTimeout(() => {
          setShowSetupModal(false);
          setSubmitSuccess(false);
          setSetupForm({
            companyName: '',
            email: '',
            phone: '',
            industry: '',
            currentEmailVolume: '',
            requirements: ''
          });
        }, 3000);
      }
    } catch (error) {
      console.error('Error submitting setup request:', error);
      alert('Failed to submit request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="content-generator-page">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1>Email Marketing Engine</h1>
          <p>LangGraph-Powered Email Automation - Fully Functional & Tested!</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-primary" onClick={() => setShowSetupModal(true)}>
            <i className="fas fa-crown"></i> Get Custom Setup
          </button>
          <button className="btn-secondary" onClick={() => navigate('/admin')}>
            <i className="fas fa-arrow-left"></i> Back
          </button>
        </div>
      </div>

      {/* Premium Banner */}
      <div style={{ 
        background: 'linear-gradient(135deg, rgba(110, 64, 255, 0.1) 0%, rgba(110, 64, 255, 0.05) 100%)',
        border: '2px solid rgba(255, 193, 7, 0.3)',
        borderRadius: '16px',
        padding: '30px',
        marginBottom: '30px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{
            width: '60px',
            height: '60px',
            background: 'linear-gradient(135deg, #ffc107 0%, #ff9800 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '28px'
          }}>
            <i className="fas fa-crown"></i>
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ marginBottom: '10px', fontSize: '1.5rem' }}>
              <i className="fas fa-sparkles"></i> Premium Feature - Contact Us for Setup
            </h2>
            <p style={{ marginBottom: '15px', opacity: 0.9 }}>
              Our LangGraph email automation system is fully built and tested with real campaigns. 
              Get personalized setup with your brand details, Gmail credentials, and custom email templates.
            </p>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <span className="feature-tag"><i className="fas fa-check"></i> Proven & Working</span>
              <span className="feature-tag"><i className="fas fa-check"></i> Custom Brand Setup</span>
              <span className="feature-tag"><i className="fas fa-check"></i> Gmail Integration</span>
              <span className="feature-tag"><i className="fas fa-check"></i> Excel Contact Management</span>
            </div>
          </div>
        </div>
      </div>

      {/* Status */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '30px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        <i className="fas fa-circle" style={{ color: '#ef4444', fontSize: '12px' }}></i>
        <span style={{ fontSize: '0.95rem', fontWeight: 500 }}>AUTOMATION STOPPED</span>
      </div>

      {/* What You Get */}
      <div className="content-type-selection">
        <h2><i className="fas fa-gift"></i> What You Get</h2>
        <div className="content-types-grid">
          <div className="content-type-card">
            <div className="type-image" style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #6e40ff 0%, #5530c7 100%)',
              boxShadow: '0 0 20px rgba(110, 64, 255, 0.3)'
            }}>
              <span style={{
                fontSize: '32px',
                fontWeight: 700,
                color: 'white',
                textShadow: '0 2px 10px rgba(0,0,0,0.3)'
              }}>1</span>
            </div>
            <div className="type-info">
              <h3 style={{ fontSize: '1.1rem' }}><i className="fas fa-building" style={{ fontSize: '0.9rem' }}></i> One-Time Brand Setup</h3>
              <p style={{ fontSize: '0.9rem' }}>
                We configure your company details, brand voice, and product information 
                into the LangGraph system
              </p>
            </div>
          </div>

          <div className="content-type-card">
            <div className="type-image" style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #6e40ff 0%, #5530c7 100%)',
              boxShadow: '0 0 20px rgba(110, 64, 255, 0.3)'
            }}>
              <span style={{
                fontSize: '32px',
                fontWeight: 700,
                color: 'white',
                textShadow: '0 2px 10px rgba(0,0,0,0.3)'
              }}>2</span>
            </div>
            <div className="type-info">
              <h3 style={{ fontSize: '1.1rem' }}><i className="fas fa-envelope" style={{ fontSize: '0.9rem' }}></i> Gmail Integration</h3>
              <p style={{ fontSize: '0.9rem' }}>
                Connect your Gmail account securely for automated inbox monitoring 
                and email sending
              </p>
            </div>
          </div>

          <div className="content-type-card">
            <div className="type-image" style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #6e40ff 0%, #5530c7 100%)',
              boxShadow: '0 0 20px rgba(110, 64, 255, 0.3)'
            }}>
              <span style={{
                fontSize: '32px',
                fontWeight: 700,
                color: 'white',
                textShadow: '0 2px 10px rgba(0,0,0,0.3)'
              }}>3</span>
            </div>
            <div className="type-info">
              <h3 style={{ fontSize: '1.1rem' }}><i className="fas fa-file-excel" style={{ fontSize: '0.9rem' }}></i> Upload Contacts</h3>
              <p style={{ fontSize: '0.9rem' }}>
                Simply upload your Excel/CSV contact list with company names, 
                emails, and roles
              </p>
            </div>
          </div>

          <div className="content-type-card">
            <div className="type-image" style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #6e40ff 0%, #5530c7 100%)',
              boxShadow: '0 0 20px rgba(110, 64, 255, 0.3)'
            }}>
              <span style={{
                fontSize: '32px',
                fontWeight: 700,
                color: 'white',
                textShadow: '0 2px 10px rgba(0,0,0,0.3)'
              }}>4</span>
            </div>
            <div className="type-info">
              <h3 style={{ fontSize: '1.1rem' }}><i className="fas fa-rocket" style={{ fontSize: '0.9rem' }}></i> Launch & Monitor</h3>
              <p style={{ fontSize: '0.9rem' }}>
                Execute campaigns from our dashboard and track responses in real-time
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Capabilities */}
      <div className="content-type-selection">
        <h2><i className="fas fa-cog"></i> System Capabilities</h2>
        <div className="content-types-grid">
          <div className="content-type-card">
            <div className="type-image" style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #1a1c24 0%, #252836 100%)',
              boxShadow: '0 0 15px rgba(110, 64, 255, 0.2)'
            }}>
              <i className="fas fa-inbox fa-2x" style={{ color: '#6e40ff', filter: 'drop-shadow(0 0 8px rgba(110, 64, 255, 0.5))' }}></i>
            </div>
            <div className="type-info">
              <h3 style={{ fontSize: '1.1rem' }}>Automated Inbox Monitoring</h3>
              <p style={{ fontSize: '0.85rem' }}>
                Continuously monitors your Gmail Inbox for new customer emails 
                using Gmail API integration.
              </p>
              <ul className="feature-list" style={{ 
                listStyle: 'none', 
                padding: 0, 
                marginTop: '10px',
                fontSize: '0.85rem'
              }}>
                <li><i className="fas fa-check" style={{ color: '#10b981', marginRight: '8px', fontSize: '0.8rem' }}></i> Real-time email detection</li>
                <li><i className="fas fa-check" style={{ color: '#10b981', marginRight: '8px', fontSize: '0.8rem' }}></i> Automatic categorization</li>
                <li><i className="fas fa-check" style={{ color: '#10b981', marginRight: '8px', fontSize: '0.8rem' }}></i> Smart filtering</li>
              </ul>
            </div>
          </div>

          <div className="content-type-card">
            <div className="type-image" style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #1a1c24 0%, #252836 100%)',
              boxShadow: '0 0 15px rgba(110, 64, 255, 0.2)'
            }}>
              <i className="fas fa-tag fa-2x" style={{ color: '#6e40ff', filter: 'drop-shadow(0 0 8px rgba(110, 64, 255, 0.5))' }}></i>
            </div>
            <div className="type-info">
              <h3 style={{ fontSize: '1.1rem' }}>AI-Powered Categorization</h3>
              <p style={{ fontSize: '0.85rem' }}>
                Automatically classifies incoming emails into relevant categories 
                using advanced AI.
              </p>
              <ul className="feature-list" style={{ 
                listStyle: 'none', 
                padding: 0, 
                marginTop: '10px',
                fontSize: '0.85rem'
              }}>
                <li><i className="fas fa-check" style={{ color: '#10b981', marginRight: '8px', fontSize: '0.8rem' }}></i> Product inquiries</li>
                <li><i className="fas fa-check" style={{ color: '#10b981', marginRight: '8px', fontSize: '0.8rem' }}></i> Customer feedback</li>
                <li><i className="fas fa-check" style={{ color: '#10b981', marginRight: '8px', fontSize: '0.8rem' }}></i> Partnerships & More</li>
              </ul>
            </div>
          </div>

          <div className="content-type-card">
            <div className="type-image" style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #1a1c24 0%, #252836 100%)',
              boxShadow: '0 0 15px rgba(110, 64, 255, 0.2)'
            }}>
              <i className="fas fa-brain fa-2x" style={{ color: '#6e40ff', filter: 'drop-shadow(0 0 8px rgba(110, 64, 255, 0.5))' }}></i>
            </div>
            <div className="type-info">
              <h3 style={{ fontSize: '1.1rem' }}>Intelligent Auto-Response</h3>
              <p style={{ fontSize: '0.85rem' }}>
                Generates personalized responses based on email context and your 
                brand voice.
              </p>
              <ul className="feature-list" style={{ 
                listStyle: 'none', 
                padding: 0, 
                marginTop: '10px',
                fontSize: '0.85rem'
              }}>
                <li><i className="fas fa-check" style={{ color: '#10b981', marginRight: '8px', fontSize: '0.8rem' }}></i> Context-aware replies</li>
                <li><i className="fas fa-check" style={{ color: '#10b981', marginRight: '8px', fontSize: '0.8rem' }}></i> Brand voice matching</li>
                <li><i className="fas fa-check" style={{ color: '#10b981', marginRight: '8px', fontSize: '0.8rem' }}></i> Professional tone</li>
              </ul>
            </div>
          </div>

          <div className="content-type-card">
            <div className="type-image" style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #1a1c24 0%, #252836 100%)',
              boxShadow: '0 0 15px rgba(110, 64, 255, 0.2)'
            }}>
              <i className="fas fa-database fa-2x" style={{ color: '#6e40ff', filter: 'drop-shadow(0 0 8px rgba(110, 64, 255, 0.5))' }}></i>
            </div>
            <div className="type-info">
              <h3 style={{ fontSize: '1.1rem' }}>Smart Lead Management</h3>
              <p style={{ fontSize: '0.85rem' }}>
                Stores lead information and prevents duplicate outreach for better 
                relationship management.
              </p>
              <ul className="feature-list" style={{ 
                listStyle: 'none', 
                padding: 0, 
                marginTop: '10px',
                fontSize: '0.85rem'
              }}>
                <li><i className="fas fa-check" style={{ color: '#10b981', marginRight: '8px', fontSize: '0.8rem' }}></i> Lead tracking</li>
                <li><i className="fas fa-check" style={{ color: '#10b981', marginRight: '8px', fontSize: '0.8rem' }}></i> Duplicate prevention</li>
                <li><i className="fas fa-check" style={{ color: '#10b981', marginRight: '8px', fontSize: '0.8rem' }}></i> Follow-up scheduling</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Setup Modal */}
      {showSetupModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }} onClick={() => setShowSetupModal(false)}>
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '20px',
            maxWidth: '550px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 20px 60px rgba(110, 64, 255, 0.3), 0 0 40px rgba(110, 64, 255, 0.1)',
            animation: 'modalSlideIn 0.3s ease-out'
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{
              padding: '25px',
              borderBottom: '1px solid var(--border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h2 style={{ margin: 0 }}><i className="fas fa-crown"></i> Request Custom Setup</h2>
              <button onClick={() => setShowSetupModal(false)} style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-main)',
                fontSize: '24px',
                cursor: 'pointer',
                padding: '0',
                width: '32px',
                height: '32px'
              }}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            {submitSuccess ? (
              <div style={{
                padding: '50px',
                textAlign: 'center'
              }}>
                <i className="fas fa-check-circle" style={{
                  fontSize: '56px',
                  color: '#10b981',
                  marginBottom: '20px',
                  filter: 'drop-shadow(0 0 20px rgba(16, 185, 129, 0.5))'
                }}></i>
                <h3 style={{ marginBottom: '10px', fontSize: '1.5rem' }}>Request Submitted!</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                  We'll contact you shortly to set up your email automation system.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitSetup} style={{ padding: '25px' }}>
                <div className="form-group">
                  <label htmlFor="companyName">
                    <i className="fas fa-building"></i> Company Name *
                  </label>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    value={setupForm.companyName}
                    onChange={handleInputChange}
                    required
                    placeholder="Your company name"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">
                      <i className="fas fa-envelope"></i> Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={setupForm.email}
                      onChange={handleInputChange}
                      required
                      placeholder="your@email.com"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">
                      <i className="fas fa-phone"></i> Phone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={setupForm.phone}
                      onChange={handleInputChange}
                      placeholder="+1 234 567 8900"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="industry">
                      <i className="fas fa-industry"></i> Industry
                    </label>
                    <input
                      type="text"
                      id="industry"
                      name="industry"
                      value={setupForm.industry}
                      onChange={handleInputChange}
                      placeholder="e.g., SaaS, E-commerce"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="currentEmailVolume">
                      <i className="fas fa-chart-line"></i> Monthly Email Volume
                    </label>
                    <select
                      id="currentEmailVolume"
                      name="currentEmailVolume"
                      value={setupForm.currentEmailVolume}
                      onChange={handleInputChange}
                    >
                      <option value="">Select volume</option>
                      <option value="0-1000">0 - 1,000</option>
                      <option value="1000-5000">1,000 - 5,000</option>
                      <option value="5000-10000">5,000 - 10,000</option>
                      <option value="10000+">10,000+</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="requirements">
                    <i className="fas fa-list"></i> Requirements & Goals
                  </label>
                  <textarea
                    id="requirements"
                    name="requirements"
                    value={setupForm.requirements}
                    onChange={handleInputChange}
                    rows="4"
                    placeholder="Tell us about your email automation needs, campaign goals, and any specific requirements..."
                  />
                </div>

                <button type="submit" className="btn-primary btn-full" disabled={submitting}>
                  {submitting ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i> Submitting...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane"></i> Submit Request
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailMarketing;
