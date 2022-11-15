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
  status: PlayerStatus;
};

type PlayerStatus = Partial<Record<PlayerStatusElement, 1>>;

type PlayerStatusElement =
  | "exploring"
  | "resolvingCombat"
  | "trading"
  | "building"
  | "recruiting"
  | "thieves may target the hold";

export function createGame({
  grid,
  tokens,
  status,
}: {
  grid: Grid;
  tokens: TokensWallet;
  status: PlayerStatus;
}): GameState {
  return { grid, tokens, status };
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
