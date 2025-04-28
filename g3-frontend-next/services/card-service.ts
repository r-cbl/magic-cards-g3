import { api } from "@/lib/api-client"
import type { CardResponseDTO, CreateCardDTO, CardFilterDTO, CreateCardBaseDTO } from "@/types/card"
import type { GameResponseDTO, CreateGameDTO } from "@/types/game"

export const cardService = {
  getAllCards: async (filters?: CardFilterDTO) => {
    const queryParams = new URLSearchParams()

    if (filters?.name) queryParams.append("name", filters.name)
    if (filters?.game) queryParams.append("game", filters.game)
    if (filters?.ownerId) queryParams.append("ownerId", filters.ownerId)

    const queryString = queryParams.toString()
    const endpoint = queryString ? `/cards?${queryString}` : "/cards"

    return api.get<CardResponseDTO[]>(endpoint)
  },

  getUserCards: async (userId: string) => {
    return api.get<CardResponseDTO[]>(`/cards?ownerId=${userId}`)
  },

  getCardById: async (cardId: string) => {
    return api.get<CardResponseDTO>(`/cards/${cardId}`)
  },

  createCard: async (cardData: CreateCardDTO) => {
    return api.post<CardResponseDTO>("/cards", cardData)
  },

  // Game operations
  getAllGames: async () => {
    return api.get<GameResponseDTO[]>("/games")
  },

  createGame: async (gameData: CreateGameDTO) => {
    return api.post<GameResponseDTO>("/games", gameData)
  },

  // Card base operations
  createCardBase: async (cardBaseData: CreateCardBaseDTO) => {
    return api.post<{ id: string; name: string; gameId: string }>("/card-bases", cardBaseData)
  },

  getCardBasesByGame: async (gameId: string) => {
    return api.get<{ id: string; name: string; gameId: string }[]>(`/card-bases?gameId=${gameId}`)
  },
}
