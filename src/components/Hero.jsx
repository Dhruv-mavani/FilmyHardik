import { TICKER_BRANDS } from '../data';
import Network from './Network';

const LINES = [
  { text: 'FILMY', start: 0, cls: 'line' },
  { text: 'HARDIK', start: 5, cls: 'line y' },
];

function TickerGroup({ hidden }) {
  return (
    <div className="tgroup" aria-hidden={hidden || undefined}>
      {TICKER_BRANDS.map((b) => (
        <span key={b}>{b}</span>
      )).flatMap((s, i) => [s, <i key={`s${i}`}>/</i>])}
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
              <defs><path id="circ" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" /></defs>
              <circle cx="100" cy="100" r="98" fill="#FFD60A" />
              <text textLength="478" lengthAdjust="spacing"><textPath href="#circ">TOTAL VIEWS • AND COUNTING • </textPath></text>
            </svg>
            <div className="badge-num">350M+</div>
          </div>
          <p className="net-hint mono">Move your cursor. Everything is connected.</p>
        </div>
      </div>
      <div className="ticker" aria-label="Brands worked with">
        <div className="track">
          <TickerGroup />
          <TickerGroup hidden />
        </div>
      </div>
    </section>
  );
}
