import { HindranceTypes } from "./HindranceTypes";
import { RoomTypes } from "./RoomTypes";

export type FeatureType = keyof typeof FeatureTypes;

export const FeatureTypes = {
  /** "empty" cavern */
  CAVERN: "CAVERN",
  ENTRANCE: "ENTRANCE",
  ...RoomTypes,
  ...HindranceTypes
} as const;
