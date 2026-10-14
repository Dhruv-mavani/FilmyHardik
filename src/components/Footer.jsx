import { PLATFORMS } from '../data';

export default function Footer() {
  return (
    <footer>
      <div className="wrap foot">
        <a className="logo" href="#top">@filmyhardik</a>
        <nav aria-label="Social links">
          {PLATFORMS.map((p) => (
            <a key={p.name} href={p.href} target="_blank" rel="noopener">{p.name}</a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
