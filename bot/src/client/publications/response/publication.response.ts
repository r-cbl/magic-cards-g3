export interface PublicationResponse {
    id: string;
    name: string;
    cardId: string;
    valueMoney: number;
    cardExchangeIds: string[];
    cardBase: {
      Id: string;
      Name: string;
    };
    game: {
      Id: string;
      Name: string;
    };
    owner: {
      ownerId: string;
      ownerName: string;
    };
    offers: {
      offerId: string;
      moneyOffer?: number;
      statusOffer: string;
      cardExchangeIds: string[];
    }[];
    createdAt: Date;
  }