import { FeatureType } from "./FeatureType";
import { UnitId } from "./Unit";

export type FeatureId = string;
export type FeaturesDict = Map<FeatureId, Feature>;

type OffsetFromTopLeft = [number, number];

export type FeatureShape = OffsetFromTopLeft[];

/** room,  */
export class Feature {
  id: FeatureId;
  shape: FeatureShape;
  type: FeatureType;
  
  troops: UnitId[]

  constructor({
    id,
    shape,
    type,
    troops
  }: {
    id: FeatureId;
    shape: OffsetFromTopLeft[];
    type: FeatureType;
    troops: UnitId[]
  }) {
    this.id = id;
    this.shape = shape;
    this.type = type;
    this.troops = troops
  }

  /** does not clone shape, troops */
  clone(): Feature {
    return new Feature({
      id: this.id,
      shape: this.shape,
      type: this.type,
      troops: this.troops,
    });
  }
}
