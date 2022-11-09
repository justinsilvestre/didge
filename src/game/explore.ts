import { Feature } from "./Feature";
import { FeatureTypes } from "./FeatureType";
import { Game } from "./Game";
import { success } from "./Result";

export function explore(
  x: number,
  y: number,
  suit: Suit,
  value: Value,
  gameState: Game
){
  switch (suit) {
    case 1: {
      // resources
      const gridUpdate = gameState.grid.tryAddingFeatureAt(newCavern(), x, y);

      if (gridUpdate.ok) {
        const newResources = value + gameState.getCurrentDepth();
        const newPlayer = gameState.player.addResources(newResources);

        return {
          ok: true,
          value: gameState.clone({
            player: newPlayer,
            grid: gridUpdate.value,
          }),
        };
      } else {
        return {
          ok: false,
          error: gridUpdate.error,
        };
      }
    }
    case 2: {
      // trade goods
      const gridUpdate = gameState.grid.tryAddingFeatureAt(newCavern(), x, y);

      if (gridUpdate.ok) {
        const newTradeGoods = value + gameState.getCurrentDepth();
        const newPlayer = gameState.player.addTradeGoods(newTradeGoods);

        return {
          ok: true,
          value: gameState.clone({
            player: newPlayer,
            grid: gridUpdate.value,
          }),
        };
      } else {
        return {
          ok: false,
          error: gridUpdate.error,
        };
      }
    }
    case 3: {
      // natural formation
      return success(gameState);
    }
    case 4: {
      // remnant
      if (gameState.getCurrentDepth() === 1) {
        return {
          ok: false,
          error: "cannot uncover remnant on first level",
        }
      }
      return success(gameState);
    }
  }
}

type Suit = /** heart */ 1 | /** diamond */ 2 | /** club */ 3 | /** spade */ 4;
type Value =
  | /** ace */ 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | /** jack */ 11
  | /** queen */ 12
  | /** king */ 13;
function newCavern(): Feature {
  return new Feature({
    id: "PLACEHOLDER",
    type: FeatureTypes.CAVERN,
    shape: [[0, 0]],
    troops: [],
  });
}
