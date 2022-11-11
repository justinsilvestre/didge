import { ActionOf } from "../update/actions";
import { command, Command, effectOf } from "../update/Command";
import { canFeatureBeBuiltAt } from "../update/canFeatureBeBuiltAt";
import { Dict } from "./Dict";
import { FeatureId } from "./Feature";
import { GameState, getCurrentDepth } from "./GameState";
import { tg } from "./tokens";
import { Unit } from "./Unit";
import { ActionTypes as A } from "../update/ActionTypes";

/** events that may recur, scheduled at specific phases/on specific triggers */
export type GameEvent = {
  type: GameEventType;
  order: number;
};

export type GameEventType = keyof typeof GameEventTypes;

export type EventsDict = Dict<number, GameEvent>;

export const GameEventTypes = {
  GAME_START: "GAME_START",
  TURN_START: "TURN_START",
  EXPLORE: "EXPLORE",
  THIEVES_MAY_TARGET_THE_HOLD: "THIEVES_MAY_TARGET_THE_HOLD",
} as const;

export type GameEventSpecs<C extends Command> = {
  description: string;
  execute: (state: GameState) => C | null;
  followUp?: (state: GameState, action: ActionOf<C["action"]>) => Command[];
};

function specs<C extends Command>({
  description,
  execute,
  followUp,
}: GameEventSpecs<C>): GameEventSpecs<C> {
  return {
    description,
    execute,
    followUp,
  };
}

export const GAME_EVENT_SPECS = {
  TURN_START: specs({
    description: "",
    execute: () => null,
  }),
  EXPLORE: specs({
    description: "Explore a new space",
    execute: () =>
      command(
        A.EXPLORE_ATTEMPT,
        effectOf("getLocationInput"),
        effectOf("getLocationInput")
      ),
    followUp: (state, { destination, origin }) => {
      const [x, y] = destination;

      const cavernCanBeBuiltAtDestination = canFeatureBeBuiltAt(
        state.grid,
        [[0, 0]],
        x,
        y
      );

      return [
        cavernCanBeBuiltAtDestination.ok
          ? command(
              A.EXPLORE_SUCCESS,
              origin,
              destination,
              effectOf("drawCard", {
                includeSpades: getCurrentDepth(state) > 1,
                includeJokers: false,
              }),
              effectOf("uuid")
            )
          : command(A.EXPLORE_FAILURE, cavernCanBeBuiltAtDestination.error),
      ];
    },
  }),
  NATURAL_FORMATION: specs({
    description: "Natural formation",
    execute: () =>
      command(
        A.EXPLORE_ATTEMPT,
        effectOf("getLocationInput"),
        effectOf("getLocationInput")
      ),
  }),

  THIEVES_MAY_TARGET_THE_HOLD: specs({
    description:
      "thieves may arrive if you hoard too many trade goods. they may steal your trade goods or even attack your units.",
    execute(state) {
      if (state.tokens.tradeGoods <= 100) {
        return null;
      }
      return command(A.THIEVES_TARGET_THE_HOLD, effectOf("d4"));
    },
    followUp(state, action) {
      const { d4 } = action;
      if (d4 === 1) {
        return [
          command(
            A.UPDATE_TOKENS,
            tg(-Math.ceil(state.tokens.tradeGoods / 2)),
            "thieves steal half of your trade goods"
          ),
        ];
      } else {
        const lowestTreasuryId = "PLACEHOLDER";
        type UnitPlacement = {
          unit: Unit;
          featureId: FeatureId;
        };
        const unitsToAdd: UnitPlacement[] = [];
        return [command(A.ADD_UNITS, unitsToAdd), command("enterCombat")];
      }
    },
  }),
} as const;
