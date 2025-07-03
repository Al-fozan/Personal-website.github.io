// Astrophotography Page JavaScript

// Gallery data for modal display - Updated with your actual images
const galleryData = {
    1: {
        title: { ar: 'القمر المكتمل', en: 'Full Moon' },
        date: { ar: 'التاريخ: 15 يناير 2024', en: 'Date: January 15, 2024' },
        equipment: { ar: 'المعدات: Canon EOS RP + SkyMax102 + Sky-watcher AZ-GTI mount', en: 'Equipment: Canon EOS RP + SkyMax102 + Sky-watcher AZ-GTI mount' },
        location: { ar: 'الموقع: المطية، السعودية', en: 'Location: Al-moutayah, Saudi Arabia' },
        image: 'images/astrophotography/Fullmoon.png'
    },
    2: {
        title: { ar: 'حزام الجبار', en: 'Orion Belt' },
        date: { ar: 'التاريخ: 1 فبراير 2025', en: 'Date: February 1, 2025' },
        equipment: { ar: 'المعدات: Canon EOS RP + Canon RF 24-105mm At 105mm + Sky-watcher AZ-GTI mount', en: 'Equipment: Canon EOS RP + Canon RF 24-105mm At 105mm + Sky-watcher AZ-GTI mount' },
        location: { ar: 'الموقع: جبال قطن، السعودية', en: 'Location: Qitan Mountains, Saudi Arabia' },
        image: 'images/astrophotography/orion belt 2025_2_1.jpg'
    },
    3: {
        title: { ar: 'مركز درب التبانة', en: 'Milky Way Core' },
        date: { ar: 'التاريخ: 10 نوفمبر 2023', en: 'Date: November 10, 2023' },
        equipment: { ar: 'المعدات: Canon EOS RP + Canon RF 24-105mm At 105mm + Sky-watcher AZ-GTI mount', en: 'Equipment: Canon EOS RP + Canon RF 24-105mm At 105mm + Sky-watcher AZ-GTI mount' },
        location: { ar: 'الموقع: المطية، السعودية', en: 'Location: Al-moutayah, Saudi Arabia' },
        image: 'images/astrophotography/milkywayt.png'
    },
    4: {
        title: { ar: 'مجرة أندروميدا', en: 'Andromeda Galaxy' },
        date: { ar: 'التاريخ: 25 أكتوبر 2023', en: 'Date: October 25, 2023' },
        equipment: { ar: 'المعدات: Canon EOS RP + Skywatcher StarTravel 102 + Sky-watcher AZ-GTI mount', en: 'Equipment: Canon EOS RP + Skywatcher StarTravel 102 + Sky-watcher AZ-GTI mount' },
        location: { ar: 'الموقع: المطية، السعودية', en: 'Location: Al-moutayah, Saudi Arabia' },
        image: 'images/astrophotography/andro3.3.png'
    },
    5: {
        title: { ar: 'سديم رو الحواء', en: 'Rho Ophiuchi Nebula' },
        date: { ar: 'التاريخ: 2025', en: 'Date: 2025' },
        equipment: { ar: 'المعدات: Canon EOS RP + Canon RF 24-105mm At 50mm + Sky-watcher AZ-GTI mount', en: 'Equipment: Canon EOS RP + Canon RF 24-105mm At 50mm + Sky-watcher AZ-GTI mount' },
        location: { ar: 'الموقع: المطية، السعودية', en: 'Location: Al-moutayah, Saudi Arabia' },
        image: 'images/astrophotography/Rho_Ophiuchi Nebula.png'
    }
};

// Modal functions
function openModal(imageId) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImg');
    const modalTitle = document.getElementById('modalTitle');
    const modalEquipment = document.getElementById('modalEquipment');
    const modalLocation = document.getElementById('modalLocation');
    const instructions = document.getElementById('modalInstructions');
    
    const data = galleryData[imageId];
    if (!data) return;
    
    // Get current language from main controller
    const currentLang = document.documentElement.lang || 'ar';
    
    // Update modal content (removed date)
    modalTitle.textContent = data.title[currentLang];
    modalEquipment.textContent = data.equipment[currentLang];
    modalLocation.textContent = data.location[currentLang];
    
    // Update instructions text based on language
    const instructionSpan = instructions.querySelector('span');
    if (instructionSpan) {
        instructionSpan.textContent = currentLang === 'ar' ? 
            'استخدم العجلة للتكبير والتصغير • اسحب لتحريك الصورة • الأسهم للتنقل • Esc للإغلاق' : 
            'Scroll to zoom • Drag to pan • Use arrows to navigate • Esc to close';
    }
    
    // Update modal image with actual photo
    modalImg.src = data.image;
    modalImg.alt = data.title[currentLang];
    
    // Reset zoom and position
    modalImg.style.transform = 'scale(1) translate(0px, 0px)';
    modalImg.classList.remove('zoomed');
    
    // Show modal with animation
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Add show class for animation
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
    
    // Show instructions initially
    instructions.classList.remove('fade-out');
    
    // Hide instructions after 4 seconds
    setTimeout(() => {
        instructions.classList.add('fade-out');
    }, 4000);
    
    // Initialize zoom and pan functionality
    initializeImageZoomPan(modalImg, instructions);
}

