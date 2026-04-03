import type { Direction } from '../game/types';

const keyToDirection: Record<string, Direction> = {
  ArrowUp: 'UP',
  ArrowDown: 'DOWN',
  ArrowLeft: 'LEFT',
  ArrowRight: 'RIGHT',
  w: 'UP',
  W: 'UP',
  s: 'DOWN',
  S: 'DOWN',
  a: 'LEFT',
  A: 'LEFT',
  d: 'RIGHT',
  D: 'RIGHT'
};

export function parseDirectionFromKey(key: string): Direction | null {
  return keyToDirection[key] ?? null;
}
