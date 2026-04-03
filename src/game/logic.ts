import {
  BOARD_SIZE,
  DIRECTION_VECTORS,
  INITIAL_DIRECTION,
  INITIAL_SNAKE,
  INITIAL_SPEED_MS,
  MIN_SPEED_MS,
  OPPOSITE_DIRECTION,
  SPEED_STEP_MS
} from './constants';
import type { Direction, GameState, Position } from './types';

export const positionKey = ({ x, y }: Position): string => `${x}:${y}`;

export const arePositionsEqual = (a: Position, b: Position): boolean =>
  a.x === b.x && a.y === b.y;

export function isInsideBoard(pos: Position, size = BOARD_SIZE): boolean {
  return pos.x >= 0 && pos.y >= 0 && pos.x < size && pos.y < size;
}

export function isSelfCollision(snake: Position[]): boolean {
  const [head, ...body] = snake;
  return body.some((segment) => arePositionsEqual(segment, head));
}

export function nextHeadPosition(head: Position, direction: Direction): Position {
  const vector = DIRECTION_VECTORS[direction];
  return {
    x: head.x + vector.x,
    y: head.y + vector.y
  };
}

export function getSafeDirection(
  requested: Direction,
  current: Direction
): Direction {
  return OPPOSITE_DIRECTION[current] === requested ? current : requested;
}

export function generateFood(
  snake: Position[],
  boardSize = BOARD_SIZE,
  random = Math.random
): Position {
  const occupied = new Set(snake.map(positionKey));
  const max = boardSize * boardSize;

  if (occupied.size >= max) {
    throw new Error('Cannot generate food on a full board.');
  }

  while (true) {
    const candidate = {
      x: Math.floor(random() * boardSize),
      y: Math.floor(random() * boardSize)
    };

    if (!occupied.has(positionKey(candidate))) {
      return candidate;
    }
  }
}

export function getSpeedForScore(score: number): number {
  return Math.max(MIN_SPEED_MS, INITIAL_SPEED_MS - score * SPEED_STEP_MS);
}

export function createInitialState(random = Math.random): GameState {
  return {
    snake: [...INITIAL_SNAKE],
    direction: INITIAL_DIRECTION,
    pendingDirection: INITIAL_DIRECTION,
    food: generateFood(INITIAL_SNAKE, BOARD_SIZE, random),
    score: 0,
    status: 'idle',
    speedMs: INITIAL_SPEED_MS
  };
}

export function tickGame(state: GameState, random = Math.random): GameState {
  if (state.status !== 'running') {
    return state;
  }

  const direction = getSafeDirection(state.pendingDirection, state.direction);
  const nextHead = nextHeadPosition(state.snake[0], direction);

  if (!isInsideBoard(nextHead, BOARD_SIZE)) {
    return { ...state, direction, status: 'over' };
  }

  const hasEaten = arePositionsEqual(nextHead, state.food);
  const nextSnake = [nextHead, ...state.snake];

  if (!hasEaten) {
    nextSnake.pop();
  }

  if (isSelfCollision(nextSnake)) {
    return { ...state, direction, status: 'over' };
  }

  if (hasEaten) {
    const score = state.score + 1;
    return {
      ...state,
      snake: nextSnake,
      direction,
      pendingDirection: direction,
      score,
      food: generateFood(nextSnake, BOARD_SIZE, random),
      speedMs: getSpeedForScore(score)
    };
  }

  return {
    ...state,
    snake: nextSnake,
    direction,
    pendingDirection: direction
  };
}
