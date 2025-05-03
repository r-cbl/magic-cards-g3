"use client"

import { useEffect } from "react"
import { Provider } from "react-redux"
import { store } from "@/lib/store"
import { restoreSession } from "@/lib/userSlice" // Ajustá el path

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const user = localStorage.getItem("user")
    const tokens = localStorage.getItem("tokens")

    if (user && tokens) {
      const parsedUser = JSON.parse(user)
      const parsedTokens = JSON.parse(tokens)

      // Restaurar en Redux
      store.dispatch(restoreSession(parsedUser))

    }
  }, [])

  return <Provider store={store}>{children}</Provider>
}
