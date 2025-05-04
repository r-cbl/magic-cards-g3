export interface OfferResponse {
  id: string;
  publicationId: string;
  moneyOffer?: number;
  cardExchangeIds?: string[];
  createdAt: Date;
  updatedAt: Date;
  status: string;
  ownerId: string;
  }