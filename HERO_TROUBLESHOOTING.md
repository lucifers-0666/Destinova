# 🔧 Hero Section Troubleshooting Guide

## Quick Fix Checklist

### 1. **Open Browser Console** (F12)
Press `F12` in your browser and check the Console tab for errors or messages.

### 2. **Expected Console Messages**

You should see:
```
═══════════════════════════════════════════════════════════
🚀 HERO SECTION INITIALIZATION STARTED
═══════════════════════════════════════════════════════════
✅ Hero section found in DOM
🌊 Step 1: Initializing Vanta.js Background...
✅ Vanta.js background initialized successfully
✅ Vanta canvas rendered
🎬 Step 2: Initializing GSAP Animations...
✅ GSAP animations initialized successfully
🔢 Step 3: Setting up Trust Counter Animations...
🔘 Step 4: Initializing Button Interactions...
✈️ HERO SECTION INITIALIZATION COMPLETE!
```

---

## Common Issues & Solutions

### ❌ Issue 1: "Vanta container #vanta-bg not found in DOM"

**Cause**: The HTML element with `id="vanta-bg"` is missing.

**Solution**:
1. Open `html/index.html`
2. Find the `.home-hero` section (around line 148)
3. Verify this line exists:
   ```html
   <div class="home-hero-bg-animation" id="vanta-bg" aria-hidden="true"></div>
   ```
4. If missing, add it as the **first child** inside `<section class="home-hero">`

---

### ❌ Issue 2: "THREE.js ❌" or "VANTA.js ❌"

**Cause**: External libraries not loading from CDN.

**Solution**:
1. Check internet connection
2. Open `html/index.html`
3. Verify these script tags exist in `<head>`:
   ```html
   <!-- Three.js for 3D Background -->
   <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
   
   <!-- Vanta.js for Animated Background -->
   <script src="https://cdn.jsdelivr.net/npm/vanta@0.5.24/dist/vanta.waves.min.js"></script>
   ```
4. Try loading the page with CTRL+F5 (hard refresh)

---

### ❌ Issue 3: "gsap ❌" or "ScrollTrigger ❌"

**Cause**: GSAP libraries not loading.

**Solution**:
1. Open `html/index.html`
2. Verify these script tags exist **before** `hero-animations.js`:
   ```html
   <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
   <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>
   ```

---

### ❌ Issue 4: Hero Section Not Visible

**Cause**: CSS not loading or conflicting styles.

**Solution**:
1. Open browser DevTools (F12) → Elements tab
2. Find `<section class="home-hero">` element
3. Check computed styles:
   - `height` should be `100vh` or at least `850px`
   - `display` should be `flex`
   - `position` should be `relative`
4. If styles are wrong, check that `css/index.css` is linked:
   ```html
   <link rel="stylesheet" href="../css/index.css">
   ```

---

### ❌ Issue 5: Vanta Background Not Animating

**Cause**: Canvas not rendering or JavaScript error.

**Solution**:

1. **Check if canvas exists**:
   - Open DevTools → Elements tab
   - Find `<div id="vanta-bg">`
   - Look for a `<canvas>` child element inside
   - If canvas exists = Vanta is working ✅

2. **Check console for errors**:
   ```
   ⚠️ Vanta canvas not found (using CSS fallback)
   ```
   - This is OK! The CSS gradient will show instead

3. **Try manual initialization**:
   - Open browser console
   - Type: `window.heroDiagnostic()`
   - Check the output

---

### ❌ Issue 6: Trust Counter Numbers Not Animating

**Cause**: Missing `data-count` attributes or Intersection Observer not triggering.

**Solution**:
1. Check HTML has these attributes:
   ```html
   <div class="trust-stat" data-count="150000">
   <div class="trust-stat" data-count="4.8">
   <div class="trust-stat" data-count="2367">
   ```
2. Scroll down and back up to re-trigger animation
3. Check console for counter animation logs

---

### ❌ Issue 7: Parallax Not Working

**Cause**: GSAP ScrollTrigger not initialized or section not tall enough to scroll.

**Solution**:
1. Make sure page has content below hero (so you can scroll)
2. Check console for:
   ```
   ✅ GSAP animations initialized successfully
   ```
3. Open console and type:
   ```javascript
   ScrollTrigger.getAll()
   ```
   - Should return array with 4-5 triggers

---

## Manual Diagnostic Steps

### Step 1: Run Built-in Diagnostic

1. Open browser console (F12)
2. Type: `window.heroDiagnostic()`
3. Review output:
   ```
   Vanta Effect: Object or null
   GSAP Triggers: 4-5
   Trust Stats: 3
   Vanta Container: {initialized: "true", hasCanvas: true, ...}
   ```

### Step 2: Check HTML Structure

Run this in console:
```javascript
console.log({
  heroSection: !!document.querySelector('.home-hero'),
  vantaBg: !!document.getElementById('vanta-bg'),
  heroContent: !!document.querySelector('.home-hero-content'),
  trustStats: document.querySelectorAll('.trust-stat').length
});
```