function closeModal() {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImg');
    
    // Remove show class for exit animation
    modal.classList.remove('show');
    
    // Reset zoom state
    modalImg.classList.remove('zoomed');
    
    setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }, 400);
}

// Initialize zoom and pan functionality for modal images
function initializeImageZoomPan(img, instructions) {
    let scale = 1;
    let startX = 0;
    let startY = 0;
    let translateX = 0;
    let translateY = 0;
    let isDragging = false;
    
    const minScale = 1;
    const maxScale = 4;
    const scaleStep = 0.1;
    
    // Remove any existing event listeners
    img.onwheel = null;
    img.onmousedown = null;
    img.onmousemove = null;
    img.onmouseup = null;
    img.onmouseleave = null;
    
    // Wheel zoom functionality
    function handleWheel(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const rect = img.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const mouseX = e.clientX - centerX;
        const mouseY = e.clientY - centerY;
        
        const prevScale = scale;
        
        if (e.deltaY < 0) {
            // Zoom in
            scale = Math.min(scale + scaleStep, maxScale);
        } else {
            // Zoom out
            scale = Math.max(scale - scaleStep, minScale);
        }
        
        // Reset translation when back to original size
        if (scale === minScale) {
            translateX = 0;
            translateY = 0;
        } else {
            // Adjust translation to zoom towards mouse position
            const scaleRatio = scale / prevScale;
            translateX = translateX * scaleRatio + mouseX * (1 - scaleRatio);
            translateY = translateY * scaleRatio + mouseY * (1 - scaleRatio);
        }
        
        updateTransform();
        
        // Show instructions briefly when zooming
        if (instructions) {
            instructions.classList.remove('fade-out');
            setTimeout(() => {
                instructions.classList.add('fade-out');
            }, 2000);
        }
    }
    
    // Pan functionality
    function handleMouseDown(e) {
        if (scale <= minScale) return;
        
        e.preventDefault();
        isDragging = true;
        startX = e.clientX - translateX;
        startY = e.clientY - translateY;
        
        img.style.cursor = 'grabbing';
        img.parentElement.classList.add('grabbing');
    }
    
    function handleMouseMove(e) {
        if (!isDragging || scale <= minScale) return;
        
        e.preventDefault();
        translateX = e.clientX - startX;
        translateY = e.clientY - startY;
        
        updateTransform();
    }
    
    function handleMouseUp() {
        isDragging = false;
        img.style.cursor = scale > minScale ? 'grab' : 'grab';
        img.parentElement.classList.remove('grabbing');
    }
    
    function updateTransform() {
        img.style.transform = `scale(${scale}) translate(${translateX}px, ${translateY}px)`;
        
        if (scale > minScale) {
            img.classList.add('zoomed');
        } else {
            img.classList.remove('zoomed');
        }
    }
    
    // Touch support for mobile
    let initialTouchDistance = 0;
    let initialScale = scale;
    
    function getTouchDistance(touches) {
        const dx = touches[0].clientX - touches[1].clientX;
        const dy = touches[0].clientY - touches[1].clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    function handleTouchStart(e) {
        if (e.touches.length === 2) {
            e.preventDefault();
            initialTouchDistance = getTouchDistance(e.touches);
            initialScale = scale;
        } else if (e.touches.length === 1 && scale > minScale) {
            isDragging = true;
            startX = e.touches[0].clientX - translateX;
            startY = e.touches[0].clientY - translateY;
        }
    }
    
    function handleTouchMove(e) {
        if (e.touches.length === 2) {
            e.preventDefault();
            const currentDistance = getTouchDistance(e.touches);
            const scaleChange = currentDistance / initialTouchDistance;
            scale = Math.min(Math.max(initialScale * scaleChange, minScale), maxScale);
            
            if (scale === minScale) {
                translateX = 0;
                translateY = 0;
            }
            
            updateTransform();
        } else if (e.touches.length === 1 && isDragging && scale > minScale) {
            e.preventDefault();
            translateX = e.touches[0].clientX - startX;
            translateY = e.touches[0].clientY - startY;
            updateTransform();
        }
    }
    
    function handleTouchEnd() {
        isDragging = false;
    }
    
    // Add event listeners
    img.addEventListener('wheel', handleWheel, { passive: false });
    img.addEventListener('mousedown', handleMouseDown);
    img.addEventListener('mousemove', handleMouseMove);
    img.addEventListener('mouseup', handleMouseUp);
    img.addEventListener('mouseleave', handleMouseUp);
    
    // Touch events for mobile
    img.addEventListener('touchstart', handleTouchStart, { passive: false });
    img.addEventListener('touchmove', handleTouchMove, { passive: false });
    img.addEventListener('touchend', handleTouchEnd);
    
    // Double-click to reset zoom
    img.addEventListener('dblclick', (e) => {
        e.preventDefault();
        scale = minScale;
        translateX = 0;
        translateY = 0;
        updateTransform();
    });
}

// Enhanced astrophotography page controller
class AstroPageController {
    constructor() {
        this.setupAstroSpecificFeatures();
        this.setupModalEvents();
        this.setupGalleryAnimations();
    }

    setupAstroSpecificFeatures() {
        // Add stars animation
        this.createStarsAnimation();
    }

    setupModalEvents() {
        const modal = document.getElementById('imageModal');
        const modalContent = modal.querySelector('.modal-content');
        
        // Close modal when clicking outside the image
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
        
        // Prevent modal from closing when clicking on the image or content
        modalContent.addEventListener('click', (e) => {
            e.stopPropagation();
        });
        
        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('show')) {
                closeModal();
            }
        });
        
        // Add keyboard navigation for gallery
        document.addEventListener('keydown', (e) => {
            if (!modal.classList.contains('show')) return;
            
            const currentImg = document.getElementById('modalImg');
            const currentSrc = currentImg.src;
            let currentId = null;
            
            // Find current image ID
            for (let id in galleryData) {
                if (currentSrc.includes(galleryData[id].image)) {
                    currentId = parseInt(id);
                    break;
                }
            }
            
            if (currentId) {
                let nextId = null;
                
                if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                    // Next image
                    nextId = currentId + 1;
                    if (!galleryData[nextId]) nextId = 1; // Loop to first
                } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                    // Previous image
                    nextId = currentId - 1;
                    if (!galleryData[nextId]) {
                        // Find last image ID
                        nextId = Math.max(...Object.keys(galleryData).map(k => parseInt(k)));
                    }
                }
                
                if (nextId && galleryData[nextId]) {
                    // Update modal content without closing
                    this.updateModalContent(nextId);
                }
            }
        });
    }
    
    updateModalContent(imageId) {
        const modalImg = document.getElementById('modalImg');
        const modalTitle = document.getElementById('modalTitle');
        const modalEquipment = document.getElementById('modalEquipment');
        const modalLocation = document.getElementById('modalLocation');
        const instructions = document.getElementById('modalInstructions');
        
        const data = galleryData[imageId];
        if (!data) return;
        
        const currentLang = document.documentElement.lang || 'ar';
        
        // Add fade transition
        modalImg.style.opacity = '0.3';
        
        setTimeout(() => {
            modalTitle.textContent = data.title[currentLang];
            modalEquipment.textContent = data.equipment[currentLang];
            modalLocation.textContent = data.location[currentLang];
            modalImg.src = data.image;
            modalImg.alt = data.title[currentLang];
            
            // Reset zoom and position
            modalImg.style.transform = 'scale(1) translate(0px, 0px)';
            modalImg.classList.remove('zoomed');
            
            // Reinitialize zoom and pan for new image
            initializeImageZoomPan(modalImg, instructions);
            
            // Restore opacity
            modalImg.style.opacity = '1';
        }, 150);
    }

    setupGalleryAnimations() {
        // Staggered animation for gallery items
        const galleryItems = document.querySelectorAll('.gallery-item');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 100);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        galleryItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(30px)';
            item.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
            observer.observe(item);
        });
    }

    createStarsAnimation() {
        const starsContainer = document.querySelector('.stars-background');
        if (!starsContainer) return;

        // Create random stars
        for (let i = 0; i < 100; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.cssText = `
                position: absolute;
                width: ${Math.random() * 3 + 1}px;
                height: ${Math.random() * 3 + 1}px;
                background: white;
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                opacity: ${Math.random() * 0.8 + 0.2};
                animation: twinkle ${Math.random() * 4 + 2}s ease-in-out infinite alternate;
            `;
            starsContainer.appendChild(star);
        }
    }
}

