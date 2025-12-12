// Portfolio Website - Main JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initParticleCanvas();
    initCursorFollower();
    initMagneticButtons();
    initTitleRotator();
    initSkillCubes();
    initProjectCards();
    initContactForm();
    initMobileMenu();
    initScrollAnimations();
    initSoundEffects();
    initVideoBackground();
    
    // Fix initial visibility - make sure everything is visible on load
    setTimeout(() => {
        ensureContentVisibility();
    }, 100);
});

// ============================================================================
// Fix for content visibility
// ============================================================================
function ensureContentVisibility() {
    // Ensure all sections are visible
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.opacity = '1';
        section.style.visibility = 'visible';
    });
    
    // Ensure skill cubes are visible
    const skillCubes = document.querySelectorAll('.skill-cube');
    skillCubes.forEach(cube => {
        cube.style.opacity = '1';
        cube.style.visibility = 'visible';
    });
    
    // Ensure project cards are visible
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.style.opacity = '1';
        card.style.visibility = 'visible';
    });
    
    // Force GSAP to refresh scroll triggers
    if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
    }
}

// ============================================================================
// Video Background Initialization
// ============================================================================
function initVideoBackground() {
    const video = document.getElementById('bg-video');
    if (!video) return;
    
    // Ensure video plays
    video.play().catch(error => {
        console.log('Video autoplay prevented:', error);
        // Show play button for user interaction
        video.controls = true;
    });
    
    // Handle video loading
    video.addEventListener('loadeddata', function() {
        console.log('Video loaded successfully');
    });
    
    video.addEventListener('error', function() {
        console.log('Video failed to load, using fallback');
        // Show fallback background
        const videoBackground = document.querySelector('.video-background');
        if (videoBackground) {
            videoBackground.style.backgroundImage = 'url("assets/images/fallback-bg.jpg")';
            videoBackground.style.backgroundSize = 'cover';
            videoBackground.style.backgroundPosition = 'center';
        }
    });
    video.play().catch(error => {
    console.log('Video autoplay prevented:', error);
    // User interaction এর জন্য play button show করুন
    const playButton = document.createElement('button');
    playButton.innerHTML = '▶ Play Background';
    playButton.style.cssText = 'position:fixed; bottom:20px; right:20px; z-index:9999; padding:10px 20px; background:#6366f1; color:white; border:none; border-radius:5px; cursor:pointer;';
    document.body.appendChild(playButton);
    
    playButton.addEventListener('click', () => {
        video.play();
        playButton.remove();
    });
});
}

