'use client';

import { useEffect, useRef, useState } from 'react';
import BackToHub from './BackToHub';

const PLAYER_MAX_HP = 40;
const ENEMY_MAX_HP  = 42;
const HEAL_COOLDOWN = 3;       // turns between heal uses
const SPECIAL_COOLDOWN = 4;    // turns between special uses
const DEFEND_REDUCE = 0.5;     // damage taken when defending

/* ---- random helpers ---- */
const ri = (lo, hi) => Math.floor(Math.random() * (hi - lo + 1)) + lo;

/**
 * Pocket Tactics — turn-based duel. Each turn the player picks one of
 * four actions; the orc captain picks one too. Damage, healing, and
 * cooldowns resolve simultaneously, and a running combat log shows
 * the last few rounds.
 *
 * Actions:
 *   Strike  — 8–14 damage.
 *   Defend  — incoming damage halved this turn.
 *   Mend    — restore 10–16 HP. 3-turn cooldown.
 *   Smite   — 14–22 damage; cannot defend this turn. 4-turn cooldown.
 *
 * @param {{ nickname: string, onExit: () => void }} props
 */
export default function GameTactics({ nickname, onExit }) {
  const [playerHP, setPlayerHP] = useState(PLAYER_MAX_HP);
  const [enemyHP, setEnemyHP]   = useState(ENEMY_MAX_HP);
  const [healCD, setHealCD]     = useState(0);
  const [specialCD, setSpecialCD] = useState(0);
  const [turn, setTurn]         = useState(1);
  const [log, setLog]           = useState([
    `An orc captain blocks your path. Steel yourself, ${nickname}.`,
  ]);
  const [result, setResult]     = useState(null); // 'win' | 'lose' | null
  const logEndRef               = useRef(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [log]);

  /* end-of-turn: figure out if anyone is dead */
  useEffect(() => {
    if (result) return;
    if (playerHP <= 0 && enemyHP <= 0) setResult('lose');
    else if (enemyHP <= 0) setResult('win');
    else if (playerHP <= 0) setResult('lose');
  }, [playerHP, enemyHP, result]);

  /* main turn resolution — player + enemy actions resolve simultaneously */
  const playTurn = (action) => {
    if (result) return;
    if (action === 'mend' && healCD > 0) return;
    if (action === 'smite' && specialCD > 0) return;

    const playerDefending = action === 'defend';
    const enemyAction     = pickEnemyAction(playerHP, enemyHP);
    const enemyDefending  = enemyAction === 'defend';

    let dmgToEnemy = 0;
    let dmgToPlayer = 0;
    let playerHeal = 0;
    const lines = [];

    /* ---- player's blow (or other) ---- */
    if (action === 'strike') {
      dmgToEnemy = ri(8, 14);
      lines.push(`${nickname} strikes for ${dmgToEnemy}.`);
    } else if (action === 'defend') {
      lines.push(`${nickname} raises their shield.`);
    } else if (action === 'mend') {
      playerHeal = ri(10, 16);
      lines.push(`${nickname} drinks a healing draught (+${playerHeal}).`);
    } else if (action === 'smite') {
      dmgToEnemy = ri(14, 22);
      lines.push(`${nickname} unleashes a mighty blow for ${dmgToEnemy}!`);
    }

    /* ---- enemy's blow ---- */
    if (enemyAction === 'strike') {
      dmgToPlayer = ri(7, 12);
      lines.push(`The orc captain swings for ${dmgToPlayer}.`);
    } else if (enemyAction === 'defend') {
      lines.push('The orc braces behind a shield.');
    } else if (enemyAction === 'roar') {
      dmgToPlayer = ri(10, 16);
      lines.push(`The orc roars and strikes savagely for ${dmgToPlayer}!`);
    }

    /* ---- defence reduction (smite cannot be defended against on the player's side) ---- */
    if (playerDefending && dmgToPlayer > 0) {
      const before = dmgToPlayer;
      dmgToPlayer = Math.ceil(dmgToPlayer * DEFEND_REDUCE);
      lines.push(`Your shield blocks ${before - dmgToPlayer}.`);
    }
    if (enemyDefending && dmgToEnemy > 0 && action !== 'smite') {
      const before = dmgToEnemy;
      dmgToEnemy = Math.ceil(dmgToEnemy * DEFEND_REDUCE);
      lines.push(`The orc's shield blocks ${before - dmgToEnemy}.`);
    } else if (enemyDefending && action === 'smite') {
      lines.push("The orc's shield is shattered by the blow!");
    }

    /* ---- apply ---- */
    setEnemyHP((hp) => Math.max(0, hp - dmgToEnemy));
    setPlayerHP((hp) =>
      Math.min(PLAYER_MAX_HP, Math.max(0, hp - dmgToPlayer + playerHeal)),
    );
    setHealCD((cd) => (action === 'mend' ? HEAL_COOLDOWN : Math.max(0, cd - 1)));
    setSpecialCD((cd) =>
      action === 'smite' ? SPECIAL_COOLDOWN : Math.max(0, cd - 1),
    );
    setTurn((t) => t + 1);
    setLog((prev) => [...prev, ...lines].slice(-8));
  };

  const restart = () => {
    setPlayerHP(PLAYER_MAX_HP);
    setEnemyHP(ENEMY_MAX_HP);
    setHealCD(0);
    setSpecialCD(0);
    setTurn(1);
    setLog([`An orc captain blocks your path. Steel yourself, ${nickname}.`]);
    setResult(null);
  };

  if (result) {
    return (
      <TacticsResult
        kind={result}
        nickname={nickname}
        turn={turn - 1}
        onRestart={restart}
        onExit={onExit}
      />
    );
  }

  return (
    <>
      <BackToHub onExit={onExit} />
      <section className="tactics-game">
        <div className="parchment tactics-parchment">
          <div className="tactics-header">
            <h2>The Duel</h2>
            <span className="tactics-turn">Turn {turn}</span>
          </div>

          <div className="combatants">
            <Combatant
              side="player"
              name={nickname}
              hp={playerHP}
              maxHp={PLAYER_MAX_HP}
              icon="hero"
            />
            <span className="tactics-vs">vs</span>
            <Combatant
              side="enemy"
              name="Orc Captain"
              hp={enemyHP}
              maxHp={ENEMY_MAX_HP}
              icon="orc"
            />
          </div>

          <ol className="combat-log" aria-live="polite">
            {log.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
            <li ref={logEndRef} aria-hidden="true" />
          </ol>

          <div className="tactics-actions">
            <ActionButton label="Strike" hint="8–14 dmg" onClick={() => playTurn('strike')} />
            <ActionButton label="Defend" hint="Halve incoming" onClick={() => playTurn('defend')} />
            <ActionButton
              label="Mend"
              hint={healCD > 0 ? `Cooldown ${healCD}` : '+10–16 HP'}
              disabled={healCD > 0}
              onClick={() => playTurn('mend')}
            />
            <ActionButton
              label="Smite"
              hint={specialCD > 0 ? `Cooldown ${specialCD}` : '14–22 dmg'}
              disabled={specialCD > 0}
              onClick={() => playTurn('smite')}
            />
          </div>
        </div>
      </section>
    </>
  );
}

/* ---- pieces ---- */

function Combatant({ side, name, hp, maxHp, icon }) {
  const pct = Math.max(0, Math.round((hp / maxHp) * 100));
  return (
    <div className={`combatant combatant-${side}`}>
      <div className="combatant-portrait">
        {icon === 'hero' ? <HeroIcon /> : <OrcIcon />}
      </div>
      <div className="combatant-name">{name}</div>
      <div className="hp-bar">
        <div className="hp-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="hp-text">
        {hp} / {maxHp}
      </div>
    </div>
  );
}

function ActionButton({ label, hint, disabled, onClick }) {
  return (
    <button
      type="button"
      className="tactics-action btn-stone"
      onClick={onClick}
      disabled={disabled}
    >
      <span className="action-label">{label}</span>
      <span className="action-hint">{hint}</span>
    </button>
  );
}

function TacticsResult({ kind, nickname, turn, onRestart, onExit }) {
  const isWin = kind === 'win';
  return (
    <>
      <BackToHub onExit={onExit} />
      <section className={`tactics-result ${isWin ? 'win' : 'lose'}`}>
        <div className="parchment result-parchment">
          <h2>
            {isWin ? 'Victory' : 'You have fallen'}, <span className="result-name">{nickname}</span>
          </h2>
          <p>
            {isWin
              ? `The orc captain crashes to the ground after ${turn} rounds. The path is yours.`
              : `The shadow takes you in the ${turn}th round. Rest, and steel your blade once more.`}
          </p>
          <div className="result-actions">
            <button className="btn-stone" onClick={onRestart}>
              Fight Again
            </button>
            <button className="btn-stone btn-stone-ghost" onClick={onExit}>
              ← Hub
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

/* ---- enemy AI: weighted random with rules ---- */
function pickEnemyAction(playerHP, enemyHP) {
  // wounded orcs lash out with a roar more often
  const wounded = enemyHP / ENEMY_MAX_HP < 0.4;
  const enraged = Math.random();
  if (wounded && enraged < 0.45) return 'roar';
  if (enraged < 0.18) return 'defend';
  if (enraged < 0.30) return 'roar';
  return 'strike';
}

/* ---- compact SVG portraits ---- */
function HeroIcon() {
  return (
    <svg viewBox="0 0 60 60" aria-hidden="true">
      <defs>
        <linearGradient id="heroSteel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e8eef5" />
          <stop offset="100%" stopColor="#5a6878" />
        </linearGradient>
      </defs>
      {/* helm */}
      <path d="M 20,20 Q 30,10 40,20 L 40,32 L 20,32 Z" fill="url(#heroSteel)" stroke="#2a323c" strokeWidth="0.8" />
      <line x1="30" y1="14" x2="30" y2="32" stroke="#2a323c" strokeWidth="0.8" />
      {/* shoulders */}
      <path d="M 14,38 Q 30,32 46,38 L 46,52 L 14,52 Z" fill="#3d6824" stroke="#1a3a14" strokeWidth="0.8" />
      {/* sword on the back */}
      <line x1="44" y1="22" x2="52" y2="50" stroke="#a0acb8" strokeWidth="2" />
      <line x1="40" y1="46" x2="48" y2="54" stroke="#5a3a08" strokeWidth="2" />
    </svg>
  );
}

function OrcIcon() {
  return (
    <svg viewBox="0 0 60 60" aria-hidden="true">
      <defs>
        <radialGradient id="orcSkin" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#7a6a48" />
          <stop offset="100%" stopColor="#2a2418" />
        </radialGradient>
      </defs>
      {/* head */}
      <ellipse cx="30" cy="26" rx="14" ry="16" fill="url(#orcSkin)" stroke="#1a1408" strokeWidth="0.8" />
      {/* tusks */}
      <path d="M 25,32 L 24,38 M 35,32 L 36,38" stroke="#f0ddb0" strokeWidth="2" strokeLinecap="round" />
      {/* eyes — red glints */}
      <circle cx="25" cy="24" r="1.6" fill="#ff5a18" />
      <circle cx="35" cy="24" r="1.6" fill="#ff5a18" />
      {/* spiked shoulders */}
      <path d="M 12,46 L 18,40 L 26,44 L 34,44 L 42,40 L 48,46 L 48,54 L 12,54 Z"
            fill="#3a2a18" stroke="#1a1408" strokeWidth="0.8" />
      <g fill="#a0a0a0">
        <path d="M 16,42 L 18,36 L 20,42 Z" />
        <path d="M 40,42 L 42,36 L 44,42 Z" />
      </g>
    </svg>
  );
}
