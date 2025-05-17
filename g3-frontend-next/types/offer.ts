export interface CreateOfferDTO {
  publicationId: string
  userId: string
  cardExchangeIds: string[]
  moneyOffer?: number
}

export interface OfferResponseDTO {
  id: string
  publicationId: string
  userId: string
  ownerId: string
  cardExchangeIds: string[]
  moneyOffer?: number
  status: string
  createdAt: Date
}

export enum OfferStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected'
}


export interface OfferUpdatedDTO {
  userId: string;
  statusOffer: string;
  publicationId: string;
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