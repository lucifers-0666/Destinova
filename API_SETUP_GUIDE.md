# 🔑 FREE API Keys Setup Guide

## Get Real-Time Flight Data (100% FREE!)

Follow these simple steps to connect your website to live flight APIs.

---

## 🚀 Option 1: AviationStack (Recommended)

**Perfect for beginners and small projects**

### Features (Free Tier)
- ✅ 1000 API calls/month
- ✅ Real-time airport data
- ✅ Flight schedules
- ✅ Live flight tracking
- ✅ Historical data
- ✅ No credit card required

### Step-by-Step Setup

#### 1. Sign Up
1. Visit: **https://aviationstack.com/**
2. Click **"Sign Up Free"** button
3. Fill in details:
   - Email address
   - Password
   - Accept terms
4. Click **"Create Account"**

#### 2. Verify Email
1. Check your email inbox
2. Click verification link
3. Account activated!

#### 3. Get API Key
1. Log in to dashboard
2. Click **"Quickstart"** or **"Dashboard"**
3. You'll see your API Access Key
4. Click **"Copy"** button

#### 4. Add to Your Code

Open: `js/flight-api.js`

Find line 15 and replace:
```javascript
// BEFORE
aviationStack: {
    apiKey: 'YOUR_AVIATIONSTACK_API_KEY',
    
// AFTER
aviationStack: {
    apiKey: 'a1b2c3d4e5f6g7h8i9j0',  // Your actual key
```

Find line 37 and change:
```javascript
// BEFORE
activeProvider: 'local'

// AFTER
activeProvider: 'aviationStack'
```

#### 5. Test It!

Open browser console:
```javascript
window.FlightAPI.fetchAirportsFromAPI('Mumbai').then(console.log);
```

Should see live data! 🎉

---

## 🌟 Option 2: Amadeus (Most Comprehensive)

**Best for serious projects and production apps**

### Features (Free Tier)
- ✅ 2000 API calls/month
- ✅ Flight search & booking
- ✅ Hotel search
- ✅ Airport data
- ✅ Flight price analysis
- ✅ No credit card required

### Step-by-Step Setup

#### 1. Sign Up
1. Visit: **https://developers.amadeus.com/**
2. Click **"Register"**
3. Fill in:
   - Email
   - Password
   - Company name (can be personal)
4. Agree to terms
5. Click **"Create Account"**

#### 2. Verify Email
1. Check inbox
2. Click verification link
3. Complete profile

#### 3. Create App
1. Go to **"My Self-Service Workspace"**
2. Click **"Create New App"**
3. Enter details:
   - App name: "Destinova Flight Booking"
   - Description: "Flight search website"
4. Click **"Create"**

#### 4. Get Credentials
1. Click on your app name
2. You'll see:
   - **API Key** (Client ID)
   - **API Secret** (Client Secret)
3. Click **"Show"** to reveal
4. Copy both

#### 5. Add to Your Code

Open: `js/flight-api.js`

Find line 22 and replace:
```javascript
// BEFORE
amadeus: {
    apiKey: 'YOUR_AMADEUS_API_KEY',
    apiSecret: 'YOUR_AMADEUS_API_SECRET',

// AFTER
amadeus: {
    apiKey: 'a1B2c3D4e5F6g7H8',           // Your API Key
    apiSecret: 'x9Y8z7W6v5U4t3S2r1Q0',    // Your API Secret
```

Find line 37 and change:
```javascript
activeProvider: 'amadeus'
```

#### 6. Test It!

```javascript
window.FlightAPI.fetchAirportsFromAPI('Paris').then(console.log);
```

---

## 🔥 Option 3: RapidAPI (Multiple Providers)

**Access many APIs with one key**

### Features
- ✅ 100+ flight APIs
- ✅ Single API key
- ✅ Various free tiers
- ✅ Easy management
- ✅ No credit card needed

### Step-by-Step Setup

#### 1. Sign Up
1. Visit: **https://rapidapi.com/**
2. Click **"Sign Up"**
3. Use:
   - Email signup, OR
   - Google account, OR
   - GitHub account

