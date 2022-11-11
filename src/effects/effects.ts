import { v4 as uuidv4 } from "uuid";

export type Effects = typeof effects;
export type Effect = Effects[EffectName];
export type EffectName = keyof Effects;
export type EffectOf<Name extends EffectName> = Effects[Name];
export type EffectResultOf<Name extends EffectName> = ReturnType<
  EffectOf<Name>
>;
export type EffectWithReturnType<ReturnType> = Extract<
  Effect,
  (...args: any[]) => ReturnType
>;

export type NameOfEffectWithReturnType<ReturnType> = Extract<
  EffectName,
  {
    [K in EffectName]: EffectOf<K> extends
      | EffectWithReturnType<ReturnType>
      | EffectWithReturnType<Promise<ReturnType>>
      ? K
      : never;
  }[EffectName]
>;

export type D3Result = 1 | 2 | 3;

export type D4Result = 1 | 2 | 3 | 4;

export type D13Result = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;

type DrawOptions = {
  includeSpades: boolean;
  includeJokers: boolean;
};
export type SuitCard = {
  suit: "HEART" | "DIAMOND" | "CLUB" | "SPADE";
  /** one to thirteen */
  value: number;
};
export type AnyCard =
  | ({
      type: "SUIT";
    } & SuitCard)
  | {
      type: "JOKER";
      color: "BLACK" | "RED";
    };
const SUITS = {
  0: "HEART",
  1: "DIAMOND",
  2: "CLUB",
  3: "SPADE",
} as const;

export const effects = {
  test: (x: string) => x,
  testAsync: async (x: string) => x,

  uuid: () => uuidv4(),

  d3: () => (Math.floor(Math.random() * 3) + 1) as D3Result,

  d4: () => (Math.floor(Math.random() * 4) + 1) as D4Result,

  d13: () => (Math.floor(Math.random() * 13) + 1) as D13Result,

  drawCard: (options: Partial<DrawOptions>): AnyCard => {
    const overriddenOptions = {
      includeSpades: true,
      includeJokers: false,
      ...options,
    };
    if (options.includeJokers) {
      const d54 = Math.floor(Math.random() * 54);
      if (d54 === 52) {
        return {
          type: "JOKER",
          color: "RED",
        };
      } else if (d54 === 53) {
        return {
          type: "JOKER",
          color: "RED",
        };
      }
    }
    const suitNumber = overriddenOptions.includeSpades ? random(4) : random(3);
    return {
      type: "SUIT",
      suit: SUITS[suitNumber as 0 | 1 | 2 | 3],
      value: random(13) + 1,
    };
  },

  getLocationInput: async () => {
    console.log("awaiting location input");
    const location = await new Promise<[number, number]>((res, rej) => {
      const waitForClick = (e: MouseEvent) => {
        console.log("clicked somewhere!");
        if (e.target && e.target instanceof HTMLElement) {
          console.log(e.target.tagName);
          const x = e.target.dataset.x;
          const y = e.target.dataset.y;
          if (x && y) {
            console.log("REGISTERED CLICK!!!", { x, y });
            document.removeEventListener("click", waitForClick);
            return res([parseInt(x), parseInt(y)]);
          }
        }
      };
      document.addEventListener("click", waitForClick);
    });
    return location;
  },
};

function random(upTillExclusive: number) {
  return Math.floor(Math.random() * upTillExclusive);
}
