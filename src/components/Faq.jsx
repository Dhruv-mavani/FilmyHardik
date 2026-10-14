import { FAQ } from '../seo-data';
import Reveal from './Reveal';

/** Visible Q&A: the same text is exposed as FAQPage JSON-LD, so answer engines can quote it. */
export default function Faq() {
  return (
    <section className="sec faq" id="faq" aria-labelledby="faq-title" style={{ paddingTop: 24 }}>
      <div className="wrap">
        <Reveal className="sec-head">
          <span className="mono">Quick answers</span>
          <h2 id="faq-title">Good to<br />know</h2>
        </Reveal>
        <dl className="faq-list">
          {FAQ.map((f) => (
            <Reveal key={f.q} className="faq-item">
              <dt><h3>{f.q}</h3></dt>
              <dd>{f.a}</dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
