import { api } from "@/lib/api-client"
import type { CreateOfferDTO, OfferResponseDTO, UpdateOfferDTO } from "@/types/offer"

export const offerService = {
  getUserOffers: async (userId: string) => {
    return api.get<OfferResponseDTO[]>(`/offers?userId=${userId}`)
  },

  getReceivedOffers: async (userId: string) => {
    return api.get<OfferResponseDTO[]>(`/offers/received?userId=${userId}`)
  },

  createOffer: async (offerData: CreateOfferDTO) => {
    return api.post<OfferResponseDTO>("/offers", offerData)
  },

  updateOfferStatus: async (offerId: string, updateData: UpdateOfferDTO) => {
    return api.patch<OfferResponseDTO>(`/offers/${offerId}`, updateData)
  },
}
