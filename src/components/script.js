/**
 * Mirai - AI-Driven Marketing Automation Platform
 * Custom Cursor and Interactive Elements
 */

// Helper to safely get DOM elements
const getElement = (selector) => {
  return document.getElementById(selector) || document.querySelector(selector);
};

// Helper to safely get multiple DOM elements
const getElements = (selector) => {
  return document.querySelectorAll(selector);
};

// Custom Cursor
const setupCustomCursor = () => {
    const cursorDot = getElement('cursor-dot');
    const cursorOutline = getElement('cursor-outline');
    
    if (cursorDot && cursorOutline) {
        cursorHandler = (e) => {
            // Get mouse position
            const posX = e.clientX;
            const posY = e.clientY;
            
            // Animate cursor dot to follow cursor precisely with minimal delay
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;
            
            // Animate cursor outline with slight delay for smooth following effect
            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, {
                duration: 500,
                fill: 'forwards'
            });
        };
        
        document.addEventListener('mousemove', cursorHandler);
    }
};

// Active link highlighting
const highlightActiveSection = () => {
    const sections = getElements('section');
    const navLinks = getElements('.nav-links a');
    const scrollPosition = window.scrollY;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (
            scrollPosition >= sectionTop &&
            scrollPosition < sectionTop + sectionHeight
        ) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
};

// Handle cursor effects on interactive elements
const handleCursorEffects = () => {
    const cursorDot = getElement('cursor-dot');
    const cursorOutline = getElement('cursor-outline');
    
    if (cursorDot && cursorOutline) {
        // Elements that should enlarge the cursor
        const interactiveElements = getElements(
            'a, button, .btn-primary, .btn-secondary, .feature-card, .pricing-card, input, textarea'
        );
        
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorDot.style.transform = 'translate(-50%, -50%) scale(2)';
                cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
            });
            
            el.addEventListener('mouseleave', () => {
                cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
                cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
            });
        });
    }
};

// Mobile menu toggle
const setupMobileMenu = () => {
    const navLinks = document.querySelector('.nav-links');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    
    if (mobileMenuToggle && navLinks) {
        mobileMenuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            
            // Toggle between hamburger and close icon
            const icon = mobileMenuToggle.querySelector('i');
            if (icon) {
                if (icon.classList.contains('fa-bars')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    }
};

// Animate number counting
const animateNumbers = () => {
    const animateValue = (obj, start, end, duration) => {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = Math.floor(progress * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    };
    
    // You can add number animations for statistics later if needed
};

// Parallax effect on floating elements
const setupParallax = () => {
    parallaxHandler = (e) => {
        // Calculate mouse position as a percentage of window size
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        // Apply subtle movement to fluid elements
        const fluid1 = document.getElementById('fluid1');
        const fluid2 = document.getElementById('fluid2');
        const fluid3 = document.getElementById('fluid3');
        
        if (fluid1) fluid1.style.transform = `translate(${mouseX * 30}px, ${mouseY * 30}px)`;
        if (fluid2) fluid2.style.transform = `translate(${mouseX * -20}px, ${mouseY * 20}px)`;
        if (fluid3) fluid3.style.transform = `translate(${mouseX * 15}px, ${mouseY * -15}px)`;
    };
    
    window.addEventListener('mousemove', parallaxHandler);
};

// Scroll-triggered animations
const setupScrollAnimations = () => {
    const floatingNav = document.querySelector('.floating-nav');
    
    scrollHandler = () => {
        // Shrink nav on scroll
        if (floatingNav) {
            if (window.scrollY > 100) {
                floatingNav.style.padding = '10px 25px';
            } else {
                floatingNav.style.padding = '15px 30px';
            }
        }
        
        // Update active link in nav
        highlightActiveSection();
    };
    
    // Detect when scrolled to bottom
    window.addEventListener('scroll', scrollHandler);
};

// Handle form submission
const setupForm = () => {
    const form = document.querySelector('.contact-form form');
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Show success message (for demo)
            const formGroups = form.querySelectorAll('.form-group');
            formGroups.forEach(group => group.style.display = 'none');
            
            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.style.display = 'none';
            
            const successMsg = document.createElement('div');
            successMsg.classList.add('success-message');
            successMsg.innerHTML = `
                <i class="fas fa-check-circle"></i>
                <h3>Message Sent!</h3>
                <p>Thank you for contacting us. We'll respond shortly.</p>
            `;
            
            form.appendChild(successMsg);
            
            // Reset form after 5 seconds for demo
            setTimeout(() => {
                formGroups.forEach(group => group.style.display = 'block');
                submitBtn.style.display = 'block';
                form.reset();
                form.removeChild(successMsg);
            }, 5000);
        });
    }
};

