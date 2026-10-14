import { BRAND_TILES, CHIPS } from '../data';
import Reveal from './Reveal';

export default function Brands() {
  return (
    <section className="sec" id="brands" style={{ paddingTop: 24 }}>
      <div className="wrap">
        <Reveal className="sec-head">
          <span className="mono">Brands</span>
          <h2>Brands I made<br />go viral</h2>
        </Reveal>
        <div className="bento">
          {BRAND_TILES.map((t) => (
            <Reveal key={t.name} className={`tile ${t.size}`} style={{ '--w': t.w }}>
              {t.eyebrow && <div className="mono" style={t.size === 'mid' ? { color: 'var(--yellow)' } : undefined}>{t.eyebrow}</div>}
              <div className="tn">{t.num}</div>
              <div className="tb">{t.name}</div>
              {t.desc && <div style={t.size === 'mid' ? { color: 'var(--muted)' } : undefined}>{t.desc}</div>}
              {t.size === 'sm' && <div className="mono" style={{ color: 'var(--muted)' }}>Views</div>}
              <div className="bar"><i /></div>
            </Reveal>
          ))}
        </div>
        <Reveal as="p" className="note mono">Bars use a log scale, so the 9M+ campaign doesn't squash everything else.</Reveal>
        <Reveal className="sec-head" style={{ margin: '44px 0 6px' }}>
          <span className="mono">And these too. 350M+ views in total.</span>
        </Reveal>
        <Reveal className="chips">
          {CHIPS.map((c) => <span key={c} className="chip">{c}</span>)}
        </Reveal>
      </div>
    </section>
  );
}
