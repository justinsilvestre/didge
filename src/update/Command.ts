import {
  EffectName,
  EffectOf,
  effects,
  NameOfEffectWithReturnType,
} from "../effects/effects";
import { ActionType, actions } from "./actions";

export type Command<T extends ActionType = ActionType> = {
  action: T;
  args: MapParametersToEventualArg<T>;
};

export function command<T extends ActionType>(
  actionType: T,
  ...args: MapParametersToEventualArg<T>
): Command<T> {
  return {
    action: actionType,
    args,
  };
}

export function effectOf<Name extends EffectName>(
  name: Name,
  ...args: Parameters<EffectOf<Name>>
): EffectReference<Name> {
  return {
    __EFFECT_REFERENCE__: true,
    name,
    // @ts-ignore
    args: args ?? [],
  };
}

export type EffectReference<Name extends EffectName> = {
  __EFFECT_REFERENCE__: true;
  name: Name;
  args: Parameters<typeof effects[Name]>;
};

type MapParametersToEventualArg<
  T extends ActionType,
  Params extends [...unknown[]] = ActionParameters<T>
> = Params extends never[]
  ? []
  : {
      [Index in keyof Params]: EventualActionArg<Params[Index]>;
    } & { length: Params["length"] };

type ActionParameters<T extends ActionType> = Parameters<typeof actions[T]>;

type EventualActionArg<ArgType> =
  | EffectReference<NameOfEffectWithReturnType<ArgType>>
  | ArgType;
