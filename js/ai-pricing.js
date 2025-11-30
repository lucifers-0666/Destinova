/**
 * AI Pricing Display Module
 * Frontend utilities for displaying AI-optimized prices
 */

'use strict';

// API Endpoint
const PRICING_API_BASE = '/api/pricing';

/**
 * AI Pricing State
 */
const AIPricingState = {
  cachedPrices: new Map(),
  refreshInterval: null,
  lastRefresh: null,
  isRefreshing: false
};

/**
 * Fetch AI predicted price for a flight
 */
async function getAIPredictedPrice(flightId, searchDate = new Date()) {
  try {
    const response = await fetch(`${PRICING_API_BASE}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        flightId,
        searchDate: searchDate.toISOString()
      })
    });

    if (!response.ok) {
      throw new Error('Failed to get predicted price');
    }

    const result = await response.json();
    
    if (result.success) {
      // Cache the price
      AIPricingState.cachedPrices.set(flightId, {
        ...result.data,
        cachedAt: Date.now()
      });
      return result.data;
    }
    
    throw new Error(result.message || 'Unknown error');
  } catch (error) {
    console.error('[AIPricing] Error fetching price:', error);
    return null;
  }
}

/**
 * Fetch AI prices for multiple flights
 */
async function getAIPredictedPricesBatch(flightIds, searchDate = new Date()) {
  try {
    const response = await fetch(`${PRICING_API_BASE}/predict-batch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        flightIds,
        searchDate: searchDate.toISOString()
      })
    });

    if (!response.ok) {
      throw new Error('Failed to get predicted prices');
    }

    const result = await response.json();
    
    if (result.success) {
      // Cache all prices
      result.data.forEach(item => {
        AIPricingState.cachedPrices.set(item.flightId, {
          ...item,
          cachedAt: Date.now()
        });
      });
      return result.data;
    }
    
    throw new Error(result.message || 'Unknown error');
  } catch (error) {
    console.error('[AIPricing] Error fetching batch prices:', error);
    return [];
  }
}

/**
 * Get price history for a flight
 */
async function getPriceHistory(flightId, days = 30) {
  try {
    const response = await fetch(`${PRICING_API_BASE}/history/${flightId}?days=${days}`);
    
    if (!response.ok) {
      throw new Error('Failed to get price history');
    }

    const result = await response.json();
    return result.success ? result.data : null;
  } catch (error) {
    console.error('[AIPricing] Error fetching price history:', error);
    return null;
  }
}

/**
 * Get price trend for a route
 */
async function getPriceTrend(origin, destination, departureDate) {
  try {
    let url = `${PRICING_API_BASE}/trend?origin=${origin}&destination=${destination}`;
    if (departureDate) {
      url += `&departureDate=${departureDate}`;
    }

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to get price trend');
    }

    const result = await response.json();
    return result.success ? result.data : null;
  } catch (error) {
    console.error('[AIPricing] Error fetching price trend:', error);
    return null;
  }
}

/**
 * Format currency for display
 */
function formatPrice(amount, currency = 'INR') {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0
  }).format(amount);
}

/**
 * Get trend icon and color
 */
function getTrendDisplay(trend) {
  switch (trend) {
    case 'rising':
      return { icon: '↑', color: '#dc3545', label: 'Prices Rising', className: 'trend-rising' };
    case 'falling':
      return { icon: '↓', color: '#28a745', label: 'Prices Dropping', className: 'trend-falling' };
    default:
      return { icon: '→', color: '#6c757d', label: 'Prices Stable', className: 'trend-stable' };
  }
}

/**
 * Create AI price badge HTML
 */
