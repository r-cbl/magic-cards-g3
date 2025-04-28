import type { OfferResponseDTO } from "./offer"

export interface CreatePublicationDTO {
  cardId: string
  ownerId: string
  cardExchangeIds: string[]
  valueMoney?: number
}

export interface PublicationResponseDTO {
  imageUrl: string | undefined
  id: string
  name: string
  cardId: string
  valueMoney: number
  cardExchangeIds: string[]
  cardBase: {
    Id: string
    Name: string
  }
  game: {
    Id: string
    Name: string
  }
  owner: {
    ownerId: string
    ownerName: string
  }
  offers: OfferResponseDTO[]
  createdAt: Date
}

export interface PublicationFilterDTO {
  initialDate?: Date
  endDate?: Date
  gamesIds?: string[]
  cardBaseIds?: string[]
  ownerId?: string
  minValue?: number
  maxValue?: number
}

export interface PublicationUpdatedDTO {
  userId: string
  valueMoney?: number
  cardExchangeIds: string[]
  cancel?: boolean
}
