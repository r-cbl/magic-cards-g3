import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { OfferResponseDTO } from "@/types/offer"
import { offerService } from "@/services/offer-service"
import Promise from "bluebird"

interface OffersState {
  userOffers: OfferResponseDTO[]
  receivedOffers: OfferResponseDTO[]
  isLoading: boolean
  error: string | null
}

const initialState: OffersState = {
  userOffers: [],
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

export const fetchUserOffers = (userId: string) => (dispatch: any) => {
  dispatch(fetchUserOffersStart());
  Promise.resolve(offerService.getUserOffers(userId))
    .then((offers: OfferResponseDTO[]) => dispatch(fetchUserOffersSuccess(offers)))
    .catch((error: unknown) => {
      const message = error instanceof Error ? error.message : "Failed to load offers";
      dispatch(fetchUserOffersFailure(message));
    });
};

export const fetchReceivedOffers = (userId: string) => (dispatch: any) => {
  dispatch(fetchReceivedOffersStart());
  Promise.resolve(offerService.getReceivedOffers(userId))
    .then((offers: OfferResponseDTO[]) => dispatch(fetchReceivedOffersSuccess(offers)))
    .catch((error: unknown) => {
      const message = error instanceof Error ? error.message : "Failed to load received offers";
      dispatch(fetchReceivedOffersFailure(message));
    });
};

export const createOffer = (data: any) => (dispatch: any) => {
  dispatch(createOfferStart());
  Promise.resolve(offerService.createOffer(data))
    .then((offer: OfferResponseDTO) => dispatch(createOfferSuccess(offer)))
    .catch((error: unknown) => {
      const message = error instanceof Error ? error.message : "Failed to create offer";
      dispatch(createOfferFailure(message));
    });
};
