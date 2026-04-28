'use client';

import { useCallback, useRef, useState } from 'react';

const ACTIVATION_DELAY_MS = 2600;

/**
 * The Doors of Durin — hover the gate, type "mellon", and the doors light up
 * in mithril blue. After the activation animation finishes, `onActivated`
 * fires (typically advancing to the quiz).
 *
 * Owns its own input + activation state so the parent only learns about the
 * single event it cares about: the doors are open.
 *
 * @param {{ onActivated: () => void }} props
 */
export default function DurinDoors({ onActivated }) {
  const [doorsActivated, setDoorsActivated] = useState(false);
  const [mellonValue, setMellonValue] = useState('');
  const inputRef = useRef(null);
  const activatedRef = useRef(false);

  const activateDoors = useCallback(() => {
    if (activatedRef.current) return;
    activatedRef.current = true;
    setDoorsActivated(true);
    if (inputRef.current) inputRef.current.blur();
    setTimeout(() => onActivated?.(), ACTIVATION_DELAY_MS);
  }, [onActivated]);

  const handleChange = (e) => {
    const v = e.target.value;
    setMellonValue(v);
    if (v.trim().toLowerCase() === 'mellon') activateDoors();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.target.value.trim().toLowerCase() === 'mellon') {
      activateDoors();
    }
  };

  const handleHover = () => {
    if (activatedRef.current) return;
    setTimeout(() => {
      if (!activatedRef.current && inputRef.current) inputRef.current.focus();
    }, 250);
  };

  return (
    <section className={`durin show${doorsActivated ? ' activated' : ''}`}>
      <div className="moria-bg" />
      <div className="durin-stage" onMouseEnter={handleHover}>
        <DurinGateSVG />

        <div className="durin-prompt">
          <p className="speak">Speak, friend, and enter…</p>
          <div className={`mellon-wrap${doorsActivated ? ' active' : ''}`}>
            <label htmlFor="mellonInput" className="mellon-label">
              Whisper the word in Elvish
            </label>
            <input
              id="mellonInput"
              ref={inputRef}
              className={`mellon-input${doorsActivated ? ' correct' : ''}`}
              type="text"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              maxLength={12}
              placeholder="…"
              value={mellonValue}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
            <p className="mellon-hint">The doors remember the speech of friends.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   SVG ART — Doors of Durin (movie-accurate composition)
   - Tall pointed-curved arch with two columns
   - Twin Tengwar text bands following the arch
   - Crown of Durin (seven stars) at the peak
   - Stars of Fëanor flanking the crown
   - Anvil & Hammer below the crown
   - Climbing ivy on each pillar (mirrored)
   - Central Star of Fëanor in the doorway
   - Tengwar mark at the bottom
   ============================================================ */
function DurinGateSVG() {
  return (
    <svg className="durin-doors" viewBox="0 0 500 620" aria-hidden="true">
      <defs>
        <linearGradient id="mithril" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#bfe2f5" />
          <stop offset="100%" stopColor="#5b8db0" />
        </linearGradient>
        <radialGradient id="archGlow" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#5cb8ff" stopOpacity="0" />
          <stop offset="100%" stopColor="#5cb8ff" stopOpacity="0" />
        </radialGradient>
        <symbol id="star8" viewBox="-30 -30 60 60">
          <path
            d="M0,-26 L6,-6 L26,0 L6,6 L0,26 L-6,6 L-26,0 L-6,-6 Z M0,-18 L18,0 L0,18 L-18,0 Z"
            fill="url(#mithril)"
          />
        </symbol>
        {/* one ivy branch — used twice (mirrored) */}
        <symbol id="ivyBranch" viewBox="0 0 160 280" overflow="visible">
          {/* main vine sweeping up and outward */}
          <path
            d="M 80,278 C 70,240 90,200 75,160 C 60,118 80,80 110,55 C 130,38 150,30 158,28"
            fill="none"
            stroke="url(#mithril)"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          {/* secondary curls */}
          <path
            d="M 80,210 C 95,200 110,205 115,220"
            fill="none"
            stroke="url(#mithril)"
            strokeWidth="1.1"
            strokeLinecap="round"
          />
          <path
            d="M 78,160 C 60,150 48,160 45,180"
            fill="none"
            stroke="url(#mithril)"
            strokeWidth="1.1"
            strokeLinecap="round"
          />
          <path
            d="M 95,110 C 110,100 122,108 122,124"
            fill="none"
            stroke="url(#mithril)"
            strokeWidth="1.1"
            strokeLinecap="round"
          />
          <path
            d="M 120,70 C 105,62 95,70 96,82"
            fill="none"
            stroke="url(#mithril)"
            strokeWidth="1"
            strokeLinecap="round"
          />
          {/* stylised leaves — narrow ellipses tilted along the vine */}
          <g fill="url(#mithril)">
            <ellipse cx="92" cy="246" rx="3" ry="7" transform="rotate(-25 92 246)" />
            <ellipse cx="78" cy="220" rx="3" ry="7" transform="rotate(40 78 220)" />
            <ellipse cx="115" cy="220" rx="2.6" ry="6" transform="rotate(15 115 220)" />
            <ellipse cx="80" cy="180" rx="3" ry="7" transform="rotate(-15 80 180)" />
            <ellipse cx="48" cy="178" rx="2.6" ry="6" transform="rotate(40 48 178)" />
            <ellipse cx="68" cy="135" rx="3" ry="7" transform="rotate(-30 68 135)" />
            <ellipse cx="100" cy="120" rx="2.6" ry="6" transform="rotate(20 100 120)" />
            <ellipse cx="123" cy="124" rx="2.6" ry="6" transform="rotate(50 123 124)" />
            <ellipse cx="118" cy="80" rx="3" ry="7" transform="rotate(-10 118 80)" />
            <ellipse cx="98" cy="80" rx="2.6" ry="6" transform="rotate(35 98 80)" />
            <ellipse cx="142" cy="46" rx="3" ry="7" transform="rotate(20 142 46)" />
            <ellipse cx="124" cy="50" rx="2.6" ry="6" transform="rotate(-20 124 50)" />
          </g>
        </symbol>
      </defs>

      {/* black void backdrop */}
      <rect x="0" y="0" width="500" height="620" fill="#000" />

      {/* mithril halo that flares when activated */}
      <ellipse className="arch-glow" cx="250" cy="280" r="0" rx="240" ry="280" fill="url(#archGlow)" />

      {/* ===== ARCH OUTLINES (tall pointed-curved) ===== */}
      <path
        d="M 80,608 L 80,225 C 80,108 175,38 250,38 C 325,38 420,108 420,225 L 420,608"
        fill="none"
        stroke="url(#mithril)"
        strokeWidth="2.5"
        strokeLinecap="round"
        className="mithril-line"
      />
      <path
        d="M 102,592 L 102,232 C 102,122 188,62 250,62 C 312,62 398,122 398,232 L 398,592"
        fill="none"
        stroke="url(#mithril)"
        strokeWidth="1.4"
        opacity="0.65"
        strokeLinecap="round"
        className="mithril-line"
      />

      {/* ===== TENGWAR TEXT — outer band ===== */}
      <path
        id="archTextOuter"
        d="M 92,225 C 92,115 188,50 250,50 C 312,50 408,115 408,225"
        fill="none"
        stroke="none"
      />
      <text
        className="tengwar"
        fontFamily="MedievalSharp, serif"
        fontSize="14"
        fill="url(#mithril)"
        letterSpacing="2"
      >
        <textPath href="#archTextOuter" startOffset="50%" textAnchor="middle">
          ✦ Ennyn Durin Aran Moria · Pedo mellon a minno ✦
        </textPath>
      </text>

      {/* ===== TENGWAR TEXT — inner band ===== */}
      <path
        id="archTextInner"
        d="M 118,232 C 118,138 200,82 250,82 C 300,82 382,138 382,232"
        fill="none"
        stroke="none"
      />
      <text
        className="tengwar"
        fontFamily="MedievalSharp, serif"
        fontSize="11"
        fill="url(#mithril)"
        letterSpacing="3"
        opacity="0.85"
      >
        <textPath href="#archTextInner" startOffset="50%" textAnchor="middle">
          Im Narvi hain echant · Celebrimbor o Eregion teithant i thîw hin
        </textPath>
      </text>

      {/* ===== CROWN OF DURIN — seven stars =====
           Position lives on the outer <g> so CSS can animate `transform`
           on the inner <g.crown> without clobbering the placement. */}
      <g transform="translate(250 168)">
        <g className="crown">
          <path
            d="M -54,16 L -38,-18 L -22,8 L -8,-22 L 0,-32 L 8,-22 L 22,8 L 38,-18 L 54,16 Z"
            fill="none"
            stroke="url(#mithril)"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <g fill="url(#mithril)">
            <circle cx="-46" cy="0" r="2.2" />
            <circle cx="-30" cy="-10" r="2.2" />
            <circle cx="-15" cy="-3" r="2.2" />
            <circle cx="0" cy="-30" r="3" />
            <circle cx="15" cy="-3" r="2.2" />
            <circle cx="30" cy="-10" r="2.2" />
            <circle cx="46" cy="0" r="2.2" />
          </g>
        </g>
      </g>

      {/* ===== STARS OF FËANOR (flanking) ===== */}
      <g className="star-feanor" transform="translate(132 200) scale(0.7)">
        <use href="#star8" />
      </g>
      <g className="star-feanor" transform="translate(368 200) scale(0.7)">
        <use href="#star8" />
      </g>

      {/* ===== ANVIL & HAMMER (Durin's emblem) ===== */}
      <g transform="translate(250 240)" className="anvil">
        {/* anvil top */}
        <rect x="-32" y="-8" width="64" height="10" fill="none" stroke="url(#mithril)" strokeWidth="1.5" />
        {/* anvil base */}
        <rect x="-18" y="2" width="36" height="18" fill="none" stroke="url(#mithril)" strokeWidth="1.5" />
        {/* anvil horn */}
        <path
          d="M -45,-20 L -16,-8 L -16,-2 L -45,-12 Z"
          fill="none"
          stroke="url(#mithril)"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        {/* hammer head */}
        <g transform="rotate(35 24 -34)">
          <rect x="18" y="-40" width="14" height="10" fill="none" stroke="url(#mithril)" strokeWidth="1.5" />
        </g>
        {/* hammer handle */}
        <line x1="-8" y1="-8" x2="36" y2="-44" stroke="url(#mithril)" strokeWidth="1.5" strokeLinecap="round" />
      </g>

      {/* ===== CENTRAL STAR OF FËANOR ===== */}
      <g transform="translate(250 380) scale(0.65)" className="star-feanor">
        <use href="#star8" />
      </g>

      {/* ===== IVY ON PILLARS (mirrored) ===== */}
      <g transform="translate(80 320)" className="trees ivy-left">
        <use href="#ivyBranch" />
      </g>
      <g transform="translate(420 320) scale(-1 1)" className="trees ivy-right">
        <use href="#ivyBranch" />
      </g>

      {/* ===== TENGWAR MARK AT BOTTOM ===== */}
      <text
        x="250"
        y="555"
        textAnchor="middle"
        fontFamily="MedievalSharp, serif"
        fontSize="22"
        fill="url(#mithril)"
        className="tengwar"
      >
        ⌑
      </text>

      {/* ===== DOOR SPLIT ===== */}
      <line
        x1="250"
        y1="62"
        x2="250"
        y2="592"
        stroke="#0c1620"
        strokeWidth="1"
        className="door-split"
      />
    </svg>
  );
}
