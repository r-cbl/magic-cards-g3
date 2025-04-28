import { api } from "@/lib/api-client"
import type { CreatePublicationDTO, PublicationResponseDTO, PublicationFilterDTO } from "@/types/publication"

export const publicationService = {
  getAllPublications: async (filters?: PublicationFilterDTO) => {
    const queryParams = new URLSearchParams()

    if (filters?.ownerId) queryParams.append("ownerId", filters.ownerId)
    if (filters?.gamesIds) filters.gamesIds.forEach((id) => queryParams.append("gameId", id))
    if (filters?.cardBaseIds) filters.cardBaseIds.forEach((id) => queryParams.append("cardBaseId", id))
    if (filters?.minValue !== undefined) queryParams.append("minValue", filters.minValue.toString())
    if (filters?.maxValue !== undefined) queryParams.append("maxValue", filters.maxValue.toString())

    const queryString = queryParams.toString()
    const endpoint = queryString ? `/publications?${queryString}` : "/publications"

    return api.get<PublicationResponseDTO[]>(endpoint)
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
