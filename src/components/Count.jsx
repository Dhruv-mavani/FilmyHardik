import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '../hooks';

/** Counts up from 0 to `to` the first time it scrolls into view. */
export default function Count({ to, suffix = '' }) {
  const ref = useRef(null);
  const [text, setText] = useState(`${to}${suffix}`);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion() || !('IntersectionObserver' in window)) return;
    if (el.getBoundingClientRect().top <= (window.innerHeight || 800) * 0.92) return;

    setText(`0${suffix}`);
    let raf = 0;
    const run = () => {
      let t0 = null;
      const dur = 1500;
      const step = (ts) => {
        if (t0 === null) t0 = ts;
        const p = Math.min(1, (ts - t0) / dur);
        const e = 1 - Math.pow(1 - p, 3);
        if (p < 1) { setText(`${Math.round(to * e)}`); raf = requestAnimationFrame(step); }
        else setText(`${to}${suffix}`);
      };
      raf = requestAnimationFrame(step);
    };
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) { run(); io.disconnect(); } }),
      { threshold: 0.6 }
    );
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [to, suffix]);

  return <span ref={ref} className="count">{text}</span>;
}
