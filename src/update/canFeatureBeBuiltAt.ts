import { Feature, FeatureShape } from "../state/Feature";
import { cloneGrid, Grid } from "../state/Grid";
import { Result } from "../state/Result";
import { isOccupiedAt } from "../state/gridUtils";

export function canFeatureBeBuiltAt(
  grid: Grid,
  shape: FeatureShape,
  topLeftX: number,
  topLeftY: number
): Result<string, string> {
  const newlyOccupiedCoordinates = shape.map(([x, y]) => [
    x + topLeftX,
    y + topLeftY,
  ]);

  const clashingCoordinates = newlyOccupiedCoordinates
    .map(([x, y]) => (isOccupiedAt(grid, x, y) ? [x, y] : null))
    .filter((x): x is [number, number] => x !== null);
  // TODO: check if feature would end up outside of grid
  if (clashingCoordinates.length) {
    return {
      ok: false,
      error: `Cannot add feature at occupied coordinates: ${clashingCoordinates
        .map(([x, y]) => `(${x}, ${y})`)
        .join(" ")}`,
    };
  }

  return {
    ok: true,
    value: "ok!",
  };
}
