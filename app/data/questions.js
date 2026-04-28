/* ============================================================
   Quiz data — fetched from Open Trivia DB
   https://opentdb.com/api.php
   ============================================================ */

export const WIN_THRESHOLD = 5;
export const QUESTIONS_AMOUNT = 8;

/**
 * `encode=base64` is the cleanest option from OpenTDB — every string
 * (question, answers, category, difficulty) comes back base64-encoded,
 * which sidesteps every HTML-entity quirk and embedded-quote hazard.
 */
const API_URL =
  `https://opentdb.com/api.php?amount=${QUESTIONS_AMOUNT}&type=multiple&encode=base64`;

/* ---- LOTR-flavoured feedback (the questions themselves are random
        general-knowledge trivia; the wrapper stays in voice) ---- */
const FEEDBACK_LIGHT = [
  'Well met, traveller — the path lies open.',
  'Wise as Gandalf himself. Onward.',
  'The light of Eärendil shines on you.',
  'The Eldar would nod in approval.',
  'A friend of the Council, well remembered.',
  'Galadriel smiles upon your wisdom.',
  'Even Elrond could ask for no clearer answer.',
];

const FEEDBACK_SHADOW = [
  'A shadow has crossed your path.',
  'The Eye stirs at the wrong word.',
  "Saruman's whisper has clouded your mind.",
  'The Dark Lord laughs in his tower.',
  'Wraiths gather at the edge of memory.',
  'The Nazgûl draw a step closer.',
  'A cold wind blows from the East.',
];

/* ---- helpers ---- */

function decodeBase64(b64) {
  if (typeof atob === 'undefined') return b64;
  try {
    const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  } catch {
    return b64;
  }
}

/** Fisher–Yates shuffle (immutable). */
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

/* ---- public API ---- */

/**
 * Fetch a fresh set of multiple-choice trivia questions from Open Trivia DB
 * and shape each one into the quiz's expected format:
 *
 *   { q, choices: string[4], answer: number, light, shadow,
 *     category, difficulty }
 *
 * `cache: 'no-store'` ensures every game starts with a new random set.
 *
 * Throws on network failure or any non-success `response_code` from the API
 * (1 = no results, 2 = invalid parameter, 5 = rate-limited, …).
 */
export async function fetchQuestions() {
  const res = await fetch(API_URL, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`The raven could not reach the great library (HTTP ${res.status}).`);
  }

  const data = await res.json();
  if (data.response_code !== 0 || !Array.isArray(data.results)) {
    throw new Error(
      `The library answered with a strange word (code ${data.response_code}).`,
    );
  }

  return data.results.map((item) => {
    const correct = decodeBase64(item.correct_answer);
    const incorrect = item.incorrect_answers.map(decodeBase64);
    const choices = shuffle([correct, ...incorrect]);
    return {
      q: decodeBase64(item.question),
      choices,
      answer: choices.indexOf(correct),
      light: pickRandom(FEEDBACK_LIGHT),
      shadow: pickRandom(FEEDBACK_SHADOW),
      category: decodeBase64(item.category),
      difficulty: decodeBase64(item.difficulty),
    };
  });
}
