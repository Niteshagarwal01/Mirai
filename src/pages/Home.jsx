import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/navbar'
import Footer from '../components/footer'
import BlackModernWorldNoTobaccoDayInstagramPost from '../assets/Black Modern World No Tobacco Day Instagram Post  (1).png'
import googleLogo from '../assets/google-logo.svg'
import image from '../assets/image.png'
import reactSvg from '../assets/react.svg'

const Home = () => {
    // State to control notification visibility
    const [showNotification, setShowNotification] = useState(true);
    
    // Load visibility state from localStorage when component mounts
    useEffect(() => {
        const isHidden = localStorage.getItem('hidePrototypeNotification') === 'true';
        setShowNotification(!isHidden);
    }, []);
    
    // Function to hide notification and save state to localStorage
    const hideNotification = () => {
        setShowNotification(false);
        localStorage.setItem('hidePrototypeNotification', 'true');
    };
    
    return (
    <div className="home">
    <Navbar/>
    
    {/* Prototype Notification Box */}
    {showNotification && (
        <div className="prototype-note">
            <div className="prototype-note-content">
                <i className="fas fa-info-circle"></i>
                <div className="prototype-note-text">
                    <h4>Prototype Access</h4>
                    <p>For full feature access, <Link to="/login">log in</Link> with admin credentials (email: admin@mirai.com, password: Admin@123)</p>
                </div>
                <button className="close-note" onClick={hideNotification}>
                    <i className="fas fa-times"></i>
                </button>
            </div>
        </div>
    )}
    
      {/* //-- Hero Section -- */}
    <section id="home" className="hero">
        <div className="container">
            <div className="hero-content">
                <div className="hero-badges">
                    <div className="badge">
                        <i className="fas fa-star"></i>
                        <span>Trusted by 1200+ Businesses</span>
                    </div>
                    <div className="badge highlight-badge">
                        <i className="fas fa-bolt"></i>
                        <span>Fastest Growing AI Platform</span>
                    </div>
                </div>
                <h1>Transform Your <span className="gradient-text">Marketing</span> with AI Precision</h1>
                <p className="hero-subtitle">Mirai automates your entire marketing workflow with AI, from content creation to customer engagement, saving 80% of your time and resources.</p>                <div className="hero-buttons">
                    <Link to="/login" className="btn-primary">Get Started Free <i className="fas fa-arrow-right"></i></Link>
                    <a href="#demo" className="btn-secondary">Book a Demo</a>
                </div>
                <div className="hero-testimonial">
                    <div className="testimonial-stars">
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                    </div>
                    <p>"Mirai increased our marketing ROI by 300% in just 3 months"</p>
                    <div className="testimonial-author">
                        <img src={image} alt="Testimonial" className="avatar"/>
                        <div>
                            <h4>Emily Johnson</h4>
                            <p>Marketing Director @ Falcon Tech</p>
                        </div>
                    </div>
                </div>
            </div>            <div className="hero-visual">
                <img src={BlackModernWorldNoTobaccoDayInstagramPost} alt="Mirai AI Platform Interface" className="hero-image"/>
                <div className="hero-features">
                    <div className="feature-pill">
                        <i className="fas fa-robot"></i>
                        <span>AI-Powered</span>
                    </div>
                    <div className="feature-pill">
                        <i className="fas fa-shield-alt"></i>
                        <span>Enterprise Security</span>
                    </div>
                    <div className="feature-pill">
                        <i className="fas fa-code-branch"></i>
                        <span>API Access</span>
                    </div>
                </div>
            </div>
        </div>
        <div className="blur-gradient left"></div>
        <div className="blur-gradient right"></div>
    </section>   
    
     {/* //-- Features Section -- */}
    <section id="features" className="features">
        <div className="container">
            <div className="section-header">
                <h2>Comprehensive <span className="gradient-text">Marketing Solutions</span></h2>
                <p>Transform your digital marketing experience with our powerful suite of features</p>
            </div>
            <div className="feature-grid">
                <a href="pages/features/ai-product-photoshoot.html" className="feature-item">
                    <div className="feature-icon">
                        <i className="fas fa-camera-retro"></i>
                    </div>
                    <div className="feature-content">
                        <h3>AI Product Photoshoot</h3>
                        <p>Transform basic product photos into professional marketing images with our AI image generation technology.</p>
                    </div>
                    <div className="feature-arrow">
                        <i className="fas fa-arrow-right"></i>
                    </div>
                </a>
                <a href="pages/features/marketing-chat-assistant.html" className="feature-item">
                    <div className="feature-icon">
                        <i className="fas fa-comment-dots"></i>
                    </div>
                    <div className="feature-content">
                        <h3>Marketing Chat Assistant</h3>
                        <p>Get instant marketing advice and content suggestions from our AI assistant that knows your brand.</p>
                    </div>
                    <div className="feature-arrow">
                        <i className="fas fa-arrow-right"></i>
                    </div>
                </a>
                <a href="pages/features/voice-sales-agent.html" className="feature-item">
                    <div className="feature-icon">
                        <i className="fas fa-phone-alt"></i>
                    </div>
                    <div className="feature-content">
                        <h3>Voice Sales Agent</h3>
                        <p>Deploy AI voice agents that can handle customer calls and qualify leads 24/7.</p>
                    </div>
                    <div className="feature-arrow">
                        <i className="fas fa-arrow-right"></i>
                    </div>
                </a>
                <a href="pages/features/content-generation.html" className="feature-item">
                    <div className="feature-icon">
                        <i className="fas fa-file-alt"></i>
                    </div>
                    <div className="feature-content">
                        <h3>Content Generation</h3>
                        <p>Create blogs, social media posts, and articles tailored to your brand voice in seconds.</p>
                    </div>
                    <div className="feature-arrow">
                        <i className="fas fa-arrow-right"></i>
                    </div>
                </a>
                <a href="pages/features/email-marketing-engine.html" className="feature-item">
                    <div className="feature-icon">
                        <i className="fas fa-envelope"></i>
                    </div>
                    <div className="feature-content">
                        <h3>Email Marketing Engine</h3>
                        <p>Design, schedule, and analyze email campaigns with AI-powered optimization.</p>
                    </div>
                    <div className="feature-arrow">
                        <i className="fas fa-arrow-right"></i>
                    </div>
                </a>
                <a href="pages/features/competitor-analysis.html" className="feature-item">
                    <div className="feature-icon">
                        <i className="fas fa-chart-bar"></i>
                    </div>
                    <div className="feature-content">
                        <h3>Competitor Analysis</h3>
                        <p>Track your competitors and identify market opportunities with automated market intelligence.</p>
                    </div>
                    <div className="feature-arrow">
                        <i className="fas fa-arrow-right"></i>
                    </div>
                </a>            </div>
        </div>
    </section>

      {/* //-- Pricing Section -- */}
    <section id="pricing" className="pricing">
        <div className="container">
            <div className="section-header">
                <h2>Pricing <span className="gradient-text">Plans</span></h2>
                <p>Transparent, flexible pricing that grows with your business</p>
            </div>            <div className="pricing-cards">
                <div className="pricing-card">
                    <div className="pricing-header">
                        <h3>Starter Package</h3>
                        <div className="price">$99<span>/month</span></div>
                    </div>
                    <div className="pricing-features">
                        <p className="package-description">For new startups just beginning their journey</p>
                        <ul>
                            <li><i className="fas fa-check"></i> AI visual content (50 images/month)</li>
                            <li><i className="fas fa-check"></i> Basic customer support automation</li>
                            <li><i className="fas fa-check"></i> Content generation (10 pieces/month)</li>
                            <li><i className="fas fa-check"></i> Essential analytics dashboard</li>
                        </ul>
                    </div>                    <Link to="/login" className="btn-primary">Get Started</Link>
                </div>
                <div className="pricing-card featured">
                    <div className="popular-tag">Most Popular</div>
                    <div className="pricing-header">
                        <h3>Professional Package</h3>
                        <div className="price">$249<span>/month</span></div>
                    </div>
                    <div className="pricing-features">
                        <p className="package-description">For growing startups with established needs</p>
                        <ul>
                            <li><i className="fas fa-check"></i> AI visual content (200 images/month)</li>
                            <li><i className="fas fa-check"></i> Advanced customer support automation</li>
                            <li><i className="fas fa-check"></i> Content generation (50 pieces/month)</li>
                            <li><i className="fas fa-check"></i> Enhanced analytics with reporting</li>
                            <li><i className="fas fa-check"></i> 3D model generation (10/month)</li>
                        </ul>                    </div>
                    <Link to="/login" className="btn-primary">Get Started</Link>
                </div>
                <div className="pricing-card">
                    <div className="pricing-header">
                        <h3>Enterprise Package</h3>
                        <div className="price">$599<span>/month</span></div>
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
                    <Link to="/login" className="btn-primary">Get Started</Link>
                </div>
            </div>
        </div>
    </section>

    {/* <!-- Compare Plans Section --> */}
    <section className="compare-plans">
        <div className="container">
            <div className="section-header">
                <h2>Compare <span className="gradient-text">Plans</span></h2>
                <p>A detailed comparison of features across all packages</p>
            </div>
            <div className="table-container">
                <table className="comparison-table">
                    <thead>
                        <tr>
                            <th>Feature</th>
                            <th>Starter</th>
                            <th>Professional</th>
                            <th>Enterprise</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>AI Image Generation</td>
                            <td>50/month</td>
                            <td>200/month</td>
                            <td>Unlimited</td>
                        </tr>
                        <tr>
                            <td>Content Generation</td>
                            <td>10/month</td>
                            <td>50/month</td>
                            <td>Unlimited</td>
                        </tr>
                        <tr>
                            <td>Analytics</td>
                            <td>Basic</td>
                            <td>Enhanced</td>
                            <td>Advanced</td>
                        </tr>
                        <tr>
                            <td>3D Model Generation</td>
                            <td><i className="fas fa-times"></i></td>
                            <td>10/month</td>
                            <td>Unlimited</td>
                        </tr>
                        <tr>
                            <td>API Access</td>
                            <td><i className="fas fa-times"></i></td>
                            <td><i className="fas fa-times"></i></td>
                            <td><i className="fas fa-check"></i></td>
                        </tr>
                        <tr>
                            <td>Priority Support</td>
                            <td><i className="fas fa-times"></i></td>
                            <td><i className="fas fa-times"></i></td>
                            <td><i className="fas fa-check"></i></td>
                        </tr>
                        <tr>
                            <td>Custom Integrations</td>
                            <td><i className="fas fa-times"></i></td>
                            <td><i className="fas fa-times"></i></td>
                            <td><i className="fas fa-check"></i></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </section>

    {/* <!-- Call to Action --> */}
    <section className="cta">
        <div className="container">
            <div className="cta-content">
                <h2>Ready to Transform Your Marketing?</h2>
                <p>Start your 14-day free trial today. No credit card required.</p>                <div className="cta-buttons">                    <Link to="/login" className="btn-primary">Get Started Free</Link>
                    <a href="#demo" className="btn-secondary">Book a Demo</a>
                </div>
            </div>
        </div>
    </section>   
    
     {/* <!-- Testimonials Section --> */}
    <section id="testimonials" className="testimonials">
        <div className="container">
            <div className="section-header">
                <h2>Client <span className="gradient-text">Testimonials</span></h2>
                <p>Hear from businesses that have transformed their marketing with Mirai</p>
            </div>
            <div className="testimonial-grid">
                <div className="testimonial-card">
                    <div className="testimonial-rating">
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                    </div>
                    <p className="testimonial-text">"Mirai has completely transformed our marketing operations. We've seen a 300% increase in engagement and our team is saving 25 hours per week on routine marketing tasks."</p>
                    <div className="testimonial-author">
                        <img src={image} alt="Emily Johnson" className="avatar"/>
                        <div className="author-info">
                            <h4>Emily Johnson</h4>
                            <p>Marketing Director, Falcon Technologies</p>
                        </div>
                    </div>
                </div>
                
                <div className="testimonial-card">
                    <div className="testimonial-rating">
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                    </div>
                    <p className="testimonial-text">"The AI product photoshoot feature alone is worth the investment. We've cut our product photography budget by 70% while producing more visually appealing content."</p>
                    <div className="testimonial-author">
                        <img src={image} alt="Michael Chen" className="avatar"/>
                        <div className="author-info">
                            <h4>Michael Chen</h4>
                            <p>E-commerce Manager, StyleHub</p>
                        </div>
                    </div>
                </div>
                
                <div className="testimonial-card">
                    <div className="testimonial-rating">
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star-half-alt"></i>
                    </div>
                    <p className="testimonial-text">"Our sales team has been completely reenergized thanks to Mirai's voice sales agent. We're now able to follow up with every lead and our conversion rates have increased by 45%."</p>
                    <div className="testimonial-author">
                        <img src={image} alt="Sarah Thompson" className="avatar"/>
                        <div className="author-info">
                            <h4>Sarah Thompson</h4>
                            <p>Sales Director, Quantum Solutions</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="blur-gradient left"></div>
        <div className="blur-gradient right"></div>
    </section>   
    
     {/* <!-- Demo Section -->     */}
        <section id="demo" className="demo">
        <div className="container">
            <div className="demo-tag">See it in action</div>
            <div className="demo-content">
                <div className="demo-text">
                    <h2>Watch how <span className="gradient-text">Mirai</span><br/>transforms your workflow</h2>
                    <p className="demo-description">Our AI-powered platform simplifies complex marketing tasks and brings creative automation to your fingertips.</p>
                    
                    <div className="demo-features">
                        <div className="demo-feature-item">
                            <div className="feature-icon">
                                <i className="fas fa-bolt"></i>
                            </div>
                            <p>Generate content 10x faster than traditional methods</p>
                        </div>
                        
                        <div className="demo-feature-item">
                            <div className="feature-icon">
                                <i className="fas fa-palette"></i>
                            </div>
                            <p>Create professional visuals without design skills</p>
                        </div>
                            <div className="demo-feature-item">
                            <div className="feature-icon">
                                <i className="fas fa-chart-line"></i>
                            </div>
                            <p>Analyze and optimize campaigns automatically</p>
                        </div>
                    </div>
                        <div className="demo-cta">
                        <a href="#pricing" className="btn-secondary demo-btn">View Pricing</a>
                        <div className="demo-stats">
                            <div className="stats-item">
                                <span className="stats-number">80%</span>
                                <span className="stats-label">Time Saved</span>
                            </div>
                            <div className="stats-item">
                                <span className="stats-number">3x</span>
                                <span className="stats-label">ROI Increase</span>
                            </div>
                        </div>
                    </div>
                </div>                <div className="demo-video-container">
                    <div className="video-wrapper">
                        <img src="assets/images/demo" alt="Mirai Dashboard Demo" className="demo-placeholder"/>
                        <div className="play-button">
                            <i className="fas fa-play"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="blur-gradient left"></div>
        <div className="blur-gradient right"></div>
    </section>

    {/* <!-- FAQ Section --> */}
    <section id="faq" className="faq">
        <div className="container">
            <div className="section-header">
                <h2>Frequently <span className="gradient-text">Asked Questions</span></h2>
                <p>Get answers to common questions about our AI marketing platform</p>
            </div>
            <div className="faq-grid">
                <div className="faq-item">
                    <h3>Can I upgrade or downgrade my plan later?</h3>
                    <p>Yes, you can change your plan at any time. Changes will take effect on your next billing cycle.</p>
                </div>
                <div className="faq-item">
                    <h3>Is there a free trial available?</h3>
                    <p>Yes, we offer a 14-day free trial for all our packages with no credit card required to get started.</p>
                </div>
                <div className="faq-item">
                    <h3>What happens if I exceed my monthly quota?</h3>
                    <p>If you reach your monthly limit, you can purchase additional credits or upgrade your plan to continue using the services.</p>
                </div>
                <div className="faq-item">
                    <h3>Do you offer discounts for annual billing?</h3>
                    <p>Yes, you can save up to 20% by choosing annual billing over monthly payments.</p>
                </div>
                <div className="faq-item">
                    <h3>Is there a setup fee?</h3>
                    <p>No, there are no setup fees or hidden charges. You only pay the advertised price.</p>
                </div>
                <div className="faq-item">
                    <h3>Do you offer custom pricing for specific needs?</h3>
                    <p>Yes, please contact our sales team for custom enterprise solutions tailored to your specific requirements.</p>
                </div>
            </div>
        </div>
    </section>

    
    <Footer/>
    </div>
    )
}

export default Home
