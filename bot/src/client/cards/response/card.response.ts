export interface CardResponse {
    id: string;
    urlImage: string;
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