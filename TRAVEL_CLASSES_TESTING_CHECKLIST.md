# ✅ Travel Classes 3D - Visual Testing Checklist

## 🎯 Complete Testing Guide

Use this checklist to verify everything works perfectly before going live.

---

## 📋 Pre-Test Setup

- [ ] Open `html/index.html` in Chrome/Firefox
- [ ] Open DevTools Console (F12)
- [ ] Check for JavaScript errors (should be 0)
- [ ] Scroll to "Choose Your Comfort Level" section
- [ ] Ensure AOS animations have loaded

---

## 1️⃣ VISUAL APPEARANCE (5 min)

### Section Header
- [ ] Badge says "✨ Travel Experiences" with emerald background
- [ ] Title is "Choose Your Comfort Level" (bold, large)
- [ ] Subtitle is visible and readable (gray text)
- [ ] Section has light green gradient background

### Left Navigation (40% width)
- [ ] 3 tab buttons are stacked vertically
- [ ] Each tab has: Icon + Title + Subtitle
- [ ] Icons are: 🛋️ (Economy), 💼 (Business), 💎 (First)
- [ ] First tab (Economy) is highlighted by default
- [ ] White background card with rounded corners
- [ ] Shadow is visible around navigation card

### Right Content Panel (60% width)
- [ ] Hero image displays (320px tall)
- [ ] Image has gradient overlay at bottom
- [ ] Badge pill shows class name (purple/pink/peach)
- [ ] Title is bold and large (e.g., "Smart Travel, Great Value")
- [ ] Description text is readable (gray color)
- [ ] 4 features listed with checkmark icons
- [ ] 4 amenity chips shown at bottom
- [ ] "Book [Class] Class" button is prominent (emerald)

