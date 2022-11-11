import { addEvent } from "../state/gameEventUtils";
import { cloneGame, GameState, getCurrentDepth } from "../state/GameState";
import { updateWallet } from "../state/TokensWallet";
import { Action } from "./actions";
import { ActionTypes as A } from "./ActionTypes";
import { effects } from "../effects/effects";
import { initializeGame } from "./initializeGame";
import { res, tg } from "../state/tokens";
import { cloneGrid } from "../state/Grid";
import { Feature, FeatureShape } from "../state/Feature";

export function update(
  state = initializeGame(effects),
  action: Action
): GameState {
  switch (action.type) {
    case A.RESOLVE_EVENT: {
      const eventIndex = state.pendingMoves.findIndex(
        (event) => event.order === action.event.order
      );
      return cloneGame(state, {
        pendingMoves: state.pendingMoves.slice(0, eventIndex),
      });
    }
    case A.EXPLORE_SUCCESS: {
      const { draw, destination, origin, newFeatureId } = action;
      const moveNumber = last(state.pendingMoves)!.order;
      const eventIndex = state.pendingMoves.findIndex(
        (event) => event.type === "EXPLORE"
      );
      if (eventIndex === -1) throw new Error("Could not find explore event");

      if (draw.type === "JOKER") {
        throw new Error("Joker not implemented");
      } else {
        if (draw.suit === "HEART" || draw.suit === "DIAMOND") {
          const tokenType = draw.suit === "HEART" ? res : tg;
          const tokensToAdd = draw.value + getCurrentDepth(state);
          const updatedTokens = updateWallet(
            state.tokens,
            tokenType(tokensToAdd)
          );
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

          return cloneGame(state, {
            tokens: updatedTokens,
            grid: newGrid,
            pendingMoves: [
              ...state.pendingMoves.slice(0, eventIndex),
              {
                type: "EXPLORE",
                order: moveNumber + 1,
              },
            ],
          });
        } else if (draw.suit === "CLUB") {
          // natural formation
          console.log("nat form");
          return {
            ...state,
            pendingMoves: [
              ...state.pendingMoves.slice(0, eventIndex),
              {
                type: "EXPLORE",
                order: moveNumber + 1,
              },
            ],
          };
        } else if (draw.suit === "SPADE") {
          // remnant
          console.log("remnant");
          return {
            ...state,
            pendingMoves: [
              ...state.pendingMoves.slice(0, eventIndex),
              {
                type: "EXPLORE",
                order: moveNumber + 1,
              },
            ],
          };
        }
      }
      return state;
    }
    case A.ADD_RECURRING_EVENT:
      return cloneGame(state, {
        recurringEvents: addEvent(state.recurringEvents, action.event),
      });
    case A.UPDATE_TOKENS:
      return cloneGame(state, {
        tokens: updateWallet(state.tokens, action.difference),
      });
    default:
      return state;
  }
}

function last<T>(arr: T[]): T | undefined {
  return arr[arr.length - 1];
}
