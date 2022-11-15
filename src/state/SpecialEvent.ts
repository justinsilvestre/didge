import { ActionOf, ActionType } from "../update/actions";
import { ActionTypes } from "../update/ActionTypes";
import { cmd, UpdateResult } from "../update/Command";
import { FeatureId } from "./Feature";
import { GameState } from "./GameState";
import { tg } from "./tokens";
import { Unit } from "./Unit";

export type SpecialEvent<A extends ActionType> =
  | {
      id: string;
      actionType: A;
      occasion: "before";
      effect: (
        state: GameState,
        action: ActionOf<A>
      ) => UpdateResult<GameState, ActionType>;
    }
  | {
      id: string;
      actionType: A;
      occasion: "after";
      effect: (
        previousState: GameState,
        currentState: GameState,
        action: ActionOf<A>
      ) => UpdateResult<GameState, ActionType>;
    };

const eventsOfType = <A extends ActionType>(
  actionType: A,
  events: Omit<SpecialEvent<A>, "actionType">[]
): SpecialEvent<A>[] => {
  return events.map((e) => ({ ...e, actionType } as SpecialEvent<A>));
};

export const SPECIAL_EVENTS: {
  [A in ActionType]?: SpecialEvent<A>[];
} = {
  [ActionTypes.UPDATE_TOKENS]: eventsOfType(ActionTypes.UPDATE_TOKENS, [
    {
      id: "thieves may target the hold",
      occasion: "after",
      effect: (previousState, currentState, action) => {
        const warning =
          previousState.tokens.tradeGoods <= 100 &&
          currentState.tokens.tradeGoods > 100;

        return [currentState, null];
      },
    },
  ]),
  [ActionTypes.RESOLVE_REMNANT]: eventsOfType(ActionTypes.RESOLVE_REMNANT, [
    {
      id: "thieves target the hold",
      occasion: "after",
      effect: (previousState, currentState, action) => {
        if (action.drawFromExploreSuccess.value === 1) {
          const tokendsDif = tg(-Math.ceil(currentState.tokens.tradeGoods / 2));
          return [
            currentState,
            cmd.updateTokens(
              tokendsDif,
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
          return [currentState, [cmd.addUnits(unitsToAdd), cmd.enterCombat()]];
        }
      },
    },
  ]),
};
