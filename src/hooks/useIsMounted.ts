import { useState, useEffect } from 'react';

/**
 * Hook to check if component is mounted (useful for animations on first render)
 * This pattern is commonly used across components for entry animations
 */
export function useIsMounted(): boolean {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}
