import React, { useState, useEffect } from 'react';
import { useSignUp, useAuth } from '@clerk/clerk-react';
import { useNavigate, Link } from 'react-router-dom';
import '../css/registration-styles.css';

const Signup = () => {
  const { signUp, setActive } = useSignUp();
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(1); // Multi-step form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [code, setCode] = useState('');

  // Redirect if already signed in
  useEffect(() => {
    if (isSignedIn) {
      navigate('/admin');
    }
  }, [isSignedIn, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    setError('');
    
    // Validation for each step
    if (currentStep === 1) {
      if (!formData.name.trim()) {
        setError('Please enter your full name');
        return;
      }
      if (!formData.email.trim()) {
        setError('Please enter your email');
        return;
      }
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError('Please enter a valid email address');
        return;
      }
    } else if (currentStep === 2) {
      if (!formData.password) {
        setError('Please enter a password');
        return;
      }
      if (formData.password.length < 8) {
        setError('Password must be at least 8 characters');
        return;
      }
      if (!formData.confirmPassword) {
        setError('Please confirm your password');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
    }
    
    setCurrentStep(currentStep + 1);
  };

  const handlePrevStep = () => {
    setError('');
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signUp.create({
        emailAddress: formData.email,
        password: formData.password,
        firstName: formData.name.split(' ')[0],
        lastName: formData.name.split(' ').slice(1).join(' ') || '',
      });

      // Send email verification code
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setVerifying(true);
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.errors?.[0]?.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignUp.status === 'complete') {
        await setActive({ session: completeSignUp.createdSessionId });
        navigate('/admin');
      }
    } catch (err) {
      console.error('Verification error:', err);
      setError(err.errors?.[0]?.message || 'Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="registration-container">
      <div className="registration-left">
        <div className="brand-logo">
          <div className="terminal-icon">&gt;</div>
          <h2>Mirai</h2>
        </div>
        
        <div className="registration-content">
          <h3>AI-Powered Marketing Suite for Startups</h3>
          
          <div className="feature-highlight-box">
            <p>Join thousands of startups transforming their marketing with AI</p>
          </div>
          
          <div className="feature-list">
            <div className="register-feature">
              <div className="feature-circle">
                <i className="fas fa-bolt"></i>
              </div>
              <div className="feature-desc">Generate content 10x faster with AI</div>
              <div className="feature-text-box">
                Create engaging marketing copy, social posts, and email campaigns in seconds.
              </div>
            </div>
            
            <div className="register-feature">
              <div className="feature-circle">
                <i className="fas fa-image"></i>
              </div>
              <div className="feature-desc">Create professional images from basic product photos</div>
              <div className="feature-text-box">
                Transform ordinary product photos into stunning marketing visuals with AI.
              </div>
            </div>
            
            <div className="register-feature">
              <div className="feature-circle">
                <i className="fas fa-phone"></i>
              </div>
              <div className="feature-desc">Deploy AI voice agents to handle customer calls</div>
              <div className="feature-text-box">
                Let AI handle your customer service calls and lead qualification 24/7.
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="registration-right">
        <div className="registration-form-container">
          <h2>System <span className="registration-text">Registration</span></h2>
          <p className="registration-subtitle">Join thousands of startups using Mirai</p>
          
          {/* Progress Indicator */}
          {!verifying && (
            <div className="progress-steps">
              <div className={`step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
                <div className="step-number">1</div>
                <div className="step-label">Basic Info</div>
              </div>
              <div className="step-line"></div>
              <div className={`step ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
                <div className="step-number">2</div>
                <div className="step-label">Password</div>
              </div>
              <div className="step-line"></div>
              <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
                <div className="step-number">3</div>
                <div className="step-label">Confirm</div>
              </div>
            </div>
          )}
          
          {!verifying ? (
            <>
              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
                <form className="registration-form" onSubmit={handleNextStep}>
                  {error && <div className="error-message">{error}</div>}
                  
                  <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@company.com"
                      required
                    />
                  </div>

                  <button type="submit" className="create-account-btn">
                    Next Step <i className="fas fa-arrow-right"></i>
                  </button>
                  
                  <div className="divider">
                    <span>Or continue with</span>
                  </div>

                  <button 
                    type="button" 
                    className="google-btn" 
                    onClick={() => signUp.authenticateWithRedirect({
                      strategy: "oauth_google",
                      redirectUrl: "/sso-callback",
                      redirectUrlComplete: "/admin"
                    })}
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19.8055 10.2292C19.8055 9.55208 19.7501 8.86806 19.6323 8.19792H10.2V12.0488H15.6014C15.3773 13.2911 14.6571 14.3898 13.6025 15.0879V17.5866H16.8251C18.7173 15.8449 19.8055 13.2728 19.8055 10.2292Z" fill="#4285F4"/>
                      <path d="M10.2 20C12.9605 20 15.2734 19.1016 16.8251 17.5866L13.6025 15.0879C12.7039 15.6979 11.5514 16.0433 10.2 16.0433C7.54382 16.0433 5.29787 14.2832 4.50617 11.917H1.17871V14.4927C2.75308 17.6068 6.30607 20 10.2 20Z" fill="#34A853"/>
                      <path d="M4.50617 11.917C4.03425 10.6747 4.03425 9.32837 4.50617 8.08603V5.51025H1.17871C-0.39259 8.61719 -0.39259 12.3859 1.17871 15.4927L4.50617 11.917Z" fill="#FBBC04"/>
                      <path d="M10.2 3.95671C11.6245 3.93406 13.0007 4.47716 14.0369 5.46091L16.8897 2.60816C15.1827 0.990451 12.9328 0.0920443 10.2 0.11469C6.30607 0.11469 2.75308 2.50794 1.17871 5.51025L4.50617 8.08603C5.29787 5.71976 7.54382 3.95671 10.2 3.95671Z" fill="#EA4335"/>
                    </svg>
                    Sign up with Google
                  </button>
                </form>
              )}

              {/* Step 2: Password Setup */}
              {currentStep === 2 && (
                <form className="registration-form" onSubmit={handleNextStep}>
                  {error && <div className="error-message">{error}</div>}
                  
                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Minimum 8 characters"
                      minLength="8"
                      required
                    />
                    <small className="input-hint">Use at least 8 characters with a mix of letters and numbers</small>
                  </div>

                  <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Re-enter your password"
                      minLength="8"
                      required
                    />
                  </div>

                  <div className="button-group">
                    <button type="button" className="back-btn" onClick={handlePrevStep}>
                      <i className="fas fa-arrow-left"></i> Back
                    </button>
                    <button type="submit" className="create-account-btn">
                      Next Step <i className="fas fa-arrow-right"></i>
                    </button>
                  </div>
                </form>
              )}

              {/* Step 3: Review & Confirm */}
              {currentStep === 3 && (
                <form className="registration-form" onSubmit={handleSubmit}>
                  {error && <div className="error-message">{error}</div>}
                  
                  <div className="review-section">
                    <h3 className="review-title">Review Your Information</h3>
                    
                    <div className="review-item">
                      <div className="review-label">Full Name</div>
                      <div className="review-value">{formData.name}</div>
                    </div>
                    
                    <div className="review-item">
                      <div className="review-label">Email Address</div>
                      <div className="review-value">{formData.email}</div>
                    </div>
                    
                    <div className="review-item">
                      <div className="review-label">Password</div>
                      <div className="review-value">••••••••</div>
                    </div>
                    
                    <button 
                      type="button" 
                      className="edit-info-btn" 
                      onClick={() => setCurrentStep(1)}
                    >
                      <i className="fas fa-edit"></i> Edit Information
                    </button>
                  </div>

                  <div className="button-group">
                    <button type="button" className="back-btn" onClick={handlePrevStep}>
                      <i className="fas fa-arrow-left"></i> Back
                    </button>
                    <button type="submit" className="create-account-btn" disabled={loading}>
                      {loading ? (
                        <>
                          <i className="fas fa-spinner fa-spin"></i> Creating Account...
                        </>
                      ) : (
                        <>
                          Create Account <i className="fas fa-check"></i>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </>
          ) : (
            <form className="verification-form" onSubmit={handleVerify}>
              {error && <div className="error-message">{error}</div>}
              
              <div className="verification-message">
                <i className="fas fa-envelope"></i>
                <p>We sent a verification code to <strong>{formData.email}</strong></p>
              </div>

              <div className="form-group">
                <label htmlFor="code">Verification Code</label>
                <input
                  type="text"
                  id="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Enter 6-digit code"
                  maxLength="6"
                  required
                />
              </div>

              <button type="submit" className="verify-btn" disabled={loading}>
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i> Verifying...
                  </>
                ) : (
                  'Verify Email'
                )}
              </button>

              <button 
                type="button" 
                className="resend-btn" 
                onClick={() => signUp.prepareEmailAddressVerification({ strategy: 'email_code' })}
              >
                Resend Code
              </button>
            </form>
          )}
          
          <div className="terms-text">
            By creating an account, you agree to our <a href="#">Terms of Service</a>
            {' '}and <a href="#">Privacy Policy</a>
          </div>

          <p className="signin-link">
            Already have an account? <Link to="/login">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;