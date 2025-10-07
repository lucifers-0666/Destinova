# Homepage CSS Quick Reference Guide

## 🎯 Quick Access to Key Components

### 1. Destinations Section
```html
<section class="home-destinations-section home-section">
    <div class="home-section-title">
        <h2>Popular Destinations</h2>
        <p>Discover amazing places...</p>
    </div>
    <div class="home-destinations-bento-grid">
        <div class="home-destination-card">
            <img src="..." alt="..." class="home-destination-img">
            <div class="destination-overlay">
                <div class="destination-info">
                    <h3>City Name</h3>
                    <p>Description</p>
                    <span class="destination-price">From $299</span>
                </div>
                <div class="destination-actions">
                    <a href="#" class="action-btn explore-btn">Explore</a>
                    <a href="#" class="action-btn book-btn">Book Now</a>
                </div>
            </div>
        </div>
    </div>
</section>
```

**Key Styles:**
- Grid: `grid-template-columns: repeat(auto-fit, minmax(280px, 1fr))`
- Card Aspect Ratio: `4/5` (desktop), `3/4` (mobile)
- Hover Effect: `translateY(-8px)` + shadow expansion
- Image Zoom: `scale(1.1)` on hover

---

### 2. Travel Classes Section
```html
<section class="home-flight-classes-section home-section">
    <div class="home-section-title">
        <h2>Choose Your Class</h2>
    </div>
    <div class="tab-buttons">
        <button class="tab-button active" data-tab="economy">Economy</button>
        <button class="tab-button" data-tab="business">Business</button>
        <button class="tab-button" data-tab="first">First Class</button>
    </div>
    <div class="tab-panel active" id="economy">
        <div class="class-card">
            <div class="class-icon">✈️</div>
            <h3>Economy Class</h3>
            <p>Comfortable and affordable...</p>
            <ul class="class-features">
                <li><i class="fas fa-check"></i> Feature 1</li>
            </ul>
        </div>
    </div>
</section>
```

**Key Styles:**
- Active Tab: `background: var(--primary-emerald); color: white`
- Tab Animation: `fadeIn 0.5s ease`
- Card Grid: `grid-template-columns: repeat(auto-fit, minmax(300px, 1fr))`
- Border Radius: `50px` (tabs), `16px` (cards)

---

### 3. Trust/Why Choose Us Section
```html
<section class="why-choose-us-section home-section">
    <div class="home-section-title">
        <h2>Why Choose Us</h2>
    </div>
    <div class="trust-checklist">
        <div class="trust-checklist-item">
            <div class="checklist-icon">
                <i class="fas fa-shield-alt"></i>
            </div>
            <div class="checklist-text">
                <h3>Secure Booking</h3>
                <p>Your data is protected...</p>
            </div>
        </div>
    </div>
</section>
```

**Key Styles:**
- Icon Size: `56px x 56px`
- Icon Background: `linear-gradient(135deg, var(--primary-emerald), #2a7f4a)`
- Hover Effect: `translateX(8px)`
- Grid: `repeat(auto-fit, minmax(280px, 1fr))`

---

### 4. Testimonials Section
```html
<section class="home-testimonials-section home-section">
    <div class="home-section-title">
        <h2>What Our Customers Say</h2>
    </div>
    <div class="testimonial-filters">
        <button class="filter-btn active" data-filter="all">All</button>
        <button class="filter-btn" data-filter="business">Business</button>
        <button class="filter-btn" data-filter="leisure">Leisure</button>
    </div>
    <div class="home-testimonial-slider-container">
        <div class="home-testimonial-card">
            <div class="testimonial-header">
                <img src="..." alt="..." class="testimonial-avatar">
                <div class="testimonial-author">
                    <h4>John Doe</h4>
                    <p>Business Traveler</p>
                </div>
            </div>
            <div class="testimonial-rating">
                ⭐⭐⭐⭐⭐
            </div>
            <p class="testimonial-text">"Amazing service..."</p>
        </div>
    </div>
</section>
```

