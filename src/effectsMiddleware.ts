import { AnyAction, Dispatch, Middleware } from "redux";

export function withCommand<S, C>(state: S, cmd: C): S {
  enqueueCommand(cmd);
  return state;
}

function enqueueCommand<C>(cmd: C) {
  return;
}

export function getEffectsMiddleware<S, C, A extends AnyAction>(
  getCmd: (state: S) => C | null,
  resolveCmd: (cmd: C) => Promise<A | null>
): Middleware<{}, S, Dispatch<A>> {
  return (store) => (nextDispatch) => (action) => {
    const result = nextDispatch(action);
    const newState = store.getState();
    const cmd = getCmd(newState);
    if (cmd)
      resolveCmd(cmd).then((action) => {
        if (action) store.dispatch(action);
      });
    return result;
  };
}
