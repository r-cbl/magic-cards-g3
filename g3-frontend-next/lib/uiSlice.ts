import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface OfferTabsState {
  mainTab: "sent" | "received"
  sentStatusTab: "all" | "pending" | "accepted" | "rejected"
  receivedStatusTab: "all" | "pending" | "accepted" | "rejected"
}

interface UIState {
  offerTabs: OfferTabsState
}

const initialState: UIState = {
  offerTabs: {
    mainTab: "sent",
    sentStatusTab: "all",
    receivedStatusTab: "all",
  },
}

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setOfferMainTab: (state, action: PayloadAction<"sent" | "received">) => {
      state.offerTabs.mainTab = action.payload
    },
    setSentStatusTab: (state, action: PayloadAction<"all" | "pending" | "accepted" | "rejected">) => {
      state.offerTabs.sentStatusTab = action.payload
    },
    setReceivedStatusTab: (state, action: PayloadAction<"all" | "pending" | "accepted" | "rejected">) => {
      state.offerTabs.receivedStatusTab = action.payload
    },
  },
})

export const { setOfferMainTab, setSentStatusTab, setReceivedStatusTab } = uiSlice.actions

export default uiSlice.reducer
