import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { OfferResponseDTO, OfferFilterDTO } from "@/types/offer"
import type { PaginatedResponseDTO, PaginationDTO } from "@/types/pagination"
import { offerService } from "@/services/offer-service"
import Promise from "bluebird"

interface OffersState {
  userOffers: OfferResponseDTO[]
  receivedOffers: OfferResponseDTO[]
  isLoading: boolean
  error: string | null
  pagination: {
    total: number
    offset: number
    limit: number
    hasMore: boolean
  }
}

const initialState: OffersState = {
  userOffers: [],
  receivedOffers: [],
  isLoading: false,
  error: null,
  pagination: {
    total: 0,
    offset: 0,
    limit: 10,
    hasMore: false,
  },
}

export const offersSlice = createSlice({
  name: "offers",
  initialState,
  reducers: {
    fetchUserOffersStart: (state) => {
      state.isLoading = true
      state.error = null
    },
    fetchUserOffersSuccess: (
      state,
      action: PayloadAction<{ data: OfferResponseDTO[]; pagination: Omit<PaginatedResponseDTO<any>, "data">; append: boolean }>
    ) => {
      const { data, pagination, append } = action.payload
      state.userOffers = append ? [...state.userOffers, ...data] : data
      state.pagination = {
        total: pagination.total,
        offset: pagination.offset,
        limit: pagination.limit,
        hasMore: pagination.hasMore,
      }
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
    fetchReceivedOffersSuccess: (
      state,
      action: PayloadAction<{ data: OfferResponseDTO[]; pagination: Omit<PaginatedResponseDTO<any>, "data">; append: boolean }>
    ) => {
      const { data, pagination, append } = action.payload
      state.receivedOffers = append ? [...state.receivedOffers, ...data] : data
      state.pagination = {
        total: pagination.total,
        offset: pagination.offset,
        limit: pagination.limit,
        hasMore: pagination.hasMore,
      }
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

// Thunk para obtener las ofertas del usuario con paginación

export const fetchOffers = (
  filters: PaginationDTO<OfferFilterDTO> = { data: {} },
  append = false
) => async (dispatch: any) => {
  dispatch(fetchUserOffersStart())
  try {
    const response = await Promise.resolve(offerService.getOffers(filters))
    dispatch(
      fetchUserOffersSuccess({
        data: response.data,
        pagination: {
          total: response.total,
          offset: response.offset,
          limit: response.limit,
          hasMore: response.hasMore,
        },
        append,
      })
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load user offers"
    dispatch(fetchUserOffersFailure(message))
  }
}

