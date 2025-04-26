export interface GetRequest {
    initialDate?: Date;
    endDate?: Date;
    gamesIds?: string[];
    cardBaseIds?: string[];
    ownerId?: string;
    minValue?: number;
    maxValue?: number;
  }