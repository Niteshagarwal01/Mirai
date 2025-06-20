import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { userService } from '../services/userService'

/**
 * Login component with special admin bypass functionality
 * Admin can log in with credentials:
 * - Email: admin or Nitesh
 * - Password: admin123 or password
 * This bypasses MongoDB connection issues for judges/demo purposes
 */
const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // ===== ADMIN BYPASS LOGIC =====
    // Check for any combination of admin credentials
    const isAdminEmail = formData.email === 'admin@mirai.com' || 
                        formData.email === 'admin' || 
                        formData.email === 'Nitesh';
    
    const isAdminPassword = formData.password === 'Admin@123' || 
                           formData.password === 'admin123' || 
                           formData.password === 'password';
    
    // If admin credentials, bypass MongoDB completely
    if (isAdminEmail && isAdminPassword) {
      console.log('Admin bypass login - skipping MongoDB');
      
      // Create local admin user object
      const adminUser = {
        name: 'Nitesh',
        email: isAdminEmail ? formData.email : 'admin@mirai.com',
        role: 'admin',
        _id: 'admin-local-bypass-' + Date.now() // Add timestamp for uniqueness
      };
      
      // Save admin user info to localStorage
      localStorage.setItem('user', JSON.stringify(adminUser));
      
      // Small delay to simulate API call
      setTimeout(() => {
        setLoading(false);
        navigate('/admin');
      }, 500);
      
      return; // Exit early, no need to try the server
    }
    
    // ===== REGULAR LOGIN LOGIC =====
    try {
      // Regular login flow with MongoDB
      let response;
      
      try {
        if (formData.email === 'admin' || formData.email === 'Nitesh') {
          // Admin login using name
          response = await userService.login({
            name: 'Nitesh'
          });
        } else {
          // Regular user login flow
          response = await userService.login(formData);
        }
        
        if (response.error) {
          setError(response.error);
        } else {
          // Save user info to localStorage
          localStorage.setItem('user', JSON.stringify(response.user));
          
          // Redirect based on role
          if (response.user.role === 'admin') {
            navigate('/admin');
          } else {
            navigate('/');
          }
        }
      } catch (apiError) {
        console.error('API error during login:', apiError);
        
        // Double-check for admin credentials as fallback
        if (isAdminEmail && isAdminPassword) {
          console.log('MongoDB failed, using admin bypass as fallback');
          
          // Create local admin user object as fallback
          const adminUser = {
            name: 'Nitesh',
            email: isAdminEmail ? formData.email : 'admin@mirai.com',
            role: 'admin',
            _id: 'admin-local-bypass-' + Date.now() // Add timestamp for uniqueness
          };
          
          // Save admin user info to localStorage
          localStorage.setItem('user', JSON.stringify(adminUser));
          
          // Navigate after a small delay
          setTimeout(() => {
            navigate('/admin');
          }, 100);
          
          return;
        }
        
        // If we got here, it's a genuine error
        throw apiError;
      }
    } catch (err) {
      console.error('Login error:', err);
      
      // Special handling for network errors or MongoDB connection issues
      if (err.name === 'TypeError' || err.message?.includes('network') || err.message?.includes('fetch')) {
        setError('Network error or server unavailable. If you are an admin, try using admin@mirai.com and Admin@123.');
      } else {
        setError('Login failed. Please check your credentials and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div>
      <div className="login-container">
        <div className="login-left">            <div className="brand-logo">
                <div className="terminal-icon">&gt;</div>
                <h2>Mirai</h2>
            </div>
            
            <div className="login-content">
                <h3>AI-Powered Marketing Suite for Startups</h3>
                
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
                <div className="admin-login-hint">
                  <i className="fas fa-info-circle"></i> For admin access: <strong>admin@mirai.com</strong> / <strong>Admin@123</strong>
                </div>
                  <form className="login-form" onSubmit={handleSubmit}>
                    {error && <div className="error-message">{error}</div>}
                    
                    <div className="form-field">
                        <label>Email</label>
                        <div className="input-wrapper">
                            <i className="fas fa-envelope"></i>
                            <input 
                              type="email" 
                              name="email"
                              placeholder="name@example.com" 
                              value={formData.email}
                              onChange={handleChange}
                              required
                            />
                        </div>
                    </div>
                    
                    <div className="form-field">
                        <label>Password</label>
                        <div className="input-wrapper">
                            <i className="fas fa-lock"></i>
                            <input 
                              type={showPassword ? "text" : "password"} 
                              name="password"
                              value={formData.password}
                              onChange={handleChange}
                              required
                            />
                            <i 
                              className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"} password-toggle`}
                              onClick={togglePasswordVisibility}
                            ></i>
                        </div>
                        <div className="forgot-password">
                            <a href="#">Forgot password?</a>
                        </div>
                    </div>                    
                    <button 
                      className="sign-in-btn" 
                      type="submit"
                      disabled={loading}
                    >
                        {loading ? "Signing in..." : "Sign In"} {!loading && <span className="arrow-icon">→</span>}
                    </button>
                    
                    <div className="login-divider">
                        <span>or continue with</span>
                    </div>
                    
                    <button className="google-btn">
                        <img src="../assets/google-logo.svg" alt="Google" />
                        Sign in with Google
                    </button>
                    <div className="account-option">
                        Don't have an account? <Link to="/Signup" className="create-account-link">Create an account</Link>
                    </div>
                </form>
            </div>
        </div>
    </div>
    </div>
  )
}

export default Login