**Key Styles:**
- Avatar: `64px` circle with gold border
- Filter Pills: `border-radius: 50px`
- Active Filter: `background: var(--primary-emerald)`
- Card Hover: `translateY(-4px)` + shadow

---

### 5. Partner Logos Section
```html
<section class="partners-section home-section">
    <div class="home-section-title">
        <h2>Our Partners</h2>
    </div>
    <div class="partner-logos">
        <img src="airline1.png" alt="Airline 1">
        <img src="airline2.png" alt="Airline 2">
        <!-- More logos -->
    </div>
</section>
```

**Key Styles:**
- Logo Height: `40px` (desktop), `30px` (mobile)
- Default: `grayscale(100%) opacity(0.5)`
- Hover: `grayscale(0%) opacity(1)` + `scale(1.1)`
- Grid: `repeat(6, 1fr)` on desktop

---

## 🎨 Color Palette Reference

```css
/* Primary Colors */
--primary-emerald: #1d5e33;     /* Main brand color */
--champagne-gold: #E5CBAF;      /* Accent color */
--background-cream: #FFFBF2;    /* Light background */

/* Text Colors */
--text-charcoal: #2D3748;       /* Headings */
--text-slate: #64748B;          /* Body text */
--white: #FFFFFF;               /* Pure white */

/* Gradients */
Emerald Gradient: linear-gradient(135deg, #1d5e33, #2a7f4a)
Dark Overlay: linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.3), transparent)
Hero Background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%)
```

---

## 📐 Spacing System

```css
/* Use these consistent spacing values */
Gap-Small:      12px
Gap-Medium:     16px, 20px, 24px
Gap-Large:      32px, 40px
Padding-Small:  20px, 24px
Padding-Medium: 32px, 40px
Padding-Large:  60px, 80px, 100px
```

---

## 🎭 Animation Reference

### Standard Transitions
```css
transition: all 0.3s ease;              /* Default */
transition: all 0.4s cubic-bezier(...); /* Smooth bounce */
transition: transform 0.6s ease;        /* Image zoom */
```

### Keyframe Animations
```css
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}

@keyframes slideInUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
}
```

### Hover Effects
```css
Card Lift:      transform: translateY(-8px)
Image Zoom:     transform: scale(1.1)
Slide Right:    transform: translateX(8px)
Button Scale:   transform: scale(1.05)
```

---

## 📱 Responsive Breakpoints

```css
/* Mobile First Approach */
Base:           320px - 767px     (Mobile)
Tablet:         768px - 991px     (2 columns)
Desktop:        992px - 1199px    (3 columns)
Large Desktop:  1200px+           (4 columns)
Extra Small:    < 375px           (Adjustments)
```

### Common Responsive Patterns
```css
/* Mobile */
.grid { grid-template-columns: 1fr; }

/* Tablet */
@media (min-width: 768px) {
    .grid { grid-template-columns: repeat(2, 1fr); }
}

/* Desktop */
@media (min-width: 992px) {
    .grid { grid-template-columns: repeat(3, 1fr); }
}

/* Large Desktop */
@media (min-width: 1200px) {
    .grid { grid-template-columns: repeat(4, 1fr); }
}
```

---

## 🎨 Shadow System

```css
/* Use these predefined shadows */
Light:      0 4px 12px rgba(0, 0, 0, 0.06)      /* Default cards */
Medium:     0 8px 24px rgba(0, 0, 0, 0.08)      /* Elevated cards */
Heavy:      0 12px 32px rgba(0, 0, 0, 0.12)     /* Hover states */
Premium:    0 16px 48px rgba(0, 0, 0, 0.18)     /* Top-level hover */
Button:     0 4px 15px rgba(29, 94, 51, 0.3)    /* Emerald buttons */
```

---

## 🔤 Typography System

