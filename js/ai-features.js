/**
 * DESTINOVA - AI FEATURES & SMART RECOMMENDATIONS
 * Phase 3: AI-Powered Search, Autocomplete & Personalization
 * 
 * Features:
 * - Smart destination autocomplete
 * - AI-powered recommendations
 * - User behavior analysis
 * - Personalized search results
 * - Trending destinations
 */

// ============================================
// AIRPORT DATABASE (SAMPLE)
// ============================================

const POPULAR_AIRPORTS = [
    { code: 'DEL', city: 'Delhi', name: 'Indira Gandhi International', country: 'India', lat: 28.5562, lon: 77.1000 },
    { code: 'BOM', city: 'Mumbai', name: 'Chhatrapati Shivaji Maharaj International', country: 'India', lat: 19.0896, lon: 72.8656 },
    { code: 'BLR', city: 'Bangalore', name: 'Kempegowda International', country: 'India', lat: 13.1986, lon: 77.7066 },
    { code: 'MAA', city: 'Chennai', name: 'Chennai International', country: 'India', lat: 12.9941, lon: 80.1709 },
    { code: 'HYD', city: 'Hyderabad', name: 'Rajiv Gandhi International', country: 'India', lat: 17.2403, lon: 78.4294 },
    { code: 'CCU', city: 'Kolkata', name: 'Netaji Subhas Chandra Bose International', country: 'India', lat: 22.6547, lon: 88.4467 },
    { code: 'DXB', city: 'Dubai', name: 'Dubai International', country: 'UAE', lat: 25.2532, lon: 55.3657 },
    { code: 'SIN', city: 'Singapore', name: 'Singapore Changi', country: 'Singapore', lat: 1.3644, lon: 103.9915 },
    { code: 'LHR', city: 'London', name: 'Heathrow', country: 'UK', lat: 51.4700, lon: -0.4543 },
    { code: 'JFK', city: 'New York', name: 'John F. Kennedy International', country: 'USA', lat: 40.6413, lon: -73.7781 },
    { code: 'CDG', city: 'Paris', name: 'Charles de Gaulle', country: 'France', lat: 49.0097, lon: 2.5479 },
    { code: 'HKG', city: 'Hong Kong', name: 'Hong Kong International', country: 'Hong Kong', lat: 22.3080, lon: 113.9185 },
    { code: 'NRT', city: 'Tokyo', name: 'Narita International', country: 'Japan', lat: 35.7720, lon: 140.3929 },
    { code: 'SYD', city: 'Sydney', name: 'Sydney Kingsford Smith', country: 'Australia', lat: -33.9399, lon: 151.1753 },
    { code: 'BKK', city: 'Bangkok', name: 'Suvarnabhumi', country: 'Thailand', lat: 13.6900, lon: 100.7501 },
    { code: 'KUL', city: 'Kuala Lumpur', name: 'Kuala Lumpur International', country: 'Malaysia', lat: 2.7456, lon: 101.7072 },
    { code: 'IST', city: 'Istanbul', name: 'Istanbul Airport', country: 'Turkey', lat: 41.2753, lon: 28.7519 },
    { code: 'AMS', city: 'Amsterdam', name: 'Amsterdam Schiphol', country: 'Netherlands', lat: 52.3105, lon: 4.7683 },
    { code: 'FRA', city: 'Frankfurt', name: 'Frankfurt Airport', country: 'Germany', lat: 50.0379, lon: 8.5622 },
    { code: 'ICN', city: 'Seoul', name: 'Incheon International', country: 'South Korea', lat: 37.4602, lon: 126.4407 }
];

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🤖 AI features module initialized');
    
    initSmartAutocomplete();
    initRecommendationEngine();
    initTrendingDestinations();
    initPriceInsights();
});

// ============================================
// SMART AUTOCOMPLETE
// ============================================

function initSmartAutocomplete() {
    const fromInput = document.getElementById('fromLocation');
    const toInput = document.getElementById('toLocation');
    
    if (fromInput) setupAutocomplete(fromInput, 'from');
    if (toInput) setupAutocomplete(toInput, 'to');
}