function createAIPriceBadge(priceData) {
  if (!priceData) return '';

  const { basePrice, predictedPrice, discount, discountPercentage, trend, modelStatus } = priceData;
  const trendInfo = getTrendDisplay(trend);
  
  const hasDiscount = discount > 0;
  const isAI = modelStatus === 'ai';

  return `
    <div class="ai-price-container">
      <div class="ai-price-badge ${isAI ? 'ai-powered' : 'rule-based'}">
        <span class="ai-icon">${isAI ? '🤖' : '📊'}</span>
        <span class="ai-label">${isAI ? 'AI Optimized' : 'Dynamic'} Price</span>
      </div>
      
      ${hasDiscount ? `
        <div class="price-comparison">
          <span class="original-price">${formatPrice(basePrice)}</span>
          <span class="discount-badge">-${Math.abs(discountPercentage).toFixed(0)}%</span>
        </div>
      ` : ''}
      
      <div class="predicted-price ${hasDiscount ? 'has-discount' : ''}">
        ${formatPrice(predictedPrice)}
      </div>
      
      <div class="price-trend ${trendInfo.className}">
        <span class="trend-icon" style="color: ${trendInfo.color}">${trendInfo.icon}</span>
        <span class="trend-label">${trendInfo.label}</span>
      </div>
      
      <div class="price-disclaimer">
        <small>Prices may change based on demand</small>
      </div>
    </div>
  `;
}

/**
 * Create compact AI price display
 */
function createCompactAIPrice(priceData) {
  if (!priceData) return '';

  const { predictedPrice, trend, modelStatus } = priceData;
  const trendInfo = getTrendDisplay(trend);
  const isAI = modelStatus === 'ai';

  return `
    <span class="ai-price-compact">
      <span class="ai-badge-mini" title="${isAI ? 'AI Optimized' : 'Dynamic'} Price">
        ${isAI ? '🤖' : '📊'}
      </span>
      <span class="price-value">${formatPrice(predictedPrice)}</span>
      <span class="trend-mini ${trendInfo.className}" title="${trendInfo.label}">
        ${trendInfo.icon}
      </span>
    </span>
  `;
}

/**
 * Update flight card with AI pricing
 */
async function updateFlightCardWithAIPrice(cardElement, flightId) {
  const priceContainer = cardElement.querySelector('.price-container, .flight-price');
  if (!priceContainer) return;

  // Show loading state
  priceContainer.innerHTML = `
    <div class="ai-price-loading">
      <span class="loading-spinner"></span>
      <span>Loading price...</span>
    </div>
  `;

  // Fetch AI price
  const priceData = await getAIPredictedPrice(flightId);
  
  if (priceData) {
    priceContainer.innerHTML = createAIPriceBadge(priceData);
    
    // Store price data on the element for later use
    cardElement.dataset.aiPrice = priceData.predictedPrice;
    cardElement.dataset.trend = priceData.trend;
  } else {
    // Fallback to original price display
    priceContainer.innerHTML = `
      <div class="price-fallback">
        <span class="price-value">${formatPrice(cardElement.dataset.originalPrice || 0)}</span>
      </div>
    `;
  }
}

/**
 * Update multiple flight cards with AI pricing
 */
async function updateFlightCardsWithAIPrices(cardElements) {
  const flightIds = Array.from(cardElements).map(card => card.dataset.flightId).filter(Boolean);
  
  if (flightIds.length === 0) return;

  // Fetch all prices in batch
  const prices = await getAIPredictedPricesBatch(flightIds);
  
  // Create a map for quick lookup
  const priceMap = new Map(prices.map(p => [p.flightId, p]));

  // Update each card
  cardElements.forEach(card => {
    const flightId = card.dataset.flightId;
    const priceContainer = card.querySelector('.price-container, .flight-price');
    
    if (!priceContainer) return;

    const priceData = priceMap.get(flightId);
    
    if (priceData) {
      priceContainer.innerHTML = createAIPriceBadge(priceData);
      card.dataset.aiPrice = priceData.predictedPrice;
      card.dataset.trend = priceData.trend;
    }
  });
}

/**
 * Start automatic price refresh
 */
