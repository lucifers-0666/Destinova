// Floating search Bar Js Start here
    // Background Slider
    
    let slideIndex = 0;
    const slides = document.querySelectorAll('.bg-slide');
    
    function changeSlide() {
      slides[slideIndex].classList.remove('active');
      slideIndex = (slideIndex + 1) % slides.length;
      slides[slideIndex].classList.add('active');
    }
    
    setInterval(changeSlide, 6000);
    
    // Close Promo Banner - FIX CORNERS
    document.getElementById('closeBanner').addEventListener('click', function() {
      const promoBanner = document.getElementById('promoBanner');
      const searchCard = document.getElementById('searchCard');
      
      promoBanner.classList.add('hidden');
      searchCard.classList.add('promo-closed'); // Add class to round all corners
    });
    
    // Trip Tabs
    const tabs = document.querySelectorAll('.trip-tab');
    const indicator = document.querySelector('.trip-indicator');
    const returnBox = document.getElementById('returnBox');
    
    function updateIndicator(active) {
      indicator.style.width = `${active.offsetWidth}px`;
      indicator.style.height = `${active.offsetHeight}px`;
      indicator.style.left = `${active.offsetLeft}px`;
      indicator.style.top = `${active.offsetTop}px`;
    }
    
    updateIndicator(tabs[0]);
    
    tabs.forEach(tab => {
      tab.addEventListener('click', function() {
        tabs.forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        updateIndicator(this);
        
        if (this.getAttribute('data-type') === 'oneway') {
          returnBox.style.display = 'none';
        } else {
          returnBox.style.display = 'flex';
        }
      });
    });
    
    // Fare Chips
    document.querySelectorAll('.fare-chip-btn').forEach(chip => {
      chip.addEventListener('click', function() {
        document.querySelectorAll('.fare-chip-btn').forEach(c => c.classList.remove('active'));
        this.classList.add('active');
      });
    });
    
    // Dates
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('departInput').setAttribute('min', today);
    document.getElementById('returnInput').setAttribute('min', today);
    
    // Modal
    const modal = document.getElementById('passengersModal');
    const trigger = document.getElementById('passengersTrigger');
    const closeBtn = document.getElementById('modalClose');
    const doneBtn = document.getElementById('modalDone');
    
    let counts = { infants: 0, children: 0, adults: 1, seniors: 0 };
    let selectedClass = 'economy';
    
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      modal.removeAttribute('hidden');
    });
    
    closeBtn.addEventListener('click', () => modal.setAttribute('hidden', 'hidden'));
    modal.querySelector('.modal-backdrop').addEventListener('click', () => modal.setAttribute('hidden', 'hidden'));
    
    document.querySelectorAll('.counter-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const action = this.getAttribute('data-action');
        const cat = this.getAttribute('data-cat');
        const display = document.getElementById(`${cat}Count`);
        let val = parseInt(display.textContent);
        
        if (action === 'inc') {
          val++;
        } else if (action === 'dec' && val > 0) {
          if (cat === 'adults' && val === 1) return;
          val--;
        }
        
        display.textContent = val;
        counts[cat] = val;
      });
    });
    
    document.querySelectorAll('.class-card').forEach(card => {
      card.addEventListener('click', function() {
        document.querySelectorAll('.class-card').forEach(c => c.classList.remove('active'));
        this.classList.add('active');
        selectedClass = this.getAttribute('data-class');
      });
    });
    
    doneBtn.addEventListener('click', () => {
      const total = counts.infants + counts.children + counts.adults + counts.seniors;
      let text = '';
      
      if (total === 1 && counts.adults === 1) {
        text = '1 Adult';
      } else {
        const parts = [];
        if (counts.infants > 0) parts.push(`${counts.infants} Infant${counts.infants > 1 ? 's' : ''}`);
        if (counts.children > 0) parts.push(`${counts.children} Child${counts.children > 1 ? 'ren' : ''}`);
        if (counts.adults > 0) parts.push(`${counts.adults} Adult${counts.adults > 1 ? 's' : ''}`);
        if (counts.seniors > 0) parts.push(`${counts.seniors} Senior${counts.seniors > 1 ? 's' : ''}`);
        text = parts.join(', ');
      }
      
      const classes = {
        'economy': 'Economy',
        'premium': 'Premium',
        'business': 'Business',
        'first': 'First Class'
      };
      
      text += `, ${classes[selectedClass]}`;
      document.getElementById('passengersText').textContent = text;
      
      modal.setAttribute('hidden', 'hidden');
    });
    
    // Form
    document.getElementById('searchForm').addEventListener('submit', function(e) {
      e.preventDefault();
      alert('✈️ Searching flights...');
    });
  