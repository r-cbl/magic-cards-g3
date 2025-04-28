import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { OfferResponseDTO } from "@/types/offer"

// Mock data
const mockOffers: OfferResponseDTO[] = [
  {
    id: "offer1",
    publicationId: "2",
    userId: "user-123",
    userName: "Test User",
    cardExchangeIds: [],
    moneyOffer: 45,
    statusOffer: "PENDING",
    createdAt: new Date(),
  },
  {
    id: "offer2",
    publicationId: "1",
    userId: "user-123",
    userName: "Test User",
    cardExchangeIds: ["1"],
    moneyOffer: undefined,
    statusOffer: "ACCEPTED",
    createdAt: new Date(Date.now() - 86400000), // 1 day ago
  },
  {
    id: "offer3",
    publicationId: "3",
    userId: "user-123",
    userName: "Test User",
    cardExchangeIds: ["2"],
    moneyOffer: 20,
    statusOffer: "REJECTED",
    createdAt: new Date(Date.now() - 172800000), // 2 days ago
  },
]

interface OffersState {
  userOffers: OfferResponseDTO[]
  receivedOffers: OfferResponseDTO[]
  isLoading: boolean
  error: string | null
}

const initialState: OffersState = {
  userOffers: mockOffers,
  receivedOffers: [],
  isLoading: false,
  error: null,
}

export const offersSlice = createSlice({
  name: "offers",
  initialState,
  reducers: {
    fetchUserOffersStart: (state) => {
      state.isLoading = true
      state.error = null
    },
    fetchUserOffersSuccess: (state, action: PayloadAction<OfferResponseDTO[]>) => {
      state.userOffers = action.payload
      state.isLoading = false
    },
    fetchUserOffersFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },
    fetchReceivedOffersStart: (state) => {
      state.isLoading = true
      state.error = null
    },
    fetchReceivedOffersSuccess: (state, action: PayloadAction<OfferResponseDTO[]>) => {
      state.receivedOffers = action.payload
      state.isLoading = false
    },
    fetchReceivedOffersFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },
    createOfferStart: (state) => {
      state.isLoading = true
      state.error = null
    },
    createOfferSuccess: (state, action: PayloadAction<OfferResponseDTO>) => {
      state.userOffers.push(action.payload)
      state.isLoading = false
    },
    createOfferFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },
    updateOfferStatusStart: (state) => {
      state.isLoading = true
      state.error = null
    },
    updateOfferStatusSuccess: (state, action: PayloadAction<{ id: string; status: string }>) => {
      const { id, status } = action.payload
      const offer = state.receivedOffers.find((o) => o.id === id)
      if (offer) {
        offer.statusOffer = status as any
      }
      state.isLoading = false
    },
    updateOfferStatusFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },
  },
})

export const {
  fetchUserOffersStart,
  fetchUserOffersSuccess,
  fetchUserOffersFailure,
  fetchReceivedOffersStart,
  fetchReceivedOffersSuccess,
  fetchReceivedOffersFailure,
  createOfferStart,
  createOfferSuccess,
  createOfferFailure,
  updateOfferStatusStart,
  updateOfferStatusSuccess,
  updateOfferStatusFailure,
} = offersSlice.actions

export default offersSlice.reducer
