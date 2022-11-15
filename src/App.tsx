import "./App.css";
import { getFeature } from "./state/gridUtils";
import { useSelector } from "react-redux";
import { GameState } from "./state/GameState";
import { Command } from "./update/Command";
import { ActionType } from "./update/actions";

function App() {
  const state = useSelector(
    ([state]: [GameState, Command<ActionType>]) => state
  );

  return (
    <div className="App">
      <p>
        resources: {state.tokens.resources}/{state.tokens.maxResources}
      </p>
      <p>
        trade goods: {state.tokens.tradeGoods}/{state.tokens.maxTradeGoods}
      </p>
      <p>next: {phaseText(state)}</p>
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

function phaseText(state: GameState) {
  if (state.status.exploring) return "explore in a new space";
  if (state.status.building) return "build";
  if (state.status.trading) return "exchange resources + trade goods";
  if (state.status.recruiting) {
    return "recruit new units";
  }
}
