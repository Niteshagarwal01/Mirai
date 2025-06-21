import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/upgrade-pro.css';

const UpgradeToPro = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Check authentication when component mounts
  useEffect(() => {
    const userData = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
    setIsAdmin(userData && userData.role === 'admin');
  }, []);
  
  // State for selected plan
  const [selectedPlan, setSelectedPlan] = useState('professional');
  const [billingCycle, setBillingCycle] = useState('annual');

  // Payment form state
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
    promocode: ''
  });

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails({
      ...paymentDetails,
      [name]: value
    });
  };

  // Handle plan selection
  const handlePlanChange = (plan) => {
    setSelectedPlan(plan);
  };

  // Handle billing cycle change
  const handleBillingCycleChange = (cycle) => {
    setBillingCycle(cycle);
  };

  // Calculate plan price based on selection
  const getPlanPrice = () => {
    const prices = {
      starter: {
        monthly: 99,
        annual: 79
      },
      professional: {
        monthly: 249,
        annual: 199
      },
      enterprise: {
        monthly: 599,
        annual: 499
      }
    };

    return prices[selectedPlan][billingCycle];
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you! Your upgrade request has been submitted. This is a prototype, so no actual payment has been processed.');
  };
  return (
    <div className="upgrade-pro-page">      <div className="upgrade-header">
        <div className="logo">Mirai</div>
        <div className="header-actions">
          <Link to="/" className="back-to-home">
            <i className="fas fa-arrow-left"></i> Back to Home
          </Link>
        </div>
      </div>
      
      <section className="upgrade-hero">
        <div className="container">
          <h1>Upgrade to <span className="gradient-text">Pro</span></h1>
          <p className="subtitle">Get access to all premium features and unleash the full power of Mirai</p>
        </div>
      </section>
      
      <section className="upgrade-container">
        <div className="container">
          <div className="upgrade-content">
            <div className="plan-selection">
              <h2>Choose Your Plan</h2>
              
              <div className="billing-toggle">
                <span className={billingCycle === 'monthly' ? 'active' : ''}>Monthly</span>
                <div 
                  className={`toggle-switch ${billingCycle === 'annual' ? 'annual' : 'monthly'}`}
                  onClick={() => handleBillingCycleChange(billingCycle === 'monthly' ? 'annual' : 'monthly')}
                >
                  <div className="toggle-knob"></div>
                </div>
                <span className={billingCycle === 'annual' ? 'active' : ''}>
                  Annual <span className="saving-badge">Save 20%</span>
                </span>
              </div>
              
              <div className="plan-cards">
                <div 
                  className={`plan-card ${selectedPlan === 'starter' ? 'selected' : ''}`}
                  onClick={() => handlePlanChange('starter')}
                >
                  <div className="plan-header">
                    <h3>Starter</h3>
                    <div className="price">
                      ${billingCycle === 'annual' ? '79' : '99'}<span>/month</span>
                    </div>
                    {billingCycle === 'annual' && <div className="billing-note">Billed annually</div>}
                  </div>
                  <div className="plan-features">
                    <ul>
                      <li><i className="fas fa-check"></i> AI visual content (50 images/month)</li>
                      <li><i className="fas fa-check"></i> Basic customer support automation</li>
                      <li><i className="fas fa-check"></i> Content generation (10 pieces/month)</li>
                      <li><i className="fas fa-check"></i> Essential analytics dashboard</li>
                    </ul>
                  </div>
                  <div className={`select-indicator ${selectedPlan === 'starter' ? 'active' : ''}`}>
                    {selectedPlan === 'starter' ? 'Selected' : 'Select Plan'}
                  </div>
                </div>
                
                <div 
                  className={`plan-card ${selectedPlan === 'professional' ? 'selected' : ''} featured-plan`}
                  onClick={() => handlePlanChange('professional')}
                >
                  <div className="popular-tag">Most Popular</div>
                  <div className="plan-header">
                    <h3>Professional</h3>
                    <div className="price">
                      ${billingCycle === 'annual' ? '199' : '249'}<span>/month</span>
                    </div>
                    {billingCycle === 'annual' && <div className="billing-note">Billed annually</div>}
                  </div>
                  <div className="plan-features">
                    <ul>
                      <li><i className="fas fa-check"></i> AI visual content (200 images/month)</li>
                      <li><i className="fas fa-check"></i> Advanced customer support automation</li>
                      <li><i className="fas fa-check"></i> Content generation (50 pieces/month)</li>
                      <li><i className="fas fa-check"></i> Enhanced analytics with reporting</li>
                      <li><i className="fas fa-check"></i> 3D model generation (10/month)</li>
                    </ul>
                  </div>
                  <div className={`select-indicator ${selectedPlan === 'professional' ? 'active' : ''}`}>
                    {selectedPlan === 'professional' ? 'Selected' : 'Select Plan'}
                  </div>
                </div>
                
                <div 
                  className={`plan-card ${selectedPlan === 'enterprise' ? 'selected' : ''}`}
                  onClick={() => handlePlanChange('enterprise')}
                >
                  <div className="plan-header">
                    <h3>Enterprise</h3>
                    <div className="price">
                      ${billingCycle === 'annual' ? '499' : '599'}<span>/month</span>
                    </div>
                    {billingCycle === 'annual' && <div className="billing-note">Billed annually</div>}
                  </div>
                  <div className="plan-features">
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
                  <div className={`select-indicator ${selectedPlan === 'enterprise' ? 'active' : ''}`}>
                    {selectedPlan === 'enterprise' ? 'Selected' : 'Select Plan'}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="payment-section">
              <h2>Payment Details</h2>
              <form onSubmit={handleSubmit} className="payment-form">
                <div className="form-group">
                  <label>Card Number</label>
                  <input 
                    type="text" 
                    name="cardNumber" 
                    placeholder="1234 5678 9012 3456"
                    value={paymentDetails.cardNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Cardholder Name</label>
                  <input 
                    type="text" 
                    name="cardName" 
                    placeholder="John Doe"
                    value={paymentDetails.cardName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group half">
                    <label>Expiry Date</label>
                    <input 
                      type="text" 
                      name="expiry" 
                      placeholder="MM/YY"
                      value={paymentDetails.expiry}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group half">
                    <label>CVV</label>
                    <input 
                      type="text" 
                      name="cvv" 
                      placeholder="123"
                      value={paymentDetails.cvv}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Promo Code (Optional)</label>
                  <input 
                    type="text" 
                    name="promocode" 
                    placeholder="MIRAI20"
                    value={paymentDetails.promocode}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="payment-summary">
                  <div className="summary-row">
                    <span>Plan</span>
                    <span className="plan-name">{selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Billing Cycle</span>
                    <span>{billingCycle.charAt(0).toUpperCase() + billingCycle.slice(1)}</span>
                  </div>
                  <div className="summary-row total">
                    <span>Total</span>
                    <span>${getPlanPrice()}/month</span>
                  </div>
                </div>
                
                <button type="submit" className="btn-primary upgrade-btn">
                  Upgrade Now
                </button>
                
                <div className="secure-payment">
                  <i className="fas fa-lock"></i> Secure Payment
                </div>
              </form>
            </div>
          </div>
          
          <div className="upgrade-benefits">
            <h3>Benefits of Upgrading</h3>
            <div className="benefits-list">
              <div className="benefit-item">
                <i className="fas fa-bolt"></i>
                <div>
                  <h4>Enhanced AI Capabilities</h4>
                  <p>Access more powerful AI models for better content generation</p>
                </div>
              </div>
              <div className="benefit-item">
                <i className="fas fa-chart-line"></i>
                <div>
                  <h4>Advanced Analytics</h4>
                  <p>Get deeper insights into your marketing performance</p>
                </div>
              </div>
              <div className="benefit-item">
                <i className="fas fa-headset"></i>
                <div>
                  <h4>Priority Support</h4>
                  <p>Get faster responses from our dedicated support team</p>
                </div>
              </div>
              <div className="benefit-item">
                <i className="fas fa-code"></i>
                <div>
                  <h4>API Access</h4>
                  <p>Integrate Mirai with your existing tools and workflows</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="faq-section">
        <div className="container">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-items">
            <div className="faq-item">
              <h4>Can I change my plan later?</h4>
              <p>Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.</p>
            </div>
            <div className="faq-item">
              <h4>What payment methods do you accept?</h4>
              <p>We accept all major credit cards, PayPal, and bank transfers for annual plans.</p>
            </div>
            <div className="faq-item">
              <h4>Is there a refund policy?</h4>
              <p>We offer a 14-day money-back guarantee if you're not satisfied with our service.</p>
            </div>
            <div className="faq-item">
              <h4>Do I need to enter payment details for the trial?</h4>
              <p>No, our 14-day trial is completely free and doesn't require any payment information.</p>
            </div>
          </div>        </div>
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