Expected output:
```
{heroSection: true, vantaBg: true, heroContent: true, trustStats: 3}
```

### Step 3: Check Library Loading

Run this in console:
```javascript
console.log({
  THREE: typeof THREE !== 'undefined',
  VANTA: typeof VANTA !== 'undefined',
  gsap: typeof gsap !== 'undefined',
  ScrollTrigger: typeof ScrollTrigger !== 'undefined'
});
```

Expected output:
```
{THREE: true, VANTA: true, gsap: true, ScrollTrigger: true}
```

---

## Advanced Diagnostic Tool

To run comprehensive diagnostics:

1. **Enable diagnostic script**:
   - Open `html/index.html`
   - Find this line:
     ```html
     <!-- <script src="../js/hero-diagnostic.js"></script> -->
     ```
   - Remove the `<!--` and `-->` to uncomment:
     ```html
     <script src="../js/hero-diagnostic.js"></script>
     ```

2. **Reload page** (CTRL+F5)

3. **Check console** - You'll see detailed diagnostic output:
   ```
   🔍 HERO SECTION DIAGNOSTIC STARTING...
   📄 HTML STRUCTURE CHECK:
   ✅ .home-hero found
   ✅ #vanta-bg found
   ...
   📊 DIAGNOSTIC SUMMARY:
   ✅ ALL CHECKS PASSED!
   ```

---

## CSS Fallback (If Vanta.js Fails)

If Vanta.js doesn't work, a beautiful CSS gradient animation will show instead.

**To verify CSS fallback is working**:
1. Check hero section has animated background
2. Should see smooth gradient animation (25s loop)
3. Colors: Emerald green (#1d5e33) with radial gradients

**CSS fallback location**: `css/index.css` lines 803-835

---

## Performance Issues

### Hero Section Loads Slowly

**Solution**:
1. Check internet connection (external CDN libraries)
2. Check browser is modern (Chrome 90+, Firefox 88+, Safari 14+)
3. Try disabling browser extensions temporarily
4. Clear browser cache (CTRL+SHIFT+DELETE)

### Animations Stuttering

**Solution**:
1. Close other tabs/applications
2. Disable browser extensions
3. Check GPU acceleration is enabled:
   - Chrome: `chrome://gpu`
   - Should see "Hardware accelerated"

---

## Script Loading Order

**CRITICAL**: Scripts must load in this exact order:

```html
<!-- 1. THREE.js -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>

<!-- 2. Vanta.js -->
<script src="https://cdn.jsdelivr.net/npm/vanta@0.5.24/dist/vanta.waves.min.js"></script>

<!-- 3. GSAP -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>

<!-- 4. Hero Animations -->
<script src="../js/hero-animations.js"></script>
```

---

## Still Not Working?

### Nuclear Option: Full Reset

1. **Clear browser cache completely**:
   - Press CTRL+SHIFT+DELETE
   - Select "All time"
   - Check all boxes
   - Click "Clear data"

2. **Hard reload page**:
   - Press CTRL+F5 (Windows)
   - Press CMD+SHIFT+R (Mac)

3. **Try different browser**:
   - Test in Chrome, Firefox, Edge
   - Rules out browser-specific issues

4. **Check file paths**:
   - Verify all files exist:
     ```
     d:\Air_ticket_booking_mini_project\
     ├── html\index.html
     ├── css\index.css
     ├── css\search-widget-fix.css
     └── js\hero-animations.js
     ```

5. **Re-save all files**:
   - Sometimes encoding issues cause problems
   - Open each file in VS Code
   - Save with "UTF-8" encoding

---

## Contact & Debug Info

When asking for help, provide:

1. **Browser & Version**:
   - Chrome 120, Firefox 115, etc.

2. **Console Output**:
   - Copy ALL console messages (include errors)

3. **Screenshot**:
   - What you see vs. what you expected

4. **Diagnostic Results**:
   - Run `window.heroDiagnostic()` in console
   - Copy the output

---

## Expected Visual Result

✅ **Working Hero Section Should Have**:

1. **Animated 3D wave background** (emerald green)
   - OR smooth CSS gradient animation if Vanta fails
   
2. **Hero content** on left (60% width):
   - Large headline: "Your Journey Starts Here"
   - Subtext and description
   - 3 buttons (Search Flights, Explore Deals, Download App)
   
3. **Trust indicators** at bottom:
   - "150K+ Bookings This Year"
   - "⭐ 4.8 Average Rating"
   - "2,367+ Destinations"
   - Numbers should **animate from 0** when scrolled into view
   
4. **Parallax scrolling**:
   - Content moves faster than background when scrolling
   
5. **Smooth animations**:
   - Hero content fades in on page load
   - Search widget slides up when scrolled to
   - Everything feels smooth and premium

---

## Debug Mode

Add `?debug` to URL to see extra console logs:
```
http://localhost/index.html?debug
```

Then run `window.heroDiagnostic()` in console for detailed check.

---

**Last Updated**: October 13, 2025  
**Version**: 2.0 (Enhanced Diagnostics)
