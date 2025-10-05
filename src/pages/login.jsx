import React, { useState, useEffect } from 'react';
import { useSignIn, useAuth } from '@clerk/clerk-react';
import { useNavigate, Link } from 'react-router-dom';
import '../css/login-styles.css';

const Login = () => {
  const { signIn, setActive } = useSignIn();
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Attempt to sign in
      const result = await signIn.create({
        identifier: formData.email,
        password: formData.password,
      });

      // Check if sign in is complete
      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        navigate('/admin');
        return;
      }

      // If needs verification, attempt first factor
      if (result.status === 'needs_first_factor') {
        const { emailAddressId } = result.supportedFirstFactors.find(
          (factor) => factor.strategy === 'email_code'
        ) || {};

        if (emailAddressId) {
          await signIn.prepareFirstFactor({
            strategy: 'email_code',
            emailAddressId,
          });
          setError('Verification code sent to your email. Please check your email and use the signup page to verify.');
        } else {
          setError('Email verification required. Please use the signup page to complete verification.');
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      const errorMessage = err.errors?.[0]?.message || err.message || 'Login failed';
      
      // Provide helpful error messages
      if (errorMessage.includes('verification') || errorMessage.includes('strategy')) {
        setError('Account needs verification. Please sign up first or use Google Sign-In.');
      } else if (errorMessage.includes('Incorrect password')) {
        setError('Incorrect password. Please try again.');
      } else if (errorMessage.includes('not found') || errorMessage.includes("Couldn't find")) {
        setError('Account not found. Please sign up first.');
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="brand-logo">
          <div className="terminal-icon">&gt;</div>
          <h2>Mirai</h2>
        </div>
        
        <div className="login-content">
          <h3>AI-Powered Marketing Suite for Startups</h3>
          
          <div className="feature-highlight-box">
            <p>Transform your marketing with AI-powered tools designed for startups</p>
          </div>
          
          <div className="feature-list">
            <div className="login-feature">
              <div className="feature-circle">
                <i className="fas fa-code"></i>
              </div>
              <div className="feature-desc">AI-Powered Content</div>
              <p className="feature-subdesc">Generate professional marketing content in seconds</p>
            </div>
            
            <div className="login-feature">
              <div className="feature-circle">
                <i className="fas fa-image"></i>
              </div>
              <div className="feature-desc">Stunning Visuals</div>
              <p className="feature-subdesc">Transform product photos into professional marketing images</p>
            </div>
            
            <div className="login-feature">
              <div className="feature-circle">
                <i className="fas fa-phone"></i>
              </div>
              <div className="feature-desc">AI Voice Agents</div>
              <p className="feature-subdesc">Let AI handle customer calls and qualify leads 24/7</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="login-right">
        <div className="login-form-container">
          <h2>System <span className="access-text">Access</span></h2>
          <p className="login-subtitle">Sign in to your account to continue</p>
          
          {/* Custom Login Form */}
          <form className="login-form" onSubmit={handleSubmit}>
            {error && <div className="error-message">{error}</div>}
            
            {/* Google Sign-In First (Primary Method) */}
            <button 
              type="button" 
              className="google-btn" 
              onClick={() => signIn.authenticateWithRedirect({
                strategy: "oauth_google",
                redirectUrl: "/sso-callback",
                redirectUrlComplete: "/admin"
              })}
              style={{ marginBottom: '20px' }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.8055 10.2292C19.8055 9.55208 19.7501 8.86806 19.6323 8.19792H10.2V12.0488H15.6014C15.3773 13.2911 14.6571 14.3898 13.6025 15.0879V17.5866H16.8251C18.7173 15.8449 19.8055 13.2728 19.8055 10.2292Z" fill="#4285F4"/>
                <path d="M10.2 20C12.9605 20 15.2734 19.1016 16.8251 17.5866L13.6025 15.0879C12.7039 15.6979 11.5514 16.0433 10.2 16.0433C7.54382 16.0433 5.29787 14.2832 4.50617 11.917H1.17871V14.4927C2.75308 17.6068 6.30607 20 10.2 20Z" fill="#34A853"/>
                <path d="M4.50617 11.917C4.03425 10.6747 4.03425 9.32837 4.50617 8.08603V5.51025H1.17871C-0.39259 8.61719 -0.39259 12.3859 1.17871 15.4927L4.50617 11.917Z" fill="#FBBC04"/>
                <path d="M10.2 3.95671C11.6245 3.93406 13.0007 4.47716 14.0369 5.46091L16.8897 2.60816C15.1827 0.990451 12.9328 0.0920443 10.2 0.11469C6.30607 0.11469 2.75308 2.50794 1.17871 5.51025L4.50617 8.08603C5.29787 5.71976 7.54382 3.95671 10.2 3.95671Z" fill="#EA4335"/>
              </svg>
              Sign in with Google
            </button>

            <div className="divider">
              <span>Or use email/password</span>
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@mirai.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="form-options">
              <label className="checkbox-container">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <a href="#" className="forgot-link">Forgot Password?</a>
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Signing In...
                </>
              ) : (
                <>
                  Sign In <i className="fas fa-arrow-right"></i>
                </>
              )}
            </button>
          </form>

          <p className="signup-link">
            Don't have an account? <Link to="/signup">Create Account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