function setupAutocomplete(input, type) {
    let autocompleteList = null;
    let selectedIndex = -1;
    
    // Create autocomplete container
    const container = document.createElement('div');
    container.className = 'autocomplete-dropdown';
    container.setAttribute('role', 'listbox');
    input.parentElement.style.position = 'relative';
    input.parentElement.appendChild(container);
    
    // Input event
    input.addEventListener('input', debounce(function(e) {
        const query = e.target.value.trim();
        
        if (query.length < 2) {
            hideAutocomplete(container);
            return;
        }
        
        const results = searchAirports(query, type);
        showAutocomplete(container, results, input, type);
    }, 300));
    
    // Keyboard navigation
    input.addEventListener('keydown', (e) => {
        const items = container.querySelectorAll('.autocomplete-item');
        
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            selectedIndex = Math.min(selectedIndex + 1, items.length - 1);
            updateSelection(items, selectedIndex);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            selectedIndex = Math.max(selectedIndex - 1, -1);
            updateSelection(items, selectedIndex);
        } else if (e.key === 'Enter' && selectedIndex >= 0) {
            e.preventDefault();
            items[selectedIndex]?.click();
        } else if (e.key === 'Escape') {
            hideAutocomplete(container);
        }
    });
    
    // Close on outside click
    document.addEventListener('click', (e) => {
        if (!input.contains(e.target) && !container.contains(e.target)) {
            hideAutocomplete(container);
        }
    });
}

function searchAirports(query, type) {
    const q = query.toLowerCase();
    
    // Get recent searches
    const recentSearches = getRecentSearches(type);
    
    // Search airports
    const airportMatches = POPULAR_AIRPORTS.filter(airport => {
        return airport.city.toLowerCase().includes(q) ||
               airport.code.toLowerCase().includes(q) ||
               airport.name.toLowerCase().includes(q) ||
               airport.country.toLowerCase().includes(q);
    }).slice(0, 5);
    
    // Combine with recent searches
    const results = {
        recent: recentSearches.filter(s => s.toLowerCase().includes(q)).slice(0, 2),
        airports: airportMatches,
        suggestions: generateSmartSuggestions(query, type)
    };
    
    return results;
}

function showAutocomplete(container, results, input, type) {
    container.innerHTML = '';
    
    // Recent searches
    if (results.recent.length > 0) {
        const recentHeader = document.createElement('div');
        recentHeader.className = 'autocomplete-header';
        recentHeader.textContent = 'Recent Searches';
        container.appendChild(recentHeader);
        
        results.recent.forEach(search => {
            const item = createAutocompleteItem(search, 'recent', input);
            container.appendChild(item);
        });
    }
    
    // Airport matches
    if (results.airports.length > 0) {
        const airportHeader = document.createElement('div');
        airportHeader.className = 'autocomplete-header';
        airportHeader.textContent = 'Airports';
        container.appendChild(airportHeader);
        
        results.airports.forEach(airport => {
            const item = createAirportItem(airport, input, type);
            container.appendChild(item);
        });
    }
    
    // Smart suggestions
    if (results.suggestions.length > 0) {
        const suggestionHeader = document.createElement('div');
        suggestionHeader.className = 'autocomplete-header';
        suggestionHeader.textContent = '💡 AI Suggestions';
        container.appendChild(suggestionHeader);
        
        results.suggestions.forEach(suggestion => {
            const item = createSuggestionItem(suggestion, input);
            container.appendChild(item);
        });
    }
    
    // No results
    if (results.airports.length === 0 && results.suggestions.length === 0) {
        const noResults = document.createElement('div');
        noResults.className = 'autocomplete-no-results';
        noResults.textContent = 'No airports found';
        container.appendChild(noResults);
    }
    
    container.style.display = 'block';
    
    // Animate in
    gsap.fromTo(container,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.2 }
    );
}

function createAirportItem(airport, input, type) {
    const item = document.createElement('div');
    item.className = 'autocomplete-item';
    item.setAttribute('role', 'option');
    item.innerHTML = `
        <div class="airport-icon">
            <i class="fas fa-plane"></i>
        </div>
        <div class="airport-info">
            <div class="airport-city">${airport.city}, ${airport.country}</div>
            <div class="airport-name">${airport.name} (${airport.code})</div>
        </div>
    `;
    
    item.addEventListener('click', () => {
        input.value = `${airport.city} (${airport.code})`;
        hideAutocomplete(item.closest('.autocomplete-dropdown'));
        
        // Save to recent searches
        saveRecentSearch(type, `${airport.city} (${airport.code})`);
        
        // Trigger validation
        input.dispatchEvent(new Event('blur'));
        
        // Move focus to next field
        const nextField = getNextField(input);
        nextField?.focus();
    });
    
    return item;
}

