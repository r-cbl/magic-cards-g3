import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { CardResponseDTO } from "@/types/card"
import type { GameResponseDTO } from "@/types/game"
import { cardService } from "@/services/card-service"
import { useAppSelector } from "@/lib/hooks"

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
  cards: [],
  userCards: [],
  selectedCard: null,
  games: [],
  cardBases: [],
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

export const fetchCards = () => (dispatch: any) => {
  dispatch(fetchCardsStart());
  Promise.resolve(cardService.getAllCards())
    .then((cards: CardResponseDTO[]) => dispatch(fetchCardsSuccess(cards)))
    .catch((error: unknown) => {
      const message = error instanceof Error ? error.message : "Failed to load cards";
      dispatch(fetchCardsFailure(message));
    });
}

export const fetchCardById = (cardId: string) => (dispatch: any) => {
  dispatch(fetchCardByIdStart());
  Promise.resolve(cardService.getCardById(cardId))
    .then((card: CardResponseDTO) => dispatch(fetchCardByIdSuccess(card)))
    .catch((error: unknown) => {
      const message = error instanceof Error ? error.message : "Failed to load card details";
      dispatch(fetchCardByIdFailure(message));
    });
};

