/* ============================================
   DESTINOVA TERMS & CONDITIONS - PREMIUM JS
   Version 2.1 | Last Updated: November 10, 2025
   Features: Interactive Navigation, Search, PDF Generation, Chatbot, Accessibility
   ============================================ */

'use strict';

/* ============================================
   1. GLOBAL STATE & CONFIGURATION
   ============================================ */
const TermsApp = {
    // State
    state: {
        currentFontSize: 16,
        colorMode: 'light',
        language: 'en',
        scrollProgress: 0,
        isSidebarOpen: false,
        isChatbotOpen: false,
        searchQuery: '',
        activeSection: 1
    },
    
    // Configuration
    config: {
        minFontSize: 14,
        maxFontSize: 20,
        fontSizeStep: 2,
        scrollOffset: 100,
        searchDebounceDelay: 300,
        progressUpdateThrottle: 50
    },
    
    // Cache DOM elements
    elements: {},
    
    // Timers
    timers: {
        searchDebounce: null,
        progressThrottle: null
    }
};

/* ============================================
   2. INITIALIZATION
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
    TermsApp.init();
});

TermsApp.init = function() {
    // Cache DOM elements
    this.cacheElements();
    
    // Load saved preferences
    this.loadPreferences();
    
    // Initialize features
    this.initReadingProgress();
    this.initTableOfContents();
    this.initSearch();
    this.initAccessibility();
    this.initMobileNavigation();
    this.initChatbot();
    this.initScrollAnimations();
    this.initParticleSystem();
    this.initPDFGeneration();
    this.initPrintFunction();
    this.initTooltips();
    this.initKeyboardShortcuts();
    
    // Log initialization
    console.log('✅ Destinova Terms & Conditions initialized');
};

/* ============================================
   3. CACHE DOM ELEMENTS
   ============================================ */
TermsApp.cacheElements = function() {
    this.elements = {
        // Progress
        progressBar: document.getElementById('readingProgressBar'),
        progressPercentage: document.getElementById('progressPercentage'),
        
        // Navigation
        sidebarNav: document.getElementById('sidebarNav'),
        sidebarClose: document.getElementById('sidebarClose'),
        floatingNavBtn: document.getElementById('floatingNavBtn'),
        tocList: document.getElementById('tocList'),
        tocItems: document.querySelectorAll('.toc-item'),
        
        // Search
        tocSearch: document.getElementById('tocSearch'),
        
        // Accessibility
        decreaseFont: document.getElementById('decreaseFont'),
        resetFont: document.getElementById('resetFont'),
        increaseFont: document.getElementById('increaseFont'),
        colorModeSelect: document.getElementById('colorModeSelect'),
        languageSelect: document.getElementById('languageSelect'),
        
        // Actions
        printBtn: document.getElementById('printBtn'),
        pdfBtn: document.getElementById('pdfBtn'),
        contactSupportBtn: document.getElementById('contactSupportBtn'),
        
        // Chatbot
        chatbotWidget: document.getElementById('chatbotWidget'),
        chatbotToggle: document.getElementById('chatbotToggle'),
        chatbotClose: document.getElementById('chatbotClose'),
        chatbotWindow: document.getElementById('chatbotWindow'),
        chatbotInput: document.getElementById('chatbotInput'),
        chatbotSend: document.getElementById('chatbotSend'),
        quickQuestionBtns: document.querySelectorAll('.quick-question-btn'),
        
        // Content
        sections: document.querySelectorAll('.terms-section'),
        mainContent: document.getElementById('main-content'),
        
        // Loading
        loadingOverlay: document.getElementById('loadingOverlay'),
        
        // Particle System
        particleSystem: document.getElementById('particleSystem')
    };
};

/* ============================================
   4. READING PROGRESS INDICATOR
   ============================================ */