#### 2. Find Flight API
1. Click **"Hub"** in top menu
2. Search: **"flight data"** or **"airports"**
3. Popular options:
   - Flight Radar (Free: 500 calls/month)
   - AeroDataBox (Free: 150 calls/month)
   - Aviation Stack (via RapidAPI)

#### 3. Subscribe
1. Click on API you like
2. Click **"Pricing"** tab
3. Select **"Basic"** (Free) plan
4. Click **"Subscribe"**
5. Confirm (no payment needed)

#### 4. Get API Key
1. Go to **"Endpoints"** tab
2. You'll see code snippets
3. Look for:
   ```
   'X-RapidAPI-Key': 'abc123...'
   ```
4. That's your API key!

#### 5. Add to Your Code

Open: `js/flight-api.js`

Find line 30 and replace:
```javascript
rapidApi: {
    apiKey: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6',  // Your key
    baseUrl: 'https://flight-radar1.p.rapidapi.com',
    host: 'flight-radar1.p.rapidapi.com'
}
```

Change provider:
```javascript
activeProvider: 'rapidApi'
```

---

## 🎯 Which One Should You Choose?

### Choose **AviationStack** if:
- ✅ You're just starting
- ✅ Need quick setup
- ✅ Want airport data mainly
- ✅ Small project

### Choose **Amadeus** if:
- ✅ Building serious project
- ✅ Need flight booking
- ✅ Want hotel integration
- ✅ Need more API calls

### Choose **RapidAPI** if:
- ✅ Want multiple providers
- ✅ Like unified dashboard
- ✅ Exploring options
- ✅ Need flexibility

---

## 🛠️ Configuration Guide

### Current Setup (Default)

```javascript
// File: js/flight-api.js, Line 37
activeProvider: 'local'  // Uses built-in database
```

### With AviationStack

```javascript
// 1. Add your key (line 15)
aviationStack: {
    apiKey: 'YOUR_KEY_HERE',
    baseUrl: 'http://api.aviationstack.com/v1',
    endpoints: {
        airports: '/airports',
        flights: '/flights',
        cities: '/cities',
        countries: '/countries'
    }
},

// 2. Change provider (line 37)
activeProvider: 'aviationStack'
```

### With Amadeus

```javascript
// 1. Add credentials (line 22)
amadeus: {
    apiKey: 'YOUR_KEY',
    apiSecret: 'YOUR_SECRET',
    baseUrl: 'https://test.api.amadeus.com/v1',
    endpoints: {
        airports: '/reference-data/locations',
        flightOffers: '/shopping/flight-offers',
        flightDates: '/shopping/flight-dates'
    }
},

// 2. Change provider (line 37)
activeProvider: 'amadeus'
```

### With RapidAPI

```javascript
// 1. Add key (line 30)
rapidApi: {
    apiKey: 'YOUR_KEY',
    baseUrl: 'https://flight-radar1.p.rapidapi.com',
    host: 'flight-radar1.p.rapidapi.com'
},

// 2. Change provider (line 37)
activeProvider: 'rapidApi'
```

---

## 🧪 Testing Your API

### Test in Browser Console

```javascript
// Check if API is configured
console.log(FLIGHT_API_CONFIG.activeProvider);
// Should show: 'aviationStack', 'amadeus', or 'rapidApi'

// Test search
window.FlightAPI.fetchAirportsFromAPI('London')
    .then(results => {
        console.log('Found', results.length, 'airports');
        console.log(results);
    })
    .catch(error => {
        console.error('API Error:', error);
    });
```

### Expected Response

**Success:**
```javascript
[
    {
        code: 'LHR',
        name: 'London Heathrow Airport',
        city: 'London',
        country: 'United Kingdom',
        countryCode: 'GB',
        lat: 51.47,
        lon: -0.45
    },
    // ... more airports
]
```

**Error:**
```javascript
{
    error: 'Invalid API key'
}
```

---

## 🚨 Troubleshooting

