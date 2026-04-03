# Snake Game (React + TypeScript)

A lightweight, polished Snake game built with React, TypeScript, and CSS.

## Install

```bash
npm install
```

## Run locally

```bash
npm run dev
```

## Run tests

```bash
npm test
```

## Architecture decisions

- **Game logic is separated from rendering** in `src/game/logic.ts` using pure functions (`tickGame`, `generateFood`, collision helpers).
- **UI is a functional React component** (`src/components/SnakeGame.tsx`) using hooks for state, timer loop, and keyboard events.
- **Types are explicit** (`Position`, `Direction`, `GameState`) in `src/game/types.ts` to keep logic readable and safe.
- **Styling is modular but simple** (`src/styles`) with responsive layout and clear status/controls.
- **Unit tests focus on core behavior** in `src/tests/game-logic.test.ts` (movement, collisions, food validity, growth).
