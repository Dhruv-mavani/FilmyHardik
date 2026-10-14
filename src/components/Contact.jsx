import { useRef, useState } from 'react';
import { EMAIL, PHONE_HREF, PHONE_TEXT } from '../data';
import Reveal from './Reveal';

function CopyButton({ text, targetRef }) {
  const [label, setLabel] = useState('Copy');
  const done = (m) => { setLabel(m); setTimeout(() => setLabel('Copy'), 1600); };
  const fallback = () => {
    try {
      const r = document.createRange();
      r.selectNodeContents(targetRef.current);
      const s = window.getSelection();
      s.removeAllRanges();
      s.addRange(r);
      done('Selected');
    } catch {
      done('Select it');
    }
  };
  const onClick = () => {
    try {
      if (navigator.clipboard?.writeText) navigator.clipboard.writeText(text).then(() => done('Copied'), fallback);
      else fallback();
    } catch {
      fallback();
    }
  };
  return <button className="copy" type="button" onClick={onClick}>{label}</button>;
}

function ReachRow({ label, href, text, copy }) {
  const linkRef = useRef(null);
  return (
    <div className="reach-row">
      <span className="mono">{label}</span>
      <div className="reach-line">
        <a href={href} ref={linkRef}>{text}</a>
        <CopyButton text={copy} targetRef={linkRef} />
      </div>
    </div>
  );
}

export default function Contact() {
  const [form, setForm] = useState({ name: '', brand: '', brief: '' });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const subject = `Collab with Filmyhardik${form.brand ? ` - ${form.brand}` : ''}`;
  const body = `Hi Hardik,\n\n${form.brief ? `${form.brief}\n\n` : ''}Thanks,\n${form.name}${form.brand ? `\n${form.brand}` : ''}`;
  const mailto = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  return (
    <section className="sec contact" id="contact" style={{ marginTop: 56 }}>
      <div className="wrap c-grid">
        <Reveal className="c-copy">
          <span className="mono" style={{ color: 'var(--yellow)' }}>Collabs</span>
          <h2>Work<br />with me</h2>
          <p>Got a product that needs to be funny? Send me the brief and I'll come back with an idea people actually want to share.</p>
          <div className="reach">
            <ReachRow label="Email" href={`mailto:${EMAIL}`} text={EMAIL} copy={EMAIL} />
            <ReachRow label="Phone" href={PHONE_HREF} text={PHONE_TEXT} copy={PHONE_TEXT} />
          </div>
        </Reveal>
        <Reveal as="form" className="form" autoComplete="off" onSubmit={(e) => e.preventDefault()}>
          <h3>Send a brief</h3>
          <div className="field"><label htmlFor="f-name">Your name</label><input id="f-name" type="text" placeholder="Your name" value={form.name} onChange={set('name')} /></div>
          <div className="field"><label htmlFor="f-brand">Brand</label><input id="f-brand" type="text" placeholder="Brand or company" value={form.brand} onChange={set('brand')} /></div>
          <div className="field"><label htmlFor="f-brief">What do you have in mind?</label><textarea id="f-brief" rows={4} placeholder="Product, timeline, platforms" value={form.brief} onChange={set('brief')} /></div>
          <a className="btn solid" style={{ alignSelf: 'flex-start', background: 'var(--ink)', color: 'var(--yellow)', borderColor: 'var(--ink)', boxShadow: '5px 5px 0 var(--paper)' }} href={mailto}>
            Email my brief <span aria-hidden="true">&rarr;</span>
          </a>
          <p className="fine">This opens your email app with the brief filled in. If nothing opens, write to {EMAIL}.</p>
        </Reveal>
      </div>
    </section>
  );
}
