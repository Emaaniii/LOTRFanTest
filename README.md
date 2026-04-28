# One Quiz to Rule Them All

A Lord of the Rings themed quiz built with **Next.js 14** (App Router) — a journey from the Shire, past the Doors of Durin, through eight riddles in a parchment scroll, to either the One Ring or the gaze of Sauron.

## Features

- **Phial of Galadriel cursor** — a glass vial that follows the mouse with a gentle eased lerp; the captured starlight twinkles inside.
- **Animated One Ring header** — polished metallic gold rendered with a five-pass SVG gradient stack (base, overhead light, side curvature, anisotropic sheen, fresnel rim) and a baby-blue Tengwar inscription rotating around the band.
- **The Shire welcome page** — dark Hobbit-doorway backdrop with slow gloomy clouds drifting across.
- **Doors of Durin** — movie-accurate composition with two pillars, climbing ivy, twin Tengwar text bands, the Crown of Durin (seven stars), Stars of Fëanor, anvil + hammer, and a central Star of Fëanor. Hover the gate, type `mellon`, and the doors light up in mithril blue before opening into the quiz.
- **Parchment quiz** — eight riddles covering the Arkenstone, lembas, second breakfast, the Mines of Moria, Isildur, Mount Doom, Gollum, and Andúril. Each answer earns Light or Shadow.
- **Two endings** — score five or more correct to claim the Ring; otherwise the Eye of Sauron finds you, the iris flickers with a real `feTurbulence` flame shimmer, and the Dark Lord declares *"The Ring is Mine."*
- **Background score** — drop your own MP3 at `public/music/may-it-be.mp3` and the in-page music player will fade it in on your first interaction (loops, with a corner toggle).
- **Fully scalable** — every dimension uses `clamp()` / `vmin` / `aspect-ratio` so it renders crisply from phones up to 4K.

## Tech

- **Next.js 14** (App Router, JavaScript)
- **React 18**
- All visuals are inline SVG — no images, no canvas, no third-party UI libraries.
- Animations use CSS keyframes plus a few SMIL `<animate>` elements for SVG-internal motion (ring rotation, smoke puffs, eye fire seed, etc.).
- The Evenstar… wait, no — the **Phial of Galadriel** cursor uses `requestAnimationFrame` for a smooth eased follow with proper React cleanup.

## Run locally

```bash
npm install
npm run dev          # http://localhost:3000
```

Build for production:

```bash
npm run build
npm start
```

## Project structure

```
app/
├── layout.js                 root layout, metadata, font links
├── page.js                   thin orchestrator — owns the `screen` state only
├── globals.css               all styles (paper bg, ring, gate, eye, scaling)
├── data/
│   └── questions.js          QUESTIONS + WIN_THRESHOLD
└── components/
    ├── PhialCursor.js        cursor follow + RAF lifecycle
    ├── MusicPlayer.js        background music + corner toggle
    ├── RingHeader.js         the One Ring header (pure SVG)
    ├── Shire.js              welcome page over the Hobbit-doorway gloom
    ├── DurinDoors.js         mellon input + activation; nested SVG art
    ├── Quiz.js               question/score state; nested ChoiceItem
    ├── WinScreen.js          big One Ring + result card
    └── LoseScreen.js         Eye of Sauron + flame licks + ring claim
```

## Adding the music

Enya's *May It Be* is copyrighted, so the source MP3 isn't bundled. Drop your own copy at:

```
public/music/may-it-be.mp3
```

It loops once you click anywhere on the page. The corner toggle button switches it on and off.

## Credits

- Design and code in this repository: yours
- Lord of the Rings, the Tengwar inscription, the Doors of Durin, Bag End, the Phial of Galadriel, Andúril, etc. — © J.R.R. Tolkien Estate / Middle-earth Enterprises / New Line / WB. This project is a **non-commercial fan tribute** for entertainment and educational purposes only.
