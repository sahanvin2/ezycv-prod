// Ad Helper - Advertisement Integration
// Currently disabled for development/testing

/**
 * Shows an advertisement and then proceeds with the callback function
 * Ads are currently disabled - immediately calls the callback
 * @param {Function} callback - Function to execute after ad is shown
 * @param {string} downloadType - Type of download (for tracking)
 */
export const showAdBeforeDownload = (callback, downloadType = 'file') => {
  // Ads disabled - proceed immediately with callback
  if (callback) callback();
};

// createAdOverlay function removed - not needed while ads are disabled

const adHelper = { showAdBeforeDownload };
export default adHelper;
