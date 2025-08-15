// ===== MAIN JAVASCRIPT FILE =====
// T.R.U.S.T. Argus Web Demo - Main Functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initSmoothScrolling();
    initScrollEffects();
    initContactForm();
    initAnimations();
});

// ===== NAVIGATION FUNCTIONALITY =====
function initNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navbar = document.querySelector('.navbar');
    
    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
    
    // Navbar background on scroll
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.style.background = 'rgba(10, 14, 23, 0.98)';
                navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
            } else {
                navbar.style.background = 'rgba(10, 14, 23, 0.95)';
                navbar.style.boxShadow = 'none';
            }
        });
    }
    
    // Active navigation link highlighting
    highlightActiveNavLink();
    window.addEventListener('scroll', highlightActiveNavLink);
}

// ===== SMOOTH SCROLLING =====
function initSmoothScrolling() {
    // Smooth scroll for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== SCROLL EFFECTS =====
function initScrollEffects() {
    // Parallax effect for hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            if (hero) {
                hero.style.transform = `translateY(${rate}px)`;
            }
        });
    }
    
    // Fade in elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.feature-card, .tech-item, .use-case-card');
    animateElements.forEach(el => {
        observer.observe(el);
    });
}

// ===== ACTIVE NAVIGATION HIGHLIGHTING =====
function highlightActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// ===== CONTACT FORM FUNCTIONALITY =====
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const organization = formData.get('organization');
            const message = formData.get('message');
            
            // Basic validation
            if (!name || !email || !message) {
                showNotification('Please fill in all required fields.', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }
            
            // Simulate form submission (replace with actual form handling)
            showNotification('Thank you for your message! We\'ll get back to you soon.', 'success');
            
            // Reset form
            this.reset();
        });
    }
}

// ===== ANIMATIONS =====
function initAnimations() {
    // Animate stats on hero section
    animateStats();
    
    // Animate mockup on scroll
    animateMockup();
}

// ===== STATS ANIMATION =====
function animateStats() {
    const stats = document.querySelectorAll('.stat-number');
    
    const animateValue = (element, start, end, duration) => {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            
            if (typeof end === 'string' && end.includes('%')) {
                // Handle percentage values
                const numericEnd = parseInt(end);
                const current = Math.floor(progress * numericEnd);
                element.textContent = `${current}%`;
            } else if (typeof end === 'string' && end.includes('+')) {
                // Handle "15+" type values
                const numericEnd = parseInt(end);
                const current = Math.floor(progress * numericEnd);
                element.textContent = `${current}+`;
            } else if (typeof end === 'string' && end.includes('/')) {
                // Handle "24/7" type values
                element.textContent = end;
            } else {
                // Handle numeric values
                const current = Math.floor(progress * end);
                element.textContent = current;
            }
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    };
    
    // Animate each stat when it comes into view
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumber = entry.target;
                const finalValue = statNumber.textContent;
                
                // Reset to 0 and animate
                statNumber.textContent = '0';
                animateValue(statNumber, 0, finalValue, 2000);
                
                statsObserver.unobserve(statNumber);
            }
        });
    }, { threshold: 0.5 });
    
    stats.forEach(stat => {
        statsObserver.observe(stat);
    });
}

// ===== MOCKUP ANIMATION =====
function animateMockup() {
    const mockup = document.querySelector('.mockup-screen');
    
    if (mockup) {
        const mockupObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    mockup.style.animation = 'mockupFloat 3s ease-in-out infinite';
                    mockupObserver.unobserve(mockup);
                }
            });
        }, { threshold: 0.5 });
        
        mockupObserver.observe(mockup);
    }
}

// ===== UTILITY FUNCTIONS =====

// Scroll to section function (for external use)
function scrollToSection(sectionId) {
    const targetSection = document.querySelector(`#${sectionId}`);
    
    if (targetSection) {
        const offsetTop = targetSection.offsetTop - 80;
        
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#40e9a4' : type === 'error' ? '#ff6b6b' : '#29a9e1'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 400px;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    });
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }
    }, 5000);
}

// ===== PERFORMANCE OPTIMIZATIONS =====

// Throttle scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Debounce resize events
function debounce(func, wait, immediate) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Apply throttling to scroll events
window.addEventListener('scroll', throttle(function() {
    // Scroll-based animations and effects
    highlightActiveNavLink();
}, 16)); // 60fps

// Apply debouncing to resize events
window.addEventListener('resize', debounce(function() {
    // Handle responsive adjustments
    if (window.innerWidth > 991) {
        const navMenu = document.querySelector('.nav-menu');
        const navToggle = document.querySelector('.nav-toggle');
        
        if (navMenu && navToggle) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    }
}, 250));

// ===== ACCESSIBILITY IMPROVEMENTS =====

// Keyboard navigation for mobile menu
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const navMenu = document.querySelector('.nav-menu');
        const navToggle = document.querySelector('.nav-toggle');
        
        if (navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    }
});

// Focus management for mobile menu
function manageFocus() {
    const navMenu = document.querySelector('.nav-menu');
    const navToggle = document.querySelector('.nav-toggle');
    
    if (navMenu && navToggle) {
        if (navMenu.classList.contains('active')) {
            // Trap focus in mobile menu
            const focusableElements = navMenu.querySelectorAll('a, button, input, textarea, select');
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            navMenu.addEventListener('keydown', function(e) {
                if (e.key === 'Tab') {
                    if (e.shiftKey) {
                        if (document.activeElement === firstElement) {
                            e.preventDefault();
                            lastElement.focus();
                        }
                    } else {
                        if (document.activeElement === lastElement) {
                            e.preventDefault();
                            firstElement.focus();
                        }
                    }
                }
            });
        }
    }
}

// Initialize focus management
document.addEventListener('DOMContentLoaded', manageFocus);

// ===== ERROR HANDLING =====

// Global error handler
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
    
    // Show user-friendly error message
    showNotification('Something went wrong. Please refresh the page and try again.', 'error');
});

// Unhandled promise rejection handler
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
    
    // Show user-friendly error message
    showNotification('Something went wrong. Please refresh the page and try again.', 'error');
});

// ===== ANALYTICS & TRACKING =====

// Track demo interactions
function trackDemoInteraction(action, details = {}) {
    // This would integrate with your analytics platform
    console.log('Demo interaction:', action, details);
    
    // Example: Google Analytics 4
    if (typeof gtag !== 'undefined') {
        gtag('event', 'demo_interaction', {
            event_category: 'demo',
            event_label: action,
            value: 1,
            ...details
        });
    }
}

// Track feature exploration
function trackFeatureExploration(feature) {
    trackDemoInteraction('feature_exploration', { feature });
}

// Track contact form submission
function trackContactSubmission() {
    trackDemoInteraction('contact_submission');
}

// ===== EXPORT FUNCTIONS FOR EXTERNAL USE =====
window.TRUSTArgusDemo = {
    scrollToSection,
    showNotification,
    trackDemoInteraction,
    trackFeatureExploration,
    trackContactSubmission
};
