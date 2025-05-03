import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { CreateGameDTO, GameFilterDTO, GameResponseDTO } from "@/types/game"
import { gameService } from "@/services/game-service"
import Promise from "bluebird"
import type { PaginatedResponseDTO, PaginationDTO } from "@/types/pagination"

interface GamesState {
  games: GameResponseDTO[]
  selectedGame: GameResponseDTO | null
  isLoading: boolean
  error: string | null
  pagination: {
    total: number
    offset: number
    limit: number
    hasMore: boolean
  }
}

const initialState: GamesState = {
  games: [],
  selectedGame: null,
  isLoading: false,
  error: null,
  pagination: {
    total: 0,
    offset: 0,
    limit: 10,
    hasMore: false,
  },
}

export const gameSlice = createSlice({
  name: "games",
  initialState,
  reducers: {
    createGameStart: (state) => {
        state.isLoading = true
        state.error = null
      },
    createGameSuccess: (state, action: PayloadAction<GameResponseDTO>) => {
        if (action.payload.id) {
            state.games.push(action.payload)
        }
        state.isLoading = false
        state.error = null
    },
    createGameFailure: (state, action: PayloadAction<string>) => {
    state.isLoading = false
    state.error = action.payload
    },
    fetchGamesStart: (state) => {
      state.isLoading = true
      state.error = null
    },
    fetchGamesSuccess: (
      state,
      action: PayloadAction<{ data: GameResponseDTO[]; pagination: Omit<PaginatedResponseDTO<any>, "data">; append: boolean }>
    ) => {
      const { data, pagination, append } = action.payload
      state.games = append ? [...state.games, ...data] : data
      state.pagination = {
        total: pagination.total,
        offset: pagination.offset,
        limit: pagination.limit,
        hasMore: pagination.hasMore,
      }
      state.isLoading = false
    },
    fetchGamesFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },
    fetchGameByIdStart: (state) => {
      state.isLoading = true
      state.error = null
    },
    fetchGameByIdSuccess: (state, action: PayloadAction<GameResponseDTO>) => {
      state.selectedGame = action.payload
      state.isLoading = false
    },
    fetchGameByIdFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },
  },
})

export const {
    createGameStart,
    createGameSuccess,
    createGameFailure,
    fetchGamesStart,
    fetchGamesSuccess,
    fetchGamesFailure,
    fetchGameByIdStart,
    fetchGameByIdSuccess,
    fetchGameByIdFailure,
} = gameSlice.actions

export default gameSlice.reducer

// Thunks
export const createGame = (data: CreateGameDTO) => async (dispatch: any) => {
  dispatch(createGameStart())

  try {
    const newGame = await gameService.createGame(data)
    dispatch(createGameSuccess(newGame))
    return newGame
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error al crear el juego"
    dispatch(createGameFailure(message))
    throw error // opcional, útil si querés capturarlo desde el componente
  }
}



export const fetchGames = (filters: PaginationDTO<GameFilterDTO> = { data: {} }, append = false) => async (dispatch: any) => {
  dispatch(fetchGamesStart())

  try {
    const response = await Promise.resolve(gameService.getAllGames(filters))
    dispatch(
      fetchGamesSuccess({
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
    const message = error instanceof Error ? error.message : "Failed to load games"
    dispatch(fetchGamesFailure(message))
  }
}

export const fetchGameById = (id: string) => async (dispatch: any) => {
  dispatch(fetchGameByIdStart())

  try {
    const game = await Promise.resolve(gameService.getGameById(id))
    dispatch(fetchGameByIdSuccess(game))
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load game"
    dispatch(fetchGameByIdFailure(message))
  }
}
