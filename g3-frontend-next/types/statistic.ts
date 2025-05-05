export enum StatisticType {
  CARDS_CREATED = "CARDS_CREATED",
  PUBLICATIONS_CREATED = "PUBLICATIONS_CREATED",
  OFFERS_CREATED = "OFFERS_CREATED",
  TRADES_COMPLETED = "TRADES_COMPLETED",
}

export interface StatisticDTO {
  type: StatisticType
  date: Date
  amount: number
}

export interface RangeStatisticDTO {
  type: StatisticType
  from: Date
  to: Date
}
