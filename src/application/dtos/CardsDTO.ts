export interface CreateCardDTO {
    cardBaseId: string;
    statusCard: number;
    imageUrl: string;
}

export interface CardResponseDTO {
    id: string;
    urlImage: string;
    cardBase: {
      Id: string;
      Name: string;
      game: string;
    };
    owner: {
      ownerId: string;
      ownerName: string;
    };
    createdAt: Date;
}

export interface CardFilterDTO {
    name?: string;
    game?: string;
    ownerId?: string;
}
  