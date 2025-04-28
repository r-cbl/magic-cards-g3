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
  userName: string
  cardExchangeIds: string[]
  moneyOffer?: number
  statusOffer: OfferStatus
  createdAt: Date
}

export enum OfferStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
  CANCELED = "CANCELED",
}

export interface UpdateOfferDTO {
  userId: string
  cardExchangeIds?: string[]
  moneyOffer?: number
  statusOffer?: OfferStatus
}
