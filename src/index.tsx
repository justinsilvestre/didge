import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import {
  applyMiddleware,
  legacy_createStore as createStore,
  compose,
} from "redux";
import { update } from "./update/update";
import { getEffectsMiddleware } from "./effectsMiddleware";
import { Command } from "./update/Command";
import { ActionType } from "./update/actions";
import { effects } from "./effects/effects";
import { GameState } from "./state/GameState";

const effectsMiddleware = getEffectsMiddleware(
  ([, cmd]: [GameState, Command<ActionType>]) => cmd,
  async (command: Command<ActionType>) => {
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
);

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__?: () => any;
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

let composeEnhancers = compose;
if (
  window.__REDUX_DEVTOOLS_EXTENSION__ &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
)
  composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
const store = createStore(
  update,
  composeEnhancers(applyMiddleware(effectsMiddleware))
);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