function createAutocompleteItem(text, icon, input) {
    const item = document.createElement('div');
    item.className = 'autocomplete-item';
    item.setAttribute('role', 'option');
    item.innerHTML = `
        <div class="airport-icon">
            <i class="fas fa-${icon === 'recent' ? 'clock-rotate-left' : 'lightbulb'}"></i>
        </div>
        <div class="airport-info">
            <div class="airport-city">${text}</div>
        </div>
    `;
    
    item.addEventListener('click', () => {
        input.value = text;
        hideAutocomplete(item.closest('.autocomplete-dropdown'));
    });
    
    return item;
}

function createSuggestionItem(suggestion, input) {
    const item = document.createElement('div');
    item.className = 'autocomplete-item suggestion-item';
    item.setAttribute('role', 'option');
    item.innerHTML = `
        <div class="airport-icon">
            <i class="fas fa-sparkles"></i>
        </div>
        <div class="airport-info">
            <div class="airport-city">${suggestion.text}</div>
            <div class="suggestion-reason">${suggestion.reason}</div>
        </div>
    `;
    
    item.addEventListener('click', () => {
        input.value = suggestion.text;
        hideAutocomplete(item.closest('.autocomplete-dropdown'));
    });
    
    return item;
}

function hideAutocomplete(container) {
    if (!container) return;
    
    gsap.to(container, {
        opacity: 0,
        y: -10,
        duration: 0.15,
        onComplete: () => {
            container.style.display = 'none';
        }
    });
}

function updateSelection(items, index) {
    items.forEach((item, i) => {
        if (i === index) {
            item.classList.add('selected');
            item.scrollIntoView({ block: 'nearest' });
        } else {
            item.classList.remove('selected');
        }
    });
}

// ============================================
// SMART SUGGESTIONS
// ============================================

function generateSmartSuggestions(query, type) {
    const profile = window.DestinovaInteractive?.getUserProfile() || { searchHistory: [] };
    const suggestions = [];
    
    // Based on search history
    if (profile.searchHistory.length > 0) {
        const recentDestinations = profile.searchHistory
            .map(s => type === 'from' ? s.from : s.to)
            .filter(d => d && d.toLowerCase().includes(query.toLowerCase()));
        
        if (recentDestinations.length > 0) {
            suggestions.push({
                text: recentDestinations[0],
                reason: 'You searched this before'
            });
        }
    }
    
    // Popular this week
    const trendingDestinations = getTrendingDestinations();
    const trending = trendingDestinations.find(d => 
        d.toLowerCase().includes(query.toLowerCase())
    );
    
    if (trending) {
        suggestions.push({
            text: trending,
            reason: '🔥 Trending this week'
        });
    }
    
    return suggestions.slice(0, 2);
}

// ============================================
// RECOMMENDATION ENGINE
// ============================================

function initRecommendationEngine() {
    const profile = window.DestinovaInteractive?.getUserProfile() || { searchHistory: [] };
    
    if (profile.searchHistory.length >= 3) {
        showPersonalizedBanner();
    }
}

function showPersonalizedBanner() {
    const profile = window.DestinovaInteractive?.getUserProfile();
    if (!profile || profile.searchHistory.length === 0) return;
    
    // Analyze user preferences
    const preferences = analyzeUserPreferences(profile);
    
    // Show recommendation banner
    setTimeout(() => {
        const bannerHTML = `
            <div class="recommendation-banner" role="complementary" aria-label="Personalized recommendations">
                <button class="banner-close" aria-label="Close banner">
                    <i class="fas fa-times"></i>
                </button>
                <div class="banner-icon">💡</div>
                <div class="banner-content">
                    <h3>Personalized for You</h3>
                    <p>${preferences.message}</p>
                </div>
            </div>
        `;
        
        const heroSection = document.querySelector('.hero-section');
        if (heroSection) {
            heroSection.insertAdjacentHTML('afterend', bannerHTML);
            
            // Animate in
            const banner = document.querySelector('.recommendation-banner');
            gsap.fromTo(banner,
                { opacity: 0, y: -20 },
                { opacity: 1, y: 0, duration: 0.5, delay: 2 }
            );
            
            // Close button
            banner.querySelector('.banner-close')?.addEventListener('click', () => {
                gsap.to(banner, {
                    opacity: 0,
                    y: -20,
                    duration: 0.3,
                    onComplete: () => banner.remove()
                });
            });
        }
    }, 3000);
}

