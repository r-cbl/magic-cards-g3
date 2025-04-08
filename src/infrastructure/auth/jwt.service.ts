import jwt, { SignOptions } from 'jsonwebtoken';
import config from '../config/config';
import { User } from '../../domain/entities/User';

export interface TokenPayload {
  userId: string;
  email: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken?: string;
  expiresIn: string;
}

export class JwtService {
  
  /**
   * Generate access token for a user
   */
  public generateAccessToken(user: User): string {
    const payload: TokenPayload = {
      userId: user.getId(),
      email: user.getEmail(),
    };

    const options: SignOptions = {
      expiresIn: config.jwt.expiresIn as jwt.SignOptions['expiresIn'],
    };

    return jwt.sign(payload, config.jwt.secret, options);
  }

  /**
   * Generate refresh token for a user
   */
  public generateRefreshToken(user: User): string {
    const payload: TokenPayload = {
      userId: user.getId(),
      email: user.getEmail(),
    };

    const options: SignOptions = {
      expiresIn: config.jwt.refreshExpiresIn as jwt.SignOptions['expiresIn'],
    };

    return jwt.sign(payload, config.jwt.secret, options);
  }

  /**
   * Generate both tokens for a user
   */
  public generateTokens(user: User): TokenResponse {
    return {
      accessToken: this.generateAccessToken(user),
      refreshToken: this.generateRefreshToken(user),
      expiresIn: config.jwt.expiresIn,
    };
  }

  /**
   * Verify a token
   */
  public verifyToken(token: string): TokenPayload {
    try {
      const decoded = jwt.verify(token, config.jwt.secret) as TokenPayload;
      return decoded;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  /**
   * Extract token from authorization header
   */
  public extractTokenFromHeader(authHeader: string): string {
    if (!authHeader) {
      throw new Error('Authorization header is missing');
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      throw new Error('Invalid authorization header format');
    }

    return parts[1];
  }
} 