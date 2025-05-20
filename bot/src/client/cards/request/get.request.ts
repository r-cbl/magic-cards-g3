export interface GetRequest {
    name?: string;
    game?: string;
    ownerId?: string;
    limit:number;
    offset:number;
  }