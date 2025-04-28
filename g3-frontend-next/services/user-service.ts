import { api } from "@/lib/api-client"
import type { CreateUserDTO, UpdateUserDTO, UserResponseDTO } from "@/types/user"

export const userService = {
  login: async (email: string, password: string) => {
    return api.post<{ user: UserResponseDTO; token: string }>("/auth/login", { email, password })
  },

  signup: async (userData: CreateUserDTO) => {
    return api.post<{ user: UserResponseDTO; token: string }>("/auth/signup", userData)
  },

  getCurrentUser: async () => {
    return api.get<UserResponseDTO>("/users/me")
  },

  updateProfile: async (userId: string, userData: UpdateUserDTO) => {
    return api.put<UserResponseDTO>(`/users/${userId}`, userData)
  },
}
