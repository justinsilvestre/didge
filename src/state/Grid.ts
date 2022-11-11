import { FeaturesDict, FeatureId } from "./Feature";
import { UnitsDict } from "./Unit";

export type Grid = {
  width: number;
  height: number;

  /** rooms, traps, barricades */
  features: FeaturesDict;
  featuresMatrix: (FeatureId | null)[][];

  units: UnitsDict;
};

const range = (length: number) => Array.from(Array(length).keys());

export function createGrid({
  width,
  height,
  features,
  units,
}: {
  width: number;
  height: number;
  features: FeaturesDict;
  units: UnitsDict;
}) {
  const featuresMatrix: Grid["featuresMatrix"] = range(height).map(() =>
    range(width).map(() => null)
  );

  for (const feature of Object.values(features)) {
    const [x, y] = feature.gridLocation;
    featuresMatrix[y][x] = feature.id;
  }
  return {
    width,
    height,
    features,
    featuresMatrix: featuresMatrix,
    units,
  };
}

/** does not clone individual features */
export function cloneGrid(base: Grid): Grid {
  return createGrid(base);
}