TermsApp.initReadingProgress = function() {
    let ticking = false;
    
    const updateProgress = () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const progress = (scrollTop / scrollHeight) * 100;
        
        this.state.scrollProgress = Math.round(progress);
        
        if (this.elements.progressBar) {
            this.elements.progressBar.style.width = `${progress}%`;
        }
        
        if (this.elements.progressPercentage) {
            this.elements.progressPercentage.textContent = `${this.state.scrollProgress}%`;
            
            // Celebration at 100%
            if (this.state.scrollProgress === 100 && !this.elements.progressPercentage.classList.contains('complete')) {
                this.elements.progressPercentage.classList.add('complete');
                this.celebrateCompletion();
            } else if (this.state.scrollProgress < 100) {
                this.elements.progressPercentage.classList.remove('complete');
            }
        }
        
        ticking = false;
    };
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(updateProgress);
            ticking = true;
        }
        
        // Update active section
        this.updateActiveSection();
    });
    
    // Initial update
    updateProgress();
};

TermsApp.celebrateCompletion = function() {
    if (typeof confetti !== 'undefined') {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.1, x: 0.95 }
        });
    }
};

/* ============================================
   5. TABLE OF CONTENTS & NAVIGATION
   ============================================ */
TermsApp.initTableOfContents = function() {
    // Smooth scroll to sections
    this.elements.tocItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = item.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - this.config.scrollOffset;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Close sidebar on mobile
                if (window.innerWidth < 1024) {
                    this.closeSidebar();
                }
            }
        });
    });
};

TermsApp.updateActiveSection = function() {
    let currentSection = 1;
    
    this.elements.sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 150 && rect.bottom >= 150) {
            currentSection = index + 1;
        }
    });
    
    if (currentSection !== this.state.activeSection) {
        this.state.activeSection = currentSection;
        
        // Update TOC active state
        this.elements.tocItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-section') == currentSection) {
                item.classList.add('active');
            }
        });
    }
};

/* ============================================
   6. SEARCH FUNCTIONALITY
   ============================================ */
TermsApp.initSearch = function() {
    if (!this.elements.tocSearch) return;
    
    this.elements.tocSearch.addEventListener('input', (e) => {
        clearTimeout(this.timers.searchDebounce);
        
        this.timers.searchDebounce = setTimeout(() => {
            this.performSearch(e.target.value.toLowerCase());
        }, this.config.searchDebounceDelay);
    });
};

