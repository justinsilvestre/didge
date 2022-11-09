import { res, tg } from "./tokens";

export type HindranceType = keyof typeof HindranceTypes;
export const HindranceTypes = {
  // traps
  DAMAGE_TRAP: "DAMAGE_TRAP",
  STOPPING_TRAP: "STOPPING_TRAP",

  // barricades
  DEFENSIVE_BARRICADES: "DEFENSIVE_BARRICADES",
  OFFENSIVE_BARRICADES: "OFFENSIVE_BARRICADES",
  SECRET_PASSAGES: "SECRET_PASSAGES",
} as const;

type HindranceSpecs = {
  cost: [resources: number, tradeGoods: number];
  gridSpaces: number;
};

const specs = ({
  cost,
  gridSpaces = 1
}: {
  cost: [resources: number, tradeGoods: number];
  gridSpaces?: number;
}) => ({
  cost,
  gridSpaces
});



export const Hindrances: Record<HindranceType, HindranceSpecs> = {
  DAMAGE_TRAP: specs({
    cost: res(20),
  }),
  STOPPING_TRAP: specs({
    cost: res(15),
  }),
  DEFENSIVE_BARRICADES: specs({
    cost: tg(10),
  }),
  OFFENSIVE_BARRICADES: specs({
    cost: tg(20),
  }),
  SECRET_PASSAGES: specs({
    cost: tg(50),
  }),

};
