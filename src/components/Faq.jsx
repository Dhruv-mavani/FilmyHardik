import { useEffect, useRef, useState } from 'react';
import { FAQ, SITE } from '../seo-data';
import { EMAIL, PHONE_HREF, PHONE_TEXT, PLATFORMS, TICKER_BRANDS } from '../data';
import { prefersReducedMotion } from '../hooks';
import Reveal from './Reveal';
import Arrow from './Arrow';

const AUTO_MS = 7000;
const STEP_VH = 55;   // scroll distance per tab in pinned (desktop) mode
const PIN_TOP = 96;   // px below the fixed nav

/** Counts up from 0 each time a panel opens. Server/first paint shows the final value. */
function CountUp({ to, suffix = '' }) {
  const [text, setText] = useState(`${to}${suffix}`);
  useEffect(() => {
    if (prefersReducedMotion()) return;
    let raf = 0, t0 = null;
    const step = (ts) => {
      if (t0 === null) t0 = ts;
      const p = Math.min(1, (ts - t0) / 1100);
      setText(p < 1 ? `${Math.round(to * (1 - Math.pow(1 - p, 3)))}${suffix}` : `${to}${suffix}`);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    setText(`0${suffix}`);
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [to, suffix]);
  return <span>{text}</span>;
}

const LogoChip = ({ src, name, w, h, scale, d = 0 }) => (
  <span className="logo-chip mini qa-pop" style={{ '--d': d, ...(scale ? { '--s': scale } : null) }}>
    <img src={src} width={w} height={h} alt={name} decoding="async" draggable="false" />
  </span>
);

const brand = (name) => TICKER_BRANDS.find((b) => b.name === name);

/* One short, visual answer per FAQ entry (same order as FAQ). */
const PANELS = [
  // Who
  () => (
    <div className="qa-who">
      <div className="qa-fh qa-in" style={{ '--d': 0 }}>FH</div>
      <div className="qa-in" style={{ '--d': 1 }}>
        <p className="qa-big">Funny<br />first.</p>
        <p className="qa-sub">Ads people finish watching, and share.</p>
      </div>
      <div className="qa-logos qa-in" style={{ '--d': 2 }}>
        {PLATFORMS.map((p, i) => <LogoChip key={p.name} src={p.logo} name={p.name} d={i} />)}
      </div>
    </div>
  ),
  // Views
  () => (
    <div className="qa-stack">
      <p className="qa-big qa-in" style={{ '--d': 0 }}><CountUp to={350} suffix="M+" /></p>
      <p className="qa-sub qa-in" style={{ '--d': 1 }}>total views</p>
      {[['Instagram', '300M+', '86%', PLATFORMS[0]], ['Everywhere else', '50M+', '14%', null]].map(([label, val, w, p], i) => (
        <div className="qa-row qa-in" style={{ '--d': 2 + i }} key={label}>
          <span className="qa-lab">{p ? <LogoChip src={p.logo} name={label} /> : label}</span>
          <span className="qa-track"><i style={{ '--w': w }} /></span>
          <b className="qa-val">{val}</b>
        </div>
      ))}
      <div className="qa-aud qa-in" style={{ '--d': 4 }}>
        {SITE.socials.slice(0, 3).map((s) => (
          <span key={s.name}><b>{s.audience.split(' ')[0]}</b> {s.name}</span>
        ))}
      </div>
    </div>
  ),
  // Brands
  () => (
    <div className="qa-stack">
      <p className="qa-big qa-in" style={{ '--d': 0 }}><CountUp to={19} /></p>
      <p className="qa-sub qa-in" style={{ '--d': 1 }}>brands and events</p>
      <div className="qa-wall">
        {TICKER_BRANDS.map((b, i) => <LogoChip key={b.name} src={b.logo} name={b.name} w={b.w} h={b.h} scale={b.scale} d={2 + i * 0.5} />)}
      </div>
    </div>
  ),
  // Biggest
  () => (
    <div className="qa-camps">
      {[['Head & Shoulders', 9, '100%', 'Biggest one yet'], ['Red Label Chai', 4, '91%', 'One campaign']].map(([name, n, w, note], i) => {
        const b = brand(name);
        return (
          <div className="qa-camp qa-in" style={{ '--d': i * 2 }} key={name}>
            <div className="qa-camp-top">
              <LogoChip src={b.logo} name={name} w={b.w} h={b.h} />
              <span className="mono">{note}</span>
            </div>
            <p className="qa-big"><CountUp to={n} suffix="M+" /></p>
            <span className="qa-track"><i style={{ '--w': w }} /></span>
          </div>
        );
      })}
    </div>
  ),
  // Collab
  () => (
    <div className="qa-stack">
      <p className="qa-big qa-in" style={{ '--d': 0 }}>Send<br />the brief.</p>
      <p className="qa-sub qa-in" style={{ '--d': 1 }}>Get an idea people actually want to share.</p>
      <div className="qa-actions">
        <a className="qa-act solid qa-in qa-act-form" style={{ '--d': 2 }} href="#contact"><span><small className="mono">Form</small>Send a brief</span><Arrow dir="ur" /></a>
        <a className="qa-act qa-in qa-act-mail" style={{ '--d': 3 }} href={`mailto:${EMAIL}`}><span><small className="mono">Email</small>{EMAIL}</span><Arrow dir="ur" /></a>
        <a className="qa-act qa-in qa-act-call" style={{ '--d': 4 }} href={PHONE_HREF}><span><small className="mono">Call</small>{PHONE_TEXT}</span><Arrow dir="ur" /></a>
      </div>
    </div>
  ),
  // Content
  () => (
    <div className="qa-stack">
      <div className="qa-tags">
        {['Funny', 'Ad-first', 'Made to share'].map((t, i) => <span key={t} className="qa-tag qa-pop" style={{ '--d': i, '--r': `${[-3, 2, -2][i]}deg` }}>{t}</span>)}
      </div>
      <p className="qa-sub qa-in" style={{ '--d': 3 }}>Skits and short videos, made for</p>
      <div className="qa-logos qa-in" style={{ '--d': 4 }}>
        {PLATFORMS.map((p, i) => <LogoChip key={p.name} src={p.logo} name={p.name} d={i} />)}
      </div>
    </div>
  ),
];

const LABELS = ['Who', 'Views', 'Brands', 'Biggest', 'Collab', 'Content'];

export default function Faq() {
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(false);
  const [paused, setPaused] = useState(false);
  const [pinned, setPinned] = useState(false);
  const list = useRef(null);
  const tabs = useRef([]);
  const swipe = useRef(null);
  const track = useRef(null);
  const pin = useRef(null);
  const [pinH, setPinH] = useState(560);
  const n = FAQ.length;

  // Autoplay only with a real pointer (hover) and motion allowed; any manual choice stops it for good.
  useEffect(() => {
    const canHover = window.matchMedia && window.matchMedia('(hover: hover)').matches;
    setAuto(canHover && !prefersReducedMotion());
  }, []);

  // Desktop: the deck pins to the screen and scrolling steps through the tabs (scrollytelling).
  useEffect(() => {
    if (!window.matchMedia) return;
    const mq = window.matchMedia('(min-width: 901px) and (hover: hover)');
    const on = () => setPinned(mq.matches && !prefersReducedMotion());
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);

  useEffect(() => {
    if (!pinned) return;
    setAuto(false);
    const ro = new ResizeObserver(() => pin.current && setPinH(pin.current.offsetHeight));
    ro.observe(pin.current);
    let raf = 0, idx = -1;
    const update = () => {
      raf = 0;
      const t = track.current, el = pin.current;
      if (!t || !el) return;
      const dist = t.offsetHeight - el.offsetHeight;
      const p = dist > 0 ? Math.min(1, Math.max(0, (PIN_TOP - t.getBoundingClientRect().top) / dist)) : 0;
      const f = Math.min(n - 1e-6, p * n);
      const i = Math.floor(f);
      el.style.setProperty('--seg', (f - i).toFixed(3)); // fills the active tab's bar, no React render per frame
      if (i !== idx) { idx = i; setActive(i); }
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => { ro.disconnect(); cancelAnimationFrame(raf); window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); };
  }, [pinned, n]);

  const go = (i, manual = true) => {
    const k = (i + n) % n;
    if (pinned && track.current && pin.current) {
      // pinned mode: the scroll position is the source of truth, so jump to that tab's slice of the track
      const dist = track.current.offsetHeight - pin.current.offsetHeight;
      const top = track.current.getBoundingClientRect().top + window.scrollY - PIN_TOP + ((k + 0.5) / n) * dist;
      window.scrollTo({ top, behavior: 'smooth' });
      return;
    }
    setActive(k);
    if (manual) setAuto(false);
  };

  // keep the selected tab centred in the horizontal (phone) tab strip without moving the page
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    const l = list.current, t = tabs.current[active];
    if (!l || !t || l.scrollWidth <= l.clientWidth + 2) return;
    l.scrollTo({ left: t.offsetLeft - (l.clientWidth - t.clientWidth) / 2, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  }, [active]);

  const onKey = (e) => {
    const k = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (k) { e.preventDefault(); go(active + k); tabs.current[(active + k + n) % n]?.focus(); }
    else if (e.key === 'Home') { e.preventDefault(); go(0); tabs.current[0]?.focus(); }
    else if (e.key === 'End') { e.preventDefault(); go(n - 1); tabs.current[n - 1]?.focus(); }
  };

  const onDown = (e) => { swipe.current = { x: e.clientX, y: e.clientY }; };
  const onUp = (e) => {
    const s = swipe.current; swipe.current = null;
    if (!s || e.pointerType === 'mouse') return;
    const dx = e.clientX - s.x, dy = e.clientY - s.y;
    if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.5) go(active + (dx < 0 ? 1 : -1));
  };

  return (
    <section className="sec faq" id="faq" aria-labelledby="faq-title" style={{ paddingTop: 24 }}>
      <div className="wrap">
        <Reveal className="sec-head">
          <span className="mono">Quick answers</span>
          <h2 id="faq-title">Good to<br />know</h2>
        </Reveal>

        <div className={`qa-scroll${pinned ? ' pinned' : ''}`} ref={track} style={pinned ? { height: `calc(${pinH}px + ${n * STEP_VH}vh)` } : undefined}>
        <div
          ref={pin}
          className={`qa${paused ? ' paused' : ''}`}
          onPointerEnter={(e) => e.pointerType === 'mouse' && setPaused(true)}
          onPointerLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          <div className="qa-side">
          <div className="qa-tabs" role="tablist" aria-label="Questions" aria-orientation="vertical" ref={list} onKeyDown={onKey}>
            {FAQ.map((f, i) => (
              <button
                key={f.q}
                id={`qa-tab-${i}`}
                role="tab"
                type="button"
                className="qa-tab"
                aria-selected={active === i}
                aria-controls={`qa-panel-${i}`}
                tabIndex={active === i ? 0 : -1}
                ref={(el) => (tabs.current[i] = el)}
                onClick={() => go(i)}
              >
                <span className="qa-n mono">{String(i + 1).padStart(2, '0')}</span>
                <span className="qa-l">{LABELS[i]}</span>
                {pinned && active === i && <i className="qa-bar qa-seg" />}
                {auto && !pinned && active === i && <i className="qa-bar" style={{ '--ms': `${AUTO_MS}ms` }} onAnimationEnd={() => go(active + 1, false)} />}
              </button>
            ))}
          </div>
          {pinned && <p className="qa-hint mono" aria-hidden="true">Keep scrolling to flip through</p>}
          </div>

          <div className="qa-stage" onPointerDown={onDown} onPointerUp={onUp} onPointerCancel={() => (swipe.current = null)}>
            {FAQ.map((f, i) => {
              const Panel = PANELS[i];
              return (
                <div key={f.q} id={`qa-panel-${i}`} role="tabpanel" aria-labelledby={`qa-tab-${i}`} className="qa-panel" hidden={active !== i}>
                  <h3 className="qa-q mono">{f.q}</h3>
                  {active === i && <Panel />}
                  <details className="qa-full">
                    <summary className="mono">Full answer</summary>
                    <p>{f.a}</p>
                  </details>
                  {!(pinned && i === n - 1) && (
                    <button type="button" className="qa-next mono" onClick={() => go(i + 1)}>
                      Next: {LABELS[(i + 1) % n]} <Arrow />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
