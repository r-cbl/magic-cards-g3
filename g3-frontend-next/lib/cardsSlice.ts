import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { CardResponseDTO } from "@/types/card"
import type { PaginatedResponseDTO, PaginationDTO } from "@/types/pagination"
import { cardService } from "@/services/card-service"
import Promise from "bluebird"

interface CardsState {
  cards: CardResponseDTO[]
  selectedCard: CardResponseDTO | null
  isLoading: boolean
  error: string | null
  pagination: {
    total: number
    offset: number
    limit: number
    hasMore: boolean
  }
}

const initialState: CardsState = {
  cards: [],
  selectedCard: null,
  isLoading: false,
  error: null,
  pagination: {
    total: 0,
    offset: 0,
    limit: 10,
    hasMore: false,
  },
}

export const cardSlice = createSlice({
  name: "cards",
  initialState,
  reducers: {

    createCardStart: (state) => {
      state.isLoading = true
      state.error = null
    },
    createCardSuccess: (state, action: PayloadAction<CardResponseDTO>) => {
      if (action.payload.id) {
        state.cards.push(action.payload)
      }
      state.isLoading = false
      state.error = null
    },
    fetchCardsStart: (state) => {
      state.isLoading = true
      state.error = null
    },
    fetchCardsSuccess: (
      state,
      action: PayloadAction<{ data: CardResponseDTO[]; pagination: Omit<PaginatedResponseDTO<any>, "data">; append: boolean }>
    ) => {
      const { data, pagination, append } = action.payload
      state.cards = append ? [...state.cards, ...data] : data
      state.pagination = {
        total: pagination.total,
        offset: pagination.offset,
        limit: pagination.limit,
        hasMore: pagination.hasMore,
      }
      state.isLoading = false
    },
    createCardFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },
    fetchCardsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },
    fetchCardByIdStart: (state) => {
      state.isLoading = true
      state.error = null
    },
    fetchCardByIdSuccess: (state, action: PayloadAction<CardResponseDTO>) => {
      state.selectedCard = action.payload
      state.isLoading = false
    },
    fetchCardByIdFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },
  },
})

export const {
  createCardStart,
  createCardSuccess,
  createCardFailure,
  fetchCardsStart,
  fetchCardsSuccess,
  fetchCardsFailure,
  fetchCardByIdStart,
  fetchCardByIdSuccess,
  fetchCardByIdFailure,
} = cardSlice.actions

export default cardSlice.reducer

// Thunks
export const fetchCards = (filters: PaginationDTO<any> = { data: {} }, append = false) => async (dispatch: any) => {
  dispatch(fetchCardsStart())

  try {
    const response = await Promise.resolve(cardService.getAllCards(filters))
    dispatch(
      fetchCardsSuccess({
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
    const message = error instanceof Error ? error.message : "Failed to load cards"
    dispatch(fetchCardsFailure(message))
  }
}

export const fetchCardById = (id: string) => async (dispatch: any) => {
  dispatch(fetchCardByIdStart())

  try {
    const card = await Promise.resolve(cardService.getCardById(id))
    dispatch(fetchCardByIdSuccess(card))
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load card"
    dispatch(fetchCardByIdFailure(message))
  }
}

