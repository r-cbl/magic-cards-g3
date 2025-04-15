import { User } from '../../domain/entities/User';
import { UserRepository } from '../../domain/repositories/UserRepository';
import { CreateUserDTO, UpdateUserDTO, UserResponseDTO } from '../dtos/UserDTO';

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  public async createUser(userData: CreateUserDTO): Promise<UserResponseDTO> {
    const existingUser = await this.userRepository.findByEmail(userData.email);
    
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const user = new User({
      name: userData.name,
      email: userData.email,
      password: userData.password, // In a real app, password should be hashed
    });

    const savedUser = await this.userRepository.save(user);
    return this.toUserResponseDTO(savedUser);
  }

  public async getUser(id: string): Promise<UserResponseDTO> {
    const user = await this.userRepository.findById(id);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return this.toUserResponseDTO(user);
  }

  public async getAllUsers(): Promise<UserResponseDTO[]> {
    const users = await this.userRepository.findAll();
    return users.map(user => this.toUserResponseDTO(user));
  }

  public async updateUser(id: string, userData: UpdateUserDTO): Promise<UserResponseDTO> {
    const existingUser = await this.getSimpleUser(id);
  
    if (userData.name) {
      existingUser.setName(userData.name);
    }

    if (userData.email) {
      const userWithEmail = await this.userRepository.findByEmail(userData.email);
      if (userWithEmail && userWithEmail.getId() !== id) {
        throw new Error('Email is already in use');
      }
      existingUser.setEmail(userData.email);
    }

    if (userData.password) {
      existingUser.setPassword(userData.password); // In a real app, password should be hashed
    }

    const updatedUser = await this.userRepository.update(existingUser);
    return this.toUserResponseDTO(updatedUser);
  }

  public async deleteUser(id: string): Promise<boolean> {
    await this.getSimpleUser(id);
    return this.userRepository.delete(id);
  }

  private toUserResponseDTO(user: User): UserResponseDTO {
    const userJson = user.toJSON();
    return {
      id: userJson.id!,
      name: userJson.name,
      email: userJson.email,
      createdAt: userJson.createdAt!,
      updatedAt: userJson.updatedAt!,
    };
  }

  public async getSimpleUser(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new Error("User not found");
    return user;
  }
} 