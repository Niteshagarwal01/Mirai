import React from 'react'
import { Link } from 'react-router-dom'

const Login = () => {
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
                  <form className="login-form">
                    <div className="form-field">
                        <label>Email</label>
                        <div className="input-wrapper">
                            <i className="fas fa-envelope"></i>
                            <input type="email" placeholder="name@example.com" />
                        </div>
                    </div>
                    
                    <div className="form-field">
                        <label>Password</label>
                        <div className="input-wrapper">
                            <i className="fas fa-lock"></i>
                            <input type="password" />
                            <i className="fas fa-eye password-toggle"></i>
                        </div>
                        <div className="forgot-password">
                            <a href="#">Forgot password?</a>
                        </div>
                    </div>                    <button className="sign-in-btn">
                        Sign In <span className="arrow-icon">→</span>
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
