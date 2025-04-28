export interface UpdateRequest {
    publicationId: string;
    userId: string;
    valueMoney?: number;
    cardExchangeIds: string[];
    cancel?: boolean;
  }