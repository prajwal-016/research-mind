import { useState, useEffect } from 'react';

/**
 * useMediaQuery — returns true when the given media query matches.
 *
 * @param {string} query - CSS media query string (e.g. "(max-width: 768px)")
 * @returns {boolean}
 *
 * @example
 * const isMobile = useMediaQuery('(max-width: 768px)');
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(
    () => window.matchMedia(query).matches
  );

  useEffect(() => {
    const mql = window.matchMedia(query);
    const handler = (e) => setMatches(e.matches);

    // Use addEventListener with { passive: true } for better performance
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

// Convenience breakpoint hooks
export const useMobile = () => useMediaQuery('(max-width: 767px)');
export const useTablet = () => useMediaQuery('(max-width: 1023px)');
export const useDesktop = () => useMediaQuery('(min-width: 1024px)');
