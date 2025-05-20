export enum StatisticType {
  USERS_REGISTERED = 'users_registered',
  CARDS_TOTAL = 'cards_total',
  OFFERS_TOTAL = 'offers_total',
  PUBLICATIONS_TOTAL = 'publications_total',
  OFFERS_ACCEPTED = 'offers_accepted',
  OFFERS_REJECTED = 'offers_rejected',
}

export interface RangeStatisticDTO {
  type: StatisticType
  from: Date
  to: Date
}
