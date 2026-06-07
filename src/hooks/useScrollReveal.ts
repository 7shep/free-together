import { useEffect } from 'react';

/**
 * Observes every `.reveal` element on the page and adds the `in` class when it
 * scrolls into view, mirroring the IntersectionObserver in the original design.
 * Call once near the root.
 */
export function useScrollReveal(): void {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('.reveal');
    if (els.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.16 },
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}