TermsApp.performSearch = function(query) {
    this.state.searchQuery = query;
    
    this.elements.tocItems.forEach(item => {
        const title = item.querySelector('.toc-title').textContent.toLowerCase();
        
        if (title.includes(query) || query === '') {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
};

/* ============================================
   7. ACCESSIBILITY FEATURES
   ============================================ */
TermsApp.initAccessibility = function() {
    // Font size controls
    if (this.elements.decreaseFont) {
        this.elements.decreaseFont.addEventListener('click', () => {
            this.changeFontSize(-this.config.fontSizeStep);
        });
    }
    
    if (this.elements.resetFont) {
        this.elements.resetFont.addEventListener('click', () => {
            this.resetFontSize();
        });
    }
    
    if (this.elements.increaseFont) {
        this.elements.increaseFont.addEventListener('click', () => {
            this.changeFontSize(this.config.fontSizeStep);
        });
    }
    
    // Color mode
    if (this.elements.colorModeSelect) {
        this.elements.colorModeSelect.addEventListener('change', (e) => {
            this.changeColorMode(e.target.value);
        });
    }
    
    // Language selector
    if (this.elements.languageSelect) {
        this.elements.languageSelect.addEventListener('change', (e) => {
            this.changeLanguage(e.target.value);
        });
    }
};

TermsApp.changeFontSize = function(delta) {
    const newSize = Math.min(
        this.config.maxFontSize,
        Math.max(this.config.minFontSize, this.state.currentFontSize + delta)
    );
    
    if (newSize !== this.state.currentFontSize) {
        this.state.currentFontSize = newSize;
        document.documentElement.style.fontSize = `${newSize}px`;
        this.savePreferences();
        
        // Show notification
        this.showNotification(`Font size: ${newSize}px`);
    }
};

TermsApp.resetFontSize = function() {
    this.state.currentFontSize = 16;
    document.documentElement.style.fontSize = '16px';
    this.savePreferences();
    this.showNotification('Font size reset to default');
};

TermsApp.changeColorMode = function(mode) {
    this.state.colorMode = mode;
    
    // Remove existing mode classes
    document.body.classList.remove('light-mode', 'dark-mode', 'high-contrast');
    
    // Apply new mode
    if (mode !== 'light') {
        document.body.classList.add(`${mode}-mode`);
    }
    
    this.savePreferences();
    this.showNotification(`Color mode: ${mode}`);
};

TermsApp.changeLanguage = function(lang) {
    this.state.language = lang;
    this.savePreferences();
    
    // In production, this would load translations
    this.showNotification(`Language changed to: ${lang}`);
    console.log(`Language changed to: ${lang} (Translation not implemented in demo)`);
};

/* ============================================
   8. MOBILE NAVIGATION
   ============================================ */
TermsApp.initMobileNavigation = function() {
    // Floating button
    if (this.elements.floatingNavBtn) {
        this.elements.floatingNavBtn.addEventListener('click', () => {
            this.openSidebar();
        });
    }
    
    // Close button
    if (this.elements.sidebarClose) {
        this.elements.sidebarClose.addEventListener('click', () => {
            this.closeSidebar();
        });
    }
    
    // Close on backdrop click
    document.addEventListener('click', (e) => {
        if (this.state.isSidebarOpen && 
            !this.elements.sidebarNav.contains(e.target) && 
            !this.elements.floatingNavBtn.contains(e.target)) {
            this.closeSidebar();
        }
    });
};

TermsApp.openSidebar = function() {
    this.state.isSidebarOpen = true;
    this.elements.sidebarNav.classList.add('open');
    document.body.style.overflow = 'hidden';
};

TermsApp.closeSidebar = function() {
    this.state.isSidebarOpen = false;
    this.elements.sidebarNav.classList.remove('open');
    document.body.style.overflow = '';
};

/* ============================================
   9. CHATBOT WIDGET
   ============================================ */
TermsApp.initChatbot = function() {
    if (!this.elements.chatbotToggle) return;
    
    // Toggle chatbot
    this.elements.chatbotToggle.addEventListener('click', () => {
        this.toggleChatbot();
    });
    
    // Close chatbot
    if (this.elements.chatbotClose) {
        this.elements.chatbotClose.addEventListener('click', () => {
            this.toggleChatbot();
        });
    }
    
    // Send message
    if (this.elements.chatbotSend) {
        this.elements.chatbotSend.addEventListener('click', () => {
            this.sendChatbotMessage();
        });
    }
    
    // Enter key to send
    if (this.elements.chatbotInput) {
        this.elements.chatbotInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendChatbotMessage();
            }
        });
    }
    
    // Quick question buttons
    this.elements.quickQuestionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const question = btn.textContent;
            this.handleQuickQuestion(question);
        });
    });
};

TermsApp.toggleChatbot = function() {
    this.state.isChatbotOpen = !this.state.isChatbotOpen;
    
    if (this.state.isChatbotOpen) {
        this.elements.chatbotWindow.classList.add('open');
    } else {
        this.elements.chatbotWindow.classList.remove('open');
    }
};

TermsApp.sendChatbotMessage = function() {
    const input = this.elements.chatbotInput;
    if (!input || !input.value.trim()) return;
    
    const message = input.value.trim();
    
    // Add user message to chat
    this.addChatMessage(message, 'user');
    
    // Clear input
    input.value = '';
    
    // Simulate bot response
    setTimeout(() => {
        this.handleChatbotResponse(message);
    }, 500);
};

