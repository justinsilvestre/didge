import {
  EffectName,
  EffectOf,
  effects,
  NameOfEffectWithReturnType,
} from "../effects/effects";
import { ActionType, actions } from "./actions";
import { ActionTypes } from "./ActionTypes";

export type Command<T extends ActionType = ActionType> = {
  action: T;
  args: Args<T>;
};

export type UpdateResult<S, T extends ActionType> = [S, Command<T>[]];

export function setState<S, T extends ActionType>(
  newState: S
): UpdateResult<S, T> {
  return [newState, []];
}
export function runCommand<S, T extends ActionType>(command: Command<T>) {
  return [];
}

function runAfterEffects<T extends ActionType>(
  actionType: T,
  ...args: Args<T>
): Command<T> {
  return {
    action: actionType,
    args,
  };
}

export const cmd = Object.fromEntries(
  Object.values(ActionTypes).map(<T extends ActionType>(actionType: T) => [
    actionType as T,
    (...args: Args<T>) => runAfterEffects<T>(actionType, ...args),
  ])
) as {
  [T in ActionType]: (...args: Args<T>) => Command<T>;
};

function ef<Name extends EffectName>(
  name: Name,
  args?: Parameters<EffectOf<Name>>
): EffectReference<Name> {
  return {
    __EFFECT_REFERENCE__: true,
    name,
    // @ts-ignore
    args: args ?? [],
  };
}

export const effectOf = Object.fromEntries(
  Object.entries(effects).map(([name, effect]) => [
    name as EffectName,
    (...args: Parameters<typeof effect>) => ef(name as EffectName, args),
  ])
) as {
  [Name in EffectName]: (
    ...args: Parameters<EffectOf<Name>>
  ) => EffectReference<Name>;
};

export type EffectReference<Name extends EffectName> = {
  __EFFECT_REFERENCE__: true;
  name: Name;
  args: Parameters<typeof effects[Name]>;
};

/** values which, once resolved, will be passed to an action creator */
type Args<
  T extends ActionType,
  Params extends [...unknown[]] = ActionParameters<T>
> = Params extends never[]
  ? []
  : {
      [Index in keyof Params]: Arg<Params[Index]>;
    } & { length: Params["length"] };

type ActionParameters<T extends ActionType> = Parameters<typeof actions[T]>;

/** value which, once resolved, will be passed to an action creator */
type Arg<ArgType> =
  | EffectReference<NameOfEffectWithReturnType<ArgType>>
  | ArgType;
