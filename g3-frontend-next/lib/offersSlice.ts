import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { type OfferFilterDTO, type OfferResponseDTO, type CreateOfferDTO, type OfferUpdatedDTO, StatusOffer} from "@/types/offer"
import type { PaginatedResponseDTO, PaginationDTO } from "@/types/pagination"
import { offerService } from "@/services/offer-service"
import Promise from "bluebird"

interface OffersState {
  receivedOffers: OfferResponseDTO[]
  ownedOffers: OfferResponseDTO[]
  selectedOffer: OfferResponseDTO | null
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
  receivedOffers: [],
  ownedOffers: [],
  selectedOffer: null,
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
    createofferStart: (state) => {
      state.isLoading = true
      state.error = null
    },
    createofferSuccess: (state, action: PayloadAction<OfferResponseDTO>) => {
      if (action.payload.id) {
        state.ownedOffers.push(action.payload)
      }
      state.isLoading = false
      state.error = null
    },
    createofferFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },
    fetchOwnedOffersStart: (state) => {
      state.isLoading = true
      state.error = null
    },
    fetchOwnedOffersSuccess: (
      state,
      action: PayloadAction<{ data: OfferResponseDTO[]; pagination: Omit<PaginatedResponseDTO<any>, "data">; append: boolean }>
    ) => {
      const { data, pagination, append } = action.payload
      state.ownedOffers = append ? [...state.ownedOffers, ...data] : data
      state.pagination = {
        total: pagination.total,
        offset: pagination.offset,
        limit: pagination.limit,
        hasMore: pagination.hasMore,
      }
      state.isLoading = false
    },
    
    fetchOwnedOffersFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },
    fetchOffersStart: (state) => {
      state.isLoading = true
      state.error = null
    },
    fetchOffersFailure: (state, action: PayloadAction<string>) => {
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
      state.ownedOffers.push(action.payload)
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
        offer.status = status as any
      }
      state.isLoading = false
    },
    updateOfferStatusFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },
    fetchOfferByIdStart: (state) => {
      state.isLoading = true
      state.error = null
    },
    fetchOfferByIdSuccess: (state, action: PayloadAction<OfferResponseDTO>) => {
      state.selectedOffer = action.payload
      state.isLoading = false
    },
    fetchOfferByIdFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },
  },
})

export const {
  fetchOfferByIdStart,
  fetchOfferByIdSuccess,
  fetchOfferByIdFailure,
  fetchOffersStart,
  fetchOffersFailure,
  fetchOwnedOffersStart,
  fetchOwnedOffersSuccess,
  fetchOwnedOffersFailure,
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


export const updateOffer = (
  offerId: string,
  updateDTO: OfferUpdatedDTO 
) => async (dispatch :any) =>{
  dispatch(updateOfferStatusStart())
  try {
    const response = await Promise.resolve(offerService.updateOfferStatus(offerId, updateDTO))
    dispatch(
      updateOfferStatusSuccess(response)
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load user offers"
    dispatch(updateOfferStatusFailure(message))
  }
}

export const rejectOffer = (
  offerId:string,
  userId:string,
  publicationId:string
) => async (dispatch :any) =>{
  const updateData:OfferUpdatedDTO= {
    userId: userId,
    statusOffer: "rejected",
    publicationId: publicationId
  }
  dispatch(updateOffer(offerId, updateData))
}


export const acceptOffer = (
  offerId:string,
  userId:string,
  publicationId:string
) => async (dispatch :any) =>{
  const updateData:OfferUpdatedDTO= {
    userId: userId,
    statusOffer: "accepted",
    publicationId: publicationId
  }
  dispatch(updateOffer(offerId, updateData))
}

export const fetchOwnedOffers = (
  userId:string,
  filters: PaginationDTO<OfferFilterDTO> = { data: {} },
  append = false
) => async (dispatch: any) => {
  dispatch(fetchOwnedOffersStart())
  try {
    filters.data.ownerId = userId
    const response = await Promise.resolve(offerService.getOffers(filters))
    dispatch(
      fetchOwnedOffersSuccess({
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
    dispatch(fetchOwnedOffersFailure(message))
  }
}

export const fetchRecievedOffers = (
  userId:string,
  filters: PaginationDTO<OfferFilterDTO> = { data: {} },
  append = false
) => async (dispatch: any) => {
  dispatch(fetchReceivedOffersStart())
  try {
    filters.data.userId = userId
    const response = await Promise.resolve(offerService.getOffers(filters))
    dispatch(
      fetchReceivedOffersSuccess({
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
    dispatch(fetchReceivedOffersFailure(message))
  }
}

export const fetchOffers = (userId: string) => async (dispatch: any) => {
  dispatch(fetchOffersStart());
  try {
    const [received, owned] = await Promise.all([
      dispatch(fetchRecievedOffers(userId)),
      dispatch(fetchOwnedOffers(userId)),
    ]);
  } catch (error) {
    const message = error instanceof Error
      ? error.message
      : "Failed to load user offers";
    dispatch(fetchOffersFailure(message));
  }
};

export const fetchOfferById = (id: string) => async (dispatch: any) => {
  dispatch(fetchOfferByIdStart())

  try {
    const offer = await Promise.resolve(offerService.getOfferById(id))
    dispatch(fetchOfferByIdSuccess(offer))
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load Offer"
    dispatch(fetchOfferByIdFailure(message))
  }
}

export const createOffer =
  (data: CreateOfferDTO) => async (dispatch: any) => {
    dispatch(createOfferStart())

    try {
      const createdoffer = await Promise.resolve(offerService.createOffer(data))
      dispatch(createOfferSuccess(createdoffer))
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to create Offer"
      dispatch(createOfferFailure(message))
    }
  }

 
