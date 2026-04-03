import { useEffect, useMemo, useRef, useState } from 'react';
import { BOARD_SIZE } from '../game/constants';
import { createInitialState, getSafeDirection, positionKey, tickGame } from '../game/logic';
import type { Direction, GameState } from '../game/types';
import { parseDirectionFromKey } from '../utils/keyboard';
import '../styles/snake-game.css';

export function SnakeGame() {
  const [game, setGame] = useState<GameState>(() => createInitialState());
  const boardRef = useRef<HTMLDivElement | null>(null);

  const snakeCellSet = useMemo(() => {
    return new Set(game.snake.map(positionKey));
  }, [game.snake]);

  useEffect(() => {
    if (game.status !== 'running') {
      return;
    }

    const timer = window.setInterval(() => {
      setGame((current) => tickGame(current));
    }, game.speedMs);

    return () => window.clearInterval(timer);
  }, [game.status, game.speedMs]);

  useEffect(() => {
    boardRef.current?.focus();
  }, [game.status]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const parsed = parseDirectionFromKey(event.key);
      if (!parsed) {
        return;
      }

      event.preventDefault();

      setGame((current) => {
        if (current.status === 'idle') {
          const direction = getSafeDirection(parsed, current.direction);
          return {
            ...current,
            status: 'running',
            pendingDirection: direction
          };
        }

        if (current.status !== 'running') {
          return current;
        }

        return {
          ...current,
          pendingDirection: getSafeDirection(parsed, current.direction)
        };
      });
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const startGame = () => {
    setGame((current) => {
      if (current.status === 'running') {
        return current;
      }
      return { ...createInitialState(), status: 'running' };
    });
  };

  const restartGame = () => {
    setGame({ ...createInitialState(), status: 'running' });
  };

  const onDirectionButton = (direction: Direction) => {
    setGame((current) => {
      if (current.status !== 'running') {
        return current;
      }
      return {
        ...current,
        pendingDirection: getSafeDirection(direction, current.direction)
      };
    });
  };

  return (
    <main className="page">
      <section className="panel">
        <header className="panel-header">
          <h1>Snake</h1>
          <p className="subtitle">Use Arrow keys or WASD to move.</p>
        </header>

        <div className="status-row">
          <div className="score-card">
            <span>Score</span>
            <strong>{game.score}</strong>
          </div>
          <button
            className="primary-btn"
            onClick={game.status === 'over' ? restartGame : startGame}
            type="button"
          >
            {game.status === 'over' ? 'Restart' : game.status === 'running' ? 'Running' : 'Start'}
          </button>
        </div>

        {game.status === 'over' && <p className="game-over">Game over! Press restart to play again.</p>}

        <div
          className="board"
          ref={boardRef}
          tabIndex={0}
          role="application"
          aria-label="Snake game board"
          style={{ gridTemplateColumns: `repeat(${BOARD_SIZE}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: BOARD_SIZE * BOARD_SIZE }, (_, index) => {
            const x = index % BOARD_SIZE;
            const y = Math.floor(index / BOARD_SIZE);
            const key = `${x}:${y}`;
            const isSnake = snakeCellSet.has(key);
            const isHead = game.snake[0].x === x && game.snake[0].y === y;
            const isFood = game.food.x === x && game.food.y === y;

            return (
              <div
                className={`cell${isSnake ? ' snake' : ''}${isHead ? ' head' : ''}${isFood ? ' food' : ''}`}
                key={key}
              />
            );
          })}
        </div>

        <div className="mobile-controls" aria-hidden>
          <button onClick={() => onDirectionButton('UP')} type="button">↑</button>
          <button onClick={() => onDirectionButton('LEFT')} type="button">←</button>
          <button onClick={() => onDirectionButton('DOWN')} type="button">↓</button>
          <button onClick={() => onDirectionButton('RIGHT')} type="button">→</button>
        </div>
      </section>
    </main>
  );
}
