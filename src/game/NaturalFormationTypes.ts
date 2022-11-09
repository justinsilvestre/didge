import { Game } from "./Game";

export type NaturalFormationType = keyof typeof NaturalFormationTypes;
export const NaturalFormationTypes = {
  UNDERGROUND_FOREST: "UNDERGROUND_FOREST",
  WYRD: "WYRD", // really many different kinds
  GAS_FILLED_CHAMBER: "GAS_FILLED_CHAMBER",
  MAGIC: "MAGIC",
  UNDERGROUND_RIVER: "UNDERGROUND_RIVER",
  CAVERN: "CAVERN",
  CRYSTAL_CAVERN: "CRYSTAL_CAVERN",
  MAGMA_FLOW: "MAGMA_FLOW",
  UNDERGROUND_LAKE: "UNDERGROUND_LAKE",
  HIVE_OF_CREATURES: "HIVE_OF_CREATURES",
  VOLCANIC_SHAFT: "VOLCANIC_SHAFT",
  SMALL_TAMABLE_CREATURE_CAVERN: "SMALL_TAMABLE_CREATURE_CAVERN",
  LARGE_CREATURE_CAVERN: "LARGE_CREATURE_CAVERN",
  BURROWING_BEAST: "BURROWING_BEAST",
} as const;

type NaturalFormationSpecs = {
  gridSpaces: number | "D4" | "D2";
  effect?: {
    description: string;
    execute: (game: Game) => Game;
  };
};

const specs = ({ gridSpaces = 1 }: { gridSpaces?: number | "D4" | "D2" }) => ({
  gridSpaces,
});

export const NATURAL_FORMATIONS: Record<
  NaturalFormationType,
  NaturalFormationSpecs
> = {
  UNDERGROUND_FOREST: specs({}),
  WYRD: specs({}),
  GAS_FILLED_CHAMBER: specs({}),
  MAGIC: specs({}),
  UNDERGROUND_RIVER: specs({}),
  CAVERN: specs({}),
  CRYSTAL_CAVERN: specs({}),
  MAGMA_FLOW: specs({}),
  UNDERGROUND_LAKE: specs({}),
  HIVE_OF_CREATURES: specs({}),
  VOLCANIC_SHAFT: specs({}),
  SMALL_TAMABLE_CREATURE_CAVERN: specs({}),
  LARGE_CREATURE_CAVERN: specs({}),
  BURROWING_BEAST: specs({}),
};
