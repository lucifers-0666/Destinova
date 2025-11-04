/**
 * DESTINOVA - PERFORMANCE OPTIMIZATION
 * Phase 3: Lazy Loading, Analytics & Performance Monitoring
 * 
 * Features:
 * - Image lazy loading
 * - Performance monitoring (Core Web Vitals)
 * - Analytics event tracking
 * - Resource optimization
 */

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('⚡ Performance module initialized');
    
    initLazyLoading();
    initPerformanceMonitoring();
    initAnalyticsTracking();
    optimizeResources();
});

// ============================================
// LAZY LOADING
// ============================================

function initLazyLoading() {
    // Check for browser support
    if ('IntersectionObserver' in window) {
        lazyLoadImages();
        lazyLoadBackgrounds();
    } else {
        // Fallback: load all images immediately
        loadAllImages();
    }
}

function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src], img[loading="lazy"]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                loadImage(img);
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px 0px', // Start loading 50px before entering viewport
        threshold: 0.01
    });
    
    images.forEach(img => {
        // Add placeholder if not already set
        if (!img.src || img.src === window.location.href) {
            img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600"%3E%3Crect fill="%23f0f0f0" width="800" height="600"/%3E%3C/svg%3E';
            img.classList.add('lazy-loading');
        }
        
        imageObserver.observe(img);
    });
}

function loadImage(img) {
    const src = img.dataset.src || img.src;
    
    // Create temporary image to preload
    const tempImg = new Image();
    
    tempImg.onload = () => {
        img.src = src;
        img.classList.remove('lazy-loading');
        img.classList.add('lazy-loaded');
        
        // Fade in effect
        if (typeof gsap !== 'undefined') {
            gsap.fromTo(img,
                { opacity: 0 },
                { opacity: 1, duration: 0.4, ease: 'power2.out' }
            );
        }
        
        // Remove data-src to avoid reprocessing
        delete img.dataset.src;
    };
    
    tempImg.onerror = () => {
        console.error('Failed to load image:', src);
        img.classList.add('lazy-error');
    };
    
    tempImg.src = src;
}

function lazyLoadBackgrounds() {
    const elements = document.querySelectorAll('[data-bg]');
    
    const bgObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const bgUrl = el.dataset.bg;
                
                // Preload background image
                const tempImg = new Image();
                tempImg.onload = () => {
                    el.style.backgroundImage = `url('${bgUrl}')`;
                    el.classList.add('bg-loaded');
                    delete el.dataset.bg;
                };
                tempImg.src = bgUrl;
                
                observer.unobserve(el);
            }
        });
    }, {
        rootMargin: '100px 0px',
        threshold: 0.01
    });
    
    elements.forEach(el => bgObserver.observe(el));
}

function loadAllImages() {
    // Fallback for browsers without IntersectionObserver
    const images = document.querySelectorAll('img[data-src]');
    images.forEach(img => {
        img.src = img.dataset.src;
        delete img.dataset.src;
    });
}

// ============================================
// PERFORMANCE MONITORING
// ============================================

function initPerformanceMonitoring() {
    // Wait for page to fully load
    window.addEventListener('load', () => {
        setTimeout(() => {
            measureCoreWebVitals();
            measurePageLoadMetrics();
            monitorResourceTiming();
        }, 0);
    });
    
    // Monitor long tasks
    if ('PerformanceObserver' in window) {
        try {
            const longTaskObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    console.warn('⚠️ Long task detected:', {
                        duration: `${entry.duration.toFixed(2)}ms`,
                        startTime: `${entry.startTime.toFixed(2)}ms`
                    });
                }
            });
            longTaskObserver.observe({ entryTypes: ['longtask'] });
        } catch (e) {
            // Long task API not supported
        }
    }
}

