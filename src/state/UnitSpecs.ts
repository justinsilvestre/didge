import { UnitType } from "./Unit";

type UnitSpecs = {
  strength: number;
  /** in trade goods */
  cost: number;
  ranged: boolean;
  speed: number;
};
const specs = ({
  strength, cost, ranged = false, speed = 1
}: {
  strength: number;
  cost: number;
  ranged?: boolean;
  /** spaces per round */
  speed?: number;
}): UnitSpecs => ({
  strength,
  cost,
  ranged,
  speed
});

export const UNIT_SPECS: Record<UnitType, UnitSpecs> = {
  SOLDIER: specs({ strength: 5, cost: 5 }),
  GUNNER: specs({ strength: 3, cost: 5, ranged: true }),
  HOUND: specs({ strength: 3, cost: 5, speed: 2 }),
  CLERIC: specs({ strength: 1, cost: 8 }),
  MAGE: specs({ strength: 4, cost: 7, ranged: true }),
  PRISONER: specs({ strength: 1, cost: 0 }),
  ALCHEMIST: specs({ strength: 2, cost: 8 }),
  GOLEM: specs({ strength: 7, cost: 15 }),
  CANNON: specs({ strength: 30, cost: 30, ranged: true }),
  SKULL_DWARF: specs({ strength: 1, cost: 5 }),
};
