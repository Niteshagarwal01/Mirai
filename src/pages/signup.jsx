import React from 'react'
import { Link } from 'react-router-dom'

const Signup = () => {
    return (
    <div className="registration-container">
        <div className="registration-left">           
            <div className="brand-logo">
                <div className="terminal-icon"></div>
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
                            Create engaging marketing copy, social posts, and email campaigns in seconds with our AI content generator.
                        </div>
                        
                    </div>
                    
                    <div className="register-feature">
                        <div className="feature-circle">
                            <i className="fas fa-image"></i>
                        </div>
                        <div className="feature-desc">Create professional images from basic product photos</div>
                        <div className="feature-text-box">
                            Transform ordinary product photos into stunning marketing visuals with our AI image enhancement technology.
                        </div>
                    </div>
                    
                    <div className="register-feature">
                        <div className="feature-circle">
                            <i className="fas fa-phone"></i>
                        </div>
                        <div className="feature-desc">Deploy AI voice agents to handle customer calls</div>
                        <div className="feature-text-box">
                            Let AI handle your customer service calls and lead qualification 24/7 with natural-sounding voice agents.
                        </div>
                    </div>
                </div>
            </div>        </div>
        
        <div className="registration-right">            <div className="registration-form-container">
                <h2>System&nbsp;<span className="registration-text">Registration</span></h2>
                <p className="registration-subtitle">Join thousands of startups using Mirai</p>
                
                <form className="registration-form">
                    <div className="form-field">
                        <label>Name</label>
                        <div className="input-wrapper">
                            <i className="fas fa-user"></i>
                            <input type="text" placeholder="John Doe" />
                        </div>
                    </div>
                    
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
                    </div>                   
                    <button className="create-account-btn">
                        Create Account <span className="arrow-icon">→</span>
                    </button>
                    
                    <div className="login-divider">
                        <span>or continue with</span>
                    </div>
                    
                    <button className="google-btn">
                        <img src="../assets/google-logo.svg" alt="Google" />
                        Sign up with Google
                    </button>
                    
                    <div className="terms-text">
                        By creating an account, you agree to our <a href="#">Terms of Service</a>
                        and <a href="#">Privacy Policy</a>
                    </div>
                        <div className="account-option">
                        Already have an account? <Link to="/Login" className="create-account-link">Sign in</Link>
                    </div>
                </form>
            </div>
        </div>
    </div>
    )
}

export default Signup