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

        // Smooth scrolling for navigation
        this.setupSmoothScrolling();
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
