import { Statistic, StatisticType } from '../../domain/entities/Stadistics';
import {  User } from '../../domain/entities/User';
import { UserRepository } from '../../domain/repositories/UserRepository';
import { CreateUserDTO, UpdateUserDTO, UserResponseDTO } from '../dtos/UserDTO';
import { statisticsRepository } from '../../infrastructure/repositories/Container';
import bcrypt from 'bcrypt';
import { UserAlreadyExistsError, UnauthorizedException, UserNotFoundError } from '../../domain/entities/exceptions/exceptions';

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  public async createUser(userData: CreateUserDTO): Promise<User>{
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new UserAlreadyExistsError('User with this email already exists');
    }
    const hashedPassword = await this.hashPassword(userData.password);
  
    const user = new User({
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
    });
  
    const savedUser = await this.userRepository.save(user);
  
    await statisticsRepository.increment(
      new Statistic(StatisticType.USERS_REGISTERED, new Date(), 1)
    );
  
    return savedUser;
  }

  public async createUserByAdmin(userData: CreateUserDTO, adminId?:string): Promise<UserResponseDTO> {

    const adminUser = await this.getSimpleUser(adminId)

    if (!adminUser.isAdmin()) {
      throw new UnauthorizedException('Only administrators can create users');
    }

    const user = await this.createUser(userData)

    return this.toUserResponseDTO(user);
  }
  
  public async getUser(email:string): Promise<User>{
    const user = await this.userRepository.findByEmail(email);
    
    if (!user) {
      throw new UserNotFoundError('User not found by Email');
    }

    return user;
  }

  public async getUserByAdmin(email: string, adminId?:string): Promise<UserResponseDTO> {
    const adminUser = await this.getSimpleUser(adminId)

    if (!adminUser.isAdmin()) {
      throw new UnauthorizedException('Only administrators can create users');
    }

    const user = await this.getUser(email);
    
    return this.toUserResponseDTO(user);
  }


  public async updateUser(toUpdateUserId: string, userData: UpdateUserDTO, userId?:string): Promise<UserResponseDTO> {

    const user = await this.getSimpleUser(userId)

    const existingUser = await this.getSimpleUser(toUpdateUserId);

    if (existingUser.getId() != user.getId() || !user.isAdmin()) {
      throw new UnauthorizedException('Only onceself or admins can update users');
    }
  
    if (userData.name) {
      existingUser.setName(userData.name);
    }

    if (userData.email) {
      const userWithEmail = await this.userRepository.findByEmail(userData.email);
      if (userWithEmail && userWithEmail.getId() !== toUpdateUserId) {
        throw new Error('Email is already in use');
      }
      existingUser.setEmail(userData.email);
    }

    if (userData.password) {
      existingUser.setPassword(await this.hashPassword(userData.password)); 
    }

    const updatedUser = await this.userRepository.update(existingUser);
    return this.toUserResponseDTO(updatedUser);
  }

  public async deleteUser(toDeleteUserId: string, userId?:string): Promise<boolean> {
    await this.getSimpleUser(toDeleteUserId);
    return this.userRepository.delete(toDeleteUserId);
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

  public async getSimpleUser(id?: string): Promise<User> {
    if (!id) throw new UserNotFoundError("User ID is required");
    const user = await this.userRepository.findById(id);
    if (!user) throw new UserNotFoundError("User not found");
    return user;
  }


    private async hashPassword(password: string): Promise<string> {
      const salt = await bcrypt.genSalt(10);
      return bcrypt.hash(password, salt);
    }


} 