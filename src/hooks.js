import { useEffect, useRef, useState } from 'react';

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Arms an element only if it starts below the fold; disarms once it scrolls into view. */
export function useReveal() {
  const ref = useRef(null);
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion() || !('IntersectionObserver' in window)) return;
    if (el.getBoundingClientRect().top <= (window.innerHeight || 800) * 0.92) return;
    setArmed(true);
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) { setArmed(false); io.disconnect(); } }),
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return [ref, armed];
}

/** Which section id is crossing the middle of the viewport. */
export function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0]);

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    const so = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); }),
      { rootMargin: '-45% 0px -50% 0px' }
    );
    ids.forEach((id) => { const s = document.getElementById(id); if (s) so.observe(s); });
    return () => so.disconnect();
  }, [ids]);

  return active;
}

/** Page scroll progress, 0..1. */
export function useScrollProgress() {
  const [p, setP] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setP(h > 0 ? Math.min(1, Math.max(0, window.scrollY / h)) : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return p;
}
