import { EventsDict, GameEvent } from "./GameEvent";
import { Grid } from "./Grid";
import { TokensWallet } from "./TokensWallet";

// phases:
//   explore
//   resolve combat if it occurs
//   trade between resources/trade goods
//   build new features--rooms, traps, barricades
//   recruit new units
export type GameState = {
  grid: Grid;
  tokens: TokensWallet;
  recurringEvents: EventsDict;
  pendingMoves: GameEvent[];
};

export function createGame({
  grid,
  tokens,
  recurringEvents,
  pendingMoves,
}: {
  grid: Grid;
  tokens: TokensWallet;
  recurringEvents: EventsDict;
  pendingMoves: GameEvent[];
}): GameState {
  return { grid, tokens, recurringEvents, pendingMoves };
}

/** does not clone gride and tokens */
export function cloneGame(
  game: GameState,
  props: Partial<GameState> = {}
): GameState {
  const {
    grid = game.grid,
    tokens = game.tokens,
    recurringEvents = game.recurringEvents,
    pendingMoves = game.pendingMoves,
  } = props;
  return createGame({ grid, tokens, recurringEvents, pendingMoves });
}

export function getCurrentDepth({ grid }: GameState) {
  let depth = 0;
  for (const row of grid.featuresMatrix) {
    if (row.every((featureId) => featureId === null)) {
      return depth;
    }
    depth++;
  }
  return depth;
}