TermsApp.addChatMessage = function(text, sender = 'bot') {
    const chatBody = this.elements.chatbotWindow.querySelector('.chatbot-body');
    if (!chatBody) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `chatbot-message ${sender}`;
    
    if (sender === 'bot') {
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <p>${text}</p>
            </div>
        `;
    } else {
        messageDiv.innerHTML = `
            <div class="message-content">
                <p>${text}</p>
            </div>
            <div class="message-avatar">
                <i class="fas fa-user"></i>
            </div>
        `;
    }
    
    // Remove quick questions after first message
    const quickQuestions = chatBody.querySelector('.quick-questions');
    if (quickQuestions) {
        quickQuestions.remove();
    }
    
    chatBody.appendChild(messageDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
};

TermsApp.handleQuickQuestion = function(question) {
    this.addChatMessage(question, 'user');
    
    setTimeout(() => {
        this.handleChatbotResponse(question);
    }, 500);
};

TermsApp.handleChatbotResponse = function(question) {
    const lowerQuestion = question.toLowerCase();
    let response = '';
    
    if (lowerQuestion.includes('cancellation')) {
        response = 'Our cancellation fees vary based on timing. For domestic flights: ₹500+ (>30 days), ₹1,000+ (15-30 days), ₹2,000+ (7-14 days), Non-refundable (<72 hours). See Section 12 for details.';
    } else if (lowerQuestion.includes('refund')) {
        response = 'Refunds are processed in 7-14 business days for cards, 5-7 days for UPI/wallets. The exact timeline depends on your payment method. Check Section 13 for complete refund policy.';
    } else if (lowerQuestion.includes('name change')) {
        response = 'Minor corrections (up to 3 characters) are FREE within 24 hours. Major name changes cost ₹2,500 (domestic) or ₹5,000 (international). See Section 7 for full details.';
    } else if (lowerQuestion.includes('baggage')) {
        response = 'Cabin baggage: 7kg (domestic), 7-10kg (international). Checked baggage: 15-30kg (Economy), 25-35kg (Premium Economy), 30-40kg (Business). Excess charges apply. See Section 9 for complete policy.';
    } else {
        response = 'I can help you with questions about cancellations, refunds, name changes, baggage, and more. You can also use the search function or contact our support team at support@destinova.com for detailed assistance.';
    }
    
    this.addChatMessage(response, 'bot');
};

/* ============================================
   10. SCROLL ANIMATIONS
   ============================================ */
TermsApp.initScrollAnimations = function() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all section cards
    this.elements.sections.forEach(section => {
        const card = section.querySelector('.terms-section-card');
        if (card) {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(card);
        }
    });
};

/* ============================================
   11. PARTICLE SYSTEM
   ============================================ */
TermsApp.initParticleSystem = function() {
    if (!this.elements.particleSystem) return;
    
    const particleCount = 50;
    const particles = [];
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 4 + 2;
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const duration = Math.random() * 10 + 10;
        const delay = Math.random() * 5;
        
        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: rgba(255, 255, 255, 0.6);
            border-radius: 50%;
            left: ${x}%;
            top: ${y}%;
            animation: float ${duration}s ${delay}s infinite ease-in-out;
        `;
        
        this.elements.particleSystem.appendChild(particle);
        particles.push(particle);
    }
    
    // Add CSS animation
    if (!document.getElementById('particle-animation-style')) {
        const style = document.createElement('style');
        style.id = 'particle-animation-style';
        style.textContent = `
            @keyframes float {
                0%, 100% { transform: translate(0, 0); }
                25% { transform: translate(20px, -20px); }
                50% { transform: translate(-10px, 10px); }
                75% { transform: translate(15px, 5px); }
            }
        `;
        document.head.appendChild(style);
    }
};

/* ============================================
   12. PDF GENERATION
   ============================================ */
TermsApp.initPDFGeneration = function() {
    if (!this.elements.pdfBtn) return;
    
    this.elements.pdfBtn.addEventListener('click', () => {
        this.generatePDF();
    });
};

TermsApp.generatePDF = function() {
    // Show loading
    this.showLoading('Preparing your document...');
    
    // Check if jsPDF is available
    if (typeof window.jspdf === 'undefined') {
        console.error('jsPDF library not loaded');
        this.hideLoading();
        this.showNotification('PDF generation unavailable', 'error');
        return;
    }
    
    setTimeout(() => {
        try {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            
            // Add title
            doc.setFontSize(20);
            doc.setTextColor(29, 94, 51);
            doc.text('Destinova - Terms & Conditions', 20, 20);
            
            // Add date
            doc.setFontSize(12);
            doc.setTextColor(100, 100, 100);
            doc.text('Version 2.1 | November 10, 2025', 20, 30);
            
            // Add content (simplified for demo)
            doc.setFontSize(10);
            doc.setTextColor(0, 0, 0);
            let yPosition = 45;
            
            const content = [
                'This document contains the complete Terms and Conditions for using',
                'the Destinova flight booking platform. Please read carefully.',
                '',
                'For the full interactive version with all sections, please visit:',
                'https://destinova.com/terms-conditions',
                '',
                '© 2025 Destinova Airlines. All rights reserved.'
            ];
            
            content.forEach(line => {
                doc.text(line, 20, yPosition);
                yPosition += 7;
            });
            
            // Save
            doc.save('Destinova-Terms-Conditions.pdf');
            
            this.hideLoading();
            this.showNotification('PDF downloaded successfully!', 'success');
        } catch (error) {
            console.error('PDF generation error:', error);
            this.hideLoading();
            this.showNotification('Error generating PDF', 'error');
        }
    }, 1000);
};

