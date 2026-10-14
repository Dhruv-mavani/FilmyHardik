import { useEffect, useRef, useState } from 'react';
import { TICKER_BRANDS } from '../data';
import Network from './Network';

const BADGE_TEXT = 'TOTAL VIEWS • AND COUNTING • ';

const LINES = [
  { text: 'FILMY', start: 0, cls: 'line' },
  { text: 'HARDIK', start: 5, cls: 'line y' },
];

function TickerGroup({ hidden }) {
  return (
    <div className="tgroup" aria-hidden={hidden || undefined}>
      {TICKER_BRANDS.map((b) => (
        <span key={b.name} className="logo-chip" style={b.scale ? { '--s': b.scale } : undefined}>
          <img src={b.logo} width={b.w} height={b.h} alt={hidden ? '' : b.name} decoding="async" draggable="false" />
        </span>
      ))}
    </div>
  );
}

/** Marquee track: waits for every logo to decode before it starts moving (no blank or jumping chips). */
function TickerTrack() {
  const ref = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;
    const imgs = [...ref.current.querySelectorAll('img')];
    const decoded = Promise.all(imgs.map((i) => (i.decode ? i.decode().catch(() => {}) : Promise.resolve())));
    const timeout = new Promise((r) => setTimeout(r, 6000)); // never block the marquee on a slow image
    Promise.race([decoded, timeout]).then(() => { if (alive) setReady(true); });
    return () => { alive = false; };
  }, []);

  return (
    <div className={`track${ready ? ' ready' : ''}`} ref={ref}>
      <TickerGroup />
      <TickerGroup hidden />
    </div>
  );
}

export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <div className="eyebrow mono"><span className="live" />Funny content creator</div>
          <h1 className="title">
            <span className="sr">Filmy Hardik</span>
            {LINES.map((l) => (
              <span key={l.text} className={l.cls} aria-hidden="true">
                {[...l.text].map((c, i) => (
                  <span key={i} className="ch" style={{ '--i': l.start + i }}>{c}</span>
                ))}
              </span>
            ))}
          </h1>
          <p className="tag">Brands pay me to be funny. Millions watch for free.</p>
          <p className="sub">I turn ads into content people actually finish watching. 350M+ views across Instagram, YouTube, Snapchat and Facebook.</p>
          <div className="cta-row">
            <a className="btn solid" href="#contact">Work with me</a>
            <a className="btn ghost" href="#brands">See the brands</a>
          </div>
        </div>
        <div className="net-wrap">
          <Network />
          <div className="badge" aria-hidden="true">
            <svg viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="98" fill="#FFD60A" />
              {/* one glyph per angle step: always wraps the full circle (textLength/textPath is ignored on many phones) */}
              {[...BADGE_TEXT].map((c, i) => (
                <text key={i} x="100" y="22" textAnchor="middle" transform={`rotate(${(i * 360 / BADGE_TEXT.length).toFixed(3)} 100 100)`}>{c}</text>
              ))}
            </svg>
            <div className="badge-num">350M+</div>
          </div>
          <p className="net-hint mono">
            <span className="hint-pointer">Move your cursor.</span>
            <span className="hint-touch">Touch, hold and swipe.</span> Everything is connected.
          </p>
        </div>
      </div>
      <div className="ticker" aria-label="Brands worked with">
        <TickerTrack />
      </div>
    </section>
  );
}
