import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { StatisticType, type RangeStatisticDTO } from "@/types/statistic"
import { statisticsService } from "@/services/statistics-service"
import Promise from "bluebird"

interface StatisticData {
  date: string
  value: number
}

interface StatisticsState {
  statistics: Record<StatisticType, StatisticData[]>
  isLoading: boolean
  error: string | null
  selectedType: StatisticType | null
}

const initialState: StatisticsState = {
  statistics: {
    [StatisticType.USERS_REGISTERED]: [],
    [StatisticType.CARDS_TOTAL]: [],
    [StatisticType.OFFERS_TOTAL]: [],
    [StatisticType.PUBLICATIONS_TOTAL]: [],
    [StatisticType.OFFERS_ACCEPTED]: [],
    [StatisticType.OFFERS_REJECTED]: [],
  },
  isLoading: false,
  error: null,
  selectedType: null,
}

export const statisticSlice = createSlice({
  name: "statistics",
  initialState,
  reducers: {
    fetchStatisticsStart: (state) => {
      state.isLoading = true
      state.error = null
    },
    fetchStatisticsSuccess: (
      state,
      action: PayloadAction<{ type: StatisticType; data: StatisticData[] }>
    ) => {
      const { type, data } = action.payload
      state.statistics[type] = data
      state.selectedType = type
      state.isLoading = false
    },
    fetchStatisticsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },
    setSelectedType: (state, action: PayloadAction<StatisticType>) => {
      state.selectedType = action.payload
    },
  },
})

export const {
  fetchStatisticsStart,
  fetchStatisticsSuccess,
  fetchStatisticsFailure,
  setSelectedType,
} = statisticSlice.actions

export default statisticSlice.reducer

// Thunks
export const fetchStatistics = (range: RangeStatisticDTO) => async (dispatch: any) => {
  dispatch(fetchStatisticsStart())

  try {
    const data = await Promise.resolve(statisticsService.getStatistics(range))
    dispatch(
      fetchStatisticsSuccess({
        type: range.type,
        data,
      })
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load statistics"
    dispatch(fetchStatisticsFailure(message))
  }
}
