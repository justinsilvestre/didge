import { UNIT_SPECS } from "./UnitSpecs";
import { Unit } from "./Unit";

export function strength(unit: Unit) {
  return UNIT_SPECS[unit.type].strength;
}

export function speed(unit: Unit) {
  return UNIT_SPECS[unit.type].speed;
}

export function shieldStrength(adjacentClericsCount: number) {
  return adjacentClericsCount * 5;
}

export function isRanged(unit: Unit) {
  return UNIT_SPECS[unit.type].ranged;
}

export function isImmuneToLiquidAndGas(unit: Unit) {
  return unit.type === "GOLEM";
}

export function isHostile(unit: Unit) {
  return unit.type !== "PRISONER";
}

export function shouldReviveAfterCombat(unit: Unit, d4: number) {
  return unit.type === "SKULL_DWARF" && d4 >= 3;
}
