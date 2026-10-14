import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from './hooks';
import Nav from './components/Nav';
import Rail from './components/Rail';
import Hero from './components/Hero';
import Stats from './components/Stats';
import Platforms from './components/Platforms';
import Brands from './components/Brands';
import Contact from './components/Contact';
import Faq from './components/Faq';
import Footer from './components/Footer';
import { registerAgentTools } from './agent';

export default function App() {
  const glow = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const onMove = (e) => {
      if (glow.current) glow.current.style.transform = `translate(${e.clientX}px,${e.clientY}px)`;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  useEffect(() => registerAgentTools(), []);

  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <div className="glow" ref={glow} aria-hidden="true" />
      <Nav />
      <Rail />
      <main id="main">
        <Hero />
        <Stats />
        <Platforms />
        <Brands />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