### Color Schemes
- [ ] **Economy**: Purple gradient (#667eea → #764ba2)
- [ ] **Business**: Pink gradient (#f093fb → #f5576c)
- [ ] **First Class**: Peach gradient (#ffecd2 → #fcb69f)

---

## 2️⃣ TAB SWITCHING (5 min)

### Click Economy Tab
- [ ] Content switches to Economy panel
- [ ] Tab button slides right slightly
- [ ] Tab gets emerald background overlay
- [ ] Left border appears (5px emerald)
- [ ] Icon changes to emerald gradient
- [ ] Icon rotates 10 degrees
- [ ] Content fades in smoothly (0.8s)
- [ ] Previous content fades out first

### Click Business Tab
- [ ] Smooth transition from Economy to Business
- [ ] Pink gradient card appears
- [ ] Business features load
- [ ] Checkmarks animate (circle + check)
- [ ] New amenity chips display (2 Bags, Free WiFi, etc.)
- [ ] No layout jump or flash

### Click First Class Tab
- [ ] Smooth transition to First Class
- [ ] Peach gradient card appears
- [ ] Luxury features display
- [ ] Amenity chips update (3 Bags, Shower, etc.)
- [ ] Animation completes in <1 second

### Animation Quality
- [ ] No flickering during transitions
- [ ] Smooth fade + slide effect
- [ ] 60fps animation (check DevTools Performance)
- [ ] Background gradient morphs smoothly

---

## 3️⃣ SVG CHECKMARK ANIMATION (3 min)

### On Tab Switch
- [ ] Watch checkmarks on features list
- [ ] Circle draws first (0.8s animation)
- [ ] Checkmark draws after circle (0.5s animation)
- [ ] Drawings are smooth, not choppy
- [ ] All 4 checkmarks animate in sequence

### Stagger Timing
- [ ] Feature 1: Appears immediately
- [ ] Feature 2: 0.1s delay
- [ ] Feature 3: 0.2s delay
- [ ] Feature 4: 0.3s delay
- [ ] Creates wave effect

### Visual Quality
- [ ] Stroke is emerald green
- [ ] Line width is consistent (2-3px)
- [ ] No gaps or breaks in drawing
- [ ] Animation completes fully

---

## 4️⃣ 3D PARALLAX EFFECT (5 min)

### Hover Over Card
- [ ] Move mouse to top-left corner
  - Card should tilt down-right
- [ ] Move mouse to top-right corner
  - Card should tilt down-left
- [ ] Move mouse to bottom-left corner
  - Card should tilt up-right
- [ ] Move mouse to bottom-right corner
  - Card should tilt up-left
- [ ] Move mouse to center
  - Card returns to neutral position

### 3D Rotation Quality
- [ ] Max rotation is about 5 degrees (subtle)
- [ ] Card also lifts up slightly (translateY)
- [ ] Shadow becomes stronger on hover
- [ ] Movement follows mouse smoothly (no lag)
- [ ] Returns to normal when mouse leaves

### Performance Check
- [ ] Open DevTools → Performance tab
- [ ] Start recording
- [ ] Move mouse over card for 5 seconds
- [ ] Stop recording
- [ ] Check FPS: Should be 60fps (green line)
- [ ] No red drops or warnings

---

## 5️⃣ KEN BURNS ZOOM EFFECT (3 min)

### Hero Image Zoom
- [ ] Hover over 3D card (not just image)
- [ ] Hero image slowly zooms in
- [ ] Zoom is subtle (scale: 1 → 1.15)
- [ ] Zoom takes 8 seconds to complete
- [ ] Smooth easing (no sudden jumps)
- [ ] Image stays centered during zoom

### Edge Cases
- [ ] Hover and leave quickly
  - Image resets smoothly
- [ ] Hover multiple times
  - No animation stacking or glitches
- [ ] Switch tabs while hovering
  - New image doesn't zoom immediately

---

## 6️⃣ RIPPLE CLICK EFFECT (2 min)

### Click Tab Button
- [ ] Click Economy tab
  - Small circle appears at click position
- [ ] Circle expands outward
  - From 20px → 200px
- [ ] Circle fades out (opacity 1 → 0)
- [ ] Ripple completes in 0.6 seconds
- [ ] Ripple is emerald color with transparency

### Multiple Clicks
- [ ] Click different tabs rapidly
  - Each creates own ripple
  - No overlapping issues
  - Old ripples clean up properly

---

## 7️⃣ AMENITY CHIPS HOVER (2 min)

### Hover Individual Chips
- [ ] Hover "🧳 1 Bag" chip
  - Background changes to emerald gradient
  - Text changes to white
  - Chip lifts up 2px
  - Shadow appears
- [ ] Repeat for all chips:
  - [ ] WiFi chip
  - [ ] Meal chip
  - [ ] IFE chip
- [ ] Leave hover
  - Chip returns to original state
  - Smooth transition (0.3s)

### Stagger Animation on Load
- [ ] Scroll section into view
- [ ] Chips fade in one by one
- [ ] 0.1s delay between each chip
- [ ] Creates cascading effect

---

## 8️⃣ CTA BUTTON INTERACTION (2 min)

### "Book [Class] Class" Button
- [ ] Button has emerald gradient background
- [ ] Text is white and bold
- [ ] Arrow icon on right side
- [ ] Shadow is visible (elevated look)

### Hover Effect
- [ ] Hover over button
  - Button lifts up (-4px)
  - Shadow becomes stronger
  - White ripple appears from center
  - Arrow slides right (8px)
  - Scale increases slightly (1.05)
- [ ] Leave hover
  - Returns to normal smoothly

### Click Test
- [ ] Click button
  - Should navigate to booking page
  - Check URL has `?class=Economy` parameter
- [ ] Test all 3 buttons:
  - [ ] Book Economy Class → `?class=Economy`
  - [ ] Book Business Class → `?class=Business`
  - [ ] Book First Class → `?class=First`

---

## 9️⃣ KEYBOARD NAVIGATION (5 min)

### Arrow Key Control
- [ ] Click anywhere on section (to focus)
- [ ] Press `↓` (Down Arrow)
  - Moves to next tab (Economy → Business)
  - Content switches smoothly
  - Focus indicator visible
- [ ] Press `↓` again
  - Business → First Class
- [ ] Press `↓` again
  - First Class → Economy (loops back)
- [ ] Press `↑` (Up Arrow)
  - Economy → First Class (reverse order)

### Enter/Space Keys
- [ ] Tab key to focus on Economy button
- [ ] Press `Enter`
  - Tab activates
  - Content switches
- [ ] Tab to Business button
- [ ] Press `Space`
  - Tab activates
  - Content switches

### Focus Management
- [ ] Tab through navigation buttons
  - Focus ring is visible (emerald outline)
  - Focus order is logical (top to bottom)
- [ ] Press Tab past last button
  - Focus moves to CTA button
- [ ] Press Shift+Tab
  - Focus moves backwards

### Accessibility Check
- [ ] Never lose focus indicator
- [ ] Focus is always visible
- [ ] Can navigate entire section with keyboard only
- [ ] No keyboard traps

---

## 🔟 RESPONSIVE DESIGN (10 min)

### Desktop (1920px)
- [ ] Open DevTools
- [ ] Set width to 1920px
- [ ] Layout is side-by-side (40% | 60%)
- [ ] Left navigation is sticky
- [ ] All content visible without scroll
- [ ] Images are full quality
- [ ] Text is readable size

### Laptop (1366px)
- [ ] Set width to 1366px
- [ ] Layout still side-by-side
- [ ] Navigation shrinks proportionally
- [ ] Content area shrinks
- [ ] No horizontal scrollbar
- [ ] Everything still looks good

### Tablet Portrait (768px)
- [ ] Set width to 768px
- [ ] Layout switches to stacked
- [ ] Navigation becomes horizontal
- [ ] Tabs scroll sideways if needed
- [ ] Content panel full width below
- [ ] Hero image shrinks to fit
- [ ] Text remains readable

### Tablet Landscape (1024px)
- [ ] Set width to 1024px
- [ ] Similar to 768px but wider
- [ ] More breathing room
- [ ] Hero image larger
- [ ] Features display nicely

### Mobile Large (414px - iPhone Pro Max)
- [ ] Set width to 414px
- [ ] Single column layout
- [ ] Horizontal scrollable tabs
- [ ] Hero image 250px tall
- [ ] Content padding reduced
- [ ] Font sizes adjusted
- [ ] Touch targets large enough (48px min)

### Mobile Medium (375px - iPhone)
- [ ] Set width to 375px
- [ ] Same as 414px but tighter
- [ ] All content fits
- [ ] No horizontal scroll
- [ ] Tap targets still work

### Mobile Small (320px - iPhone SE)
- [ ] Set width to 320px
- [ ] Smallest supported size
- [ ] Content might be tight
- [ ] Everything still visible
- [ ] No broken layouts
- [ ] Text doesn't overflow

### Responsive Animations
- [ ] All animations work on mobile
- [ ] 3D effects work (if supported)
- [ ] Ken Burns zoom works
- [ ] SVG checkmarks animate
- [ ] No performance issues

---

## 1️⃣1️⃣ TOUCH GESTURES (Mobile Only - 3 min)

### Using Real Device or Chrome Device Emulator
- [ ] Open on actual phone or enable touch in DevTools
- [ ] Tap Economy tab
  - Switches smoothly
  - No accidental double-tap zoom
- [ ] Tap Business tab
  - Immediate response
  - Ripple effect appears
- [ ] Tap First Class tab
  - Works consistently

### Swipe Gestures
- [ ] Try swiping tabs left/right
  - Tabs scroll horizontally
  - Smooth scrolling
  - Snap to position
- [ ] Pinch to zoom on image
  - Should not zoom (disabled if needed)

### Scroll Performance
- [ ] Scroll section into view
  - AOS animations trigger
  - Smooth 60fps scroll
- [ ] Scroll while animation playing
  - No jank or stutter

---

## 1️⃣2️⃣ PERFORMANCE TESTING (5 min)

### Lighthouse Audit
- [ ] Open Chrome DevTools
- [ ] Go to Lighthouse tab
- [ ] Select "Performance" + "Accessibility"
- [ ] Click "Generate Report"
- [ ] Wait for results

**Expected Scores**:
- [ ] Performance: **95+** (Excellent)
- [ ] Accessibility: **100** (Perfect)
- [ ] Best Practices: **100** (Perfect)
- [ ] SEO: **90+** (Good)

### Performance Metrics
- [ ] First Contentful Paint: **<1.5s**
- [ ] Speed Index: **<2.5s**
- [ ] Time to Interactive: **<3.0s**
- [ ] Total Blocking Time: **<200ms**
- [ ] Cumulative Layout Shift: **<0.1**
- [ ] Largest Contentful Paint: **<2.5s**

### Network Tab Check
- [ ] Open DevTools → Network tab
- [ ] Disable cache
- [ ] Reload page
- [ ] Check images:
  - [ ] Economy image loads on demand
  - [ ] Business image loads when tab active
  - [ ] First Class image loads when tab active
  - [ ] `loading="lazy"` working

### Animation Frame Rate
- [ ] Open DevTools → Performance tab
- [ ] Click "Record"
- [ ] Interact with tabs for 10 seconds
  - Click different tabs
  - Hover over cards
  - Move mouse for parallax
- [ ] Stop recording
- [ ] Check FPS chart:
  - [ ] Green line = 60fps (good)
  - [ ] Yellow/Red drops = < 60fps (bad)
- [ ] Aim for consistent 60fps

---

## 1️⃣3️⃣ ACCESSIBILITY TESTING (5 min)

### Screen Reader Test (Optional)
- [ ] Enable Windows Narrator / macOS VoiceOver
- [ ] Navigate to section
- [ ] Hear: "Choose Your Comfort Level, heading level 2"
- [ ] Tab to Economy button
- [ ] Hear: "Economy Class, Best Value, button"
- [ ] Press Enter
- [ ] Hear: "Tab activated, Economy Class panel"

### Color Contrast
- [ ] Open DevTools → Accessibility tab
- [ ] Check text on backgrounds:
  - [ ] Section title (black on light green): **Pass**
  - [ ] Tab titles (charcoal on white): **Pass**
  - [ ] Body text (slate on white): **Pass**
  - [ ] Button text (white on emerald): **Pass**
- [ ] All should meet WCAG AA (4.5:1 minimum)

### Focus Indicators
- [ ] Tab through all interactive elements
- [ ] Every focused element has visible outline
- [ ] Focus ring is emerald color
- [ ] Minimum 2px width
- [ ] Never hidden or invisible

### Alternative Text
- [ ] Inspect hero images
- [ ] Each has descriptive alt text
  - [ ] "Modern Economy Class cabin"
  - [ ] "Spacious Business Class seat"
  - [ ] "Luxurious First Class suite"

---

## 1️⃣4️⃣ CROSS-BROWSER TESTING (10 min)

### Chrome (Primary)
- [ ] Latest version
- [ ] All features work
- [ ] Animations smooth
- [ ] 3D effects perfect
- [ ] No console errors

### Firefox
- [ ] Latest version
- [ ] Tabs switch correctly
- [ ] 3D parallax works
- [ ] SVG animations work
- [ ] Ken Burns zoom works
- [ ] Performance good

### Safari (Mac only)
- [ ] Latest version
- [ ] All interactions work
- [ ] Animations may be slightly different
- [ ] 3D effects work
- [ ] No major issues

### Edge
- [ ] Latest version (Chromium-based)
- [ ] Should work same as Chrome
- [ ] All features supported
- [ ] No compatibility issues

### Internet Explorer 11 (Optional)
- [ ] Basic tabs work
- [ ] Content switches
- [ ] 3D effects may not work (acceptable)
- [ ] Page doesn't break
- [ ] Graceful degradation

---

## 1️⃣5️⃣ EDGE CASES & BUGS (5 min)

### Rapid Clicking
- [ ] Click tabs very quickly (10 times)
  - No animation stacking
  - No errors in console
  - Ends on correct tab

### Hover During Animation
- [ ] Click tab to start animation
- [ ] Immediately hover over new card
  - 3D effect doesn't break animation
  - Both work together smoothly

### Keyboard + Mouse Combo
- [ ] Press ↓ arrow (keyboard)
- [ ] Immediately click different tab (mouse)
  - Focus moves correctly
  - Content switches to clicked tab
  - No conflicts

### Resize While Animating
- [ ] Click tab to start animation
- [ ] Resize window during animation
  - Animation continues
  - No layout breaks
  - Responsive behavior kicks in

### Long Text Overflow
- [ ] Zoom page to 200% (Ctrl + "+")
  - Text doesn't overflow containers
  - Layout remains intact
  - Scrollbars appear if needed

### Disabled JavaScript
- [ ] Disable JavaScript in browser
- [ ] Reload page
  - Tabs still visible (basic HTML)
  - Content shows (all panels visible)
  - No functionality but page not broken

---

## 1️⃣6️⃣ IMAGE LOADING (3 min)

### Lazy Loading Verification
- [ ] Open DevTools → Network tab
- [ ] Filter by "Img"
- [ ] Scroll page BEFORE reaching section
  - Only visible images loaded
- [ ] Scroll TO section
  - Economy image loads immediately
  - Business image NOT loaded yet
  - First Class image NOT loaded yet
- [ ] Click Business tab
  - Business image loads now
- [ ] Click First Class tab
  - First Class image loads now

### Image Quality
- [ ] All images are sharp (not blurry)
- [ ] No pixelation on high-DPI screens
- [ ] Images fit container perfectly
- [ ] No stretching or distortion
- [ ] Gradient overlay visible

### Missing Image Fallback
- [ ] Temporarily break image path
- [ ] Check if alt text displays
- [ ] Check if layout doesn't break

---

## 1️⃣7️⃣ CONSOLE ERRORS (2 min)

### Open DevTools Console
- [ ] No red errors
- [ ] No yellow warnings (acceptable if minor)
- [ ] Success message: "✈️ Premium 3D Travel Class Tabs initialized with 3 classes"

### Common Errors to Check For
- [ ] No "undefined is not a function"
- [ ] No "Cannot read property of null"
- [ ] No 404 errors (missing files)
- [ ] No CORS errors
- [ ] No deprecated API warnings

---

## 1️⃣8️⃣ FINAL QUALITY CHECK (3 min)

### Overall Polish
- [ ] Section looks professional
- [ ] Colors are vibrant and appealing
- [ ] Typography is clear and readable
- [ ] Spacing is consistent
- [ ] Alignment is perfect
- [ ] No visual glitches

### User Experience
- [ ] Intuitive to use (no confusion)
- [ ] Fast and responsive
- [ ] Engaging and interactive
- [ ] Clear call-to-actions
- [ ] Smooth animations
- [ ] Delightful micro-interactions

### Content Accuracy
- [ ] All features correct for each class
- [ ] Amenities match class level
- [ ] Prices/booking links work
- [ ] No typos in text
- [ ] Grammar is correct

---

## 📊 Testing Summary

### Checklist Completion
```
Total Tests:        120+
Must Pass:          All visual, interaction, responsive
Should Pass:        All performance, accessibility
Nice to Have:       Cross-browser, screen reader
```

### Scoring Guide
- **100%** (All Pass) = 🟢 Production Ready
- **95-99%** (1-5 Fails) = 🟡 Minor fixes needed
- **90-94%** (6-10 Fails) = 🟠 Several issues
- **<90%** (11+ Fails) = 🔴 Major problems

### Sign-Off
```
Tester Name:    _____________________
Date:           _____________________
Browser:        _____________________
OS:             _____________________
Screen Size:    _____________________

Overall Result: ☐ Pass  ☐ Fail

Notes:
__________________________________________
__________________________________________
__________________________________________
```

---

## 🚀 Post-Testing Actions

### If All Tests Pass ✅
1. Mark as Production Ready
2. Commit changes to Git
3. Deploy to staging environment
4. Final QA check on staging
5. Deploy to production
6. Monitor user analytics

### If Tests Fail ❌
1. Document failing tests
2. Create bug tickets
3. Prioritize by severity
4. Fix critical issues first
5. Re-run full test suite
6. Repeat until all pass

---

## 📞 Support

### Common Issues & Fixes

**Issue**: Animations are choppy
- **Fix**: Check if `will-change: transform` is applied
- **Fix**: Reduce 3D rotation intensity
- **Fix**: Disable Ken Burns zoom

**Issue**: Tabs don't switch
- **Fix**: Check console for JS errors
- **Fix**: Verify `index.js` is loaded
- **Fix**: Check if classes match HTML

**Issue**: 3D effect not working
- **Fix**: Test in Chrome/Firefox
- **Fix**: Check browser supports CSS 3D transforms
- **Fix**: Verify `transform-style: preserve-3d` applied

**Issue**: Images not loading
- **Fix**: Check image paths in HTML
- **Fix**: Verify `/site-images/` folder exists
- **Fix**: Check file extensions match

---

*Visual Testing Checklist v1.0*  
*Premium Travel Classes 3D Section*  
*October 13, 2025 - Destinova* ✈️

**Total Time**: ~60 minutes for complete test  
**Recommended**: Test on 3+ browsers, 2+ devices  
**Priority**: Visual > Interaction > Responsive > Performance > Accessibility
