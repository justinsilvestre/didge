import { ActionType } from "../update/actions";
import { setState, UpdateResult } from "../update/Command";
import { GameState } from "./GameState";
import { TokensAmount } from "./tokens";
import { addTokens } from "./TokensWallet";

export function updateWallet(
  state: GameState,
  amount: TokensAmount
): UpdateResult<GameState, ActionType> {
  return setState({
    ...state,
    wallet: addTokens(state.tokens, amount),
  });
}