/* ============================================
   13. PRINT FUNCTION
   ============================================ */
TermsApp.initPrintFunction = function() {
    if (!this.elements.printBtn) return;
    
    this.elements.printBtn.addEventListener('click', () => {
        window.print();
    });
};

/* ============================================
   14. TOOLTIPS
   ============================================ */
TermsApp.initTooltips = function() {
    // Add tooltips to legal terms
    const legalTerms = document.querySelectorAll('.legal-content strong');
    
    legalTerms.forEach(term => {
        term.style.cursor = 'help';
        term.style.borderBottom = '1px dotted var(--emerald-primary)';
        
        term.addEventListener('mouseenter', (e) => {
            this.showTooltip(e.target, this.getTermDefinition(term.textContent));
        });
        
        term.addEventListener('mouseleave', () => {
            this.hideTooltip();
        });
    });
};

TermsApp.getTermDefinition = function(term) {
    const definitions = {
        'PNR': 'Passenger Name Record - Your unique booking reference',
        'GDS': 'Global Distribution System - Network for booking travel',
        'MCT': 'Minimum Connection Time - Required layover duration',
        'SDR': 'Special Drawing Rights - International monetary unit'
    };
    
    return definitions[term] || 'Legal term - see glossary for details';
};

TermsApp.showTooltip = function(element, text) {
    this.hideTooltip(); // Remove existing
    
    const tooltip = document.createElement('div');
    tooltip.className = 'custom-tooltip';
    tooltip.textContent = text;
    tooltip.style.cssText = `
        position: absolute;
        background: var(--emerald-dark);
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 13px;
        z-index: 10000;
        max-width: 200px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        pointer-events: none;
    `;
    
    document.body.appendChild(tooltip);
    
    const rect = element.getBoundingClientRect();
    tooltip.style.left = `${rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2)}px`;
    tooltip.style.top = `${rect.top - tooltip.offsetHeight - 8}px`;
};

TermsApp.hideTooltip = function() {
    const existing = document.querySelector('.custom-tooltip');
    if (existing) {
        existing.remove();
    }
};

/* ============================================
   15. KEYBOARD SHORTCUTS
   ============================================ */
TermsApp.initKeyboardShortcuts = function() {
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + K: Focus search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            if (this.elements.tocSearch) {
                this.elements.tocSearch.focus();
            }
        }
        
        // Escape: Close modals
        if (e.key === 'Escape') {
            if (this.state.isSidebarOpen) {
                this.closeSidebar();
            }
            if (this.state.isChatbotOpen) {
                this.toggleChatbot();
            }
        }
        
        // Ctrl/Cmd + P: Print
        if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
            // Let browser handle this
        }
        
        // Ctrl/Cmd + +: Increase font
        if ((e.ctrlKey || e.metaKey) && e.key === '=') {
            e.preventDefault();
            this.changeFontSize(this.config.fontSizeStep);
        }
        
        // Ctrl/Cmd + -: Decrease font
        if ((e.ctrlKey || e.metaKey) && e.key === '-') {
            e.preventDefault();
            this.changeFontSize(-this.config.fontSizeStep);
        }
    });
};

/* ============================================
   16. PREFERENCES MANAGEMENT
   ============================================ */
TermsApp.savePreferences = function() {
    const prefs = {
        fontSize: this.state.currentFontSize,
        colorMode: this.state.colorMode,
        language: this.state.language
    };
    
    try {
        localStorage.setItem('destinova_terms_prefs', JSON.stringify(prefs));
    } catch (e) {
        console.error('Failed to save preferences:', e);
    }
};

