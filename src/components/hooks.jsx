import { useEffect, useRef, useState, useCallback } from 'react';

// Custom Cursor Hook
export const useCustomCursor = () => {
  const cursorDotRef = useRef(null);
  const cursorOutlineRef = useRef(null);

  useEffect(() => {
    // Only enable custom cursor on non-touch devices
    if (!window.matchMedia("(hover: hover)").matches) {
      return;
    }

    const handleMouseMove = (e) => {
      const posX = e.clientX;
      const posY = e.clientY;
      
      if (cursorDotRef.current) {
        cursorDotRef.current.style.left = `${posX}px`;
        cursorDotRef.current.style.top = `${posY}px`;
      }
      
      if (cursorOutlineRef.current) {
        cursorOutlineRef.current.animate({
          left: `${posX}px`,
          top: `${posY}px`
        }, {
          duration: 500,
          fill: 'forwards'
        });
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return { cursorDotRef, cursorOutlineRef };
};

// Cursor Effects Hook
export const useCursorEffects = () => {
  useEffect(() => {
    if (!window.matchMedia("(hover: hover)").matches) {
      return;
    }

    const interactiveElements = document.querySelectorAll(
      'a, button, .btn-primary, .btn-secondary, .feature-card, .pricing-card, input, textarea'
    );
    
    const cursorDot = document.getElementById('cursor-dot');
    const cursorOutline = document.getElementById('cursor-outline');

    const handleMouseEnter = () => {
      if (cursorDot) cursorDot.style.transform = 'translate(-50%, -50%) scale(2)';
      if (cursorOutline) cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
    };

    const handleMouseLeave = () => {
      if (cursorDot) cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
      if (cursorOutline) cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
    };
    
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, []);
};

// Mobile Menu Hook
export const useMobileMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  return { isMenuOpen, toggleMenu };
};

// Active Section Hook
export const useActiveSection = (sectionIds) => {
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      
      for (const sectionId of sectionIds) {
        const section = document.getElementById(sectionId);
        if (section) {
          const sectionTop = section.offsetTop - 100;
          const sectionHeight = section.offsetHeight;
          
          if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial position

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [sectionIds]);

  return activeSection;
};

// Parallax Hook
export const useParallax = () => {
  useEffect(() => {
    const handleMouseMove = (e) => {
      const mouseX = e.clientX / window.innerWidth;
      const mouseY = e.clientY / window.innerHeight;
      
      const fluid1 = document.getElementById('fluid1');
      const fluid2 = document.getElementById('fluid2');
      const fluid3 = document.getElementById('fluid3');
      
      if (fluid1) fluid1.style.transform = `translate(${mouseX * 30}px, ${mouseY * 30}px)`;
      if (fluid2) fluid2.style.transform = `translate(${mouseX * -20}px, ${mouseY * 20}px)`;
      if (fluid3) fluid3.style.transform = `translate(${mouseX * 15}px, ${mouseY * -15}px)`;
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
};

// Scroll Animations Hook
export const useScrollAnimations = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 100;
      setIsScrolled(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return { isScrolled };
};

// Card Tilt Hook
export const useCardTilt = (cardRef) => {
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e) => {
      const cardRect = card.getBoundingClientRect();
      const x = e.clientX - cardRect.left;
      const y = e.clientY - cardRect.top;
      
      const centerX = cardRect.width / 2;
      const centerY = cardRect.height / 2;
      
      const rotateY = ((x - centerX) / centerX) * 10;
      const rotateX = ((centerY - y) / centerY) * 10;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
      
      const shine = card.querySelector('.feature-icon');
      if (shine) {
        shine.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(110, 64, 255, 0.8), rgba(52, 255, 233, 0.4))`;
      }
    };

    const handleMouseLeave = () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
      
      const shine = card.querySelector('.feature-icon');
      if (shine) {
        shine.style.background = 'linear-gradient(45deg, var(--primary), var(--accent))';
      }
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);
};

// Form Submission Hook
export const useFormSubmission = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = useCallback(async (e, onSuccess) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      
      if (onSuccess) onSuccess();
      
      // Reset after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    }, 1500);
  }, []);

  return { isSubmitting, isSubmitted, handleSubmit };
};

// Newsletter Subscription Hook
export const useNewsletterSubscription = () => {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }
    
    setIsSubscribing(true);
    setError('');
    
    // Simulate API call
    setTimeout(() => {
      setIsSubscribing(false);
      setIsSubscribed(true);
    }, 1500);
  }, [email]);

  return {
    email,
    setEmail,
    isSubscribing,
    isSubscribed,
    error,
    setError,
    handleSubmit
  };
};

// Intersection Observer Hook for animations
export const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const targetRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      { threshold: 0.2, ...options }
    );

    const current = targetRef.current;
    if (current) {
      observer.observe(current);
    }

    return () => {
      if (current) {
        observer.unobserve(current);
      }
    };
  }, [options]);

  return { targetRef, isIntersecting };
};

// Smooth Scroll Hook
export const useSmoothScroll = () => {
  const scrollToSection = useCallback((sectionId) => {
    const targetElement = document.getElementById(sectionId);
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  }, []);

  return { scrollToSection };
};

// Demo Video Hook
export const useDemoVideo = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoWrapperRef = useRef(null);

  const handlePlay = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsPlaying(false);
  }, []);

  useEffect(() => {
    const wrapper = videoWrapperRef.current;
    if (!wrapper) return;

    const handleMouseMove = (e) => {
      if (isPlaying) return;
      
      const { left, top, width, height } = wrapper.getBoundingClientRect();
      const x = (e.clientX - left) / width - 0.5;
      const y = (e.clientY - top) / height - 0.5;
      
      wrapper.style.transform = `perspective(1000px) rotateY(${x * 5}deg) rotateX(${y * -5}deg)`;
    };

    const handleMouseLeave = () => {
      if (isPlaying) return;
      wrapper.style.transform = 'perspective(1000px) rotateY(-5deg)';
    };

    wrapper.addEventListener('mousemove', handleMouseMove);
    wrapper.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      wrapper.removeEventListener('mousemove', handleMouseMove);
      wrapper.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isPlaying]);

  return {
    isPlaying,
    handlePlay,
    handleClose,
    videoWrapperRef
  };
};