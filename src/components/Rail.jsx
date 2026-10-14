import { RAIL_LABELS, SECTIONS } from '../data';
import { useActiveSection, useScrollProgress } from '../hooks';

export default function Rail() {
  const p = useScrollProgress();
  const active = useActiveSection(SECTIONS);
  return (
    <nav className="rail" aria-label="Page sections">
      <div className="rail-fill" style={{ transform: `scaleY(${p})` }} />
      {SECTIONS.map((id) => (
        <a key={id} href={`#${id}`} className={active === id ? 'on' : undefined} aria-label={RAIL_LABELS[id]} />
      ))}
    </nav>
  );
}