### "Invalid API Key" Error

**Problem:** API key not working

**Solutions:**
1. ✅ Check key copied correctly (no spaces)
2. ✅ Verify email confirmed
3. ✅ Check key is for correct API
4. ✅ Wait 5-10 minutes after signup
5. ✅ Regenerate key if needed

### "Rate Limit Exceeded" Error

**Problem:** Used all monthly calls

**Solutions:**
1. ✅ Switch to `activeProvider: 'local'`
2. ✅ Wait for next month
3. ✅ Upgrade to paid tier
4. ✅ Use different API provider
5. ✅ Cache API responses

### "CORS Error" in Console

**Problem:** Browser blocking API

**Solutions:**
1. ✅ Check API supports CORS
2. ✅ Use HTTPS (not HTTP)
3. ✅ Add proxy if needed
4. ✅ Use server-side calls
5. ✅ Switch to local database

### "No Response" from API

**Problem:** API not responding

**Solutions:**
1. ✅ Check internet connection
2. ✅ Verify API endpoint URL
3. ✅ Check API status page
4. ✅ Try different browser
5. ✅ Clear browser cache

---

## 📊 API Usage Tracking

### Monitor Your Usage

**AviationStack:**
- Dashboard → Usage Statistics
- See calls per day/month
- Get alerts at 80%

**Amadeus:**
- My Apps → Analytics
- Real-time tracking
- Download reports

**RapidAPI:**
- Dashboard → Usage
- Per-API breakdown
- Email notifications

### Stay Within Limits

```javascript
// Add request counter
let requestCount = 0;
const MAX_REQUESTS = 1000; // Per month

async function apiCall() {
    if (requestCount >= MAX_REQUESTS) {
        console.warn('API limit reached, using local data');
        return window.FlightAPI.searchAirports(query);
    }
    
    requestCount++;
    return await fetch(apiUrl);
}
```

---

## 💡 Pro Tips

### 1. Cache API Responses
```javascript
// Save results for 24 hours
const cache = new Map();
const CACHE_DURATION = 24 * 60 * 60 * 1000;

async function cachedFetch(query) {
    const cached = cache.get(query);
    if (cached && Date.now() - cached.time < CACHE_DURATION) {
        return cached.data;
    }
    
    const data = await fetchFromAPI(query);
    cache.set(query, { data, time: Date.now() });
    return data;
}
```

### 2. Fallback Strategy
```javascript
// Try API, fallback to local
async function smartSearch(query) {
    try {
        return await window.FlightAPI.fetchAirportsFromAPI(query);
    } catch (error) {
        console.warn('API failed, using local data');
        return window.FlightAPI.searchAirports(query);
    }
}
```

### 3. Load on Demand
```javascript
// Only load API when user starts typing
let apiReady = false;

input.addEventListener('focus', async () => {
    if (!apiReady) {
        await loadAPIConfig();
        apiReady = true;
    }
});
```

---

## 🎯 Quick Reference

| Provider | Calls/Month | Best For | Setup Time |
|----------|-------------|----------|------------|
| **Local DB** | Unlimited | Testing, small projects | 0 min |
| **AviationStack** | 1,000 | Beginners, airport data | 2 min |
| **Amadeus** | 2,000 | Production, booking | 5 min |
| **RapidAPI** | Varies | Multiple sources | 3 min |

---

## ✅ Checklist

- [ ] Signed up for API
- [ ] Verified email
- [ ] Got API key/credentials
- [ ] Added to js/flight-api.js
- [ ] Changed activeProvider
- [ ] Tested in console
- [ ] Verified autocomplete works
- [ ] Checked usage dashboard
- [ ] Set up monitoring
- [ ] Added error handling

---

## 🎉 You're All Set!

Your website now has:
- ✅ Live airport data
- ✅ Real-time search
- ✅ Worldwide coverage
- ✅ Professional API integration

**Start searching flights! 🌍✈️**

---

**Questions? Check FLIGHT_API_GUIDE.md for full documentation!**
