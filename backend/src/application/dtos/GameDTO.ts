export interface CreateGameDTO {
  name: string;
}

export interface UpdateGameDTO {
  name?: string;
}

export interface GameResponseDTO {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
} 

export interface GameFilterDTO{
  name?:string;
}