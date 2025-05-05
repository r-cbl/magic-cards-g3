import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { CreatePublicationDTO, PublicationResponseDTO } from "@/types/publication"
import type { PaginatedResponseDTO, PaginationDTO } from "@/types/pagination"
import { publicationService } from "@/services/publication-service"
import Promise from "bluebird"
import { create } from "domain"

interface PublicationsState {
  publications: PublicationResponseDTO[]
  selectedPublication: PublicationResponseDTO | null
  isLoading: boolean
  error: string | null
  pagination: {
    total: number
    offset: number
    limit: number
    hasMore: boolean
  }
}

const initialState: PublicationsState = {
  publications: [],
  selectedPublication: null,
  isLoading: false,
  error: null,
  pagination: {
    total: 0,
    offset: 0,
    limit: 10,
    hasMore: false,
  },
}

export const publicationsSlice = createSlice({
  name: "publications",
  initialState,
  reducers: {
    createPublicationStart: (state) => {
      state.isLoading = true
      state.error = null
    },
    createPublicationSuccess: (state, action: PayloadAction<PublicationResponseDTO>) => {
      if (action.payload.id) {
        state.publications.push(action.payload)
      }
      state.isLoading = false
      state.error = null
    },
    createPublicationFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },
    fetchPublicationsStart: (state) => {
      state.isLoading = true
      state.error = null
    },
    fetchPublicationsSuccess: (
      state,
      action: PayloadAction<{ data: PublicationResponseDTO[]; pagination: Omit<PaginatedResponseDTO<any>, "data">; append: boolean }>
    ) => {
      const { data, pagination, append } = action.payload
      state.publications = append ? [...state.publications, ...data] : data
      state.pagination = {
        total: pagination.total,
        offset: pagination.offset,
        limit: pagination.limit,
        hasMore: pagination.hasMore,
      }
      state.isLoading = false
    },
    fetchPublicationsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },
    fetchPublicationByIdStart: (state) => {
      state.isLoading = true
      state.error = null
    },
    fetchPublicationByIdSuccess: (state, action: PayloadAction<PublicationResponseDTO>) => {
      state.selectedPublication = action.payload
      state.isLoading = false
    },
    fetchPublicationByIdFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },
  },
})

export const {
  createPublicationStart,
  createPublicationSuccess,
  createPublicationFailure,
  fetchPublicationsStart,
  fetchPublicationsSuccess,
  fetchPublicationsFailure,
  fetchPublicationByIdStart,
  fetchPublicationByIdSuccess,
  fetchPublicationByIdFailure,
} = publicationsSlice.actions

export default publicationsSlice.reducer

// Thunk para obtener publicaciones con paginación y filtros
export const fetchPublications = (
  filters: PaginationDTO<any> = { data: {} },
  append = false
) => async (dispatch: any) => {
  dispatch(fetchPublicationsStart())

  try {
    const response = await Promise.resolve(publicationService.getAllPublications(filters))
    dispatch(
      fetchPublicationsSuccess({
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
    const message = error instanceof Error ? error.message : "Failed to load publications"
    dispatch(fetchPublicationsFailure(message))
  }
}

// Thunk para obtener una publicación individual
export const fetchPublicationById = (id: string) => async (dispatch: any) => {
  dispatch(fetchPublicationByIdStart())

  try {
    const publication = await Promise.resolve(publicationService.getPublicationById(id))
    dispatch(fetchPublicationByIdSuccess(publication))
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load publication"
    dispatch(fetchPublicationByIdFailure(message))
  }
}

export const createPublication =
  (data: CreatePublicationDTO) => async (dispatch: any) => {
    dispatch(createPublicationStart())

    try {
      const createdPublication = await Promise.resolve(publicationService.createPublication(data))
      dispatch(createPublicationSuccess(createdPublication))
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to create card"
      dispatch(createPublicationFailure(message))
    }
  }
