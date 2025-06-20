import React from 'react'

const Navbar = () => {
  return (
    <>
    <div className="fluid-element" id="fluid1"></div>
    <div className="fluid-element" id="fluid2"></div>
    <div className="fluid-element" id="fluid3"></div>    
    <nav className="floating-nav">
        <div className="nav-logo">
            <span>Mirai</span>
        </div>        <div className="nav-links">
            <a href="#home" className="active">Home</a>
            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
            <a href="#testimonials">Testimonials</a>
            <a href="#demo">Demo</a>
        </div><div className="nav-cta">           
            <a href="pages/signin.html" className="btn-secondary">Log In</a>
            <a href="pages/login.html" className="btn-primary">Sign Up Free</a>
        </div>
        <div className="mobile-menu-toggle">
            <i className="fas fa-bars"></i>
        </div>
    </nav> 
    </>
  )
}

export default Navbar;
