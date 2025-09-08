import { useEffect, useRef } from 'react';

export const useTabVisibility = (onTabSwitch: () => void) => {
  const hasTriggered = useRef(false);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && !hasTriggered.current) {
        hasTriggered.current = true;
        onTabSwitch();
      }
    };

    const handleFocus = () => {
      if (hasTriggered.current) return;
    };

    const handleBlur = () => {
      if (!hasTriggered.current) {
        hasTriggered.current = true;
        onTabSwitch();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  }, [onTabSwitch]);
};