// SVG arrows: text glyphs like ↗ and ↑ turn into colored emoji on iOS/Android, these never do.
const ROT = { r: 0, ur: -45, u: -90 };

export default function Arrow({ dir = 'r', className = '' }) {
  return (
    <svg className={`arrow ${className}`.trim()} viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" style={{ transform: `rotate(${ROT[dir]}deg)` }}>
      <path d="M4 12h15M13 6l6 6-6 6" />
    </svg>
  );
}
