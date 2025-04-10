export interface CreatePublicationDTO {
    cardId: string;
    ownerId: string;
    cardExchangeIds: string[];
    valueMoney?: number;
  }

  export interface PublicationResponseDTO {
    id: string;
    name: string;
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
    createdAt: Date;
  }

  export interface PublicationFilterDTO {
    initialDate?: Date;
    endDate?: Date;
    gamesIds?: string[];
    cardBaseIds?: string[];
    ownerId?: string;
    minValue?: number;
    maxValue?: number;
  }

  //TODO agregar ofertas recibidas a la response
  