function startPriceRefresh(cardElements, intervalMinutes = 5) {
  // Clear existing interval
  if (AIPricingState.refreshInterval) {
    clearInterval(AIPricingState.refreshInterval);
  }

  // Set up new refresh interval
  AIPricingState.refreshInterval = setInterval(async () => {
    if (AIPricingState.isRefreshing) return;

    AIPricingState.isRefreshing = true;
    console.log('[AIPricing] Refreshing prices...');

    try {
      await updateFlightCardsWithAIPrices(cardElements);
      AIPricingState.lastRefresh = Date.now();
      
      // Show notification if prices changed
      showPriceUpdateNotification();
    } catch (error) {
      console.error('[AIPricing] Refresh error:', error);
    } finally {
      AIPricingState.isRefreshing = false;
    }
  }, intervalMinutes * 60 * 1000);
}

/**
 * Stop automatic price refresh
 */
function stopPriceRefresh() {
  if (AIPricingState.refreshInterval) {
    clearInterval(AIPricingState.refreshInterval);
    AIPricingState.refreshInterval = null;
  }
}

/**
 * Show price update notification
 */
function showPriceUpdateNotification() {
  // Check if any prices changed significantly
  let changesDetected = false;
  
  document.querySelectorAll('[data-ai-price]').forEach(card => {
    const cachedPrice = AIPricingState.cachedPrices.get(card.dataset.flightId);
    if (cachedPrice) {
      const oldPrice = parseFloat(card.dataset.lastPrice || cachedPrice.predictedPrice);
      const newPrice = parseFloat(card.dataset.aiPrice);
      
      if (Math.abs(oldPrice - newPrice) > 100) {
        changesDetected = true;
        card.dataset.lastPrice = newPrice;
      }
    }
  });

  if (changesDetected && typeof showNotification === 'function') {
    showNotification('💰 Prices have been updated', 'info');
  }
}

/**
 * Create price history chart (requires Chart.js)
 */
async function createPriceHistoryChart(containerId, flightId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const historyData = await getPriceHistory(flightId, 30);
  
  if (!historyData || !historyData.history || historyData.history.length === 0) {
    container.innerHTML = '<p class="no-history">No price history available</p>';
    return;
  }

  // Check if Chart.js is available
  if (typeof Chart === 'undefined') {
    console.warn('[AIPricing] Chart.js not loaded');
    container.innerHTML = '<p>Price history chart unavailable</p>';
    return;
  }

  // Prepare data for chart
  const labels = historyData.history.map(h => 
    new Date(h.timestamp).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })
  );
  const prices = historyData.history.map(h => h.price);

  // Create canvas
  container.innerHTML = '<canvas id="price-chart"></canvas>';
  const ctx = document.getElementById('price-chart').getContext('2d');

  new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Price (₹)',
        data: prices,
        borderColor: '#667eea',
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointBackgroundColor: '#667eea'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: (context) => `₹${context.raw.toLocaleString()}`
          }
        }
      },
      scales: {
        y: {
          beginAtZero: false,
          ticks: {
            callback: (value) => `₹${value.toLocaleString()}`
          }
        }
      }
    }
  });
}

/**
 * Initialize AI pricing for a page
 */
function initializeAIPricing(options = {}) {
  const {
    cardSelector = '.flight-card',
    autoRefresh = true,
    refreshInterval = 5 // minutes
  } = options;

  const cards = document.querySelectorAll(cardSelector);
  
  if (cards.length === 0) {
    console.log('[AIPricing] No flight cards found');
    return;
  }

  // Update all cards with AI prices
  updateFlightCardsWithAIPrices(cards);

  // Start auto-refresh if enabled
  if (autoRefresh) {
    startPriceRefresh(cards, refreshInterval);
  }

  // Clean up on page unload
  window.addEventListener('beforeunload', stopPriceRefresh);
}

// Export for use in other modules
window.AIPricing = {
  getAIPredictedPrice,
  getAIPredictedPricesBatch,
  getPriceHistory,
  getPriceTrend,
  formatPrice,
  createAIPriceBadge,
  createCompactAIPrice,
  updateFlightCardWithAIPrice,
  updateFlightCardsWithAIPrices,
  startPriceRefresh,
  stopPriceRefresh,
  createPriceHistoryChart,
  initializeAIPricing
};
