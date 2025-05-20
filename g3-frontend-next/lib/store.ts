import { configureStore } from "@reduxjs/toolkit"
import userReducer from "./userSlice"
import cardsReducer from "./cardsSlice"
import publicationsReducer from "./publicationsSlice"
import cardBaseReducer from "./cardBaseSlice"
import gameReducer from "./gameSlice"
import offersReducer from "./offersSlice"
import uiReducer from "./uiSlice"
import statisticsReducer from "./statisticSlice"

export const store = configureStore({
  reducer: {
    user: userReducer,
    cards: cardsReducer,
    baseCards: cardBaseReducer,
    game: gameReducer,
    publications: publicationsReducer,
    offers: offersReducer,
    ui: uiReducer,
    statistics: statisticsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
