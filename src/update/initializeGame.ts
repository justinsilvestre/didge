import { Effects } from "../effects/effects";
import { createFeature, FeatureTypes } from "../state/Feature";
import { GameEventTypes } from "../state/GameEvent";
import { createGame, GameState } from "../state/GameState";
import { createGrid } from "../state/Grid";
import { createTokensWallet } from "../state/TokensWallet";
import { createUnit } from "../state/Unit";
import { actions } from "./actions";

const DEFAULT_GRID_HEIGHT = 15;
const DEFAULT_GRID_WIDTH = 15;

const INITIAL_RESOURCES = 20;
const INITIAL_TRADE_GOODS = 20;
const INITIAL_MAX_RESOURCES = 50;
const INITIAL_MAX_TRADE_GOODS = 50;

const range = (n: number) => Array.from(Array(n).keys());
export function initializeGame(effects: Effects): GameState {
  const initialTroops = range(10).map((i) =>
    createUnit({
      type: "SOLDIER",
      id: effects.uuid(),
    })
  );
  const entrance = createFeature({
    id: effects.uuid(),
    type: FeatureTypes.STAIRWELL,
    contents: initialTroops.map((troop) => troop.id),
    shape: [[0, 0]],
    connectedSpaces: [],
    gridLocation: [Math.floor(DEFAULT_GRID_WIDTH / 2), 0],
  });

  return createGame({
    grid: createGrid({
      width: DEFAULT_GRID_WIDTH,
      height: DEFAULT_GRID_HEIGHT,
      features: { [entrance.id]: entrance },
      units: Object.fromEntries(
        initialTroops.map((troop) => [troop.id, troop])
      ),
    }),
    tokens: createTokensWallet({
      resources: INITIAL_RESOURCES,
      tradeGoods: INITIAL_TRADE_GOODS,
      maxResources: INITIAL_MAX_RESOURCES,
      maxTradeGoods: INITIAL_MAX_TRADE_GOODS,
    }),
    recurringEvents: {},
    pendingMoves: [
      {
        type: GameEventTypes.EXPLORE,
        order: 0,
      },
    ],
  });
}
