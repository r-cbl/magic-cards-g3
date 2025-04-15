export enum StatisticType {
    OFFERS_CLOSED = 'offers_closed',
    USERS_REGISTERED = 'users_registered',
    CARDS_TOTAL = 'cards_total',
    OFFERS_TOTAL = 'offers_total',
    PUBLICATIONS_TOTAL = 'publications_total',
}

export class Statistic {
    constructor(
      public readonly type: StatisticType,
      public readonly date: Date, // fecha completa YYYY-MM-DD
      public readonly amount: number 
    ) {}
}
  
  