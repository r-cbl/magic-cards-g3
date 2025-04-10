export interface CreatePublicationDTO {
    cardId: string;
    ownerId: string;
    cardExchangeIds: string[];
    valueMoney?: number;
    offersExisting?: string[];
  }

  export interface PublicationResponseDTO {
    id: string;
    name: string;
    valueMoney: number;
    cardExchangeIds: string[]
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
  