# Visual Layout Guide - Header/Hero Spacing

## Layout Structure

```
┌────────────────────────────────────────────────────────────┐
│                    BROWSER VIEWPORT                         │
│                                                             │
│  ┌────────────────────────────────────────────────────┐   │
│  │  HEADER (Fixed, z-index: 1000)                     │   │
│  │  Height: 80px                                      │   │
│  │  Background: Emerald (transparent) / White (scrolled) │
│  │  ├─ Logo: Destinova                               │   │
│  │  ├─ Nav: Home, Book, Destinations, Explore       │   │
│  │  └─ Actions: Search, Currency, Sign In           │   │
│  └────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌────────────────────────────────────────────────────┐   │
│  │  PROMO BANNER (Fixed, z-index: 999)               │   │
│  │  Top: 80px (directly below header)                │   │
│  │  Height: 55px                                      │   │
│  │  "Use code FLY15 for 15% off"                     │   │
│  └────────────────────────────────────────────────────┘   │
│                                                             │
│  ╔════════════════════════════════════════════════════╗   │
│  ║  HERO SECTION (Relative, z-index: 1)              ║   │
│  ║  Padding-top: 145px (90px without promo)           ║   │
│  ║                                                    ║   │
│  ║  ┌──────────────────────────────────────────────┐ ║   │
│  ║  │  Background Layers:                          │ ║   │
│  ║  │  1. Image (airplane wing/clouds)             │ ║   │
│  ║  │  2. Gradient overlay (emerald)               │ ║   │
│  ║  │  3. Animated particles                       │ ║   │
│  ║  │  4. Decorative circles                       │ ║   │
│  ║  └──────────────────────────────────────────────┘ ║   │
│  ║                                                    ║   │
│  ║  ┌──────────────────────────────────────────────┐ ║   │
│  ║  │  Content Container                           │ ║   │
│  ║  │                                              │ ║   │
│  ║  │  Eyebrow Text:                               │ ║   │
│  ║  │  DISCOVER • EXPLORE • EXPERIENCE             │ ║   │
│  ║  │                                              │ ║   │
│  ║  │  Headline:                                   │ ║   │
│  ║  │  Book Your [Perfect Flight]                  │ ║   │
│  ║  │  At Unbeatable Prices                        │ ║   │
│  ║  │                                              │ ║   │
│  ║  │  Subheadline:                                │ ║   │
│  ║  │  Book flights to 500+ destinations...        │ ║   │
│  ║  │                                              │ ║   │
│  ║  │  Trust Indicators:                           │ ║   │
│  ║  │  [2M+ Travelers] [500+ Destinations] [4.8⭐] │ ║   │
│  ║  │                                              │ ║   │
│  ║  │  ┌────────────────────────────────────────┐ │ ║   │
│  ║  │  │  SEARCH FORM                           │ │ ║   │
│  ║  │  │  ┌──────┬──────┬──────┬──────┬──────┐ │ │ ║   │
│  ║  │  │  │ FROM │  TO  │DATES │TRVL │SEARCH│ │ │ ║   │
│  ║  │  │  └──────┴──────┴──────┴──────┴──────┘ │ │ ║   │
│  ║  │  │  Quick Filters: ☐ Direct ☐ Nearby    │ │ ║   │
│  ║  │  │  Popular: NYC→LON | PAR→TOK | ...    │ │ ║   │
│  ║  │  └────────────────────────────────────────┘ │ ║   │
│  ║  │                                              │ ║   │
│  ║  │  Scroll Indicator ↓                          │ ║   │
│  ║  └──────────────────────────────────────────────┘ ║   │
│  ╚════════════════════════════════════════════════════╝   │
│                                                             │
│  ┌────────────────────────────────────────────────────┐   │
│  │  REST OF PAGE CONTENT                              │   │
│  │  (Premium Features, Destinations, Footer, etc.)    │   │
│  └────────────────────────────────────────────────────┘   │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

## Spacing Breakdown

### Desktop (1200px+)
```
0px     ┌─────────────────────────────────────────┐
        │ HEADER (80px height)                    │
80px    ├─────────────────────────────────────────┤
        │ PROMO BANNER (55px height)              │
135px   ├─────────────────────────────────────────┤
        │ 10px buffer/gap                         │
145px   ╞═════════════════════════════════════════╡
        ║ HERO CONTENT STARTS                     ║
        ║ (Eyebrow, Headline, Form, etc.)         ║
```

### Tablet (768px - 1199px)
```
0px     ┌─────────────────────────────────────────┐
        │ HEADER (75px height)                    │
75px    ├─────────────────────────────────────────┤
        │ PROMO BANNER (55px height)              │
130px   ├─────────────────────────────────────────┤
        │ 10px buffer/gap                         │
140px   ╞═════════════════════════════════════════╡
        ║ HERO CONTENT STARTS                     ║
```

### Mobile (< 768px)
```
0px     ┌─────────────────────────────────────────┐
        │ HEADER (70px height)                    │
70px    ├─────────────────────────────────────────┤
        │ PROMO BANNER (50px height)              │
120px   ╞═════════════════════════════════════════╡
        ║ HERO CONTENT STARTS                     ║
```

## Z-Index Stack

```
Layer 3 (Top)     │  HEADER          z-index: 1000
                  │  - Logo, Nav, Actions
                  │
