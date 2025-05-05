import { api } from "@/lib/api-client"
import type {
  CardFilterDTO,
  CardResponseDTO,
  CreateCardDTO,
  CardUpdatedDTO,
} from "@/types/card"
import type {
  PaginatedResponseDTO,
  PaginationDTO
} from "@/types/pagination"

export const cardService = {
  getAllCards: async (filters: PaginationDTO<CardFilterDTO> = { data: {} }) => {
    const queryParams = new URLSearchParams()

    if (filters.data.name) queryParams.append("name", filters.data.name)
    if (filters.data.game) queryParams.append("game", filters.data.game)
    if (filters.data.ownerId) queryParams.append("ownerId", filters.data.ownerId)
    if (filters.limit !== undefined) queryParams.append("limit", filters.limit.toString())
    if (filters.offset !== undefined) queryParams.append("offset", filters.offset.toString())

    const queryString = queryParams.toString()
    const endpoint = queryString ? `/cards?${queryString}` : "/cards"

    return api.get<PaginatedResponseDTO<CardResponseDTO>>(endpoint)
  },

  getCardById: async (cardId: string) => {
    return api.get<CardResponseDTO>(`/cards/${cardId}`)
  },

  createCard: async (cardData: CreateCardDTO) => {
    return api.post<CardResponseDTO>("/cards", cardData)
  },

  updateCard: async (cardId: string, cardData: CardUpdatedDTO) => {
    return api.put<CardResponseDTO>(`/cards/${cardId}`, cardData)
  },
}
