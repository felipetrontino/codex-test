export type Position = {
  x: number;
  y: number;
};

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export type GameStatus = 'idle' | 'running' | 'over';

export type GameState = {
  snake: Position[];
  food: Position;
  direction: Direction;
  pendingDirection: Direction;
  score: number;
  status: GameStatus;
  speedMs: number;
};
