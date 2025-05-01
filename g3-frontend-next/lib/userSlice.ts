import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { UserResponseDTO, UpdateUserDTO, CreateUserDTO } from "@/types/user"
import { userService } from "@/services/user-service"
import Promise from "bluebird"

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
  (dispatch: any) => {
    dispatch(updateUserProfileStart())
    Promise.resolve(userService.updateProfile(userId, userData))
      .then((updatedUser: UserResponseDTO) => dispatch(updateUserProfileSuccess(updatedUser)))
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : "Failed to update user"
        dispatch(updateUserProfileFailure(message))
      })
  }

export const loginUser =
  ({ email, password }: { email: string; password: string }) =>
  (dispatch: any) => {
    dispatch(loginStart())
    Promise.resolve(userService.login(email, password))
      .then((response: { user: UserResponseDTO; token: string }) => {
        localStorage.setItem("token", response.token)
        dispatch(loginSuccess(response.user))
      })
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : "Login failed"
        dispatch(loginFailure(message))
      })
  }

export const registerUser =
  (userData: CreateUserDTO) =>
  (dispatch: any) => {
    dispatch(loginStart())
    Promise.resolve(userService.signup(userData))
      .then((response: { user: UserResponseDTO; token: string }) => {
        localStorage.setItem("token", response.token)
        dispatch(loginSuccess(response.user))
      })
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : "Signup failed"
        dispatch(loginFailure(message))
      })
  }

export default userSlice.reducer
