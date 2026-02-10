import React from 'react';

// Empty ad components - ads have been removed for a cleaner experience
export const PopUnderTrigger = () => null;
export const NativeBannerAd = () => null;
export const LargeBannerAd = () => null;
export const MediumBannerAd = () => null;
export const AdWrapper = () => null;

// Interstitial component that just passes through without showing ads
export const InterstitialAd = ({ isOpen, onClose, onContinue }) => {
  React.useEffect(() => {
    if (isOpen) {
      // Immediately continue without showing ad
      onContinue();
      onClose();
    }
  }, [isOpen, onContinue, onClose]);
  
  return null;
};

export default AdWrapper;
