import { GameEvent } from "../state/GameEvent";
import { FeatureId } from "../state/Feature";
import { TokensAmount } from "../state/tokens";
import { Unit } from "../state/Unit";
import { AnyCard, D13Result, D4Result, SuitCard } from "../effects/effects";
import { ActionTypes } from "./ActionTypes";
import { GameState } from "../state/GameState";
import { EntityId } from "../state/EntityId";

const A = ActionTypes;

export const actions = {
  init: () => ({ type: A.INIT }),
  resolveEvent: (event: GameEvent) => ({
    type: A.RESOLVE_EVENT,
    event,
  }),
  exploreAttempt: (
    origin: [x: number, y: number],
    destination: [x: number, y: number]
  ) => ({
    type: A.EXPLORE_ATTEMPT,
    destination,
    origin,
  }),
  exploreFailure: (reason: string) => ({
    type: A.EXPLORE_FAILURE,
    reason,
  }),
  exploreSuccess: (
    origin: [x: number, y: number],
    destination: [x: number, y: number],
    draw: AnyCard,
    newFeatureId: EntityId
  ) => ({
    type: A.EXPLORE_SUCCESS,
    destination,
    origin,
    draw,
    newFeatureId,
  }),
  addRecurringEvent: (event: GameEvent) => ({
    type: A.ADD_RECURRING_EVENT,
    event,
  }),
  updateTokens: (difference: TokensAmount, reason: string) => ({
    type: A.UPDATE_TOKENS,
    difference,
    reason,
  }),
  enqueueEvent: (event: GameEvent) => {
    return {
      type: A.ENQUEUE_EVENT,
      event,
    };
  },
  enterCombat: () => ({
    type: A.ENTER_COMBAT,
  }),
  addUnits: (unitPlacements: UnitPlacement[]) => ({
    type: A.ADD_UNITS,
    unitPlacements,
  }),
  thievesTargetTheHold: (d4: D4Result) => ({
    type: A.THIEVES_TARGET_THE_HOLD,
    d4,
  }),
} as const;

type UnitPlacement = {
  unit: Unit;
  featureId: FeatureId;
};

export type ActionType = typeof ActionTypes[keyof typeof ActionTypes];
export type ActionOf<T extends ActionType> = ReturnType<
  typeof actions[T]
> extends { type: T }
  ? ReturnType<typeof actions[T]>
  : never;
export type Action = ActionOf<ActionType>;