// Parallax effect for hero section
function setupParallaxEffect() {
    const heroSection = document.querySelector('.astro-hero');
    if (!heroSection) return;

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallax = heroSection.querySelector('.stars-background');
        
        if (parallax) {
            const speed = scrolled * 0.5;
            parallax.style.transform = `translateY(${speed}px)`;
        }
    });
}

// Gallery filter functionality (for future enhancement)
function setupGalleryFilter() {
    // This can be enhanced to add filtering by category
    // (planets, nebulae, galaxies, etc.)
}

// Lazy loading for images (when real images are added)
function setupLazyLoading() {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Enhanced smooth scroll with offset for fixed navbar
function smoothScrollToSection(sectionId) {
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

// Initialize astrophotography page features
document.addEventListener('DOMContentLoaded', () => {
    new AstroPageController();
    setupParallaxEffect();
    setupGalleryFilter();
    setupLazyLoading();
    
    // Add page-specific loading animation
    const heroTitle = document.querySelector('.astro-hero h1');
    const heroText = document.querySelector('.astro-hero p');
    
    if (heroTitle && heroText) {
        heroTitle.style.opacity = '0';
        heroTitle.style.transform = 'translateY(30px)';
        heroText.style.opacity = '0';
        heroText.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            heroTitle.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            heroTitle.style.opacity = '1';
            heroTitle.style.transform = 'translateY(0)';
        }, 300);
        
        setTimeout(() => {
            heroText.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            heroText.style.opacity = '1';
            heroText.style.transform = 'translateY(0)';
        }, 600);
    }
});
