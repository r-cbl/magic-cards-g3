export interface CreateRequest {
    publicationId: string;
    offerOwnerId?: string;
    moneyOffer?: number;
    statusOffer?: string;
    cardExchangeIds?: string[];
}