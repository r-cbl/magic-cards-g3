import { Request, Response, NextFunction } from 'express';
import { JwtService } from '../../infrastructure/auth/jwt.service';
import logger from '../../infrastructure/logging/logger';

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
      };
    }
  }
}

export class AuthMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  /**
   * Authenticate JWT token middleware
   */
  public authenticate = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const authHeader = req.headers.authorization;
      
      console.log('Authorization Header:', authHeader); 

      if (!authHeader) {
        res.status(401).json({ error: 'Authorization header is missing' });
        return;
      }

      const token = this.jwtService.extractTokenFromHeader(authHeader);
      const decoded = this.jwtService.verifyToken(token);
      
      // Attach user data to request
      req.user = {
        userId: decoded.userId,
        email: decoded.email,
      };
      
      next();
    } catch (error) {
      logger.error(`Authentication error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      res.status(401).json({ error: 'Authentication failed' });
    }
  };

  /**
   * Optional authentication - doesn't fail if no token but attaches user if token exists
   */
  public optionalAuth = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const authHeader = req.headers.authorization;
      
      if (authHeader) {
        const token = this.jwtService.extractTokenFromHeader(authHeader);
        const decoded = this.jwtService.verifyToken(token);
        
        req.user = {
          userId: decoded.userId,
          email: decoded.email,
        };
      }
      
      next();
    } catch (error) {
      // Just continue without authentication
      next();
    }
  };
} 