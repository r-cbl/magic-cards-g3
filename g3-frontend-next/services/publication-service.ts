import { api } from "@/lib/api-client"
import type {
  CreatePublicationDTO,
  PublicationResponseDTO,
  PublicationFilterDTO,
} from "@/types/publication"

import type{
  PaginatedResponseDTO,
  PaginationDTO
} from "@/types/pagination"

export const publicationService = {
  getAllPublications: async (filters: PaginationDTO<PublicationFilterDTO> = { data:{}}) => {
    const queryParams = new URLSearchParams()

    if (filters.data.ownerId) queryParams.append("ownerId", filters.data.ownerId)
    if (filters.data.gamesIds) filters.data.gamesIds.forEach((id) => queryParams.append("gameId", id))
    if (filters.data.cardBaseIds) filters.data.cardBaseIds.forEach((id) => queryParams.append("cardBaseId", id))
    if (filters.data.minValue !== undefined) queryParams.append("minValue", filters.data.minValue.toString())
    if (filters.data.maxValue !== undefined) queryParams.append("maxValue", filters.data.maxValue.toString())
    if (filters.limit !== undefined) queryParams.append("limit", filters.limit.toString())
    if (filters.offset !== undefined) queryParams.append("offset", filters.offset.toString())

    queryParams.append("status", "Open")
    const queryString = queryParams.toString()
    const endpoint = queryString ? `/publications?${queryString}` : "/publications"

    return api.get<PaginatedResponseDTO<PublicationResponseDTO>>(endpoint)
  },

  getUserPublications: async (userId: string) => {
    return api.get<PublicationResponseDTO[]>(`/publications?ownerId=${userId}`)
  },

  getPublicationById: async (publicationId: string) => {
    return api.get<PublicationResponseDTO>(`/publications/${publicationId}`)
  },

  createPublication: async (publicationData: CreatePublicationDTO) => {
    return api.post<PublicationResponseDTO>("/publications", publicationData)
  },
}
