/* ═══════════════════════════════════════════════════════════════════════════════
   LUXURY HERO SECTION - JAVASCRIPT INTERACTIONS
   ═══════════════════════════════════════════════════════════════════════════════ */

(function() {
  'use strict';

  // Wait for DOM to be fully loaded
  document.addEventListener('DOMContentLoaded', function() {
    
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // TAB SWITCHING
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    const tabs = document.querySelectorAll('.luxury-tab');
    
    tabs.forEach(tab => {
      tab.addEventListener('click', function() {
        // Remove active class from all tabs
        tabs.forEach(t => t.classList.remove('luxury-tab-active'));
        
        // Add active class to clicked tab
        this.classList.add('luxury-tab-active');
        
        // Get tab type
        const tabType = this.dataset.tab;
        console.log('Switched to tab:', tabType);
        
        // Here you can add logic to show/hide different form fields based on tab
        // For example, show return date for round-trip, hide for one-way
      });
    });

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // LOCATION SWAP BUTTON
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    const swapBtn = document.querySelector('.luxury-swap-btn');
    const fromInput = document.getElementById('luxuryFrom');
    const toInput = document.getElementById('luxuryTo');
    
    if (swapBtn && fromInput && toInput) {
      swapBtn.addEventListener('click', function() {
        // Swap input values
        const temp = fromInput.value;
        fromInput.value = toInput.value;
        toInput.value = temp;
        
        // Add animation
        this.style.transform = 'rotate(180deg)';
        setTimeout(() => {
          this.style.transform = '';
        }, 300);
      });
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // DATE PICKER (Flatpickr Integration)
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    const dateInput = document.getElementById('luxuryDate');
    
    if (dateInput && typeof flatpickr !== 'undefined') {
      flatpickr(dateInput, {
        mode: 'range',
        minDate: 'today',
        dateFormat: 'M d, Y',
        defaultDate: [new Date(), new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)],
        theme: 'dark',
        disableMobile: false,
        onChange: function(selectedDates, dateStr, instance) {
          console.log('Selected dates:', dateStr);
        }
      });
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // TRAVELERS DROPDOWN (Simple Implementation)
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    const travelersInput = document.getElementById('luxuryTravelers');
    
    if (travelersInput) {
      travelersInput.addEventListener('click', function() {
        // Simple prompt for now - you can replace with a custom dropdown
        const travelers = prompt('Enter number of travelers:', '1');
        if (travelers && !isNaN(travelers) && travelers > 0) {
          this.value = travelers === '1' ? '1 Adult' : `${travelers} Adults`;
        }
      });
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // FORM SUBMISSION
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    const searchForm = document.getElementById('luxurySearchForm');
    
    if (searchForm) {
      searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const from = fromInput.value;
        const to = toInput.value;
        const date = dateInput.value;
        const travelers = travelersInput.value;
        
        // Basic validation
        if (!from || !to || !date || !travelers) {
          alert('Please fill in all fields');
          return;
        }
        
        // Log search parameters
        console.log('Search Parameters:', {
          from: from,
          to: to,
          date: date,
          travelers: travelers
        });
        
        // Here you would typically redirect to search results or make an API call
        alert(`Searching flights from ${from} to ${to}`);
      });
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // SMOOTH SCROLL FOR SCROLL DOWN BUTTON
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    const scrollDown = document.querySelector('.luxury-scroll-down');
    
    if (scrollDown) {
      scrollDown.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // PARALLAX EFFECT ON SCROLL
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    const heroSection = document.querySelector('.luxury-hero');
    const heroContent = document.querySelector('.luxury-hero-content');
    
    if (heroSection && heroContent) {
      window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const heroHeight = heroSection.offsetHeight;
        
        if (scrolled < heroHeight) {
          // Parallax effect
          heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
          heroContent.style.opacity = 1 - (scrolled / heroHeight);
        }
      });
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // INPUT FOCUS ANIMATIONS
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    const inputs = document.querySelectorAll('.luxury-input');
    
    inputs.forEach(input => {
      input.addEventListener('focus', function() {
        this.parentElement.style.transform = 'translateY(-2px)';
      });
      
      input.addEventListener('blur', function() {
        this.parentElement.style.transform = '';
      });
    });

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // LOADING STATE FOR BACKGROUND IMAGE
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    const bgImage = document.querySelector('.luxury-hero-bg-image');
    
    if (bgImage) {
      bgImage.addEventListener('load', function() {
        this.style.opacity = 1;
      });
    }

    console.log('✨ Luxury Hero Section initialized successfully!');
  });

})();