function measureCoreWebVitals() {
    if (!('performance' in window)) return;
    
    const metrics = {
        LCP: null,  // Largest Contentful Paint
        FID: null,  // First Input Delay
        CLS: null,  // Cumulative Layout Shift
        FCP: null,  // First Contentful Paint
        TTFB: null  // Time to First Byte
    };
    
    // Largest Contentful Paint (LCP)
    if ('PerformanceObserver' in window) {
        try {
            const lcpObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                metrics.LCP = lastEntry.renderTime || lastEntry.loadTime;
            });
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        } catch (e) {
            console.warn('LCP observation not supported');
        }
        
        // First Input Delay (FID)
        try {
            const fidObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    metrics.FID = entry.processingStart - entry.startTime;
                });
            });
            fidObserver.observe({ entryTypes: ['first-input'] });
        } catch (e) {
            console.warn('FID observation not supported');
        }
        
        // Cumulative Layout Shift (CLS)
        try {
            let clsValue = 0;
            const clsObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                        metrics.CLS = clsValue;
                    }
                }
            });
            clsObserver.observe({ entryTypes: ['layout-shift'] });
        } catch (e) {
            console.warn('CLS observation not supported');
        }
    }
    
    // Report metrics after 5 seconds
    setTimeout(() => {
        console.log('📊 Core Web Vitals:', {
            LCP: metrics.LCP ? `${metrics.LCP.toFixed(2)}ms` : 'N/A',
            FID: metrics.FID ? `${metrics.FID.toFixed(2)}ms` : 'N/A',
            CLS: metrics.CLS ? metrics.CLS.toFixed(4) : 'N/A'
        });
        
        // Check against thresholds
        const performance = {
            LCP: metrics.LCP < 2500 ? '✅ Good' : metrics.LCP < 4000 ? '⚠️ Needs Improvement' : '❌ Poor',
            FID: metrics.FID < 100 ? '✅ Good' : metrics.FID < 300 ? '⚠️ Needs Improvement' : '❌ Poor',
            CLS: metrics.CLS < 0.1 ? '✅ Good' : metrics.CLS < 0.25 ? '⚠️ Needs Improvement' : '❌ Poor'
        };
        
        console.log('📈 Performance Assessment:', performance);
        
        // Send to analytics (in production)
        // sendAnalytics('core_web_vitals', metrics);
    }, 5000);
}

function measurePageLoadMetrics() {
    const perfData = performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
    const domReadyTime = perfData.domContentLoadedEventEnd - perfData.navigationStart;
    const dnsTime = perfData.domainLookupEnd - perfData.domainLookupStart;
    const tcpTime = perfData.connectEnd - perfData.connectStart;
    const ttfb = perfData.responseStart - perfData.navigationStart;
    
    console.log('⏱️ Page Load Metrics:', {
        'Page Load Time': `${pageLoadTime}ms`,
        'DOM Ready Time': `${domReadyTime}ms`,
        'DNS Lookup': `${dnsTime}ms`,
        'TCP Connect': `${tcpTime}ms`,
        'Time to First Byte': `${ttfb}ms`
    });
    
    // Visual indicator for development
    if (pageLoadTime > 3000) {
        console.warn('⚠️ Page load time exceeds 3 seconds');
    }
}

function monitorResourceTiming() {
    const resources = performance.getEntriesByType('resource');
    
    // Group by resource type
    const resourceStats = {
        script: [],
        stylesheet: [],
        image: [],
        font: [],
        other: []
    };
    
    resources.forEach(resource => {
        const type = getResourceType(resource.name);
        const stats = {
            name: resource.name.split('/').pop(),
            duration: resource.duration,
            size: resource.transferSize || 0
        };
        
        if (resourceStats[type]) {
            resourceStats[type].push(stats);
        } else {
            resourceStats.other.push(stats);
        }
    });
    
    // Find slowest resources
    const allResources = Object.values(resourceStats).flat();
    const slowestResources = allResources
        .sort((a, b) => b.duration - a.duration)
        .slice(0, 5);
    
    console.log('🐌 Slowest Resources:', slowestResources);
    
    // Calculate total transfer size
    const totalSize = allResources.reduce((sum, r) => sum + r.size, 0);
    console.log('📦 Total Transfer Size:', formatBytes(totalSize));
}

function getResourceType(url) {
    if (url.endsWith('.js')) return 'script';
    if (url.endsWith('.css')) return 'stylesheet';
    if (url.match(/\.(jpg|jpeg|png|gif|svg|webp)$/)) return 'image';
    if (url.match(/\.(woff|woff2|ttf|otf)$/)) return 'font';
    return 'other';
}

function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// ============================================
// ANALYTICS TRACKING
// ============================================

function initAnalyticsTracking() {
    trackPageView();
    trackUserInteractions();
    trackScrollDepth();
    trackTimeOnPage();
}

