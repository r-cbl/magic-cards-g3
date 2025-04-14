export interface CreateOfferDTO {
    publicationId: string;
    offerOwnerId: string;
    moneyOffer?: number;
    statusOffer?: string;
    cardExchangeIds?: string[];
}

export interface OfferResponseDTO {
    id: string;
    publicationId: string;
    moneyOffer?: number;
    cardExchangeIds?: string[];
    createdAt: Date;
    updatedAt: Date;
}

export interface OfferUpdatedDTO {
    userId: string;
    statusOffer: string;
    publicationId: string;
}



