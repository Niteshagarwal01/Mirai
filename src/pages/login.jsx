import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { userService } from '../services/userService'

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
    
    try {
      // Special case for admin login (using the admin we created in MongoDB)
      if (formData.email === 'admin' || formData.email === 'Nitesh') {
        // Admin login using name
        const response = await userService.login({
          name: 'Nitesh'
        });
        
        if (response.error) {
          setError(response.error);
        } else {
          // Save user info to localStorage
          localStorage.setItem('user', JSON.stringify(response.user));
          navigate('/admin');
        }
      } else {
        // Regular login flow
        const response = await userService.login(formData);
        
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
      }
    } catch (err) {
      setError('Login failed. Please check your credentials and try again.');
      console.error(err);
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
