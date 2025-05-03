import { api } from "@/lib/api-client"
import type { CreateOfferDTO, OfferResponseDTO, UpdateOfferDTO, OfferFilterDTO } from "@/types/offer"
import type { PaginatedResponseDTO, PaginationDTO } from "@/types/pagination"

export const offerService = {

  getOffers: async (filters: PaginationDTO<OfferFilterDTO> = { data: {} }) => {
    const queryParams = new URLSearchParams()

    if (filters.data.userId) queryParams.append("userId", filters.data.userId)
    if (filters.data.status) queryParams.append("status", filters.data.status)
    if (filters.data.minPrice !== undefined) queryParams.append("minPrice", filters.data.minPrice.toString())
    if (filters.data.maxPrice !== undefined) queryParams.append("maxPrice", filters.data.maxPrice.toString())
    if (filters.limit !== undefined) queryParams.append("limit", filters.limit.toString())
    if (filters.offset !== undefined) queryParams.append("offset", filters.offset.toString())

    const queryString = queryParams.toString()
    const endpoint = queryString ? `/offers?${queryString}` : "/offers"

    return api.get<PaginatedResponseDTO<OfferResponseDTO>>(endpoint)
  },

  createOffer: async (offerData: CreateOfferDTO) => {
    return api.post<OfferResponseDTO>("/offers", offerData)
  },

  updateOfferStatus: async (offerId: string, updateData: UpdateOfferDTO) => {
    return api.patch<OfferResponseDTO>(`/offers/${offerId}`, updateData)
  },
}
