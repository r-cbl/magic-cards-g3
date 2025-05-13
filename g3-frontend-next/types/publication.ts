import type { OfferResponseDTO } from "./offer"

export interface CreatePublicationDTO {
  cardId: string
  ownerId: string
  cardExchangeIds: string[]
  valueMoney?: number
}


export interface PublicationResponseDTO {
  id: string;
  name: string;
  card: {
    cardId: string;
    urlImage: string;
  };
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
    moneyOffer: number;
    statusOffer: string;
    cardExchangeIds: string[];
  }[];
  status:string;
  createdAt: Date;
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
