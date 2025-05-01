import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { PublicationResponseDTO } from "@/types/publication"
import { publicationService } from "@/services/publication-service"
import Promise from "bluebird"


interface PublicationsState {
  publications: PublicationResponseDTO[]
  userPublications: PublicationResponseDTO[]
  selectedPublication: PublicationResponseDTO | null
  isLoading: boolean
  error: string | null
}

const initialState: PublicationsState = {
  publications: [],
  userPublications: [],
  selectedPublication: null,
  isLoading: false,
  error: null,
}

export const publicationsSlice = createSlice({
  name: "publications",
  initialState,
  reducers: {
    fetchPublicationsStart: (state) => {
      state.isLoading = true
      state.error = null
    },
    fetchPublicationsSuccess: (state, action: PayloadAction<PublicationResponseDTO[]>) => {
      state.publications = action.payload
      state.isLoading = false
    },
    fetchPublicationsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },
    fetchUserPublicationsStart: (state) => {
      state.isLoading = true
      state.error = null
    },
    fetchUserPublicationsSuccess: (state, action: PayloadAction<PublicationResponseDTO[]>) => {
      state.userPublications = action.payload
      state.isLoading = false
    },
    fetchUserPublicationsFailure: (state, action: PayloadAction<string>) => {
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
    createPublicationStart: (state) => {
      state.isLoading = true
      state.error = null
    },
    createPublicationSuccess: (state, action: PayloadAction<PublicationResponseDTO>) => {
      state.publications.push(action.payload)
      state.userPublications.push(action.payload)
      state.isLoading = false
    },
    createPublicationFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },
  },
})

export const {
  fetchPublicationsStart,
  fetchPublicationsSuccess,
  fetchPublicationsFailure,
  fetchUserPublicationsStart,
  fetchUserPublicationsSuccess,
  fetchUserPublicationsFailure,
  fetchPublicationByIdStart,
  fetchPublicationByIdSuccess,
  fetchPublicationByIdFailure,
  createPublicationStart,
  createPublicationSuccess,
  createPublicationFailure,
} = publicationsSlice.actions

export default publicationsSlice.reducer

export const fetchPublications = () => (dispatch: any) => {
  dispatch(fetchPublicationsStart());
  Promise.resolve(publicationService.getAllPublications())
    .then((publications: PublicationResponseDTO[]) => dispatch(fetchPublicationsSuccess(publications)))
    .catch((error: unknown) => {
      const message = error instanceof Error ? error.message : "Failed to load publications";
      dispatch(fetchPublicationsFailure(message));
    });
};

export const fetchUserPublications = (userId: string) => (dispatch: any) => {
  dispatch(fetchUserPublicationsStart());
  Promise.resolve(publicationService.getUserPublications(userId))
    .then((publications: PublicationResponseDTO[]) => dispatch(fetchUserPublicationsSuccess(publications)))
    .catch((error: unknown) => {
      const message = error instanceof Error ? error.message : "Failed to load your publications";
      dispatch(fetchUserPublicationsFailure(message));
    });
};

export const fetchPublicationById = (id: string) => (dispatch: any) => {
  dispatch(fetchPublicationByIdStart());
  Promise.resolve(publicationService.getPublicationById(id))
    .then((publication: PublicationResponseDTO) => dispatch(fetchPublicationByIdSuccess(publication)))
    .catch((error: unknown) => {
      const message = error instanceof Error ? error.message : "Failed to load publication";
      dispatch(fetchPublicationByIdFailure(message));
    });
};

export const createPublication = (data: any) => (dispatch: any) => {
  dispatch(createPublicationStart());
  Promise.resolve(publicationService.createPublication(data))
    .then((publication: PublicationResponseDTO) => dispatch(createPublicationSuccess(publication)))
    .catch((error: unknown) => {
      const message = error instanceof Error ? error.message : "Failed to create publication";
      dispatch(createPublicationFailure(message));
    });
};