function analyzeUserPreferences(profile) {
    const searches = profile.searchHistory;
    
    // Most searched destination
    const destinations = searches.map(s => s.to);
    const destinationCounts = {};
    destinations.forEach(d => {
        destinationCounts[d] = (destinationCounts[d] || 0) + 1;
    });
    
    const mostSearched = Object.keys(destinationCounts).sort((a, b) => 
        destinationCounts[b] - destinationCounts[a]
    )[0];
    
    // Travel pattern
    const isWeekendTraveler = searches.filter(s => {
        const date = new Date(s.departDate);
        const day = date.getDay();
        return day === 5 || day === 6; // Friday or Saturday
    }).length > searches.length / 2;
    
    let message = '';
    if (mostSearched) {
        message = `You often search for ${mostSearched}. Check out similar destinations!`;
    } else if (isWeekendTraveler) {
        message = 'We noticed you love weekend getaways. Here are some quick trips!';
    } else {
        message = 'Based on your searches, we think you\'ll love these destinations.';
    }
    
    return { mostSearched, isWeekendTraveler, message };
}

// ============================================
// TRENDING DESTINATIONS
// ============================================

function initTrendingDestinations() {
    const trending = getTrendingDestinations();
    
    // Add trending badges to destination cards
    document.querySelectorAll('.destination-card').forEach(card => {
        const name = card.querySelector('.destination-name')?.textContent || '';
        
        if (trending.some(t => name.includes(t))) {
            addTrendingBadge(card);
        }
    });
}

function getTrendingDestinations() {
    // In production, this would come from API
    return ['Paris', 'Dubai', 'Tokyo', 'Singapore', 'London'];
}

function addTrendingBadge(card) {
    const badge = document.createElement('div');
    badge.className = 'trending-badge';
    badge.innerHTML = '<i class="fas fa-fire"></i> Trending';
    
    const imageWrapper = card.querySelector('.destination-image');
    if (imageWrapper) {
        imageWrapper.parentElement.style.position = 'relative';
        imageWrapper.parentElement.insertBefore(badge, imageWrapper);
        
        // Animate in
        gsap.fromTo(badge,
            { opacity: 0, scale: 0.8 },
            { 
                opacity: 1, 
                scale: 1, 
                duration: 0.4, 
                delay: 0.5,
                ease: 'back.out(1.5)'
            }
        );
    }
}

// ============================================
// PRICE INSIGHTS
// ============================================

function initPriceInsights() {
    // Show price drop notifications
    const profile = window.DestinovaInteractive?.getUserProfile();
    if (!profile || profile.searchHistory.length === 0) return;
    
    // Simulate price drop for recent search
    setTimeout(() => {
        const recentSearch = profile.searchHistory[0];
        if (recentSearch) {
            showPriceDropNotification(recentSearch);
        }
    }, 10000); // 10 seconds after load
}

function showPriceDropNotification(search) {
    const notification = {
        title: 'Price Alert! 📉',
        message: `Flights to ${search.to} dropped by ₹2,500!`,
        action: 'View Deals',
        type: 'success'
    };
    
    window.DestinovaInteractive?.showToast(
        `${notification.title} ${notification.message}`,
        notification.type,
        8000
    );
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function getRecentSearches(type) {
    const profile = window.DestinovaInteractive?.getUserProfile() || { searchHistory: [] };
    const searches = profile.searchHistory
        .map(s => type === 'from' ? s.from : s.to)
        .filter(s => s && s.trim() !== '');
    
    // Remove duplicates and return last 5
    return [...new Set(searches)].slice(0, 5);
}

function saveRecentSearch(type, value) {
    // Saved via search.js and interactive.js
    console.log(`Saved recent search: ${type} = ${value}`);
}

function getNextField(currentInput) {
    const form = currentInput.closest('form');
    if (!form) return null;
    
    const inputs = Array.from(form.querySelectorAll('input, select'));
    const currentIndex = inputs.indexOf(currentInput);
    return inputs[currentIndex + 1] || null;
}

// ============================================
// EXPORT
// ============================================

window.DestinovaAI = {
    searchAirports,
    generateSmartSuggestions,
    analyzeUserPreferences,
    getTrendingDestinations
};

console.log('✅ Destinova AI features loaded');
