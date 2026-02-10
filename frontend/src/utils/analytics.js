// Google Analytics / Tracking utilities
// Replace with your actual tracking IDs

export const initializeAnalytics = () => {
  // Google Analytics 4
  if (typeof window.gtag !== 'undefined') {
    window.gtag('js', new Date());
    window.gtag('config', 'G-XXXXXXXXXX'); // Replace with your GA4 ID
  }
};

export const trackPageView = (url) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('config', 'G-XXXXXXXXXX', {
      page_path: url,
    });
  }
};

export const trackEvent = (action, category, label, value) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Helper functions for common events
export const trackCVDownload = (template) => {
  trackEvent('download', 'CV', `Template: ${template}`);
};

export const trackPresentationExport = (format) => {
  trackEvent('export', 'Presentation', `Format: ${format}`);
};

export const trackImageDownload = (type, source) => {
  trackEvent('download', type, source);
};

export const trackTemplateSelect = (type, templateName) => {
  trackEvent('select', type, templateName);
};
