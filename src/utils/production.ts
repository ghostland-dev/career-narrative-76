// Performance monitoring
export const trackPerformance = () => {
  if (typeof window !== 'undefined' && 'performance' in window) {
    // Measure Core Web Vitals
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'navigation') {
          const navTiming = entry as PerformanceNavigationTiming;
          console.log('Page Load Time:', navTiming.loadEventEnd - navTiming.fetchStart);
        }
        
        if (entry.entryType === 'largest-contentful-paint') {
          console.log('LCP:', entry.startTime);
        }
        
        if (entry.entryType === 'first-input') {
          console.log('FID:', (entry as any).processingStart - entry.startTime);
        }
      }
    });

    observer.observe({ entryTypes: ['navigation', 'largest-contentful-paint', 'first-input'] });
  }
};

// Error tracking
export const trackError = (error: Error, errorInfo?: any) => {
  console.error('Application Error:', error, errorInfo);
  
  // In production, send to error tracking service
  if (process.env.NODE_ENV === 'production') {
    // Example: Sentry, LogRocket, etc.
    // Sentry.captureException(error);
  }
};

// User analytics
export const trackUserAction = (action: string, properties?: Record<string, any>) => {
  console.log('User Action:', action, properties);
  
  // In production, send to analytics service
  if (process.env.NODE_ENV === 'production') {
    // Example: Google Analytics, Mixpanel, etc.
    // gtag('event', action, properties);
  }
};

// Cache management
export const clearAppCache = () => {
  if ('caches' in window) {
    caches.keys().then((names) => {
      names.forEach((name) => {
        caches.delete(name);
      });
    });
  }
  
  // Clear localStorage
  localStorage.clear();
  
  // Reload page
  window.location.reload();
};

// Service Worker registration
export const registerServiceWorker = () => {
  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    });
  }
};