import { api } from "@/lib/api-client"
import type {
  CardBaseFilterDTO,
  CardBaseResponseDTO,
  CreateCardBaseDTO,
  UpdateCardBaseDTO
} from "@/types/card"
import type {
  PaginatedResponseDTO,
  PaginationDTO
} from "@/types/pagination"

export const cardBaseService = {
  getAllCardBases: async (filters: PaginationDTO<CardBaseFilterDTO> = { data: {} }) => {
    const queryParams = new URLSearchParams()

    if (filters.data.gameId) queryParams.append("gameId", filters.data.gameId)
    if (filters.data.nameCard) queryParams.append("nameCard", filters.data.nameCard)
    if (filters.limit !== undefined) queryParams.append("limit", filters.limit.toString())
    if (filters.offset !== undefined) queryParams.append("offset", filters.offset.toString())

    const queryString = queryParams.toString()
    const endpoint = queryString ? `/card-bases?${queryString}` : "/card-bases"

    return api.get<PaginatedResponseDTO<CardBaseResponseDTO>>(endpoint)
  },

  getCardBaseById: async (id: string) => {
    return api.get<CardBaseResponseDTO>(`/card-bases/${id}`)
  },

  createCardBase: async (data: CreateCardBaseDTO) => {
    return api.post<CardBaseResponseDTO>("/card-bases", data)
  },

  updateCardBase: async (id: string, data: UpdateCardBaseDTO) => {
    return api.put<CardBaseResponseDTO>(`/card-bases/${id}`, data)
  },
}
