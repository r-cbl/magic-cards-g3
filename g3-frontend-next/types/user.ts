export interface CreateUserDTO {
  name: string
  lastName?: string
  email: string
  password: string
}

export interface UpdateUserDTO {
  name?: string
  lastName?: string
  email?: string
  password?: string
}

export interface UserResponseDTO {
  id: string
  name: string
  lastName?: string
  email: string
  createdAt: Date
  updatedAt: Date
}