TermsApp.loadPreferences = function() {
    try {
        const saved = localStorage.getItem('destinova_terms_prefs');
        if (saved) {
            const prefs = JSON.parse(saved);
            
            if (prefs.fontSize) {
                this.state.currentFontSize = prefs.fontSize;
                document.documentElement.style.fontSize = `${prefs.fontSize}px`;
            }
            
            if (prefs.colorMode) {
                this.state.colorMode = prefs.colorMode;
                this.changeColorMode(prefs.colorMode);
                if (this.elements.colorModeSelect) {
                    this.elements.colorModeSelect.value = prefs.colorMode;
                }
            }
            
            if (prefs.language) {
                this.state.language = prefs.language;
                if (this.elements.languageSelect) {
                    this.elements.languageSelect.value = prefs.language;
                }
            }
        }
    } catch (e) {
        console.error('Failed to load preferences:', e);
    }
};

/* ============================================
   17. NOTIFICATIONS
   ============================================ */
TermsApp.showNotification = function(message, type = 'info') {
    // Remove existing notification
    const existing = document.querySelector('.notification-toast');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = `notification-toast notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 100px;
        right: 20px;
        background: var(--emerald-primary);
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        max-width: 300px;
    `;
    
    if (type === 'error') {
        notification.style.background = 'var(--error-red)';
    } else if (type === 'success') {
        notification.style.background = 'var(--success-green)';
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
    
    // Add animation styles if not exists
    if (!document.getElementById('notification-animation-style')) {
        const style = document.createElement('style');
        style.id = 'notification-animation-style';
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(400px); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(400px); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
};

/* ============================================
   18. LOADING OVERLAY
   ============================================ */
TermsApp.showLoading = function(message = 'Loading...') {
    if (this.elements.loadingOverlay) {
        const messageEl = this.elements.loadingOverlay.querySelector('p');
        if (messageEl) messageEl.textContent = message;
        this.elements.loadingOverlay.classList.add('show');
    }
};

TermsApp.hideLoading = function() {
    if (this.elements.loadingOverlay) {
        this.elements.loadingOverlay.classList.remove('show');
    }
};

/* ============================================
   19. UTILITY FUNCTIONS
   ============================================ */
TermsApp.debounce = function(func, wait) {
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

TermsApp.throttle = function(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

/* ============================================
   20. ANALYTICS (Optional)
   ============================================ */
TermsApp.trackEvent = function(eventName, eventData = {}) {
    // Integrate with your analytics platform
    console.log('Analytics Event:', eventName, eventData);
    
    // Example: Google Analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, eventData);
    }
};

/* ============================================
   21. CONTACT SUPPORT HANDLER
   ============================================ */
if (document.getElementById('contactSupportBtn')) {
    document.getElementById('contactSupportBtn').addEventListener('click', () => {
        // Open email client
        window.location.href = 'mailto:support@destinova.com?subject=Terms%20%26%20Conditions%20Inquiry';
        
        TermsApp.trackEvent('contact_support_clicked', {
            source: 'terms_page'
        });
    });
}

/* ============================================
   22. ERROR HANDLING
   ============================================ */
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
    // Optionally send to error tracking service
});

/* ============================================
   23. PERFORMANCE MONITORING
   ============================================ */
window.addEventListener('load', () => {
    if ('performance' in window) {
        const perfData = window.performance.timing;
        const loadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`✅ Page loaded in ${loadTime}ms`);
        
        TermsApp.trackEvent('page_load_time', {
            load_time: loadTime
        });
    }
});

/* ============================================
   24. SERVICE WORKER (Optional - PWA)
   ============================================ */
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment to enable PWA features
        // navigator.serviceWorker.register('/sw.js')
        //     .then(reg => console.log('✅ Service Worker registered'))
        //     .catch(err => console.error('❌ Service Worker registration failed:', err));
    });
}

/* ============================================
   25. EXPORT FOR TESTING
   ============================================ */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TermsApp;
}

/* ============================================
   END OF JAVASCRIPT
   ============================================ */

console.log('📄 Destinova Terms & Conditions JS Loaded - Version 2.1');
