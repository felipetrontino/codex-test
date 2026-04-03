import type { Direction, Position } from './types';

export const BOARD_SIZE = 20;
export const INITIAL_SPEED_MS = 160;
export const MIN_SPEED_MS = 70;
export const SPEED_STEP_MS = 7;

export const INITIAL_SNAKE: Position[] = [
  { x: 8, y: 10 },
  { x: 7, y: 10 },
  { x: 6, y: 10 }
];

export const INITIAL_DIRECTION: Direction = 'RIGHT';

export const DIRECTION_VECTORS: Record<Direction, Position> = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 }
};

export const OPPOSITE_DIRECTION: Record<Direction, Direction> = {
  UP: 'DOWN',
  DOWN: 'UP',
  LEFT: 'RIGHT',
  RIGHT: 'LEFT'
};