Layer 2 (Middle)  │  PROMO BANNER    z-index: 999
                  │  - Promotional message
                  │
Layer 1 (Base)    │  HERO SECTION    z-index: 1
                  │  - Background, Content
                  │
Layer 0 (Bottom)  │  REST OF PAGE    z-index: 0
                  │  - Features, Footer, etc.
```

## Responsive Behavior

### Promo Banner Visible
```
DESKTOP:  Header (80) + Promo (55) + Buffer (10) = 145px padding
TABLET:   Header (75) + Promo (55) + Buffer (10) = 140px padding
MOBILE:   Header (70) + Promo (50) + Buffer (0)  = 120px padding
```

### Promo Banner Closed
```
DESKTOP:  Header (80) + Buffer (10) = 90px padding
TABLET:   Header (75) + Buffer (10) = 85px padding
MOBILE:   Header (70) + Buffer (0)  = 70px padding
```

## Interactive States

### Initial Load
```
┌─────────────────────────────┐
│ Header: Emerald + Blur      │ ← rgba(22, 68, 38, 0.85)
│ backdrop-filter: blur(10px) │
└─────────────────────────────┘
```

### After Scroll
```
┌─────────────────────────────┐
│ Header: White + Blur        │ ← rgba(255, 255, 255, 0.95)
│ backdrop-filter: blur(20px) │
│ box-shadow: elevated        │
└─────────────────────────────┘
```

## Element Flow

```
USER ENTERS PAGE
    ↓
HEADER loads (fixed, top: 0)
    ↓
PROMO BANNER loads (fixed, top: 80px)
    ↓
HERO SECTION loads (padding-top: 145px)
    ↓
CONTENT visible without overlap
    ↓
USER SCROLLS DOWN
    ↓
HEADER changes to white (glassmorphism)
    ↓
PROMO BANNER stays fixed
    ↓
HERO CONTENT scrolls normally
    ↓
USER CLOSES PROMO
    ↓
PROMO BANNER animates out
    ↓
HERO adjusts padding to 90px (smooth transition)
    ↓
NO LAYOUT SHIFT OR JUMP
```

## Color Overlay System

```
LAYER 4 (Top)     │  Header Background
                  │  ├─ Initial: rgba(22, 68, 38, 0.85)
                  │  └─ Scrolled: rgba(255, 255, 255, 0.95)
                  │
LAYER 3           │  Promo Banner
                  │  └─ Background: Champagne gold gradient
                  │
LAYER 2           │  Hero Gradient Overlay
                  │  └─ linear-gradient(135deg, emerald shades)
                  │
LAYER 1           │  Hero Background Image
                  │  └─ Airplane wing / clouds / sky
                  │
LAYER 0 (Bottom)  │  Solid background fallback
```

## Animation Timeline

```
0ms    │  Page Load
       │
       ├─ Header appears (instant)
       │
100ms  ├─ Promo banner slides down (slideDown animation)
       │
200ms  ├─ Hero eyebrow text fades in (staggered)
       │
400ms  ├─ Hero headline appears with shimmer
       │
600ms  ├─ Search form fades in
       │
800ms  ├─ Trust indicators count up
       │
1000ms └─ All animations complete
```

## Click/Tap Zones

```
┌────────────────────────────────────────────┐
│ HEADER (Always Interactive)                │
│ ├─ Logo: Clickable → Home                  │
│ ├─ Nav Items: Clickable → Pages            │
│ ├─ Search: Opens search modal              │
│ └─ Sign In: Opens auth modal               │
├────────────────────────────────────────────┤
│ PROMO BANNER (Dismissible)                 │
│ ├─ Text: Clickable → Offers page           │
│ └─ Close (X): Closes banner                │
├────────────────────────────────────────────┤
│ HERO SECTION (Scrollable)                  │
│ ├─ Search Form: Interactive inputs         │
│ ├─ Popular Routes: Clickable pills         │
│ ├─ Quick Filters: Toggle checkboxes        │
│ └─ Scroll Indicator: Smooth scroll down    │
└────────────────────────────────────────────┘
```

## Common Issues & Solutions

### Issue: Header still overlaps
**Solution:** Verify padding-top on .hero-section is applied
```css
.hero-section { padding-top: 145px !important; }
```

### Issue: Promo banner hidden
**Solution:** Check z-index and top position
```css
.promo-banner { 
  z-index: 999 !important; 
  top: 80px !important; 
}
```

### Issue: Content jumps when promo closes
**Solution:** Ensure smooth transition is applied
```css
.hero-section {
  transition: padding-top 0.5s ease !important;
}
```

### Issue: Mobile layout broken
**Solution:** Verify responsive breakpoints load
```css
@media (max-width: 767px) {
  .hero-section { padding-top: 120px !important; }
}
```

---

## Quick Reference

| Element | Position | Z-Index | Height | Top |
|---------|----------|---------|--------|-----|
| Header | Fixed | 1000 | 80px | 0 |
| Promo | Fixed | 999 | 55px | 80px |
| Hero | Relative | 1 | Auto | - |

**Hero Padding:**
- With Promo: 145px
- Without Promo: 90px
- Mobile (with): 120px
- Mobile (without): 70px
