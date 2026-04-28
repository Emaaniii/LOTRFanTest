/**
 * Victory screen — the One Ring at full size, ember backdrop, and Bilbo's
 * counsel.
 *
 * Uses the same five-pass realistic-metal gradient stack as `RingHeader`
 * but with `big*` IDs so the two rings can coexist in the DOM.
 *
 * @param {{ onRestart: () => void }} props
 */
export default function WinScreen({ onRestart }) {
  return (
    <section className="result win show">
      <div className="ember-bg" />
      <svg className="big-ring" viewBox="0 0 500 500">
        <defs>
          <linearGradient
            id="bigBandBase"
            x1="0"
            y1="0"
            x2="0"
            y2="500"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%"  stopColor="#f4d472" />
            <stop offset="20%" stopColor="#d4a838" />
            <stop offset="50%" stopColor="#a87820" />
            <stop offset="80%" stopColor="#5a3a08" />
            <stop offset="100%" stopColor="#1a0e02" />
          </linearGradient>
          <linearGradient
            id="bigBandLight"
            x1="0"
            y1="0"
            x2="0"
            y2="500"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%"  stopColor="#fff5c8" stopOpacity="0.78" />
            <stop offset="32%" stopColor="#fff5c8" stopOpacity="0" />
            <stop offset="68%" stopColor="#000"    stopOpacity="0" />
            <stop offset="100%" stopColor="#000"   stopOpacity="0.85" />
          </linearGradient>
          <linearGradient
            id="bigBandSides"
            x1="0"
            y1="0"
            x2="500"
            y2="0"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%"  stopColor="#000" stopOpacity="0.42" />
            <stop offset="50%" stopColor="#000" stopOpacity="0" />
            <stop offset="100%" stopColor="#000" stopOpacity="0.42" />
          </linearGradient>
          <radialGradient id="bigBandSheen" cx="42%" cy="22%" r="38%">
            <stop offset="0%"  stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="35%" stopColor="#fff5d0" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#fff5d0" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="bigBandFresnel" cx="50%" cy="50%" r="50%" gradientUnits="userSpaceOnUse">
            <stop offset="80%" stopColor="#a8c8e0" stopOpacity="0" />
            <stop offset="93%" stopColor="#cee2f5" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#cee2f5" stopOpacity="0" />
          </radialGradient>
          <filter id="bigBlueGlow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="2.5" result="b1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="b2" />
            <feMerge>
              <feMergeNode in="b2" />
              <feMergeNode in="b1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="bigRingShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="8" />
          </filter>
          <path
            id="winTextPath"
            d="M 250,250 m -184,0 a 184,184 0 1,1 368,0 a 184,184 0 1,1 -368,0"
          />
        </defs>

        <ellipse cx="250" cy="436" rx="170" ry="16" fill="#000" opacity="0.55" filter="url(#bigRingShadow)" />

        {/* outer dark rim + warm gold catch-light */}
        <circle cx="250" cy="250" r="208" fill="none" stroke="#0a0301" strokeWidth="3.2" />
        <circle cx="250" cy="250" r="207" fill="none" stroke="#ffd068" strokeWidth="0.9" opacity="0.45" />

        {/* main polished metal band — smooth, no brushing */}
        <circle cx="250" cy="250" r="174" fill="none" stroke="url(#bigBandBase)"    strokeWidth="68" />
        <circle cx="250" cy="250" r="174" fill="none" stroke="url(#bigBandLight)"   strokeWidth="68" />
        <circle cx="250" cy="250" r="174" fill="none" stroke="url(#bigBandSides)"   strokeWidth="68" />
        <circle cx="250" cy="250" r="174" fill="none" stroke="url(#bigBandSheen)"   strokeWidth="68" />
        <circle cx="250" cy="250" r="174" fill="none" stroke="url(#bigBandFresnel)" strokeWidth="68" />

        {/* inner rim catch-light + dark line */}
        <circle cx="250" cy="250" r="141" fill="none" stroke="#ffd068" strokeWidth="0.9" opacity="0.55" />
        <circle cx="250" cy="250" r="140" fill="none" stroke="#0a0301" strokeWidth="3.2" />

        {/* razor-sharp specular hotspots */}
        <ellipse cx="200" cy="74" rx="55" ry="3.4" fill="#ffffff" opacity="1" />
        <ellipse cx="200" cy="74" rx="86" ry="8" fill="#fff5d4" opacity="0.6" />
        <ellipse cx="298" cy="92" rx="32" ry="2.6" fill="#ffffff" opacity="0.78" />
        <ellipse cx="250" cy="418" rx="64" ry="3.2" fill="#ffae3a" opacity="0.6" />
        <ellipse cx="250" cy="420" rx="28" ry="1.4" fill="#fff8d8" opacity="0.6" />

        <g className="ring-inscription slow">
          <text
            fontFamily="MedievalSharp, serif"
            fontSize="26"
            fill="#aee5ff"
            filter="url(#bigBlueGlow)"
            letterSpacing="3"
          >
            <textPath href="#winTextPath" startOffset="0">
              Ash nazg durbatulûk · ash nazg gimbatul · ash nazg thrakatulûk agh burzum-ishi krimpatul ·
            </textPath>
          </text>
        </g>
      </svg>
      <div className="result-card">
        <h2>The Ring is Yours</h2>
        <p>
          You crossed the wilds, slipped past the Eye, and stood at last upon the threshold of
          doom. The wise might counsel you to cast it in — but the choice, as ever, is yours.
        </p>
        <button className="btn-stone" onClick={onRestart}>
          Begin Again
        </button>
      </div>
    </section>
  );
}
