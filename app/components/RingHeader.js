/**
 * The One Ring — a polished metallic gold band rendered with stacked SVG
 * gradient passes for a true 3D feel:
 *   1. base gold (mid-tone)
 *   2. vertical light-shadow ramp (overhead lighting)
 *   3. side fresnel darkening (curvature)
 *   4. brushed-gold radial sheen (anisotropic highlight)
 *   5. cool blue rim light (environment reflection)
 * Plus razor-sharp specular hotspots and a baby-blue Tengwar inscription
 * rotating around the band.
 */
export default function RingHeader() {
  return (
    <header className="ring-header">
      <div className="ring-stage">
        <svg className="ring-svg" viewBox="0 0 420 420" aria-hidden="true">
          <defs>
            {/* base metal — saturated gold mid-tone */}
            <linearGradient
              id="bandBase"
              x1="0"
              y1="0"
              x2="0"
              y2="420"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%"  stopColor="#f4d472" />
              <stop offset="20%" stopColor="#d4a838" />
              <stop offset="50%" stopColor="#a87820" />
              <stop offset="80%" stopColor="#5a3a08" />
              <stop offset="100%" stopColor="#1a0e02" />
            </linearGradient>

            {/* overhead lighting (top bright, bottom dark) */}
            <linearGradient
              id="bandLight"
              x1="0"
              y1="0"
              x2="0"
              y2="420"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%"  stopColor="#fff5c8" stopOpacity="0.78" />
              <stop offset="32%" stopColor="#fff5c8" stopOpacity="0" />
              <stop offset="68%" stopColor="#000"    stopOpacity="0" />
              <stop offset="100%" stopColor="#000"   stopOpacity="0.85" />
            </linearGradient>

            {/* curvature darkening on left & right */}
            <linearGradient
              id="bandSides"
              x1="0"
              y1="0"
              x2="420"
              y2="0"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%"  stopColor="#000" stopOpacity="0.42" />
              <stop offset="50%" stopColor="#000" stopOpacity="0" />
              <stop offset="100%" stopColor="#000" stopOpacity="0.42" />
            </linearGradient>

            {/* anisotropic brushed sheen — single bright streak */}
            <radialGradient id="bandSheen" cx="42%" cy="22%" r="38%">
              <stop offset="0%"  stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="35%" stopColor="#fff5d0" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#fff5d0" stopOpacity="0" />
            </radialGradient>

            {/* fresnel rim light — cool environment kiss on outer edges */}
            <radialGradient id="bandFresnel" cx="50%" cy="50%" r="50%" gradientUnits="userSpaceOnUse">
              <stop offset="80%" stopColor="#a8c8e0" stopOpacity="0" />
              <stop offset="93%" stopColor="#cee2f5" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#cee2f5" stopOpacity="0" />
            </radialGradient>

            {/* baby-blue glow filter for the elvish */}
            <filter id="blueGlow" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="2" result="b1" />
              <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="b2" />
              <feMerge>
                <feMergeNode in="b2" />
                <feMergeNode in="b1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* contact-shadow blur */}
            <filter id="ringShadow" x="-10%" y="-10%" width="120%" height="120%">
              <feGaussianBlur stdDeviation="6" />
            </filter>

            <path
              id="ringTextPath"
              d="M 210,210 m -156,0 a 156,156 0 1,1 312,0 a 156,156 0 1,1 -312,0"
            />
          </defs>

          {/* contact shadow on the floor */}
          <ellipse cx="210" cy="362" rx="135" ry="13" fill="#000" opacity="0.45" filter="url(#ringShadow)" />

          {/* outer dark rim — sharp dark line + a thin warm gold catch-light */}
          <circle cx="210" cy="210" r="174" fill="none" stroke="#0a0301" strokeWidth="2.8" />
          <circle cx="210" cy="210" r="173" fill="none" stroke="#ffd068" strokeWidth="0.8" opacity="0.45" />

          {/* main polished metal band — five stacked gradient passes (no brushing — movie ring is smooth) */}
          <circle cx="210" cy="210" r="146" fill="none" stroke="url(#bandBase)"    strokeWidth="55" />
          <circle cx="210" cy="210" r="146" fill="none" stroke="url(#bandLight)"   strokeWidth="55" />
          <circle cx="210" cy="210" r="146" fill="none" stroke="url(#bandSides)"   strokeWidth="55" />
          <circle cx="210" cy="210" r="146" fill="none" stroke="url(#bandSheen)"   strokeWidth="55" />
          <circle cx="210" cy="210" r="146" fill="none" stroke="url(#bandFresnel)" strokeWidth="55" />

          {/* inner dark rim — dark line + a thin warm gold catch-light on the inside edge */}
          <circle cx="210" cy="210" r="120" fill="none" stroke="#ffd068" strokeWidth="0.8" opacity="0.55" />
          <circle cx="210" cy="210" r="119" fill="none" stroke="#0a0301" strokeWidth="2.8" />

          {/* razor-sharp specular hotspots */}
          <ellipse cx="168" cy="72" rx="42" ry="3"   fill="#ffffff" opacity="1" />
          <ellipse cx="168" cy="72" rx="68" ry="7"   fill="#fff5d4" opacity="0.6" />
          <ellipse cx="244" cy="84" rx="24" ry="2"   fill="#ffffff" opacity="0.78" />
          <ellipse cx="210" cy="348" rx="50" ry="2.4" fill="#ffae3a" opacity="0.6" />
          <ellipse cx="210" cy="350" rx="22" ry="1.2" fill="#fff8d8" opacity="0.6" />

          {/* rotating elvish inscription in shining baby blue */}
          <g className="ring-inscription">
            <text
              fontFamily="MedievalSharp, serif"
              fontSize="22"
              fill="#aee5ff"
              filter="url(#blueGlow)"
              letterSpacing="2.5"
            >
              <textPath href="#ringTextPath" startOffset="0">
                Ash nazg durbatulûk · ash nazg gimbatul · ash nazg thrakatulûk agh burzum-ishi krimpatul ·
              </textPath>
            </text>
          </g>
        </svg>
      </div>

      <h1 className="title">One Quiz to Rule Them All</h1>
      <p className="subtitle">A Riddle-game from the Shire to the Cracks of Doom</p>
    </header>
  );
}
