import React, { useEffect } from "react";
import "./App.css";
import { effects } from "./effects/effects";
import { getFeature } from "./state/gridUtils";
import { GAME_EVENT_SPECS } from "./state/GameEvent";
import { actions, ActionType } from "./update/actions";
import { Command } from "./update/Command";
import { useDispatch, useSelector, useStore } from "react-redux";
import { GameState } from "./state/GameState";

function last<T>(arr: T[]): T | undefined {
  return arr[arr.length - 1];
}

function usePrevious<T>(value: T) {
  const ref = React.useRef<T>();
  React.useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

function App() {
  const state = useSelector((state: GameState) => state);
  const dispatch = useDispatch();
  const store = useStore<GameState>();

  const resolvingEvent = last(state.pendingMoves);
  const previousResolvingEvent = usePrevious(resolvingEvent);
  useEffect(() => {
    console.log({
      resolving: resolvingEvent?.order,
      previous: previousResolvingEvent?.order,
    });
    if (
      resolvingEvent &&
      resolvingEvent?.order !== previousResolvingEvent?.order
    ) {
      const specs =
        GAME_EVENT_SPECS[resolvingEvent?.type as keyof typeof GAME_EVENT_SPECS];
      if (!specs) {
        console.error("no specs");
        console.log({ specs, resolvingEvent });
        return;
      }
      const command = specs.execute(state);

      if (command) {
        (async () => {
          const action = await resolveCommand(command);
          dispatch(action);
          console.log("following up with", specs.description);
          const followupCommands = specs.followUp?.(
            store.getState(),
            action as never
          );
          for (const followupCommand of followupCommands || []) {
            const followupAction = await resolveCommand(followupCommand);
            dispatch(followupAction);
          }
        })();
      }
    }
  }, [
    dispatch,
    previousResolvingEvent?.order,
    resolvingEvent,
    resolvingEvent?.order,
    state,
    store,
  ]);

  return (
    <div className="App">
      <p>
        resources: {state.tokens.resources}/{state.tokens.maxResources}
      </p>
      <p>
        trade goods: {state.tokens.tradeGoods}/{state.tokens.maxTradeGoods}
      </p>
      <p>next: {state.pendingMoves.map((e) => e.type).join(" > ")}</p>
      {state.grid.featuresMatrix.map((row, y) => (
        <div style={{ fontSize: ".5rem" }} key={String(y)}>
          {row.map((feature, x) => {
            const styles = {
              width: "3rem",
              height: "3rem",
              display: "inline-block",
              border: "1px solid black",
            };
            if (feature) {
              const { type, id } = getFeature(state.grid, feature);
              return (
                <span style={styles} key={String(x)} data-x={x} data-y={y}>
                  {type}
                </span>
              );
            }
            return (
              <span style={styles} key={String(x)} data-x={x} data-y={y}>
                [ empty ]
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default App;

async function resolveCommand(command: Command<ActionType>) {
  const actionArgs: any[] = [];
  for (const actionArg of command.args) {
    const isEffect =
      actionArg &&
      typeof actionArg === "object" &&
      "__EFFECT_REFERENCE__" in actionArg;
    if (isEffect) {
      const effectiveActionArg = await effects[actionArg.name](
        // @ts-ignore
        ...actionArg.args
      );
      console.log(
        `effect ${JSON.stringify(actionArg.name)}`,
        actionArg,
        effectiveActionArg
      );
      actionArgs.push(effectiveActionArg);
    } else actionArgs.push(actionArg);
  }
  // @ts-ignore
  const action = actions[command.action](...actionArgs);
  return action;
}
