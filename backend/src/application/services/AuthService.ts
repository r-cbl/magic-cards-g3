import bcrypt from 'bcrypt';
import { User } from '../../domain/entities/User';
import { UserRepository } from '../../domain/repositories/UserRepository';
import { JwtService, TokenResponse } from '../../infrastructure/auth/jwt.service';
import { CreateUserDTO } from '../dtos/UserDTO';

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
    private readonly jwtService: JwtService
  ) {}

  /**
   * Register a new user
   */
  public async register(userData: CreateUserDTO): Promise<AuthResponseDTO> {
    const existingUser = await this.userRepository.findByEmail(userData.email);
    
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await this.hashPassword(userData.password);

    const user = new User({
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(user);
    const tokens = this.jwtService.generateTokens(savedUser);

    await statisticsRepository.increment(
      new Statistic(StatisticType.USERS_REGISTERED, new Date(), 1)
    );

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
    const user = await this.userRepository.findByEmail(credentials.email);
    
    if (!user) {
      throw new Error('Invalid credentials');
    }

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
   * Hash a password
   */
  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  /**
   * Compare passwords
   */
  private async comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
} 