import { configureStore } from "@reduxjs/toolkit"
import userReducer from "./userSlice"
import cardsReducer from "./cardsSlice"
import publicationsReducer from "./publicationsSlice"
import offersReducer from "./offersSlice"
import uiReducer from "./uiSlice"

export const store = configureStore({
  reducer: {
    user: userReducer,
    cards: cardsReducer,
    publications: publicationsReducer,
    offers: offersReducer,
    ui: uiReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
