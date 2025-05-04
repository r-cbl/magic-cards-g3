export interface GetRequest {
  ownerId?: string;
  publicationId?: string;
  cardId?: string;
  userId?: string;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
  limit?: number;
  offset?: number;
  }