```css
/* Font Sizes */
Extra Small:    12px, 13px         /* Labels, meta */
Small:          14px               /* Body, buttons */
Base:           16px, 18px         /* Main body, subheadings */
Medium:         20px, 24px         /* Card headings */
Large:          28px-42px          /* Section headings */
Hero:           48px-56px          /* Hero text */

/* Font Weights */
Normal:         400
Medium:         500
Semibold:       600
Bold:           700
Extra Bold:     800
```

---

## ♿ Accessibility Standards

### Touch Targets
```css
/* Minimum sizes for interactive elements */
Mobile:         44px x 44px (minimum)
Desktop:        40px x 40px (recommended)
Input Fields:   48px height (mobile)
```

### Focus States
```css
/* Always include visible focus states */
.interactive-element:focus {
    outline: 3px solid var(--champagne-gold);
    outline-offset: 2px;
}
```

### Reduced Motion
```css
/* Respect user preferences */
@media (prefers-reduced-motion: reduce) {
    * {
        animation-duration: 0.01ms !important;
        transition-duration: 0.01ms !important;
    }
}
```

---

## 🔧 Common Customizations

### Change Primary Color
```css
:root {
    --primary-emerald: #YOUR_COLOR;
}
```

### Adjust Section Spacing
```css
.home-section {
    padding: 80px 40px; /* Adjust as needed */
}

@media (max-width: 768px) {
    .home-section {
        padding: 60px 20px; /* Mobile adjustment */
    }
}
```

### Modify Animation Speed
```css
/* Find the element and adjust */
.element {
    transition: all 0.5s ease; /* Changed from 0.3s */
}
```

### Change Border Radius
```css
.card {
    border-radius: 20px; /* Changed from 16px */
}
```

---

## 🐛 Common Issues & Fixes

### Issue: Grid Not Responsive
```css
/* Ensure you're using auto-fit */
grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
/* NOT */
grid-template-columns: repeat(4, 1fr);
```

### Issue: Hover Not Working on Mobile
```css
/* Use both hover and active states */
.element:hover,
.element:active {
    transform: scale(1.05);
}
```

### Issue: Text Overflow
```css
/* Add these three lines */
white-space: nowrap;
overflow: hidden;
text-overflow: ellipsis;
```

### Issue: Images Not Loading
```css
/* Ensure object-fit is set */
img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
```

---

## 📦 File Structure

```
css/
├── index.css              # Main stylesheet (2645 lines)
└── index-enhanced.css     # Supplementary enhanced styles

Related Files:
├── html/index.html        # Homepage structure
└── js/index.js            # Interactive functionality
```

---

## 🚀 Performance Tips

1. **Use Transform Instead of Position**
   ```css
   /* Good */
   transform: translateY(-8px);
   
   /* Avoid */
   top: -8px;
   ```

2. **Optimize Images**
   - Use WebP format
   - Lazy load images
   - Responsive images with srcset

3. **Minimize Repaints**
   ```css
   /* Only animate transform and opacity */
   transition: transform 0.3s ease, opacity 0.3s ease;
   ```

4. **Use CSS Variables**
   ```css
   /* Define once, use everywhere */
   :root {
       --spacing-md: 24px;
   }
   
   .element {
       padding: var(--spacing-md);
   }
   ```

---

## 📞 Quick Support

### Need to Add a New Section?
1. Create section with `.home-section` class
2. Add `.home-section-title` for heading
3. Create your content structure
4. Add responsive styles at all breakpoints

### Need to Change Colors?
1. Update CSS variables in `:root`
2. Colors cascade automatically
3. Check contrast for accessibility

### Need to Fix Mobile Layout?
1. Check responsive breakpoints
2. Verify touch target sizes (44px minimum)
3. Test horizontal scrolling for tabs
4. Ensure single-column layouts work

---

*For detailed information, see HOMEPAGE_ENHANCEMENT_REPORT.md*
