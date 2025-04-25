import { Request, Response } from 'express';
import { AuthService } from '../../application/services/AuthService';
import { CreateUserDTO } from '../../application/dtos/UserDTO';
import logger from '../../infrastructure/logging/logger';

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Register a new user
   */
  public async register(req: Request, res: Response): Promise<void> {
    try {
      const userData: CreateUserDTO = req.body;
      
      // Validate input
      if (!userData.email || !userData.password || !userData.name) {
        res.status(400).json({ error: 'Name, email and password are required' });
        return;
      }

      const result = await this.authService.register(userData);
      
      res.status(201).json(result);
    } catch (error) {
      logger.error(`Registration error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      
      if (error instanceof Error && error.message === 'User with this email already exists') {
        res.status(409).json({ error: error.message });
        return;
      }
      
      res.status(500).json({ error: 'Registration failed' });
    }
  }

  /**
   * Login a user
   */
  public async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      
      // Validate input
      if (!email || !password) {
        res.status(400).json({ error: 'Email and password are required' });
        return;
      }

      const result = await this.authService.login({ email, password });
      
      res.status(200).json(result);
    } catch (error) {
      logger.error(`Login error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      
      if (error instanceof Error && error.message === 'Invalid credentials') {
        res.status(401).json({ error: 'Invalid email or password' });
        return;
      }
      
      res.status(500).json({ error: 'Login failed' });
    }
  }

  /**
   * Get the current authenticated user
   */
  public async getCurrentUser(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }
      
      res.status(200).json({
        user: {
          id: req.user.userId,
          email: req.user.email,
        }
      });
    } catch (error) {
      logger.error(`Get current user error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      res.status(500).json({ error: 'Failed to get user information' });
    }
  }
} 