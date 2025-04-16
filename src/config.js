// API Configuration
const config = {
  // API Endpoints
  apiBaseUrl: 'https://80yhq8e9rl.execute-api.us-east-1.amazonaws.com',
  
  // Feature flags
  features: {
    // Set to true to always use mock data instead of the API
    // Automatically enabled if we detect CSP issues
    useMockData: false,
    
    // Set to true to use mock data as fallback if the API fails
    useMockFallback: true,

    // Set this to true when testing locally without CSP issues
    allowDirectApiCalls: true
  }
};

// If we're in development mode, enable mock data by default
// This is a workaround for Content Security Policy issues
// You can set features.allowDirectApiCalls to true if you want to test the API directly
if (import.meta.env.DEV && !config.features.allowDirectApiCalls) {
  console.log('Development mode detected - using mock data to avoid CSP issues');
  config.features.useMockData = true;
}

export default config; 