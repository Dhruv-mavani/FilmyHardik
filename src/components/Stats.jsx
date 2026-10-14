import { STATS } from '../data';
import Count from './Count';
import Reveal from './Reveal';

export default function Stats() {
  return (
    <section className="slab" id="numbers">
      <div className="wrap">
        <Reveal className="sec-head">
          <span className="mono">The numbers</span>
          <h2>The numbers<br />don't joke</h2>
        </Reveal>
        <div className="stats">
          {STATS.map((s) => (
            <Reveal key={s.label} className={`stat${s.big ? ' big' : ''}`}>
              <div className="num"><Count to={s.to} suffix={s.suffix} /></div>
              <div className="mono">{s.label}</div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
