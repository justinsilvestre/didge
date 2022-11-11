import { TokensAmount } from "./tokens";

export type TokensWallet = {
  /** hearts */
  resources: number;
  /** diamonds */
  tradeGoods: number;
  maxResources: number;
  maxTradeGoods: number;
};

export function createTokensWallet({
  resources,
  tradeGoods,
  maxResources,
  maxTradeGoods,
}: {
  resources: number;
  tradeGoods: number;
  maxResources: number;
  maxTradeGoods: number;
}): TokensWallet {
  return {
    resources,
    tradeGoods,
    maxResources,
    maxTradeGoods,
  };
}

export function cloneTokensWallet(base: TokensWallet) {
  return createTokensWallet(base);
}

export function updateWallet(
  wallet: TokensWallet,
  [resources, tradeGoods]: TokensAmount
) {
  const updatedTokens = cloneTokensWallet(wallet);
  updatedTokens.resources = keepWithinRange(
    wallet.resources + resources,
    0,
    wallet.maxResources
  );
  updatedTokens.tradeGoods = keepWithinRange(
    wallet.tradeGoods + tradeGoods,
    0,
    wallet.maxTradeGoods
  );
  return updatedTokens;
}

function keepWithinRange(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function addResources(wallet: TokensWallet, resources: number) {
  return updateWallet(wallet, [resources, 0]);
}

export function addTradeGoods(wallet: TokensWallet, tradeGoods: number) {
  return updateWallet(wallet, [0, tradeGoods]);
}
