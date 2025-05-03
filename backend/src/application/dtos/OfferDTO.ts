export interface CreateOfferDTO {
    publicationId: string;
    offerOwnerId: string;
    moneyOffer?: number;
    status?: string;
    cardExchangeIds?: string[];
}

export interface OfferResponseDTO {
    id: string;
    publicationId: string;
    moneyOffer?: number;
    cardExchangeIds?: string[];
    createdAt: Date;
    updatedAt: Date;
    status: string;
    ownerId: string;
}

export interface OfferFilterDTO {
    ownerId?: string;
    publicationId?: string;
    cardId?: string;
    userId?: string;
    status?: string;
    minPrice?: number;
    maxPrice?: number;
    limit?: number;
    offset?: number;
}

export interface OfferUpdatedDTO {
    userId: string;
    status: string;
    publicationId: string;
}



