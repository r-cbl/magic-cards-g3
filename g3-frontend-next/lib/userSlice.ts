import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { UserResponseDTO, UpdateUserDTO } from "@/types/user"

interface UserState {
  currentUser: UserResponseDTO | null
  isLoading: boolean
  error: string | null
  profileForm: {
    name: string
    lastName: string
    email: string
    password?: string
    confirmPassword?: string
    nameError?: string
    emailError?: string
    lastNameError?: string
    passwordError?: string
    confirmPasswordError?: string
  }
}

const initialState: UserState = {
  currentUser: null,
  isLoading: false,
  error: null,
  profileForm: {
    name: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    nameError: "",
    emailError: "",
    lastNameError: "",
    passwordError: "",
    confirmPasswordError: "",
  },
}

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true
      state.error = null
    },
    loginSuccess: (state, action: PayloadAction<UserResponseDTO>) => {
      localStorage.setItem("user", JSON.stringify(action.payload))
      state.currentUser = action.payload
      state.isLoading = false
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },
    logout: (state) => {
      localStorage.removeItem("user")
      state.currentUser = null
    },
    updateUserProfileStart: (state) => {
      state.isLoading = true
      state.error = null
    },
    updateUserProfileSuccess: (state, action: PayloadAction<UserResponseDTO>) => {
      localStorage.setItem("user", JSON.stringify(action.payload))
      state.currentUser = action.payload
      state.isLoading = false
    },
    updateUserProfileFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },
    setProfileField: (state, action: PayloadAction<{ field: string; value: string }>) => {
      const { field, value } = action.payload
      state.profileForm[field as keyof typeof state.profileForm] = value
    },
  },
})

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  updateUserProfileStart,
  updateUserProfileSuccess,
  updateUserProfileFailure,
  setProfileField,
} = userSlice.actions

export const updateUserProfile =
  ({ userId, userData }: { userId: string; userData: UpdateUserDTO }) =>
  async (dispatch: any) => {
    dispatch(updateUserProfileStart())
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      const updatedUser = {
        id: userId,
        name: userData.name || "Test User",
        lastName: userData.lastName || "",
        email: userData.email || "test@example.com",
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      dispatch(updateUserProfileSuccess(updatedUser as UserResponseDTO))
    } catch (error: any) {
      dispatch(updateUserProfileFailure(error.message))
    }
  }

export default userSlice.reducer
