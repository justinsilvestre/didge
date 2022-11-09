import { TokensAmount } from "./tokens";

export class Player {
  /** hearts */
  resources: number;
  /** diamonds */
  tradeGoods: number;
  maxResources: number;
  maxTradeGoods: number;

  constructor({
    resources = 20, tradeGoods = 20, maxResources = 50, maxTradeGoods = 50,
  }: {
    resources: number;
    tradeGoods: number;
    maxResources: number;
    maxTradeGoods: number;
  }) {
    this.resources = resources;
    this.tradeGoods = tradeGoods;
    this.maxResources = maxResources;
    this.maxTradeGoods = maxTradeGoods;
  }

  clone(): Player {
    return new Player({
      resources: this.resources,
      tradeGoods: this.tradeGoods,
      maxResources: this.maxResources,
      maxTradeGoods: this.maxTradeGoods,
    });
  }

  addTokens([resources, tradeGoods]: TokensAmount) {
    const newPlayer = this.clone();
    newPlayer.resources = Math.min(
      this.resources + resources,
      this.maxResources,
    );
    newPlayer.tradeGoods = Math.min(
      this.tradeGoods + tradeGoods,
      this.maxTradeGoods,
    );
    return newPlayer;
  }

  addResources(resources: number) {
    return this.addTokens([resources, 0]);
  }

  addTradeGoods(tradeGoods: number) {
    return this.addTokens([0, tradeGoods]);
  }
}
