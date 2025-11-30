/**
 * 🔌 DESTINOVA API INTEGRATION LAYER
 * Complete API communication with token management, retry logic, and interceptors
 * 
 * Base URL: http://localhost:4000/api
 */

const API_CONFIG = {
    baseUrl: 'http://localhost:4000/api',
    timeout: 15000, // 15 seconds
    maxRetries: 3,
    retryDelay: 1000, // 1 second
    headers: {
        'Content-Type': 'application/json'
    }
};

// ============================================
// TOKEN MANAGEMENT
// ============================================

const TokenManager = {
    ACCESS_TOKEN_KEY: 'destinova_access_token',
    REFRESH_TOKEN_KEY: 'destinova_refresh_token',
    USER_KEY: 'destinova_user',

    getAccessToken() {
        return localStorage.getItem(this.ACCESS_TOKEN_KEY);
    },

    getRefreshToken() {
        return localStorage.getItem(this.REFRESH_TOKEN_KEY);
    },

    setTokens(accessToken, refreshToken) {
        localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
        if (refreshToken) {
            localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
        }
        localStorage.setItem('isUserSignedIn', 'true');
    },

    setUser(user) {
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    },

    getUser() {
        const user = localStorage.getItem(this.USER_KEY);
        return user ? JSON.parse(user) : null;
    },

    clearTokens() {
        localStorage.removeItem(this.ACCESS_TOKEN_KEY);
        localStorage.removeItem(this.REFRESH_TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);
        localStorage.removeItem('isUserSignedIn');
    },

    isAuthenticated() {
        return !!this.getAccessToken();
    },

    // Check if token is expired (JWT decode)
    isTokenExpired(token) {
        if (!token) return true;
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.exp * 1000 < Date.now();
        } catch {
            return true;
        }
    }
};

// ============================================
// REQUEST INTERCEPTOR
// ============================================

function requestInterceptor(config) {
    const token = TokenManager.getAccessToken();
    
    if (token) {
        config.headers = {
            ...config.headers,
            'Authorization': `Bearer ${token}`
        };
    }

    return config;
}

// ============================================
// RESPONSE INTERCEPTOR
// ============================================

async function responseInterceptor(response, originalRequest) {
    // Handle 401 Unauthorized - attempt token refresh
    if (response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        
        const refreshed = await attemptTokenRefresh();
        if (refreshed) {
            // Retry the original request with new token
            originalRequest.headers['Authorization'] = `Bearer ${TokenManager.getAccessToken()}`;
            return fetch(originalRequest.url, originalRequest);
        } else {
            // Refresh failed, clear tokens and redirect to login
            TokenManager.clearTokens();
            window.dispatchEvent(new CustomEvent('auth:logout', { detail: { reason: 'session_expired' } }));
            throw new Error('Session expired. Please login again.');
        }
    }

    return response;
}

// ============================================
// TOKEN REFRESH
// ============================================

let isRefreshing = false;
let refreshSubscribers = [];

function subscribeTokenRefresh(callback) {
    refreshSubscribers.push(callback);
}

function onTokenRefreshed(token) {
    refreshSubscribers.forEach(callback => callback(token));
    refreshSubscribers = [];
}

