import { PLATFORMS } from '../data';
import Reveal from './Reveal';

function Card({ p }) {
  const onMove = (e) => {
    if (e.pointerType === 'touch') return;
    const c = e.currentTarget;
    const r = c.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    c.style.setProperty('--mx', `${x}px`);
    c.style.setProperty('--my', `${y}px`);
    c.style.setProperty('--ry', `${((x / r.width - 0.5) * 10).toFixed(2)}deg`);
    c.style.setProperty('--rx', `${((0.5 - y / r.height) * 10).toFixed(2)}deg`);
  };
  const onLeave = (e) => {
    e.currentTarget.style.setProperty('--rx', '0deg');
    e.currentTarget.style.setProperty('--ry', '0deg');
  };
  return (
    <Reveal as="a" className={`card${p.yel ? ' yel' : ''}`} href={p.href} target="_blank" rel="noopener" onPointerMove={onMove} onPointerLeave={onLeave}>
      <div className="pname">{p.name}</div>
      <div className="pnum">{p.num}</div>
      <div className="mono cap">{p.cap}</div>
      <div className="handle">{p.handle}</div>
      <span className="go">{p.cta} <span aria-hidden="true">&rarr;</span></span>
    </Reveal>
  );
}

export default function Platforms() {
  return (
    <section className="sec" id="platforms">
      <div className="wrap">
        <Reveal className="sec-head">
          <span className="mono">Platforms</span>
          <h2>Find me<br />everywhere</h2>
        </Reveal>
        <div className="cards">
          {PLATFORMS.map((p) => <Card key={p.name} p={p} />)}
        </div>
      </div>
    </section>
  );
}
