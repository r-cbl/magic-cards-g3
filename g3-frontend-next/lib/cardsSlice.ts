import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { CardResponseDTO } from "@/types/card"
import type { GameResponseDTO } from "@/types/game"

// Mock data
const mockCards: CardResponseDTO[] = [
  {
    id: "1",
    urlImage: "/placeholder.svg?height=300&width=200",
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
    createdAt: new Date(),
  },
  {
    id: "2",
    urlImage: "/placeholder.svg?height=300&width=200",
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
    createdAt: new Date(),
  },
  {
    id: "3",
    urlImage: "/placeholder.svg?height=300&width=200",
    cardBase: {
      Id: "cb3",
      Name: "Bulbasaur",
    },
    game: {
      Id: "1",
      Name: "Pokemon Red/Blue",
    },
    owner: {
      ownerId: "user1",
      ownerName: "Ash Ketchum",
    },
    createdAt: new Date(),
  },
  {
    id: "4",
    urlImage: "/placeholder.svg?height=300&width=200",
    cardBase: {
      Id: "cb4",
      Name: "Squirtle",
    },
    game: {
      Id: "1",
      Name: "Pokemon Red/Blue",
    },
    owner: {
      ownerId: "user3",
      ownerName: "Misty",
    },
    createdAt: new Date(),
  },
  {
    id: "5",
    urlImage: "/placeholder.svg?height=300&width=200",
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
    createdAt: new Date(),
  },
]

// Mock games
const mockGames: GameResponseDTO[] = [
  { id: "1", name: "Pokemon Red/Blue", createdAt: new Date(), updatedAt: new Date() },
  { id: "2", name: "Pokemon Gold/Silver", createdAt: new Date(), updatedAt: new Date() },
  { id: "3", name: "Pokemon Ruby/Sapphire", createdAt: new Date(), updatedAt: new Date() },
]

// Mock card bases
const mockCardBases = [
  { id: "cb1", name: "Pikachu", gameId: "1" },
  { id: "cb2", name: "Charizard", gameId: "1" },
  { id: "cb3", name: "Bulbasaur", gameId: "1" },
  { id: "cb4", name: "Squirtle", gameId: "1" },
  { id: "cb5", name: "Mewtwo", gameId: "2" },
  { id: "cb6", name: "Lugia", gameId: "2" },
]

interface CardsState {
  cards: CardResponseDTO[]
  userCards: CardResponseDTO[]
  selectedCard: CardResponseDTO | null
  games: GameResponseDTO[]
  cardBases: { id: string; name: string; gameId: string }[]
  isLoading: boolean
  error: string | null
}

const initialState: CardsState = {
  cards: mockCards,
  userCards: [],
  selectedCard: null,
  games: mockGames,
  cardBases: mockCardBases,
  isLoading: false,
  error: null,
}

export const cardsSlice = createSlice({
  name: "cards",
  initialState,
  reducers: {
    fetchCardsStart: (state) => {
      state.isLoading = true
      state.error = null
    },
    fetchCardsSuccess: (state, action: PayloadAction<CardResponseDTO[]>) => {
      state.cards = action.payload
      state.isLoading = false
    },
    fetchCardsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },
    fetchUserCardsStart: (state) => {
      state.isLoading = true
      state.error = null
    },
    fetchUserCardsSuccess: (state, action: PayloadAction<CardResponseDTO[]>) => {
      state.userCards = action.payload
      state.isLoading = false
    },
    fetchUserCardsFailure: (state, action: PayloadAction<string>) => {
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
    createCardStart: (state) => {
      state.isLoading = true
      state.error = null
    },
    createCardSuccess: (state, action: PayloadAction<CardResponseDTO>) => {
      if (action.payload.id) {
        // Only add if it's a real card, not just clearing loading state
        state.cards.push(action.payload)
        state.userCards.push(action.payload)
      }
      state.isLoading = false
      state.error = null
    },
    createCardFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },
    // New actions for games and card bases
    createGameStart: (state) => {
      state.isLoading = true
      state.error = null
    },
    createGameSuccess: (state, action: PayloadAction<GameResponseDTO>) => {
      state.games.push(action.payload)
      state.isLoading = false
      state.error = null
    },
    createGameFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },
    createCardBaseStart: (state) => {
      state.isLoading = true
      state.error = null
    },
    createCardBaseSuccess: (state, action: PayloadAction<{ id: string; name: string; gameId: string }>) => {
      state.cardBases.push(action.payload)
      state.isLoading = false
      state.error = null
    },
    createCardBaseFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },
  },
})

export const {
  fetchCardsStart,
  fetchCardsSuccess,
  fetchCardsFailure,
  fetchUserCardsStart,
  fetchUserCardsSuccess,
  fetchUserCardsFailure,
  fetchCardByIdStart,
  fetchCardByIdSuccess,
  fetchCardByIdFailure,
  createCardStart,
  createCardSuccess,
  createCardFailure,
  createGameStart,
  createGameSuccess,
  createGameFailure,
  createCardBaseStart,
  createCardBaseSuccess,
  createCardBaseFailure,
} = cardsSlice.actions

export default cardsSlice.reducer
