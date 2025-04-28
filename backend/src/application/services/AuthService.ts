import bcrypt from 'bcrypt';
import { User } from '../../domain/entities/User';
import { UserRepository } from '../../domain/repositories/UserRepository';
import { JwtService, TokenResponse } from '../../infrastructure/auth/jwt.service';
import { CreateUserDTO } from '../dtos/UserDTO';
import { UserService } from './UserService';

interface LoginDTO {
  email: string;
  password: string;
}

interface AuthResponseDTO {
  user: {
    id: string;
    name: string;
    email: string;
  };
  tokens: TokenResponse;
}

export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly userService: UserService
  ) {}

  /**
   * Register a new user
   */
  public async register(userData: CreateUserDTO): Promise<AuthResponseDTO> {
    
    const savedUser = await this.userService.createUser(userData);

    const tokens = this.jwtService.generateTokens(savedUser);

    return {
      user: {
        id: savedUser.getId(),
        name: savedUser.getName(),
        email: savedUser.getEmail(),
      },
      tokens,
    };
  }

  /**
   * Login a user
   */
  public async login(credentials: LoginDTO): Promise<AuthResponseDTO> {
    
    const user = await this.userService.getUser(credentials.email);

    const isPasswordValid = await user.isPasswordValid(
      credentials.password,
      this.comparePasswords.bind(this)
    );

    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const tokens = this.jwtService.generateTokens(user);

    return {
      user: {
        id: user.getId(),
        name: user.getName(),
        email: user.getEmail(),
      },
      tokens,
    };
  }

  /**
   * Compare passwords
   */
  private async comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
} 