export interface BaseCardResponse {
    id: string;
    game?: {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
    };
    nameCard: string;
    createdAt?: Date;
    updatedAt?: Date;
}