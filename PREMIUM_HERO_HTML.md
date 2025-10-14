# 🎨 Premium Split Layout Hero - Complete HTML Structure

## Full HTML Implementation

```html
<!-- ═══════════════════════════════════════════════════════════════════════════════
     PREMIUM SPLIT LAYOUT HERO SECTION
     ═══════════════════════════════════════════════════════════════════════════════ -->
<section class="premium-hero-section" role="banner" id="hero-section">
  <!-- TOP SECTION - HERO VISUAL (60% height) -->
  <div class="hero-visual-section">
    <!-- Animated Gradient Background -->
    <div class="hero-gradient-bg"></div>
    
    <!-- Geometric Pattern Overlay -->
    <div class="hero-pattern-overlay"></div>
    
    <!-- Radial Gradient Overlay -->
    <div class="hero-radial-overlay"></div>
    
    <!-- Floating Particles -->
    <div class="floating-particles">
      <div class="particle"></div>
      <div class="particle"></div>
      <div class="particle"></div>
      <div class="particle"></div>
      <div class="particle"></div>
      <div class="particle"></div>
      <div class="particle"></div>
      <div class="particle"></div>
    </div>
    
    <!-- Light Rays -->
    <div class="light-rays"></div>
    
    <!-- Animated Airplane -->
    <div class="flying-airplane">
      <svg viewBox="0 0 100 100" class="airplane-icon">
        <path d="M50 30 L60 50 L50 45 L40 50 Z M50 45 L50 70" stroke="white" stroke-width="2" fill="white" opacity="0.6"/>
      </svg>
    </div>
    
    <!-- World Map Background -->
    <div class="world-map-bg"></div>
    
    <!-- Hero Content (Centered in top 50%) -->
    <div class="hero-content-container">
      <h1 class="premium-hero-headline" data-aos="fade-up" data-aos-delay="300">
        Your Journey Starts Here
      </h1>
      
      <p class="premium-hero-subheadline" data-aos="fade-up" data-aos-delay="500">
        Experience premium travel with Destinova. Discover exclusive destinations and book flights with world-class service.
      </p>
      
      <p class="premium-hero-secondary-text" data-aos="fade-up" data-aos-delay="700">
        Start your journey with exclusive offers and unparalleled service.
      </p>
      
      <!-- CTA Buttons -->
      <div class="hero-cta-buttons" data-aos="fade-up" data-aos-delay="900">
        <button class="cta-primary-btn">
          <i class="fas fa-plane"></i>
          <span>BOOK YOUR FLIGHT</span>
        </button>
        <button class="cta-secondary-btn">
          <i class="fas fa-globe-americas"></i>
          <span>EXPLORE DESTINATIONS</span>
        </button>
      </div>
      
      <!-- Promo Banner -->
      <div class="promo-banner" data-aos="fade-up" data-aos-delay="1100">
        <span class="promo-icon">💚</span>
        <span class="promo-text">Use code 'FLY25' for 15% off your next booking!</span>
        <span class="promo-divider">|</span>
        <a href="#offers" class="promo-link">View All Offers</a>
      </div>
    </div>
  </div>
  
  <!-- BOTTOM SECTION - FLIGHT SEARCH WIDGET (Overlapping 40%) -->
  <div class="premium-search-widget-container" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="1200">
    <div class="premium-search-widget">
      
      <!-- Tab Navigation + Recent Searches -->
      <div class="widget-header">
        <div class="widget-tabs">
          <button class="widget-tab active" data-trip="one-way">
            <span class="tab-radio"></span>
            <span class="tab-label">One Way</span>
          </button>
          <button class="widget-tab" data-trip="round-trip">
            <span class="tab-radio"></span>
            <span class="tab-label">Round Trip</span>
          </button>
          <button class="widget-tab" data-trip="multi-city">
            <span class="tab-radio"></span>
            <span class="tab-label">Multi-City</span>
          </button>
        </div>
        
        <a href="#recent" class="recent-searches-link">
          <i class="fas fa-clock"></i>
          <span>Recent Searches</span>
        </a>
      </div>
      
      <!-- Search Form -->
      <form class="premium-search-form" id="premiumSearchForm">
        
        <!-- ROW 1 - LOCATION & DATE INPUTS -->
        <div class="search-row-location-date">
          <!-- FROM -->
          <div class="premium-input-group">
            <label class="premium-label">FROM</label>
            <div class="premium-input-container">
              <i class="fas fa-plane-departure input-icon-emerald"></i>
              <div class="input-content">
                <input type="text" class="premium-input" placeholder="e.g., Delhi" id="premiumFrom" />
                <span class="input-subtext">Indira Gandhi International Airport</span>
              </div>
            </div>
          </div>
          
          <!-- SWAP BUTTON -->
          <button type="button" class="premium-swap-btn" id="premiumSwapBtn">
            <i class="fas fa-exchange-alt"></i>
          </button>
          
          <!-- TO -->
          <div class="premium-input-group">
            <label class="premium-label">TO</label>
            <div class="premium-input-container">
              <i class="fas fa-plane-arrival input-icon-emerald"></i>
              <div class="input-content">
                <input type="text" class="premium-input" placeholder="e.g., Mumbai" id="premiumTo" />
                <span class="input-subtext">Chhatrapati Shivaji Maharaj International Airport</span>
              </div>
            </div>
          </div>
          
          <!-- DEPARTURE DATE -->
          <div class="premium-input-group">
            <label class="premium-label">DEPARTURE</label>
            <div class="premium-input-container">
              <i class="fas fa-calendar input-icon-emerald"></i>
              <div class="input-content">
                <input type="text" class="premium-input" placeholder="mm/dd/yyyy" id="premiumDepartDate" />
                <span class="input-subtext">Select date</span>
              </div>
            </div>
          </div>
          
          <!-- RETURN DATE -->
          <div class="premium-input-group" id="premiumReturnGroup">
            <label class="premium-label">RETURN</label>
            <div class="premium-input-container">
              <i class="fas fa-calendar input-icon-emerald"></i>
              <div class="input-content">
                <input type="text" class="premium-input" placeholder="mm/dd/yyyy" id="premiumReturnDate" />
                <span class="input-subtext">Select date</span>
              </div>
            </div>
          </div>
          
          <!-- TRAVELERS & CLASS -->
          <div class="premium-input-group">
            <label class="premium-label">TRAVELERS & CLASS</label>
            <div class="premium-input-container clickable" id="premiumTravelersBtn">
              <i class="fas fa-user-friends input-icon-emerald"></i>
              <div class="input-content">
                <span class="premium-input-display">1 Adult, Economy</span>
                <span class="input-subtext">Click to change</span>
              </div>
              <i class="fas fa-chevron-down chevron-icon"></i>
            </div>
            
            <!-- Travelers Dropdown Modal -->
            <div class="travelers-modal" id="premiumTravelersModal">
              <div class="travelers-content">
                <!-- Adults -->
                <div class="traveler-counter-row">
                  <div class="traveler-info">
                    <span class="traveler-name">Adults</span>
                    <span class="traveler-age">12+ years</span>
                  </div>
                  <div class="counter-group">
                    <button type="button" class="counter-minus" data-target="premium-adults">
                      <i class="fas fa-minus"></i>
                    </button>
                    <span class="counter-display" id="premiumAdultsCount">1</span>
                    <button type="button" class="counter-plus" data-target="premium-adults">
                      <i class="fas fa-plus"></i>
                    </button>
                  </div>
                </div>
                
                <!-- Children -->
                <div class="traveler-counter-row">
                  <div class="traveler-info">
                    <span class="traveler-name">Children</span>
                    <span class="traveler-age">2-11 years</span>
                  </div>
                  <div class="counter-group">
                    <button type="button" class="counter-minus" data-target="premium-children">
                      <i class="fas fa-minus"></i>
                    </button>
                    <span class="counter-display" id="premiumChildrenCount">0</span>
                    <button type="button" class="counter-plus" data-target="premium-children">
                      <i class="fas fa-plus"></i>
                    </button>
                  </div>
                </div>
                
                <!-- Infants -->
                <div class="traveler-counter-row">
                  <div class="traveler-info">
                    <span class="traveler-name">Infants</span>
                    <span class="traveler-age">Under 2 years</span>
                  </div>
                  <div class="counter-group">
                    <button type="button" class="counter-minus" data-target="premium-infants">
                      <i class="fas fa-minus"></i>
                    </button>
                    <span class="counter-display" id="premiumInfantsCount">0</span>
                    <button type="button" class="counter-plus" data-target="premium-infants">
                      <i class="fas fa-plus"></i>
                    </button>
                  </div>
                </div>
                
                <!-- Class Selection -->
                <div class="class-selection-section">
                  <label class="class-selection-label">Class</label>
                  <div class="class-radio-group">
                    <label class="class-radio-option">
                      <input type="radio" name="travelClass" value="economy" checked />
                      <span class="radio-custom"></span>
                      <span class="radio-label">Economy</span>
                    </label>
                    <label class="class-radio-option">
                      <input type="radio" name="travelClass" value="premium" />
                      <span class="radio-custom"></span>
                      <span class="radio-label">Premium Economy</span>
                    </label>
                    <label class="class-radio-option">
                      <input type="radio" name="travelClass" value="business" />
                      <span class="radio-custom"></span>
                      <span class="radio-label">Business</span>
                    </label>
                    <label class="class-radio-option">
                      <input type="radio" name="travelClass" value="first" />
                      <span class="radio-custom"></span>
                      <span class="radio-label">First Class</span>
                    </label>
                  </div>
                </div>
                
                <button type="button" class="travelers-done-btn" id="premiumTravelersDone">Done</button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- ROW 2 - FARE TYPE SELECTION -->
        <div class="search-row-fare-type">
          <label class="fare-type-label">Select a fare type:</label>
          <div class="fare-chips-container">
            <button type="button" class="fare-chip active" data-fare="regular">
              <i class="fas fa-user"></i>
              <span>Regular</span>
            </button>
            <button type="button" class="fare-chip" data-fare="student">
              <i class="fas fa-graduation-cap"></i>
              <span>Student</span>
            </button>
            <button type="button" class="fare-chip" data-fare="senior">
              <i class="fas fa-walking-cane"></i>
              <span>Senior Citizen</span>
              <i class="fas fa-info-circle info-icon" title="For passengers 60+ years"></i>
            </button>
            <button type="button" class="fare-chip" data-fare="military">
              <i class="fas fa-shield-alt"></i>
              <span>Armed Forces</span>
              <i class="fas fa-info-circle info-icon" title="For military personnel"></i>
            </button>
            <button type="button" class="fare-chip" data-fare="corporate">
              <i class="fas fa-briefcase"></i>
              <span>Corporate</span>
              <i class="fas fa-info-circle info-icon" title="For business travelers"></i>
            </button>
          </div>
        </div>
        
        <!-- ROW 3 - ADDITIONAL OPTIONS -->
        <div class="search-row-options">
          <label class="premium-checkbox">
            <input type="checkbox" id="directFlightsOnly" />
            <span class="checkbox-custom-emerald"></span>
            <span class="checkbox-label-text">Direct flights only</span>
          </label>
          
          <label class="premium-checkbox">
            <input type="checkbox" id="nearbyAirports" />
            <span class="checkbox-custom-emerald"></span>
            <span class="checkbox-label-text">Search nearby airports</span>
          </label>
          
          <label class="premium-checkbox">
            <input type="checkbox" id="flexibleDatesOption" />
            <span class="checkbox-custom-emerald"></span>
            <span class="checkbox-label-text">Flexible Dates (±3 days)</span>
            <i class="fas fa-info-circle info-icon" title="Search ±3 days from selected dates"></i>
          </label>
        </div>
        
        <!-- ROW 4 - SEARCH BUTTON -->
        <div class="search-row-submit">
          <button type="submit" class="premium-search-btn" id="premiumSearchBtn">
            <span class="btn-text-content">
              <i class="fas fa-search"></i>
              <span>SEARCH</span>
            </span>
            <span class="btn-loader-content" style="display: none;">
              <i class="fas fa-spinner fa-spin"></i>
              <span>Searching flights...</span>
            </span>
          </button>
          
          <!-- Currency Selector -->
          <div class="currency-selector">
            <button type="button" class="currency-btn">
              <span class="currency-flag">🇮🇳</span>
              <span class="currency-code">INR ₹</span>
              <i class="fas fa-chevron-down"></i>
            </button>
          </div>
        </div>
        
      </form>
    </div>
  </div>
</section>
```

## Status
✅ HTML structure created with all components
⏳ CSS styling needs to be added
⏳ JavaScript interactions need to be implemented

See PREMIUM_HERO_CSS.md for complete styling.
