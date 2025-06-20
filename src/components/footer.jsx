import React from 'react'

const Footer = () => {
  // Function to reset notification state
  const resetNotification = () => {
    localStorage.removeItem('hidePrototypeNotification');
    window.location.reload();
  };
  
  return (
    <div>
      <footer>
        <div className="container">
            <div className="footer-top">
                <div className="footer-logo">
                    <h3>Mirai</h3>
                    <p>Transform Your Digital Marketing Experience</p>
                    <div className="footer-newsletter">
                        <h4>Subscribe to our newsletter</h4>
                        <div className="newsletter-form">
                            <input type="email" placeholder="Enter your email"/>
                            <button type="submit" className="btn-primary">Subscribe</button>
                        </div>
                    </div>
                    <div className="social-icons">
                        <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
                        <a href="#" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
                        <a href="#" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
                        <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
                        <a href="#" aria-label="YouTube"><i className="fab fa-youtube"></i></a>
                        {/* Hidden link to reset notification */}
                        <a href="#" onClick={(e) => { e.preventDefault(); resetNotification(); }} title="Reset Prototype Notification" className="reset-notification" aria-label="Reset Notification"><i className="fas fa-sync-alt"></i></a>
                    </div>
                </div>
                <div className="footer-links">
                    <div className="footer-column">
                        <h4>Product</h4>
                        <ul>
                            <li><a href="#features">Features</a></li>
                            <li><a href="#pricing">Pricing</a></li>
                            <li><a href="#testimonials">Testimonials</a></li>
                            <li><a href="#demo">Watch Demo</a></li>
                            <li><a href="#faq">FAQ</a></li>
                        </ul>
                    </div>
                    <div className="footer-column">
                        <h4>Company</h4>
                        <ul>
                            <li><a href="#">About Us</a></li>
                            <li><a href="#">Careers</a></li>
                            <li><a href="#">Blog</a></li>
                            <li><a href="#">Press</a></li>
                            <li><a href="#">Contact Us</a></li>
                        </ul>
                    </div>
                    <div className="footer-column">
                        <h4>Resources</h4>
                        <ul>
                            <li><a href="#">Documentation</a></li>
                            <li><a href="#">Help Center</a></li>
                            <li><a href="#">Community</a></li>
                            <li><a href="#">Case Studies</a></li>
                            <li><a href="#">API References</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <div className="footer-legal">
                    <p>&copy; 2025 Mirai Technologies. All rights reserved.</p>
                    <ul className="footer-legal-links">
                        <li><a href="#">Privacy Policy</a></li>
                        <li><a href="#">Terms of Service</a></li>
                        <li><a href="#">Cookie Settings</a></li>
                        <li><a href="#">Security</a></li>
                    </ul>
                </div>
            </div>
        </div>
    </footer>
    </div>
  )
}

export default Footer
