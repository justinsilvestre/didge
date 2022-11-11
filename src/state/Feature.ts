import { Dict } from "./Dict";
import { RoomTypes } from "./Room";
import { EntityId } from "./EntityId";

export type FeatureId = string;
export type FeaturesDict = Dict<FeatureId, Feature>;

type OffsetFromTopLeft = [number, number];

export type FeatureShape = OffsetFromTopLeft[];

/** room,  */
export type Feature = {
  id: FeatureId;
  shape: FeatureShape;
  type: FeatureType;
  gridLocation: [number, number];

  contents: EntityId[];
  connectedSpaces: OffsetFromTopLeft[];
};

export function createFeature({
  id,
  shape,
  type,
  contents = [],
  connectedSpaces = [],
  gridLocation,
}: {
  id: FeatureId;
  shape: OffsetFromTopLeft[];
  type: FeatureType;
  contents?: EntityId[];
  connectedSpaces?: OffsetFromTopLeft[];
  gridLocation: [number, number];
}): Feature {
  return {
    id,
    shape,
    type,
    contents,
    connectedSpaces,
    gridLocation,
  };
}

/** does not clone shape, troops */
export function cloneFeature(base: Feature): Feature {
  return createFeature(base);
}

export type FeatureType = keyof typeof FeatureTypes;

export const FeatureTypes = {
  /** "empty" cavern */
  CAVERN: "CAVERN",
  STAIRWELL: "STAIRWELL",
  ...RoomTypes,
} as const;