async function attemptTokenRefresh() {
    if (isRefreshing) {
        return new Promise(resolve => {
            subscribeTokenRefresh(token => resolve(!!token));
        });
    }

    isRefreshing = true;
    const refreshToken = TokenManager.getRefreshToken();

    if (!refreshToken) {
        isRefreshing = false;
        return false;
    }

    try {
        const response = await fetch(`${API_CONFIG.baseUrl}/auth/refresh-token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken })
        });

        if (response.ok) {
            const data = await response.json();
            TokenManager.setTokens(data.data.accessToken, data.data.refreshToken);
            onTokenRefreshed(data.data.accessToken);
            isRefreshing = false;
            return true;
        }
    } catch (error) {
        console.error('Token refresh failed:', error);
    }

    isRefreshing = false;
    onTokenRefreshed(null);
    return false;
}

// ============================================
// ERROR HANDLING
// ============================================

class APIError extends Error {
    constructor(message, status, data = null) {
        super(message);
        this.name = 'APIError';
        this.status = status;
        this.data = data;
    }
}

function handleError(error, response) {
    // Network errors
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
        throw new APIError('Network error. Please check your internet connection.', 0);
    }

    // Timeout errors
    if (error.name === 'AbortError') {
        throw new APIError('Request timed out. Please try again.', 408);
    }

    // API errors with response
    if (response) {
        const message = error.message || `Request failed with status ${response.status}`;
        throw new APIError(message, response.status, error);
    }

    throw error;
}

// ============================================
// RETRY LOGIC
// ============================================

async function fetchWithRetry(url, options, retries = API_CONFIG.maxRetries) {
    for (let i = 0; i <= retries; i++) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

            const response = await fetch(url, {
                ...options,
                signal: controller.signal
            });

            clearTimeout(timeoutId);
            return response;
        } catch (error) {
            if (i === retries) throw error;
            
            // Only retry on network errors or 5xx errors
            if (error.name !== 'TypeError' && error.name !== 'AbortError') {
                throw error;
            }

            // Wait before retrying with exponential backoff
            await new Promise(resolve => 
                setTimeout(resolve, API_CONFIG.retryDelay * Math.pow(2, i))
            );
        }
    }
}

// ============================================
// CORE HTTP METHODS
// ============================================

const http = {
    async request(method, url, data = null, customHeaders = {}) {
        const fullUrl = url.startsWith('http') ? url : `${API_CONFIG.baseUrl}${url}`;
        
        let config = {
            method,
            url: fullUrl,
            headers: {
                ...API_CONFIG.headers,
                ...customHeaders
            }
        };

        if (data && method !== 'GET') {
            config.body = JSON.stringify(data);
        }

        // Apply request interceptor
        config = requestInterceptor(config);

        try {
            let response = await fetchWithRetry(config.url, config);
            
            // Apply response interceptor
            response = await responseInterceptor(response, config);

            const contentType = response.headers.get('content-type');
            let responseData;

            if (contentType && contentType.includes('application/json')) {
                responseData = await response.json();
            } else {
                responseData = await response.text();
            }

            if (!response.ok) {
                const errorMessage = responseData?.message || responseData?.error || `Request failed with status ${response.status}`;
                throw new APIError(errorMessage, response.status, responseData);
            }

            return responseData;
        } catch (error) {
            if (error instanceof APIError) throw error;
            handleError(error);
        }
    },

    async get(url, params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const fullUrl = queryString ? `${url}?${queryString}` : url;
        return this.request('GET', fullUrl);
    },

    async post(url, data) {
        return this.request('POST', url, data);
    },

    async put(url, data) {
        return this.request('PUT', url, data);
    },

    async patch(url, data) {
        return this.request('PATCH', url, data);
    },

    async delete(url) {
        return this.request('DELETE', url);
    },

    async uploadFile(url, formData, onProgress = null) {
        const fullUrl = `${API_CONFIG.baseUrl}${url}`;
        const token = TokenManager.getAccessToken();

        const headers = {};
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        // Don't set Content-Type for FormData - browser will set it with boundary

        try {
            const response = await fetch(fullUrl, {
                method: 'POST',
                headers,
                body: formData
            });

            const contentType = response.headers.get('content-type');
            const responseData = contentType && contentType.includes('application/json')
                ? await response.json()
                : await response.text();

            if (!response.ok) {
                throw new APIError(responseData?.message || 'Upload failed', response.status, responseData);
            }

            return responseData;
        } catch (error) {
            if (error instanceof APIError) throw error;
            handleError(error);
        }
    }
};

// ============================================
// AUTH API
// ============================================

const AuthAPI = {
    async register(userData) {
        const response = await http.post('/auth/register', userData);
        
        if (response.success && response.data) {
            const { accessToken, refreshToken, user } = response.data;
            TokenManager.setTokens(accessToken, refreshToken);
            TokenManager.setUser(user);
        }
        
        return response;
    },

    async login(email, password) {
        const response = await http.post('/auth/login', { email, password });
        
        if (response.success && response.data) {
            const { accessToken, refreshToken, user } = response.data;
            TokenManager.setTokens(accessToken, refreshToken);
            TokenManager.setUser(user);
        }
        
        return response;
    },

    async logout() {
        try {
            await http.post('/auth/logout');
        } catch (error) {
            console.warn('Logout API call failed:', error);
        } finally {
            TokenManager.clearTokens();
            window.dispatchEvent(new CustomEvent('auth:logout'));
        }
        return { success: true, message: 'Logged out successfully' };
    },

    async forgotPassword(email) {
        return http.post('/auth/forgot-password', { email });
    },

    async resetPassword(token, newPassword) {
        return http.post('/auth/reset-password', { token, newPassword });
    },

    async verifyEmail(token) {
        return http.get(`/auth/verify-email/${token}`);
    },

    async refreshToken() {
        const success = await attemptTokenRefresh();
        return { success };
    },

    async getMe() {
        const response = await http.get('/auth/me');
        if (response.success && response.data) {
            TokenManager.setUser(response.data);
        }
        return response;
    },

    isAuthenticated() {
        return TokenManager.isAuthenticated();
    },

    getUser() {
        return TokenManager.getUser();
    }
};

// ============================================
// FLIGHT API
// ============================================

const FlightAPI = {
    async searchFlights(params) {
        return http.get('/flights/search', params);
    },

    async getFlightById(flightId) {
        return http.get(`/flights/${flightId}`);
    },

    async getFlightStatus(flightNumber, date) {
        return http.get(`/flights/status/${flightNumber}`, { date });
    },

    async getPopularRoutes() {
        return http.get('/flights/popular');
    },

    async getAllFlights(params = {}) {
        return http.get('/flights', params);
    }
};

// ============================================
// BOOKING API
// ============================================

const BookingAPI = {
    async createBooking(bookingData) {
        return http.post('/bookings', bookingData);
    },

    async getMyBookings(params = {}) {
        return http.get('/bookings/my', params);
    },

    async getBookingById(bookingId) {
        return http.get(`/bookings/${bookingId}`);
    },

    async getBookingByReference(reference) {
        return http.get(`/bookings/reference/${reference}`);
    },

    async cancelBooking(bookingId, reason = '') {
        return http.put(`/bookings/${bookingId}/cancel`, { reason });
    },

    async getBookingStats() {
        return http.get('/bookings/stats');
    }
};

// ============================================
// PAYMENT API
// ============================================

const PaymentAPI = {
    async createPaymentIntent(bookingId, paymentMethod = 'card') {
        return http.post('/payments/create-intent', { bookingId, paymentMethod });
    },

    async confirmPayment(paymentIntentId, bookingId) {
        return http.post('/payments/confirm', { paymentIntentId, bookingId });
    },

    async processRefund(bookingId, reason) {
        return http.post(`/payments/refund/${bookingId}`, { reason });
    },

    async getPaymentHistory(params = {}) {
        return http.get('/payments/history', params);
    },

    async getPaymentById(paymentId) {
        return http.get(`/payments/${paymentId}`);
    }
};

// ============================================
// USER API
// ============================================

const UserAPI = {
    async getProfile() {
        return http.get('/users/profile');
    },

    async updateProfile(profileData) {
        return http.put('/users/profile', profileData);
    },

    async changePassword(currentPassword, newPassword) {
        return http.put('/users/change-password', { currentPassword, newPassword });
    },

    async uploadProfilePicture(formData) {
        return http.uploadFile('/users/profile-picture', formData);
    },

    async deleteAccount() {
        return http.delete('/users/profile');
    },

    async getBookingStats() {
        return http.get('/users/booking-stats');
    },

    async updateNotificationPreferences(preferences) {
        return http.put('/users/notification-preferences', preferences);
    },

    async addSavedAddress(address) {
        return http.post('/users/addresses', address);
    },

    async deleteSavedAddress(addressId) {
        return http.delete(`/users/addresses/${addressId}`);
    },

    async redeemLoyaltyPoints(points, bookingId) {
        return http.post('/users/redeem-points', { points, bookingId });
    }
};

// ============================================
// DESTINATION API
// ============================================

const DestinationAPI = {
    async getAllDestinations(params = {}) {
        return http.get('/destinations', params);
    },

    async getFeaturedDestinations(limit = 8) {
        return http.get('/destinations/featured', { limit });
    },

    async getPopularDestinations(limit = 10) {
        return http.get('/destinations/popular', { limit });
    },

    async getDestinationById(id) {
        return http.get(`/destinations/${id}`);
    },

    async getDestinationByCode(code) {
        return http.get(`/destinations/code/${code}`);
    },

    async searchDestinations(query) {
        return http.get('/destinations/search', { q: query });
    },

    async getDestinationsByContinent(continent, params = {}) {
        return http.get(`/destinations/continent/${continent}`, params);
    }
};

// ============================================
// REVIEW API
// ============================================

const ReviewAPI = {
    async createReview(reviewData) {
        return http.post('/reviews', reviewData);
    },

    async getFlightReviews(flightId, params = {}) {
        return http.get(`/reviews/flight/${flightId}`, params);
    },

    async getAirlineReviews(airline, params = {}) {
        return http.get(`/reviews/airline/${encodeURIComponent(airline)}`, params);
    },

    async getMyReviews(params = {}) {
        return http.get('/reviews/my/reviews', params);
    },

    async getReviewById(reviewId) {
        return http.get(`/reviews/${reviewId}`);
    },

    async updateReview(reviewId, reviewData) {
        return http.put(`/reviews/${reviewId}`, reviewData);
    },

    async deleteReview(reviewId) {
        return http.delete(`/reviews/${reviewId}`);
    },

    async voteReview(reviewId, helpful) {
        return http.post(`/reviews/${reviewId}/vote`, { helpful });
    },

    async reportReview(reviewId, reason) {
        return http.post(`/reviews/${reviewId}/report`, { reason });
    }
};

// ============================================
// PRICE ALERT API
// ============================================

const PriceAlertAPI = {
    async createAlert(alertData) {
        return http.post('/price-alerts', alertData);
    },

    async getMyAlerts(params = {}) {
        return http.get('/price-alerts/my', params);
    },

    async getAlertById(alertId) {
        return http.get(`/price-alerts/${alertId}`);
    },

    async updateAlert(alertId, alertData) {
        return http.put(`/price-alerts/${alertId}`, alertData);
    },

    async deleteAlert(alertId) {
        return http.delete(`/price-alerts/${alertId}`);
    },

    async getPriceHistory(origin, destination) {
        return http.get('/price-alerts/price-history', { origin, destination });
    },

    async getAlertSuggestions() {
        return http.get('/price-alerts/suggestions');
    }
};

// ============================================
// HOTEL API
// ============================================

const HotelAPI = {
    async searchHotels(params) {
        return http.get('/hotels', params);
    },

    async getHotelById(hotelId) {
        return http.get(`/hotels/${hotelId}`);
    }
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

const APIUtils = {
    // Format API errors for display
    formatError(error) {
        if (error instanceof APIError) {
            return {
                message: error.message,
                status: error.status,
                isNetworkError: error.status === 0,
                isAuthError: error.status === 401,
                isValidationError: error.status === 400,
                isNotFound: error.status === 404,
                isServerError: error.status >= 500
            };
        }
        return {
            message: error.message || 'An unexpected error occurred',
            status: 0,
            isNetworkError: true
        };
    },

    // Build query string from object
    buildQueryString(params) {
        return new URLSearchParams(
            Object.entries(params).filter(([_, v]) => v != null && v !== '')
        ).toString();
    },

    // Parse JWT token
    parseToken(token) {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload;
        } catch {
            return null;
        }
    },

    // Check if error is retryable
    isRetryableError(error) {
        if (error instanceof APIError) {
            return error.status === 0 || error.status >= 500;
        }
        return false;
    }
};

// ============================================
// GLOBAL EVENT LISTENERS
// ============================================

// Listen for auth logout events
window.addEventListener('auth:logout', (event) => {
    const { reason } = event.detail || {};
    if (reason === 'session_expired') {
        // Show notification to user
        if (typeof showToast === 'function') {
            showToast('Your session has expired. Please login again.', 'warning');
        }
    }
    // Redirect to login page if not already there
    if (!window.location.pathname.includes('sign-in')) {
        window.location.href = '/html/sign-in.html';
    }
});

// ============================================
// EXPORT API
// ============================================

// ES Module export (if using modules)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        http,
        TokenManager,
        AuthAPI,
        FlightAPI,
        BookingAPI,
        PaymentAPI,
        UserAPI,
        DestinationAPI,
        ReviewAPI,
        PriceAlertAPI,
        HotelAPI,
        APIUtils,
        APIError,
        API_CONFIG
    };
}

// Global window export for browser usage
if (typeof window !== 'undefined') {
    window.DestinovaAPI = {
        http,
        TokenManager,
        Auth: AuthAPI,
        Flight: FlightAPI,
        Booking: BookingAPI,
        Payment: PaymentAPI,
        User: UserAPI,
        Destination: DestinationAPI,
        Review: ReviewAPI,
        PriceAlert: PriceAlertAPI,
        Hotel: HotelAPI,
        Utils: APIUtils,
        APIError,
        config: API_CONFIG
    };

    // Also export individual APIs for convenience
    window.AuthAPI = AuthAPI;
    window.FlightAPI = FlightAPI;
    window.BookingAPI = BookingAPI;
    window.PaymentAPI = PaymentAPI;
    window.UserAPI = UserAPI;
    window.DestinationAPI = DestinationAPI;
    window.ReviewAPI = ReviewAPI;
    window.PriceAlertAPI = PriceAlertAPI;
    window.HotelAPI = HotelAPI;
    window.TokenManager = TokenManager;
}
