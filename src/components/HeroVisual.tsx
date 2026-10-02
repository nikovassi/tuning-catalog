/** Абстрактна техническа илюстрация (джанта + спирачен диск) — собствен SVG, без външни изображения. */
export function HeroVisual({ className = '' }: { className?: string }) {
  const spokes = Array.from({ length: 5 }, (_, i) => i * 72);
  const holes = Array.from({ length: 24 }, (_, i) => i * 15);
  return (
    <svg viewBox="0 0 600 600" className={className} aria-hidden fill="none">
      <defs>
        <radialGradient id="hv-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgb(var(--accent))" stopOpacity="0.18" />
          <stop offset="70%" stopColor="rgb(var(--accent))" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="300" cy="300" r="290" fill="url(#hv-glow)" />
      {/* гума */}
      <circle cx="300" cy="300" r="262" stroke="currentColor" strokeOpacity=".16" strokeWidth="44" />
      <circle cx="300" cy="300" r="284" stroke="currentColor" strokeOpacity=".35" strokeWidth="1" />
      <circle cx="300" cy="300" r="240" stroke="currentColor" strokeOpacity=".5" strokeWidth="1.25" />
      {/* джанта */}
      <circle cx="300" cy="300" r="226" stroke="currentColor" strokeOpacity=".7" strokeWidth="2" />
      <circle cx="300" cy="300" r="214" stroke="currentColor" strokeOpacity=".25" strokeWidth="1" strokeDasharray="2 6" />
      {/* спирачен диск */}
      <g className="origin-center motion-safe:animate-[spin_60s_linear_infinite]" style={{ transformOrigin: '300px 300px' }}>
        <circle cx="300" cy="300" r="165" stroke="currentColor" strokeOpacity=".3" strokeWidth="1" />
        <circle cx="300" cy="300" r="112" stroke="currentColor" strokeOpacity=".3" strokeWidth="1" />
        {holes.map((a) => (
          <circle key={a} cx={300 + 140 * Math.cos((a * Math.PI) / 180)} cy={300 + 140 * Math.sin((a * Math.PI) / 180)} r="3" fill="currentColor" fillOpacity=".28" />
        ))}
      </g>
      {/* спирачен апарат */}
      <path d="M 300 300 m -178 -62 a 188 188 0 0 1 116 -118" stroke="rgb(var(--accent))" strokeWidth="34" strokeLinecap="round" />
      <path d="M 300 300 m -178 -62 a 188 188 0 0 1 116 -118" stroke="rgb(0 0 0 / .25)" strokeWidth="2" strokeLinecap="round" transform="translate(4 4)" />
      {/* спици */}
      {spokes.map((a) => (
        <g key={a} transform={`rotate(${a} 300 300)`}>
          <path d="M 286 236 L 274 84 Q 300 76 326 84 L 314 236 Z" fill="currentColor" fillOpacity=".09" stroke="currentColor" strokeOpacity=".75" strokeWidth="1.5" strokeLinejoin="round" />
          <line x1="300" y1="230" x2="300" y2="92" stroke="currentColor" strokeOpacity=".25" />
        </g>
      ))}
      {/* главина */}
      <circle cx="300" cy="300" r="64" fill="rgb(var(--surface))" fillOpacity=".04" stroke="currentColor" strokeOpacity=".8" strokeWidth="2" />
      {Array.from({ length: 5 }, (_, i) => i * 72 + 36).map((a) => (
        <circle key={a} cx={300 + 40 * Math.cos((a * Math.PI) / 180)} cy={300 + 40 * Math.sin((a * Math.PI) / 180)} r="6" stroke="currentColor" strokeOpacity=".8" strokeWidth="1.5" />
      ))}
      <circle cx="300" cy="300" r="16" fill="currentColor" fillOpacity=".85" />
      {/* технически линии */}
      <g stroke="currentColor" strokeOpacity=".35" strokeWidth="1">
        <line x1="16" y1="300" x2="584" y2="300" strokeDasharray="4 6" />
        <line x1="300" y1="16" x2="300" y2="584" strokeDasharray="4 6" />
        <line x1="40" y1="560" x2="560" y2="560" />
        <line x1="40" y1="552" x2="40" y2="568" />
        <line x1="560" y1="552" x2="560" y2="568" />
      </g>
    </svg>
  );
}