// ============================================================================
// Particle Canvas Animation (UPDATED - Fixed performance)
// ============================================================================
function initParticleCanvas() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: 0, y: 0, radius: 100 };
    let animationId;
    
    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles();
    }
    
    // Particle class
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * 0.5 - 0.25;
            this.color = `rgba(${Math.floor(Math.random() * 100 + 155)}, ${Math.floor(Math.random() * 100 + 155)}, 255, ${Math.random() * 0.5 + 0.1})`;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            // Bounce off walls
            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
            
            // Mouse interaction
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < mouse.radius) {
                const force = (mouse.radius - distance) / mouse.radius;
                const directionX = dx / distance;
                const directionY = dy / distance;
                this.x -= directionX * force * 5;
                this.y -= directionY * force * 5;
            }
        }
        
        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    // Create particles
    function initParticles() {
        particles = [];
        const particleCount = Math.min(Math.floor((canvas.width * canvas.height) / 15000), 100);
        
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }
    
    // Connect particles with lines
    function connectParticles() {
        const maxDistance = 100;
        
        for (let a = 0; a < particles.length; a++) {
            for (let b = a; b < particles.length; b++) {
                const dx = particles[a].x - particles[b].x;
                const dy = particles[a].y - particles[b].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < maxDistance) {
                    const opacity = 1 - (distance / maxDistance);
                    ctx.strokeStyle = `rgba(150, 150, 255, ${opacity * 0.1})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
    }
    
    // Animation loop
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let particle of particles) {
            particle.update();
            particle.draw();
        }
        
        connectParticles();
        animationId = requestAnimationFrame(animateParticles);
    }
    
    // Mouse move event
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });
    
    // Initialize
    resizeCanvas();
    animateParticles();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        resizeCanvas();
    });
    
    // Clean up on page unload
    window.addEventListener('beforeunload', () => {
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
    });
}

// ============================================================================
// Cursor Follower (UPDATED - Fixed positioning)
// ============================================================================
function initCursorFollower() {
    const cursor = document.querySelector('.cursor-follower');
    if (!cursor) return;
    
    // Make cursor visible
    cursor.style.opacity = '1';
    
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let animationId;
    
    // Update cursor position
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Animation loop
    function animateCursor() {
        // Smooth movement
        cursorX += (mouseX - cursorX) * 0.15;
        cursorY += (mouseY - cursorY) * 0.15;
        
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        
        animationId = requestAnimationFrame(animateCursor);
    }
    
    animateCursor();
    
    // Cursor interactions
    const interactiveElements = document.querySelectorAll('button, a, .skill-cube, .project-card, .social-icon, .nav-link');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursor.style.background = 'rgba(99, 102, 241, 0.3)';
            cursor.style.borderColor = 'rgba(99, 102, 241, 0.8)';
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            cursor.style.background = 'rgba(99, 102, 241, 0.2)';
            cursor.style.borderColor = 'rgba(99, 102, 241, 0.5)';
        });
    });
    
    // Hide cursor when mouse leaves window
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
    });
    
    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
    });
    
    // Clean up
    window.addEventListener('beforeunload', () => {
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
    });
}

// ============================================================================
// Magnetic Buttons Effect (UPDATED - Fixed performance)
// ============================================================================
function initMagneticButtons() {
    const magneticButtons = document.querySelectorAll('.magnetic');
    
    magneticButtons.forEach(button => {
        button.addEventListener('mousemove', (e) => {
            if (window.innerWidth < 768) return; // Disable on mobile
            
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const deltaX = (x - centerX) / centerX;
            const deltaY = (y - centerY) / centerY;
            
            const strength = 10;
            
            button.style.transform = `translate(${deltaX * strength}px, ${deltaY * strength}px)`;
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translate(0, 0)';
        });
    });
}

// ============================================================================
// Title Rotator (UPDATED - Fixed timing)
// ============================================================================
function initTitleRotator() {
    const titles = document.querySelectorAll('.title-item');
    if (titles.length === 0) return;
    
    let currentIndex = 0;
    let rotationInterval;
    
    function rotateTitles() {
        // Hide all titles
        titles.forEach(title => {
            title.classList.remove('active');
        });
        
        // Show current title
        titles[currentIndex].classList.add('active');
        
        // Move to next title
        currentIndex = (currentIndex + 1) % titles.length;
    }
    
    // Start rotation after initial delay
    setTimeout(() => {
        rotateTitles(); // Show first immediately
        rotationInterval = setInterval(rotateTitles, 3000);
    }, 1000);
    
    // Clean up
    window.addEventListener('beforeunload', () => {
        if (rotationInterval) {
            clearInterval(rotationInterval);
        }
    });
}

// ============================================================================
// Skill Cubes Hover Effects (UPDATED - Fixed 3D transform)
// ============================================================================
function initSkillCubes() {
    const skillCubes = document.querySelectorAll('.skill-cube');
    
    skillCubes.forEach(cube => {
        // Ensure cube is visible
        cube.style.opacity = '1';
        cube.style.visibility = 'visible';
        
        cube.addEventListener('mousemove', (e) => {
            if (window.innerWidth < 768) return; // Disable on mobile
            
            const rect = cube.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateY = ((x - centerX) / centerX) * 10;
            const rotateX = ((centerY - y) / centerY) * 10;
            
            cube.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
        });
        
        cube.addEventListener('mouseleave', () => {
            cube.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        });
    });
}

// ============================================================================
// Project Cards Hover Effects (UPDATED - Fixed parallax)
// ============================================================================
function initProjectCards() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        // Ensure card is visible
        card.style.opacity = '1';
        card.style.visibility = 'visible';
        
        card.addEventListener('mousemove', (e) => {
            if (window.innerWidth < 768) return; // Disable on mobile
            
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateY = ((x - centerX) / centerX) * 5;
            const rotateX = ((centerY - y) / centerY) * 5;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-15px)`;
            
            // Parallax effect for image
            const image = card.querySelector('.project-image-placeholder');
            if (image) {
                const moveX = (x - centerX) * 0.05;
                const moveY = (y - centerY) * 0.05;
                image.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.05)`;
            }
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
            
            const image = card.querySelector('.project-image-placeholder');
            if (image) {
                image.style.transform = 'translate(0, 0) scale(1)';
            }
        });
        
        // Add click handler for project buttons
        const projectBtn = card.querySelector('.project-btn');
        if (projectBtn) {
            projectBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                // Add your project view logic here
                console.log('View project clicked');
                
                // Example: Show a modal or navigate to project page
                // window.open('project-details.html', '_blank');
            });
        }
    });
}

// ============================================================================
// Contact Form (UPDATED - Fixed validation)
// ============================================================================
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;
    
    const submitBtn = contactForm.querySelector('.submit-btn');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    
    // Add form validation styling
    const formInputs = [nameInput, emailInput, messageInput];
    
    formInputs.forEach(input => {
        input.addEventListener('input', function() {
            if (this.value.trim()) {
                this.style.borderColor = 'rgba(99, 102, 241, 0.5)';
            } else {
                this.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            }
        });
    });
    
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Validate form
        let isValid = true;
        
        if (!nameInput.value.trim()) {
            nameInput.style.borderColor = '#ef4444';
            isValid = false;
        }
        
        if (!emailInput.value.trim() || !isValidEmail(emailInput.value)) {
            emailInput.style.borderColor = '#ef4444';
            isValid = false;
        }
        
        if (!messageInput.value.trim()) {
            messageInput.style.borderColor = '#ef4444';
            isValid = false;
        }
        
        if (!isValid) {
            showFormMessage('Please fill in all fields correctly', 'error');
            return;
        }
        
        // Show sending state
        submitBtn.classList.add('sending');
        submitBtn.disabled = true;
        
        // Simulate API call
        try {
            // In a real app, you would use fetch() to send data to a server
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Show success state
            submitBtn.classList.remove('sending');
            submitBtn.classList.add('success');
            
            // Show success message
            showFormMessage('Message sent successfully! I\'ll get back to you soon.', 'success');
            
            // Reset form
            contactForm.reset();
            
            // Reset form styling
            formInputs.forEach(input => {
                input.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            });
            
            // Reset button after delay
            setTimeout(() => {
                submitBtn.classList.remove('success');
                submitBtn.disabled = false;
            }, 3000);
            
        } catch (error) {
            console.error('Form submission error:', error);
            showFormMessage('Something went wrong. Please try again.', 'error');
            submitBtn.classList.remove('sending');
            submitBtn.disabled = false;
        }
    });
}

function showFormMessage(message, type) {
    // Remove existing message
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) existingMessage.remove();
    
    // Create message element
    const messageEl = document.createElement('div');
    messageEl.className = `form-message ${type}`;
    messageEl.textContent = message;
    messageEl.style.cssText = `
        padding: 1rem;
        margin-top: 1rem;
        border-radius: 0.5rem;
        font-weight: 500;
        text-align: center;
        animation: fadeIn 0.3s ease;
    `;
    
    if (type === 'success') {
        messageEl.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
        messageEl.style.color = '#10b981';
        messageEl.style.border = '1px solid rgba(16, 185, 129, 0.2)';
    } else {
        messageEl.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
        messageEl.style.color = '#ef4444';
        messageEl.style.border = '1px solid rgba(239, 68, 68, 0.2)';
    }
    
    // Add to form
    const form = document.getElementById('contact-form');
    form.appendChild(messageEl);
    
    // Remove after delay
    setTimeout(() => {
        if (messageEl.parentNode) {
            messageEl.style.opacity = '0';
            messageEl.style.transition = 'opacity 0.3s ease';
            setTimeout(() => {
                if (messageEl.parentNode) {
                    messageEl.remove();
                }
            }, 300);
        }
    }, 5000);
}

function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// ============================================================================
// Mobile Menu (UPDATED - Fixed toggle)
// ============================================================================
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (!menuToggle || !navMenu) return;
    
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        menuToggle.classList.toggle('active');
        
        // Animate hamburger icon
        const spans = menuToggle.querySelectorAll('span');
        if (navMenu.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            document.body.style.overflow = 'hidden';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
            document.body.style.overflow = '';
        }
    });
    
    // Close menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');
            
            const spans = menuToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
            document.body.style.overflow = '';
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');
            
            const spans = menuToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
            document.body.style.overflow = '';
        }
    });
}

// ============================================================================
// Scroll Animations with GSAP (UPDATED - Fixed initial state)
// ============================================================================
function initScrollAnimations() {
    // Check if GSAP is loaded
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.warn('GSAP or ScrollTrigger not loaded. Skipping scroll animations.');
        return;
    }
    
    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger);
    
    // Set initial state for animated elements
    gsap.set('.skill-cube, .project-card', {
        opacity: 1,
        y: 0
    });
    
    // Animate sections on scroll
    const sections = document.querySelectorAll('section:not(.hero)');
    
    sections.forEach(section => {
        gsap.from(section, {
            scrollTrigger: {
                trigger: section,
                start: 'top 85%',
                end: 'bottom 20%',
                toggleActions: 'play none none reverse',
                markers: false // Set to true for debugging
            },
            y: 50,
            opacity: 0,
            duration: 1,
            ease: 'power2.out'
        });
    });
    
    // Animate skill cubes with stagger
    gsap.from('.skill-cube', {
        scrollTrigger: {
            trigger: '.skills',
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse',
            markers: false
        },
        y: 60,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: 'back.out(1.7)'
    });
    
    // Animate project cards with stagger
    gsap.from('.project-card', {
        scrollTrigger: {
            trigger: '.projects',
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse',
            markers: false
        },
        y: 80,
        opacity: 0,
        stagger: 0.15,
        duration: 1,
        ease: 'power3.out'
    });
    
    // Parallax effect for hero glass
    gsap.to('.hero-glass', {
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
            markers: false
        },
        y: 100,
        ease: 'none'
    });
    
    // Animate about section image
    gsap.from('.image-frame', {
        scrollTrigger: {
            trigger: '.about',
            start: 'top 75%',
            toggleActions: 'play none none reverse',
            markers: false
        },
        x: -50,
        opacity: 0,
        duration: 1,
        ease: 'power2.out'
    });
    
    // Animate about section text
    gsap.from('.about-text', {
        scrollTrigger: {
            trigger: '.about',
            start: 'top 75%',
            toggleActions: 'play none none reverse',
            markers: false
        },
        x: 50,
        opacity: 0,
        duration: 1,
        ease: 'power2.out'
    });
    
    // Refresh ScrollTrigger on load
    ScrollTrigger.refresh();
    
    // Handle resize
    window.addEventListener('resize', () => {
        ScrollTrigger.refresh();
    });
}

// ============================================================================
// Sound Effects (Optional - Can be enabled)
// ============================================================================
function initSoundEffects() {
    // This is optional - you can enable it by adding audio files
    // For now, we'll just log to console
    const buttons = document.querySelectorAll('[data-sound]');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            const soundType = button.getAttribute('data-sound');
            console.log(`Playing sound: ${soundType}`);
            
            // Uncomment to enable sounds (requires audio files)
            /*
            const audio = document.getElementById(`hover-sound-${soundType}`);
            if (audio) {
                audio.currentTime = 0;
                audio.volume = 0.2;
                audio.play().catch(e => console.log('Audio play failed:', e));
            }
            */
        });
    });
}

// ============================================================================
// Utility Functions
// ============================================================================

// Smooth scroll to anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            e.preventDefault();
            
            // Close mobile menu if open
            const navMenu = document.querySelector('.nav-menu');
            const menuToggle = document.querySelector('.menu-toggle');
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
                document.body.style.overflow = '';
            }
            
            // Smooth scroll
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Add CSS for form messages
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    /* Ensure sections are visible */
    section {
        opacity: 1 !important;
        visibility: visible !important;
    }
    
    /* Fix for GSAP animations */
    .gsap-marker-start,
    .gsap-marker-end,
    .gsap-marker-scroller-start,
    .gsap-marker-scroller-end {
        display: none !important;
    }
`;
document.head.appendChild(style);

// Handle page visibility
document.addEventListener('visibilitychange', () => {
    if (!document.hidden && typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
    }
});

// Performance optimization for scroll events
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Initialize on window load
window.addEventListener('load', () => {
    // Refresh GSAP ScrollTrigger
    if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
    }
    
    // Ensure all content is visible
    ensureContentVisibility();
});