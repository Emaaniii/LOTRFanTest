const EMBER_COUNT = 18;

/**
 * Defeat screen — the Eye of Sauron with layered flames, a turbulence-driven
 * fire shimmer, the cat-slit pupil staring out from a brilliant fire-lit
 * iris, ember rain, and the Dark Lord's claim on the Ring.
 *
 * @param {{ nickname?: string, onRestart: () => void, onExit?: () => void }} props
 */
export default function LoseScreen({ nickname, onRestart, onExit }) {
  return (
    <section className="result lose show">
      <div className="fire-bg" />
      <div className="ember-rain">
        {Array.from({ length: EMBER_COUNT }).map((_, i) => (
          <span key={i} />
        ))}
      </div>

      <div className="eye-of-sauron">
        <EyeOfSauronSVG />
      </div>

      <div className="ring-claim">&ldquo;The Ring is Mine.&rdquo;</div>

      <div className="result-card dark">
        <h2>
          The Eye Has Found You
          {nickname ? <>, <span className="result-name">{nickname}</span></> : null}
        </h2>
        <p>
          The Dark Lord&rsquo;s gaze pierced the veil, and the Nazgûl rode forth on black wings.
          The Ring was torn from your hand and borne home to Barad-dûr. Middle-earth fades into
          shadow…
        </p>
        <div className="result-actions">
          <button className="btn-stone" onClick={onRestart}>
            Try Again
          </button>
          {onExit && (
            <button className="btn-stone btn-stone-ghost" onClick={onExit}>
              ← Hub
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

function EyeOfSauronSVG() {
  return (
    <svg className="eye-svg" viewBox="0 0 700 500" aria-hidden="true">
      <defs>
        {/* fire body — center white-hot, fading through orange to dark crimson and black */}
        <radialGradient id="fireBody" cx="50%" cy="50%" r="50%">
          <stop offset="0%"  stopColor="#fff8d0" />
          <stop offset="6%"  stopColor="#ffe28a" />
          <stop offset="18%" stopColor="#ffa028" />
          <stop offset="34%" stopColor="#ee5008" />
          <stop offset="56%" stopColor="#7e1402" />
          <stop offset="80%" stopColor="#1e0301" />
          <stop offset="100%" stopColor="#000" />
        </radialGradient>

        {/* iris fire — brighter and more saturated than the outer body */}
        <radialGradient id="irisFire" cx="50%" cy="50%" r="50%">
          <stop offset="0%"  stopColor="#ffffff" />
          <stop offset="12%" stopColor="#fff8c0" />
          <stop offset="32%" stopColor="#ffaa28" />
          <stop offset="62%" stopColor="#d8460a" />
          <stop offset="100%" stopColor="#1a0301" />
        </radialGradient>

        {/* turbulence filter — fractal noise drives a displacement map; SMIL on
            the seed gives the flames a constant shimmer */}
        <filter id="fireFlick" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.018 0.04"
            numOctaves="2"
            seed="2"
            result="turb"
          >
            <animate
              attributeName="seed"
              values="2;6;11;17;24;31;2"
              dur="3.5s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="baseFrequency"
              values="0.018 0.04;0.022 0.046;0.018 0.04"
              dur="6s"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="turb" scale="14" />
        </filter>

        {/* big halo glow */}
        <filter id="haloBlur" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="12" />
        </filter>

        {/* fine eye-lens softening */}
        <filter id="eyeBlur" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="1.4" />
        </filter>
      </defs>

      {/* outer flame halo — massive, soft, pulsing */}
      <ellipse
        cx="350"
        cy="250"
        rx="345"
        ry="235"
        fill="url(#fireBody)"
        filter="url(#haloBlur)"
        opacity="0.7"
        className="halo"
      />

      {/* fire body with turbulence shimmer — the “alive” flames */}
      <ellipse
        cx="350"
        cy="250"
        rx="320"
        ry="210"
        fill="url(#fireBody)"
        filter="url(#fireFlick)"
        opacity="0.9"
        className="halo-inner"
      />

      {/* lens-shaped eye outline — slightly distorted by the same fire filter */}
      <path
        d="M 60,250 Q 350,30 640,250 Q 350,470 60,250 Z"
        fill="url(#fireBody)"
        filter="url(#eyeBlur)"
        className="eye-lens"
      />

      {/* iris — bright fire core, breathing */}
      <ellipse
        cx="350"
        cy="250"
        rx="55"
        ry="160"
        fill="url(#irisFire)"
        filter="url(#fireFlick)"
        className="iris"
      />

      {/* white-hot vertical core inside the iris (sits behind the pupil) */}
      <ellipse cx="350" cy="250" rx="22" ry="80" fill="#ffffff" opacity="0.55" filter="url(#eyeBlur)" />
      <ellipse cx="350" cy="250" rx="9" ry="36" fill="#ffffff" opacity="0.85" />

      {/* pupil — sharp cat-slit, pointed top and bottom (a vertical lens shape) */}
      <path
        d="M 350,80
           C 360,180 360,320 350,420
           C 340,320 340,180 350,80 Z"
        fill="#000"
        className="pupil"
      />
      {/* pupil inner reflection — faint red bleed */}
      <path
        d="M 350,110
           C 354,200 354,300 350,390
           C 346,300 346,200 350,110 Z"
        fill="#3a0301"
        opacity="0.7"
      />

      {/* outer flame licks — two layers flickering at different speeds */}
      <g className="flame-licks-1" opacity="0.85">
        <path d="M 110,210 Q 70,160 110,90  Q 100,180 160,200 Z" fill="#ff8a18" />
        <path d="M 590,210 Q 630,160 590,90 Q 600,180 540,200 Z" fill="#ff8a18" />
        <path d="M 250,80  Q 270,30 300,60  Q 290,100 270,108 Z" fill="#ffba48" />
        <path d="M 450,80  Q 430,30 400,60  Q 410,100 430,108 Z" fill="#ffba48" />
      </g>
      <g className="flame-licks-2" opacity="0.85">
        <path d="M 170,420 Q 140,470 200,440 Q 200,430 170,420 Z" fill="#e84008" />
        <path d="M 530,420 Q 560,470 500,440 Q 500,430 530,420 Z" fill="#e84008" />
        <path d="M 90,300  Q 50,360  120,335 Q 110,318 90,300 Z" fill="#ff6010" />
        <path d="M 610,300 Q 650,360 580,335 Q 590,318 610,300 Z" fill="#ff6010" />
        <path d="M 320,40  Q 340,5   360,30  Q 350,52 330,52 Z"  fill="#ffd478" />
        <path d="M 380,40  Q 360,5   340,30  Q 350,52 370,52 Z"  fill="#ffd478" />
      </g>
    </svg>
  );
}
