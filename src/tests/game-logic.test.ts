import { describe, expect, it } from 'vitest';
import { BOARD_SIZE, INITIAL_DIRECTION, INITIAL_SPEED_MS } from '../game/constants';
import {
  createInitialState,
  generateFood,
  getSafeDirection,
  tickGame
} from '../game/logic';
import type { GameState } from '../game/types';

function runningState(partial: Partial<GameState>): GameState {
  return {
    ...createInitialState(() => 0.1),
    status: 'running',
    ...partial
  };
}

describe('snake game logic', () => {
  it('moves snake one cell forward in current direction', () => {
    const state = runningState({
      snake: [
        { x: 4, y: 4 },
        { x: 3, y: 4 },
        { x: 2, y: 4 }
      ],
      direction: 'RIGHT',
      pendingDirection: 'RIGHT'
    });

    const next = tickGame(state);

    expect(next.snake[0]).toEqual({ x: 5, y: 4 });
    expect(next.snake).toHaveLength(3);
  });

  it('prevents instant reversal', () => {
    const state = runningState({
      direction: 'RIGHT',
      pendingDirection: 'LEFT'
    });

    const next = tickGame(state);

    expect(next.direction).toBe('RIGHT');
  });

  it('generates food only on empty cells', () => {
    const snake = [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 }
    ];

    const food = generateFood(snake, BOARD_SIZE, () => 0);
    expect(snake).not.toContainEqual(food);
  });

  it('ends game on wall collision', () => {
    const state = runningState({
      snake: [{ x: BOARD_SIZE - 1, y: 5 }],
      direction: 'RIGHT',
      pendingDirection: 'RIGHT'
    });

    const next = tickGame(state);
    expect(next.status).toBe('over');
  });

  it('ends game on self collision', () => {
    const state = runningState({
      snake: [
        { x: 5, y: 5 },
        { x: 5, y: 6 },
        { x: 4, y: 6 },
        { x: 4, y: 5 },
        { x: 4, y: 4 }
      ],
      direction: 'UP',
      pendingDirection: 'LEFT'
    });

    const next = tickGame(state);
    expect(next.status).toBe('over');
  });

  it('grows snake, increments score, and updates speed after eating food', () => {
    const state = runningState({
      snake: [
        { x: 4, y: 4 },
        { x: 3, y: 4 },
        { x: 2, y: 4 }
      ],
      food: { x: 5, y: 4 },
      direction: 'RIGHT',
      pendingDirection: 'RIGHT',
      score: 0,
      speedMs: INITIAL_SPEED_MS
    });

    const next = tickGame(state, () => 0.8);

    expect(next.snake).toHaveLength(4);
    expect(next.score).toBe(1);
    expect(next.speedMs).toBeLessThan(INITIAL_SPEED_MS);
    expect(next.food).not.toEqual({ x: 5, y: 4 });
  });

  it('keeps initial direction when attempting opposite direction immediately', () => {
    expect(getSafeDirection('LEFT', INITIAL_DIRECTION)).toBe(INITIAL_DIRECTION);
  });
});
