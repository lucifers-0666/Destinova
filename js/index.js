// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
    // Initialize the app
    initializeApp();
});

// Main initialization function
function initializeApp() {
    // Load components first, then initialize everything else
    loadAllComponents().then(() => {
        // Initialize all functionality after components are loaded
        initializeNavigation();
        initializePassengerSelector();
        initializeScrollEffects();
        initializeSignInToggle();
        initializeMobileMenu();
        initializeNewsletter();
        console.log('✅ All components loaded and initialized successfully!');
    }).catch(error => {
        console.error('❌ Error loading components:', error);
    });
}

// Load all components with Promise.all for better performance
function loadAllComponents() {
    const headerPromise = loadComponent('components/header.html', 'header-placeholder');
    const footerPromise = loadComponent('components/footer.html', 'footer-placeholder');

    return Promise.all([headerPromise, footerPromise]);
}

// Enhanced component loader with error handling
function loadComponent(url, targetId) {
    return new Promise((resolve, reject) => {
        const target = document.getElementById(targetId);

        if (!target) {
            console.error(`❌ Target element with ID "${targetId}" not found`);
            reject(new Error(`Target element ${targetId} not found`));
            return;
        }

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                return response.text();
            })
            .then(data => {
                target.innerHTML = data;
                console.log(`✅ Loaded: ${url} → #${targetId}`);
                resolve();
            })
            .catch(error => {
                console.error(`❌ Failed to load ${url}:`, error);
                target.innerHTML = `<div style="color: red; padding: 20px;">Failed to load ${url}</div>`;
                reject(error);
            });
    });
}

// Navigation scroll effects
function initializeScrollEffects() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    let isScrolling = false;

    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            window.requestAnimationFrame(() => {
                if (window.scrollY > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
                isScrolling = false;
            });
            isScrolling = true;
        }
    });
}

// Navigation active link management
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);

                if (target) {
                    const headerHeight = document.getElementById('navbar')?.offsetHeight || 80;
                    const targetPosition = target.offsetTop - headerHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });

                    // Update active state
                    updateActiveNavLink(href);
                }
            }
        });
    });

    // Update active nav link on scroll
    window.addEventListener('scroll', throttle(updateActiveNavOnScroll, 100));
}

// Update active navigation link
function updateActiveNavLink(activeHref) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === activeHref) {
            link.classList.add('active');
        }
    });
}

// Update active nav on scroll
function updateActiveNavOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
        const top = section.offsetTop;
        const bottom = top + section.offsetHeight;
        const id = section.getAttribute('id');

        if (scrollPos >= top && scrollPos <= bottom) {
            updateActiveNavLink(`#${id}`);
        }
    });
}

// Sign in/out toggle functionality
function initializeSignInToggle() {
    const signInBtn = document.getElementById('signInBtn');
    const userIcon = document.getElementById('userIcon');

    if (!signInBtn || !userIcon) return;

    let isLoggedIn = false;

    signInBtn.addEventListener('click', () => {
        isLoggedIn = true;
        signInBtn.style.display = 'none';
        userIcon.style.display = 'flex';
        console.log('✅ User signed in');
    });

    userIcon.addEventListener('click', () => {
        isLoggedIn = false;
        userIcon.style.display = 'none';
        signInBtn.style.display = 'flex';
        console.log('✅ User signed out');
    });
}

// Mobile menu functionality
function initializeMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const closeMenuBtn = document.getElementById('closeMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');

    if (!mobileMenuBtn || !closeMenuBtn || !mobileMenu) return;

    // Open mobile menu
    mobileMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openMobileMenu();
    });

    // Close mobile menu
    closeMenuBtn.addEventListener('click', () => {
        closeMobileMenu();
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileMenu.contains(e.target) &&
            !mobileMenuBtn.contains(e.target)) {
            closeMobileMenu();
        }
    });

    // Close menu when clicking on nav links
    const mobileNavLinks = mobileMenu.querySelectorAll('.nav-link');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMobileMenu();
        });
    });

    function openMobileMenu() {
        mobileMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
        mobileMenuBtn.setAttribute('aria-expanded', 'true');
    }

    function closeMobileMenu() {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = 'auto';
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
    }
}

// Enhanced passenger selector
function initializePassengerSelector() {
    const passengerSelector = document.querySelector('.passenger-selector');
    if (!passengerSelector) return;

    const passengersInput = document.getElementById('passengers');
    const adultCountEl = document.getElementById('adult-count');
    const childCountEl = document.getElementById('child-count');

    if (!passengersInput || !adultCountEl || !childCountEl) return;

    let adults = 1;
    let children = 0;

    function updatePassengerDisplay() {
        const adultText = `${adults} Adult${adults > 1 ? 's' : ''}`;
        const childText = children > 0 ? `, ${children} Child${children > 1 ? 'ren' : ''}` : '';

        passengersInput.value = adultText + childText;
        adultCountEl.textContent = adults;
        childCountEl.textContent = children;
    }

    // Toggle dropdown
    passengersInput.addEventListener('click', (e) => {
        e.stopPropagation();
        passengerSelector.classList.toggle('active');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!passengerSelector.contains(e.target)) {
            passengerSelector.classList.remove('active');
        }
    });

    // Handle passenger controls with event delegation
    passengerSelector.addEventListener('click', (e) => {
        const target = e.target;

        if (target.matches('.increase-adult') && adults < 9) {
            adults++;
            updatePassengerDisplay();
        }

        if (target.matches('.decrease-adult') && adults > 1) {
            adults--;
            updatePassengerDisplay();
        }

        if (target.matches('.increase-child') && children < 6) {
            children++;
            updatePassengerDisplay();
        }

        if (target.matches('.decrease-child') && children > 0) {
            children--;
            updatePassengerDisplay();
        }
    });

    // Initialize display
    updatePassengerDisplay();
}

// Newsletter subscription
function initializeNewsletter() {
    const newsletterForm = document.querySelector('.newsletter-form');
    if (!newsletterForm) return;

    newsletterForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const emailInput = this.querySelector('input[type="email"]');
        const email = emailInput.value.trim();

        if (email) {
            // Simulate subscription
            showNotification('✅ Thank you for subscribing to our newsletter!', 'success');
            emailInput.value = '';
        } else {
            showNotification('❌ Please enter a valid email address.', 'error');
        }
    });
}

// Utility: Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function () {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Utility: Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        border-radius: 5px;
        z-index: 10000;
        font-family: 'Poppins', sans-serif;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        transition: all 0.3s ease;
        transform: translateX(100%);
    `;

    notification.textContent = message;
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Handle errors gracefully
window.addEventListener('error', function (e) {
    console.error('❌ JavaScript Error:', e.error);
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', function (e) {
    console.error('❌ Unhandled Promise Rejection:', e.reason);
});
