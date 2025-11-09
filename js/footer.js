// ===============================================
//  LUXURY FOOTER - NEXT-GENERATION INTERACTIONS
// ===============================================

class LuxuryFooter {
  constructor() {
    this.footer = document.getElementById('luxuryFooter');
    if (!this.footer) return;
    
    this.scrollToTopBtn = document.getElementById('scrollToTop');
    this.newsletterForm = document.getElementById('newsletterForm');
    this.liveChatBtn = document.getElementById('liveChatBtn');
    this.contactItems = document.querySelectorAll('.contact-item[data-copy]');
    this.logoContainer = document.querySelector('.brand-logo-container');
    this.flightsBookedCounter = document.getElementById('flightsBooked');
    
    this.scrollProgress = 0;
    this.logoClickCount = 0;
    this.konamiCode = [];
    this.konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    
    this.init();
  }
  
  init() {
    this.initScrollToTop();
    this.initNewsletter();
    this.initParallax();
    this.initContactCopy();
    this.initEasterEggs();
    this.initMobileAccordion();
    this.initSocialMagnetic();
    this.initLiveStats();
    this.initAnimatedPlaceholder();
    this.observeFooterEntrance();
    
    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.disableAnimations();
    }
  }
  
  // ━━━ SCROLL TO TOP BUTTON ━━━
  initScrollToTop() {
    if (!this.scrollToTopBtn) return;
    
    const progressCircle = this.scrollToTopBtn.querySelector('.progress-ring-circle');
    const radius = progressCircle.r.baseVal.value;
    const circumference = radius * 2 * Math.PI;
    
    progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
    progressCircle.style.strokeDashoffset = circumference;
    
    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      this.scrollProgress = (scrollTop / scrollHeight) * 100;
      
      // Show/hide button
      if (scrollTop > 500) {
        this.scrollToTopBtn.classList.add('show');
      } else {
        this.scrollToTopBtn.classList.remove('show');
      }
      
      // Update progress ring
      const offset = circumference - (this.scrollProgress / 100) * circumference;
      progressCircle.style.strokeDashoffset = offset;
    });
    
    // Smooth scroll to top
    this.scrollToTopBtn.addEventListener('click', () => {
      this.createParticleTrail();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
  
  // ━━━ NEWSLETTER FORM ━━━
  initNewsletter() {
    if (!this.newsletterForm) return;
    
    const input = this.newsletterForm.querySelector('.newsletter-input');
    const button = this.newsletterForm.querySelector('.newsletter-btn');
    const successMsg = document.getElementById('newsletterSuccess');
    
    this.newsletterForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const email = input.value.trim();
      if (!this.validateEmail(email)) {
        this.showError(input, 'Please enter a valid email');
        return;
      }
      
      // Loading state
      button.disabled = true;
      button.innerHTML = '<span class="btn-text">Subscribing...</span><i class="fas fa-spinner fa-spin btn-icon"></i>';
      
      // Simulate API call
      await this.delay(1500);
      
      // Success state
      input.style.display = 'none';
      button.style.display = 'none';
      successMsg.classList.add('show');
      this.createConfetti();
      
      // Save to localStorage
      localStorage.setItem('newsletter_subscribed', email);
      
      // Reset after 5 seconds
      setTimeout(() => {
        input.style.display = '';
        button.style.display = '';
        successMsg.classList.remove('show');
        button.disabled = false;
        button.innerHTML = '<span class="btn-text">Subscribe</span><i class="fas fa-paper-plane btn-icon"></i>';
        input.value = '';
      }, 5000);
    });
    
    // Input ripple effect
    input.addEventListener('input', (e) => {
      this.createInputRipple(e.target);
    });
  }
  
  validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
  
  showError(input, message) {
    input.style.borderColor = '#ff4444';
    input.style.animation = 'shake 0.5s ease-in-out';
    
    setTimeout(() => {
      input.style.borderColor = '';
      input.style.animation = '';
    }, 500);
  }
  
  createConfetti() {
    const colors = ['#c9a877', '#d4b989', '#2a7d4a', '#ffffff'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement('div');
      confetti.style.position = 'fixed';
      confetti.style.width = '10px';
      confetti.style.height = '10px';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.left = `${Math.random() * 100}%`;
      confetti.style.top = '-10px';
      confetti.style.opacity = '1';
      confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
      confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
      confetti.style.zIndex = '9999';
      confetti.style.pointerEvents = 'none';
      
      document.body.appendChild(confetti);
      
      const duration = 2000 + Math.random() * 1000;
      const targetX = (Math.random() - 0.5) * 200;
      const targetY = window.innerHeight + 20;
      
      confetti.animate([
        { transform: `translate(0, 0) rotate(0deg)`, opacity: 1 },
        { transform: `translate(${targetX}px, ${targetY}px) rotate(${Math.random() * 720}deg)`, opacity: 0 }
      ], {
        duration: duration,
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
      }).onfinish = () => confetti.remove();
    }
  }
  
  createInputRipple(input) {
    // Subtle ripple effect when typing
    input.style.boxShadow = '0 0 0 4px rgba(201, 168, 119, 0.1)';
    setTimeout(() => {
      input.style.boxShadow = '';
    }, 300);
  }
  
  // ━━━ PARALLAX EFFECTS ━━━
  initParallax() {
    const pattern = document.querySelector('.footer-bg-pattern');
    const columns = document.querySelectorAll('.footer-column');
    
    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;
    
    this.footer.addEventListener('mousemove', (e) => {
      const rect = this.footer.getBoundingClientRect();
      mouseX = (e.clientX - rect.left) / rect.width - 0.5;
      mouseY = (e.clientY - rect.top) / rect.height - 0.5;
    });
    
    const animate = () => {
      currentX += (mouseX - currentX) * 0.1;
      currentY += (mouseY - currentY) * 0.1;
      
      if (pattern) {
        pattern.style.transform = `translate(${currentX * 20}px, ${currentY * 20}px)`;
      }
      
      columns.forEach((column, index) => {
        const depth = (index + 1) * 5;
        column.style.transform = `translateZ(${depth}px) translate(${currentX * depth}px, ${currentY * depth}px)`;
      });
      
      requestAnimationFrame(animate);
    };
    
    animate();
  }
  
  // ━━━ CONTACT COPY TO CLIPBOARD ━━━
  initContactCopy() {
    this.contactItems.forEach(item => {
      item.addEventListener('click', () => {
        const textToCopy = item.getAttribute('data-copy');
        
        if (navigator.clipboard) {
          navigator.clipboard.writeText(textToCopy).then(() => {
            this.showCopyFeedback(item);
          });
        } else {
          // Fallback
          const textarea = document.createElement('textarea');
          textarea.value = textToCopy;
          textarea.style.position = 'fixed';
          textarea.style.opacity = '0';
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
          this.showCopyFeedback(item);
        }
      });
    });
  }
  
  showCopyFeedback(item) {
    const originalBg = item.style.background;
    item.style.background = 'rgba(46, 204, 113, 0.3)';
    
    const feedback = document.createElement('div');
    feedback.textContent = 'Copied!';
    feedback.style.position = 'absolute';
    feedback.style.top = '-30px';
    feedback.style.left = '50%';
    feedback.style.transform = 'translateX(-50%)';
    feedback.style.background = '#2ecc71';
    feedback.style.color = 'white';
    feedback.style.padding = '0.5rem 1rem';
    feedback.style.borderRadius = '8px';
    feedback.style.fontSize = '0.85rem';
    feedback.style.fontWeight = '600';
    feedback.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
    feedback.style.zIndex = '1000';
    feedback.style.animation = 'feedbackSlideIn 0.3s ease';
    
    item.style.position = 'relative';
    item.appendChild(feedback);
    
    setTimeout(() => {
      feedback.style.animation = 'feedbackSlideOut 0.3s ease';
      setTimeout(() => {
        feedback.remove();
        item.style.background = originalBg;
      }, 300);
    }, 2000);
  }
  
  // ━━━ EASTER EGGS ━━━
  initEasterEggs() {
    // Logo click counter
    if (this.logoContainer) {
      this.logoContainer.addEventListener('click', () => {
        this.logoClickCount++;
        
        if (this.logoClickCount === 5) {
          this.activateSecretAnimation();
          this.logoClickCount = 0;
        }
      });
    }
    
    // Konami code
    document.addEventListener('keydown', (e) => {
      this.konamiCode.push(e.key);
      this.konamiCode = this.konamiCode.slice(-10);
      
      if (this.konamiCode.join(',') === this.konamiSequence.join(',')) {
        this.activateRetroTheme();
      }
    });
  }
  
  activateSecretAnimation() {
    const logo = this.logoContainer.querySelector('.brand-logo');
    logo.style.animation = 'logoSpecial 2s ease-in-out';
    
    setTimeout(() => {
      logo.style.animation = '';
    }, 2000);
    
    // Add sparkles
    for (let i = 0; i < 20; i++) {
      this.createSparkle(this.logoContainer);
    }
  }
  
  createSparkle(container) {
    const sparkle = document.createElement('div');
    sparkle.innerHTML = '✨';
    sparkle.style.position = 'absolute';
    sparkle.style.left = `${Math.random() * 100}%`;
    sparkle.style.top = `${Math.random() * 100}%`;
    sparkle.style.fontSize = '1.5rem';
    sparkle.style.pointerEvents = 'none';
    sparkle.style.zIndex = '1000';
    
    container.appendChild(sparkle);
    
    sparkle.animate([
      { opacity: 0, transform: 'scale(0) translateY(0)' },
      { opacity: 1, transform: 'scale(1.5) translateY(-50px)' },
      { opacity: 0, transform: 'scale(0) translateY(-100px)' }
    ], {
      duration: 1500,
      easing: 'ease-out'
    }).onfinish = () => sparkle.remove();
  }
  
  activateRetroTheme() {
    this.footer.style.filter = 'hue-rotate(180deg) saturate(2)';
    this.footer.style.animation = 'retroPulse 0.5s ease-in-out 5';
    
    setTimeout(() => {
      this.footer.style.filter = '';
      this.footer.style.animation = '';
    }, 3000);
  }
  
  // ━━━ MOBILE ACCORDION ━━━
  initMobileAccordion() {
    if (window.innerWidth > 768) return;
    
    const columns = document.querySelectorAll('.footer-column');
    
    columns.forEach(column => {
      const header = column.querySelector('.column-header');
      const links = column.querySelector('.footer-links');
      
      // Initially collapse all
      column.classList.add('collapsed');
      
      header.addEventListener('click', () => {
        const isExpanded = column.classList.contains('expanded');
        
        // Collapse all others
        columns.forEach(col => {
          col.classList.remove('expanded');
          col.classList.add('collapsed');
        });
        
        // Toggle current
        if (!isExpanded) {
          column.classList.remove('collapsed');
          column.classList.add('expanded');
        }
      });
    });
  }
  
  // ━━━ SOCIAL MAGNETIC EFFECT ━━━
  initSocialMagnetic() {
    const socialIcons = document.querySelectorAll('.social-icon');
    
    socialIcons.forEach(icon => {
      icon.addEventListener('mouseenter', function() {
        const siblings = Array.from(this.parentElement.children);
        siblings.forEach(sibling => {
          if (sibling !== this) {
            sibling.style.transform = 'scale(0.9)';
            sibling.style.opacity = '0.6';
          }
        });
      });
      
      icon.addEventListener('mouseleave', function() {
        const siblings = Array.from(this.parentElement.children);
        siblings.forEach(sibling => {
          sibling.style.transform = '';
          sibling.style.opacity = '';
        });
      });
    });
  }
  
  // ━━━ LIVE STATS COUNTER ━━━
  initLiveStats() {
    if (!this.flightsBookedCounter) return;
    
    let count = parseInt(this.flightsBookedCounter.textContent);
    
    setInterval(() => {
      // Randomly increase count (simulate live bookings)
      if (Math.random() > 0.7) {
        count += 1;
        this.animateCounter(this.flightsBookedCounter, count);
      }
    }, 5000);
  }
  
  animateCounter(element, newValue) {
    const oldValue = parseInt(element.textContent);
    const duration = 500;
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const current = Math.floor(oldValue + (newValue - oldValue) * progress);
      
      element.textContent = current;
      element.style.transform = 'scale(1.2)';
      element.style.color = '#c9a877';
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setTimeout(() => {
          element.style.transform = '';
          element.style.color = '';
        }, 200);
      }
    };
    
    animate();
  }
  
  // ━━━ ANIMATED PLACEHOLDER ━━━
  initAnimatedPlaceholder() {
    const input = document.querySelector('.newsletter-input');
    if (!input) return;
    
    const placeholders = [
      'your@email.com',
      'john@example.com',
      'sarah@gmail.com',
      'traveler@outlook.com',
      'explorer@yahoo.com'
    ];
    
    let currentIndex = 0;
    
    setInterval(() => {
      if (document.activeElement !== input && input.value === '') {
        currentIndex = (currentIndex + 1) % placeholders.length;
        input.placeholder = placeholders[currentIndex];
      }
    }, 3000);
  }
  
  // ━━━ FOOTER ENTRANCE ANIMATION ━━━
  observeFooterEntrance() {
    const options = {
      threshold: 0.1,
      rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.footer.classList.add('footer-visible');
          this.animateColumns();
        }
      });
    }, options);
    
    observer.observe(this.footer);
  }
  
  animateColumns() {
    const columns = document.querySelectorAll('.footer-column');
    const links = document.querySelectorAll('.footer-links a');
    
    columns.forEach((column, index) => {
      setTimeout(() => {
        column.style.animation = 'columnSlideUp 0.6s ease forwards';
      }, index * 150);
    });
    
    links.forEach((link, index) => {
      setTimeout(() => {
        link.style.animation = 'linkFadeIn 0.4s ease forwards';
      }, index * 30);
    });
  }
  
  // ━━━ PARTICLE TRAIL ━━━
  createParticleTrail() {
    const particles = [];
    const particleCount = 20;
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.style.position = 'fixed';
      particle.style.width = '6px';
      particle.style.height = '6px';
      particle.style.background = '#c9a877';
      particle.style.borderRadius = '50%';
      particle.style.bottom = '2rem';
      particle.style.right = '2rem';
      particle.style.zIndex = '999';
      particle.style.pointerEvents = 'none';
      
      document.body.appendChild(particle);
      particles.push(particle);
      
      const angle = (i / particleCount) * Math.PI * 2;
      const velocity = 5 + Math.random() * 5;
      const vx = Math.cos(angle) * velocity;
      const vy = Math.sin(angle) * velocity;
      
      particle.animate([
        { transform: 'translate(0, 0) scale(1)', opacity: 1 },
        { transform: `translate(${vx * 20}px, ${vy * 20}px) scale(0)`, opacity: 0 }
      ], {
        duration: 600,
        easing: 'ease-out'
      }).onfinish = () => particle.remove();
    }
  }
  
  // ━━━ DISABLE ANIMATIONS ━━━
  disableAnimations() {
    const style = document.createElement('style');
    style.innerHTML = `
      .luxury-footer * {
        animation: none !important;
        transition: none !important;
      }
    `;
    document.head.appendChild(style);
  }
  
  // ━━━ UTILITY FUNCTIONS ━━━
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  ADDITIONAL ANIMATIONS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// Add dynamic keyframes for special animations
const style = document.createElement('style');
style.innerHTML = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-10px); }
    75% { transform: translateX(10px); }
  }
  
  @keyframes feedbackSlideIn {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }
  
  @keyframes feedbackSlideOut {
    from {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
    to {
      opacity: 0;
      transform: translateX(-50%) translateY(-10px);
    }
  }
  
  @keyframes logoSpecial {
    0%, 100% { transform: scale(1) rotate(0deg); }
    25% { transform: scale(1.2) rotate(-10deg); }
    50% { transform: scale(0.9) rotate(10deg); }
    75% { transform: scale(1.1) rotate(-5deg); }
  }
  
  @keyframes retroPulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.02); }
  }
  
  @keyframes columnSlideUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes linkFadeIn {
    from {
      opacity: 0;
      transform: translateX(-10px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;
document.head.appendChild(style);

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new LuxuryFooter();
  });
} else {
  new LuxuryFooter();
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  LIVE CHAT WIDGET (MOCK)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

document.getElementById('liveChatBtn')?.addEventListener('click', function() {
  // Mock live chat - would integrate with actual chat service
  const chatWindow = document.createElement('div');
  chatWindow.innerHTML = `
    <div style="
      position: fixed;
      bottom: 100px;
      right: 2rem;
      width: 350px;
      max-width: calc(100vw - 4rem);
      background: white;
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      z-index: 9999;
      animation: chatSlideIn 0.3s ease;
    ">
      <div style="background: linear-gradient(135deg, #c9a877, #d4b989); padding: 1.5rem; border-radius: 16px 16px 0 0; color: #164426;">
        <h3 style="margin: 0; font-size: 1.2rem; font-weight: 600;">Live Chat Support</h3>
        <p style="margin: 0.5rem 0 0 0; font-size: 0.85rem; opacity: 0.9;">We're here to help! 24/7</p>
      </div>
      <div style="padding: 1.5rem;">
        <p style="color: #4a4a4a; margin-bottom: 1rem;">Hello! 👋 How can we assist you today?</p>
        <button onclick="this.closest('div').closest('div').remove()" style="
          width: 100%;
          padding: 0.75rem;
          background: linear-gradient(135deg, #c9a877, #d4b989);
          border: none;
          border-radius: 8px;
          color: #164426;
          font-weight: 600;
          cursor: pointer;
        ">Start Chat</button>
      </div>
    </div>
  `;
  
  const chatStyle = document.createElement('style');
  chatStyle.innerHTML = `
    @keyframes chatSlideIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;
  document.head.appendChild(chatStyle);
  document.body.appendChild(chatWindow);
  
  setTimeout(() => {
    chatWindow.remove();
  }, 10000);
});

console.log('🎉 Luxury Footer Initialized - Destinova');
