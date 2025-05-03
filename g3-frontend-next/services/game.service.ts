import { api } from "@/lib/api-client"
import type { GameResponseDTO, CreateGameDTO, UpdateGameDTO, GameFilterDTO } from "@/types/game.ts"

export const publicationService = {
  getAllGames: async (filters?: GameFilterDTO) => {
    const queryParams = new URLSearchParams()

    if(filters?.name) queryParams.append("name", filters.name)

    const queryString = queryParams.toString()
    const endpoint = queryString ? `/games?${queryString}` : "/games"

    return api.get<GameResponseDTO[]>(endpoint)
  },

  getGameById: async (publicationId: string) => {
    return api.get<GameResponseDTO>(`/publications/${publicationId}`)
  },

  createGame: async (publicationData: CreateGameDTO) => {
    return api.post<GameResponseDTO>("/publications", publicationData)
  },
}