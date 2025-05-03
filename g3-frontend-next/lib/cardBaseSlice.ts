import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { CardBaseResponseDTO } from "@/types/card"
import { cardBaseService } from "@/services/cardBase-service"
import Promise from "bluebird"
import type { PaginatedResponseDTO, PaginationDTO } from "@/types/pagination"

interface CardBasesState {
  cardBases: CardBaseResponseDTO[]
  selectedCardBase: CardBaseResponseDTO | null
  isLoading: boolean
  error: string | null
  pagination: {
    total: number
    offset: number
    limit: number
    hasMore: boolean
  }
}

const initialState: CardBasesState = {
  cardBases: [],
  selectedCardBase: null,
  isLoading: false,
  error: null,
  pagination: {
    total: 0,
    offset: 0,
    limit: 10,
    hasMore: false,
  },
}

export const cardBaseSlice = createSlice({
  name: "cardBases",
  initialState,
  reducers: {
    fetchCardBasesStart: (state) => {
      state.isLoading = true
      state.error = null
    },
    fetchCardBasesSuccess: (
      state,
      action: PayloadAction<{ data: CardBaseResponseDTO[]; pagination: Omit<PaginatedResponseDTO<any>, "data">; append: boolean }>
    ) => {
      const { data, pagination, append } = action.payload
      state.cardBases = append ? [...state.cardBases, ...data] : data
      state.pagination = {
        total: pagination.total,
        offset: pagination.offset,
        limit: pagination.limit,
        hasMore: pagination.hasMore,
      }
      state.isLoading = false
    },
    fetchCardBasesFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },
    fetchCardBaseByIdStart: (state) => {
      state.isLoading = true
      state.error = null
    },
    fetchCardBaseByIdSuccess: (state, action: PayloadAction<CardBaseResponseDTO>) => {
      state.selectedCardBase = action.payload
      state.isLoading = false
    },
    fetchCardBaseByIdFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },
  },
})

export const {
  fetchCardBasesStart,
  fetchCardBasesSuccess,
  fetchCardBasesFailure,
  fetchCardBaseByIdStart,
  fetchCardBaseByIdSuccess,
  fetchCardBaseByIdFailure,
} = cardBaseSlice.actions

export default cardBaseSlice.reducer

// Thunks
export const fetchCardBases = (filters: PaginationDTO<any> = { data: {} }, append = false) => async (dispatch: any) => {
  dispatch(fetchCardBasesStart())

  try {
    const response = await Promise.resolve(cardBaseService.getAllCardBases(filters))
    dispatch(
      fetchCardBasesSuccess({
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
    const message = error instanceof Error ? error.message : "Failed to load card bases"
    dispatch(fetchCardBasesFailure(message))
  }
}

export const fetchCardBaseById = (id: string) => async (dispatch: any) => {
  dispatch(fetchCardBaseByIdStart())

  try {
    const cardBase = await Promise.resolve(cardBaseService.getCardBaseById(id))
    dispatch(fetchCardBaseByIdSuccess(cardBase))
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load card base"
    dispatch(fetchCardBaseByIdFailure(message))
  }
}
