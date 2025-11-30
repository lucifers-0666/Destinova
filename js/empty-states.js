/**
 * Empty State Components for Destinova
 * Reusable empty state templates for various scenarios
 */

const EmptyStates = {
  /**
   * No Search Results
   */
  noSearchResults: (searchQuery = '') => `
    <div class="empty-state empty-state-no-results">
      <div class="empty-state-icon empty-state-icon-animated">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
      </div>
      <h3 class="empty-state-title">No flights found</h3>
      <p class="empty-state-description">
        ${searchQuery 
          ? `We couldn't find any flights matching "${searchQuery}". Try adjusting your search criteria.`
          : 'We couldn\'t find any flights for your search. Try different dates or destinations.'}
      </p>
      <div class="empty-state-actions">
        <button class="empty-state-action" onclick="window.history.back()">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Modify Search
        </button>
        <a href="/html/destinations.html" class="empty-state-action empty-state-action-secondary">
          Browse Destinations
        </a>
      </div>
      <div class="empty-state-tips">
        <h4 class="empty-state-tips-title">Search Tips</h4>
        <ul class="empty-state-tips-list">
          <li>Try flexible dates for better options</li>
          <li>Consider nearby airports</li>
          <li>Check for connecting flights</li>
        </ul>
      </div>
    </div>
  `,

  /**
   * No Bookings
   */
  noBookings: () => `
    <div class="empty-state empty-state-no-bookings">
      <div class="empty-state-icon empty-state-icon-animated">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
            d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
        </svg>
      </div>
      <h3 class="empty-state-title">No bookings yet</h3>
      <p class="empty-state-description">
        You haven't made any bookings yet. Start exploring flights and book your next adventure!
      </p>
      <a href="/html/index.html" class="empty-state-action">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        Search Flights
      </a>
    </div>
  `,

  /**
   * No Upcoming Bookings
   */
  noUpcomingBookings: () => `
    <div class="empty-state empty-state-no-bookings">
      <div class="empty-state-icon">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
            d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
        </svg>
      </div>
      <h3 class="empty-state-title">No upcoming trips</h3>
      <p class="empty-state-description">
        You don't have any upcoming flights scheduled. Ready to plan your next trip?
      </p>
      <a href="/html/index.html" class="empty-state-action">
        Book a Flight
      </a>
    </div>
  `,

  /**
   * No Reviews
   */
  noReviews: () => `
    <div class="empty-state empty-state-no-reviews">
      <div class="empty-state-icon">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
            d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
        </svg>
      </div>
      <h3 class="empty-state-title">No reviews yet</h3>
      <p class="empty-state-description">
        Be the first to share your experience! Your review helps other travelers make informed decisions.
      </p>
    </div>
  `,

  /**
   * No Notifications
   */
  noNotifications: () => `
    <div class="empty-state empty-state-no-notifications empty-state-compact">
      <div class="empty-state-icon">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
            d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
        </svg>
      </div>
      <h3 class="empty-state-title">All caught up!</h3>
      <p class="empty-state-description">
        You don't have any notifications at the moment.
      </p>
    </div>
  `,

  /**
   * No Price Alerts
   */
  noPriceAlerts: () => `
    <div class="empty-state">
      <div class="empty-state-icon empty-state-icon-animated">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
            d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0M10.5 8.25h3l-3 4.5h3" />
        </svg>
      </div>
      <h3 class="empty-state-title">No price alerts set</h3>
      <p class="empty-state-description">
        Set up price alerts to get notified when flight prices drop for your favorite routes.
      </p>
      <button class="empty-state-action" onclick="openPriceAlertModal()">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Create Price Alert
      </button>
    </div>
  `,

  /**
   * No Saved Travelers
   */
  noSavedTravelers: () => `
    <div class="empty-state empty-state-compact">
      <div class="empty-state-icon">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
            d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
        </svg>
      </div>
      <h3 class="empty-state-title">No saved travelers</h3>
      <p class="empty-state-description">
        Save traveler details for faster booking in the future.
      </p>
      <button class="empty-state-action" onclick="openAddTravelerModal()">
        Add Traveler
      </button>
    </div>
  `,

  /**
   * Error State
   */
  error: (message = 'Something went wrong', retryCallback = null) => `
    <div class="empty-state empty-state-error">
      <div class="empty-state-icon">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      </div>
      <h3 class="empty-state-title">Oops! Something went wrong</h3>
      <p class="empty-state-description">${message}</p>
      ${retryCallback ? `
        <button class="empty-state-action" onclick="${retryCallback}">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          Try Again
        </button>
      ` : ''}
    </div>
  `,

  /**
   * Offline State
   */
  offline: () => `
    <div class="empty-state empty-state-offline empty-state-full">
      <div class="empty-state-icon">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
            d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z" />
        </svg>
      </div>
      <h3 class="empty-state-title">You're offline</h3>
      <p class="empty-state-description">
        Please check your internet connection and try again. Some features may be unavailable while offline.
      </p>
      <button class="empty-state-action" onclick="window.location.reload()">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
            d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
        </svg>
        Retry
      </button>
    </div>
  `,

  /**
   * Coming Soon
   */
  comingSoon: (feature = 'This feature') => `
    <div class="empty-state empty-state-coming-soon">
      <div class="empty-state-icon empty-state-icon-animated">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
            d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
        </svg>
      </div>
      <h3 class="empty-state-title">Coming Soon!</h3>
      <p class="empty-state-description">
        ${feature} is currently under development. Stay tuned for updates!
      </p>
      <a href="/html/index.html" class="empty-state-action empty-state-action-secondary">
        Back to Home
      </a>
    </div>
  `,

  /**
   * 404 Not Found
   */
  notFound: () => `
    <div class="empty-state empty-state-full">
      <div class="empty-state-icon">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
            d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
        </svg>
      </div>
      <h3 class="empty-state-title">Page Not Found</h3>
      <p class="empty-state-description">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div class="empty-state-actions">
        <a href="/html/index.html" class="empty-state-action">
          Go to Homepage
        </a>
        <button class="empty-state-action empty-state-action-secondary" onclick="window.history.back()">
          Go Back
        </button>
      </div>
    </div>
  `,

  /**
   * No Payment Methods
   */
  noPaymentMethods: () => `
    <div class="empty-state empty-state-compact">
      <div class="empty-state-icon">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
            d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
        </svg>
      </div>
      <h3 class="empty-state-title">No saved payment methods</h3>
      <p class="empty-state-description">
        Add a payment method for faster checkout.
      </p>
      <button class="empty-state-action" onclick="openAddPaymentModal()">
        Add Payment Method
      </button>
    </div>
  `
};

// Helper function to render empty state
function renderEmptyState(container, type, options = {}) {
  const element = typeof container === 'string' 
    ? document.querySelector(container) 
    : container;
  
  if (!element) return;
  
  const emptyStateFunc = EmptyStates[type];
  if (typeof emptyStateFunc === 'function') {
    element.innerHTML = emptyStateFunc(options);
  }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { EmptyStates, renderEmptyState };
}
