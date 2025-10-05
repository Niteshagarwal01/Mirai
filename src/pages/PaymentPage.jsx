import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useUser, useAuth } from '@clerk/clerk-react';
import '../css/payment-page.css';

// Load Razorpay script
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isSignedIn, user } = useUser();
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(false);
  
  // Get selected plan from navigation state
  const selectedPlan = location.state?.selectedPlan || 'professional';

  // Plan details (prices in INR - Indian Rupees)
  const planDetails = {
    starter: {
      name: 'Starter',
      price: 1577, // ₹1,577 (approx $19)
      features: [
        'AI visual content (50 images/month)',
        'Basic customer support automation',
        'Content generation (10 pieces/month)',
        'Essential analytics dashboard'
      ]
    },
    professional: {
      name: 'Professional',
      price: 3237, // ₹3,237 (approx $39)
      features: [
        'AI visual content (200 images/month)',
        'Advanced customer support automation',
        'Content generation (50 pieces/month)',
        'Enhanced analytics with reporting',
        '3D model generation (10/month)'
      ]
    },
    enterprise: {
      name: 'Enterprise',
      price: 6557, // ₹6,557 (approx $79)
      features: [
        'Unlimited AI visual content',
        'Comprehensive customer support',
        'Unlimited content generation',
        'Advanced analytics with dashboards',
        'Unlimited 3D model generation',
        'Priority technical support',
        'API access for custom integrations'
      ]
    }
  };

  const currentPlan = planDetails[selectedPlan];

  // Handle Razorpay Payment
  const handleRazorpayPayment = async () => {
    setLoading(true);

    try {
      console.log('Starting Razorpay payment process...');
      
      // Check if user is signed in
      if (!isSignedIn || !user) {
        alert('Please sign in to continue with payment.');
        navigate('/login');
        setLoading(false);
        return;
      }

      // Load Razorpay script
      console.log('Loading Razorpay script...');
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        alert('Failed to load Razorpay SDK. Please check your internet connection and try again.');
        setLoading(false);
        return;
      }
      console.log('Razorpay script loaded successfully');

      // Get user data from Clerk
      const email = user?.primaryEmailAddress?.emailAddress || '';
      const clerkUserId = user?.id || '';
      console.log('User email:', email);
      console.log('Clerk User ID:', clerkUserId);

      // Get Clerk session token using useAuth hook
      let token = null;
      try {
        token = await getToken();
        console.log('Got Clerk token successfully');
      } catch (tokenError) {
        console.error('Token retrieval error:', tokenError);
        alert('Authentication error. Please sign in again.');
        navigate('/login');
        setLoading(false);
        return;
      }

      console.log('Got Clerk token');
      console.log('Got Clerk token');

      // Create order from backend
      const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
      console.log('Calling backend API:', `${API_URL}/api/checkout`);
      console.log('Using token:', token ? 'Token available' : 'NO TOKEN!');
      console.log('Email:', email);
      console.log('Clerk User ID:', clerkUserId);
      
      // Calculate amount in paise (Indian currency: 100 paise = 1 rupee)
      const amountInPaise = currentPlan.price * 100;

      let response;
      try {
        response = await fetch(`${API_URL}/api/checkout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ 
            email: email,
            plan: selectedPlan,
            amount: amountInPaise
          })
        });
      } catch (fetchError) {
        console.error('Fetch error (network issue):', fetchError);
        throw new Error('Failed to connect to server. Please check if backend is running on port 3001');
      }

      console.log('Response status:', response.status);
      console.log('Response OK:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Backend error response:', errorText);
        throw new Error(`Backend error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Order created:', data);
      
      const { orderId, amount, currency, keyId } = data;

      if (!orderId || !keyId) {
        throw new Error('Invalid response from server. Missing orderId or keyId.');
      }

      // Razorpay options
      const options = {
        key: keyId,
        amount: amount,
        currency: currency,
        name: 'Mirai AI',
        description: `${currentPlan.name} Plan Subscription - ₹${currentPlan.price}/month`,
        order_id: orderId,
        handler: async function (razorpayResponse) {
          console.log('Payment successful, verifying...');
          setLoading(true);
          
          try {
            // Verify payment
            const verifyResponse = await fetch(`${API_URL}/api/payment/verify`, {
              method: 'POST',
              headers: { 
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                razorpay_order_id: razorpayResponse.razorpay_order_id,
                razorpay_payment_id: razorpayResponse.razorpay_payment_id,
                razorpay_signature: razorpayResponse.razorpay_signature,
                clerkUserId: clerkUserId,
                email: email
              })
            });

            const result = await verifyResponse.json();
            console.log('Verification result:', result);
            
            if (result.success) {
              alert('🎉 Payment successful! Welcome to ' + currentPlan.name + ' plan!');
              navigate('/admin');
            } else {
              alert('Payment verification failed. Please contact support.');
            }
          } catch (verifyError) {
            console.error('Verification error:', verifyError);
            alert('Payment verification failed. Please contact support with your payment ID.');
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: function() {
            console.log('Payment cancelled by user');
            setLoading(false);
            alert('Payment cancelled');
          }
        },
        prefill: {
          email: email,
          name: user?.fullName || ''
        },
        theme: {
          color: '#6e40ff'
        },
        notes: {
          plan: selectedPlan,
          price: currentPlan.price
        }
      };

      console.log('Opening Razorpay checkout...');
      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
      setLoading(false);
      
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed: ' + error.message + '. Please try again or contact support.');
      setLoading(false);
    }
  };

  return (
    <div className="payment-page">
      <div className="payment-header">
        <div className="logo">Mirai</div>
        <div className="header-actions">
          <Link to="/upgrade-pro" className="back-to-plans">
            <i className="fas fa-arrow-left"></i> Back to Plans
          </Link>
        </div>
      </div>

      <section className="payment-hero">
        <div className="container">
          <h1>Complete Your <span className="gradient-text">Purchase</span></h1>
          <p className="subtitle">You're one step away from unlocking premium features</p>
        </div>
      </section>

      <section className="payment-container">
        <div className="container">
          <div className="payment-content">
            {/* Order Summary */}
            <div className="order-summary">
              <h2>Order Summary</h2>
              <div className="summary-card">
                <div className="plan-info">
                  <h3>{currentPlan.name} Plan</h3>
                  <div className="plan-price">
                    ₹{currentPlan.price}<span>/month</span>
                  </div>
                </div>
                
                <div className="plan-features-list">
                  <h4>What's Included:</h4>
                  <ul>
                    {currentPlan.features.map((feature, index) => (
                      <li key={index}>
                        <i className="fas fa-check"></i>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="summary-total">
                  <div className="total-row">
                    <span>Subtotal</span>
                    <span>₹{currentPlan.price}</span>
                  </div>
                  <div className="total-row">
                    <span>Tax</span>
                    <span>₹0</span>
                  </div>
                  <div className="total-row grand-total">
                    <span>Total Due Today</span>
                    <span>₹{currentPlan.price}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Form */}
            <div className="payment-form-section">
              <h2>Payment Details</h2>
              <div className="payment-form-card">
                <div className="payment-info">
                  <div className="info-icon">
                    <i className="fas fa-shield-alt"></i>
                  </div>
                  <div className="info-text">
                    <h4>Secure Payment</h4>
                    <p>Your payment information is encrypted and secure. We use Razorpay for safe transactions.</p>
                  </div>
                </div>

                <div className="payment-method">
                  <h3>Complete Payment</h3>
                  <p className="payment-description">Click below to proceed with secure payment via Razorpay</p>
                </div>

                <div className="razorpay-info">
                  <div className="info-item">
                    <i className="fas fa-check-circle"></i>
                    <span>Multiple payment methods supported</span>
                  </div>
                  <div className="info-item">
                    <i className="fas fa-check-circle"></i>
                    <span>Credit/Debit Cards, UPI, Net Banking</span>
                  </div>
                  <div className="info-item">
                    <i className="fas fa-check-circle"></i>
                    <span>Secure & encrypted transactions</span>
                  </div>
                </div>

                <button 
                  type="button" 
                  className="btn-primary payment-btn"
                  onClick={handleRazorpayPayment}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i> Processing Payment...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-lock"></i> Pay ₹{currentPlan.price} with Razorpay
                    </>
                  )}
                </button>

                <div className="payment-security">
                  <div className="security-badges">
                    <div className="badge">
                      <i className="fas fa-lock"></i>
                      <span>Secure SSL</span>
                    </div>
                    <div className="badge">
                      <i className="fas fa-shield-alt"></i>
                      <span>PCI Compliant</span>
                    </div>
                    <div className="badge">
                      <i className="fas fa-check-circle"></i>
                      <span>Verified</span>
                    </div>
                  </div>
                  <p className="security-note">
                    Your transaction is protected by industry-leading security standards
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Razorpay Privacy & Policies Section */}
          <div className="razorpay-policies">
            <div className="policies-container">
              <div className="policy-header">
                <img src="https://razorpay.com/assets/razorpay-glyph.svg" alt="Razorpay" className="razorpay-logo" />
                <h3>Powered by Razorpay</h3>
              </div>
              <div className="policy-content">
                <div className="policy-item">
                  <i className="fas fa-shield-alt"></i>
                  <div>
                    <h4>Secure Payments</h4>
                    <p>All transactions are encrypted and secured by Razorpay's PCI DSS Level 1 compliant infrastructure.</p>
                  </div>
                </div>
                <div className="policy-item">
                  <i className="fas fa-lock"></i>
                  <div>
                    <h4>Data Privacy</h4>
                    <p>Your payment information is never stored on our servers. Razorpay handles all sensitive data securely.</p>
                  </div>
                </div>
                <div className="policy-item">
                  <i className="fas fa-file-contract"></i>
                  <div>
                    <h4>Refund Policy</h4>
                    <p>Eligible for refund within 14 days as per our terms and conditions. Processing time: 5-7 business days.</p>
                  </div>
                </div>
              </div>
              <div className="policy-links">
                <a href="https://razorpay.com/privacy/" target="_blank" rel="noopener noreferrer">
                  <i className="fas fa-external-link-alt"></i> Razorpay Privacy Policy
                </a>
                <a href="https://razorpay.com/terms/" target="_blank" rel="noopener noreferrer">
                  <i className="fas fa-external-link-alt"></i> Terms of Service
                </a>
                <a href="https://razorpay.com/security/" target="_blank" rel="noopener noreferrer">
                  <i className="fas fa-external-link-alt"></i> Security & Compliance
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="payment-footer">
        <div className="container">
          <p>© 2025 Mirai AI. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
