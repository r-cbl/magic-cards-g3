import type { GameResponseDTO } from "./game"

export interface CreateCardBaseDTO {
  gameId: string
  nameCard: string
}

export interface UpdateCardBaseDTO {
  gameId?: string
  nameCard?: string
}

export interface CardBaseResponseDTO {
  id: string
  game: GameResponseDTO
  nameCard: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateCardDTO {
  cardBaseId: string
  statusCard: number
  urlImage: string
  ownerId: string
}

export interface CardResponseDTO {
  id: string
  urlImage: string
  cardBase: {
    Id: string
    Name: string
  }
  game: {
    Id: string
    Name: string
  }
  owner: {
    ownerId: string
    ownerName: string
  }
  createdAt: Date
}

export interface CardFilterDTO {
  name?: string
  game?: string
  ownerId?: string
}

export interface CardUpdatedDTO {
  ownerId: string
  urlImage?: string
  statusCard: number
}
