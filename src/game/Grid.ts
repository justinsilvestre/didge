import { FeaturesDict, FeatureId, Feature } from "./Feature";
import { FeatureTypes } from "./FeatureType";
import { Result } from "./Result";
import { UnitsDict, UnitType } from "./Unit";


export class Grid {
  width: number;
  height: number;

  /** rooms, traps, barricades */
  features: FeaturesDict;
  featuresMatrix: (FeatureId | null)[][];

  units: UnitsDict

  constructor({
    width,
    height,
    features,
    units
  }: {
    width: number;
    height: number;
    features: FeaturesDict;
    units: UnitsDict
  }) {
    this.width = width;
    this.height = height;
    this.features = features;
    this.featuresMatrix = new Array(height)
      .fill(null)
      .map(() => new Array(width).fill(null));
    this.units = units
  }

  /** does not clone individual features */
  clone(): Grid {
    return new Grid({
      width: this.width,
      height: this.height,
      features: new Map(this.features),
      units: new Map(this.units)
    });
  }

  getFeature(id: FeatureId): Feature {
    return this.features.get(id)!;
  }

  featureAt(x: number, y: number): Feature | null {
    const featureId = this.featuresMatrix[y][x];
    if (featureId === null) {
      return null;
    }
    return this.getFeature(featureId) || null;
  }

  isOccupiedAt(x: number, y: number): boolean {
    const featureAtLocation = this.featureAt(x, y)
    return featureAtLocation !== null && featureAtLocation.type !== FeatureTypes.CAVERN;
  }

  isExploredAt(x: number, y: number): boolean {
    return this.featureAt(x, y) !== null;
  }

  tryAddingFeatureAt(
    feature: Feature,
    topLeftX: number,
    topLeftY: number
  ): Result<Grid, string> {
    const offsets = feature.shape;
    const newlyOccupiedCoordinates = offsets.map(([x, y]) => [
      x + topLeftX,
      y + topLeftY,
    ]);

    const clashingCoordinates = newlyOccupiedCoordinates
      .map(([x, y]) => (this.isOccupiedAt(x, y) ? [x, y] : null))
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

    const newGrid = this.clone();
    for (const [x, y] of newlyOccupiedCoordinates) {
      newGrid.featuresMatrix[y][x] = feature.id;
    }
    newGrid.features.set(feature.id, feature);

    return {
      ok: true,
      value: newGrid,
    };
  }

  hasAnyUnitsOfType(type: UnitType) {
    return Array.from(this.units.values()).some(unit => unit.type === type)
  }
}


