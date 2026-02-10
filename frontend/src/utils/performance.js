// Performance monitoring utilities

export const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    }).catch(() => {
      console.log('Web Vitals not available');
    });
  }
};

export const logPerformanceMetrics = () => {
  if (window.performance && window.performance.timing) {
    const perfData = window.performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
    const connectTime = perfData.responseEnd - perfData.requestStart;
    const renderTime = perfData.domComplete - perfData.domLoading;

    console.log('Performance Metrics:', {
      pageLoadTime: `${pageLoadTime}ms`,
      connectTime: `${connectTime}ms`,
      renderTime: `${renderTime}ms`,
    });
  }
};

// Measure component render time
export const measureRenderTime = (componentName, callback) => {
  const startTime = performance.now();
  
  const result = callback();
  
  const endTime = performance.now();
  const renderTime = endTime - startTime;
  
  if (renderTime > 16.67) { // More than one frame (60fps)
    console.warn(`${componentName} render time: ${renderTime.toFixed(2)}ms`);
  }
  
  return result;
};
