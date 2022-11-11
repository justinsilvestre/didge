export const ActionTypes = {
  INIT: "init",
  EXPLORE_ATTEMPT: "exploreAttempt",
  EXPLORE_FAILURE: "exploreFailure",
  EXPLORE_SUCCESS: "exploreSuccess",
  ADD_RECURRING_EVENT: "addRecurringEvent",
  RESOLVE_EVENT: "resolveEvent",
  UPDATE_TOKENS: "updateTokens",
  ENQUEUE_EVENT: "enqueueEvent",
  ENTER_COMBAT: "enterCombat",
  ADD_UNITS: "addUnits",
  THIEVES_TARGET_THE_HOLD: "thievesTargetTheHold",
} as const;
