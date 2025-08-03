// Performance monitoring utilities
export const measurePerformance = () => {
  if (typeof window !== 'undefined' && 'performance' in window) {
    return {
      navigation: performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming,
      paint: performance.getEntriesByType('paint'),
      measure: (name: string, startMark: string, endMark: string) => {
        try {
          return performance.measure(name, startMark, endMark);
        } catch (error) {
          console.warn('Performance measurement failed:', error);
          return null;
        }
      },
      mark: (name: string) => {
        try {
          return performance.mark(name);
        } catch (error) {
          console.warn('Performance mark failed:', error);
          return null;
        }
      }
    };
  }
  return null;
};

// Debounce utility for performance optimization
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle utility for performance optimization
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Web Vitals tracking
export const trackWebVitals = () => {
  if (typeof window !== 'undefined') {
    // Track Core Web Vitals if available
    try {
      import('web-vitals').then((webVitals) => {
        if (webVitals.onCLS) webVitals.onCLS(console.log);
        if (webVitals.onINP) webVitals.onINP(console.log);
        if (webVitals.onFCP) webVitals.onFCP(console.log);
        if (webVitals.onLCP) webVitals.onLCP(console.log);
        if (webVitals.onTTFB) webVitals.onTTFB(console.log);
      });
    } catch (error) {
      console.warn('Web vitals tracking not available:', error);
    }
  }
};