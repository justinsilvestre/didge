import { UNIT_SPECS } from "./UnitSpecs";

export type UnitId = string;
export type UnitsDict = Map<UnitId, Unit>;

export class Unit {
  id: UnitId;
  type: UnitType;

  constructor({ id, type }: { id: UnitId; type: UnitType }) {
    this.id = id;
    this.type = type;
  }

  strength() {
    return UNIT_SPECS[this.type].strength;
  }

  speed() {
    return UNIT_SPECS[this.type].speed;
  }

  shieldStrength(adjacentClericsCount: number) {
    return adjacentClericsCount * 5;
  }

  isRanged() {
    return UNIT_SPECS[this.type].ranged;
  }

  isImmuneToLiquidAndGas() {
    return this.type === "GOLEM";
  }

  isHostile() {
    return this.type !== "PRISONER";
  }

  shouldReviveAfterCombat(d4: number) {
    return this.type === "SKULL_DWARF" && d4 >= 3;
  }
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
};
