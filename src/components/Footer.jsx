import { EMAIL, PLATFORMS, SECTIONS } from '../data';
import { prefersReducedMotion } from '../hooks';
import Arrow from './Arrow';

const WORD = 'FILMYHARDIK';
const NAV = [
  ['numbers', 'Numbers'],
  ['platforms', 'Platforms'],
  ['brands', 'Brands'],
  ['contact', 'Contact'],
];

/** Giant FILMYHARDIK text scrolling behind the footer, rows alternating direction. */
const ROWS = [
  { cls: 'm-out', dir: 'l', top: '14%' },
  { cls: 'm-fill', dir: 'r', top: '50%' },
  { cls: 'm-out', dir: 'l', top: '86%' },
];

function MarqueeGroup() {
  return (
    <div className="bg-group">
      {Array.from({ length: 4 }, (_, i) => (
        <span key={i}>FILMYHARDIK<i>&#10022;</i></span>
      ))}
    </div>
  );
}

function BackdropMarquee() {
  return (
    <div className="bg-marquee" aria-hidden="true">
      {ROWS.map((r, i) => (
        <div key={i} className={`bg-row ${r.cls} dir-${r.dir}`} style={{ top: r.top }}>
          <div className="bg-track">
            <MarqueeGroup />
            <MarqueeGroup />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();
  const toTop = () => window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });

  return (
    <footer className="foot-x">
      <div className="foot-glow" aria-hidden="true" />
      <BackdropMarquee />
      <div className="wrap">
        <a className="foot-cta" href={`mailto:${EMAIL}?subject=Collab%20with%20Filmyhardik`}>
          <span className="mono">Got a brief?</span>
          <span className="foot-cta-text">
            <span className="cta-layer">Let's make<br />something<br /><em>viral</em></span>
            <span className="cta-layer cta-alt" aria-hidden="true">Let's make<br />something<br /><em>viral</em></span>
            <i className="foot-arrow" aria-hidden="true"><Arrow dir="ur" /></i>
          </span>
        </a>

        <div className="foot-grid">
          <nav className="foot-socials" aria-label="Social links">
            <span className="mono foot-h">Find me</span>
            {PLATFORMS.map((p) => (
              <a key={p.name} className="soc-row" href={p.href} target="_blank" rel="noopener">
                <span className="soc-logo"><img src={p.logo} alt="" draggable="false" /></span>
                <span className="soc-meta"><b>{p.name}</b><small>{p.handle}</small></span>
                <span className="soc-arrow" aria-hidden="true"><Arrow /></span>
              </a>
            ))}
          </nav>

          <div className="foot-side">
            <nav className="foot-links" aria-label="Sections">
              <span className="mono foot-h">Jump to</span>
              {NAV.filter(([id]) => SECTIONS.includes(id)).map(([id, label]) => (
                <a key={id} href={`#${id}`}>{label}</a>
              ))}
            </nav>
          </div>
        </div>
      </div>

      <div className="wrap foot-bottom">
        <span className="mono">&copy; {year} Filmyhardik. Made to be funny.</span>
        <button type="button" className="to-top mono" onClick={toTop}>Back to top <Arrow dir="u" /></button>
      </div>
    </footer>
  );
}