function trackPageView() {
    const pageData = {
        url: window.location.href,
        title: document.title,
        referrer: document.referrer,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        viewport: {
            width: window.innerWidth,
            height: window.innerHeight
        }
    };
    
    console.log('📄 Page View:', pageData);
    
    // Send to analytics endpoint (in production)
    // sendAnalytics('page_view', pageData);
}

function trackUserInteractions() {
    // Track button clicks
    document.querySelectorAll('button, .btn, a[href]').forEach(element => {
        element.addEventListener('click', function(e) {
            const eventData = {
                type: 'click',
                element: this.tagName,
                text: this.textContent.trim().substring(0, 50),
                href: this.getAttribute('href') || null,
                timestamp: new Date().toISOString()
            };
            
            console.log('🖱️ User Interaction:', eventData);
            
            // Send to analytics (in production)
            // sendAnalytics('user_interaction', eventData);
        });
    });
    
    // Track form interactions
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function(e) {
            const formData = {
                formId: this.id,
                action: this.action,
                timestamp: new Date().toISOString()
            };
            
            console.log('📝 Form Submit:', formData);
            
            // Send to analytics (in production)
            // sendAnalytics('form_submit', formData);
        });
    });
}

function trackScrollDepth() {
    let maxScroll = 0;
    const milestones = [25, 50, 75, 100];
    const reached = new Set();
    
    window.addEventListener('scroll', throttle(() => {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = window.pageYOffset;
        const scrollPercent = (scrolled / scrollHeight) * 100;
        
        if (scrollPercent > maxScroll) {
            maxScroll = scrollPercent;
        }
        
        milestones.forEach(milestone => {
            if (scrollPercent >= milestone && !reached.has(milestone)) {
                reached.add(milestone);
                console.log(`📜 Scroll Depth: ${milestone}%`);
                
                // Send to analytics (in production)
                // sendAnalytics('scroll_depth', { milestone });
            }
        });
    }, 500));
}

function trackTimeOnPage() {
    const startTime = Date.now();
    
    // Track when user leaves page
    window.addEventListener('beforeunload', () => {
        const timeOnPage = Math.round((Date.now() - startTime) / 1000);
        console.log(`⏰ Time on Page: ${timeOnPage} seconds`);
        
        // Send to analytics (in production)
        // sendAnalytics('time_on_page', { duration: timeOnPage });
    });
    
    // Track visibility changes
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            console.log('👁️ Page hidden');
        } else {
            console.log('👁️ Page visible');
        }
    });
}

// ============================================
// RESOURCE OPTIMIZATION
// ============================================

function optimizeResources() {
    // Prefetch critical resources
    prefetchCriticalResources();
    
    // Defer non-critical scripts
    deferNonCriticalScripts();
    
    // Monitor memory usage
    monitorMemoryUsage();
}

function prefetchCriticalResources() {
    const criticalResources = [
        // Add critical resources here
        // '/api/flight-data',
        // '/images/hero-bg.webp'
    ];
    
    criticalResources.forEach(url => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = url;
        document.head.appendChild(link);
    });
}

function deferNonCriticalScripts() {
    // Scripts to defer (loaded after critical content)
    const deferredScripts = document.querySelectorAll('script[data-defer]');
    
    deferredScripts.forEach(script => {
        script.setAttribute('defer', '');
    });
}

function monitorMemoryUsage() {
    if (performance.memory) {
        setInterval(() => {
            const memory = {
                used: formatBytes(performance.memory.usedJSHeapSize),
                total: formatBytes(performance.memory.totalJSHeapSize),
                limit: formatBytes(performance.memory.jsHeapSizeLimit)
            };
            
            console.log('💾 Memory Usage:', memory);
            
            // Warn if memory usage is high
            const usagePercent = (performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit) * 100;
            if (usagePercent > 80) {
                console.warn('⚠️ High memory usage detected:', usagePercent.toFixed(2) + '%');
            }
        }, 30000); // Check every 30 seconds
    }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

function sendAnalytics(eventName, data) {
    // In production, send to Google Analytics, Mixpanel, etc.
    console.log('📊 Analytics Event:', eventName, data);
    
    // Example: Google Analytics
    // if (typeof gtag !== 'undefined') {
    //     gtag('event', eventName, data);
    // }
}

// ============================================
// EXPORT
// ============================================

window.DestinovaPerformance = {
    measureCoreWebVitals,
    measurePageLoadMetrics,
    trackUserInteractions,
    sendAnalytics
};

console.log('✅ Destinova Performance module loaded');
