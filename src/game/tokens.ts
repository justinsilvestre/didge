export type TokensAmount = [resources: number, tradeGoods: number]

export const tokens = (resources: number, tradeGoods: number) => [resources, tradeGoods] as TokensAmount
export const res = (resources: number) => tokens(resources, 0)
export const tg = (tradeGoods: number) => tokens(0, tradeGoods)