import { Router, Request, Response } from 'express';
import { AuthController } from '../controllers/AuthController';
import { AuthService } from '../../application/services/AuthService';
import { UserRepository } from '../../domain/repositories/UserRepository';
import { InMemoryUserRepository } from '../../infrastructure/repositories/InMemoryUserRepository';
import { JwtService } from '../../infrastructure/auth/jwt.service';
import { AuthMiddleware } from '../middleware/auth.middleware';

// Create dependencies
const userRepository: UserRepository = new InMemoryUserRepository();
const jwtService = new JwtService();
const authService = new AuthService(userRepository, jwtService);
const authController = new AuthController(authService);
const authMiddleware = new AuthMiddleware(jwtService);

// Create router
const authRouter = Router();

// Define routes
authRouter.post('/register', (req: Request, res: Response) => authController.register(req, res));
authRouter.post('/login', (req: Request, res: Response) => authController.login(req, res));
authRouter.get('/me', authMiddleware.authenticate, (req: Request, res: Response) => authController.getCurrentUser(req, res));

export default authRouter; 