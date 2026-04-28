'use client';

const GAMES = [
  {
    id: 'lotr',
    title: 'One Quiz to Rule Them All',
    tagline: 'A trivia journey through Middle-earth.',
    accent: 'gold',
  },
  {
    id: 'bookworm',
    title: 'Bookworm Vocabulary',
    tagline: 'Match the word to its meaning before the pages turn.',
    accent: 'green',
  },
  {
    id: 'tactics',
    title: 'Pocket Tactics',
    tagline: 'Sword, shield, and elixir against an orc captain.',
    accent: 'steel',
  },
];

/**
 * The games hub — three big themed cards, one per game. Selecting a
 * card lifts the chosen game id up to the top-level orchestrator.
 *
 * @param {{ nickname: string, onSelect: (id: string) => void }} props
 */
export default function GamesHub({ nickname, onSelect }) {
  return (
    <section className="games-hub">
      <div className="gloomy-clouds" aria-hidden="true">
        <span className="g-cloud g-cloud-1" />
        <span className="g-cloud g-cloud-2" />
        <span className="g-cloud g-cloud-3" />
        <span className="g-cloud g-cloud-5" />
      </div>

      <div className="hub-greeting">
        <h2>
          Welcome, <span className="hub-name">{nickname}</span>
        </h2>
        <p>Three quests await. Choose your path.</p>
      </div>

      <div className="game-cards">
        {GAMES.map((g) => (
          <button
            key={g.id}
            type="button"
            className={`game-card game-card-${g.accent}`}
            onClick={() => onSelect(g.id)}
          >
            <div className="game-card-icon">{renderIcon(g.id)}</div>
            <h3>{g.title}</h3>
            <p>{g.tagline}</p>
            <span className="game-card-cta">Enter →</span>
          </button>
        ))}
      </div>
    </section>
  );
}

function renderIcon(id) {
  if (id === 'lotr') return <RingIcon />;
  if (id === 'bookworm') return <BookIcon />;
  if (id === 'tactics') return <SwordIcon />;
  return null;
}

function RingIcon() {
  return (
    <svg viewBox="0 0 80 80" aria-hidden="true">
      <defs>
        <linearGradient id="hubRingGold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff5b0" />
          <stop offset="55%" stopColor="#c8932e" />
          <stop offset="100%" stopColor="#3a2204" />
        </linearGradient>
      </defs>
      <circle cx="40" cy="40" r="28" fill="none" stroke="url(#hubRingGold)" strokeWidth="9" />
      <circle cx="40" cy="40" r="33" fill="none" stroke="#0a0301" strokeWidth="1" />
      <circle cx="40" cy="40" r="23" fill="none" stroke="#0a0301" strokeWidth="1" />
      <ellipse cx="32" cy="18" rx="9" ry="1.4" fill="#fff5d4" opacity="0.95" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg viewBox="0 0 80 80" aria-hidden="true">
      <defs>
        <linearGradient id="hubBook" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5e9442" />
          <stop offset="100%" stopColor="#1a3a14" />
        </linearGradient>
      </defs>
      {/* book covers */}
      <path d="M 12,16 L 38,12 L 38,68 L 12,64 Z" fill="url(#hubBook)" stroke="#0a1a04" strokeWidth="1" />
      <path d="M 68,16 L 42,12 L 42,68 L 68,64 Z" fill="url(#hubBook)" stroke="#0a1a04" strokeWidth="1" />
      {/* spine highlight */}
      <line x1="40" y1="12" x2="40" y2="68" stroke="#0a1a04" strokeWidth="1.4" />
      {/* page lines */}
      <g stroke="#fff5d0" strokeWidth="0.6" opacity="0.55" fill="none">
        <line x1="18" y1="26" x2="34" y2="24" />
        <line x1="18" y1="34" x2="34" y2="32" />
        <line x1="18" y1="42" x2="34" y2="40" />
        <line x1="46" y1="24" x2="62" y2="26" />
        <line x1="46" y1="32" x2="62" y2="34" />
        <line x1="46" y1="40" x2="62" y2="42" />
      </g>
      {/* big "W" on the spine */}
      <text
        x="40"
        y="50"
        textAnchor="middle"
        fontFamily="Cinzel, serif"
        fontSize="14"
        fontWeight="700"
        fill="#f5d572"
        opacity="0.9"
      >
        W
      </text>
    </svg>
  );
}

function SwordIcon() {
  return (
    <svg viewBox="0 0 80 80" aria-hidden="true">
      <defs>
        <linearGradient id="hubBlade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f0f4f7" />
          <stop offset="60%" stopColor="#a0acb8" />
          <stop offset="100%" stopColor="#3a4250" />
        </linearGradient>
        <linearGradient id="hubHilt" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9a6a18" />
          <stop offset="100%" stopColor="#3a2204" />
        </linearGradient>
      </defs>
      {/* crossed swords */}
      <g transform="rotate(-30 40 40)">
        <path d="M 39,8 L 41,52 L 40,56 L 39,52 Z" fill="url(#hubBlade)" stroke="#3a4250" strokeWidth="0.6" />
        <rect x="34" y="52" width="12" height="3" fill="#888" />
        <rect x="37" y="55" width="6" height="14" fill="url(#hubHilt)" />
        <circle cx="40" cy="71" r="2.2" fill="#c89232" />
      </g>
      <g transform="rotate(30 40 40)">
        <path d="M 39,8 L 41,52 L 40,56 L 39,52 Z" fill="url(#hubBlade)" stroke="#3a4250" strokeWidth="0.6" />
        <rect x="34" y="52" width="12" height="3" fill="#888" />
        <rect x="37" y="55" width="6" height="14" fill="url(#hubHilt)" />
        <circle cx="40" cy="71" r="2.2" fill="#c89232" />
      </g>
    </svg>
  );
}
