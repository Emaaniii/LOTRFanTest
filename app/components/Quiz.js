'use client';

import { useState } from 'react';
import { QUESTIONS, WIN_THRESHOLD } from '../data/questions';

/**
 * The parchment quiz. Owns its question/score state internally; reports a
 * single result string to the parent when finished.
 *
 * @param {{ onFinish: (result: 'win' | 'lose') => void }} props
 */
export default function Quiz({ onFinish }) {
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [shadow, setShadow] = useState(0);
  const [chosenIdx, setChosenIdx] = useState(null);

  const currentQ = QUESTIONS[qIndex];
  const isLast = qIndex + 1 >= QUESTIONS.length;
  const progressPct =
    chosenIdx === null
      ? (qIndex / QUESTIONS.length) * 100
      : ((qIndex + 1) / QUESTIONS.length) * 100;
  const feedback =
    chosenIdx === null
      ? ''
      : chosenIdx === currentQ.answer
      ? currentQ.light
      : currentQ.shadow;

  const handleChoose = (i) => {
    if (chosenIdx !== null) return;
    setChosenIdx(i);
    if (i === currentQ.answer) setScore((s) => s + 1);
    else setShadow((s) => s + 1);
  };

  const handleNext = () => {
    if (isLast) {
      onFinish?.(score >= WIN_THRESHOLD ? 'win' : 'lose');
    } else {
      setQIndex((i) => i + 1);
      setChosenIdx(null);
    }
  };

  return (
    <section className="quiz show">
      <div className="parchment">
        <div className="quiz-header">
          <span className="qcount">
            Question <strong>{qIndex + 1}</strong> of <strong>{QUESTIONS.length}</strong>
          </span>
          <span className="qscore">
            Light: <strong>{score}</strong> · Shadow: <strong>{shadow}</strong>
          </span>
        </div>
        <div className="progress">
          <div className="progress-bar" style={{ width: `${progressPct}%` }} />
        </div>

        <h2 className="qtitle">{currentQ.q}</h2>

        <ul className="qchoices">
          {currentQ.choices.map((choice, i) => (
            <ChoiceItem
              key={i}
              choice={choice}
              chosen={chosenIdx !== null}
              isCorrect={chosenIdx !== null && i === currentQ.answer}
              isWrong={chosenIdx !== null && i === chosenIdx && i !== currentQ.answer}
              onPick={() => handleChoose(i)}
            />
          ))}
        </ul>

        <p className="qfeedback">{feedback}</p>

        <div className="qcontrols">
          <button
            className={`btn-stone${chosenIdx === null ? ' hidden' : ''}`}
            onClick={handleNext}
          >
            {isLast ? 'See Your Fate →' : 'Continue →'}
          </button>
        </div>
      </div>
    </section>
  );
}

function ChoiceItem({ choice, chosen, isCorrect, isWrong, onPick }) {
  const cls = [chosen ? 'locked' : '', isCorrect ? 'correct' : '', isWrong ? 'wrong' : '']
    .filter(Boolean)
    .join(' ');
  return (
    <li
      className={cls}
      onClick={onPick}
      style={chosen ? { pointerEvents: 'none' } : undefined}
    >
      {choice}
    </li>
  );
}