// Add 3D tilt effect to cards
const setupCardTilt = () => {
    const featureCards = getElements('.feature-card');
    
    featureCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const cardRect = card.getBoundingClientRect();
            const x = e.clientX - cardRect.left;
            const y = e.clientY - cardRect.top;
            
            // Calculate rotation based on cursor position
            const centerX = cardRect.width / 2;
            const centerY = cardRect.height / 2;
            
            const rotateY = ((x - centerX) / centerX) * 10; // Max 10 degrees rotation
            const rotateX = ((centerY - y) / centerY) * 10; // Max 10 degrees rotation
            
            // Apply 3D rotation
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
            
            // Add a subtle glow where the cursor is
            const shine = card.querySelector('.feature-icon');
            if (shine) {
                shine.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(110, 64, 255, 0.8), rgba(52, 255, 233, 0.4))`;
            }
        });
        
        // Reset transform on mouse leave
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
            
            const shine = card.querySelector('.feature-icon');
            if (shine) {
                shine.style.background = 'linear-gradient(45deg, var(--primary), var(--accent))';
            }
        });
    });
};

// Testimonial and Demo section enhancements
document.addEventListener('DOMContentLoaded', () => {
    // Animate testimonial cards on scroll
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    if (testimonialCards.length > 0) {
        const animateTestimonials = () => {
            testimonialCards.forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('fade-in');
                }, 200 * index);
            });
        };
        
        // Use Intersection Observer to trigger animation when testimonials are in view
        const testimonialSection = document.querySelector('.testimonials');
        if (testimonialSection) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateTestimonials();
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.2 });
            
            observer.observe(testimonialSection);
        }
    }
    
    // Demo video play button interaction with enhanced animation
    const playButton = document.querySelector('.play-button');
    const demoPlaceholder = document.querySelector('.demo-placeholder');
    const videoWrapper = document.querySelector('.video-wrapper');
    const demoSection = document.querySelector('.demo');
    
    if (playButton && demoPlaceholder && videoWrapper) {
        // Add hover effect to demo section
        if (demoSection) {
            const handleMouseMove = (e) => {
                const { left, top, width, height } = videoWrapper.getBoundingClientRect();
                const x = (e.clientX - left) / width - 0.5;
                const y = (e.clientY - top) / height - 0.5;
                
                // Apply subtle rotation based on mouse position
                videoWrapper.style.transform = `perspective(1000px) rotateY(${x * 5}deg) rotateX(${y * -5}deg)`;
            };
            
            videoWrapper.addEventListener('mousemove', handleMouseMove);
            videoWrapper.addEventListener('mouseleave', () => {
                videoWrapper.style.transform = 'perspective(1000px) rotateY(-5deg)';
            });
        }
        
        // Play button interaction
        playButton.addEventListener('click', () => {
            // Create a pulsing animation before "playing" the video
            playButton.classList.add('pulse-animation');
            
            // Animate the video wrapper
            videoWrapper.style.transform = 'perspective(1000px) scale(1.05)';
            
            setTimeout(() => {
                // In a real implementation, this would be replaced with an actual video embed
                // For this demo, we're showing an enhanced preview effect
                videoWrapper.innerHTML = `
                    <div class="video-message">
                        <i class="fas fa-film"></i>
                        <h3>Mirai Demo Video</h3>
                        <p>Experience how our AI platform transforms your marketing workflow with powerful automation tools and creative solutions.</p>
                        <button class="close-video">Back to Preview</button>
                    </div>
                `;
                
                // Add floating particles to the video message for a more engaging effect
                const videoMessage = videoWrapper.querySelector('.video-message');
                for (let i = 0; i < 6; i++) {
                    const particle = document.createElement('div');
                    particle.className = 'video-particle';
                    particle.style.top = `${Math.random() * 80 + 10}%`;
                    particle.style.left = `${Math.random() * 80 + 10}%`;
                    particle.style.animationDelay = `${Math.random() * 2}s`;
                    particle.style.width = `${Math.random() * 30 + 10}px`;
                    particle.style.height = particle.style.width;
                    videoMessage.appendChild(particle);
                }
                
                // Add event listener to the close button
                const closeBtn = videoWrapper.querySelector('.close-video');
                if (closeBtn) {
                    closeBtn.addEventListener('click', () => {
                        // Restore original content with animation
                        videoWrapper.classList.add('fade-out');
                        
                        setTimeout(() => {
                            videoWrapper.classList.remove('fade-out');
                            videoWrapper.innerHTML = `
                                <img src="assets/images/image.png" alt="Mirai Demo" class="demo-placeholder">
                                <div class="play-button">
                                    <i class="fas fa-play"></i>
                                </div>
                            `;
                            videoWrapper.style.transform = 'perspective(1000px) rotateY(-5deg)';
                            
                            // Re-initialize the play button event listener
                            const newPlayButton = videoWrapper.querySelector('.play-button');
                            if (newPlayButton) {
                                newPlayButton.addEventListener('click', () => {
                                    playButton.click();
                                });
                            }
                        }, 300);
                    });
                }
            }, 800);
        });
    }
    
    // Demo form submission handling
    const demoForm = document.getElementById('demo-request-form');
    if (demoForm) {
        demoForm.addEventListener('submit', (event) => {
            event.preventDefault();
            
            // Simple form validation and submission effect
            const formGroups = demoForm.querySelectorAll('.form-group');
            let isValid = true;
            
            formGroups.forEach(group => {
                const input = group.querySelector('input, select');
                if (input && input.required && !input.value.trim()) {
                    isValid = false;
                    group.classList.add('error');
                } else {
                    group.classList.remove('error');
                }
            });
            
            if (isValid) {
                // Show success message (in production, this would be an API call)
                const submitBtn = demoForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
                
                setTimeout(() => {
                    demoForm.innerHTML = `
                        <div class="success-message">
                            <i class="fas fa-check-circle"></i>
                            <h3>Thank you!</h3>
                            <p>Your demo request has been received. Our team will contact you within 24 hours to schedule your personalized demo.</p>
                        </div>
                    `;
                }, 1500);
            }
        });
    }
});

// Newsletter subscription functionality
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (event) => {
        event.preventDefault();
        
        const emailInput = newsletterForm.querySelector('input[type="email"]');
        const submitBtn = newsletterForm.querySelector('button');
        
        if (emailInput && emailInput.value.trim() !== '') {
            // Show subscription in progress
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            submitBtn.disabled = true;
            
            // Simulate subscription process
            setTimeout(() => {
                // Replace form with success message
                const formParent = newsletterForm.parentElement;
                if (formParent) {
                    formParent.innerHTML = `
                        <div class="newsletter-success">
                            <i class="fas fa-check-circle"></i>
                            <h4>Thank you for subscribing!</h4>
                            <p>You'll receive our latest updates and news.</p>
                        </div>
                    `;
                }
            }, 1500);
        } else {
            // Show error for empty email
            emailInput.classList.add('error');
            emailInput.addEventListener('focus', () => {
                emailInput.classList.remove('error');
            }, { once: true });
        }
    });
}

// Setup smooth scrolling
const setupSmoothScrolling = () => {
    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                const navLinks = document.querySelector('.nav-links');
                const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
                if (navLinks && navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    const icon = mobileMenuToggle.querySelector('i');
                    if (icon) {
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                    }
                }
            }
        });
    });
};

// Main initialization function to export
export const initializeAnimations = () => {
    // Clean up any existing listeners first
    cleanupAnimations();
    
    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupAllFeatures);
    } else {
        setupAllFeatures();
    }
};

// Cleanup function to remove existing event listeners
function cleanupAnimations() {
    // Remove existing mousemove listeners
    const existingMouseMoveListeners = document.querySelectorAll('[data-mirai-listener]');
    existingMouseMoveListeners.forEach(element => {
        element.removeAttribute('data-mirai-listener');
    });
    
    // Remove scroll listeners
    window.removeEventListener('scroll', scrollHandler);
    window.removeEventListener('mousemove', parallaxHandler);
    window.removeEventListener('mousemove', cursorHandler);
}

// Store handlers for cleanup
let scrollHandler, parallaxHandler, cursorHandler;

// Setup all features and animations
function setupAllFeatures() {
    // Only enable custom cursor on non-touch devices
    if (window.matchMedia("(hover: hover)").matches) {
        setupCustomCursor();
        handleCursorEffects();
    } else {
        // Hide cursor elements on touch devices
        const cursorDot = getElement('cursor-dot');
        const cursorOutline = getElement('cursor-outline');
        
        if (cursorDot) cursorDot.style.display = 'none';
        if (cursorOutline) cursorOutline.style.display = 'none';
    }
    
    setupMobileMenu();
    setupParallax();
    setupScrollAnimations();
    setupCardTilt();
    setupForm();
    setupSmoothScrolling();
    highlightActiveSection();
}
