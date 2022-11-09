import { res, tokens, TokensAmount } from "./tokens";

export type RoomType = keyof typeof RoomTypes;
export const RoomTypes = {
  CORRIDOR: "CORRIDOR",
  STAIRS: "STAIRS",
  // unit rooms
  BARRACKS: "BARRACKS",
  CANNON_OUTPOST: "CANNON_OUTPOST",
  FORGE: "FORGE",
  MASON: "MASON",
  INN: "INN",
  KENNEL: "KENNEL",
  LABORATORY: "LABORATORY",
  LIBRARY: "LIBRARY",
  PRISON: "PRISON",
  // buffing rooms:
  // give bonuses towards income, combat, etc.
  DORMS: "DORMS",
  HOSPITAL: "HOSPITAL",
  KITCHEN: "KITCHEN",
  MUSEUM: "MUSEUM",
  OVERSEERS_OFFICE: "OVERSEERS_OFFICE",
  SHRINE: "SHRINE",
  STOCKPILE: "STOCKPILE",
  STOREHOUSE: "STOREHOUSE",
  TEMPLE: "TEMPLE",
  TREASURY: "TREASURY",
  // infrastructure rooms:
  DRAWBRIDGE: "DRAWBRIDGE",
  ELEVATOR: "ELEVATOR",
  PUMP: "PUMP",
  TRACKS: "TRACKS",
  // advanced rooms:
  INVENTORS_LAB: "INVENTORS_LAB",
  BREEDER: "BREEDER",
} as const;

type RoomSpecs = {
  cost: TokensAmount;
  gridSpaces: number;
};

const specs = ({
  cost,
  gridSpaces = 1
}: {
  cost: TokensAmount;
  gridSpaces?: number;
}) => ({
  cost,
  gridSpaces
});


export const ROOMS: Record<RoomType, RoomSpecs> = {
  CORRIDOR: specs({
    cost: res(0),
  }),
  STAIRS: specs({
    cost: res(0),
  }),
  BARRACKS: specs({
    cost: res(8),
  }),
  CANNON_OUTPOST: specs({
    cost: res(10),
  }),
  FORGE: specs({
    cost: tokens(15, 7),
  }),
  MASON: specs({
    cost: res(20),
  }),
  INN: specs({
    cost: tokens(30, 10),
  }),
  KENNEL: specs({
    cost: res(5),
  }),
  LABORATORY: specs({
    cost: tokens(5, 10),
  }),
  LIBRARY: specs({
    cost: res(15),
  }),
  PRISON: specs({
    cost: res(30),
  }),
  DORMS: specs({
    cost: res(5),
  }),
  HOSPITAL: specs({
    cost: tokens(10, 10),
  }),
  KITCHEN: specs({
    cost: res(8),
  }),
  MUSEUM: specs({
    cost: tokens(50, 50),
    gridSpaces: 2,
  }),
  OVERSEERS_OFFICE: specs({
    cost: res(15)
  }),
  SHRINE: specs({
    cost: res(20),
  }),
  STOCKPILE: specs({
    cost: res(20),
  }),
  STOREHOUSE: specs({
    cost: res(15),
  }),
  TEMPLE: specs({
    cost: tokens(20,20),
    gridSpaces: 2,
  }),
  TREASURY: specs({
    cost: res(20),
  }),
  DRAWBRIDGE: specs({
    cost: res(15),
  }),
  ELEVATOR: specs({
    cost: res(5),
  }),
  PUMP: specs({
    cost: res(8 ),
  }),
  TRACKS: specs({
    cost: res(5),
  }),
  INVENTORS_LAB: specs({
    cost: tokens(100, 50),
  }),
  BREEDER: specs({
    cost: res(80),
    gridSpaces: 4,
  }),
};
