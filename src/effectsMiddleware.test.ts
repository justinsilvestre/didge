import { applyMiddleware, legacy_createStore as createStore } from "redux";
import { getEffectsMiddleware } from "./effectsMiddleware";

type Action =
  | { type: "INCREMENT" }
  | { type: "SET"; value: number }
  | { type: "LOG_REQUEST"; value: string }
  | { type: "LOG_SUCCESS"; value: string };

type State = {
  count: number;
  message: string;
};

const update = (
  [state]: [State, Command | null] = [{ count: 0, message: "" }, null],
  action: Action
): [State, Command | null] => {
  switch (action.type) {
    case "INCREMENT":
      return [
        {
          ...state,
          count: state.count + 1,
        },
        null,
      ];
    case "SET":
      return [{ ...state, count: action.value }, null];
    case "LOG_REQUEST":
      return [
        { ...state, message: "logging!" },
        { type: "LOG", value: action.value },
      ];
    case "LOG_SUCCESS":
      return [{ ...state, message: "" }, null];
    default:
      return [state, null];
  }
};

describe("effectsMiddleware", () => {
  const log = jest.fn();

  async function runCommand(command: Command): Promise<Action | null> {
    if (command.type === "RANDOM") {
      return { type: "SET", value: Math.random() };
    }
    if (command.type === "LOG") {
      console.log("LOG", command.value);
      log(command.value);
      return { type: "LOG_SUCCESS", value: command.value };
    }

    return null;
  }

  const store = createStore(
    update,
    applyMiddleware(
      getEffectsMiddleware<[State, Command[]], Command, Action>(
        ([, cmds]) => cmds,
        runCommand
      )
    )
  );

  test("runs state changes and side effects", async () => {
    store.dispatch({ type: "LOG_REQUEST", value: "hello" });

    expect(store.getState()[0].message).toBe("logging!");

    expect(log).toHaveBeenCalledWith("hello");

    // let pending cmds finish
    await null;

    expect(store.getState()[0].message).toBe("");
  });
});

type Command = { type: "RANDOM" } | { type: "LOG"; value: string };
