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
    status: string;
    ownerId: string;
}

export interface OfferFilterDTO {
    ownerId?: string,
    publicationId?: string,
    status?: string
}

export interface OfferUpdatedDTO {
    userId: string;
    statusOffer: string;
    publicationId: string;
}



