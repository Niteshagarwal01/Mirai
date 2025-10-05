import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/upgrade-pro.css';

const UpgradeToPro = () => {
  const navigate = useNavigate();

  const handleUpgradeClick = (plan) => {
    // Navigate to payment page with selected plan
    navigate('/payment', { state: { selectedPlan: plan } });
  };

  return (
    <div className="upgrade-pro-page">
      <div className="upgrade-header">
        <div className="logo">Mirai</div>
        <div className="header-actions">
          <Link to="/admin" className="back-to-home">
            <i className="fas fa-arrow-left"></i> Back to Dashboard
          </Link>
        </div>
      </div>

      <section className="upgrade-hero">
        <div className="container">
          <h1>Upgrade to <span className="gradient-text">Pro</span></h1>
          <p className="subtitle">Unlock premium features and maximize your creative potential with Mirai Pro.</p>
        </div>
      </section>

      <section id="pricing" className="pricing upgrade-pricing">
        <div className="container">
          <div className="section-header">
            <h2>Pricing <span className="gradient-text">Plans</span></h2>
            <p>Transparent, flexible pricing that grows with your business</p>
          </div>
          
          <div className="pricing-cards">
            <div className="pricing-card">
              <div className="pricing-header">
                <h3>Starter</h3>
                <div className="price">₹1,577<span>/month</span></div>
              </div>
              <div className="pricing-features">
                <p className="package-description">For new startups just beginning their journey</p>
                <ul>
                  <li><i className="fas fa-check"></i> AI visual content (50 images/month)</li>
                  <li><i className="fas fa-check"></i> Basic customer support automation</li>
                  <li><i className="fas fa-check"></i> Content generation (10 pieces/month)</li>
                  <li><i className="fas fa-check"></i> Essential analytics dashboard</li>
                </ul>
              </div>
              <button onClick={() => handleUpgradeClick('starter')} className="btn-primary">
                Upgrade Now
              </button>
            </div>

            <div className="pricing-card featured">
              <div className="popular-tag">Most Popular</div>
              <div className="pricing-header">
                <h3>Professional</h3>
                <div className="price">₹3,237<span>/month</span></div>
              </div>
              <div className="pricing-features">
                <p className="package-description">For growing startups with established needs</p>
                <ul>
                  <li><i className="fas fa-check"></i> AI visual content (200 images/month)</li>
                  <li><i className="fas fa-check"></i> Advanced customer support automation</li>
                  <li><i className="fas fa-check"></i> Content generation (50 pieces/month)</li>
                  <li><i className="fas fa-check"></i> Enhanced analytics with reporting</li>
                  <li><i className="fas fa-check"></i> 3D model generation (10/month)</li>
                </ul>
              </div>
              <button onClick={() => handleUpgradeClick('professional')} className="btn-primary">
                Upgrade Now
              </button>
            </div>

            <div className="pricing-card">
              <div className="pricing-header">
                <h3>Enterprise</h3>
                <div className="price">₹6,557<span>/month</span></div>
              </div>
              <div className="pricing-features">
                <p className="package-description">For scaling startups with complex needs</p>
                <ul>
                  <li><i className="fas fa-check"></i> Unlimited AI visual content</li>
                  <li><i className="fas fa-check"></i> Comprehensive customer support</li>
                  <li><i className="fas fa-check"></i> Unlimited content generation</li>
                  <li><i className="fas fa-check"></i> Advanced analytics with dashboards</li>
                  <li><i className="fas fa-check"></i> Unlimited 3D model generation</li>
                  <li><i className="fas fa-check"></i> Priority technical support</li>
                  <li><i className="fas fa-check"></i> API access for custom integrations</li>
                </ul>
              </div>
              <button onClick={() => handleUpgradeClick('enterprise')} className="btn-primary">
                Upgrade Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Comparison Section */}
      <section className="features-comparison">
        <div className="container">
          <div className="section-header">
            <h2>Why Choose <span className="gradient-text">Mirai Pro</span>?</h2>
            <p>Get unlimited access to all premium features</p>
          </div>
          
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">
                <i className="fas fa-rocket"></i>
              </div>
              <h3>10x Faster Content Creation</h3>
              <p>Generate professional content in seconds with our AI-powered tools</p>
            </div>
            
            <div className="benefit-card">
              <div className="benefit-icon">
                <i className="fas fa-chart-line"></i>
              </div>
              <h3>Advanced Analytics</h3>
              <p>Track your performance with detailed insights and reporting</p>
            </div>
            
            <div className="benefit-card">
              <div className="benefit-icon">
                <i className="fas fa-headset"></i>
              </div>
              <h3>Priority Support</h3>
              <p>Get instant help from our dedicated support team</p>
            </div>
            
            <div className="benefit-card">
              <div className="benefit-icon">
                <i className="fas fa-shield-alt"></i>
              </div>
              <h3>Enterprise Security</h3>
              <p>Bank-level encryption and data protection for your peace of mind</p>
            </div>
          </div>
        </div>
      </section>

      <div className="upgrade-footer">
        <div className="container">
          <p>© 2025 Mirai AI. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default UpgradeToPro;
