import { FeatureId, Feature, FeatureTypes } from "./Feature";
import { Grid } from "./Grid";
import { UnitType } from "./Unit";

export function getFeature(grid: Grid, id: FeatureId): Feature {
  return grid.features[id];
}

export function featureAt(grid: Grid, x: number, y: number): Feature | null {
  const featureId = grid.featuresMatrix[y][x];
  if (featureId === null) {
    return null;
  }
  return getFeature(grid, featureId) || null;
}

export function isOccupiedAt(grid: Grid, x: number, y: number): boolean {
  const featureAtLocation = featureAt(grid, x, y);
  return (
    featureAtLocation !== null && featureAtLocation.type !== FeatureTypes.CAVERN
  );
}

export function isExploredAt(grid: Grid, x: number, y: number): boolean {
  return featureAt(grid, x, y) !== null;
}

export function hasAnyUnitsOfType(grid: Grid, type: UnitType) {
  return Array.from(Object.values(grid.units)).some(
    (unit) => unit.type === type
  );
}
