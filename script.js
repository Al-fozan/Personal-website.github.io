// Main JavaScript for Personal Website
class WebsiteController {
    constructor() {
        this.currentLang = 'ar';
        
        this.init();
    }

    init() {
        this.loadUserPreferences();
        this.setupEventListeners();
        this.updateContent();
    }

    // Load user preferences from localStorage
    loadUserPreferences() {
        const savedLang = localStorage.getItem('preferred-language');
        
        if (savedLang && ['ar', 'en'].includes(savedLang)) {
            this.currentLang = savedLang;
        }
    }

    // Setup all event listeners
    setupEventListeners() {
        // Language toggle
        const langToggle = document.getElementById('langToggle');
        if (langToggle) {
            langToggle.addEventListener('click', () => this.toggleLanguage());
        }

        // Contact form
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => this.handleContactForm(e));
        }

        // Smooth scrolling for navigation
        this.setupSmoothScrolling();

        // Form input animations
        this.setupFormAnimations();
    }

    // Toggle between Arabic and English
    toggleLanguage() {
        this.currentLang = this.currentLang === 'ar' ? 'en' : 'ar';
        this.updateContent();
        this.saveUserPreferences();
    }

    // Update all content based on current language
    updateContent() {
        const html = document.documentElement;
        const body = document.body;
        
        // Update language and direction
        html.lang = this.currentLang;
        html.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
        body.setAttribute('data-lang', this.currentLang);

        // Update font family
        body.style.fontFamily = this.currentLang === 'ar' 
            ? 'var(--font-arabic)' 
            : 'var(--font-english)';

        // Update all elements with data-ar and data-en attributes
        const elements = document.querySelectorAll('[data-ar][data-en]');
        elements.forEach(element => {
            const content = this.currentLang === 'ar' 
                ? element.getAttribute('data-ar')
                : element.getAttribute('data-en');
            
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = content;
            } else {
                element.textContent = content;
            }
        });

        // Update language toggle buttons
        this.updateLanguageToggle();
    }

    // Update language toggle visual state
    updateLanguageToggle() {
        const toggleOptions = document.querySelectorAll('.lang-toggle .toggle-option');
        toggleOptions.forEach(option => {
            const lang = option.getAttribute('data-lang');
            if (lang === this.currentLang) {
                option.classList.add('active');
            } else {
                option.classList.remove('active');
            }
        });
    }

    // Save user preferences to localStorage
    saveUserPreferences() {
        localStorage.setItem('preferred-language', this.currentLang);
    }

    // Handle contact form submission
    handleContactForm(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');

        // Basic validation
        if (!name || !email || !message) {
            this.showNotification('يرجى ملء جميع الحقول / Please fill all fields', 'error');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            this.showNotification('يرجى إدخال بريد إلكتروني صحيح / Please enter a valid email', 'error');
            return;
        }

        // Simulate form submission
        this.showNotification('تم إرسال رسالتك بنجاح! / Message sent successfully!', 'success');
        e.target.reset();
    }

    // Show notification
    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '100px',
            right: '20px',
            left: '20px',
            maxWidth: '400px',
            margin: '0 auto',
            padding: '1rem 1.5rem',
            borderRadius: '0.5rem',
            color: 'white',
            fontWeight: '500',
            zIndex: '9999',
            transform: 'translateY(-20px)',
            opacity: '0',
            transition: 'all 0.3s ease',
            textAlign: 'center'
        });

        // Set background color based on type
        switch (type) {
            case 'success':
                notification.style.background = 'linear-gradient(135deg, #10b981, #059669)';
                break;
            case 'error':
                notification.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
                break;
            default:
                notification.style.background = 'linear-gradient(135deg, #3b82f6, #2563eb)';
        }

        // Add to document
        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateY(0)';
            notification.style.opacity = '1';
        }, 100);

        // Remove after delay
        setTimeout(() => {
            notification.style.transform = 'translateY(-20px)';
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }

    // Setup smooth scrolling
    setupSmoothScrolling() {
        // Add smooth scrolling behavior to all internal links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // Setup form input animations
    setupFormAnimations() {
        const inputs = document.querySelectorAll('.form-group input, .form-group textarea');
        
        inputs.forEach(input => {
            // Handle focus and blur for floating labels
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
            });

            input.addEventListener('blur', () => {
                if (!input.value) {
                    input.parentElement.classList.remove('focused');
                }
            });

            // Check if input has value on page load
            if (input.value) {
                input.parentElement.classList.add('focused');
            }
        });
    }
}

// Global scroll function for buttons
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const navHeight = document.querySelector('.navbar').offsetHeight;
        const targetPosition = section.offsetTop - navHeight - 20;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// Intersection Observer for scroll animations
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.hobby-card, .certificate-card, .social-link');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Initialize website when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new WebsiteController();
    setupScrollAnimations();
    
    // Add loading animation
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// Handle window resize
window.addEventListener('resize', () => {
    // Update any size-dependent calculations
    // This can be expanded based on specific needs
});

// Handle scroll events for navbar
let lastScrollTop = 0;
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Add shadow when scrolled
    if (scrollTop > 10) {
        navbar.style.boxShadow = '0 2px 10px var(--shadow)';
    } else {
        navbar.style.boxShadow = 'none';
    }

    lastScrollTop = scrollTop;
});
