import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/navbar'
import Footer from '../components/footer'
import BlackModernWorldNoTobaccoDayInstagramPost from '../assets/Black Modern World No Tobacco Day Instagram Post  (1).png'
import googleLogo from '../assets/google-logo.svg'
import image from '../assets/image.png'
import reactSvg from '../assets/react.svg'

const Home = () => {
    const navigate = useNavigate();
    
    // Handle feature link clicks
    const handleFeatureClick = (e) => {
        e.preventDefault();
        // For now, just prevent default - these pages don't exist yet
        console.log('Feature clicked:', e.currentTarget.href);
        // You can navigate to these pages when they're created
    };
    
    return (
    <div className="home">
    <Navbar/>
    
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
                <Link to="/admin/content" className="feature-item">
                    <div className="feature-icon">
                        <i className="fas fa-file-alt"></i>
                    </div>
                    <div className="feature-content">
                        <h3>AI Content Generator</h3>
                        <p>Create blogs, social media posts, and articles tailored to your brand voice in seconds.</p>
                    </div>
                    <div className="feature-arrow">
                        <i className="fas fa-arrow-right"></i>
                    </div>
                </Link>
                
                <Link to="/admin/business-planner" className="feature-item">
                    <div className="feature-icon">
                        <i className="fas fa-chart-line"></i>
                    </div>
                    <div className="feature-content">
                        <h3>Business Planner</h3>
                        <p>Create comprehensive business plans with AI that outline your vision, strategy, and execution path.</p>
                    </div>
                    <div className="feature-arrow">
                        <i className="fas fa-arrow-right"></i>
                    </div>
                </Link>
                
                <Link to="/admin/ai-photoshoot" className="feature-item">
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
                </Link>
                
                <Link to="/admin/ai-videoshoot" className="feature-item">
                    <div className="feature-icon">
                        <i className="fas fa-video"></i>
                    </div>
                    <div className="feature-content">
                        <h3>AI Video Shoot</h3>
                        <p>Create professional marketing videos with AI-powered video generation and editing tools.</p>
                    </div>
                    <div className="feature-arrow">
                        <i className="fas fa-arrow-right"></i>
                    </div>
                </Link>
                
                <Link to="/admin/voice-agent" className="feature-item">
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
                </Link>
                
                <Link to="/admin/chatbot" className="feature-item">
                    <div className="feature-icon">
                        <i className="fas fa-robot"></i>
                    </div>
                    <div className="feature-content">
                        <h3>AI Chatbot</h3>
                        <p>Create intelligent chatbots for customer support and engagement powered by Chatbase technology.</p>
                    </div>
                    <div className="feature-arrow">
                        <i className="fas fa-arrow-right"></i>
                    </div>
                </Link>
                
                <Link to="/admin/email-marketing" className="feature-item">
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
                </Link>
            </div>
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
                        <h3>Starter</h3>
                        <div className="price">₹1,577<span>/month</span></div>
                    </div>
                    <div className="pricing-features">
                        <p className="package-description">Perfect for individuals and small startups</p>
                        <ul>
                            <li><i className="fas fa-check"></i> AI Content Generator (50 pieces/day)</li>
                            <li><i className="fas fa-check"></i> Business Planner (3 plans/day)</li>
                            <li><i className="fas fa-check"></i> AI Photoshoot (20 images/day)</li>
                            <li><i className="fas fa-check"></i> AI VideoShoot (5 videos/day)</li>
                            <li><i className="fas fa-check"></i> Voice Agent (Basic)</li>
                            <li><i className="fas fa-check"></i> AI Chatbot (1 bot, 500 conversations/day)</li>
                            <li><i className="fas fa-check"></i> Email Marketing (100 emails/day)</li>
                        </ul>
                    </div>
                </div>
                <div className="pricing-card featured">
                    <div className="popular-tag">Most Popular</div>
                    <div className="pricing-header">
                        <h3>Professional</h3>
                        <div className="price">₹3,237<span>/month</span></div>
                    </div>
                    <div className="pricing-features">
                        <p className="package-description">For growing businesses and marketing teams</p>
                        <ul>
                            <li><i className="fas fa-check"></i> AI Content Generator (200 pieces/day)</li>
                            <li><i className="fas fa-check"></i> Business Planner (15 plans/day)</li>
                            <li><i className="fas fa-check"></i> AI Photoshoot (100 images/day)</li>
                            <li><i className="fas fa-check"></i> AI VideoShoot (25 videos/day)</li>
                            <li><i className="fas fa-check"></i> Voice Agent (Advanced + Analytics)</li>
                            <li><i className="fas fa-check"></i> AI Chatbot (5 bots, 2,500 conversations/day)</li>
                            <li><i className="fas fa-check"></i> Email Marketing (1,000 emails/day)</li>
                            <li><i className="fas fa-check"></i> Content History & Analytics</li>
                        </ul>                    </div>
                </div>
                <div className="pricing-card">
                    <div className="pricing-header">
                        <h3>Enterprise</h3>
                        <div className="price">₹6,557<span>/month</span></div>
                    </div>
                    <div className="pricing-features">
                        <p className="package-description">For large organizations and agencies</p>
                        <ul>
                            <li><i className="fas fa-check"></i> Unlimited AI Content Generation</li>
                            <li><i className="fas fa-check"></i> Unlimited Business Plans</li>
                            <li><i className="fas fa-check"></i> Unlimited AI Photoshoot</li>
                            <li><i className="fas fa-check"></i> Unlimited AI VideoShoot</li>
                            <li><i className="fas fa-check"></i> Voice Agent (Full suite + Custom training)</li>
                            <li><i className="fas fa-check"></i> AI Chatbot (Unlimited bots + conversations)</li>
                            <li><i className="fas fa-check"></i> Unlimited Email Marketing</li>
                            <li><i className="fas fa-check"></i> Advanced Analytics & Reporting</li>
                            <li><i className="fas fa-check"></i> API Access & Custom Integrations</li>
                            <li><i className="fas fa-check"></i> White-label solutions</li>
                        </ul>                    </div>
                </div>
            </div>
        </div>
    </section>

    {/* Compare Plans Section */}
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
                            <td>AI Content Generation</td>
                            <td>50 pieces/day</td>
                            <td>200 pieces/day</td>
                            <td>Unlimited</td>
                        </tr>
                        <tr>
                            <td>Business Plan Generation</td>
                            <td>3 plans/day</td>
                            <td>15 plans/day</td>
                            <td>Unlimited</td>
                        </tr>
                        <tr>
                            <td>AI Photoshoot</td>
                            <td>20 images/day</td>
                            <td>100 images/day</td>
                            <td>Unlimited</td>
                        </tr>
                        <tr>
                            <td>AI VideoShoot</td>
                            <td>5 videos/day</td>
                            <td>25 videos/day</td>
                            <td>Unlimited</td>
                        </tr>
                        <tr>
                            <td>Voice Agent</td>
                            <td>Basic features</td>
                            <td>Advanced + Analytics</td>
                            <td>Full suite + Custom training</td>
                        </tr>
                        <tr>
                            <td>AI Chatbot</td>
                            <td>1 bot, 500 conversations/day</td>
                            <td>5 bots, 2,500 conversations/day</td>
                            <td>Unlimited bots + conversations</td>
                        </tr>
                        <tr>
                            <td>Email Marketing</td>
                            <td>100 emails/day</td>
                            <td>1,000 emails/day</td>
                            <td>Unlimited</td>
                        </tr>
                        <tr>
                            <td>Content History</td>
                            <td><i className="fas fa-times"></i></td>
                            <td><i className="fas fa-check"></i></td>
                            <td><i className="fas fa-check"></i></td>
                        </tr>
                        <tr>
                            <td>API Access</td>
                            <td><i className="fas fa-times"></i></td>
                            <td><i className="fas fa-times"></i></td>
                            <td><i className="fas fa-check"></i></td>
                        </tr>
                        <tr>
                            <td>White-label Solutions</td>
                            <td><i className="fas fa-times"></i></td>
                            <td><i className="fas fa-times"></i></td>
                            <td><i className="fas fa-check"></i></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </section>

    {/* Call to Action */}
    <section className="cta">
        <div className="container">
            <div className="cta-content">
                <h2>Ready to Transform Your Marketing?</h2>
                <p>Start your 14-day free trial today. No credit card required.</p>
                <div className="cta-buttons">
                    <Link to="/signup" className="btn-primary">Get Started Free</Link>
                    <Link to="/upgrade-pro" className="btn-secondary">Upgrade to Pro</Link>
                </div>
            </div>
        </div>
    </section>   
    
     {/* Testimonials Section */}
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
    
     {/* Demo Section */}
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
                        <video
                            src="/Recording 2025-09-27 220945.mp4"
                            controls
                            className="demo-video"
                            width="100%"
                            poster={BlackModernWorldNoTobaccoDayInstagramPost}
                        >
                            Your browser does not support the video tag.
                        </video>
                    </div>
                </div>
            </div>
        </div>
        <div className="blur-gradient left"></div>
        <div className="blur-gradient right"></div>
    </section>

    {/* FAQ Section */}
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
