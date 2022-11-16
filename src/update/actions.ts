import { Feature, FeatureId } from "../state/Feature";
import { TokensAmount } from "../state/tokens";
import { Unit } from "../state/Unit";
import { AnyCard, D4Result, SuitCard } from "../effects/effects";
import { ActionTypes } from "./ActionTypes";
import { EntityId } from "../state/EntityId";

const A = ActionTypes;

export const actions = {
  init: () => ({ type: A.INIT }),
  notify: (message: string) => ({ type: A.NOTIFY, message }),
  startExploring: () => ({ type: A.START_EXPLORING }),
  startTradeTokens: (change: TokensAmount) => ({
    type: A.START_TRADE_TOKENS,
  }),
  startBuildFeature: () => ({
    type: A.START_BUILD_FEATURE,
  }),
  startRecruitUnits: () => ({
    type: A.START_RECRUIT_UNITS,
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
  resolveNaturalFormation: () => ({
    type: A.RESOLVE_NATURAL_FORMATION,
  }),
  resolveRemnant: (drawFromExploreSuccess: SuitCard & { suit: "SPADE" }) => ({
    type: A.RESOLVE_REMNANT,
    drawFromExploreSuccess,
  }),
  updateTokens: (difference: TokensAmount, reason: string) => ({
    type: A.UPDATE_TOKENS,
    difference,
    reason,
  }),
  enterCombat: () => ({
    type: A.ENTER_COMBAT,
  }),
  addUnits: (unitPlacements: UnitPlacement[]) => ({
    type: A.ADD_UNITS,
    unitPlacements,
  }),
  addFeature: (feature: Feature) => ({
    type: A.ADD_FEATURE,
    feature,
  }),
  [A.THIEVES_TARGET_THE_HOLD]: (d4: D4Result) => ({
    type: A.THIEVES_TARGET_THE_HOLD,
    d4,
  }),
} as const;

type Actions = {
  [T in ActionType]: (...args: any[]) => ActionOf<T>;
};

/* eslint-disable @typescript-eslint/no-unused-vars */
const _validateActions: Actions = actions;
/* eslint-enable @typescript-eslint/no-unused-vars */

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
