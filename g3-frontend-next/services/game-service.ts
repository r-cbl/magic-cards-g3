import { api } from "@/lib/api-client"
import type {
  GameResponseDTO,
  CreateGameDTO,
  UpdateGameDTO,
  GameFilterDTO
} from "@/types/game"
import type {
  PaginatedResponseDTO,
  PaginationDTO
} from "@/types/pagination"

export const gameService = {
  getAllGames: async (filters: PaginationDTO<GameFilterDTO> = { data: {} }) => {
    const queryParams = new URLSearchParams()

    if (filters.data.name) queryParams.append("name", filters.data.name)
    if (filters.limit !== undefined) queryParams.append("limit", filters.limit.toString())
    if (filters.offset !== undefined) queryParams.append("offset", filters.offset.toString())

    const queryString = queryParams.toString()
    const endpoint = queryString ? `/games?${queryString}` : "/games"

    return api.get<PaginatedResponseDTO<GameResponseDTO>>(endpoint)
  },

  getGameById: async (gameId: string) => {
    return api.get<GameResponseDTO>(`/games/${gameId}`)
  },

  createGame: async (gameData: CreateGameDTO) => {
    return api.post<GameResponseDTO>("/games", gameData)
  },

  updateGame: async (gameId: string, gameData: UpdateGameDTO) => {
    return api.put<GameResponseDTO>(`/games/${gameId}`, gameData)
  },
}
