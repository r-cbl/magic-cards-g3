import { GameResponseDTO } from "./GameDTO";

export interface CreateCardBaseDTO {
  gameId: string;
  nameCard: string;
}

export interface UpdateCardBaseDTO {
  gameId?: string;
  nameCard?: string;
}

export interface CardBaseResponseDTO {
  id: string;
  game: GameResponseDTO;
  nameCard: string;
  createdAt: Date;
  updatedAt: Date;
} 