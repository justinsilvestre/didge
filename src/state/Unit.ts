import { Dict } from "./Dict";

export type UnitId = string;
export type UnitsDict = Dict<UnitId, Unit>;
export type Unit = {
  id: UnitId;
  type: UnitType;
};
export function createUnit({ id, type }: { id: UnitId; type: UnitType }): Unit {
  return {
    id,
    type,
  };
}

export type UnitType = keyof typeof UnitTypes;
const UnitTypes = {
  SOLDIER: "SOLDIER",
  GUNNER: "GUNNER",
  HOUND: "HOUND",
  CLERIC: "CLERIC",
  MAGE: "MAGE",
  PRISONER: "PRISONER",
  ALCHEMIST: "ALCHEMIST",
  GOLEM: "GOLEM",
  CANNON: "CANNON",
  SKULL_DWARF: "SKULL_DWARF",
} as const;
