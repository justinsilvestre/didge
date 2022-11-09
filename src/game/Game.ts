import { Grid } from "./Grid";
import { Player } from "./Player";

// phases:
//   explore
//   resolve combat if it occurs
//   trade between resources/trade goods
//   build new features--rooms, traps, barricades
//   recruit new units
export class Game {
  grid: Grid;
  player: Player;

  constructor(grid: Grid, player: Player) {
    this.grid = grid;
    this.player = player;
  }

  /** does not clone gride and player */
  clone(props?: { grid?: Grid; player?: Player }): Game {
    const { grid = this.grid, player = this.player } = props || {};
    return new Game(grid, player);
  }

  getCurrentDepth() {
    let depth = 1;
    for (const row of this.grid.featuresMatrix) {
      if (row.every((featureId) => featureId === null)) {
        return depth;
      }
      depth++;
    }
    return depth;
  }
}
