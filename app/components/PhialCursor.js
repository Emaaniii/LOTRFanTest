'use client';

import { useEffect, useRef } from 'react';

/**
 * The Phial of Galadriel — a small crystal vial that holds the light of
 * Eärendil's star. Follows the cursor with a gentle eased lerp, twinkles
 * from within, and casts a soft starlight halo.
 *
 * Auto-hides on coarse-pointer (touch) devices.
 */
export default function PhialCursor() {
  const cursorRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    if (window.matchMedia('(pointer: coarse)').matches) {
      cursor.style.display = 'none';
      return;
    }

    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    let cx = tx;
    let cy = ty;
    let raf = 0;

    const onMove = (e) => {
      tx = e.clientX;
      ty = e.clientY;
    };
    const onLeave = () => {
      cursor.style.opacity = '0';
    };
    const onEnter = () => {
      cursor.style.opacity = '1';
    };

    const tick = () => {
      cx += (tx - cx) * 0.22;
      cy += (ty - cy) * 0.22;
      cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -10%)`;
      raf = requestAnimationFrame(tick);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
    };
  }, []);

  return (
    <div className="phial-cursor" ref={cursorRef}>
      <svg viewBox="0 0 60 90" width="46" height="72" aria-hidden="true">
        <defs>
          {/* the captured starlight inside */}
          <radialGradient id="phialCore" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="35%" stopColor="#e6f4ff" stopOpacity="0.95" />
            <stop offset="70%" stopColor="#a8d2ff" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#5aa0e0" stopOpacity="0" />
          </radialGradient>

          {/* glass body — translucent with a cool fringe */}
          <linearGradient id="phialGlass" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
            <stop offset="30%" stopColor="#cfe6ff" stopOpacity="0.18" />
            <stop offset="60%" stopColor="#a8c8e0" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.18" />
          </linearGradient>

          {/* brass stopper / cap */}
          <linearGradient id="phialCap" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffe896" />
            <stop offset="50%" stopColor="#b6892b" />
            <stop offset="100%" stopColor="#5a3e10" />
          </linearGradient>

          {/* glow filter */}
          <filter id="phialGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="2.2" result="b1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="b2" />
            <feMerge>
              <feMergeNode in="b2" />
              <feMergeNode in="b1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* slender chain */}
        <line x1="30" y1="0" x2="30" y2="20" stroke="#cfd9e0" strokeWidth="0.6" opacity="0.75" />

        {/* outer starlight halo */}
        <ellipse
          cx="30"
          cy="56"
          rx="24"
          ry="28"
          fill="url(#phialCore)"
          opacity="0.55"
          filter="url(#phialGlow)"
        />

        {/* slow rotating star-rays */}
        <g className="phial-rays" opacity="0.6">
          <path
            d="M 30,32 L 30,82 M 8,57 L 52,57 M 14,42 L 46,72 M 46,42 L 14,72"
            stroke="#e6f4ff"
            strokeWidth="0.4"
            strokeLinecap="round"
          />
        </g>

        {/* glass vial body */}
        <path
          d="M 22,32 L 22,68 Q 22,80 30,82 Q 38,80 38,68 L 38,32 Z"
          fill="url(#phialGlass)"
          stroke="#cfe6ff"
          strokeWidth="0.7"
          opacity="0.95"
        />

        {/* inner glow — the captured starlight */}
        <ellipse cx="30" cy="58" rx="11" ry="18" fill="url(#phialCore)" />

        {/* the bright twinkling star */}
        <g className="phial-star" filter="url(#phialGlow)">
          <path
            d="M 30,46 L 32,55 L 41,58 L 32,61 L 30,70 L 28,61 L 19,58 L 28,55 Z"
            fill="#ffffff"
          />
          <circle cx="30" cy="58" r="2.2" fill="#ffffff" />
        </g>

        {/* subtle glass highlight stroke */}
        <path
          d="M 25.5,34 Q 23.5,55 25.5,72"
          stroke="#ffffff"
          strokeWidth="0.6"
          fill="none"
          opacity="0.55"
        />

        {/* brass collar + stopper */}
        <rect x="23.5" y="22" width="13" height="10" rx="0.6" fill="url(#phialCap)" stroke="#3a2204" strokeWidth="0.5" />
        <ellipse cx="30" cy="22" rx="6.5" ry="2" fill="#ffe896" stroke="#5a3a04" strokeWidth="0.4" />
        <ellipse cx="29" cy="21.5" rx="2" ry="0.6" fill="#ffffff" opacity="0.7" />
      </svg>
    </div>
  );
}
