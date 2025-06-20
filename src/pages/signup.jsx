import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { userService } from '../services/userService'

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
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
            const response = await userService.register(formData);
            
            if (response.error) {
                setError(response.error);
            } else {
                // Registration successful, redirect to login
                navigate('/login');
            }
        } catch (err) {
            setError('Registration failed. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

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
                
                <form className="registration-form" onSubmit={handleSubmit}>
                    {error && <div className="error-message">{error}</div>}
                    <div className="form-field">
                        <label>Name</label>
                        <div className="input-wrapper">
                            <i className="fas fa-user"></i>
                            <input 
                                type="text" 
                                name="name"
                                placeholder="John Doe" 
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                    
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
                    </div>                   
                    <button 
                        className="create-account-btn" 
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Creating Account..." : "Create Account"} {!loading && <span className="arrow-icon">→</span>}
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