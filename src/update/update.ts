import { GameState, getCurrentDepth } from "../state/GameState";
import { Action, actions, ActionType } from "./actions";
import { ActionTypes as A } from "./ActionTypes";
import { effects } from "../effects/effects";
import { initializeGame } from "./initializeGame";
import { res, tg } from "../state/tokens";
import { cloneGrid } from "../state/Grid";
import { Feature, FeatureShape } from "../state/Feature";
import { cmd, Command, effectOf, UpdateResult } from "./Command";
import { canFeatureBeBuiltAt } from "./canFeatureBeBuiltAt";
import { addTokens } from "../state/TokensWallet";
import { SpecialEvent, SPECIAL_EVENTS } from "../state/SpecialEvent";

export const update = defineUpdates(
  (
    state = initializeGame(effects),
    action,
    { setState, runCommand, setStateAndRunCommand, setStateAndRunCommands }
  ) => {
    switch (action.type) {
      case A.START_EXPLORING:
        return runCommand(
          cmd.exploreAttempt(
            effectOf.getLocationInput(),
            effectOf.getLocationInput()
          )
        );

      case A.EXPLORE_ATTEMPT: {
        const { origin, destination } = action;
        const [x, y] = destination;
        const cavernCanBeBuiltAtDestination = canFeatureBeBuiltAt(
          state.grid,
          [[0, 0]],
          x,
          y
        );
        if (cavernCanBeBuiltAtDestination.ok)
          return runCommand(
            cmd.exploreSuccess(
              origin,
              destination,
              effectOf.drawCard({
                includeSpades: getCurrentDepth(state) > 1,
                includeJokers: false,
              }),
              effectOf.uuid()
            )
          );

        return runCommand(
          cmd.exploreFailure(cavernCanBeBuiltAtDestination.error)
        );
      }

      case A.EXPLORE_SUCCESS: {
        const { draw, destination, origin, newFeatureId } = action;

        if (draw.type === "JOKER") {
          throw new Error("Joker not implemented");
        } else {
          if (draw.suit === "HEART" || draw.suit === "DIAMOND") {
            const { tokens, grid } = state;
            const tokenType = draw.suit === "HEART" ? res : tg;
            const tokensToAdd = draw.value + getCurrentDepth(state);
            const newGrid = cloneGrid(state.grid);
            const shape: FeatureShape = [[0, 0]];
            const feature: Feature = {
              id: newFeatureId,
              type: "CAVERN",
              shape,
              gridLocation: destination,
              connectedSpaces: [origin],
              contents: [],
            };
            const newlyOccupiedCoordinates = shape.map(([x, y]) => [
              x + destination[0],
              y + destination[1],
            ]);
            console.log({ newlyOccupiedCoordinates });
            for (const [x, y] of newlyOccupiedCoordinates) {
              newGrid.featuresMatrix[y][x] = newFeatureId;
            }
            newGrid.features[newFeatureId] = feature;
            console.log({ newlyOccupiedCoordinates, newGrid });

            return setStateAndRunCommands(
              {
                ...state,
                grid: newGrid,
              },
              [
                cmd.updateTokens(tokenType(tokensToAdd), "explore"),
                cmd.addFeature(feature),
              ]
            );
          } else if (draw.suit === "CLUB") {
            // natural formation
            console.log("nat form");
            return setState(state);
          } else if (draw.suit === "SPADE") {
            // remnant
            console.log("remnant");
            return setState({
              ...state,
            });
          }
        }
        return [state, []];
      }

      case A.RESOLVE_NATURAL_FORMATION:
        return runCommand(
          cmd.exploreAttempt(
            effectOf.getLocationInput(),
            effectOf.getLocationInput()
          )
        );

      case A.RESOLVE_REMNANT: {
        const { drawFromExploreSuccess } = action;
        if (drawFromExploreSuccess.value === 11)
          return runCommand(cmd.thievesTargetTheHold(effectOf.d4()));

        return runCommand(
          cmd.exploreAttempt(
            effectOf.getLocationInput(),
            effectOf.getLocationInput()
          )
        );
      }

      case A.THIEVES_TARGET_THE_HOLD: {
        return action.d4 === 1
          ? runCommand(
              cmd.updateTokens(
                tg(-Math.ceil(state.tokens.tradeGoods / 2)),
                "thieves steal half of your trade goods"
              )
            )
          : runCommand(
              cmd.exploreAttempt(
                effectOf.getLocationInput(),
                effectOf.getLocationInput()
              )
            );
      }

      case A.UPDATE_TOKENS: {
        const triggeredEvents = SPECIAL_EVENTS[action.type] || [];
        const beforeEvents = triggeredEvents.filter(
          (e): e is SpecialEvent<"updateTokens"> & { occasion: "before" } =>
            e.occasion === "before"
        );
        let newState = state;
        let newCmds = [];
        for (const event of beforeEvents) {
          const { effect } = event;
          const [nextState, nextCmds] = effect(state, action);
          newState = nextState;
          newCmds.push(...nextCmds);
        }
        const update = setState({
          ...state,
          tokens: addTokens(state.tokens, action.difference),
        });
        const afterEvents = triggeredEvents.filter(
          (e) => e.occasion === "after"
        );

        return update;
      }

      case A.ADD_FEATURE: {
        const { feature: newFeature } = action;
        const newlyOccupiedSpaces = newFeature.shape.map(([x, y]) => [
          x + newFeature.gridLocation[0],
          y + newFeature.gridLocation[1],
        ]);
        const newGrid = cloneGrid(state.grid);
        newGrid.features[newFeature.id] = newFeature;
        for (const [x, y] of newlyOccupiedSpaces) {
          newGrid.featuresMatrix[y][x] = newFeature.id;
        }

        return setState({
          ...state,
          grid: newGrid,
        });
      }

      default:
        return setState(state);
    }
  }
);

function last<T>(arr: T[]): T | undefined {
  return arr[arr.length - 1];
}

function defineUpdates(
  definition: (
    state: GameState | undefined,
    action: Action,
    helpers: {
      setState: (newState: GameState) => UpdateResult<GameState, ActionType>;
      runCommand: (
        command: Command<ActionType>
      ) => UpdateResult<GameState, ActionType>;
      setStateAndRunCommand: (
        newState: GameState,
        command: Command<ActionType>
      ) => UpdateResult<GameState, ActionType>;
      setStateAndRunCommands: (
        newState: GameState,
        commands: Command<ActionType>[]
      ) => UpdateResult<GameState, ActionType>;
    }
  ) => UpdateResult<GameState, ActionType>
): (
  stateWithLastCmd: UpdateResult<GameState, ActionType> | undefined,
  action: Action
) => UpdateResult<GameState, ActionType> {
  return (stateWithLastCmd, action) => {
    return definition(stateWithLastCmd?.[0], action, {
      setState: (newState) => [newState, []],
      runCommand: (command) => [stateWithLastCmd![0], [command]],
      setStateAndRunCommand: (newState, command) => [newState, [command]],
      setStateAndRunCommands: (newState, commands) => [newState, commands],
    });
  };
}
