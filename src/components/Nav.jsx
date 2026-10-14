import { useScrollProgress } from '../hooks';

export default function Nav() {
  const p = useScrollProgress();
  return (
    <header className="nav">
      <a className="logo" href="#top">@filmyhardik</a>
      <nav className="nav-links" aria-label="Sections">
        <a className="hide-s" href="#numbers">Numbers</a>
        <a className="hide-s" href="#platforms">Platforms</a>
        <a className="hide-s" href="#brands">Brands</a>
        <a className="btn solid small cta" href="#contact">Work with me</a>
      </nav>
      <div className="progress" style={{ transform: `scaleX(${p})` }} />
    </header>
  );
}
