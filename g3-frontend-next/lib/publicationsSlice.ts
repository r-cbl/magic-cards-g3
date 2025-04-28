import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { PublicationResponseDTO } from "@/types/publication"

// Mock data
const mockPublications: PublicationResponseDTO[] = [
  {
    id: "1",
    name: "Pikachu for trade",
    cardId: "1",
    valueMoney: 0,
    cardExchangeIds: ["cb2", "cb3"],
    cardBase: {
      Id: "cb1",
      Name: "Pikachu",
    },
    game: {
      Id: "1",
      Name: "Pokemon Red/Blue",
    },
    owner: {
      ownerId: "user1",
      ownerName: "Ash Ketchum",
    },
    offers: [],
    createdAt: new Date(),
  },
  {
    id: "2",
    name: "Charizard for sale",
    cardId: "2",
    valueMoney: 50,
    cardExchangeIds: [],
    cardBase: {
      Id: "cb2",
      Name: "Charizard",
    },
    game: {
      Id: "1",
      Name: "Pokemon Red/Blue",
    },
    owner: {
      ownerId: "user2",
      ownerName: "Gary Oak",
    },
    offers: [
      {
        offerId: "offer1",
        moneyOffer: 45,
        statusOffer: "PENDING",
        cardExchangeIds: [],
      },
    ],
    createdAt: new Date(),
  },
  {
    id: "3",
    name: "Mewtwo - looking for Lugia",
    cardId: "5",
    valueMoney: 0,
    cardExchangeIds: ["cb6"],
    cardBase: {
      Id: "cb5",
      Name: "Mewtwo",
    },
    game: {
      Id: "2",
      Name: "Pokemon Gold/Silver",
    },
    owner: {
      ownerId: "user4",
      ownerName: "Professor Oak",
    },
    offers: [],
    createdAt: new Date(),
  },
]

interface PublicationsState {
  publications: PublicationResponseDTO[]
  userPublications: PublicationResponseDTO[]
  selectedPublication: PublicationResponseDTO | null
  isLoading: boolean
  error: string | null
}

const initialState: PublicationsState = {
  publications: mockPublications,
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
